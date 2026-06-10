import { describe, it, expect } from 'vitest'
import { sanitizeFields } from '../src/middleware/sanitizeInput.js'

describe('sanitizeFields', () => {
  it('elimina tags script de string fields', () => {
    const result = sanitizeFields(
      { firstName: '<script>alert(1)</script>Ana', lastName: 'García' },
      ['firstName', 'lastName']
    )
    expect(result.firstName).toBe('Ana')
    expect(result.lastName).toBe('García')
  })

  it('elimina tags HTML dejando el texto', () => {
    const result = sanitizeFields({ name: '<b>Hola</b> mundo' }, ['name'])
    expect(result.name).toBe('Hola mundo')
  })

  it('no modifica campos que no están en la lista', () => {
    const result = sanitizeFields({ email: 'test@test.com', name: '<b>Ana</b>' }, ['name'])
    expect(result.email).toBe('test@test.com')
    expect(result.name).toBe('Ana')
  })

  it('no modifica campos que no son string', () => {
    const result = sanitizeFields({ count: 5, active: true }, ['count', 'active'])
    expect(result.count).toBe(5)
    expect(result.active).toBe(true)
  })

  it('maneja campos undefined sin romper', () => {
    const result = sanitizeFields({ name: undefined }, ['name'])
    expect(result.name).toBeUndefined()
  })

  it('elimina atributos de eventos onclick', () => {
    const result = sanitizeFields({ name: '<img src=x onerror=alert(1)>' }, ['name'])
    expect(result.name).toBe('')
  })
})
