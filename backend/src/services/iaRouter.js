import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { decrypt } from '../utils/encryption.js'

async function retrieveRelevantChunks(prisma, agentId, query, limit = 6) {
  try {
    const results = await prisma.$queryRaw`
      SELECT content, filename,
             ts_rank(to_tsvector('spanish', content), plainto_tsquery('spanish', ${query})) AS rank
      FROM "DocumentChunk"
      WHERE "agentId" = ${agentId}
        AND to_tsvector('spanish', content) @@ plainto_tsquery('spanish', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `
    if (results.length > 0) return results.map(r => r.content)

    // fallback: si no matchea, devolver los primeros chunks
    const fallback = await prisma.documentChunk.findMany({
      where: { agentId },
      orderBy: [{ filename: 'asc' }, { chunkIndex: 'asc' }],
      take: limit,
      select: { content: true }
    })
    return fallback.map(r => r.content)
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

async function callGemini(apiKey, systemPrompt, instructions, message, knowledgeBase) {
  const key = apiKey || process.env.GEMINI_API_KEY
  if (!key) throw new Error('Sin clave Gemini')

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
    : ''

  const fullPrompt = `${systemPrompt}\n\n${instructions}${context}\n\nUsuario: ${message}`

  const result = await withTimeout(model.generateContent(fullPrompt), TIMEOUT_MS)
  const response = result.response.text()

  return {
    response,
    modelUsed: 'gemini-1.5-pro',
    tokens: result.response.usageMetadata?.totalTokenCount || 0,
    cost: 0
  }
}

async function callClaude(apiKey, systemPrompt, instructions, message, knowledgeBase) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('Sin clave Claude')

  const anthropic = new Anthropic({ apiKey: key })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
    : ''

  const result = await withTimeout(
    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: `${systemPrompt}\n\n${instructions}${context}`,
      messages: [{ role: 'user', content: message }]
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

async function callOpenAI(apiKey, systemPrompt, instructions, message, knowledgeBase) {
  const key = apiKey || process.env.OPENAI_API_KEY
  if (!key) throw new Error('Sin clave OpenAI')

  const openai = new OpenAI({ apiKey: key })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
    : ''

  const result = await withTimeout(
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `${systemPrompt}\n\n${instructions}${context}` },
        { role: 'user', content: message }
      ]
    }),
    TIMEOUT_MS
  )

  return {
    response: result.choices[0].message.content,
    modelUsed: 'gpt-4o-mini',
    tokens: result.usage?.total_tokens || 0,
    cost: 0
  }
}

export async function routeIaRequest(agent, message, userId, prisma = null) {
  let primaryKey = null
  let backupKey = null
  try {
    primaryKey = agent.primaryApiKey ? decrypt(agent.primaryApiKey) : null
    backupKey = agent.backupApiKey ? decrypt(agent.backupApiKey) : null
  } catch {
    // Keys can't be decrypted — proceed without them, fall back to env vars
  }

  // RAG: buscar chunks relevantes en DB, fallback al JSON legacy
  let knowledgeBase = []
  if (prisma) {
    const chunks = await retrieveRelevantChunks(prisma, agent.id, message)
    knowledgeBase = chunks.map(content => ({ content }))
  }
  if (knowledgeBase.length === 0) {
    knowledgeBase = JSON.parse(agent.knowledgeBase || '[]')
  }

  const { systemPrompt, instructions, type } = agent

  // COACH: Gemini → Claude → OpenAI GPT-4
  const coachPipeline = [
    () => callGemini(primaryKey, systemPrompt, instructions, message, knowledgeBase),
    () => callClaude(backupKey, systemPrompt, instructions, message, knowledgeBase),
    () => callOpenAI(null, systemPrompt, instructions, message, knowledgeBase)
  ]

  // MENTALIDAD: Gemini → Claude → OpenAI GPT-4
  const mentalidadPipeline = [
    () => callGemini(primaryKey, systemPrompt, instructions, message, knowledgeBase),
    () => callClaude(backupKey, systemPrompt, instructions, message, knowledgeBase),
    () => callOpenAI(null, systemPrompt, instructions, message, knowledgeBase)
  ]

  // CONSULTIVA: Gemini Pro → Claude Sonnet → Local knowledge base
  const consultivaPipeline = [
    () => callGemini(primaryKey, systemPrompt, instructions, message, knowledgeBase),
    () => callClaude(backupKey, systemPrompt, instructions, message, knowledgeBase),
    () => ({ response: buscarEnKnowledgeBase(message, knowledgeBase), modelUsed: 'local', tokens: 0, cost: 0 })
  ]

  let pipeline
  if (type === 'CONSULTIVO') pipeline = coachPipeline
  else if (type === 'MENTOR') pipeline = mentalidadPipeline
  else pipeline = consultivaPipeline

  for (const provider of pipeline) {
    try {
      const result = await provider()
      if (result.response) return result
    } catch (err) {
      // Intentar siguiente proveedor
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
