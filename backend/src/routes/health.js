import { GoogleGenAI } from '@google/genai'

export async function healthRoutes(fastify) {
  fastify.get('/health', async (request, reply) => {
    if (process.env.NODE_ENV === 'production') {
      try {
        await fastify.prisma.$queryRaw`SELECT 1`
        return reply.status(200).send({ status: 'ok' })
      } catch {
        return reply.status(503).send({ status: 'error' })
      }
    }

    let dbStatus = 'ok'
    let redisStatus = 'ok'
    try { await fastify.prisma.$queryRaw`SELECT 1` } catch { dbStatus = 'error' }
    try { await fastify.redis.ping() } catch { redisStatus = 'degradado' }

    const status = dbStatus === 'ok' ? 'ok' : 'error'
    return reply.status(status === 'ok' ? 200 : 503).send({
      status, timestamp: new Date().toISOString(),
      services: { database: dbStatus, redis: redisStatus }
    })
  })

  // Diagnóstico temporal de Gemini
  fastify.get('/health/gemini', async (request, reply) => {
    const key = process.env.GEMINI_API_KEY
    if (!key) return reply.send({ ok: false, error: 'GEMINI_API_KEY no configurada' })

    try {
      const ai = new GoogleGenAI({ apiKey: key })
      const result = await ai.models.generateContent({ model: 'gemini-2.0-flash-lite', contents: 'Respondé solo "OK"' })
      return reply.send({ ok: true, response: result.text, keyPrefix: key.slice(0, 8) + '...' })
    } catch (err) {
      return reply.send({ ok: false, error: err.message, keyPrefix: key.slice(0, 8) + '...' })
    }
  })
}
