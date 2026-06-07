import { requireAuth, requireActiveSubscription } from '../middleware/auth.js'
import { routeIaRequest } from '../services/iaRouter.js'
import { updateMetricsAfterChat } from '../services/metrics.js'

export async function agentRoutes(fastify) {
  fastify.get('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const agents = await fastify.prisma.iAAgent.findMany({
      where: { clientId: request.user.clientId, published: true },
      select: { id: true, type: true, name: true, description: true, icon: true, published: true, publishedDate: true }
    })
    return agents
  })

  fastify.post('/:agentId/chat', {
    config: {
      rateLimit: {
        max: 30,
        timeWindow: '1 minute',
        keyGenerator: (req) => {
          // Decode JWT payload (sin verificar firma) solo para obtener userId como clave
          // La verificación real ocurre en requireActiveSubscription
          try {
            const token = req.headers.authorization?.split(' ')[1]
            if (token) {
              const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
              return `chat:${payload.id}`
            }
          } catch {}
          return `chat:${req.ip}`
        }
      }
    },
    preHandler: requireActiveSubscription
  }, async (request, reply) => {
    const { agentId } = request.params
    const { message, history } = request.body || {}

    if (!message?.trim()) {
      return reply.status(400).send({ error: 'El mensaje no puede estar vacío.' })
    }
    if (message.length > 2000) {
      return reply.status(400).send({ error: 'El mensaje no puede superar los 2000 caracteres.' })
    }

    try {
      const isPrivileged = request.user.role === 'ADMIN' || request.user.role === 'CLIENT'
      const agent = await fastify.prisma.iAAgent.findFirst({
        where: { id: agentId, clientId: request.user.clientId, ...(isPrivileged ? {} : { published: true }) }
      })

      if (!agent) {
        return reply.status(404).send({ error: 'Agente IA no encontrado o no disponible.' })
      }

      const startTime = Date.now()
      const result = await routeIaRequest(agent, message, Array.isArray(history) ? history : [], request.user.id, fastify.prisma)
      const duration = Date.now() - startTime

      const interaction = await fastify.prisma.iAInteraction.create({
        data: {
          agentId: agent.id,
          userId: request.user.id,
          message,
          response: result.response,
          modelUsed: result.modelUsed,
          tokens: result.tokens || 0,
          cost: result.cost || 0,
          duration
        }
      })

      await updateMetricsAfterChat(fastify.prisma, agent, request.user.id, result, duration)

      return reply.send({
        response: result.response,
        modelUsed: result.modelUsed,
        interactionId: interaction.id,
        duration
      })
    } catch (err) {
      fastify.log.error({ err: err.message, agentId }, 'Error en chat de agente IA')
      return reply.status(500).send({ error: 'Error interno al procesar la consulta. Intenta de nuevo.' })
    }
  })

  fastify.get('/:agentId/metrics', { preHandler: requireAuth }, async (request, reply) => {
    const { agentId } = request.params

    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id: agentId, clientId: request.user.clientId }
    })

    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const metric = await fastify.prisma.iAMetric.findUnique({
      where: { agentId_userId: { agentId, userId: request.user.id } }
    })

    return reply.send(metric || {
      totalQuestions: 0, avgResolutionTime: 0, problemResolutionRate: 0,
      totalSessions: 0, avgSessionDuration: 0, completionRate: 0,
      engagementScore: 0, habitStreak: 0, status: 'BUENO'
    })
  })

  fastify.get('/:agentId/reports', { preHandler: requireAuth }, async (request, reply) => {
    const { agentId } = request.params

    const metric = await fastify.prisma.iAMetric.findUnique({
      where: { agentId_userId: { agentId, userId: request.user.id } }
    })

    if (!metric?.reportContent) {
      return reply.send({ mensaje: 'No hay reportes generados aún.', reportContent: null })
    }

    return reply.send({
      reportContent: JSON.parse(metric.reportContent),
      lastReportDate: metric.lastReportDate,
      status: metric.status
    })
  })
}
