'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react'
import { rankingApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { formatPercent } from '@/lib/utils'
import type { RankingEntry } from '@/types'

const POSITION_STYLES: Record<number, { bg: string; text: string; icon: React.ReactNode }> = {
  1: { bg: 'bg-amber-500/20 border-amber-500/50', text: 'text-amber-400', icon: <Trophy className="w-5 h-5 text-amber-400" /> },
  2: { bg: 'bg-gray-400/20 border-gray-400/50', text: 'text-gray-300', icon: <Medal className="w-5 h-5 text-gray-400" /> },
  3: { bg: 'bg-orange-600/20 border-orange-600/50', text: 'text-orange-400', icon: <Star className="w-5 h-5 text-orange-400" /> }
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" />
          Ranking de Estudiantes
        </h1>
        <p className="text-gray-400 mt-1">Top 10 actualizado diariamente</p>
      </div>

      {/* Mi posición */}
      {myPosition && (
        <div className={`rounded-xl p-5 border ${
          myPosition.inTop10
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tu posición</p>
              <p className="text-white font-bold text-xl mt-1">
                {myPosition.inTop10 ? `#${myPosition.position}` : 'Fuera del top 10'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Tu puntuación</p>
              <p className="text-white font-semibold">{formatPercent(myPosition.totalScore / 100)}</p>
            </div>
          </div>
          {!myPosition.inTop10 && (
            <p className="text-gray-500 text-xs mt-3">
              ¡Sigue interactuando con los agentes IA para escalar posiciones!
            </p>
          )}
        </div>
      )}

      {/* Ranking Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">El ranking se calculará cuando haya suficiente actividad</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((entry, idx) => {
            const style = POSITION_STYLES[entry.position]
            const isMe = entry.userId === user?.id

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : style
                    ? `${style.bg}`
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {/* Position */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  style ? style.bg : 'bg-white/10'
                }`}>
                  {style ? style.icon : (
                    <span className="text-gray-400 font-semibold">{entry.position}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${isMe ? 'text-blue-300' : 'text-white'}`}>
                    {entry.nombre}
                    {isMe && <span className="ml-2 text-xs text-blue-400">(tú)</span>}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {entry.daysInTop10} {entry.daysInTop10 === 1 ? 'día' : 'días'} en top 10
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className={`font-bold ${style ? style.text : 'text-white'}`}>
                    {entry.gainPercentage.toFixed(1)}%
                  </p>
                  <p className="text-gray-500 text-xs">puntuación</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
