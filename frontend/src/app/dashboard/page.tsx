'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Brain, Target, TrendingUp, Trophy, Award, Clock, BarChart2, Flame, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { metricsApi, subscriptionApi, rankingApi } from '@/lib/api'
import { formatPercent, getDaysRemaining, getStatusBg, getSubscriptionStatusLabel } from '@/lib/utils'
import type { IAMetric } from '@/types'

function MetricCard({ label, value, icon, borderColor }: {
  label: string; value: string; icon: React.ReactNode; borderColor?: string
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--color-bg-card)', border: `1px solid ${borderColor || 'var(--color-gold-border)'}` }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)' }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  )
}

const agentCards = [
  {
    href: '/dashboard/agente-consultivo',
    type: 'COACH',
    icon: <Brain className="w-7 h-7" strokeWidth={1.5} />,
    name: 'IA Coach',
    description: 'Acompaña tu aprendizaje 24/7',
  },
  {
    href: '/dashboard/agente-mentor',
    type: 'MENTALIDAD',
    icon: <Target className="w-7 h-7" strokeWidth={1.5} />,
    name: 'IA Mentalidad',
    description: 'Trabaja tus bloqueos y miedos',
  },
  {
    href: '/dashboard/agente-consultiva',
    type: 'CONSULTIVA',
    icon: <TrendingUp className="w-7 h-7" strokeWidth={1.5} />,
    name: 'IA Consultiva',
    description: 'Te asiste en cada venta y cierre',
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionApi.status().then(r => r.data)
  })

  const { data: metricsData } = useQuery({
    queryKey: ['metrics', user?.id],
    queryFn: () => metricsApi.student(user!.id).then(r => r.data),
    enabled: !!user?.id
  })

  const { data: rankingData } = useQuery({
    queryKey: ['ranking-position', user?.id],
    queryFn: () => rankingApi.student(user!.id).then(r => r.data),
    enabled: !!user?.id
  })

  const metrics: IAMetric[] = metricsData?.metrics || []
  const totalSessions = metrics.reduce((acc, m) => acc + m.totalSessions, 0)
  const avgEngagement = metrics.length
    ? metrics.reduce((acc, m) => acc + m.engagementScore, 0) / metrics.length
    : 0
  const maxStreak = metrics.length ? Math.max(...metrics.map(m => m.habitStreak)) : 0
  const daysRemaining = subData?.activeUntil ? getDaysRemaining(subData.activeUntil) : 0

  return (
    <div className="space-y-8">
      <section className="overflow-hidden">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Bienvenido/a, {user?.firstName || 'Estudiante'}
        </h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Aquí está tu resumen de aprendizaje</p>
      </section>

      {subData && (
        <motion.section
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className="rounded-xl p-5"
            style={{
              background: subData.status === 'SUSPENDED'
                ? 'rgba(239,68,68,0.08)'
                : daysRemaining <= 5
                ? 'rgba(196,151,42,0.08)'
                : 'var(--color-bg-card)',
              border: `1px solid ${subData.status === 'SUSPENDED'
                ? 'rgba(239,68,68,0.3)'
                : daysRemaining <= 5
                ? 'var(--color-gold-border)'
                : 'var(--color-gold-border)'}`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: 'var(--color-gold)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                    {subData.isVitalicio ? 'Plan Vitalicio' : getSubscriptionStatusLabel(subData.status)}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {subData.isVitalicio ? 'Acceso permanente activo' : `${daysRemaining} días restantes`}
                  </p>
                </div>
              </div>
              {!subData.isVitalicio && subData.status !== 'SUSPENDED' && (
                <Link href="/dashboard/suscripcion" className="text-sm font-medium" style={{ color: 'var(--color-gold)' }}>
                  Renovar
                </Link>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {metrics.some(m => m.status === 'ALERTA') && (
        <section className="overflow-hidden">
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(196,151,42,0.08)', border: '1px solid var(--color-gold-border)' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--color-gold)' }}>Atención requerida</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Tu rendimiento en algunos agentes necesita atención. Consulta con tu IA Mentalidad para mejorar.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Sesiones totales"
            value={totalSessions.toString()}
            icon={<BarChart2 className="w-5 h-5" strokeWidth={1.5} />}
          />
          <MetricCard
            label="Engagement promedio"
            value={formatPercent(avgEngagement)}
            icon={<TrendingUp className="w-5 h-5" strokeWidth={1.5} />}
          />
          <MetricCard
            label="Racha de hábito"
            value={`${maxStreak} días`}
            icon={<Flame className="w-5 h-5" strokeWidth={1.5} />}
          />
          <MetricCard
            label="Posición ranking"
            value={rankingData?.inTop10 ? `#${rankingData.position}` : 'Sin clasificar'}
            icon={<Trophy className="w-5 h-5" strokeWidth={1.5} />}
          />
        </div>
      </section>

      <section className="overflow-hidden">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Mis Agentes IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agentCards.map((card) => {
            const agentMetric = metrics.find(m => m.agent?.type === card.type)

            return (
              <Link key={card.href} href={card.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="card cursor-pointer transition-all"
                  style={{ borderColor: 'var(--color-gold-border)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span style={{ color: 'var(--color-gold)' }}>{card.icon}</span>
                    {agentMetric && (
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBg(agentMetric.status)}`}>
                        {agentMetric.status}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{card.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{card.description}</p>

                  {agentMetric && (
                    <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{agentMetric.totalSessions} sesiones</span>
                      <span>{formatPercent(agentMetric.engagementScore)} engagement</span>
                    </div>
                  )}

                  <div className="mt-4 text-sm font-medium" style={{ color: 'var(--color-gold)' }}>
                    Iniciar conversación
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="overflow-hidden">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Accesos rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href: '/dashboard/ranking', icon: <Trophy className="w-5 h-5" strokeWidth={1.5} />, label: 'Ver ranking' },
            { href: '/dashboard/certificados', icon: <Award className="w-5 h-5" strokeWidth={1.5} />, label: 'Mis certificados' },
            { href: '/dashboard/curso', icon: <Brain className="w-5 h-5" strokeWidth={1.5} />, label: 'Mi curso' }
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-gold-border)'
              }}
            >
              <span style={{ color: 'var(--color-gold)' }}>{item.icon}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
