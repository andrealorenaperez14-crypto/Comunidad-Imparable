import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import sensible from '@fastify/sensible'
import multipart from '@fastify/multipart'
import * as Sentry from '@sentry/node'
import { prismaPlugin } from './plugins/prisma.js'
import { redisPlugin } from './plugins/redis.js'
import { authRoutes, authPasswordRoutes } from './routes/auth.js'
import { subscriptionRoutes } from './routes/subscription.js'
import { agentRoutes } from './routes/agents.js'
import { metricsRoutes } from './routes/metrics.js'
import { rankingRoutes } from './routes/ranking.js'
import { certificateRoutes } from './routes/certificates.js'
import { adminAgentRoutes } from './routes/admin/agents.js'
import { adminCourseRoutes } from './routes/admin/courses.js'
import { adminClientRoutes } from './routes/admin/client.js'
import { adminUserRoutes } from './routes/admin/users.js'
import { adminCommissionRoutes } from './routes/admin/commissions.js'
import { commissionRoutes } from './routes/commissions.js'
import { courseRoutes } from './routes/courses.js'
import { healthRoutes } from './routes/health.js'

export async function buildApp(opts = {}) {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test' ? {
      level: 'info',
      transport: { target: 'pino-pretty' }
    } : false,
    ...opts
  })

  if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV })
  }

  await app.register(helmet, {
    contentSecurityPolicy: false
  })

  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',').map(o => o.trim())

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error('Not allowed by CORS'), false)
    },
    credentials: true
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  })

  await app.register(sensible)
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } })

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET no está configurado. La app no puede iniciarse.')
  }

  await app.register(jwt, {
    secret: jwtSecret || 'dev-secret-min-32-chars-change-in-prod',
    sign: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  })

  await app.register(prismaPlugin)
  await app.register(redisPlugin)

  app.addHook('onError', (request, reply, error, done) => {
    if (process.env.SENTRY_DSN) Sentry.captureException(error)
    done()
  })

  await app.register(healthRoutes)
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(authPasswordRoutes, { prefix: '/api/auth' })
  await app.register(subscriptionRoutes, { prefix: '/api/subscription' })
  await app.register(agentRoutes, { prefix: '/api/agents' })
  await app.register(metricsRoutes, { prefix: '/api/metrics' })
  await app.register(rankingRoutes, { prefix: '/api/ranking' })
  await app.register(certificateRoutes, { prefix: '/api/certificates' })
  await app.register(adminAgentRoutes, { prefix: '/api/admin/agents' })
  await app.register(adminCourseRoutes, { prefix: '/api/admin/courses' })
  await app.register(adminClientRoutes, { prefix: '/api/admin/client' })
  await app.register(adminUserRoutes, { prefix: '/api/admin/users' })
  await app.register(adminCommissionRoutes, { prefix: '/api/admin/commissions' })
  await app.register(commissionRoutes, { prefix: '/api/commissions' })
  await app.register(courseRoutes, { prefix: '/api/course' })

  return app
}
