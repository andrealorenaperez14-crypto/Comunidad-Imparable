import fp from 'fastify-plugin'
import Redis from 'ioredis'

async function redisPlugin(fastify) {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableOfflineQueue: false
  })

  redis.on('error', (err) => {
    fastify.log.warn({ err }, 'Error de conexión Redis - continuando sin caché')
  })

  try {
    await redis.connect()
  } catch {
    fastify.log.warn('Redis no disponible - operando sin caché')
  }

  fastify.decorate('redis', redis)
  fastify.addHook('onClose', async () => {
    try { await redis.quit() } catch { /* already disconnected */ }
  })
}

export default fp(redisPlugin)
export { redisPlugin }
