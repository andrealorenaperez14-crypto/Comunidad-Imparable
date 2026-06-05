import { createRequire } from 'module'
import { requireAdmin } from '../../middleware/auth.js'
import { encrypt, decrypt, maskApiKey } from '../../utils/encryption.js'
import { z } from 'zod'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

async function geminiEmbed(text) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: { parts: [{ text }] } })
  })
  if (!res.ok) throw new Error(`Gemini embed ${res.status}`)
  const data = await res.json()
  return data.embedding.values
}

async function embedChunks(fastify, chunkIds, contents) {
  for (let i = 0; i < chunkIds.length; i++) {
    try {
      const values = await geminiEmbed(contents[i])
      if (!values) continue
      const vectorLiteral = `[${values.join(',')}]`
      await fastify.prisma.$executeRaw`
        UPDATE "DocumentChunk"
        SET embedding = ${vectorLiteral}::vector
        WHERE id = ${chunkIds[i]}
      `
    } catch (err) {
      console.warn('[embedChunks] Error embedding chunk', chunkIds[i], err.message)
    }
  }
}

const agentSchema = z.object({
  type: z.enum(['COACH', 'MENTALIDAD', 'CONSULTIVA']),
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

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    let primaryMasked = ''
    let backupMasked = ''
    try { primaryMasked = agent.primaryApiKey ? maskApiKey(decrypt(agent.primaryApiKey)) : '' } catch { primaryMasked = '' }
    try { backupMasked = agent.backupApiKey ? maskApiKey(decrypt(agent.backupApiKey)) : '' } catch { backupMasked = '' }

    return reply.send({
      ...agent,
      primaryApiKey: primaryMasked,
      backupApiKey: backupMasked
    })
  })

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })

    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const { primaryApiKey, backupApiKey, ...rest } = request.body || {}
    const updateData = { ...rest }

    // Solo actualizar si es una clave nueva (no enmascarada)
    if (primaryApiKey && !primaryApiKey.includes('****')) updateData.primaryApiKey = encrypt(primaryApiKey)
    if (backupApiKey && !backupApiKey.includes('****')) updateData.backupApiKey = encrypt(backupApiKey)

    const updated = await fastify.prisma.iAAgent.update({
      where: { id },
      data: updateData
    })

    let primaryMasked = ''
    let backupMasked = ''
    try { primaryMasked = updated.primaryApiKey ? maskApiKey(decrypt(updated.primaryApiKey)) : '' } catch { primaryMasked = '' }
    try { backupMasked = updated.backupApiKey ? maskApiKey(decrypt(updated.backupApiKey)) : '' } catch { backupMasked = '' }

    return reply.send({
      ...updated,
      primaryApiKey: primaryMasked,
      backupApiKey: backupMasked
    })
  })

  fastify.post('/:id/knowledge', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({
      where: { id, clientId: request.user.clientId }
    })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const filesProcessed = []
    const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'application/json', 'text/csv']
    const ALLOWED_EXTS = ['.pdf', '.txt', '.json', '.csv']

    for await (const part of request.parts()) {
      if (!part.file) continue

      const ext = part.filename ? '.' + part.filename.split('.').pop().toLowerCase() : ''
      if (!ALLOWED_EXTS.includes(ext)) {
        await part.file.resume()
        return reply.status(400).send({ error: `Tipo de archivo no permitido: ${part.filename}. Solo PDF, TXT, JSON, CSV.` })
      }

      // Sanitizar filename
      const safeFilename = part.filename.replace(/[^a-zA-Z0-9._\-áéíóúÁÉÍÓÚñÑ ]/g, '_')

      const chunks = []
      for await (const chunk of part.file) chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      let text
      if (ext === '.pdf') {
        try {
          const parsed = await pdfParse(buffer)
          text = parsed.text
        } catch {
          text = buffer.toString('utf8')
        }
      } else {
        text = buffer.toString('utf8')
      }

      // Fragmentar en párrafos (soporta \r\n y \n)
      const paragraphs = text.split(/(\r?\n){2,}/).map(p => p.trim()).filter(p => p.length > 50)
      const chunkDocs = []
      let chunkIndex = 0
      let current = ''
      for (const para of paragraphs) {
        if ((current + para).length > 1000 && current.length > 0) {
          chunkDocs.push({ agentId: id, filename: safeFilename, chunkIndex: chunkIndex++, content: current.trim() })
          current = para
        } else {
          current = current ? `${current}\n\n${para}` : para
        }
      }
      if (current.trim()) chunkDocs.push({ agentId: id, filename: safeFilename, chunkIndex: chunkIndex, content: current.trim() })

      await fastify.prisma.documentChunk.deleteMany({ where: { agentId: id, filename: safeFilename } })
      await fastify.prisma.documentChunk.createMany({ data: chunkDocs })

      const created = await fastify.prisma.documentChunk.findMany({
        where: { agentId: id, filename: safeFilename },
        orderBy: { chunkIndex: 'asc' },
        select: { id: true, content: true }
      })
      embedChunks(fastify, created.map(c => c.id), created.map(c => c.content)).catch(() => {})

      filesProcessed.push({ filename: safeFilename, chunks: chunkDocs.length })
    }

    return reply.send({
      mensaje: `${filesProcessed.length} archivo(s) indexado(s) correctamente.`,
      detalle: filesProcessed
    })
  })

  fastify.delete('/:id/knowledge', async (request, reply) => {
    const { id } = request.params
    const { filename } = request.query
    const agent = await fastify.prisma.iAAgent.findFirst({ where: { id, clientId: request.user.clientId } })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    await fastify.prisma.documentChunk.deleteMany({ where: { agentId: id, ...(filename ? { filename } : {}) } })
    return reply.send({ ok: true })
  })

  fastify.get('/:id/knowledge', async (request, reply) => {
    const { id } = request.params
    const agent = await fastify.prisma.iAAgent.findFirst({ where: { id, clientId: request.user.clientId } })
    if (!agent) return reply.status(404).send({ error: 'Agente no encontrado.' })

    const files = await fastify.prisma.documentChunk.groupBy({
      by: ['filename'],
      where: { agentId: id },
      _count: { chunkIndex: true }
    })
    return reply.send(files.map(f => ({ filename: f.filename, chunks: f._count.chunkIndex })))
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
