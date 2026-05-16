import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-cbc'

function getKey() {
  const key = process.env.ENCRYPTION_KEY || 'dev-encryption-key-32-chars-pad!!'
  return Buffer.from(key.padEnd(32).slice(0, 32))
}

export function encrypt(text) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(encryptedText) {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText
  const [ivHex, encHex] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv)
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()])
  return decrypted.toString('utf8')
}

export function maskApiKey(key) {
  if (!key || key.length < 8) return '***'
  return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`
}
