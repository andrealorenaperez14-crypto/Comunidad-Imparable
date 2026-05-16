'use client'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart2, Loader2 } from 'lucide-react'
import { metricsApi } from '@/lib/api'

const COLORS = ['#C4972A', '#8B6914', '#D4A843', '#6B4F10']

export default function MetricasAdminPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data),
    refetchInterval: 60000
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
        <p style={{ color: 'var(--color-text-muted)' }}>Análisis en tiempo real de la actividad educativa</p>
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
    </div>
  )
}
