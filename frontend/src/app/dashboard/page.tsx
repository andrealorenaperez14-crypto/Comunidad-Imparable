'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Brain, Target, TrendingUp, Trophy, Award, Clock, BarChart2, Flame, AlertCircle, Play } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { metricsApi, subscriptionApi, rankingApi } from '@/lib/api'
import { formatPercent, getDaysRemaining, getStatusBg, getSubscriptionStatusLabel } from '@/lib/utils'
import type { IAMetric } from '@/types'

const WELCOME_VIDEO_ID = 'epjjoP0GMtc'

function WelcomeVideo() {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${WELCOME_VIDEO_ID}/maxresdefault.jpg`

  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      <div style={{ padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid var(--color-separator)' }}>
        <p className="font-semibold" style={{ color: 'var(--color-text)', marginBottom: '0.15rem' }}>
          Video de bienvenida
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Mirá este mensaje antes de empezar — es importante
        </p>
      </div>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#0a0a0a', cursor: 'pointer' }}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${WELCOME_VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <>
            <img
              src={thumb}
              alt="Video de bienvenida"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.35)'
            }}>
              <div style={{
                width: '5rem', height: '5rem', borderRadius: '50%',
                background: 'var(--color-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(196,151,42,0.5)',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Play className="w-7 h-7" style={{ color: '#0a0a0a', marginLeft: '4px' }} fill="#0a0a0a" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)' }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  )
}

const agentCards = [
  { href: '/dashboard/agente-consultivo', type: 'CONSULTIVO', icon: <Brain      className="w-7 h-7" strokeWidth={1.5} />, name: 'IA Coach',      description: 'Acompaña tu aprendizaje 24/7' },
  { href: '/dashboard/agente-mentor',     type: 'MENTOR',     icon: <Target     className="w-7 h-7" strokeWidth={1.5} />, name: 'IA Mentalidad', description: 'Trabaja tus bloqueos y miedos' },
  { href: '/dashboard/agente-consultiva', type: 'CONSULTIVA', icon: <TrendingUp className="w-7 h-7" strokeWidth={1.5} />, name: 'IA Consultiva', description: 'Te asiste en cada venta y cierre' },
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
  const totalSessions   = metrics.reduce((acc, m) => acc + m.totalSessions, 0)
  const avgEngagement   = metrics.length ? metrics.reduce((acc, m) => acc + m.engagementScore, 0) / metrics.length : 0
  const maxStreak       = metrics.length ? Math.max(...metrics.map(m => m.habitStreak)) : 0
  const daysRemaining   = subData?.activeUntil ? getDaysRemaining(subData.activeUntil) : 0

  return (
    <div className="space-y-10">

      {/* Header */}
      <section className="overflow-hidden">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Bienvenido/a, {user?.firstName || 'Estudiante'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Aquí está tu resumen de aprendizaje</p>
      </section>

      {/* Welcome video */}
      <section className="overflow-hidden">
        <WelcomeVideo />
      </section>

      {/* Subscription */}
      {subData && (
        <motion.section
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="card">
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
                <Link href="/dashboard/suscripcion" className="text-sm font-medium" style={{ color: 'var(--color-gold)', minHeight: 'unset', minWidth: 'unset' }}>
                  Renovar
                </Link>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Alert */}
      {metrics.some(m => m.status === 'ALERTA') && (
        <section className="overflow-hidden">
          <div className="card flex items-start gap-3" style={{ borderColor: 'var(--color-gold-border)' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--color-gold)' }}>Atención requerida</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Tu rendimiento en algunos agentes necesita atención. Consulta con tu IA Mentalidad para mejorar.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="overflow-hidden">
        <div className="card-grid card-grid-4">
          <MetricCard label="Sesiones totales"    value={totalSessions.toString()}                                       icon={<BarChart2 className="w-5 h-5" strokeWidth={1.5} />} />
          <MetricCard label="Engagement promedio" value={formatPercent(avgEngagement)}                                   icon={<TrendingUp className="w-5 h-5" strokeWidth={1.5} />} />
          <MetricCard label="Racha de hábito"     value={`${maxStreak} días`}                                            icon={<Flame    className="w-5 h-5" strokeWidth={1.5} />} />
          <MetricCard label="Posición ranking"    value={rankingData?.inTop10 ? `#${rankingData.position}` : 'Sin clasificar'} icon={<Trophy className="w-5 h-5" strokeWidth={1.5} />} />
        </div>
      </section>

      {/* IA Agents */}
      <section className="overflow-hidden">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Mis Agentes IA</h2>
        <div className="card-grid card-grid-3">
          {agentCards.map((card) => {
            const agentMetric = metrics.find(m => m.agent?.type === card.type)
            return (
              <Link key={card.href} href={card.href}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card cursor-pointer h-full">
                  <div className="flex items-start justify-between">
                    <span style={{ color: 'var(--color-gold)' }}>{card.icon}</span>
                    {agentMetric && (
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBg(agentMetric.status)}`}>
                        {agentMetric.status}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{card.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{card.description}</p>
                  {agentMetric && (
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {agentMetric.totalSessions} sesiones · {formatPercent(agentMetric.engagementScore)} engagement
                    </p>
                  )}
                  <p className="text-sm font-medium" style={{ color: 'var(--color-gold)', marginBottom: 0 }}>
                    Iniciar conversación
                  </p>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick links */}
      <section className="overflow-hidden">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Accesos rápidos</h2>
        <div className="card-grid card-grid-3">
          {[
            { href: '/dashboard/ranking',      icon: <Trophy className="w-5 h-5" strokeWidth={1.5} />, label: 'Ver ranking' },
            { href: '/dashboard/certificados', icon: <Award  className="w-5 h-5" strokeWidth={1.5} />, label: 'Mis certificados' },
            { href: '/dashboard/curso',        icon: <Brain  className="w-5 h-5" strokeWidth={1.5} />, label: 'Mi curso' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded px-6 py-4 transition-all hover:opacity-80"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}
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
