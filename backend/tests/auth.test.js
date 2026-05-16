import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { buildApp } from '../src/app.js'

let app

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
  app = await buildApp({ logger: false })
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('rechaza credenciales inválidas', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'noexiste@test.com', password: 'wrongpass' }
      })

      expect(res.statusCode).toBe(401)
      expect(JSON.parse(res.body)).toHaveProperty('error')
    })

    it('rechaza email inválido', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'noesunemail', password: '123456' }
      })

      expect(res.statusCode).toBe(400)
    })

    it('requiere password', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'test@test.com' }
      })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /api/auth/register', () => {
    it('rechaza password corto', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'nuevo@test.com',
          dni: '12345678',
          password: '123',
          firstName: 'Test',
          lastName: 'User'
        }
      })

      expect(res.statusCode).toBe(400)
    })

    it('rechaza DNI demasiado corto', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'nuevo@test.com',
          dni: '12',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        }
      })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/auth/me', () => {
    it('retorna 401 sin token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me'
      })

      expect(res.statusCode).toBe(401)
    })

    it('retorna 401 con token inválido', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { authorization: 'Bearer token-invalido' }
      })

      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('rechaza sin refresh token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/refresh',
        payload: {}
      })

      expect(res.statusCode).toBe(400)
    })

    it('rechaza refresh token inválido', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/refresh',
        payload: { refreshToken: 'token-invalido' }
      })

      expect(res.statusCode).toBe(401)
    })
  })
})

describe('Health Route', () => {
  it('GET /health retorna estado del sistema', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' })
    const body = JSON.parse(res.body)

    expect([200, 503]).toContain(res.statusCode)
    expect(body).toHaveProperty('status')
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('services')
  })
})
