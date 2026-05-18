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
      log.push(`Client found: ${client.id}`)

      const adminHash = await bcrypt.hash('Admin2026!EA', 12)

      // Try to update old admin email→new email, or create fresh
      const oldAdmin = await prisma.user.findUnique({ where: { email: 'admin@escueladigital.com' } })
      if (oldAdmin) {
        // Update in-place: change email + password (keeps all FK relations intact)
        await prisma.user.update({
          where: { email: 'admin@escueladigital.com' },
          data: { email: 'andrealorenaperez14@gmail.com', passwordHash: adminHash, dni: 'ADMIN001' }
        })
        log.push('Old admin email migrated → andrealorenaperez14@gmail.com')
      } else {
        // Already migrated or doesn't exist — upsert
        await prisma.user.upsert({
          where: { email: 'andrealorenaperez14@gmail.com' },
          update: { passwordHash: adminHash, role: 'ADMIN' },
          create: {
            email: 'andrealorenaperez14@gmail.com',
            dni: 'ADMIN001',
            passwordHash: adminHash,
            role: 'ADMIN',
            clientId: client.id,
            profile: { create: { firstName: 'Andrea', lastName: 'Lorena' } }
          }
        })
        log.push('Admin upserted: andrealorenaperez14@gmail.com')
      }

      // Client user — pure upsert (no old email to migrate)
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
