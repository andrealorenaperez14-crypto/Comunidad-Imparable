'use client'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart2, Loader2 } from 'lucide-react'
import { metricsApi } from '@/lib/api'

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6']

export default function MetricasAdminPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data),
    refetchInterval: 60000
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-7 h-7 text-blue-400" />
          Métricas de la Plataforma
        </h1>
        <p className="text-gray-400 mt-1">Análisis en tiempo real de la actividad educativa</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Subscriptions chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Estado de suscripciones</h2>
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
              <Tooltip
                contentStyle={{ background: '#1a2340', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Rendimiento de alumnos</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1a2340', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
              />
              <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Resumen de métricas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total alumnos', value: stats?.totalStudents || 0, color: 'text-blue-400' },
            { label: 'Suscripciones activas', value: stats?.activeSubscriptions || 0, color: 'text-emerald-400' },
            { label: 'Alumnos con alertas', value: stats?.alertStudents || 0, color: 'text-amber-400' },
            { label: 'Total interacciones IA', value: stats?.totalInteractions || 0, color: 'text-purple-400' }
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
