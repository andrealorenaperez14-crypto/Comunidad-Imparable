import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { createHmac, timingSafeEqual, randomInt } from 'crypto'
import bcrypt from 'bcryptjs'
import { sendVIPWelcomeEmail } from '../services/email.js'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_VIP_URL
const FRONTEND_URL    = process.env.CORS_ORIGIN?.split(',')[0] || 'https://frontend-one-ivory-47.vercel.app'
const BACKEND_URL     = process.env.BACKEND_URL || 'https://escuela-asesores-backend.onrender.com'
const USD_AMOUNT      = 150

async function getMepRate() {
  try {
    const r = await fetch('https://dolarapi.com/v1/dolares/mep')
    const d = await r.json()
    return d.venta
  } catch {
    return null
  }
}

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const nums  = '23456789'
  const part1 = Array.from({ length: 3 }, () => chars[randomInt(0, chars.length)]).join('')
  const part2 = Array.from({ length: 3 }, () => nums[randomInt(0, nums.length)]).join('')
  return `${part1}!${part2}`
}

async function getDefaultClientId(prisma) {
  const c = await prisma.client.findFirst()
  if (!c) throw new Error('No hay clientes configurados')
  return c.id
}

export async function paymentRoutes(fastify) {

  fastify.post('/vip/create', {
    config: { rateLimit: { max: 5, timeWindow: '10 minutes' } }
  }, async (req, reply) => {
    const { nombre, apellido, dni, email, whatsapp } = req.body
    if (!nombre || !apellido || !dni || !email || !whatsapp) {
      return reply.code(400).send({ error: 'Faltan datos' })
    }
    if (!/^\d{7,8}$/.test(dni)) {
      return reply.code(400).send({ error: 'DNI inválido' })
    }

    const mepRate = await getMepRate()
    if (!mepRate) return reply.code(503).send({ error: 'No se pudo obtener la cotización MEP' })

    const pesoAmount = Math.round(USD_AMOUNT * mepRate)

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: [{
          title:       'Lista VIP ELITE — Escuela de Asesores',
          quantity:    1,
          unit_price:  pesoAmount,
          currency_id: 'ARS'
        }],
        payer: { email, name: `${nombre} ${apellido}` },
        external_reference: JSON.stringify({ nombre, apellido, dni, email, whatsapp, mepRate, pesoAmount }),
        back_urls: {
          success: `${FRONTEND_URL}/parte-2?pago=exitoso`,
          failure: `${FRONTEND_URL}/parte-2?pago=fallido`,
          pending: `${FRONTEND_URL}/parte-2?pago=pendiente`
        },
        auto_return:          'approved',
        notification_url:     `${BACKEND_URL}/api/payments/webhook`,
        statement_descriptor: 'ESCUELA ASESORES VIP'
      }
    })

    return reply.send({ init_point: result.init_point, mepRate, pesoAmount })
  })

  fastify.post('/webhook', async (req, reply) => {
    const webhookSecret = process.env.MP_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = req.headers['x-signature'] || ''
      const requestId = req.headers['x-request-id'] || ''
      const ts        = signature.match(/ts=(\d+)/)?.[1] || ''
      const v1        = signature.match(/v1=([a-f0-9]+)/)?.[1] || ''
      const dataId    = req.body?.data?.id || ''
      const manifest  = `id:${dataId};request-id:${requestId};ts:${ts};`
      const expected  = createHmac('sha256', webhookSecret).update(manifest).digest('hex')
      try {
        const valid = timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'))
        if (!valid) return reply.code(400).send({ error: 'Firma inválida' })
      } catch {
        return reply.code(400).send({ error: 'Firma inválida' })
      }
    }

    const { type, data } = req.body || {}
    reply.send({ ok: true })

    if (type !== 'payment' || !data?.id) return

    try {
      const payment     = new Payment(client)
      const paymentData = await payment.get({ id: data.id })
      if (paymentData.status !== 'approved') return

      const ref = JSON.parse(paymentData.external_reference || '{}')
      const { nombre, apellido = '', dni, email, whatsapp } = ref
      const montoReal  = paymentData.transaction_amount
      const nombreCompleto = `${nombre} ${apellido}`.trim()

      // 1 — Escribir en Google Sheet (columnas: fecha, nombre, DNI, email, WA, importe)
      if (APPS_SCRIPT_URL) {
        await fetch(APPS_SCRIPT_URL, {
          method:  'POST',
          mode:    'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre:        nombreCompleto,
            dni:           dni || '',
            email,
            whatsapp,
            importePagado: `$${montoReal?.toLocaleString('es-AR')}`
          })
        })
      }

      // 2 — Crear o actualizar alumno en DB
      if (dni) {
        const prisma    = fastify.prisma
        const now       = new Date()
        const activeUntil     = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        const suspensionDate  = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000)

        const existing = await prisma.user.findUnique({ where: { dni } })

        if (existing) {
          // Expirar suscripciones activas y crear nueva 30_DAYS
          await prisma.subscription.updateMany({
            where: { userId: existing.id, status: { in: ['TRIAL', 'ACTIVE', 'SUSPENDED'] } },
            data:  { status: 'EXPIRED' }
          })
          await prisma.subscription.create({
            data: { userId: existing.id, planType: '30_DAYS', status: 'ACTIVE', activeUntil, suspensionDate, lastPaymentDate: now }
          })
          fastify.log.info({ dni, userId: existing.id }, 'VIP: suscripción actualizada a 30_DAYS')
        } else {
          // Crear alumno nuevo con plan pago directo
          const tempPassword   = generateTempPassword()
          const passwordHash   = await bcrypt.hash(tempPassword, 12)
          const clientId       = await getDefaultClientId(prisma)

          const newUser = await prisma.user.create({
            data: {
              email,
              dni,
              passwordHash,
              role:     'STUDENT',
              clientId,
              profile:  { create: { firstName: nombre, lastName: apellido } },
              subscriptions: {
                create: { planType: '30_DAYS', status: 'ACTIVE', activeUntil, suspensionDate, lastPaymentDate: now }
              }
            }
          })

          await sendVIPWelcomeEmail({
            email,
            firstName:    nombre,
            tempPassword,
            loginUrl:     `${FRONTEND_URL}/login`
          })

          fastify.log.info({ dni, userId: newUser.id }, 'VIP: alumno nuevo creado con plan 30_DAYS')
        }
      }

      fastify.log.info({ email, montoReal }, 'Pago VIP confirmado')
    } catch (err) {
      fastify.log.error({ err }, 'Error procesando webhook MP')
    }
  })
}
