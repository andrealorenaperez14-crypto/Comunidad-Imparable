'use client'
import { useRequireAdmin } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRequireAdmin()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="px-4 py-5 md:px-8 md:py-10 pb-24 md:pb-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
        <p className="text-center text-xs py-4" style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}>
          Desarrollado por: Núcleo Estratégico IA
        </p>
      </main>
    </div>
  )
}
