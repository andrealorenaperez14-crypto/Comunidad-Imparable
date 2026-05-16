import 'dotenv/config'
import { buildApp } from './app.js'
import { startCronJobs } from './cron/jobs.js'

const start = async () => {
  const app = await buildApp()

  try {
    const port = parseInt(process.env.PORT || '3001')
    await app.listen({ port, host: '0.0.0.0' })
    app.log.info(`Escuela Digital Elite API corriendo en puerto ${port}`)

    if (process.env.NODE_ENV !== 'test') {
      startCronJobs(app)
    }
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
