import { GoogleGenAI } from '@google/genai'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export async function healthRoutes(fastify) {
  fastify.get('/health', async (request, reply) => {
    if (process.env.NODE_ENV === 'production') {
      try {
        await fastify.prisma.$queryRaw`SELECT 1`
        return reply.status(200).send({ status: 'ok' })
      } catch {
        return reply.status(503).send({ status: 'error' })
      }
    }

    let dbStatus = 'ok'
    let redisStatus = 'ok'
    try { await fastify.prisma.$queryRaw`SELECT 1` } catch { dbStatus = 'error' }
    try { await fastify.redis.ping() } catch { redisStatus = 'degradado' }

    const status = dbStatus === 'ok' ? 'ok' : 'error'
    return reply.status(status === 'ok' ? 200 : 503).send({
      status, timestamp: new Date().toISOString(),
      services: { database: dbStatus, redis: redisStatus }
    })
  })

  fastify.get('/health/ia', async (request, reply) => {
    const results = {}

    // Groq
    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      results.groq = { ok: false, error: 'GROQ_API_KEY no configurada' }
    } else {
      try {
        const groq = new OpenAI({ apiKey: groqKey, baseURL: 'https://api.groq.com/openai/v1' })
        let groqOk = false
        for (const model of ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']) {
          try {
            const r = await Promise.race([
              groq.chat.completions.create({ model, messages: [{ role: 'user', content: 'Di solo OK' }], max_tokens: 10 }),
              new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000))
            ])
            results.groq = { ok: true, model, response: r.choices[0]?.message?.content?.slice(0, 50) }
            groqOk = true
            break
          } catch (e) {
            if (!e.message?.includes('429')) throw e
          }
        }
        if (!groqOk) results.groq = { ok: false, error: 'Rate limit en todos los modelos Groq' }
      } catch (err) {
        results.groq = { ok: false, error: err.message?.slice(0, 200) }
      }
    }

    // Gemini
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      results.gemini = { ok: false, error: 'GEMINI_API_KEY no configurada' }
    } else {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey })
        const r = await Promise.race([
          ai.models.generateContent({ model: 'gemini-2.0-flash', contents: 'Di solo OK' }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000))
        ])
        results.gemini = { ok: true, model: 'gemini-1.5-flash', response: r.text?.slice(0, 50) }
      } catch (err) {
        results.gemini = { ok: false, error: err.message?.slice(0, 400), keyPrefix: geminiKey.slice(0, 12) + '...' }
      }
    }

    // Claude
    const claudeKey = process.env.ANTHROPIC_API_KEY
    if (!claudeKey) {
      results.claude = { ok: false, error: 'ANTHROPIC_API_KEY no configurada' }
    } else {
      try {
        const anthropic = new Anthropic({ apiKey: claudeKey })
        const r = await Promise.race([
          anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 10, messages: [{ role: 'user', content: 'Di solo OK' }] }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000))
        ])
        results.claude = { ok: true, response: r.content[0]?.text?.slice(0, 50) }
      } catch (err) {
        results.claude = { ok: false, error: err.message?.slice(0, 200) }
      }
    }

    // OpenAI
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      results.openai = { ok: false, error: 'OPENAI_API_KEY no configurada' }
    } else {
      try {
        const openai = new OpenAI({ apiKey: openaiKey })
        const r = await Promise.race([
          openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Di solo OK' }], max_tokens: 10 }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000))
        ])
        results.openai = { ok: true, response: r.choices[0]?.message?.content?.slice(0, 50) }
      } catch (err) {
        results.openai = { ok: false, error: err.message?.slice(0, 200) }
      }
    }

    return reply.send(results)
  })
}
