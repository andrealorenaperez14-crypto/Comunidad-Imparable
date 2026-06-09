const WEIGHTS = { COACH: 0.20, MENTALIDAD: 0.10, CONSULTIVA: 0.70 }
const TOP_N = 10

export async function getRankingVitalicio(prisma, clientId) {
  // Solo usuarios con suscripción VITALICIO activa
  const vitalicioSubs = await prisma.subscription.findMany({
    where: { status: 'ACTIVE', planType: 'VITALICIO', user: { clientId, role: 'STUDENT' } },
    include: { user: { include: { profile: true } } },
    orderBy: { createdAt: 'asc' }
  })

  if (!vitalicioSubs.length) return []

  const userIds = vitalicioSubs.map(s => s.userId)

  const interactions = await prisma.iAInteraction.findMany({
    where: { userId: { in: userIds }, agent: { clientId } },
    select: { userId: true, agent: { select: { type: true } } }
  })

  const statsByUser = {}
  for (const i of interactions) {
    const type = i.agent.type.toUpperCase()
    if (!statsByUser[i.userId]) statsByUser[i.userId] = { COACH: 0, MENTALIDAD: 0, CONSULTIVA: 0 }
    if (type in WEIGHTS) statsByUser[i.userId][type]++
  }

  const now = Date.now()

  return vitalicioSubs
    .map(sub => {
      const stats = statsByUser[sub.userId] || { COACH: 0, MENTALIDAD: 0, CONSULTIVA: 0 }
      const weightedInteractions = stats.CONSULTIVA * WEIGHTS.CONSULTIVA + stats.COACH * WEIGHTS.COACH + stats.MENTALIDAD * WEIGHTS.MENTALIDAD
      const daysInApp = Math.max(1, Math.floor((now - new Date(sub.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
      // score = interacciones ponderadas × (1 + días/100) — la antigüedad multiplica el uso
      const score = weightedInteractions * (1 + daysInApp / 100)
      return {
        userId: sub.userId,
        firstName: sub.user.profile?.firstName || '',
        lastName: sub.user.profile?.lastName || '',
        email: sub.user.email,
        dni: sub.user.dni,
        daysInApp,
        interacciones: stats,
        weightedInteractions: Math.round(weightedInteractions * 10) / 10,
        score: Math.round(score * 10) / 10
      }
    })
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ ...e, position: i + 1 }))
}

export async function recalcularRanking(prisma, clientId) {
  const allStudents = await prisma.user.findMany({
    where: { clientId, role: 'STUDENT' },
    select: { id: true }
  })

  const interactions = await prisma.iAInteraction.findMany({
    where: { agent: { clientId } },
    select: { userId: true, agent: { select: { type: true } } }
  })

  const statsByUser = {}
  for (const i of interactions) {
    const type = i.agent.type.toUpperCase()
    if (!statsByUser[i.userId]) statsByUser[i.userId] = { COACH: 0, MENTALIDAD: 0, CONSULTIVA: 0 }
    if (type in WEIGHTS) statsByUser[i.userId][type]++
  }

  const userScores = allStudents
    .map(({ id: userId }) => {
      const s = statsByUser[userId] || { COACH: 0, MENTALIDAD: 0, CONSULTIVA: 0 }
      const totalScore = s.CONSULTIVA * WEIGHTS.CONSULTIVA + s.COACH * WEIGHTS.COACH + s.MENTALIDAD * WEIGHTS.MENTALIDAD
      return { userId, totalScore, gainPercentage: totalScore }
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, TOP_N)

  const currentRankings = await prisma.ranking.findMany({ where: { clientId } })
  const currentByUser = Object.fromEntries(currentRankings.map(r => [r.userId, r]))

  const rankingRows = userScores.map(({ userId, totalScore, gainPercentage }, i) => ({
    clientId, position: i + 1, userId, totalScore, gainPercentage,
    daysInTop10: currentByUser[userId] ? (currentByUser[userId].daysInTop10 + 1) : 1
  }))
  const historyRows = userScores.map(({ userId, totalScore, gainPercentage }, i) => ({
    clientId, userId, position: i + 1, totalScore, gainPercentage
  }))

  await prisma.$transaction([
    prisma.ranking.deleteMany({ where: { clientId } }),
    prisma.ranking.createMany({ data: rankingRows }),
    prisma.rankingHistory.createMany({ data: historyRows })
  ])

  return userScores
}
