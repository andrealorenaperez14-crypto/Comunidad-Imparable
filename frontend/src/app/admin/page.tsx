'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, Activity, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react'
import { metricsApi } from '@/lib/api'
import type { DashboardStats } from '@/types'

function StatCard({ label, value, icon, color }: {
  label: string; value: string | number; icon: React.ReactNode; color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </motion.div>
  )
}

export default function AdminPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data),
    refetchInterval: 30000
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel Administrativo</h1>
        <p className="text-gray-400 mt-1">Resumen general de la plataforma</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total alumnos"
          value={isLoading ? '...' : stats?.totalStudents ?? 0}
          icon={<Users className="w-6 h-6 text-blue-400" />}
          color="bg-blue-500/20"
        />
        <StatCard
          label="Suscripciones activas"
          value={isLoading ? '...' : stats?.activeSubscriptions ?? 0}
          icon={<Activity className="w-6 h-6 text-emerald-400" />}
          color="bg-emerald-500/20"
        />
        <StatCard
          label="Alertas activas"
          value={isLoading ? '...' : stats?.alertStudents ?? 0}
          icon={<AlertTriangle className="w-6 h-6 text-amber-400" />}
          color="bg-amber-500/20"
        />
        <StatCard
          label="Total interacciones"
          value={isLoading ? '...' : stats?.totalInteractions ?? 0}
          icon={<MessageSquare className="w-6 h-6 text-purple-400" />}
          color="bg-purple-500/20"
        />
      </div>

      {/* Recent Alerts */}
      {stats?.recentAlerts && stats.recentAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Alertas recientes
          </h2>

          <div className="space-y-2">
            {stats.recentAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{alert.studentName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {alert.agentName} · {alert.alertMessage || 'Rendimiento bajo'}
                  </p>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full">
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
