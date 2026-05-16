'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Save, Upload, Eye, EyeOff, Loader2, ArrowLeft, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { adminAgentApi } from '@/lib/api'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default function AgentEditorPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [showPrimaryKey, setShowPrimaryKey] = useState(false)
  const [showBackupKey, setShowBackupKey] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'logs'>('config')
  const [uploadStatus, setUploadStatus] = useState('')

  const { data: agents } = useQuery({
    queryKey: ['admin-agents'],
    queryFn: () => adminAgentApi.list().then(r => r.data)
  })

  const agent = agents?.find((a: any) => a.id === id)

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: agent
  })

  const updateMutation = useMutation({
    mutationFn: (data: object) => adminAgentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] })
      alert('Agente guardado exitosamente.')
    }
  })

  const uploadKnowledge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const formData = new FormData()
    for (const file of Array.from(files)) {
      formData.append('files', file)
    }

    setUploadStatus('Cargando...')
    try {
      await adminAgentApi.uploadKnowledge(id, formData)
      setUploadStatus('✅ Archivo(s) cargado(s) correctamente')
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] })
    } catch {
      setUploadStatus('❌ Error al cargar el archivo')
    }
  }

  if (!agent) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/agentes" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">{agent.icon}</span>
            {agent.name}
          </h1>
          <p className="text-gray-400 text-sm">{agent.type} · {agent.published ? '🟢 Publicado' : '⚫ Borrador'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
        {(['config', 'preview', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'config' ? 'Configuración' : tab === 'preview' ? 'Vista previa' : 'Registros'}
          </button>
        ))}
      </div>

      {activeTab === 'config' && (
        <form onSubmit={handleSubmit(data => updateMutation.mutate(data))} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold">Información básica</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre del agente</label>
                <input
                  {...register('name')}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                <input
                  {...register('description')}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Icono (emoji)</label>
                <input
                  {...register('icon')}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold">Claves de API</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Clave primaria</label>
                <div className="relative">
                  <input
                    {...register('primaryApiKey')}
                    type={showPrimaryKey ? 'text' : 'password'}
                    placeholder="Ingresa nueva clave (deja vacío para mantener)"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrimaryKey(!showPrimaryKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPrimaryKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Clave de respaldo</label>
                <div className="relative">
                  <input
                    {...register('backupApiKey')}
                    type={showBackupKey ? 'text' : 'password'}
                    placeholder="Clave de respaldo"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBackupKey(!showBackupKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showBackupKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Prompt del sistema</h2>
            <textarea
              {...register('systemPrompt')}
              rows={8}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
              placeholder="Define el comportamiento base del agente..."
            />
          </div>

          {/* Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Instrucciones adicionales</h2>
            <textarea
              {...register('instructions')}
              rows={5}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
              placeholder="Instrucciones específicas de comportamiento..."
            />
          </div>

          {/* Knowledge Base */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Base de conocimiento</h2>
            <p className="text-gray-400 text-sm">Sube archivos PDF, TXT o JSON para enriquecer al agente</p>

            <label className="flex items-center gap-3 p-4 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 transition-all">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">Seleccionar archivos (PDF, TXT, JSON)</span>
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.json"
                onChange={uploadKnowledge}
                className="hidden"
              />
            </label>

            {uploadStatus && (
              <p className="text-sm text-gray-300">{uploadStatus}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            {(isSubmitting || updateMutation.isPending)
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Save className="w-5 h-5" />}
            Guardar cambios
          </button>
        </form>
      )}

      {activeTab === 'preview' && (
        <div className="bg-[#0F1629] border border-white/10 rounded-2xl overflow-hidden" style={{ height: '70vh' }}>
          <ChatInterface agent={agent} agentId={agent.id} />
        </div>
      )}

      {activeTab === 'logs' && (
        <AgentLogs agentId={id} />
      )}
    </div>
  )
}

function AgentLogs({ agentId }: { agentId: string }) {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['agent-logs', agentId],
    queryFn: () => adminAgentApi.interactions(agentId).then(r => r.data)
  })

  return (
    <div className="space-y-3">
      <h2 className="text-white font-semibold">Registro de interacciones</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay interacciones registradas aún.</div>
      ) : (
        logs.map((log: any) => (
          <div key={log.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{log.studentName}</span>
              <span className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{log.modelUsed}</span>
                {new Date(log.createdAt).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="bg-blue-500/10 rounded-lg px-3 py-2 text-sm text-blue-200">{log.message}</div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 line-clamp-3">{log.response}</div>
          </div>
        ))
      )}
    </div>
  )
}
