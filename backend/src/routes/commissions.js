import { z } from 'zod'
import { requireAuth, requireActiveSubscription } from '../middleware/auth.js'

function getCommissionCycle(saleDate) {
  const d = new Date(saleDate)
  const day = d.getDate()

  let cycleStartMonth, cycleStartYear
  if (day >= 21) {
    cycleStartMonth = d.getMonth()
    cycleStartYear = d.getFullYear()
  } else {
    if (d.getMonth() === 0) {
      cycleStartMonth = 11
      cycleStartYear = d.getFullYear() - 1
    } else {
      cycleStartMonth = d.getMonth() - 1
      cycleStartYear = d.getFullYear()
    }
  }

  const cycleStart = new Date(cycleStartYear, cycleStartMonth, 21)
  const cycleEndMonth = (cycleStartMonth + 1) % 12
  const cycleEndYear = cycleStartMonth === 11 ? cycleStartYear + 1 : cycleStartYear
  const cycleEnd = new Date(cycleEndYear, cycleEndMonth, 20, 23, 59, 59)

  return { cycleStart, cycleEnd }
}

const createSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  description: z.string().max(500).optional(),
  saleDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
})

export async function commissionRoutes(fastify) {
  // Student: list own commissions
  fastify.get('/', { preHandler: requireAuth }, async (request, reply) => {
    const commissions = await fastify.prisma.saleCommission.findMany({
      where: { userId: request.user.id, clientId: request.user.clientId },
      orderBy: { saleDate: 'desc' }
    })
    return reply.send(commissions)
  })

  // Student: register a commission
  fastify.post('/', { preHandler: requireActiveSubscription }, async (request, reply) => {
    const result = createSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }

    const { amount, description, saleDate } = result.data
    const saleDateObj = new Date(saleDate)
    const { cycleStart, cycleEnd } = getCommissionCycle(saleDateObj)

    const commission = await fastify.prisma.saleCommission.create({
      data: {
        userId: request.user.id,
        clientId: request.user.clientId,
        amount,
        description: description || null,
        saleDate: saleDateObj,
        cycleStart,
        cycleEnd,
        source: 'AGENT'
      }
    })

    return reply.status(201).send(commission)
  })

  // Student: delete own commission (if not paid)
  fastify.delete('/:id', { preHandler: requireAuth }, async (request, reply) => {
    const commission = await fastify.prisma.saleCommission.findFirst({
      where: { id: request.params.id, userId: request.user.id }
    })
    if (!commission) return reply.status(404).send({ error: 'Comisión no encontrada.' })
    if (commission.isPaid) return reply.status(400).send({ error: 'No podés eliminar una comisión ya pagada.' })

    await fastify.prisma.saleCommission.delete({ where: { id: request.params.id } })
    return reply.send({ ok: true })
  })
}
