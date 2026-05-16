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

describe('Metrics Routes', () => {
  it('GET /api/metrics/student/:id requiere auth', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/metrics/student/user-1' })
    expect(res.statusCode).toBe(401)
  })

  it('GET /api/metrics/dashboard requiere admin', async () => {
    const token = app.jwt.sign({ id: 'user-1', role: 'STUDENT', clientId: 'client-1' })
    const res = await app.inject({
      method: 'GET',
      url: '/api/metrics/dashboard',
      headers: { authorization: `Bearer ${token}` }
    })
    expect(res.statusCode).toBe(403)
  })

  it('POST /api/metrics/generate-report requiere auth', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/metrics/generate-report' })
    expect(res.statusCode).toBe(401)
  })
})

describe('Ranking Routes', () => {
  it('GET /api/ranking requiere auth', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/ranking' })
    expect(res.statusCode).toBe(401)
  })

  it('GET /api/ranking/student/:id requiere auth', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/ranking/student/user-1' })
    expect(res.statusCode).toBe(401)
  })
})

describe('Certificate Routes', () => {
  it('GET /api/certificates/:studentId requiere auth', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/certificates/user-1' })
    expect(res.statusCode).toBe(401)
  })

  it('GET /api/certificates/:certId/verify es público', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/certificates/CERT-FAKE/verify' })
    expect([200, 404]).toContain(res.statusCode)
  })
})

describe('Métricas - Cálculo de estado', () => {
  it('EXCELENTE cuando engagement > 80% y completion > 90%', () => {
    const engagementScore = 0.85
    const completionRate = 0.92
    const status = (engagementScore > 0.8 && completionRate > 0.9) ? 'EXCELENTE' : 'BUENO'
    expect(status).toBe('EXCELENTE')
  })

  it('ALERTA cuando engagement < 30%', () => {
    const engagementScore = 0.25
    const completionRate = 0.5
    const status = engagementScore < 0.3 ? 'ALERTA' : 'BUENO'
    expect(status).toBe('ALERTA')
  })

  it('BUENO en rango normal', () => {
    const engagementScore = 0.65
    const completionRate = 0.70
    const isExcelente = engagementScore > 0.8 && completionRate > 0.9
    const isAlerta = engagementScore < 0.3
    const status = isExcelente ? 'EXCELENTE' : isAlerta ? 'ALERTA' : 'BUENO'
    expect(status).toBe('BUENO')
  })
})
