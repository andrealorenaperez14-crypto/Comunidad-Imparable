'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Brain, Settings, Power, Eye, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { adminAgentApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { IAAgent } from '@/types'

export default function AgentesAdminPage() {
  const queryClient = useQueryClient()

  const { data: agents = [], isLoading } = useQuery<IAAgent[]>({
    queryKey: ['admin-agents'],
    queryFn: () => adminAgentApi.list().then(r => r.data)
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => adminAgentApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-agents'] })
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Agentes IA</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Configura y gestiona los agentes de la plataforma</p>
      </div>

      <div className="grid gap-4">
        {agents.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)' }}
              >
                <Brain className="w-7 h-7" strokeWidth={1.5} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{agent.name}</h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }}
                      >
                        {agent.type}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{agent.description || '—'}</p>
                  </div>

                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    style={agent.published
                      ? { background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)' }
                      : { background: 'var(--color-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }
                    }
                  >
                    <Power className="w-3 h-3" strokeWidth={1.5} />
                    {agent.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {agent._count?.interactions || 0} interacciones
                  </span>
                  {agent.publishedDate && (
                    <span>Publicado {formatDate(agent.publishedDate)}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/admin/agentes/${agent.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{ background: 'var(--color-gold)', color: '#0C0C0C' }}
                  >
                    <Settings className="w-4 h-4" strokeWidth={1.5} />
                    Configurar
                  </Link>

                  <button
                    onClick={() => publishMutation.mutate(agent.id)}
                    disabled={publishMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={agent.published
                      ? { background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }
                      : { background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)' }
                    }
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                    {agent.published ? 'Despublicar' : 'Publicar'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {agents.length === 0 && (
          <div className="card text-center">
            <Brain className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
            <p style={{ color: 'var(--color-text-muted)' }}>No hay agentes configurados aún.</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Ejecuta el seed de base de datos para crear los agentes base.</p>
          </div>
        )}
      </div>
    </div>
  )
}
