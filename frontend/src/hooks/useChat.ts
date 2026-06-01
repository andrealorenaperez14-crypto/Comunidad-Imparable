'use client'
import { useState, useCallback } from 'react'
import { agentApi } from '@/lib/api'
import type { ChatMessage } from '@/types'

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => {
      const updated = [...prev, userMessage]
      return updated
    })
    setIsLoading(true)
    setError(null)

    try {
      const history = messages
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }))

      const { data } = await agentApi.chat(agentId, content, history)

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        modelUsed: data.modelUsed,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      return data
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al conectar con el agente. Por favor intenta nuevamente.'
      setError(errorMsg)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [agentId, messages])

  const clearMessages = () => setMessages([])

  return { messages, isLoading, error, sendMessage, clearMessages }
}
