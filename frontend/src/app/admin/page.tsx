'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, Activity, AlertTriangle, MessageSquare } from 'lucide-react'
import { metricsApi } from '@/lib/api'
import type { DashboardStats } from '@/types'

function StatCard({ label, value, icon }: {
  label: string; value: string | number; icon: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
      >
        {icon}
      </div>
      <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Panel Administrativo</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Resumen general de la plataforma</p>
      </div>

      <div className="card-grid card-grid-4">
        <StatCard
          label="Total alumnos"
          value={isLoading ? '...' : stats?.totalStudents ?? 0}
          icon={<Users className="w-6 h-6" strokeWidth={1.5} />}
        />
        <StatCard
          label="Suscripciones activas"
          value={isLoading ? '...' : stats?.activeSubscriptions ?? 0}
          icon={<Activity className="w-6 h-6" strokeWidth={1.5} />}
        />
        <StatCard
          label="Alertas activas"
          value={isLoading ? '...' : stats?.alertStudents ?? 0}
          icon={<AlertTriangle className="w-6 h-6" strokeWidth={1.5} />}
        />
        <StatCard
          label="Total interacciones"
          value={isLoading ? '...' : stats?.totalInteractions ?? 0}
          icon={<MessageSquare className="w-6 h-6" strokeWidth={1.5} />}
        />
      </div>

      {stats?.recentAlerts && stats.recentAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            Alertas recientes
          </h2>

          <div className="space-y-2">
            {stats.recentAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(196,151,42,0.05)', border: '1px solid var(--color-gold-border)' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-gold)' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{alert.studentName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {alert.agentName} · {alert.alertMessage || 'Rendimiento bajo'}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                >
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
