import { requireActiveSubscription } from '../middleware/auth.js'

export async function courseRoutes(fastify) {
  fastify.get('/', { preHandler: requireActiveSubscription }, async (req, reply) => {

    const courses = await fastify.prisma.courseContent.findMany({
      where: { clientId: req.user.clientId },
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
