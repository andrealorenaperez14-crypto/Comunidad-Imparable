import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'crypto'

const ALGORITHM = 'aes-256-cbc'

function getKey() {
  const key = process.env.ENCRYPTION_KEY
  if (!key && process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY no está configurada.')
  }
  return Buffer.from((key || 'dev-encryption-key-32-chars-pad!!').padEnd(32).slice(0, 32))
}

export function encrypt(text) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  // HMAC para autenticación del ciphertext (previene padding oracle)
  const hmac = createHmac('sha256', getKey())
    .update(iv.toString('hex') + ':' + encrypted.toString('hex'))
    .digest('hex')
  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${hmac}`
}

export function decrypt(encryptedText) {
  if (!encryptedText) return encryptedText
  const parts = encryptedText.split(':')
  // Formato nuevo con HMAC (3 partes)
  if (parts.length === 3) {
    const [ivHex, encHex, storedHmac] = parts
    const expectedHmac = createHmac('sha256', getKey())
      .update(ivHex + ':' + encHex)
      .digest('hex')
    if (!timingSafeEqual(Buffer.from(storedHmac, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
      throw new Error('Integridad del ciphertext comprometida.')
    }
    const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'))
    return Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]).toString('utf8')
  }
  // Formato legacy sin HMAC (2 partes) — migración transparente
  if (parts.length === 2) {
    const [ivHex, encHex] = parts
    const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'))
    return Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]).toString('utf8')
  }
  return encryptedText
}

export function maskApiKey(key) {
  if (!key || key.length < 8) return '***'
  return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`
}
