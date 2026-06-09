const WEIGHTS = { COACH: 0.20, MENTALIDAD: 0.10, CONSULTIVA: 0.70 }
const TOP_N = 10

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
