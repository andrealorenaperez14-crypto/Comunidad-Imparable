'use client'
import { useState, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  BarChart2, Loader2, Upload, CheckCircle, AlertTriangle,
  Trophy, DollarSign, Activity, Flame, Search, PlayCircle, X
} from 'lucide-react'
import { metricsApi, adminUserApi, adminCommissionApi, api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { AdminRankingEntry, CommissionStudentSummary } from '@/types'

interface VideoProgressEntry { id: string; title: string; type: string; order: number; watchedPercent: number }

function VideoProgressModal({ studentId, studentName, onClose }: { studentId: string; studentName: string; onClose: () => void }) {
  const { data: progress = [], isLoading } = useQuery<VideoProgressEntry[]>({
    queryKey: ['video-progress-admin', studentId],
    queryFn: () => api.get(`/api/course/progress/${studentId}`).then(r => r.data)
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-separator)' }}>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Progreso de videos</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{studentName}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-gold)' }} /></div>
          ) : progress.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>Sin módulos de curso cargados.</p>
          ) : (
            progress.map(m => {
              const p = Math.round(m.watchedPercent)
              const color = p >= 90 ? '#4ADE80' : p >= 50 ? 'var(--color-gold)' : 'var(--color-text-muted)'
              return (
                <div key={m.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate flex-1 mr-3" style={{ color: 'var(--color-text)' }}>
                      {m.order + 1}. {m.title}
                    </span>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color }}>
                      {p >= 90 && <CheckCircle className="w-3 h-3 inline mr-1" strokeWidth={2} />}
                      {p}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: color }} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

const COLORS = ['#C4972A', '#8B6914', '#D4A843', '#6B4F10']

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  EXCELENTE: { bg: 'rgba(74,222,128,0.1)', color: '#4ADE80', label: 'Excelente' },
  BUENO:     { bg: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', label: 'Bueno' },
  ALERTA:    { bg: 'rgba(239,68,68,0.1)',  color: '#F87171', label: 'Alerta' }
}

interface CombinedStudent extends AdminRankingEntry {
  totalPending: number
  totalPaid: number
}

export default function MetricasAdminPage() {
  const { isAdmin } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadName, setUploadName] = useState('')

  const [videoProgressTarget, setVideoProgressTarget] = useState<{ id: string; name: string } | null>(null)
  const [rankFilter, setRankFilter] = useState<'all' | 'active'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [commissionFilter, setCommissionFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [rankPage, setRankPage] = useState(1)

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data),
    refetchInterval: 30000
  })

  const { data: rankingData, isLoading: rankingLoading } = useQuery({
    queryKey: ['admin-ranking', rankFilter, rankPage],
    queryFn: () => adminUserApi.ranking(rankFilter, rankPage).then(r => r.data)
  })

  const { data: commissionSummaryData } = useQuery({
    queryKey: ['admin-commission-summary'],
    queryFn: () => adminCommissionApi.summary().then(r => r.data)
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return metricsApi.uploadParams(fd)
    },
    onSuccess: (_data, file) => { setUploadName(file.name); setUploadDone(true) }
  })

  const commissionMap: Record<string, CommissionStudentSummary> = {}
  for (const s of (commissionSummaryData?.students || [])) {
    commissionMap[s.userId] = s
  }

  const rankingStudents: AdminRankingEntry[] = rankingData?.students || []
  const totalRanked: number = rankingData?.total || 0
  const rankPages: number = rankingData?.pages || 1

  const combined: CombinedStudent[] = rankingStudents.map(s => ({
    ...s,
    totalPending: commissionMap[s.id]?.totalPending || 0,
    totalPaid:    commissionMap[s.id]?.totalPaid    || 0
  }))

  const filtered = combined.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (commissionFilter === 'con' && s.totalPending + s.totalPaid === 0) return false
    if (commissionFilter === 'sin' && s.totalPending + s.totalPaid > 0) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.dni.includes(search) ||
        s.email.toLowerCase().includes(q)
      )
    }
    return true
  })

  const allCommissionStudents: CommissionStudentSummary[] = commissionSummaryData?.students || []
  const totalPending = allCommissionStudents.reduce((a, s) => a + s.totalPending, 0)
  const totalPaid    = allCommissionStudents.reduce((a, s) => a + s.totalPaid, 0)

  const subscriptionData = [
    { name: 'Activos',          value: stats?.activeSubscriptions || 0 },
    { name: 'Sin suscripción',  value: Math.max(0, (stats?.totalStudents || 0) - (stats?.activeSubscriptions || 0)) }
  ]
  const performanceData = [
    { name: 'Excelente',   value: Math.max(0, (stats?.totalStudents || 0) - (stats?.alertStudents || 0)) },
    { name: 'Con alertas', value: stats?.alertStudents || 0 }
  ]
  const tooltipStyle = {
    contentStyle: { background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)', borderRadius: 8 },
    labelStyle: { color: 'var(--color-text)' }
  }

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <BarChart2 className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          Métricas de la Plataforma
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Análisis en tiempo real · se actualiza cada 30 segundos</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Total alumnos',           value: stats?.totalStudents || 0,        color: 'var(--color-text)', fmt: 'n' },
          { label: 'Suscripciones activas',   value: stats?.activeSubscriptions || 0,  color: 'var(--color-gold)', fmt: 'n' },
          { label: 'Comisiones pendientes',   value: totalPending,                     color: 'var(--color-gold)', fmt: '$' },
          { label: 'Comisiones pagadas',      value: totalPaid,                        color: '#4ADE80', fmt: '$' },
          { label: 'Ingresos VIP',            value: stats?.vipRevenue?.total || 0,    color: '#C4972A', fmt: '$' },
          { label: 'Alumnos VIP',             value: stats?.vipRevenue?.count || 0,    color: 'var(--color-gold)', fmt: 'n', sublabel: 'pagaron con MP' }
        ].map(item => (
          <div key={item.label} className="rounded-xl p-4 text-center"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {item.fmt === '$'
                ? `$${item.value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
                : item.value.toLocaleString()}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
            {'sublabel' in item && item.sublabel && (
              <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>{item.sublabel}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      {!statsLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Estado de suscripciones</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={subscriptionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {subscriptionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
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
      )}

      {/* Per-student combined table */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Trophy className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          Métricas por Alumno
          <span className="text-sm font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>
            · {totalRanked} alumnos
          </span>
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-separator)' }}>
            {(['all', 'active'] as const).map(f => (
              <button key={f} onClick={() => { setRankFilter(f); setRankPage(1) }}
                className="px-3 py-2 text-sm font-medium"
                style={rankFilter === f
                  ? { background: 'var(--color-gold)', color: '#0C0C0C' }
                  : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)' }}>
                {f === 'all' ? 'Todos' : 'Activos'}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-separator)' }}>
            {['all', 'EXCELENTE', 'BUENO', 'ALERTA'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-2 text-sm font-medium"
                style={statusFilter === s
                  ? { background: 'var(--color-gold)', color: '#0C0C0C' }
                  : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)' }}>
                {s === 'all' ? 'Todos' : STATUS_STYLE[s]?.label || s}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-separator)' }}>
            {[['all', 'Todas'], ['con', 'Con comisiones'], ['sin', 'Sin comisiones']].map(([v, l]) => (
              <button key={v} onClick={() => setCommissionFilter(v)}
                className="px-3 py-2 text-sm font-medium"
                style={commissionFilter === v
                  ? { background: 'var(--color-gold)', color: '#0C0C0C' }
                  : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)' }}>
                {l}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI o email..."
              className="w-full rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
            />
          </div>
        </div>

        {rankingLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-gold)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--color-text-muted)' }}>Sin resultados para los filtros aplicados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(s => {
              const st = STATUS_STYLE[s.status] || STATUS_STYLE.BUENO
              return (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={s.position <= 3
                      ? { background: 'rgba(196,151,42,0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }
                      : { background: 'var(--color-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }}>
                    #{s.position}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                        {s.firstName} {s.lastName}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                      {!s.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      DNI {s.dni} · {s.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Interacciones por IA */}
                    <div className="hidden lg:flex items-center gap-3">
                      <div className="text-center">
                        <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{s.interacciones?.COACH ?? 0}</span>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Coach</p>
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{s.interacciones?.MENTALIDAD ?? 0}</span>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Mental</p>
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-sm" style={{ color: 'var(--color-gold)' }}>{s.interacciones?.CONSULTIVA ?? 0}</span>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Consult.</p>
                      </div>
                      <div className="w-px h-8" style={{ background: 'var(--color-separator)' }} />
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                        <span className="font-bold" style={{ color: 'var(--color-gold)' }}>{s.score.toFixed(1)}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>puntos</p>
                    </div>

                    {s.habitStreak > 0 && (
                      <div className="text-right hidden md:block">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-400" strokeWidth={1.5} />
                          <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{s.habitStreak}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>racha</p>
                      </div>
                    )}

                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" style={{ color: '#4ADE80' }} strokeWidth={1.5} />
                        <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                          ${s.totalPending.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>pendiente</p>
                    </div>

                    {s.totalPaid > 0 && (
                      <div className="text-right hidden sm:block">
                        <span className="text-sm font-semibold" style={{ color: '#4ADE80' }}>
                          ${s.totalPaid.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </span>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>pagado</p>
                      </div>
                    )}

                    <button
                      onClick={() => setVideoProgressTarget({ id: s.id, name: `${s.firstName} ${s.lastName}` })}
                      className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)', background: 'rgba(196,151,42,0.08)' }}
                      title="Ver progreso de videos"
                    >
                      <PlayCircle className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {rankPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setRankPage(p => Math.max(1, p - 1))} disabled={rankPage === 1}
              className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
              style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}>
              Anterior
            </button>
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Página {rankPage} de {rankPages}
            </span>
            <button onClick={() => setRankPage(p => Math.min(rankPages, p + 1))} disabled={rankPage === rankPages}
              className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
              style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}>
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Recent alerts */}
      {stats?.recentAlerts && stats.recentAlerts.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#F87171' }} strokeWidth={1.5} />
            Alertas recientes
          </h2>
          <div className="space-y-2">
            {stats.recentAlerts.map((alert: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{alert.studentName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {alert.agentName} · {alert.alertMessage || 'Sin detalle'}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload params (admin only) */}
      {isAdmin && (
        <div className="card">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Documento de parámetros</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Cargá un archivo con parámetros adicionales de configuración
          </p>
          {uploadDone ? (
            <div className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(196,151,42,0.08)', border: '1px solid var(--color-gold-border)' }}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Documento cargado</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{uploadName}</p>
              </div>
              <button onClick={() => { setUploadDone(false); setUploadName('') }}
                className="text-xs flex-shrink-0"
                style={{ color: 'var(--color-gold)', minHeight: 'unset', minWidth: 'unset' }}>
                Subir otro
              </button>
            </div>
          ) : (
            <>
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx,.json,.csv,.md"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadMutation.mutate(f) }}
              />
              <button onClick={() => fileRef.current?.click()} disabled={uploadMutation.isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)', cursor: 'pointer' }}>
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

    {videoProgressTarget && (
      <VideoProgressModal
        studentId={videoProgressTarget.id}
        studentName={videoProgressTarget.name}
        onClose={() => setVideoProgressTarget(null)}
      />
    )}
    </>
  )
}
