import { requireAuth, requireAdminOrClient } from '../middleware/auth.js'

export async function subscriptionRoutes(fastify) {
  fastify.get('/status', { preHandler: requireAuth }, async (request, reply) => {
    const sub = await fastify.prisma.subscription.findFirst({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!sub) return reply.status(404).send({ error: 'Sin suscripción activa.' })

    const now = new Date()
    const daysRemaining = Math.max(0, Math.ceil((sub.activeUntil - now) / (1000 * 60 * 60 * 24)))
    const isExpired = now > sub.activeUntil

    // Datos específicos del período de prueba
    const isTrial = sub.planType === 'TRIAL'
    const trialStartDate = sub.createdAt
    const trialDayNumber = isTrial
      ? Math.min(5, Math.max(1, Math.ceil((now - trialStartDate) / (1000 * 60 * 60 * 24)) + 1))
      : null
    const isTrialExpired = isTrial && isExpired

    return reply.send({
      ...sub,
      daysRemaining,
      isExpired,
      isTrialExpired,
      isTrial,
      trialDayNumber,
      isSuspended: sub.suspensionDate && now > sub.suspensionDate,
      isVitalicio: sub.planType === 'VITALICIO'
    })
  })

  // Solo ADMIN o CLIENT pueden activar planes — los alumnos no pueden auto-upgradearse
  fastify.post('/upgrade', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const { planType = '30_DAYS', userId } = request.body || {}
    const validPlans = ['30_DAYS', 'VITALICIO']

    if (!validPlans.includes(planType)) {
      return reply.status(400).send({ error: 'Plan inválido. Opciones: 30_DAYS, VITALICIO' })
    }

    if (!userId) {
      return reply.status(400).send({ error: 'userId requerido.' })
    }

    // Verificar que el usuario pertenece al mismo cliente
    const targetUser = await fastify.prisma.user.findFirst({
      where: { id: userId, clientId: request.user.clientId }
    })
    if (!targetUser) {
      return reply.status(404).send({ error: 'Usuario no encontrado.' })
    }

    await fastify.prisma.subscription.updateMany({
      where: { userId, status: { in: ['ACTIVE', 'TRIAL', 'SUSPENDED'] } },
      data: { status: 'EXPIRED' }
    })

    const now = new Date()
    const activeUntil = planType === 'VITALICIO'
      ? new Date('2099-12-31')
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const sub = await fastify.prisma.subscription.create({
      data: {
        userId,
        planType,
        status: 'ACTIVE',
        activeUntil,
        suspensionDate: planType === 'VITALICIO' ? null : new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        lastPaymentDate: now
      }
    })

    return reply.status(201).send({
      mensaje: `Plan ${planType === 'VITALICIO' ? 'vitalicio' : '30 días'} activado exitosamente.`,
      subscription: sub
    })
  })

  fastify.post('/cancel', { preHandler: requireAuth }, async (request, reply) => {
    await fastify.prisma.subscription.updateMany({
      where: { userId: request.user.id, status: { in: ['ACTIVE', 'TRIAL'] } },
      data: { status: 'EXPIRED' }
    })

    return reply.send({ mensaje: 'Suscripción cancelada. Tu acceso permanecerá activo hasta la fecha de vencimiento.' })
  })

  fastify.get('/history', { preHandler: requireAuth }, async (request, reply) => {
    const subs = await fastify.prisma.subscription.findMany({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return reply.send(subs)
  })
}
