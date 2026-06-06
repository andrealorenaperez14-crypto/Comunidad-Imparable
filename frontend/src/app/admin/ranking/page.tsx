'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trophy, TrendingUp, Flame, Activity, Search, Loader2, RefreshCw } from 'lucide-react'
import { adminUserApi, rankingApi } from '@/lib/api'
import type { AdminRankingEntry } from '@/types'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  EXCELENTE: { bg: 'rgba(74,222,128,0.1)', color: '#4ADE80', label: 'Excelente' },
  BUENO:     { bg: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', label: 'Bueno' },
  ALERTA:    { bg: 'rgba(239,68,68,0.1)',  color: '#F87171', label: 'Alerta' }
}

export default function AdminRankingPage() {
  const [filter, setFilter] = useState<'all' | 'active'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ranking', filter, page],
    queryFn: () => adminUserApi.ranking(filter, page).then(r => r.data)
  })

  const recalcMutation = useMutation({
    mutationFn: () => rankingApi.recalculate(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-ranking'] })
  })

  const students: AdminRankingEntry[] = data?.students || []
  const total: number = data?.total || 0
  const pages: number = data?.pages || 1

  const filtered = students.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchSearch = !search ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.dni.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Trophy className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            Ranking de Alumnos
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {total} alumnos en total · ordenados por puntuación
          </p>
        </div>
        <button
          onClick={() => recalcMutation.mutate()}
          disabled={recalcMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{ border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)', background: 'rgba(196,151,42,0.08)' }}
        >
          {recalcMutation.isPending
            ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            : <RefreshCw className="w-4 h-4" strokeWidth={1.5} />}
          Recalcular ahora
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Subscription filter */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-separator)' }}>
          {(['all', 'active'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={filter === f
                ? { background: 'var(--color-gold)', color: '#0C0C0C' }
                : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)' }
              }
            >
              {f === 'all' ? 'Todos' : 'Activos'}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-separator)' }}>
          {['all', 'EXCELENTE', 'BUENO', 'ALERTA'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={statusFilter === s
                ? { background: 'var(--color-gold)', color: '#0C0C0C' }
                : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)' }
              }
            >
              {s === 'all' ? 'Todos' : STATUS_STYLE[s]?.label || s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI o email..."
            className="w-full rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
            onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
          <p style={{ color: 'var(--color-text-muted)' }}>Sin resultados para los filtros aplicados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => {
            const st = STATUS_STYLE[s.status] || STATUS_STYLE.BUENO
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
              >
                {/* Position */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={s.position <= 3
                    ? { background: 'rgba(196,151,42,0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }
                    : { background: 'var(--color-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }
                  }
                >
                  #{s.position}
                </div>

                {/* Name + info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      {s.firstName} {s.lastName}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    {!s.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    DNI {s.dni} · {s.email}
                  </p>
                </div>

                {/* Score + streak */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                      <span className="font-bold text-lg" style={{ color: 'var(--color-gold)' }}>
                        {s.score.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>puntos</p>
                  </div>
                  {s.habitStreak > 0 && (
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400" strokeWidth={1.5} />
                        <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{s.habitStreak}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>racha</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
            style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}
          >
            Anterior
          </button>
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Página {page} de {pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
            style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
