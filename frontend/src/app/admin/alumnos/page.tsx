'use client'
import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp, TrendingDown, Minus, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { metricsApi } from '@/lib/api'
import { getStatusBg, formatPercent } from '@/lib/utils'

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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-400" />
            Alumnos
          </h1>
          <p className="text-gray-400 mt-1">Gestión y seguimiento de estudiantes</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar alumno por nombre o email..."
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats?.totalStudents ?? '—'}</p>
          <p className="text-gray-400 text-sm mt-1">Total alumnos</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats?.activeSubscriptions ?? '—'}</p>
          <p className="text-gray-400 text-sm mt-1">Activos</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats?.alertStudents ?? '—'}</p>
          <p className="text-gray-400 text-sm mt-1">Con alertas</p>
        </div>
      </div>

      {/* Alerts list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Alumnos con alertas</h2>

          {!stats?.recentAlerts?.length ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-emerald-400 font-medium">¡Sin alertas activas!</p>
              <p className="text-gray-500 text-sm mt-1">Todos los alumnos tienen buen rendimiento.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentAlerts
                .filter((a: any) => !search || a.studentName.toLowerCase().includes(search.toLowerCase()))
                .map((alert: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-amber-400 font-bold text-sm">
                        {alert.studentName[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{alert.studentName}</p>
                      <p className="text-gray-400 text-sm">
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
