import { requireAuth, requireAdmin, requireAdminOrClient } from '../middleware/auth.js'

export async function metricsRoutes(fastify) {
  fastify.get('/student/:studentId', { preHandler: requireAuth }, async (request, reply) => {
    const { studentId } = request.params

    if (request.user.role !== 'ADMIN' && request.user.role !== 'CLIENT' && request.user.id !== studentId) {
      return reply.status(403).send({ error: 'Acceso denegado.' })
    }

    const metrics = await fastify.prisma.iAMetric.findMany({
      where: { userId: studentId },
      include: { agent: { select: { name: true, type: true, icon: true } } }
    })

    const sub = await fastify.prisma.subscription.findFirst({
      where: { userId: studentId, status: { in: ['ACTIVE', 'TRIAL'] } },
      orderBy: { createdAt: 'desc' }
    })

    return reply.send({ metrics, subscription: sub })
  })

  fastify.get('/dashboard', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const { clientId } = request.user

    const [totalStudents, activeSubscriptions, alertStudents, totalInteractions] = await Promise.all([
      fastify.prisma.user.count({ where: { clientId, role: 'STUDENT' } }),
      fastify.prisma.subscription.count({ where: { user: { clientId }, status: { in: ['ACTIVE', 'TRIAL'] } } }),
      fastify.prisma.iAMetric.count({ where: { user: { clientId }, status: 'ALERTA' } }),
      fastify.prisma.iAInteraction.count({ where: { user: { clientId } } })
    ])

    const recentAlerts = await fastify.prisma.iAMetric.findMany({
      where: { user: { clientId }, status: 'ALERTA' },
      include: {
        user: { include: { profile: true } },
        agent: { select: { name: true, type: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })

    return reply.send({
      totalStudents,
      activeSubscriptions,
      alertStudents,
      totalInteractions,
      recentAlerts: recentAlerts.map(a => ({
        userId: a.userId,
        studentName: a.user.profile
          ? `${a.user.profile.firstName} ${a.user.profile.lastName}`
          : a.user.email,
        agentName: a.agent.name,
        agentType: a.agent.type,
        status: a.status,
        alertMessage: a.alertMessage
      }))
    })
  })

  fastify.post('/upload-params', { preHandler: requireAdmin }, async (request, reply) => {
    const data = await request.file()
    if (!data) return reply.code(400).send({ error: 'No se recibió ningún archivo' })

    const buffer = await data.toBuffer()
    const client = await fastify.prisma.client.findUnique({
      where: { id: request.user.clientId },
      select: { settings: true }
    })

    await fastify.prisma.client.update({
      where: { id: request.user.clientId },
      data: {
        settings: {
          ...(client.settings || {}),
          paramsDocument: {
            name: data.filename,
            mimetype: data.mimetype,
            size: buffer.length,
            uploadedAt: new Date().toISOString()
          }
        }
      }
    })

    return reply.send({ ok: true, filename: data.filename, size: buffer.length })
  })

  fastify.post('/generate-report', { preHandler: requireAuth }, async (request, reply) => {
    const { studentId } = request.body || {}
    const targetId = studentId || request.user.id

    if (request.user.role !== 'ADMIN' && request.user.id !== targetId) {
      return reply.status(403).send({ error: 'Acceso denegado.' })
    }

    const metrics = await fastify.prisma.iAMetric.findMany({
      where: { userId: targetId },
      include: { agent: { select: { name: true, type: true } } }
    })

    const report = {
      generatedAt: new Date().toISOString(),
      studentId: targetId,
      summary: metrics.map(m => ({
        agente: m.agent.name,
        tipo: m.agent.type,
        estado: m.status,
        sesiones: m.totalSessions,
        completacion: `${(m.completionRate * 100).toFixed(1)}%`,
        engagement: `${(m.engagementScore * 100).toFixed(1)}%`,
        racha: m.habitStreak
      }))
    }

    await fastify.prisma.iAMetric.updateMany({
      where: { userId: targetId },
      data: { lastReportDate: new Date(), reportContent: JSON.stringify(report) }
    })

    return reply.send(report)
  })
}
