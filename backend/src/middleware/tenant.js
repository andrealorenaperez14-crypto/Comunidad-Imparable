export async function tenantMiddleware(request, reply) {
  if (!request.user?.clientId) {
    return reply.status(401).send({ error: 'Contexto de cliente no encontrado.' })
  }

  const client = await request.server.prisma.client.findUnique({
    where: { id: request.user.clientId }
  })

  if (!client) {
    return reply.status(403).send({ error: 'Cliente no encontrado o inactivo.' })
  }

  request.client = client
}
