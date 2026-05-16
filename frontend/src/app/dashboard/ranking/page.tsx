'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react'
import { rankingApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { formatPercent } from '@/lib/utils'
import type { RankingEntry } from '@/types'

const POSITION_STYLES: Record<number, { border: string; text: string; icon: React.ReactNode }> = {
  1: {
    border: 'rgba(196,151,42,0.5)',
    text: 'var(--color-gold)',
    icon: <Trophy className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
  },
  2: {
    border: 'rgba(156,163,175,0.5)',
    text: '#9CA3AF',
    icon: <Medal className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
  },
  3: {
    border: 'rgba(249,115,22,0.5)',
    text: '#F97316',
    icon: <Star className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
  }
}

export default function RankingPage() {
  const { user } = useAuth()

  const { data: ranking = [], isLoading } = useQuery<RankingEntry[]>({
    queryKey: ['ranking'],
    queryFn: () => rankingApi.top10().then(r => r.data),
    refetchInterval: 60000
  })

  const { data: myPosition } = useQuery({
    queryKey: ['ranking-position', user?.id],
    queryFn: () => rankingApi.student(user!.id).then(r => r.data),
    enabled: !!user?.id
  })

  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      <section className="overflow-hidden">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
          Ranking de Estudiantes
        </h1>
        <p className="mt-4 mb-6" style={{ color: 'var(--color-text-muted)' }}>Top 10 actualizado diariamente</p>
      </section>

      {myPosition && (
        <section className="overflow-hidden">
          <div
            className="rounded-xl p-8"
            style={{
              background: 'var(--color-bg-card)',
              border: `1px solid ${myPosition.inTop10 ? 'var(--color-gold-border)' : 'var(--color-separator)'}`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Tu posición</p>
                <p className="font-bold text-xl" style={{ color: 'var(--color-text)' }}>
                  {myPosition.inTop10 ? `#${myPosition.position}` : 'Fuera del top 10'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Tu puntuación</p>
                <p className="font-semibold" style={{ color: myPosition.inTop10 ? 'var(--color-gold)' : 'var(--color-text)' }}>
                  {formatPercent(myPosition.totalScore / 100)}
                </p>
              </div>
            </div>
            {!myPosition.inTop10 && (
              <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
                Sigue interactuando con los agentes IA para escalar posiciones.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-card)' }} />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
            <p style={{ color: 'var(--color-text-muted)' }}>El ranking se calculará cuando haya suficiente actividad</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((entry, idx) => {
              const pos = POSITION_STYLES[entry.position]
              const isMe = entry.userId === user?.id

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex items-center gap-4 p-6 rounded-xl transition-all"
                  style={{
                    background: isMe ? 'rgba(196,151,42,0.08)' : 'var(--color-bg-card)',
                    border: `1px solid ${isMe ? 'var(--color-gold-border)' : pos ? pos.border : 'var(--color-separator)'}`
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}
                  >
                    {pos ? pos.icon : (
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>{entry.position}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate mb-1" style={{ color: isMe ? 'var(--color-gold)' : 'var(--color-text)' }}>
                      {entry.nombre}
                      {isMe && <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>(tú)</span>}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {entry.daysInTop10} {entry.daysInTop10 === 1 ? 'día' : 'días'} en top 10
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold" style={{ color: pos ? pos.text : 'var(--color-text)' }}>
                      {entry.gainPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>puntuación</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}
