export async function healthRoutes(fastify) {
  fastify.get('/health', async (request, reply) => {
    // En producción solo el estado mínimo — no exponer info de infraestructura
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
}
