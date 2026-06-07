export async function recalcularRanking(prisma, clientId) {
  const topN = 10

  // Todos los alumnos del cliente
  const allStudents = await prisma.user.findMany({
    where: { clientId, role: 'STUDENT' },
    select: { id: true }
  })

  // Métricas existentes (userId ya está en el modelo, no necesitamos join)
  const metrics = await prisma.iAMetric.findMany({
    where: { user: { clientId } },
    select: { userId: true, engagementScore: true, completionRate: true, problemResolutionRate: true }
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

  // Incluir todos los alumnos — score 0 si no tienen métricas aún
  const userScores = allStudents
    .map(({ id: userId }) => {
      const data = scoreByUser[userId]
      const totalScore = data ? data.totalScore / data.count : 0
      return { userId, totalScore, gainPercentage: totalScore * 100 }
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, topN)

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
