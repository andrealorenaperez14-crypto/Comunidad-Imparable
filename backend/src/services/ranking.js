export async function recalcularRanking(prisma, clientId) {
  const baseIngresoThreshold = 0
  const topN = 10

  const metrics = await prisma.iAMetric.findMany({
    where: { user: { clientId } },
    include: { user: true }
  })

  const scoreByUser = {}
  for (const m of metrics) {
    if (!scoreByUser[m.userId]) {
      scoreByUser[m.userId] = { totalScore: 0, count: 0 }
    }
    const score = m.engagementScore * m.completionRate * Math.max(m.problemResolutionRate, 0.5)
    scoreByUser[m.userId].totalScore += score
    scoreByUser[m.userId].count++
  }

  const userScores = Object.entries(scoreByUser)
    .map(([userId, data]) => ({
      userId,
      totalScore: data.totalScore / data.count,
      gainPercentage: (data.totalScore / data.count) * 100
    }))
    .filter(u => u.gainPercentage >= baseIngresoThreshold * 100)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, topN)

  const currentRankings = await prisma.ranking.findMany({ where: { clientId } })
  const currentByUser = Object.fromEntries(currentRankings.map(r => [r.userId, r]))

  await prisma.$transaction(async (tx) => {
    await tx.ranking.deleteMany({ where: { clientId } })

    for (let i = 0; i < userScores.length; i++) {
      const { userId, totalScore, gainPercentage } = userScores[i]
      const position = i + 1
      const wasInTop10 = !!currentByUser[userId]
      const daysInTop10 = wasInTop10 ? (currentByUser[userId].daysInTop10 + 1) : 1

      await tx.ranking.create({
        data: { clientId, position, userId, totalScore, gainPercentage, daysInTop10 }
      })

      await tx.rankingHistory.create({
        data: { clientId, userId, position, totalScore, gainPercentage }
      })
    }
  })

  return userScores
}
