export async function updateMetricsAfterChat(prisma, agent, userId, result, duration) {
  const existing = await prisma.iAMetric.findUnique({
    where: { agentId_userId: { agentId: agent.id, userId } }
  })

  if (existing) {
    const totalSessions = existing.totalSessions + 1
    const avgSessionDuration = Math.round(
      (existing.avgSessionDuration * existing.totalSessions + duration) / totalSessions
    )

    let totalQuestions = existing.totalQuestions
    let avgResolutionTime = existing.avgResolutionTime

    if (agent.type === 'CONSULTIVA') {
      totalQuestions += 1
      avgResolutionTime = Math.round(
        (existing.avgResolutionTime * existing.totalQuestions + duration) / totalQuestions
      )
    }

    const engagementScore = Math.min(1, totalSessions / 30)
    const completionRate = Math.min(1, totalSessions / 20)
    const habitStreak = calcularRacha(existing.habitStreak, existing.updatedAt)

    const status = 'BUENO'

    await prisma.iAMetric.update({
      where: { id: existing.id },
      data: {
        totalSessions, avgSessionDuration, totalQuestions, avgResolutionTime,
        engagementScore, completionRate, habitStreak, status
      }
    })
  } else {
    const engagementScore = 0.05
    const status = 'BUENO'

    await prisma.iAMetric.create({
      data: {
        agentId: agent.id,
        userId,
        totalSessions: 1,
        avgSessionDuration: duration,
        totalQuestions: agent.type === 'CONSULTIVA' ? 1 : 0,
        avgResolutionTime: agent.type === 'CONSULTIVA' ? duration : 0,
        engagementScore,
        completionRate: 0.05,
        habitStreak: 1,
        status
      }
    })
  }
}

function calcularRacha(currentStreak, lastUpdated) {
  if (!lastUpdated) return 1
  const hoursSinceUpdate = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60)
  if (hoursSinceUpdate < 48) return currentStreak + 1
  if (hoursSinceUpdate > 72) return 1
  return currentStreak
}

export async function recalcularMetricasEstudiante(prisma, userId) {
  const interactions = await prisma.iAInteraction.findMany({
    where: { userId },
    include: { agent: true },
    orderBy: { createdAt: 'desc' }
  })

  const metricsByAgent = {}
  for (const interaction of interactions) {
    if (!metricsByAgent[interaction.agentId]) {
      metricsByAgent[interaction.agentId] = {
        agent: interaction.agent,
        sessions: 0,
        totalDuration: 0
      }
    }
    metricsByAgent[interaction.agentId].sessions++
    metricsByAgent[interaction.agentId].totalDuration += interaction.duration
  }

  for (const [agentId, data] of Object.entries(metricsByAgent)) {
    const engagementScore = Math.min(1, data.sessions / 30)
    const completionRate = Math.min(1, data.sessions / 20)
    const status = 'BUENO'

    await prisma.iAMetric.upsert({
      where: { agentId_userId: { agentId, userId } },
      create: {
        agentId, userId,
        totalSessions: data.sessions,
        avgSessionDuration: Math.round(data.totalDuration / data.sessions),
        engagementScore, completionRate, status
      },
      update: {
        totalSessions: data.sessions,
        avgSessionDuration: Math.round(data.totalDuration / data.sessions),
        engagementScore, completionRate, status
      }
    })
  }
}
