'use client'
import { useQuery } from '@tanstack/react-query'
import { agentApi } from '@/lib/api'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { Loader2, AlertCircle } from 'lucide-react'

export default function IaMentalidadPage() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents-list'],
    queryFn: () => agentApi.list().then(r => r.data)
  })

  const agent = agents?.find((a: any) => a.type === 'MENTOR' && a.published)

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
          <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>IA Mentalidad no disponible</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            El agente IA Mentalidad no está disponible en este momento. Contacta al administrador.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] -m-6 md:-m-8">
      <ChatInterface agent={agent} agentId={agent.id} />
    </div>
  )
}
