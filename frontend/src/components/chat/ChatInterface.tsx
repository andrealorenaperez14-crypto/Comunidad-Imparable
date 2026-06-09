'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, User, Zap, Copy, Check, MessageCircle } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import type { IAAgent } from '@/types'

interface Props {
  agent: IAAgent
  agentId: string
}

const MODEL_LABELS: Record<string, string> = {
  'llama-3.3-70b-versatile': 'Groq',
  'gemini-2.0-flash': 'Gemini',
  'gemini-1.5-pro': 'Gemini',
  'gemini-2.0-flash-lite': 'Gemini',
  'claude-sonnet-4-6': 'Claude',
  'claude-haiku-4-5-20251001': 'Claude',
  'gpt-4o-mini': 'GPT-4',
  'local': 'Base local',
  'fallback': 'Fallback'
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--color-gold)' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all opacity-60 hover:opacity-100"
      style={{ color: 'var(--color-text-muted)' }}
      title="Copiar respuesta"
    >
      {copied
        ? <><Check className="w-3 h-3" strokeWidth={2} /><span>Copiado</span></>
        : <><Copy className="w-3 h-3" strokeWidth={1.5} /><span>Copiar</span></>}
    </button>
  )
}

export function ChatInterface({ agent, agentId }: Props) {
  const [input, setInput] = useState('')
  const { messages, isLoading, dailyRemaining, sendMessage } = useChat(agentId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const isLimitReached = dailyRemaining === 0

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || isLimitReached) return
    setInput('')
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)' }}>
      {/* Agent header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--color-separator)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)' }}
        >
          <Bot className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>{agent.name}</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{agent.description}</p>
        </div>
        {dailyRemaining !== null && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium flex-shrink-0"
            style={{
              background: dailyRemaining === 0
                ? 'rgba(239,68,68,0.1)'
                : dailyRemaining <= 2
                  ? 'rgba(196,151,42,0.15)'
                  : 'rgba(196,151,42,0.08)',
              border: `1px solid ${dailyRemaining === 0 ? 'rgba(239,68,68,0.3)' : 'var(--color-gold-border)'}`,
              color: dailyRemaining === 0
                ? '#ef4444'
                : dailyRemaining <= 2
                  ? 'var(--color-gold)'
                  : 'var(--color-text-muted)'
            }}
          >
            <MessageCircle className="w-3 h-3" strokeWidth={1.5} />
            <span>{dailyRemaining} / 5 hoy</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)' }}
            >
              <Bot className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
              Soy {agent.name}
            </h3>
            <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--color-text-muted)' }}>{agent.description}</p>
            <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>¿En qué puedo ayudarte hoy?</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={msg.role === 'user'
                  ? { background: 'var(--color-gold)' }
                  : { background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }
                }
              >
                {msg.role === 'user'
                  ? <User className="w-4 h-4" style={{ color: '#0C0C0C' }} strokeWidth={1.5} />
                  : <Bot className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />}
              </div>

              <div
                className="rounded-2xl px-4 py-3"
                style={msg.role === 'user'
                  ? { background: 'var(--color-gold)', color: '#0C0C0C', borderTopRightRadius: '4px' }
                  : { background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)', borderTopLeftRadius: '4px' }
                }
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50">
                    {msg.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.modelUsed && msg.role === 'assistant' && (
                    <span className="flex items-center gap-1 text-xs opacity-50">
                      <Zap className="w-3 h-3" strokeWidth={1.5} />
                      {MODEL_LABELS[msg.modelUsed] || msg.modelUsed}
                    </span>
                  )}
                  </div>
                  {msg.role === 'assistant' && <CopyButton text={msg.content} />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}
            >
              <Bot className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            </div>
            <div
              className="rounded-2xl"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', borderTopLeftRadius: '4px' }}
            >
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--color-separator)' }}>
        {isLimitReached ? (
          <div
            className="rounded-2xl px-4 py-3 text-sm text-center"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
          >
            Alcanzaste el límite de 5 consultas diarias. Volvé mañana.
          </div>
        ) : (
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-colors"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escribe tu consulta para ${agent.name}...`}
              rows={1}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm leading-relaxed max-h-32"
              style={{ minHeight: '24px', color: 'var(--color-text)' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-gold)' }}
              aria-label="Enviar mensaje"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#0C0C0C' }} />
                : <Send className="w-4 h-4" style={{ color: '#0C0C0C' }} strokeWidth={1.5} />}
            </button>
          </div>
        )}
        {!isLimitReached && (
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>Enter para enviar · Shift+Enter para nueva línea</p>
        )}
      </div>
    </div>
  )
}
