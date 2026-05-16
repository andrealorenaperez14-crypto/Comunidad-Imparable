import cron from 'node-cron'
import { recalcularRanking } from '../services/ranking.js'
import { startKeepAlive } from './keepAlive.js'
import {
  sendLowPerformanceEmailStudent,
  sendLowPerformanceEmailClient,
  sendHighPerformanceEmailStudent,
  sendHighPerformanceEmailClient,
  sendNoLoginWarningEmail,
  sendSuspensionCountdownEmail,
  sendSuspensionExecutedEmail,
  sendWeeklyReportEmail
} from '../services/email.js'

export function startCronJobs(fastify) {
  const { prisma } = fastify

  // Medianoche: recalcular ranking
  cron.schedule('0 0 * * *', async () => {
    try {
      const clients = await prisma.client.findMany()
      for (const client of clients) {
        await recalcularRanking(prisma, client.id)
      }
      fastify.log.info('Ranking recalculado exitosamente')
    } catch (err) {
      fastify.log.error({ err }, 'Error recalculando ranking')
    }
  })

  // 6am: verificar suscripciones y enviar alertas de cuenta regresiva
  cron.schedule('0 6 * * *', async () => {
    try {
      const now = new Date()
      const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)

      // Cuentas próximas a vencer (días 31-34)
      const expiringSubs = await prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          activeUntil: { gte: now, lte: in5Days }
        },
        include: { user: { include: { profile: true } } }
      })

      for (const sub of expiringSubs) {
        const daysRemaining = Math.ceil((sub.activeUntil - now) / (1000 * 60 * 60 * 24))
        if (sub.user.profile) {
          await sendSuspensionCountdownEmail({
            email: sub.user.email,
            firstName: sub.user.profile.firstName,
            schoolName: 'Escuela Digital Elite',
            daysRemaining
          })
        }
      }

      // Suspender cuentas vencidas
      const toSuspend = await prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          suspensionDate: { lte: now }
        },
        include: { user: { include: { profile: true } } }
      })

      for (const sub of toSuspend) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'SUSPENDED' }
        })

        if (sub.user.profile) {
          await sendSuspensionExecutedEmail({
            email: sub.user.email,
            firstName: sub.user.profile.firstName,
            schoolName: 'Escuela Digital Elite'
          })
        }
      }

      // Archivar y eliminar datos de cuentas suspendidas hace más de 15 días
      const toArchive = await prisma.subscription.findMany({
        where: {
          status: 'SUSPENDED',
          suspensionDate: { lte: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) }
        },
        include: { user: { include: { profile: true, iaMetrics: true, certificates: true } } }
      })

      for (const sub of toArchive) {
        const user = sub.user
        await prisma.studentsPrevious.upsert({
          where: { dni: user.dni },
          create: {
            dni: user.dni,
            clientId: user.clientId,
            lastEmail: user.email,
            lastMetrics: user.iaMetrics,
            completedCourses: 0,
            certificatesIssued: user.certificates.length,
            lastActive: user.profile?.lastLoginAt || sub.suspensionDate
          },
          update: {
            lastEmail: user.email,
            lastMetrics: user.iaMetrics,
            archivedAt: new Date()
          }
        })
      }

      fastify.log.info('Verificación de suscripciones completada')
    } catch (err) {
      fastify.log.error({ err }, 'Error verificando suscripciones')
    }
  })

  // 8am: alertas de sin ingreso (3 días inactivos)
  cron.schedule('0 8 * * *', async () => {
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

      const inactiveProfiles = await prisma.profile.findMany({
        where: {
          lastLoginAt: { lte: threeDaysAgo },
          user: { subscriptions: { some: { status: { in: ['ACTIVE', 'TRIAL'] } } } }
        },
        include: { user: true }
      })

      for (const profile of inactiveProfiles) {
        const daysSince = Math.floor((Date.now() - new Date(profile.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24))
        await sendNoLoginWarningEmail({
          email: profile.user.email,
          firstName: profile.firstName,
          schoolName: 'Escuela Digital Elite',
          daysSinceLogin: daysSince
        })
      }

      fastify.log.info(`Alertas de inactividad enviadas: ${inactiveProfiles.length}`)
    } catch (err) {
      fastify.log.error({ err }, 'Error enviando alertas de inactividad')
    }
  })

  // 10pm: alertas de rendimiento
  cron.schedule('0 22 * * *', async () => {
    try {
      const clients = await prisma.client.findMany()

      for (const client of clients) {
        const metrics = await prisma.iAMetric.findMany({
          where: { user: { clientId: client.id } },
          include: {
            user: { include: { profile: true } },
            agent: { select: { name: true } }
          }
        })

        for (const metric of metrics) {
          const score = metric.engagementScore

          if (score < 0.6 && metric.status !== 'ALERTA') {
            await prisma.iAMetric.update({
              where: { id: metric.id },
              data: { status: 'ALERTA', alertMessage: 'Rendimiento bajo detectado' }
            })

            if (metric.user.profile) {
              await sendLowPerformanceEmailStudent({
                email: metric.user.email,
                firstName: metric.user.profile.firstName,
                schoolName: client.name,
                agentName: metric.agent.name,
                score
              })
            }
          } else if (score > 0.9 && metric.status !== 'EXCELENTE') {
            await prisma.iAMetric.update({
              where: { id: metric.id },
              data: { status: 'EXCELENTE' }
            })

            if (metric.user.profile) {
              await sendHighPerformanceEmailStudent({
                email: metric.user.email,
                firstName: metric.user.profile.firstName,
                schoolName: client.name,
                agentName: metric.agent.name,
                score
              })
            }
          }
        }
      }

      fastify.log.info('Alertas de rendimiento procesadas')
    } catch (err) {
      fastify.log.error({ err }, 'Error procesando alertas de rendimiento')
    }
  })

  // Lunes 9am: reportes semanales
  cron.schedule('0 9 * * 1', async () => {
    try {
      const users = await prisma.user.findMany({
        where: { role: 'STUDENT', subscriptions: { some: { status: { in: ['ACTIVE', 'TRIAL'] } } } },
        include: {
          profile: true,
          iaMetrics: { include: { agent: { select: { name: true } } } },
          client: true
        }
      })

      for (const user of users) {
        if (!user.profile || !user.iaMetrics.length) continue

        await sendWeeklyReportEmail({
          email: user.email,
          firstName: user.profile.firstName,
          schoolName: user.client.name,
          metrics: user.iaMetrics.map(m => ({
            agentName: m.agent.name,
            sessions: m.totalSessions,
            completion: m.completionRate,
            status: m.status
          }))
        })
      }

      fastify.log.info('Reportes semanales enviados')
    } catch (err) {
      fastify.log.error({ err }, 'Error enviando reportes semanales')
    }
  })

  startKeepAlive(fastify)
  fastify.log.info('Cron jobs iniciados')
}
