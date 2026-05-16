export async function requireAuth(request, reply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'No autorizado. Inicia sesión para continuar.' })
  }
}

export async function requireAdmin(request, reply) {
  await requireAuth(request, reply)
  if (reply.sent) return
  if (request.user.role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Acceso denegado. Se requieren permisos de administrador.' })
  }
}

export async function requireActiveSubscription(request, reply) {
  await requireAuth(request, reply)
  if (reply.sent) return

  const { prisma } = request.server
  const sub = await prisma.subscription.findFirst({
    where: { userId: request.user.id, status: { in: ['ACTIVE', 'TRIAL'] } }
  })

  if (!sub) {
    return reply.status(403).send({
      error: 'Tu suscripción no está activa. Por favor renueva tu plan para continuar.'
    })
  }
}
