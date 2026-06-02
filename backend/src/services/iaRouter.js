import { GoogleGenAI } from '@google/genai'
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

async function callGroq(systemPrompt, instructions, message, knowledgeBase, history = []) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('Sin clave Groq')

  const groq = new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1'
  })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
    : ''

  const messages = [
    { role: 'system', content: `${systemPrompt}\n\n${instructions}${context}` },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ]

  const result = await withTimeout(
    groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 4096
    }),
    TIMEOUT_MS
  )

  return {
    response: result.choices[0].message.content,
    modelUsed: 'llama-3.3-70b-versatile',
    tokens: result.usage?.total_tokens || 0,
    cost: 0
  }
}

async function callGemini(apiKey, systemPrompt, instructions, message, knowledgeBase, history = []) {
  const key = apiKey || process.env.GEMINI_API_KEY
  if (!key) throw new Error('Sin clave Gemini')

  const ai = new GoogleGenAI({ apiKey: key })

  const context = knowledgeBase?.length > 0
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
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
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
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
    ? `\n\nBase de conocimiento:\n${knowledgeBase.map(k => k.content).join('\n\n').slice(0, 10000)}`
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

  // RAG solo para CONSULTIVA
  let knowledgeBase = []
  if (agent.type === 'CONSULTIVA') {
    if (prisma) {
      const chunks = await retrieveRelevantChunks(prisma, agent.id, message)
      knowledgeBase = chunks.map(content => ({ content }))
    }
    if (knowledgeBase.length === 0) {
      knowledgeBase = JSON.parse(agent.knowledgeBase || '[]')
    }
  }

  const { systemPrompt, instructions, type } = agent
  const trimmedHistory = history.slice(-10)

  const localFallback = type === 'CONSULTIVA'
    ? () => ({ response: buscarEnKnowledgeBase(message, knowledgeBase), modelUsed: 'local', tokens: 0, cost: 0 })
    : () => ({ response: 'En este momento no puedo responderte. Volvé a intentarlo en unos minutos.', modelUsed: 'local', tokens: 0, cost: 0 })

  // Pipeline: Groq (primario, gratis) → Gemini → Claude → OpenAI → local
  const pipeline = [
    ...(process.env.GROQ_API_KEY ? [() => callGroq(systemPrompt, instructions, message, knowledgeBase, trimmedHistory)] : []),
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
