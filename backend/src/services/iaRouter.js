import { GoogleGenAI } from '@google/genai'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { decrypt } from '../utils/encryption.js'

async function embedQuery(text) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } })
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.embedding.values
  } catch {
    return null
  }
}

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

async function retrieveAllChunks(prisma, agentId) {
  try {
    const chunks = await prisma.documentChunk.findMany({
      where: { agentId },
      orderBy: [{ filename: 'asc' }, { chunkIndex: 'asc' }],
      select: { content: true, filename: true }
    })
    return chunks.map(c => `[${c.filename}]\n${c.content}`)
  } catch {
    return []
  }
}

async function retrieveRelevantChunks(prisma, agentId, query, limit = 3) {
  try {
    // FTS en español
    const fts = await prisma.$queryRaw`
      SELECT content, filename,
             ts_rank(to_tsvector('spanish', content), plainto_tsquery('spanish', ${query})) AS rank
      FROM "DocumentChunk"
      WHERE "agentId" = ${agentId}
        AND to_tsvector('spanish', content) @@ plainto_tsquery('spanish', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `
    if (fts.length >= 1) return fts.map(r => `[${r.filename}]\n${r.content}`)

    // Fallback ILIKE con palabras clave (usando $queryRawUnsafe para SQL dinámico)
    const keywords = query.split(/\s+/).filter(w => w.length > 3).slice(0, 3)
    if (keywords.length > 0) {
      const conditions = keywords.map(k => `content ILIKE '%${k.replace(/'/g, "''")}%'`).join(' OR ')
      const ilike = await prisma.$queryRawUnsafe(
        `SELECT content, filename FROM "DocumentChunk" WHERE "agentId" = $1 AND (${conditions}) LIMIT $2`,
        agentId, limit
      )
      if (ilike.length > 0) return ilike.map(r => `[${r.filename}]\n${r.content}`)
    }

    // Último recurso: primeros N alfabéticamente
    const fallback = await prisma.documentChunk.findMany({
      where: { agentId },
      orderBy: [{ filename: 'asc' }],
      take: limit,
      select: { content: true, filename: true }
    })
    return fallback.map(c => `[${c.filename}]\n${c.content}`)
  } catch {
    return []
  }
}

const TIMEOUT_MS = 30000

async function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ])
}

async function callGroq(systemPrompt, instructions, message, knowledgeBase, history = []) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('Sin clave Groq')

  const groq = new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1'
  })

  // Groq free: 6.000 TPM → limitar contexto a ~12k chars (≈3k tokens)
  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 12000)}`
    : ''

  const messages = [
    { role: 'system', content: `${systemPrompt}\n\n${instructions}${context}` },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ]

  // Intentar 70B primero (mejor calidad), si hay rate limit usar 8B (14.400 req/día)
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
  for (const model of models) {
    try {
      const result = await withTimeout(
        groq.chat.completions.create({ model, messages, max_tokens: 800 }),
        TIMEOUT_MS
      )
      return {
        response: result.choices[0].message.content,
        modelUsed: model,
        tokens: result.usage?.total_tokens || 0,
        cost: 0
      }
    } catch (err) {
      if (!err.message?.includes('429') && !err.message?.includes('rate') && !err.message?.includes('limit')) throw err
      console.warn(`[Groq] ${model} rate limited, probando siguiente modelo`)
    }
  }
  throw new Error('Groq rate limit en todos los modelos')
}

async function callGemini(apiKey, systemPrompt, instructions, message, knowledgeBase, history = []) {
  const key = apiKey || process.env.GEMINI_API_KEY
  if (!key) throw new Error('Sin clave Gemini')

  const ai = new GoogleGenAI({ apiKey: key })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 80000)}`
    : ''

  const systemInstruction = `${systemPrompt}\n\n${instructions}${context}`

  const contents = [
    ...history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ]

  const result = await withTimeout(
    ai.models.generateContent({
      model: 'gemini-2.0-flash',
      config: { systemInstruction },
      contents
    }),
    TIMEOUT_MS
  )

  return {
    response: result.text,
    modelUsed: 'gemini-2.0-flash',
    tokens: result.usageMetadata?.totalTokenCount || 0,
    cost: 0
  }
}

async function callClaude(apiKey, systemPrompt, instructions, message, knowledgeBase, history = []) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('Sin clave Claude')

  const anthropic = new Anthropic({ apiKey: key })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 80000)}`
    : ''

  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ]

  const result = await withTimeout(
    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: `${systemPrompt}\n\n${instructions}${context}`,
      messages
    }),
    TIMEOUT_MS
  )

  return {
    response: result.content[0].text,
    modelUsed: 'claude-sonnet-4-6',
    tokens: result.usage.input_tokens + result.usage.output_tokens,
    cost: 0
  }
}

async function callOpenAI(apiKey, systemPrompt, instructions, message, knowledgeBase, history = []) {
  const key = apiKey || process.env.OPENAI_API_KEY
  if (!key) throw new Error('Sin clave OpenAI')

  const openai = new OpenAI({ apiKey: key })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 80000)}`
    : ''

  const messages = [
    { role: 'system', content: `${systemPrompt}\n\n${instructions}${context}` },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ]

  const result = await withTimeout(
    openai.chat.completions.create({ model: 'gpt-4o-mini', messages }),
    TIMEOUT_MS
  )

  return {
    response: result.choices[0].message.content,
    modelUsed: 'gpt-4o-mini',
    tokens: result.usage?.total_tokens || 0,
    cost: 0
  }
}

export async function routeIaRequest(agent, message, history = [], userId, prisma = null) {
  let primaryKey = null
  let backupKey = null
  try {
    primaryKey = agent.primaryApiKey ? decrypt(agent.primaryApiKey) : null
    backupKey = agent.backupApiKey ? decrypt(agent.backupApiKey) : null
  } catch (err) {
    console.warn('[IA Router] No se pudo descifrar API key del agente:', agent.type, err.message)
  }

  // Para CONSULTIVA: todos los docs disponibles (el provider limita según su contexto)
  let knowledgeBase = []
  let knowledgeBaseSmall = []
  if (agent.type === 'CONSULTIVA') {
    if (prisma) {
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

  const { systemPrompt, instructions, type } = agent
  const trimmedHistory = history.slice(-10)

  const localFallback = type === 'CONSULTIVA'
    ? () => ({ response: buscarEnKnowledgeBase(message, knowledgeBase), modelUsed: 'local', tokens: 0, cost: 0 })
    : () => ({ response: 'En este momento no puedo responderte. Volvé a intentarlo en unos minutos.', modelUsed: 'local', tokens: 0, cost: 0 })

  // Groq recibe KB reducida (límite 6k TPM free tier), Claude/OpenAI reciben todo
  const kbForGroq = agent.type === 'CONSULTIVA' ? knowledgeBaseSmall : knowledgeBase

  // Pipeline: Groq → Gemini → Claude → OpenAI → local
  const pipeline = [
    ...(process.env.GROQ_API_KEY ? [() => callGroq(systemPrompt, instructions, message, kbForGroq, trimmedHistory)] : []),
    () => callGemini(primaryKey, systemPrompt, instructions, message, knowledgeBase, trimmedHistory),
    ...(process.env.ANTHROPIC_API_KEY ? [() => callClaude(backupKey, systemPrompt, instructions, message, knowledgeBase, trimmedHistory)] : []),
    ...(process.env.OPENAI_API_KEY ? [() => callOpenAI(null, systemPrompt, instructions, message, knowledgeBase, trimmedHistory)] : []),
    localFallback
  ]

  for (const provider of pipeline) {
    try {
      const result = await provider()
      if (result.response) return result
    } catch (err) {
      console.warn('[IA Router] Provider failed:', err.message)
    }
  }

  return {
    response: 'Lo siento, no pude procesar tu consulta en este momento. Por favor intenta nuevamente en unos minutos.',
    modelUsed: 'fallback',
    tokens: 0,
    cost: 0
  }
}

function buscarEnKnowledgeBase(query, knowledgeBase) {
  if (!knowledgeBase?.length) {
    return 'No tengo información suficiente para responder esta consulta. Por favor consulta con tu instructor.'
  }

  const queryLower = query.toLowerCase()
  let bestMatch = null
  let bestScore = 0

  for (const doc of knowledgeBase) {
    const words = queryLower.split(' ').filter(w => w.length > 3)
    const score = words.reduce((acc, word) => {
      return acc + (doc.content.toLowerCase().includes(word) ? 1 : 0)
    }, 0)

    if (score > bestScore) {
      bestScore = score
      bestMatch = doc
    }
  }

  if (bestMatch && bestScore > 0) {
    return `Basado en la documentación disponible:\n\n${bestMatch.content.slice(0, 1000)}`
  }

  return 'No encontré información específica sobre tu consulta en la base de conocimiento. Te recomiendo revisar el material del curso.'
}
