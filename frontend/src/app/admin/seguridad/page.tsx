'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'

interface SecurityEvent {
  userId: string
  userEmail: string
  category: string
  timestamp: number
}

export default function SeguridadPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [banningId, setBanningId] = useState<string | null>(null)

  useEffect(() => {
    adminApi.getSecurityEvents()
      .then(res => { setEvents(res.data.events); setTotal(res.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleBan = async (userId: string) => {
    setBanningId(userId)
    try {
      await adminApi.banUser(userId)
      alert('Usuario baneado por 1 hora.')
    } catch {
      alert('Error al banear usuario.')
    } finally {
      setBanningId(null)
    }
  }

  const CATEGORY_LABELS: Record<string, string> = {
    role_override: 'Reemplazo de rol',
    jailbreak: 'Jailbreak',
    data_extraction: 'Extracción de datos',
    script_injection: 'Inyección de script'
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        Seguridad — Eventos Sospechosos
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
        {total} eventos en los últimos 30 días
      </p>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p>
      ) : events.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No hay eventos sospechosos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-separator)' }}>
                <th className="text-left py-2 px-3" style={{ color: 'var(--color-text-muted)' }}>Fecha</th>
                <th className="text-left py-2 px-3" style={{ color: 'var(--color-text-muted)' }}>Usuario</th>
                <th className="text-left py-2 px-3" style={{ color: 'var(--color-text-muted)' }}>Tipo</th>
                <th className="text-left py-2 px-3" style={{ color: 'var(--color-text-muted)' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-separator)' }}>
                  <td className="py-2 px-3" style={{ color: 'var(--color-text)' }}>
                    {new Date(ev.timestamp).toLocaleString('es-AR')}
                  </td>
                  <td className="py-2 px-3" style={{ color: 'var(--color-text)' }}>
                    {ev.userEmail}
                  </td>
                  <td className="py-2 px-3">
                    <span style={{
                      background: 'rgba(239,68,68,0.15)',
                      color: '#ef4444',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {CATEGORY_LABELS[ev.category] || ev.category}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleBan(ev.userId)}
                      disabled={banningId === ev.userId}
                      style={{
                        background: banningId === ev.userId ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.3)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: banningId === ev.userId ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {banningId === ev.userId ? 'Baneando...' : 'Banear 1h'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
