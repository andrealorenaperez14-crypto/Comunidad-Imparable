import { z } from 'zod'

export const emailSchema = z.string().email('Email inválido')
export const dniSchema = z.string().min(6, 'DNI inválido').max(20)
export const passwordSchema = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')

export function validatePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20))
  return { page, limit, skip: (page - 1) * limit }
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return str
  return str.trim().slice(0, 10000)
}

export function isValidClientId(clientId, userClientId, userRole) {
  if (userRole === 'ADMIN') return true
  return clientId === userClientId
}
