import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { recalcularRanking } from '../services/ranking.js'

export async function rankingRoutes(fastify) {
  fastify.get('/', { preHandler: requireAuth }, async (request, reply) => {
    const { clientId } = request.user

    const rankings = await fastify.prisma.ranking.findMany({
      where: { clientId },
      orderBy: { position: 'asc' },
      take: 10
    })

    const profiles = await fastify.prisma.profile.findMany({
      where: { userId: { in: rankings.map(r => r.userId) } },
      select: { userId: true, firstName: true, lastName: true }
    })
    const profileMap = Object.fromEntries(profiles.map(p => [p.userId, p]))

    const enriched = rankings.map(r => {
      const profile = profileMap[r.userId]
      return {
        position: r.position,
        userId: r.userId,
        nombre: profile ? `${profile.firstName} ${profile.lastName}` : 'Estudiante',
        totalScore: r.totalScore,
        gainPercentage: r.gainPercentage,
        daysInTop10: r.daysInTop10,
        lastUpdated: r.lastUpdated
      }
    })

    return reply.send(enriched)
  })

  fastify.get('/student/:studentId', { preHandler: requireAuth }, async (request, reply) => {
    const { clientId } = request.user
    const { studentId } = request.params

    if (request.user.role !== 'ADMIN' && request.user.id !== studentId) {
      return reply.status(403).send({ error: 'Acceso denegado.' })
    }

    const ranking = await fastify.prisma.ranking.findFirst({
      where: { clientId, userId: studentId }
    })

    const totalStudents = await fastify.prisma.user.count({ where: { clientId, role: 'STUDENT' } })

    return reply.send({
      inTop10: !!ranking,
      position: ranking?.position || null,
      totalScore: ranking?.totalScore || 0,
      gainPercentage: ranking?.gainPercentage || 0,
      daysInTop10: ranking?.daysInTop10 || 0,
      totalStudents
    })
  })

  fastify.post('/recalculate', { preHandler: requireAdmin }, async (request, reply) => {
    const { clientId } = request.user
    await recalcularRanking(fastify.prisma, clientId)
    return reply.send({ ok: true })
  })
}
