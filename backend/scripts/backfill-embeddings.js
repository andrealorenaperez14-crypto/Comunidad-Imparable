import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const dbUrl = (process.env.DATABASE_URL || '').includes('?')
  ? process.env.DATABASE_URL + '&pgbouncer=true&connection_limit=1'
  : process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1'

const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } })

async function geminiEmbed(text) {
  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: { parts: [{ text }] } })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.embedding.values
}

async function main() {
  const chunks = await prisma.$queryRaw`
    SELECT id, content FROM "DocumentChunk"
    WHERE embedding IS NULL
    ORDER BY "createdAt" ASC
  `
  console.log(`Chunks sin embedding: ${chunks.length}`)

  let ok = 0
  for (const chunk of chunks) {
    try {
      const values = await geminiEmbed(chunk.content)
      const vectorLiteral = `[${values.join(',')}]`
      await prisma.$executeRaw`
        UPDATE "DocumentChunk"
        SET embedding = ${vectorLiteral}::vector
        WHERE id = ${chunk.id}
      `
      ok++
      if (ok % 10 === 0) console.log(`  ${ok}/${chunks.length} embeddings generados`)
      await new Promise(r => setTimeout(r, 50))
    } catch (err) {
      console.error(`  ERROR chunk ${chunk.id}:`, err.message)
    }
  }
  console.log(`\nListo: ${ok}/${chunks.length} embeddings generados.`)
}

main().finally(() => prisma.$disconnect())
