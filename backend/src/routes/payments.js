import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { createHmac, timingSafeEqual } from 'crypto'

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

export async function paymentRoutes(fastify) {

  // Crear preferencia de pago MP
  fastify.post('/vip/create', async (req, reply) => {
    const { nombre, email, whatsapp } = req.body
    if (!nombre || !email || !whatsapp) {
      return reply.code(400).send({ error: 'Faltan datos' })
    }

    const mepRate   = await getMepRate()
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
        payer: { email, name: nombre },
        external_reference: JSON.stringify({ nombre, email, whatsapp, mepRate, pesoAmount }),
        back_urls: {
          success: `${FRONTEND_URL}/parte-2?pago=exitoso`,
          failure: `${FRONTEND_URL}/parte-2?pago=fallido`,
          pending: `${FRONTEND_URL}/parte-2?pago=pendiente`
        },
        auto_return:       'approved',
        notification_url:  `${BACKEND_URL}/api/payments/webhook`,
        statement_descriptor: 'ESCUELA ASESORES VIP'
      }
    })

    return reply.send({
      init_point: result.init_point,
      mepRate,
      pesoAmount
    })
  })

  // Webhook — MP notifica cuando se aprueba el pago
  fastify.post('/webhook', async (req, reply) => {
    // Verificar firma del webhook si está configurado el secret
    const webhookSecret = process.env.MP_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature  = req.headers['x-signature'] || ''
      const requestId  = req.headers['x-request-id'] || ''
      const ts         = signature.match(/ts=(\d+)/)?.[1] || ''
      const v1         = signature.match(/v1=([a-f0-9]+)/)?.[1] || ''
      const dataId     = req.body?.data?.id || ''
      const manifest   = `id:${dataId};request-id:${requestId};ts:${ts};`
      const expected   = createHmac('sha256', webhookSecret).update(manifest).digest('hex')
      try {
        const valid = timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'))
        if (!valid) return reply.code(400).send({ error: 'Firma inválida' })
      } catch {
        return reply.code(400).send({ error: 'Firma inválida' })
      }
    }

    const { type, data } = req.body || {}

    // Responder rápido a MP para evitar reintentos
    reply.send({ ok: true })

    if (type !== 'payment' || !data?.id) return

    try {
      const payment     = new Payment(client)
      const paymentData = await payment.get({ id: data.id })

      if (paymentData.status !== 'approved') return

      const ref = JSON.parse(paymentData.external_reference || '{}')
      const { nombre, email, whatsapp, mepRate, pesoAmount } = ref

      const montoReal = paymentData.transaction_amount

      // Escribir en el Sheet via Apps Script
      if (APPS_SCRIPT_URL) {
        await fetch(APPS_SCRIPT_URL, {
          method:  'POST',
          mode:    'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            email,
            whatsapp,
            montoPesos:    `$${pesoAmount?.toLocaleString('es-AR')}`,
            cotizacionMep: `$${mepRate?.toLocaleString('es-AR')}`,
            montoRecibido: `$${montoReal?.toLocaleString('es-AR')}`,
            estado:        'CONFIRMADO'
          })
        })
      }

      fastify.log.info({ email, montoReal }, 'Pago VIP confirmado')
    } catch (err) {
      fastify.log.error({ err }, 'Error procesando webhook MP')
    }
  })
}
