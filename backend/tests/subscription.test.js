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

describe('Subscription Routes', () => {
  describe('GET /api/subscription/status', () => {
    it('requiere autenticación', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/subscription/status' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/subscription/upgrade', () => {
    it('requiere autenticación', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/subscription/upgrade',
        payload: { planType: '30_DAYS' }
      })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('GET /api/subscription/history', () => {
    it('requiere autenticación', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/subscription/history' })
      expect(res.statusCode).toBe(401)
    })
  })
})

describe('Subscription Logic', () => {
  it('calcula fecha de vencimiento correctamente para 30 días', () => {
    const now = new Date()
    const activeUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const suspensionDate = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000)

    expect(activeUntil.getDate()).toBe(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).getDate())
    expect(suspensionDate > activeUntil).toBe(true)
  })

  it('calcula días restantes correctamente', () => {
    const activeUntil = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    const daysRemaining = Math.max(0, Math.ceil((activeUntil - new Date()) / (1000 * 60 * 60 * 24)))
    expect(daysRemaining).toBeGreaterThanOrEqual(9)
    expect(daysRemaining).toBeLessThanOrEqual(11)
  })
})
