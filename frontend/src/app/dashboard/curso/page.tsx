'use client'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Lock, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function CursoPage() {
  const { user } = useAuth()

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['course-content'],
    queryFn: () => api.get('/api/course').then(r => r.data).catch(() => [])
  })

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/api/subscription/status').then(r => r.data).catch(() => null)
  })

  const isPaid = subData?.planType === '30_DAYS' || subData?.planType === 'VITALICIO'

  const freeContent = content.filter((c: any) => c.type === 'FREE')
  const paidContent = content.filter((c: any) => c.type === 'PAID')

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-400" />
          Mi Curso
        </h1>
        <p className="text-gray-400 mt-1">Contenido de formación profesional</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {freeContent.map((item: any, idx: number) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                  {idx + 1}
                </span>
                <h3 className="text-white font-semibold">{item.title}</h3>
                <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Gratuito
                </span>
              </div>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}

          {paidContent.map((item: any, idx: number) => (
            <div key={item.id} className={`border rounded-2xl p-6 transition-all ${
              isPaid
                ? 'bg-white/5 border-white/10'
                : 'bg-white/3 border-white/5 opacity-60'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 font-bold text-sm">
                  {freeContent.length + idx + 1}
                </span>
                <h3 className={`font-semibold ${isPaid ? 'text-white' : 'text-gray-500'}`}>{item.title}</h3>
                {!isPaid && <Lock className="w-4 h-4 text-gray-600 ml-auto" />}
                {isPaid && (
                  <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className={`text-sm ${isPaid ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>

              {!isPaid && (
                <p className="mt-3 text-xs text-amber-500">
                  Actualiza a un plan pago para acceder a este contenido →
                </p>
              )}
            </div>
          ))}

          {content.length === 0 && (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">El contenido del curso estará disponible pronto.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
