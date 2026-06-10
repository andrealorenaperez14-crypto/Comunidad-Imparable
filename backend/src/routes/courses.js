import { requireActiveSubscription } from '../middleware/auth.js'

export async function courseRoutes(fastify) {
  fastify.get('/', { preHandler: requireActiveSubscription }, async (req, reply) => {

    const sub = await fastify.prisma.subscription.findFirst({
      where: { userId: req.user.id, status: { in: ['ACTIVE', 'TRIAL'] } },
      orderBy: { createdAt: 'desc' }
    })

    const isPaid = sub?.planType === '30_DAYS' || sub?.planType === 'VITALICIO'

    const courses = await fastify.prisma.courseContent.findMany({
      where: {
        clientId: req.user.clientId,
        ...(isPaid ? {} : { type: 'FREE' })
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        type: true,
        order: true,
        videoUrl: true
      }
    })

    return courses
  })
}
