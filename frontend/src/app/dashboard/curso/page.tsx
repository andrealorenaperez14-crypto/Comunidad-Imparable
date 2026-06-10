'use client'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/)
  return match ? match[1] : null
}

export default function CursoPage() {
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['course-content'],
    queryFn: () => api.get('/api/course').then(r => r.data).catch(() => [])
  })

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {content.map((item: any, idx: number) => (
            <div
              key={item.id}
              id={`modulo-${item.id}`}
              className="rounded-xl p-8"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)', scrollMarginTop: '2rem' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                >
                  {idx + 1}
                </span>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
              {item.videoUrl && (() => {
                const videoId = getYouTubeId(item.videoUrl)
                return videoId ? (
                  <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                      className="w-full h-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null
              })()}
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
