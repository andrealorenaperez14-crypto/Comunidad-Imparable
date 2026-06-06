export async function courseRoutes(fastify) {
  fastify.get('/', async (req, reply) => {
    try {
      await req.jwtVerify()
    } catch {
      return reply.code(401).send({ error: 'No autenticado' })
    }

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
