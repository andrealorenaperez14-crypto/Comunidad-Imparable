export async function requireAuth(request, reply) {
  try {
    await request.jwtVerify()
    const { jti } = request.user
    if (jti) {
      const redis = request.server.redis
      if (redis) {
        const revoked = await redis.get(`bl:${jti}`)
        if (revoked) return reply.status(401).send({ error: 'Sesión expirada. Inicia sesión nuevamente.' })
      }
    }
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

export async function requireAdminOrClient(request, reply) {
  await requireAuth(request, reply)
  if (reply.sent) return
  if (request.user.role !== 'ADMIN' && request.user.role !== 'CLIENT') {
    return reply.status(403).send({ error: 'Acceso denegado.' })
  }
}

export async function requireActiveSubscription(request, reply) {
  await requireAuth(request, reply)
  if (reply.sent) return

  // Admins and clients bypass subscription checks
  if (request.user.role === 'ADMIN' || request.user.role === 'CLIENT') return

  const { prisma } = request.server
  const now = new Date()

  const sub = await prisma.subscription.findFirst({
    where: { userId: request.user.id, status: { in: ['ACTIVE', 'TRIAL'] } },
    orderBy: { createdAt: 'desc' }
  })

  if (!sub) {
    return reply.status(403).send({
      code: 'NO_SUBSCRIPTION',
      error: 'Tu suscripción no está activa. Por favor renovate para continuar.'
    })
  }

  if (now > sub.activeUntil) {
    await prisma.subscription.update({ where: { id: sub.id }, data: { status: 'EXPIRED' } })

    const code = sub.status === 'TRIAL' ? 'TRIAL_EXPIRED' : 'SUBSCRIPTION_EXPIRED'
    return reply.status(403).send({ code, error: 'Tu acceso ha expirado.' })
  }
}
