import cron from 'node-cron'
import { recalcularRanking } from '../services/ranking.js'

import { startKeepAlive } from './keepAlive.js'
// Emails deshabilitados por ahora — solo se envía recupero de contraseña (auth.js)
// Pendiente habilitar cuando se defina la estrategia de comunicación con alumnos

export function startCronJobs(fastify) {
  const { prisma } = fastify

  // Medianoche+5: expirar suscripciones TRIAL vencidas
  cron.schedule('5 0 * * *', async () => {
    try {
      const result = await prisma.subscription.updateMany({
        where: { status: 'TRIAL', activeUntil: { lt: new Date() } },
        data: { status: 'EXPIRED' }
      })
      fastify.log.info(`Suscripciones TRIAL expiradas automáticamente: ${result.count}`)
    } catch (err) {
      fastify.log.error({ err }, 'Error expirando suscripciones TRIAL')
    }
  })

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

      // Email countdown deshabilitado — pendiente fase paga Asesor Elite

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

        // Email suspensión deshabilitado — pendiente fase paga Asesor Elite
      }

      // CICLO PARTE PAGA (Asesor Elite): suspensión día 35 → datos guardados 10 días → eliminado día 45
      // No confundir con el trial FREE (5 días) que solo muestra la página /expired sin eliminar nada.
      // Archivar y eliminar datos de cuentas suspendidas hace más de 10 días
      const toArchive = await prisma.subscription.findMany({
        where: {
          status: 'SUSPENDED',
          suspensionDate: { lte: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) }
        },
        include: { user: { include: { profile: true } } }
      })

      for (const sub of toArchive) {
        const user = sub.user
        const nombreCompleto = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email

        // Guardar en Registro simple (upsert por DNI para no duplicar)
        await prisma.registro.upsert({
          where: { dni: user.dni },
          update: { email: user.email, nombreCompleto },
          create: { dni: user.dni, email: user.email, nombreCompleto, whatsapp: '' }
        })

        // Eliminar usuario (cascada borra subscriptions, métricas, interacciones)
        await prisma.user.delete({ where: { id: user.id } })

        fastify.log.info({ dni: user.dni }, 'Usuario archivado y eliminado')
      }

      fastify.log.info('Verificación de suscripciones completada')
    } catch (err) {
      fastify.log.error({ err }, 'Error verificando suscripciones')
    }
  })

  // 8am: email inactividad — deshabilitado, pendiente definir con cliente

  // Alertas de rendimiento deshabilitadas — pendiente para parte paga (Asesor Elite)
  // Las métricas de uso (sesiones, preguntas, engagementScore) siguen activas sin generar alertas

  // Lunes 9am: reporte semanal — deshabilitado, pendiente definir con cliente

  // 2am: limpiar interacciones de chat de más de 90 días (mensajes/respuestas)
  // Las IAMetric (tokens, costo, duración) se conservan para reportes
  cron.schedule('0 2 * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      const result = await prisma.iAInteraction.deleteMany({
        where: { createdAt: { lt: cutoff } }
      })
      fastify.log.info(`Limpieza de chat: ${result.count} interacciones eliminadas (>90 días)`)
    } catch (err) {
      fastify.log.error({ err }, 'Error en limpieza de interacciones de chat')
    }
  })

  startKeepAlive(fastify)
  fastify.log.info('Cron jobs iniciados')
}
