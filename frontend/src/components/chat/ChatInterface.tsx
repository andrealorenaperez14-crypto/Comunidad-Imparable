'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, User, Zap } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import type { IAAgent } from '@/types'

interface Props {
  agent: IAAgent
  agentId: string
}

const MODEL_LABELS: Record<string, string> = {
  'gemini-1.5-pro': 'Gemini',
  'claude-sonnet-4-6': 'Claude',
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
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

export function ChatInterface({ agent, agentId }: Props) {
  const [input, setInput] = useState('')
  const { messages, isLoading, sendMessage } = useChat(agentId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
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
    <div className="flex flex-col h-full bg-[#0F1629]">
      {/* Agent header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 rounded-xl flex items-center justify-center text-xl">
          {agent.icon}
        </div>
        <div>
          <h2 className="text-white font-semibold">{agent.name}</h2>
          <p className="text-gray-400 text-sm">{agent.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">{agent.icon}</span>
            <h3 className="text-white font-semibold text-lg mb-2">
              ¡Hola! Soy {agent.name}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">{agent.description}</p>
            <p className="text-gray-500 text-xs mt-3">¿En qué puedo ayudarte hoy?</p>
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
              {/* Avatar */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                msg.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gradient-to-br from-emerald-500 to-blue-500'
              )}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Bubble */}
              <div className={cn(
                'chat-bubble rounded-2xl px-4 py-3',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-white/8 border border-white/10 text-gray-100 rounded-tl-sm'
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs opacity-50">
                    {msg.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.modelUsed && msg.role === 'assistant' && (
                    <span className="flex items-center gap-1 text-xs opacity-50">
                      <Zap className="w-3 h-3" />
                      {MODEL_LABELS[msg.modelUsed] || msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-white/10">
        <div className="flex items-end gap-3 bg-white/5 border border-white/20 rounded-2xl px-4 py-3 focus-within:border-blue-500/50 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Escribe tu consulta para ${agent.name}...`}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            aria-label="Enviar mensaje"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">Enter para enviar · Shift+Enter para nueva línea</p>
      </div>
    </div>
  )
}
