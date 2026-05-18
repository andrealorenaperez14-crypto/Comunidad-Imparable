import { requireAdmin } from '../../middleware/auth.js'
import { z } from 'zod'

const brandingSchema = z.object({
  primaryColor:   z.string(),
  secondaryColor: z.string(),
  accentColor:    z.string(),
  bgColor:        z.string(),
  bgCard:         z.string(),
  textColor:      z.string(),
  textMuted:      z.string(),
  goldBorder:     z.string(),
  separator:      z.string(),
  logo:           z.string(),
  favicon:        z.string(),
  darkMode:       z.boolean(),
  fonts:          z.object({ display: z.string(), script: z.string(), body: z.string() })
}).partial()

export async function adminClientRoutes(fastify) {
  fastify.put('/branding', { preHandler: requireAdmin }, async (request, reply) => {
    const result = brandingSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const client = await fastify.prisma.client.findFirst({
      where: { id: request.user.clientId }
    })
    if (!client) return reply.status(404).send({ error: 'Cliente no encontrado.' })

    const updated = await fastify.prisma.client.update({
      where: { id: client.id },
      data:  { branding: { ...client.branding, ...result.data } }
    })

    return reply.send({ ok: true, branding: updated.branding })
  })

  fastify.get('/', { preHandler: requireAdmin }, async (request, reply) => {
    const client = await fastify.prisma.client.findFirst({
      where: { id: request.user.clientId },
      select: { id: true, name: true, domain: true, branding: true, settings: true }
    })
    if (!client) return reply.status(404).send({ error: 'Cliente no encontrado.' })
    return reply.send(client)
  })
}
