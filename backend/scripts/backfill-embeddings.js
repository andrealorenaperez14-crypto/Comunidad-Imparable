import { PrismaClient } from '@prisma/client'
import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'

const prisma = new PrismaClient()
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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
      const result = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: chunk.content,
      })
      const values = result.embeddings[0].values
      const vectorLiteral = `[${values.join(',')}]`
      await prisma.$executeRaw`
        UPDATE "DocumentChunk"
        SET embedding = ${vectorLiteral}::vector
        WHERE id = ${chunk.id}
      `
      ok++
      if (ok % 10 === 0) console.log(`  ${ok}/${chunks.length} embeddings generados`)
      // Respetar rate limit Gemini: 1500 req/min
      await new Promise(r => setTimeout(r, 50))
    } catch (err) {
      console.error(`  ERROR chunk ${chunk.id}:`, err.message)
    }
  }
  console.log(`\nListo: ${ok}/${chunks.length} embeddings generados.`)
}

main().finally(() => prisma.$disconnect())
