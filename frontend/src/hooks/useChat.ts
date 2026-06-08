'use client'
import { useState, useCallback, useRef } from 'react'
import { agentApi } from '@/lib/api'
import type { ChatMessage } from '@/types'

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesRef = useRef<ChatMessage[]>(messages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null)

  messagesRef.current = messages

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const history = messagesRef.current
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
      if (data.dailyRemaining !== undefined) setDailyRemaining(data.dailyRemaining)
      return data
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al conectar con el agente. Por favor intenta nuevamente.'
      setError(errorMsg)
      if (err.response?.status === 429) setDailyRemaining(0)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  const clearMessages = () => setMessages([])

  return { messages, isLoading, error, dailyRemaining, sendMessage, clearMessages }
}
