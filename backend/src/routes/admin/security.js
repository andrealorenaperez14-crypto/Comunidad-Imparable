import { requireAdmin } from '../../middleware/auth.js'

export async function adminSecurityRoutes(fastify) {
  fastify.get('/events', { preHandler: requireAdmin }, async (request, reply) => {
    const redis = fastify.redis
    if (!redis) return reply.send({ events: [], total: 0 })

    const keys = []
    let cursor = '0'
    do {
      const [nextCursor, batch] = await redis.scan(cursor, 'MATCH', 'security:injection:*', 'COUNT', 100)
      cursor = nextCursor
      keys.push(...batch.filter(k => !k.includes(':count:')))
    } while (cursor !== '0')

    const events = []
    for (const key of keys) {
      const userId = key.replace('security:injection:', '')
      const items = await redis.lrange(key, 0, -1)
      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      })
      for (const item of items) {
        try {
          const parsed = JSON.parse(item)
          events.push({ ...parsed, userEmail: user?.email || 'desconocido' })
        } catch { /* item malformado, ignorar */ }
      }
    }

    events.sort((a, b) => b.timestamp - a.timestamp)
    return reply.send({ events: events.slice(0, 100), total: events.length })
  })

  fastify.post('/ban/:userId', { preHandler: requireAdmin }, async (request, reply) => {
    const { userId } = request.params
    const { ttlSeconds = 3600 } = request.body || {}

    const redis = fastify.redis
    if (!redis) return reply.status(503).send({ error: 'Redis no disponible.' })

    const user = await fastify.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return reply.status(404).send({ error: 'Usuario no encontrado.' })

    await redis.setex(`security:banned:${userId}`, ttlSeconds, '1')
    return reply.send({ ok: true, userId, ttlSeconds })
  })
}
