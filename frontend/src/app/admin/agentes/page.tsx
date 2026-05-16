'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Brain, Settings, Power, Eye, MessageSquare, Loader2, Plus } from 'lucide-react'
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
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agentes IA</h1>
          <p className="text-gray-400 mt-1">Configura y gestiona los agentes de la plataforma</p>
        </div>
      </div>

      <div className="grid gap-4">
        {agents.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {agent.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold text-lg">{agent.name}</h3>
                      <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                        {agent.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{agent.description || '—'}</p>
                  </div>

                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    agent.published
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    <Power className="w-3 h-3" />
                    {agent.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {agent._count?.interactions || 0} interacciones
                  </span>
                  {agent.publishedDate && (
                    <span>Publicado {formatDate(agent.publishedDate)}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/admin/agentes/${agent.id}`}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Configurar
                  </Link>

                  <button
                    onClick={() => publishMutation.mutate(agent.id)}
                    disabled={publishMutation.isPending}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      agent.published
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {agent.published ? 'Despublicar' : 'Publicar'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {agents.length === 0 && (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No hay agentes configurados aún.</p>
            <p className="text-gray-500 text-sm mt-1">Ejecuta el seed de base de datos para crear los agentes base.</p>
          </div>
        )}
      </div>
    </div>
  )
}
