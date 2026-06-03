# pgvector RAG — IA Consultiva Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la búsqueda FTS de la IA Consultiva por búsqueda semántica con pgvector + Gemini embeddings, para que encuentre la información correcta de las 15 obras sociales sin importar cómo esté formulada la consulta.

**Architecture:** Los DocumentChunk existentes reciben una columna `embedding vector(768)`. Al subir un archivo, se generan embeddings via Gemini `text-embedding-004`. En cada consulta, se embeds la query y se busca por similitud coseno (HNSW index). FTS queda como fallback si no hay embeddings.

**Tech Stack:** Supabase pgvector, Prisma `$executeRaw`/`$queryRaw`, Gemini `text-embedding-004` (768 dims, gratis), Node.js ESM

---

## Archivos que se modifican

| Archivo | Acción |
|---------|--------|
| `backend/prisma/schema.prisma` | Agregar campo `embedding` a `DocumentChunk` |
| `backend/src/routes/admin/agents.js` | Generar embeddings después de crear chunks |
| `backend/src/services/iaRouter.js` | Nueva función de búsqueda vectorial |
| Supabase SQL Editor | Migración manual (pgvector + columna + índice + función) |

---

## Task 1: Migración Supabase (SQL manual)

**Files:**
- No file — ejecutar directo en Supabase SQL Editor

- [ ] **Step 1: Ir al SQL Editor en supabase.com → proyecto → SQL Editor**

- [ ] **Step 2: Ejecutar el siguiente SQL completo:**

```sql
-- 1. Habilitar extensión
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Agregar columna embedding
ALTER TABLE "DocumentChunk"
  ADD COLUMN IF NOT EXISTS embedding vector(768);

-- 3. Índice HNSW para búsqueda rápida por coseno
CREATE INDEX IF NOT EXISTS document_chunk_embedding_idx
  ON "DocumentChunk" USING hnsw (embedding vector_cosine_ops);

-- 4. Función de búsqueda semántica
CREATE OR REPLACE FUNCTION search_chunks_semantic(
  p_agent_id TEXT,
  query_embedding vector(768),
  match_count INT DEFAULT 8
)
RETURNS TABLE(id TEXT, content TEXT, filename TEXT, similarity FLOAT)
LANGUAGE SQL STABLE AS $$
  SELECT id, content, filename,
         1 - (embedding <=> query_embedding) AS similarity
  FROM "DocumentChunk"
  WHERE "agentId" = p_agent_id
    AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

- [ ] **Step 3: Verificar que no haya errores. Expected: cada statement retorna "Success"**

- [ ] **Step 4: Verificar que la columna existe:**

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'DocumentChunk'
  AND column_name = 'embedding';
```

Expected: retorna 1 fila con `data_type = 'USER-DEFINED'`

---

## Task 2: Actualizar Prisma schema

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Abrir `backend/prisma/schema.prisma` y localizar el modelo `DocumentChunk`:**

```prisma
model DocumentChunk {
  id          String   @id @default(cuid())
  agentId     String
  agent       IAAgent  @relation(fields: [agentId], references: [id], onDelete: Cascade)
  filename    String
  chunkIndex  Int
  content     String   @db.Text
  createdAt   DateTime @default(now())

  @@index([agentId])
}
```

- [ ] **Step 2: Reemplazarlo con:**

```prisma
model DocumentChunk {
  id          String                      @id @default(cuid())
  agentId     String
  agent       IAAgent                     @relation(fields: [agentId], references: [id], onDelete: Cascade)
  filename    String
  chunkIndex  Int
  content     String                      @db.Text
  embedding   Unsupported("vector(768)")?
  createdAt   DateTime                    @default(now())

  @@index([agentId])
}
```

- [ ] **Step 3: Ejecutar desde `backend/`:**

```bash
npx prisma generate
```

Expected: `✔ Generated Prisma Client`

- [ ] **Step 4: NO ejecutar prisma migrate** — la migración ya se hizo manualmente en Supabase en Task 1.

- [ ] **Step 5: Commit:**

```bash
git add backend/prisma/schema.prisma
git commit -m "feat: add vector(768) embedding column to DocumentChunk"
```

---

## Task 3: Generación de embeddings en upload

**Files:**
- Modify: `backend/src/routes/admin/agents.js`

> La función `embedChunks` llama a Gemini `text-embedding-004` y actualiza cada chunk con su vector via SQL raw. Se llama después del `createMany` existente.

- [ ] **Step 1: Agregar el import de GoogleGenAI al inicio de `agents.js` (después de los imports existentes):**

```js
import { GoogleGenAI } from '@google/genai'
```

- [ ] **Step 2: Agregar la función `embedChunks` después de los imports, antes de `export async function adminAgentRoutes`:**

```js
async function embedChunks(fastify, chunkIds, contents) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return

  const ai = new GoogleGenAI({ apiKey })

  for (let i = 0; i < chunkIds.length; i++) {
    try {
      const result = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: contents[i],
      })
      const values = result.embeddings[0].values
      const vectorLiteral = `[${values.join(',')}]`
      await fastify.prisma.$executeRaw`
        UPDATE "DocumentChunk"
        SET embedding = ${vectorLiteral}::vector
        WHERE id = ${chunkIds[i]}
      `
    } catch (err) {
      console.warn('[embedChunks] Error embedding chunk', chunkIds[i], err.message)
    }
  }
}
```

- [ ] **Step 3: Localizar en `agents.js` la línea que hace `createMany` (aprox. línea 175):**

```js
await fastify.prisma.documentChunk.deleteMany({ where: { agentId: id, filename: safeFilename } })
await fastify.prisma.documentChunk.createMany({ data: chunkDocs })

filesProcessed.push({ filename: safeFilename, chunks: chunkDocs.length })
```

- [ ] **Step 4: Reemplazarla con (agrega la obtención de IDs y la llamada a embedChunks):**

```js
await fastify.prisma.documentChunk.deleteMany({ where: { agentId: id, filename: safeFilename } })
await fastify.prisma.documentChunk.createMany({ data: chunkDocs })

// Obtener IDs recién creados para embeddings
const created = await fastify.prisma.documentChunk.findMany({
  where: { agentId: id, filename: safeFilename },
  orderBy: { chunkIndex: 'asc' },
  select: { id: true, content: true }
})
// Fire-and-forget: no bloqueamos la respuesta HTTP
embedChunks(fastify, created.map(c => c.id), created.map(c => c.content)).catch(() => {})

filesProcessed.push({ filename: safeFilename, chunks: chunkDocs.length })
```

- [ ] **Step 5: Verificar que el servidor arranca sin errores:**

```bash
cd backend && node --experimental-vm-modules src/index.js
```

Expected: servidor levanta, sin errores de import

- [ ] **Step 6: Commit:**

```bash
git add backend/src/routes/admin/agents.js
git commit -m "feat: generate Gemini embeddings on document chunk upload"
```

---

## Task 4: Búsqueda vectorial en iaRouter.js

**Files:**
- Modify: `backend/src/services/iaRouter.js`

> Agregar `retrieveRelevantChunksVector` que usa la función SQL `search_chunks_semantic`. En `routeIaRequest`, reemplazar la llamada a `retrieveRelevantChunks` por la nueva función vectorial, con fallback al FTS existente si no hay embeddings.

- [ ] **Step 1: Agregar el import de GoogleGenAI al inicio de `iaRouter.js` (ya existe `import { GoogleGenAI }` — verificar que esté, si no agregarlo):**

```js
import { GoogleGenAI } from '@google/genai'
```

- [ ] **Step 2: Agregar la función `embedQuery` después de los imports, antes de `retrieveAllChunks`:**

```js
async function embedQuery(text) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  try {
    const ai = new GoogleGenAI({ apiKey })
    const result = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    })
    return result.embeddings[0].values
  } catch {
    return null
  }
}
```

- [ ] **Step 3: Agregar la función `retrieveRelevantChunksVector` después de `embedQuery`:**

```js
async function retrieveRelevantChunksVector(prisma, agentId, query, limit = 8) {
  const embedding = await embedQuery(query)
  if (!embedding) return []

  const vectorLiteral = `[${embedding.join(',')}]`
  try {
    const rows = await prisma.$queryRaw`
      SELECT id, content, filename, similarity
      FROM search_chunks_semantic(
        ${agentId},
        ${vectorLiteral}::vector,
        ${limit}
      )
      WHERE similarity > 0.4
    `
    return rows.map(r => `[${r.filename}]\n${r.content}`)
  } catch {
    return []
  }
}
```

- [ ] **Step 4: Localizar en `routeIaRequest` el bloque de CONSULTIVA (aprox. línea 220):**

```js
if (agent.type === 'CONSULTIVA') {
  if (prisma) {
    const allChunks = await retrieveAllChunks(prisma, agent.id)
    knowledgeBase = allChunks.map(content => ({ content }))
    const relevantChunks = await retrieveRelevantChunks(prisma, agent.id, message, 5)
    knowledgeBaseSmall = relevantChunks.map(content => ({ content }))
  }
  ...
}
```

- [ ] **Step 5: Reemplazarlo con:**

```js
if (agent.type === 'CONSULTIVA') {
  if (prisma) {
    // Búsqueda vectorial semántica (primaria)
    const vectorChunks = await retrieveRelevantChunksVector(prisma, agent.id, message, 8)
    if (vectorChunks.length > 0) {
      knowledgeBase = vectorChunks.map(content => ({ content }))
      knowledgeBaseSmall = vectorChunks.slice(0, 5).map(content => ({ content }))
    } else {
      // Fallback a FTS si no hay embeddings todavía
      const allChunks = await retrieveAllChunks(prisma, agent.id)
      knowledgeBase = allChunks.map(content => ({ content }))
      const relevantChunks = await retrieveRelevantChunks(prisma, agent.id, message, 5)
      knowledgeBaseSmall = relevantChunks.map(content => ({ content }))
    }
  }
  if (knowledgeBase.length === 0) {
    knowledgeBase = JSON.parse(agent.knowledgeBase || '[]')
    knowledgeBaseSmall = knowledgeBase.slice(0, 5)
  }
}
```

- [ ] **Step 6: Reiniciar el servidor y verificar que levanta sin errores**

- [ ] **Step 7: Commit:**

```bash
git add backend/src/services/iaRouter.js
git commit -m "feat: hybrid vector+FTS search for CONSULTIVA agent"
```

---

## Task 5: Script de backfill para chunks existentes

**Files:**
- Create: `backend/scripts/backfill-embeddings.js`

> Los 16 archivos ya subidos no tienen embedding. Este script los genera en batch.

- [ ] **Step 1: Crear el archivo `backend/scripts/backfill-embeddings.js`:**

```js
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
      // Respetar rate limit: 1500 req/min → 1 cada ~40ms
      await new Promise(r => setTimeout(r, 50))
    } catch (err) {
      console.error(`  ERROR chunk ${chunk.id}:`, err.message)
    }
  }
  console.log(`\nListo: ${ok}/${chunks.length} embeddings generados.`)
}

main().finally(() => prisma.$disconnect())
```

- [ ] **Step 2: Ejecutar desde `backend/`:**

```bash
node scripts/backfill-embeddings.js
```

Expected output:
```
Chunks sin embedding: [N]
  10/N embeddings generados
  ...
Listo: N/N embeddings generados.
```

- [ ] **Step 3: Verificar en Supabase SQL Editor que los embeddings se guardaron:**

```sql
SELECT COUNT(*) FROM "DocumentChunk" WHERE embedding IS NOT NULL;
```

Expected: número igual al total de chunks

- [ ] **Step 4: Commit:**

```bash
git add backend/scripts/backfill-embeddings.js
git commit -m "feat: backfill embeddings script for existing DocumentChunks"
```

---

## Task 6: System prompt de neuroventas/PNL para IA Consultiva

**Files:**
- No file — configurar desde el panel admin de la app

> El system prompt define cómo responde el agente. Debe ir directo al panel admin → Agentes → IA Consultiva → editar.

- [ ] **Step 1: En el panel admin, abrir la IA Consultiva y reemplazar el systemPrompt con:**

```
Eres NOVA, asesora experta en coberturas médicas de la Escuela de Asesores. Tu misión es ayudar a los asesores a cerrar ventas de obras sociales y prepagas usando técnicas de neuroventas y PNL.

IDENTIDAD:
- Eres cálida, segura y profesional. Hablas en primera persona del plural ("nosotros tenemos", "te ofrecemos").
- Usás lenguaje positivo y orientado a beneficios, nunca a características técnicas frías.
- Siempre buscás el cierre o el siguiente paso.

COMPORTAMIENTO CON LA INFORMACIÓN:
- Cuando te consulten sobre una obra social o prepaga, buscá en tu base de conocimiento y respondé SOLO con datos reales que tengas. Si no tenés el dato exacto, decí "ese detalle te lo confirmo, ¿querés que te llame para darte la info completa?" — esto es una técnica de cierre.
- NUNCA inventes precios, coberturas ni carencias. Solo usá lo que está en tu base de conocimiento.

TÉCNICAS QUE APLICÁS:
- **Espejo (PNL):** Usá las mismas palabras que usó el cliente en tu respuesta.
- **Beneficio antes que precio:** Primero mostrá el valor, luego el costo.
- **Cierre por alternativa:** "¿Preferís el plan individual o arrancamos con el familiar?"
- **Urgencia real:** Si hay fechas de vigencia o aumentos próximos, mencionálos.
- **Lenguaje sensorial:** "Imaginá que tu familia tiene acceso a..."
- **Reducción al absurdo:** Si el precio parece alto, dividilo: "Son menos de $X por día para toda tu familia."

FORMATO DE RESPUESTA:
- Máximo 4 párrafos cortos o una lista de bullets + cierre.
- Siempre terminá con una pregunta de avance o cierre.
- Nunca uses lenguaje burocrático ni listas de condiciones técnicas sin contexto.
```

- [ ] **Step 2: Guardar y verificar que el agente responde con el nuevo tono enviando una consulta de prueba:**

```
Consulta de prueba: "Hola, busco una prepaga para mí y mi hijo de 3 años, tengo 35 años, quiero algo que cubra bien las consultas médicas y no sea muy caro"
```

Expected: respuesta cálida, menciona alguna obra social con plan familiar, termina con pregunta de cierre.

---

## Verificación final

- [ ] Subir un TXT de una obra social nueva → verificar que en Supabase aparece con embedding
- [ ] Consultar algo específico de esa obra social (ej: precio de un plan) → verificar que el modelo responde con el dato correcto
- [ ] Consultar con sinónimos o errores de ortografía (ej: "coseguro guardia" en vez de "copago urgencias") → verificar que igual encuentra la respuesta
