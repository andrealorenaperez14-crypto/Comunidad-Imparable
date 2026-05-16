'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Brain, Target, TrendingUp, Trophy, Award, BookOpen,
  LogOut, Menu, X, ChevronRight, BarChart2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

const studentNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Mi Dashboard' },
  { href: '/dashboard/agente-consultivo', icon: Brain, label: 'IA Coach' },
  { href: '/dashboard/agente-mentor', icon: Target, label: 'IA Mentalidad' },
  { href: '/dashboard/agente-consultiva', icon: TrendingUp, label: 'IA Consultiva' },
  { href: '/dashboard/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/dashboard/certificados', icon: Award, label: 'Certificados' },
  { href: '/dashboard/curso', icon: BookOpen, label: 'Mi Curso' }
]

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Panel Admin' },
  { href: '/admin/agentes', icon: Brain, label: 'Agentes IA' },
  { href: '/admin/cursos', icon: BookOpen, label: 'Cursos' },
  { href: '/admin/alumnos', icon: Award, label: 'Alumnos' },
  { href: '/admin/metricas', icon: BarChart2, label: 'Métricas' }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = isAdmin ? adminNav : studentNav

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--color-separator)' }}>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text)', letterSpacing: '0.08em' }}>
              {user?.schoolName || 'ESCUELA DE ASESORES'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {isAdmin ? 'Panel Admin' : 'Mi Formación'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded text-sm font-medium transition-all group',
                isActive
                  ? 'text-[#0C0C0C]'
                  : 'hover:opacity-90'
              )}
              style={isActive ? {
                background: 'var(--color-gold)',
                color: '#0C0C0C'
              } : {
                color: 'var(--color-text-muted)'
              }}
            >
              <item.icon
                className="w-5 h-5"
                strokeWidth={1.5}
                style={isActive ? { color: '#0C0C0C' } : { color: 'var(--color-text-muted)' }}
              />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-60" strokeWidth={1.5} />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--color-separator)' }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'rgba(196,151,42,0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
          >
            {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className="hidden md:flex flex-col w-64 h-screen sticky top-0"
        style={{ background: 'var(--color-bg-card)', borderRight: '1px solid var(--color-separator)' }}
      >
        <NavContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--color-gold)' }}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" style={{ color: '#0C0C0C' }} strokeWidth={1.5} />
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-0 bottom-0 w-72"
            style={{ background: 'var(--color-bg-card)', borderRight: '1px solid var(--color-separator)' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <NavContent />
          </motion.aside>
        </div>
      )}
    </>
  )
}
