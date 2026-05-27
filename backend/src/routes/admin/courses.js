export async function adminCourseRoutes(fastify) {
  const authenticateAdmin = async (req, reply) => {
    try {
      await req.jwtVerify()
      if (req.user.role !== 'ADMIN') return reply.code(403).send({ error: 'Sin permisos' })
    } catch {
      reply.code(401).send({ error: 'No autenticado' })
    }
  }

  const authenticateAdminOrClient = async (req, reply) => {
    try {
      await req.jwtVerify()
      if (req.user.role !== 'ADMIN' && req.user.role !== 'CLIENT') return reply.code(403).send({ error: 'Sin permisos' })
    } catch {
      reply.code(401).send({ error: 'No autenticado' })
    }
  }

  // List all course content — CLIENT (read-only) and ADMIN
  fastify.get('/', { preHandler: authenticateAdminOrClient }, async (req, reply) => {
    const courses = await fastify.prisma.courseContent.findMany({
      where: { clientId: req.user.clientId },
      orderBy: { order: 'asc' }
    })
    return courses
  })

  // Create course content
  fastify.post('/', { preHandler: authenticateAdmin }, async (req, reply) => {
    const { title, description, content, type, order, videoUrl } = req.body
    if (!title || !content || !type) return reply.code(400).send({ error: 'title, content y type son requeridos' })

    const last = await fastify.prisma.courseContent.findFirst({
      where: { clientId: req.user.clientId },
      orderBy: { order: 'desc' }
    })

    const course = await fastify.prisma.courseContent.create({
      data: {
        clientId: req.user.clientId,
        title,
        description: description || '',
        content,
        type: type || 'FREE',
        videoUrl: videoUrl || null,
        order: order ?? (last ? last.order + 1 : 0)
      }
    })
    return reply.code(201).send(course)
  })

  // Update course content
  fastify.put('/:id', { preHandler: authenticateAdmin }, async (req, reply) => {
    const { id } = req.params
    const { title, description, content, type, order, videoUrl } = req.body

    const existing = await fastify.prisma.courseContent.findFirst({
      where: { id, clientId: req.user.clientId }
    })
    if (!existing) return reply.code(404).send({ error: 'No encontrado' })

    const course = await fastify.prisma.courseContent.update({
      where: { id },
      data: { title, description, content, type, order, videoUrl: videoUrl ?? null }
    })
    return course
  })

  // Delete course content
  fastify.delete('/:id', { preHandler: authenticateAdmin }, async (req, reply) => {
    const { id } = req.params
    const existing = await fastify.prisma.courseContent.findFirst({
      where: { id, clientId: req.user.clientId }
    })
    if (!existing) return reply.code(404).send({ error: 'No encontrado' })

    await fastify.prisma.courseContent.delete({ where: { id } })
    return { ok: true }
  })

  // Reorder
  fastify.patch('/reorder', { preHandler: authenticateAdmin }, async (req, reply) => {
    const { items } = req.body // [{ id, order }]
    await Promise.all(items.map((item) =>
      fastify.prisma.courseContent.updateMany({
        where: { id: item.id, clientId: req.user.clientId },
        data: { order: item.order }
      })
    ))
    return { ok: true }
  })
}

