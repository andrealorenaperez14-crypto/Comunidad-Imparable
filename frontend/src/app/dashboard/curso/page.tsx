'use client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
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
    <div className="space-y-8 max-w-3xl mx-auto">

      <section className="overflow-hidden">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
          Mi Curso
        </h1>
        <p className="mt-4 mb-6" style={{ color: 'var(--color-text-muted)' }}>Contenido de formación profesional</p>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : (
        <div className="space-y-6">
          {freeContent.map((item: any, idx: number) => (
            <div
              key={item.id}
              className="rounded-xl p-8"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                >
                  {idx + 1}
                </span>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                >
                  Gratuito
                </span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
            </div>
          ))}

          {paidContent.length > 0 && (
            <div className="text-center py-4">
              <Image
                src="/assets/client1/LOGO_NEUROVENTAS.png"
                alt="Neuroventas"
                width={200}
                height={80}
                className="h-20 w-auto object-contain mx-auto mb-4"
              />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-gold)' }}>
                Contenido Neuroventas
              </h2>
            </div>
          )}

          {paidContent.map((item: any, idx: number) => (
            <div
              key={item.id}
              className="rounded-xl p-8 transition-all"
              style={{
                background: isPaid ? 'var(--color-bg-card)' : 'rgba(20,20,20,0.5)',
                border: `1px solid ${isPaid ? 'var(--color-gold-border)' : 'var(--color-separator)'}`,
                opacity: isPaid ? 1 : 0.6
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'rgba(196,151,42,0.1)', color: isPaid ? 'var(--color-gold)' : 'var(--color-text-muted)', border: '1px solid var(--color-gold-border)' }}
                >
                  {freeContent.length + idx + 1}
                </span>
                <h3 className="font-semibold" style={{ color: isPaid ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                  {item.title}
                </h3>
                {!isPaid && <Lock className="w-4 h-4 ml-auto" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />}
                {isPaid && (
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                  >
                    Neuroventas
                  </span>
                )}
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
              {!isPaid && (
                <p className="text-xs" style={{ color: 'var(--color-gold)' }}>
                  Actualiza a un plan pago para acceder a este contenido
                </p>
              )}
            </div>
          ))}

          {content.length === 0 && (
            <div className="text-center py-16 rounded-xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
              <BookOpen className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
              <p style={{ color: 'var(--color-text-muted)' }}>El contenido del curso estará disponible pronto.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
