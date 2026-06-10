'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Trash2, Loader2, Users } from 'lucide-react'
import { useState } from 'react'

export default function RegistrosPage() {
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState<string | null>(null)

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['registros'],
    queryFn: () => api.get('/api/admin/registros').then(r => r.data)
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/registros/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['registros'] }); setConfirm(null) }
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Registros</h1>
        <span className="ml-auto text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}>
          {registros.length} registros
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : registros.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Sin registros todavía.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-separator)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-separator)' }}>
                {['Nombre', 'DNI', 'Email', 'WhatsApp', 'Fecha ingreso', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registros.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-separator)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{r.nombreCompleto}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{r.dni}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{r.email}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{r.whatsapp}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(r.fechaIngreso).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    {confirm === r.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => del.mutate(r.id)} className="text-xs px-2 py-1 rounded" style={{ background: '#ef4444', color: '#fff' }}>
                          Confirmar
                        </button>
                        <button onClick={() => setConfirm(null)} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-separator)', color: 'var(--color-text-muted)' }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirm(r.id)}>
                        <Trash2 className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
                      </button>
                    )}
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
