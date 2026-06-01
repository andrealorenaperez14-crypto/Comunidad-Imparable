import { GoogleGenerativeAI } from '@google/generative-ai'

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
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent('Respondé solo "OK"')
      return reply.send({ ok: true, response: result.response.text(), keyPrefix: key.slice(0, 8) + '...' })
    } catch (err) {
      return reply.send({ ok: false, error: err.message, keyPrefix: key.slice(0, 8) + '...' })
    }
  })
}
