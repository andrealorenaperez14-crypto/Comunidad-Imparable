import bcrypt from 'bcryptjs'
import { randomUUID, randomInt } from 'crypto'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { sendPasswordResetEmail } from '../services/email.js'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número'

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  dni: z.string()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos numéricos')
    .refine(v => { const n = parseInt(v, 10); return n >= 8000000 && n <= 99999999 }, 'El DNI debe estar entre 08000000 y 99999999'),
  password: z.string()
    .min(8, PASSWORD_MSG)
    .regex(/[A-Z]/, PASSWORD_MSG)
    .regex(/[0-9]/, PASSWORD_MSG),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  clientId: z.string().optional()
})

export async function authRoutes(fastify) {
  fastify.post('/login', {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const result = loginSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { email, password } = result.data
    const user = await fastify.prisma.user.findUnique({
      where: { email },
      include: { profile: true, client: true }
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return reply.status(401).send({ error: 'Email o contraseña incorrectos.' })
    }

    await fastify.prisma.profile.update({
      where: { userId: user.id },
      data: { lastLoginAt: new Date() }
    })

    const token = fastify.jwt.sign({
      jti: randomUUID(),
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId
    })

    const refreshToken = fastify.jwt.sign(
      { id: user.id, type: 'refresh' },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET }
    )

    return reply.send({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientId: user.clientId,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        schoolName: user.client?.name
      }
    })
  })

  fastify.post('/register', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const result = registerSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { email, dni, password, firstName, lastName, clientId } = result.data

    const existingEmail = await fastify.prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return reply.status(409).send({ error: 'Ya existe una cuenta con este email.' })
    }

    const existingDni = await fastify.prisma.user.findUnique({ where: { dni } })
    if (existingDni) {
      return reply.status(409).send({ error: 'Ya existe una cuenta con este DNI.' })
    }

    const previousStudent = await fastify.prisma.studentsPrevious.findUnique({ where: { dni } })

    const resolvedClientId = clientId || await getDefaultClientId(fastify)
    const passwordHash = await bcrypt.hash(password, 12)
    const trialDays = 5

    const user = await fastify.prisma.user.create({
      data: {
        email,
        dni,
        passwordHash,
        role: 'STUDENT',
        clientId: resolvedClientId,
        profile: {
          create: { firstName, lastName }
        },
        subscriptions: {
          create: {
            planType: 'TRIAL',
            status: 'TRIAL',
            activeUntil: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
          }
        }
      },
      include: { profile: true }
    })

    const token = fastify.jwt.sign({
      jti: randomUUID(),
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId
    })

    return reply.status(201).send({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientId: user.clientId,
        firstName: user.profile?.firstName,
        isReturning: !!previousStudent
      }
    })
  })

  fastify.post('/logout', { preHandler: requireAuth }, async (request, reply) => {
    const { jti } = request.user
    const { refreshToken } = request.body || {}
    if (fastify.redis) {
      if (jti) {
        await fastify.redis.setex(`bl:${jti}`, 60 * 16, '1')
      }
      // Revocar refresh token para que no pueda generar nuevos access tokens
      if (refreshToken) {
        try {
          const payload = fastify.jwt.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
          })
          const ttl = 60 * 60 * 24 * 7 // 7 días (vida del refresh token)
          await fastify.redis.setex(`bl:rt:${payload.id}:${payload.iat}`, ttl, '1')
        } catch { /* token inválido, ignorar */ }
      }
    }
    return reply.send({ mensaje: 'Sesión cerrada correctamente.' })
  })

  fastify.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body || {}
    if (!refreshToken) return reply.status(400).send({ error: 'Token de refresco requerido.' })

    try {
      const payload = fastify.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      })

      const user = await fastify.prisma.user.findUnique({ where: { id: payload.id } })
      if (!user) return reply.status(401).send({ error: 'Usuario no encontrado.' })

      // Verificar que el refresh token no fue revocado
      if (fastify.redis) {
        const revoked = await fastify.redis.get(`bl:rt:${payload.id}:${payload.iat}`)
        if (revoked) return reply.status(401).send({ error: 'Sesión expirada. Iniciá sesión nuevamente.' })
      }

      const token = fastify.jwt.sign({
        jti: randomUUID(),
        id: user.id,
        email: user.email,
        role: user.role,
        clientId: user.clientId
      })

      return reply.send({ token })
    } catch {
      return reply.status(401).send({ error: 'Token de refresco inválido o expirado.' })
    }
  })

  fastify.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    const user = await fastify.prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        profile: true,
        client: true,
        subscriptions: {
          where: { status: { in: ['ACTIVE', 'TRIAL'] } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) return reply.status(404).send({ error: 'Usuario no encontrado.' })

    return reply.send({
      id: user.id,
      email: user.email,
      dni: user.dni,
      role: user.role,
      clientId: user.clientId,
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
      avatarUrl: user.profile?.avatarUrl,
      lastLoginAt: user.profile?.lastLoginAt,
      schoolName: user.client?.name,
      branding: user.client?.branding,
      subscription: user.subscriptions[0] || null
    })
  })
}

async function getDefaultClientId(fastify) {
  const client = await fastify.prisma.client.findFirst()
  if (!client) throw new Error('No hay clientes configurados en el sistema.')
  return client.id
}

export async function authPasswordRoutes(fastify) {
  const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número'

  function generateTempPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    const nums = '23456789'
    const part1 = Array.from({ length: 3 }, () => chars[randomInt(0, chars.length)]).join('')
    const part2 = Array.from({ length: 4 }, () => nums[randomInt(0, nums.length)]).join('')
    return `${part1}${part2}`
  }

  fastify.post('/forgot-password', {
    config: { rateLimit: { max: 5, timeWindow: '10 minutes' } }
  }, async (request, reply) => {
    const { email } = request.body || {}
    if (!email || typeof email !== 'string') {
      return reply.status(400).send({ error: 'Email requerido.' })
    }

    const user = await fastify.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { profile: true, client: true }
    })

    const ok = { message: 'Si el email existe, recibirás tu contraseña provisoria por mail.' }
    if (!user) return reply.send(ok)

    const tempPassword = generateTempPassword()
    const passwordHash = await bcrypt.hash(tempPassword, 12)

    try {
      await sendPasswordResetEmail({
        email: user.email,
        firstName: user.profile?.firstName || 'Usuario',
        schoolName: user.client?.name || 'Escuela de Asesores',
        otp: tempPassword
      })
    } catch (err) {
      fastify.log.error({ err: err.message, email: user.email }, 'Error enviando email de recuperación')
      return reply.status(500).send({ error: 'No se pudo enviar el email. Revisá tu dirección o intentá más tarde.' })
    }

    await fastify.prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return reply.send(ok)
  })

  fastify.post('/change-password', {
    preHandler: [async (request, reply) => {
      try { await request.jwtVerify() } catch { return reply.status(401).send({ error: 'No autorizado.' }) }
    }],
    config: { rateLimit: { max: 10, timeWindow: '10 minutes' } }
  }, async (request, reply) => {
    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string()
        .min(8, PASSWORD_MSG)
        .regex(/[A-Z]/, PASSWORD_MSG)
        .regex(/[0-9]/, PASSWORD_MSG)
    })

    const result = schema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.errors[0].message })

    const { currentPassword, newPassword } = result.data
    const user = await fastify.prisma.user.findUnique({ where: { id: request.user.id } })
    if (!user) return reply.status(404).send({ error: 'Usuario no encontrado.' })

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return reply.status(400).send({ error: 'La contraseña actual es incorrecta.' })

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await fastify.prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return reply.send({ message: 'Contraseña actualizada correctamente.' })
  })
}
