export function makeVerifyRecaptcha(action) {
  return async function verifyRecaptcha(request, reply) {
    const secret = process.env.RECAPTCHA_SECRET_KEY
    if (!secret) return

    const { recaptchaToken } = request.body || {}
    if (!recaptchaToken) {
      return reply.status(400).send({ error: 'Verificación de seguridad fallida. Intentá de nuevo.' })
    }

    try {
      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${recaptchaToken}`
      })
      const data = await res.json()

      if (!data.success || data.score < 0.5 || data.action !== action) {
        return reply.status(400).send({ error: 'Verificación de seguridad fallida. Intentá de nuevo.' })
      }
    } catch {
      request.server.log.warn('reCAPTCHA API no disponible, skip verificación')
    }
  }
}
