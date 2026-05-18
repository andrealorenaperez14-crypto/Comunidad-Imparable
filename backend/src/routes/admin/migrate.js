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
      // Get the client
      const client = await prisma.client.findFirst({ where: { domain: 'escueladigital.com' } })
      if (!client) return reply.status(404).send({ error: 'Client not found' })
      log.push(`Client found: ${client.id}`)

      // Delete old admin email if exists
      const deleted = await prisma.user.deleteMany({
        where: { email: { in: ['admin@escueladigital.com', 'admin@escueladeasesor.com'] } }
      })
      log.push(`Deleted old users: ${deleted.count}`)

      // Upsert new admin
      const adminHash = await bcrypt.hash('Admin2026!EA', 12)
      const admin = await prisma.user.upsert({
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
      log.push(`Admin upserted: ${admin.email}`)

      // Upsert client user
      const clientHash = await bcrypt.hash('Cliente2026!EA', 12)
      const clientUser = await prisma.user.upsert({
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
      log.push(`Client upserted: ${clientUser.email}`)

      return reply.send({ ok: true, log })
    } catch (err) {
      return reply.status(500).send({ error: err.message, log })
    }
  })
}
