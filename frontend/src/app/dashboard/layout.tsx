'use client'
import { useRequireAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import ExpiredPage from '@/app/expired/page'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRequireAuth()
  const { user } = useAuth()

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionApi.status().then(r => r.data),
    enabled: !!user && user.role === 'STUDENT',
    retry: false
  })

  if (isLoading || (user?.role === 'STUDENT' && subLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  // STUDENT con trial vencido → mostrar página de expiración (sin sidebar)
  if (user?.role === 'STUDENT' && subData?.isTrialExpired) {
    return <ExpiredPage />
  }

  // STUDENT con suscripción vencida (plan pago) → mostrar página de expiración
  if (user?.role === 'STUDENT' && subData?.isExpired && !subData?.isTrial) {
    return <ExpiredPage />
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="px-4 py-5 md:px-8 md:py-10 pb-24 md:pb-10 max-w-6xl mx-auto w-full">
          {children}
        </div>
        <p className="text-center text-xs py-4" style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}>
          Desarrollado por: IA Núcleo Estratégico
        </p>
      </main>
    </div>
  )
}
