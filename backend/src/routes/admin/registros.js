import { requireAdminOrClient } from '../../middleware/auth.js'

export async function adminRegistrosRoutes(fastify) {
  fastify.get('/', { preHandler: requireAdminOrClient }, async (req, reply) => {
    const registros = await fastify.prisma.registro.findMany({
      orderBy: { fechaIngreso: 'desc' }
    })
    return registros
  })

  fastify.post('/', async (req, reply) => {
    const { dni, email, nombreCompleto, whatsapp } = req.body || {}
    if (!dni || !email || !nombreCompleto || !whatsapp) {
      return reply.status(400).send({ error: 'Faltan campos requeridos.' })
    }
    if (!/^\d{7,8}$/.test(dni.trim())) {
      return reply.status(400).send({ error: 'DNI inválido.' })
    }

    const registro = await fastify.prisma.registro.upsert({
      where: { dni: dni.trim() },
      update: { email: email.toLowerCase().trim(), nombreCompleto: nombreCompleto.trim(), whatsapp: whatsapp.trim() },
      create: { dni: dni.trim(), email: email.toLowerCase().trim(), nombreCompleto: nombreCompleto.trim(), whatsapp: whatsapp.trim() }
    })
    return reply.status(201).send(registro)
  })

  fastify.delete('/:id', { preHandler: requireAdminOrClient }, async (req, reply) => {
    await fastify.prisma.registro.delete({ where: { id: req.params.id } })
    return reply.send({ ok: true })
  })
}
