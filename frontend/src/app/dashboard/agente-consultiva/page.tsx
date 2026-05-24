'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentApi, commissionApi } from '@/lib/api'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { Loader2, AlertCircle, DollarSign, Plus, X, BadgeCheck, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import type { SaleCommission } from '@/types'

function CommissionPanel() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10))
  const [formError, setFormError] = useState('')

  const { data: commissions = [], isLoading } = useQuery<SaleCommission[]>({
    queryKey: ['my-commissions'],
    queryFn: () => commissionApi.list().then(r => r.data)
  })

  const createMutation = useMutation({
    mutationFn: () => {
      const n = parseFloat(amount)
      if (!n || n <= 0) throw new Error('Ingresá un monto válido mayor a 0')
      return commissionApi.create({ amount: n, description: description || undefined, saleDate })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-commissions'] })
      setShowForm(false)
      setAmount('')
      setDescription('')
      setFormError('')
    },
    onError: (e: any) => setFormError(e.message || e?.response?.data?.error || 'Error al registrar')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => commissionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-commissions'] })
  })

  const pending = commissions.filter(c => !c.isPaid).reduce((s, c) => s + c.amount, 0)
  const paid = commissions.filter(c => c.isPaid).reduce((s, c) => s + c.amount, 0)

  function getCycle(c: SaleCommission) {
    const start = new Date(c.cycleStart)
    const end = new Date(c.cycleEnd)
    return `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <DollarSign className="w-4 h-4" style={{ color: '#4ADE80' }} strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Mis comisiones</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Pendiente: <span style={{ color: 'var(--color-gold)' }}>${pending.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              {' · '}Pagado: <span style={{ color: '#4ADE80' }}>${paid.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); setShowForm(f => !f); setOpen(true) }}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Registrar venta
          </button>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--color-separator)' }}>
          {/* Add form */}
          {showForm && (
            <div className="px-5 py-4 space-y-3" style={{ borderBottom: '1px solid var(--color-separator)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Registrar venta / comisión</p>
              {formError && (
                <p className="text-xs p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>{formError}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Monto de comisión ($) *</label>
                  <input
                    type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" min="0" step="0.01"
                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Fecha de venta *</label>
                  <input
                    type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Descripción de la venta (opcional)</label>
                <input
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Ej: Cierre con empresa ABC – Plan Premium"
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowForm(false); setFormError('') }} className="flex-1 py-2 rounded-xl text-sm" style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}>
                  Cancelar
                </button>
                <button onClick={() => createMutation.mutate()} disabled={!amount || createMutation.isPending}
                  className="flex-1 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                  style={{ background: 'var(--color-gold)', color: '#0C0C0C' }}>
                  {createMutation.isPending ? 'Guardando...' : 'Registrar comisión'}
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Ciclo: 21 al 20 de cada mes · Pago: 12–15 del mes siguiente
              </p>
            </div>
          )}

          {/* List */}
          <div className="px-5 py-3 space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-gold)' }} />
              </div>
            ) : commissions.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                No hay comisiones registradas. ¡Registrá tu primera venta!
              </p>
            ) : (
              commissions.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                        ${c.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                      {c.isPaid
                        ? <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>
                            <BadgeCheck className="w-3 h-3" strokeWidth={2} /> Pagado
                          </span>
                        : <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)' }}>
                            <Clock className="w-3 h-3" strokeWidth={2} /> Pendiente
                          </span>
                      }
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(c.saleDate).toLocaleDateString('es-AR')} · Ciclo {getCycle(c)}
                      {c.description && ` · ${c.description}`}
                    </p>
                  </div>
                  {!c.isPaid && (
                    <button onClick={() => deleteMutation.mutate(c.id)} disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function IaConsultivaPage() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents-list'],
    queryFn: () => agentApi.list().then(r => r.data)
  })

  const agent = agents?.find((a: any) => a.type === 'CONSULTIVA' && a.published)

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
          <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>IA Consultiva no disponible</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            El agente IA Consultiva no está disponible en este momento. Contacta al administrador.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-6 md:-m-8">
      {/* Commission panel at the top */}
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex-shrink-0">
        <CommissionPanel />
      </div>
      {/* Chat takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface agent={agent} agentId={agent.id} />
      </div>
    </div>
  )
}
