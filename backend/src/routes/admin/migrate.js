import bcrypt from 'bcryptjs'

// ONE-TIME migration route — delete this file after running
export async function adminMigrateRoutes(fastify) {
  fastify.post('/api/admin/run-migration', {
    schema: { body: { type: 'object', required: ['secret'], properties: { secret: { type: 'string' } } } }
  }, async (req, reply) => {
    const expectedSecret = process.env.MIGRATION_SECRET || 'migrate-2026-EA'
    if (req.body.secret !== expectedSecret) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const prisma = fastify.prisma
    const log = []

    try {
      const client = await prisma.client.findFirst({ where: { domain: 'escueladigital.com' } })
      if (!client) return reply.status(404).send({ error: 'Client not found' })
      log.push(`Client: ${client.id}`)

      const adminHash = await bcrypt.hash('Admin2026!EA', 12)

      // If new admin email already exists, just update password+role
      const newAdmin = await prisma.user.findUnique({ where: { email: 'andrealorenaperez14@gmail.com' } })
      if (newAdmin) {
        await prisma.user.update({
          where: { email: 'andrealorenaperez14@gmail.com' },
          data: { passwordHash: adminHash, role: 'ADMIN' }
        })
        log.push('New admin found — password + role updated')

        // Delete old admin with cascade if it still exists
        const oldAdmin = await prisma.user.findUnique({ where: { email: 'admin@escueladigital.com' } })
        if (oldAdmin) {
          await prisma.$transaction([
            prisma.profile.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.iAMetric.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.iAInteraction.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.subscription.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.ranking.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.rankingHistory.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.certificate.deleteMany({ where: { userId: oldAdmin.id } }),
            prisma.user.delete({ where: { id: oldAdmin.id } })
          ])
          log.push('Old admin@escueladigital.com deleted with cascade')
        } else {
          log.push('Old admin not found (already removed)')
        }
      } else {
        // Migrate old admin email in-place
        const oldAdmin = await prisma.user.findUnique({ where: { email: 'admin@escueladigital.com' } })
        if (oldAdmin) {
          await prisma.user.update({
            where: { id: oldAdmin.id },
            data: { email: 'andrealorenaperez14@gmail.com', passwordHash: adminHash, role: 'ADMIN', dni: 'ADMIN001' }
          })
          log.push('Old admin email migrated → andrealorenaperez14@gmail.com')
        } else {
          await prisma.user.create({
            data: {
              email: 'andrealorenaperez14@gmail.com',
              dni: 'ADMIN001',
              passwordHash: adminHash,
              role: 'ADMIN',
              clientId: client.id,
              profile: { create: { firstName: 'Andrea', lastName: 'Lorena' } }
            }
          })
          log.push('Admin created fresh')
        }
      }

      // Client user
      const clientHash = await bcrypt.hash('Cliente2026!EA', 12)
      await prisma.user.upsert({
        where: { email: 'escueladeasesoresmps@gmail.com' },
        update: { passwordHash: clientHash, role: 'CLIENT' },
        create: {
          email: 'escueladeasesoresmps@gmail.com',
          dni: 'CLIENT001',
          passwordHash: clientHash,
          role: 'CLIENT',
          clientId: client.id,
          profile: { create: { firstName: 'Escuela', lastName: 'de Asesores' } }
        }
      })
      log.push('Client upserted: escueladeasesoresmps@gmail.com')

      return reply.send({ ok: true, log })
    } catch (err) {
      return reply.status(500).send({ error: err.message, log })
    }
  })
}
