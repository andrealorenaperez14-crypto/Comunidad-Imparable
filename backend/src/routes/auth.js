import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { sendPasswordResetEmail } from '../services/email.js'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  dni: z.string().min(6, 'DNI inválido').max(20),
  password: z.string()
    .min(8, PASSWORD_MSG)
    .regex(/[A-Z]/, PASSWORD_MSG)
    .regex(/[0-9]/, PASSWORD_MSG)
    .regex(/[!@#$%^&*]/, PASSWORD_MSG),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  clientId: z.string().optional()
})

export async function authRoutes(fastify) {
  fastify.post('/login', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } }
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
    const jti = request.user.jti
    if (jti && fastify.redis) {
      await fastify.redis.setex(`bl:${jti}`, 3600, '1')
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

      const token = fastify.jwt.sign({
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
  const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'

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

    // Responder siempre igual para no revelar si el email existe
    const ok = { message: 'Si el email existe, recibirás un código de verificación.' }
    if (!user) return reply.send(ok)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const key = `pwd_reset:${email.toLowerCase().trim()}`

    try {
      await fastify.redis.setex(key, 900, otp) // 15 min TTL
    } catch {
      // Redis no disponible — continuar con logging
      fastify.log.warn('Redis no disponible para OTP reset')
    }

    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.profile?.firstName || 'Usuario',
      schoolName: user.client?.name || 'Escuela de Asesores',
      otp
    })

    return reply.send(ok)
  })

  fastify.post('/reset-password', {
    config: { rateLimit: { max: 10, timeWindow: '10 minutes' } }
  }, async (request, reply) => {
    const schema = z.object({
      email:       z.string().email(),
      otp:         z.string().length(6),
      newPassword: z.string()
        .min(8, PASSWORD_MSG)
        .regex(/[A-Z]/, PASSWORD_MSG)
        .regex(/[0-9]/, PASSWORD_MSG)
        .regex(/[!@#$%^&*]/, PASSWORD_MSG)
    })

    const result = schema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { email, otp, newPassword } = result.data
    const key = `pwd_reset:${email.toLowerCase().trim()}`

    let storedOtp
    try {
      storedOtp = await fastify.redis.get(key)
    } catch {
      return reply.status(503).send({ error: 'Servicio temporalmente no disponible.' })
    }

    if (!storedOtp || storedOtp !== otp) {
      return reply.status(400).send({ error: 'Código inválido o expirado.' })
    }

    const user = await fastify.prisma.user.findUnique({ where: { email } })
    if (!user) return reply.status(404).send({ error: 'Usuario no encontrado.' })

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await fastify.prisma.user.update({ where: { id: user.id }, data: { passwordHash } })
    await fastify.redis.del(key)

    return reply.send({ message: 'Contraseña actualizada correctamente.' })
  })
}
