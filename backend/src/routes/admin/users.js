import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requireAdmin } from '../../middleware/auth.js'

const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'

const resetSchema = z.object({
  emailOrDni:  z.string().min(1, 'Email o DNI requerido'),
  newPassword: z.string()
    .min(8, PASSWORD_MSG)
    .regex(/[A-Z]/, PASSWORD_MSG)
    .regex(/[0-9]/, PASSWORD_MSG)
    .regex(/[!@#$%^&*]/, PASSWORD_MSG),
  confirmPassword: z.string()
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export async function adminUserRoutes(fastify) {
  // Search users by email or DNI (any role)
  fastify.get('/search', { preHandler: requireAdmin }, async (request, reply) => {
    const q = (request.query.q || '').trim()
    if (!q || q.length < 2) return reply.send([])

    const users = await fastify.prisma.user.findMany({
      where: {
        clientId: request.user.clientId,
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { dni:   { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true, email: true, dni: true, role: true,
        profile: { select: { firstName: true, lastName: true } }
      },
      take: 20
    })

    return reply.send(users)
  })

  // Admin resets any user's password directly (no OTP needed)
  fastify.post('/reset-password', { preHandler: requireAdmin }, async (request, reply) => {
    const result = resetSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { emailOrDni, newPassword } = result.data
    const isEmail = emailOrDni.includes('@')

    const user = await fastify.prisma.user.findFirst({
      where: isEmail
        ? { email: emailOrDni.toLowerCase().trim() }
        : { dni: emailOrDni.trim() }
    })

    if (!user) {
      return reply.status(404).send({ error: 'Usuario no encontrado.' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await fastify.prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return reply.send({ ok: true, userId: user.id, role: user.role })
  })

  // Reset student password specifically (from alumnos panel)
  fastify.post('/students/:userId/reset-password', { preHandler: requireAdmin }, async (request, reply) => {
    const schema = z.object({
      newPassword: z.string()
        .min(8, PASSWORD_MSG)
        .regex(/[A-Z]/, PASSWORD_MSG)
        .regex(/[0-9]/, PASSWORD_MSG)
        .regex(/[!@#$%^&*]/, PASSWORD_MSG),
      confirmPassword: z.string()
    }).refine(d => d.newPassword === d.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    })

    const result = schema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const user = await fastify.prisma.user.findFirst({
      where: { id: request.params.userId, role: 'STUDENT', clientId: request.user.clientId }
    })
    if (!user) return reply.status(404).send({ error: 'Estudiante no encontrado.' })

    const passwordHash = await bcrypt.hash(result.data.newPassword, 12)
    await fastify.prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return reply.send({ ok: true })
  })

  // List all students
  fastify.get('/students', { preHandler: requireAdmin }, async (request, reply) => {
    const { q = '', page = '1' } = request.query
    const take = 20
    const skip = (parseInt(page) - 1) * take

    const where = {
      clientId: request.user.clientId,
      role: 'STUDENT',
      ...(q.trim() && {
        OR: [
          { email: { contains: q.trim(), mode: 'insensitive' } },
          { dni:   { contains: q.trim(), mode: 'insensitive' } },
          { profile: { OR: [
            { firstName: { contains: q.trim(), mode: 'insensitive' } },
            { lastName:  { contains: q.trim(), mode: 'insensitive' } }
          ]}}
        ]
      })
    }

    const [students, total] = await Promise.all([
      fastify.prisma.user.findMany({
        where,
        include: {
          profile: { select: { firstName: true, lastName: true, lastLoginAt: true } },
          subscriptions: {
            where: { status: { in: ['ACTIVE', 'TRIAL'] } },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      fastify.prisma.user.count({ where })
    ])

    return reply.send({ students, total, page: parseInt(page), pages: Math.ceil(total / take) })
  })
}
