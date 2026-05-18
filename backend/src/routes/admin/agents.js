import { requireAdmin } from '../../middleware/auth.js'
import { encrypt, decrypt, maskApiKey } from '../../utils/encryption.js'
import { z } from 'zod'

const agentSchema = z.object({
  type: z.enum(['CONSULTIVO', 'MENTOR', 'CONSULTIVA']),
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default(''),
  systemPrompt: z.string().min(1),
  instructions: z.string().default(''),
  metricsConfig: z.object({
    alertThresholdLow: z.number().default(0.6),
    alertThresholdHigh: z.number().default(0.9),
    reportingSchedule: z.string().default('weekly')
  }).default({}),
  primaryApiKey: z.string().optional(),
  backupApiKey: z.string().optional()
})

export async function adminAgentRoutes(fastify) {
  fastify.addHook('preHandler', requireAdmin)

  fastify.get('/', async (request, reply) => {
    const agents = await fastify.prisma.iAAgent.findMany({
      where: { clientId: request.user.clientId },
      select: {
        id: true, type: true, name: true, description: true, icon: true,
        published: true, publishedDate: true, createdAt: true, updatedAt: true,
        _count: { select: { interactions: true } }
      }
    })

    return reply.send(agents)
  })

  fastify.post('/', async (request, reply) => {
    const result = agentSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { primaryApiKey, backupApiKey, ...data } = result.data

    const existing = await fastify.prisma.iAAgent.findUnique({
      where: { clientId_type: { clientId: request.user.clientId, type: data.type } }
    })
    if (existing) {
      return reply.status(409).send({ error: `Ya existe un agente de tipo ${data.type} para este cliente.` })
    }

    const agent = await fastify.prisma.iAAgent.create({
      data: {
        ...data,
        clientId: request.user.clientId,
        knowledgeBase: '[]',
        primaryApiKey: primaryApiKey ? encrypt(primaryApiKey) : '',
        backupApiKey: backupApiKey ? encrypt(backupApiKey) : ''
      }
    })

    return reply.status(201).send(agent)
  })

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })

    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const { primaryApiKey, backupApiKey, ...rest } = request.body || {}
    const updateData = { ...rest }

    if (primaryApiKey) updateData.primaryApiKey = encrypt(primaryApiKey)
    if (backupApiKey) updateData.backupApiKey = encrypt(backupApiKey)

    const updated = await fastify.prisma.iAAgent.update({
      where: { id },
      data: updateData
    })

    return reply.send({
      ...updated,
      primaryApiKey: maskApiKey(decrypt(updated.primaryApiKey)),
      backupApiKey: maskApiKey(decrypt(updated.backupApiKey))
    })
  })

  fastify.post('/:id/knowledge', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const parts = []
    for await (const part of request.parts()) {
      if (part.file) {
        const chunks = []
        for await (const chunk of part.file) chunks.push(chunk)
        const content = Buffer.concat(chunks).toString('utf8')
        parts.push({ filename: part.filename, content: content.slice(0, 50000) })
      }
    }

    const existing = JSON.parse(agent.knowledgeBase || '[]')
    const updated = [...existing, ...parts]

    await fastify.prisma.iAAgent.update({
      where: { id },
      data: { knowledgeBase: JSON.stringify(updated) }
    })

    return reply.send({ mensaje: `${parts.length} archivo(s) cargado(s) correctamente.`, total: updated.length })
  })

  fastify.get('/:id/interactions', async (request, reply) => {
    const { id } = request.params
    const { page = 1, limit = 50 } = request.query

    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const interactions = await fastify.prisma.iAInteraction.findMany({
      where: { agentId: id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: { user: { include: { profile: true } } }
    })

    return reply.send(interactions.map(i => ({
      id: i.id,
      studentName: i.user.profile
        ? `${i.user.profile.firstName} ${i.user.profile.lastName}`
        : i.user.email,
      message: i.message,
      response: i.response,
      modelUsed: i.modelUsed,
      tokens: i.tokens,
      duration: i.duration,
      createdAt: i.createdAt
    })))
  })

  fastify.post('/:id/publish', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const updated = await fastify.prisma.iAAgent.update({
      where: { id },
      data: { published: !agent.published, publishedDate: !agent.published ? new Date() : null }
    })

    return reply.send({
      mensaje: updated.published ? 'Agente publicado exitosamente.' : 'Agente despublicado.',
      published: updated.published
    })
  })
}
