'use client'
import { useState, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart2, Loader2, Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import { metricsApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const COLORS = ['#C4972A', '#8B6914', '#D4A843', '#6B4F10']

export default function MetricasAdminPage() {
  const { isAdmin } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadName, setUploadName] = useState('')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data),
    refetchInterval: 30000
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return metricsApi.uploadParams(fd)
    },
    onSuccess: (_data, file) => {
      setUploadName(file.name)
      setUploadDone(true)
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  const subscriptionData = [
    { name: 'Activos', value: stats?.activeSubscriptions || 0 },
    { name: 'Sin suscripción', value: Math.max(0, (stats?.totalStudents || 0) - (stats?.activeSubscriptions || 0)) }
  ]

  const performanceData = [
    { name: 'Excelente', value: Math.max(0, (stats?.totalStudents || 0) - (stats?.alertStudents || 0)) },
    { name: 'Con alertas', value: stats?.alertStudents || 0 }
  ]

  const tooltipStyle = {
    contentStyle: { background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)', borderRadius: 8 },
    labelStyle: { color: 'var(--color-text)' }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <BarChart2 className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          Métricas de la Plataforma
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Análisis en tiempo real · se actualiza cada 30 segundos</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Estado de suscripciones</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {subscriptionData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Rendimiento de alumnos</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-separator)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Resumen de métricas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total alumnos', value: stats?.totalStudents || 0 },
            { label: 'Suscripciones activas', value: stats?.activeSubscriptions || 0 },
            { label: 'Alumnos con alertas', value: stats?.alertStudents || 0 },
            { label: 'Total interacciones IA', value: stats?.totalInteractions || 0 }
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl p-4 text-center"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>{item.value.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {stats?.recentAlerts && stats.recentAlerts.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#F87171' }} strokeWidth={1.5} />
            Alertas recientes
          </h2>
          <div className="space-y-2">
            {stats.recentAlerts.map((alert: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{alert.studentName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {alert.agentName} · {alert.alertMessage || 'Sin detalle'}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="card">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Documento de parámetros</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Cargá un archivo con parámetros adicionales de configuración
          </p>
          {uploadDone ? (
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(196,151,42,0.08)', border: '1px solid var(--color-gold-border)' }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Documento cargado</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{uploadName}</p>
              </div>
              <button
                onClick={() => { setUploadDone(false); setUploadName('') }}
                className="text-xs flex-shrink-0"
                style={{ color: 'var(--color-gold)', minHeight: 'unset', minWidth: 'unset' }}
              >
                Subir otro
              </button>
            </div>
          ) : (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx,.json,.csv,.md"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadMutation.mutate(f) }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
                style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)', cursor: 'pointer' }}
              >
                {uploadMutation.isPending
                  ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> Subiendo...</>
                  : <><Upload className="w-4 h-4" strokeWidth={1.5} /> Seleccionar archivo</>
                }
              </button>
              {uploadMutation.isError && (
                <p className="text-xs mt-2" style={{ color: '#F87171' }}>Error al subir el archivo. Intenta de nuevo.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
