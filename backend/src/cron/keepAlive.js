import cron from 'node-cron'

const HEALTH_URL = process.env.RENDER_HEALTH_URL || 'https://nucleo-estrategico-ia.onrender.com/health'

export function startKeepAlive(fastify) {
  cron.schedule('*/14 * * * *', async () => {
    try {
      const res = await fetch(HEALTH_URL)
      fastify.log.info(`Keep-alive ping: ${res.status}`)
    } catch (err) {
      fastify.log.warn({ err }, 'Keep-alive ping failed')
    }
  })
}
