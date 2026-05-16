import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function getDaysRemaining(activeUntil: string): number {
  return Math.max(0, Math.ceil((new Date(activeUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'EXCELENTE': return 'text-emerald-400'
    case 'BUENO': return 'text-blue-400'
    case 'ALERTA': return 'text-amber-400'
    default: return 'text-gray-400'
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'EXCELENTE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'BUENO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'ALERTA': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export function getSubscriptionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Activa',
    TRIAL: 'Prueba gratuita',
    SUSPENDED: 'Suspendida',
    EXPIRED: 'Vencida'
  }
  return labels[status] || status
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str
}
