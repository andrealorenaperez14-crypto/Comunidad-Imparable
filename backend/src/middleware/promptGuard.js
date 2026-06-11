const PATTERNS = {
  role_override: /\b(eres ahora|actúa como|actua como|pretende ser|pretendé ser|olvida|ignora tus instrucciones|ignorá tus instrucciones)\b/i,
  jailbreak: /\b(DAN|modo developer|sin restricciones|bypass|jailbreak)\b/i,
  data_extraction: /\b(muéstrame tu prompt|muestrame tu prompt|cuál es tu instrucción|cual es tu instruccion|system prompt|instrucciones iniciales|prompt inicial)\b/i,
  script_injection: /<script|javascript:|eval\(|document\.|window\./i
}

export async function promptGuard(request, reply) {
  const body = request.body || {}
  const fieldsToCheck = ['message', 'nombre', 'apellido', 'whatsapp', 'firstName', 'lastName']
  const combined = fieldsToCheck
    .map(f => (typeof body[f] === 'string' ? body[f] : ''))
    .join(' ')
  if (!combined.trim()) return

  for (const [category, pattern] of Object.entries(PATTERNS)) {
    if (pattern.test(combined)) {
      const redis = request.server.redis
      const userId = request.user?.id

      if (redis && userId) {
        const key = `security:injection:${userId}`
        await redis.rpush(key, JSON.stringify({ timestamp: Date.now(), category, userId }))
        await redis.expire(key, 30 * 24 * 60 * 60)

        const hour = new Date().toISOString().slice(0, 13)
        const countKey = `security:injection:count:${userId}:${hour}`
        const count = await redis.incr(countKey)
        await redis.expire(countKey, 3600)

        if (count >= 5) {
          await redis.setex(`security:banned:${userId}`, 3600, '1')
        }
      }

      request.server.log.warn({ userId, category }, 'Prompt injection attempt detected')
      return reply.status(400).send({ error: 'Mensaje no permitido.' })
    }
  }
}
