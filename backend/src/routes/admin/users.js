import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requireAdmin, requireAdminOrClient } from '../../middleware/auth.js'

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
  fastify.get('/search', { preHandler: requireAdminOrClient }, async (request, reply) => {
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
  // CLIENT role can only reset STUDENT passwords via this endpoint
  fastify.post('/reset-password', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const result = resetSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { emailOrDni, newPassword } = result.data
    const isEmail = emailOrDni.includes('@')

    const user = await fastify.prisma.user.findFirst({
      where: {
        clientId: request.user.clientId,
        ...(isEmail
          ? { email: emailOrDni.toLowerCase().trim() }
          : { dni: emailOrDni.trim() })
      }
    })

    if (!user) {
      return reply.status(404).send({ error: 'Usuario no encontrado.' })
    }

    if (request.user.role === 'CLIENT' && user.role !== 'STUDENT') {
      return reply.status(403).send({ error: 'No podés resetear la contraseña de administradores o clientes.' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await fastify.prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return reply.send({ ok: true, userId: user.id, role: user.role })
  })

  // Reset student password specifically (from alumnos panel)
  fastify.post('/students/:userId/reset-password', { preHandler: requireAdminOrClient }, async (request, reply) => {
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
  fastify.get('/students', { preHandler: requireAdminOrClient }, async (request, reply) => {
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
        select: {
          id: true, email: true, dni: true, role: true, createdAt: true,
          profile: { select: { firstName: true, lastName: true, lastLoginAt: true } },
          subscriptions: {
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

  // Delete student (ADMIN only for any role, CLIENT only for STUDENTs of their clientId)
  fastify.delete('/students/:userId', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const { userId } = request.params

    const student = await fastify.prisma.user.findFirst({
      where: { id: userId, clientId: request.user.clientId }
    })
    if (!student) return reply.status(404).send({ error: 'Usuario no encontrado.' })

    if (request.user.role === 'CLIENT' && student.role !== 'STUDENT') {
      return reply.status(403).send({ error: 'Solo podés eliminar alumnos.' })
    }
    if (student.role === 'ADMIN') {
      return reply.status(403).send({ error: 'No podés eliminar administradores.' })
    }

    // Delete all related records then the user (manual cascade for safety)
    await fastify.prisma.$transaction([
      fastify.prisma.saleCommission.deleteMany({ where: { userId } }),
      fastify.prisma.certificate.deleteMany({ where: { userId } }),
      fastify.prisma.iAMetric.deleteMany({ where: { userId } }),
      fastify.prisma.iAInteraction.deleteMany({ where: { userId } }),
      fastify.prisma.subscription.deleteMany({ where: { userId } }),
      fastify.prisma.profile.deleteMany({ where: { userId } }),
      fastify.prisma.user.delete({ where: { id: userId } })
    ])
    return reply.send({ ok: true })
  })

  // Update student email (ADMIN or CLIENT only)
  fastify.put('/students/:userId/email', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const schema = z.object({
      email: z.string().email('Email inválido')
    })
    const result = schema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.errors[0].message })

    const { email } = result.data
    const normalizedEmail = email.toLowerCase().trim()

    const target = await fastify.prisma.user.findFirst({
      where: { id: request.params.userId, clientId: request.user.clientId }
    })
    if (!target) return reply.status(404).send({ error: 'Usuario no encontrado.' })
    if (request.user.role === 'CLIENT' && target.role !== 'STUDENT') {
      return reply.status(403).send({ error: 'Solo podés modificar el email de alumnos.' })
    }

    const existing = await fastify.prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing && existing.id !== target.id) {
      return reply.status(409).send({ error: 'Ya existe una cuenta con ese email.' })
    }

    await fastify.prisma.user.update({ where: { id: target.id }, data: { email: normalizedEmail } })
    return reply.send({ ok: true, email: normalizedEmail })
  })

  // Admin ranking — all students sorted by score, filter active/all
  fastify.get('/ranking', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const { filter = 'all', page = '1' } = request.query
    const take = 50
    const skip = (parseInt(page) - 1) * take

    const activeSubFilter = filter === 'active'
      ? { subscriptions: { some: { status: { in: ['ACTIVE', 'TRIAL'] } } } }
      : {}

    const students = await fastify.prisma.user.findMany({
      where: { clientId: request.user.clientId, role: 'STUDENT', ...activeSubFilter },
      include: {
        profile: { select: { firstName: true, lastName: true } },
        subscriptions: { where: { status: { in: ['ACTIVE', 'TRIAL'] } }, take: 1 },
        iaMetrics: { select: { engagementScore: true, completionRate: true, problemResolutionRate: true, habitStreak: true, status: true } }
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    })

    const total = await fastify.prisma.user.count({
      where: { clientId: request.user.clientId, role: 'STUDENT', ...activeSubFilter }
    })

    const ranked = students
      .map(s => {
        const metric = s.iaMetrics[0]
        const score = metric
          ? (metric.engagementScore * 0.4 + metric.completionRate * 0.3 + metric.problemResolutionRate * 0.3) * 100
          : 0
        return {
          id: s.id,
          dni: s.dni,
          email: s.email,
          firstName: s.profile?.firstName || '',
          lastName: s.profile?.lastName || '',
          score: Math.round(score * 10) / 10,
          status: metric?.status || 'BUENO',
          habitStreak: metric?.habitStreak || 0,
          isActive: s.subscriptions.length > 0
        }
      })
      .sort((a, b) => b.score - a.score)
      .map((s, i) => ({ ...s, position: i + 1 + skip }))

    return reply.send({ students: ranked, total, page: parseInt(page), pages: Math.ceil(total / take) })
  })
}
