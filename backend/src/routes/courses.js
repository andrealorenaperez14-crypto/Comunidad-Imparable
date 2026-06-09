import { requireAuth, requireActiveSubscription, requireAdminOrClient } from '../middleware/auth.js'

export async function courseRoutes(fastify) {
  fastify.get('/', { preHandler: requireActiveSubscription }, async (req, reply) => {
    const courses = await fastify.prisma.courseContent.findMany({
      where: { clientId: req.user.clientId },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, description: true, content: true, type: true, order: true, videoUrl: true }
    })
    return courses
  })

  // Guardar progreso de video
  fastify.post('/:contentId/progress', { preHandler: requireActiveSubscription }, async (req, reply) => {
    const { contentId } = req.params
    const { watchedPercent } = req.body || {}

    if (typeof watchedPercent !== 'number' || watchedPercent < 0 || watchedPercent > 100) {
      return reply.status(400).send({ error: 'watchedPercent debe ser un número entre 0 y 100.' })
    }

    const content = await fastify.prisma.courseContent.findFirst({
      where: { id: contentId, clientId: req.user.clientId }
    })
    if (!content) return reply.status(404).send({ error: 'Módulo no encontrado.' })

    const existing = await fastify.prisma.videoProgress.findUnique({
      where: { userId_courseContentId: { userId: req.user.id, courseContentId: contentId } }
    })

    // Solo actualizamos si el nuevo % es mayor al registrado (no retroceder)
    if (existing && existing.watchedPercent >= watchedPercent) {
      return reply.send({ watchedPercent: existing.watchedPercent })
    }

    const progress = await fastify.prisma.videoProgress.upsert({
      where: { userId_courseContentId: { userId: req.user.id, courseContentId: contentId } },
      create: { userId: req.user.id, courseContentId: contentId, watchedPercent },
      update: { watchedPercent }
    })

    return reply.send({ watchedPercent: progress.watchedPercent })
  })

  // Obtener mi progreso de todos los módulos
  fastify.get('/progress', { preHandler: requireAuth }, async (req, reply) => {
    const progress = await fastify.prisma.videoProgress.findMany({
      where: { userId: req.user.id },
      select: { courseContentId: true, watchedPercent: true }
    })
    const map = {}
    for (const p of progress) map[p.courseContentId] = p.watchedPercent
    return map
  })

  // Admin: progreso de video de un alumno específico
  fastify.get('/progress/:userId', { preHandler: requireAdminOrClient }, async (req, reply) => {
    const { userId } = req.params

    const user = await fastify.prisma.user.findFirst({
      where: { id: userId, clientId: req.user.clientId }
    })
    if (!user) return reply.status(404).send({ error: 'Alumno no encontrado.' })

    const [progress, modules] = await Promise.all([
      fastify.prisma.videoProgress.findMany({
        where: { userId },
        select: { courseContentId: true, watchedPercent: true }
      }),
      fastify.prisma.courseContent.findMany({
        where: { clientId: req.user.clientId },
        orderBy: { order: 'asc' },
        select: { id: true, title: true, type: true, order: true }
      })
    ])

    const progressMap = {}
    for (const p of progress) progressMap[p.courseContentId] = p.watchedPercent

    return modules.map(m => ({
      id: m.id,
      title: m.title,
      type: m.type,
      order: m.order,
      watchedPercent: progressMap[m.id] ?? 0
    }))
  })
}
