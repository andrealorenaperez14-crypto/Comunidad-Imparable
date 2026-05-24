import { z } from 'zod'
import { requireAdminOrClient } from '../../middleware/auth.js'

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
  userId: z.string().min(1),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  description: z.string().max(500).optional(),
  saleDate: z.string()
})

export async function adminCommissionRoutes(fastify) {
  // List commissions (all or per student, optional cycle filter)
  fastify.get('/', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const { studentId, cycleStart, isPaid, page = '1' } = request.query
    const take = 50
    const skip = (parseInt(page) - 1) * take

    const where = {
      clientId: request.user.clientId,
      ...(studentId && { userId: studentId }),
      ...(cycleStart && { cycleStart: new Date(cycleStart) }),
      ...(isPaid !== undefined && { isPaid: isPaid === 'true' })
    }

    const [commissions, total] = await Promise.all([
      fastify.prisma.saleCommission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true, email: true, dni: true,
              profile: { select: { firstName: true, lastName: true } }
            }
          }
        },
        orderBy: { saleDate: 'desc' },
        take,
        skip
      }),
      fastify.prisma.saleCommission.count({ where })
    ])

    return reply.send({ commissions, total, page: parseInt(page), pages: Math.ceil(total / take) })
  })

  // Create commission for a student (admin manually)
  fastify.post('/', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const result = createSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0].message })
    }
    const { userId, amount, description, saleDate } = result.data

    const student = await fastify.prisma.user.findFirst({
      where: { id: userId, clientId: request.user.clientId, role: 'STUDENT' }
    })
    if (!student) return reply.status(404).send({ error: 'Alumno no encontrado.' })

    const saleDateObj = new Date(saleDate)
    const { cycleStart, cycleEnd } = getCommissionCycle(saleDateObj)

    const commission = await fastify.prisma.saleCommission.create({
      data: {
        userId,
        clientId: request.user.clientId,
        amount,
        description: description || null,
        saleDate: saleDateObj,
        cycleStart,
        cycleEnd,
        source: 'MANUAL'
      }
    })
    return reply.status(201).send(commission)
  })

  // Mark commission as paid
  fastify.patch('/:id/mark-paid', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const commission = await fastify.prisma.saleCommission.findFirst({
      where: { id: request.params.id, clientId: request.user.clientId }
    })
    if (!commission) return reply.status(404).send({ error: 'Comisión no encontrada.' })

    const updated = await fastify.prisma.saleCommission.update({
      where: { id: request.params.id },
      data: { isPaid: true, paidDate: new Date() }
    })
    return reply.send(updated)
  })

  // Delete commission
  fastify.delete('/:id', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const commission = await fastify.prisma.saleCommission.findFirst({
      where: { id: request.params.id, clientId: request.user.clientId }
    })
    if (!commission) return reply.status(404).send({ error: 'Comisión no encontrada.' })

    await fastify.prisma.saleCommission.delete({ where: { id: request.params.id } })
    return reply.send({ ok: true })
  })

  // Summary per student for current (or given) cycle, includes student info
  fastify.get('/summary', { preHandler: requireAdminOrClient }, async (request, reply) => {
    const { cycleStart: cycleStartParam } = request.query

    let currentCycleStart
    if (cycleStartParam) {
      currentCycleStart = new Date(cycleStartParam)
    } else {
      const now = new Date()
      const day = now.getDate()
      const cycleStartMonth = day >= 21 ? now.getMonth() : (now.getMonth() === 0 ? 11 : now.getMonth() - 1)
      const cycleStartYear = (day < 21 && now.getMonth() === 0) ? now.getFullYear() - 1 : now.getFullYear()
      currentCycleStart = new Date(cycleStartYear, cycleStartMonth, 21)
    }

    const commissions = await fastify.prisma.saleCommission.findMany({
      where: { clientId: request.user.clientId, cycleStart: currentCycleStart },
      include: {
        user: {
          select: { id: true, email: true, dni: true, profile: { select: { firstName: true, lastName: true } } }
        }
      }
    })

    const byStudent = {}
    for (const c of commissions) {
      if (!byStudent[c.userId]) {
        byStudent[c.userId] = {
          userId: c.userId,
          email: c.user.email,
          dni: c.user.dni,
          firstName: c.user.profile?.firstName || '',
          lastName: c.user.profile?.lastName || '',
          totalPending: 0,
          totalPaid: 0,
          countPending: 0,
          countPaid: 0
        }
      }
      if (c.isPaid) {
        byStudent[c.userId].totalPaid += c.amount
        byStudent[c.userId].countPaid++
      } else {
        byStudent[c.userId].totalPending += c.amount
        byStudent[c.userId].countPending++
      }
    }

    return reply.send({ cycleStart: currentCycleStart, students: Object.values(byStudent) })
  })
}
