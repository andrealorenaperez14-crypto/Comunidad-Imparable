'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Save, Upload, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { adminAgentApi } from '@/lib/api'
import { ChatInterface } from '@/components/chat/ChatInterface'

const inputClass = 'w-full rounded-xl px-4 py-3 focus:outline-none transition-all'
const inputStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-separator)',
  color: 'var(--color-text)'
}

export default function AgentEditorPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [showPrimaryKey, setShowPrimaryKey] = useState(false)
  const [showBackupKey, setShowBackupKey] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'logs'>('config')
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadOk, setUploadOk] = useState<boolean | null>(null)

  const { data: agent } = useQuery({
    queryKey: ['admin-agent', id],
    queryFn: () => adminAgentApi.get(id).then(r => r.data),
    enabled: !!id
  })

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: agent
  })

  const updateMutation = useMutation({
    mutationFn: (data: object) => adminAgentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agent', id] })
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
    setUploadOk(null)
    try {
      await adminAgentApi.uploadKnowledge(id, formData)
      setUploadStatus('Archivo(s) cargado(s) correctamente')
      setUploadOk(true)
      queryClient.invalidateQueries({ queryKey: ['admin-agent', id] })
    } catch {
      setUploadStatus('Error al cargar el archivo')
      setUploadOk(false)
    }
  }

  if (!agent) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/agentes" className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            {agent.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {agent.type} · {agent.published ? 'Publicado' : 'Borrador'}
          </p>
        </div>
      </div>

      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
      >
        {(['config', 'preview', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={activeTab === tab
              ? { background: 'var(--color-gold)', color: '#0C0C0C' }
              : { color: 'var(--color-text-muted)' }
            }
          >
            {tab === 'config' ? 'Configuración' : tab === 'preview' ? 'Vista previa' : 'Registros'}
          </button>
        ))}
      </div>

      {activeTab === 'config' && (
        <form onSubmit={handleSubmit(data => updateMutation.mutate(data))} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card space-y-4">
              <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Información básica</h2>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Nombre del agente</label>
                <input
                  {...register('name')}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Descripción</label>
                <input
                  {...register('description')}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>
            </div>

            <div className="card space-y-4">
              <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Claves de API</h2>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Clave primaria</label>
                <div className="relative">
                  <input
                    {...register('primaryApiKey')}
                    type={showPrimaryKey ? 'text' : 'password'}
                    placeholder="Ingresa nueva clave (deja vacío para mantener)"
                    className={`${inputClass} pr-12`}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrimaryKey(!showPrimaryKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {showPrimaryKey ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Clave de respaldo</label>
                <div className="relative">
                  <input
                    {...register('backupApiKey')}
                    type={showBackupKey ? 'text' : 'password'}
                    placeholder="Clave de respaldo"
                    className={`${inputClass} pr-12`}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBackupKey(!showBackupKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {showBackupKey ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Prompt del sistema</h2>
            <textarea
              {...register('systemPrompt')}
              rows={8}
              className="w-full rounded-xl px-4 py-3 focus:outline-none resize-none font-mono text-sm transition-all"
              style={inputStyle}
              placeholder="Define el comportamiento base del agente..."
              onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
            />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Instrucciones adicionales</h2>
            <textarea
              {...register('instructions')}
              rows={5}
              className="w-full rounded-xl px-4 py-3 focus:outline-none resize-none text-sm transition-all"
              style={inputStyle}
              placeholder="Instrucciones específicas de comportamiento..."
              onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
            />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Base de conocimiento</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Sube archivos PDF, TXT o JSON para enriquecer al agente</p>

            <label
              className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
              style={{ border: '2px dashed var(--color-separator)' }}
            >
              <Upload className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Seleccionar archivos (PDF, TXT, JSON)</span>
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.json"
                onChange={uploadKnowledge}
                className="hidden"
              />
            </label>

            {uploadStatus && (
              <p className="text-sm flex items-center gap-2" style={{ color: uploadOk === false ? '#F87171' : uploadOk ? '#4ADE80' : 'var(--color-text-muted)' }}>
                {uploadOk === true && <CheckCircle className="w-4 h-4" strokeWidth={1.5} />}
                {uploadOk === false && <XCircle className="w-4 h-4" strokeWidth={1.5} />}
                {uploadStatus}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {(isSubmitting || updateMutation.isPending)
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Save className="w-5 h-5" strokeWidth={1.5} />}
            Guardar cambios
          </button>
        </form>
      )}

      {activeTab === 'preview' && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ height: '70vh', border: '1px solid var(--color-separator)' }}
        >
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
      <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Registro de interacciones</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>No hay interacciones registradas aún.</div>
      ) : (
        logs.map((log: any) => (
          <div key={log.id} className="card space-y-3">
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span>{log.studentName}</span>
              <span className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)' }}
                >
                  {log.modelUsed}
                </span>
                {new Date(log.createdAt).toLocaleString('es-AR')}
              </span>
            </div>
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{ background: 'rgba(196,151,42,0.05)', color: 'var(--color-text)', border: '1px solid var(--color-gold-border)' }}
            >
              {log.message}
            </div>
            <div
              className="rounded-lg px-3 py-2 text-sm line-clamp-3"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
            >
              {log.response}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
