'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { BookOpen, Lock, Loader2, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/)
  return match ? match[1] : null
}

function ProgressBar({ percent }: { percent: number }) {
  const p = Math.round(percent)
  const color = p >= 90 ? '#4ADE80' : p >= 50 ? 'var(--color-gold)' : 'var(--color-text-muted)'
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Progreso del video</span>
        <span className="text-xs font-semibold flex items-center gap-1" style={{ color }}>
          {p >= 90 && <CheckCircle className="w-3 h-3" strokeWidth={2} />}
          {p}%
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${p}%`, background: color }}
        />
      </div>
    </div>
  )
}

function VideoWithTracking({ videoId, contentId, initialPercent, onProgress }: {
  videoId: string
  contentId: string
  initialPercent: number
  onProgress: (contentId: string, percent: number) => void
}) {
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const divId = `yt-player-${contentId}`

  useEffect(() => {
    const loadPlayer = () => {
      if (!(window as any).YT?.Player) return
      playerRef.current = new (window as any).YT.Player(divId, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: () => trackProgress(),
          onReady: () => trackProgress()
        }
      })
    }

    const trackProgress = () => {
      const player = playerRef.current
      if (!player?.getCurrentTime || !player?.getDuration) return
      const duration = player.getDuration()
      if (!duration) return
      const percent = (player.getCurrentTime() / duration) * 100
      onProgress(contentId, percent)
    }

    if ((window as any).YT?.Player) {
      loadPlayer()
    } else {
      if (!(window as any).onYouTubeIframeAPIReady) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      ;(window as any).onYouTubeIframeAPIReady = loadPlayer
    }

    intervalRef.current = setInterval(() => {
      const player = playerRef.current
      if (!player?.getCurrentTime || !player?.getDuration) return
      const duration = player.getDuration()
      if (!duration) return
      const percent = (player.getCurrentTime() / duration) * 100
      onProgress(contentId, percent)
    }, 10000)

    return () => {
      clearInterval(intervalRef.current)
      try { playerRef.current?.destroy() } catch {}
    }
  }, [videoId, contentId])

  return <div id={divId} className="w-full h-full" />
}

export default function CursoPage() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['course-content'],
    queryFn: () => api.get('/api/course').then(r => r.data).catch(() => [])
  })

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/api/subscription/status').then(r => r.data).catch(() => null)
  })

  const { data: progressMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['video-progress'],
    queryFn: () => api.get('/api/course/progress').then(r => r.data).catch(() => ({})),
    enabled: !!user
  })

  const saveMutation = useMutation({
    mutationFn: ({ contentId, watchedPercent }: { contentId: string; watchedPercent: number }) =>
      api.post(`/api/course/${contentId}/progress`, { watchedPercent }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['video-progress'] })
  })

  const savedPercents = useRef<Record<string, number>>({})

  const handleProgress = useCallback((contentId: string, percent: number) => {
    const rounded = Math.round(percent)
    const prev = savedPercents.current[contentId] ?? (progressMap[contentId] ?? 0)
    // Guardar solo si aumentó >= 5% y es mayor al registrado
    if (rounded >= prev + 5) {
      savedPercents.current[contentId] = rounded
      saveMutation.mutate({ contentId, watchedPercent: rounded })
    }
  }, [progressMap])

  const isPaid = subData?.planType === '30_DAYS' || subData?.planType === 'VITALICIO'
  const freeContent = content.filter((c: any) => c.type === 'FREE')
  const paidContent = content.filter((c: any) => c.type === 'PAID')

  const renderModule = (item: any, idx: number, badge: string, locked = false) => {
    const videoId = item.videoUrl ? getYouTubeId(item.videoUrl) : null
    const watched = progressMap[item.id] ?? 0

    return (
      <div
        key={item.id}
        id={`modulo-${item.id}`}
        className="rounded-xl p-4 md:p-8 transition-all"
        style={{
          background: locked ? 'rgba(20,20,20,0.5)' : 'var(--color-bg-card)',
          border: `1px solid ${locked ? 'var(--color-separator)' : 'var(--color-gold-border)'}`,
          opacity: locked ? 0.6 : 1,
          scrollMarginTop: '2rem'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'rgba(196,151,42,0.1)', color: locked ? 'var(--color-text-muted)' : 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
          >
            {idx + 1}
          </span>
          <h3 className="font-semibold flex-1 min-w-0" style={{ color: locked ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
            {item.title}
          </h3>
          {locked
            ? <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
            : <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}>
                {badge}
              </span>
          }
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
        {!locked && videoId && (
          <>
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <VideoWithTracking
                videoId={videoId}
                contentId={item.id}
                initialPercent={watched}
                onProgress={handleProgress}
              />
            </div>
            <ProgressBar percent={watched} />
          </>
        )}
        {locked && (
          <p className="text-xs" style={{ color: 'var(--color-gold)' }}>
            Actualizá a un plan pago para acceder a este contenido
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <section>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Mi Curso</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Contenido de formación profesional</p>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {freeContent.map((item: any, idx: number) => renderModule(item, idx, 'Gratuito', false))}

          {paidContent.length > 0 && (
            <div className="text-center py-4">
              <Image src="/assets/client1/LOGO_NEUROVENTAS.webp" alt="Neuroventas" width={200} height={80} className="h-20 w-auto object-contain mx-auto mb-4" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-gold)' }}>Contenido Neuroventas</h2>
            </div>
          )}

          {paidContent.map((item: any, idx: number) =>
            renderModule(item, freeContent.length + idx, 'Neuroventas', !isPaid)
          )}

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
