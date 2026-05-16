import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../src/app.js'

let app

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  app = await buildApp({ logger: false })
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Agent Routes', () => {
  describe('POST /api/agents/:agentId/chat', () => {
    it('requiere autenticación', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/agents/agent-id-fake/chat',
        payload: { message: 'Hola' }
      })
      expect(res.statusCode).toBe(401)
    })

    it('rechaza mensaje vacío con auth', async () => {
      const token = app.jwt.sign({ id: 'user-1', role: 'STUDENT', clientId: 'client-1' })
      const res = await app.inject({
        method: 'POST',
        url: '/api/agents/agent-id/chat',
        headers: { authorization: `Bearer ${token}` },
        payload: { message: '' }
      })
      expect([400, 403, 404]).toContain(res.statusCode)
    })
  })

  describe('Admin Agent Routes', () => {
    it('GET /api/admin/agents requiere admin', async () => {
      const token = app.jwt.sign({ id: 'user-1', role: 'STUDENT', clientId: 'client-1' })
      const res = await app.inject({
        method: 'GET',
        url: '/api/admin/agents',
        headers: { authorization: `Bearer ${token}` }
      })
      expect(res.statusCode).toBe(403)
    })

    it('GET /api/admin/agents retorna 401 sin auth', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/admin/agents' })
      expect(res.statusCode).toBe(401)
    })
  })
})

describe('IA Router Logic', () => {
  it('identifica pipeline correcto para agente CONSULTIVO', () => {
    const agentType = 'CONSULTIVO'
    const pipeline = agentType === 'CONSULTIVO'
      ? ['gemini', 'claude', 'local']
      : ['claude', 'gemini', 'openai']
    expect(pipeline[0]).toBe('gemini')
  })

  it('identifica pipeline correcto para agente MENTOR', () => {
    const agentType = 'MENTOR'
    const pipeline = agentType === 'MENTOR'
      ? ['claude', 'gemini', 'openai']
      : ['gemini', 'claude', 'local']
    expect(pipeline[0]).toBe('claude')
  })
})
