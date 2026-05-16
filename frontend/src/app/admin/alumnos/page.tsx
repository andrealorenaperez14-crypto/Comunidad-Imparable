'use client'
import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { metricsApi } from '@/lib/api'
import { getStatusBg } from '@/lib/utils'

export default function AlumnosPage() {
  const [search, setSearch] = useState('')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Users className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            Alumnos
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Gestión y seguimiento de estudiantes</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar alumno por nombre o email..."
          className="w-full rounded-xl px-4 py-3 pl-11 focus:outline-none"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-separator)',
            color: 'var(--color-text)'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats?.totalStudents ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Total alumnos</p>
        </div>
        <div className="card text-center" style={{ borderColor: 'var(--color-gold-border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>{stats?.activeSubscriptions ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Activos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats?.alertStudents ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Con alertas</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Alumnos con alertas</h2>

          {!stats?.recentAlerts?.length ? (
            <div className="card text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
              <p className="font-medium" style={{ color: 'var(--color-gold)' }}>Sin alertas activas</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Todos los alumnos tienen buen rendimiento.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentAlerts
                .filter((a: any) => !search || a.studentName.toLowerCase().includes(search.toLowerCase()))
                .map((alert: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}
                    >
                      <span className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>
                        {alert.studentName[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>{alert.studentName}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {alert.agentName} · {alert.alertMessage || 'Rendimiento bajo'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBg(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
