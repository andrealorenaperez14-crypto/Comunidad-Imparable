'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, TrendingUp, Loader2, Search, KeyRound, Eye, EyeOff, CheckCircle, X, Trash2, DollarSign, Plus, BadgeCheck, Clock, Star, Mail, Copy, Check } from 'lucide-react'
import { metricsApi, adminUserApi, adminCommissionApi, subscriptionApi } from '@/lib/api'
import { getStatusBg } from '@/lib/utils'
import type { SaleCommission } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface Student {
  id: string
  email: string
  dni: string
  createdAt: string
  profile: { firstName: string; lastName: string; lastLoginAt?: string } | null
  subscriptions: { status: string; planType?: string; activeUntil?: string }[]
  subscription?: { status: string; planType?: string; activeUntil?: string } | null
}

function getDaysRemaining(activeUntil?: string): number | null {
  if (!activeUntil) return null
  const diff = new Date(activeUntil).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function ResetPasswordModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const inputStyle = { background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }
  const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : student.email

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => adminUserApi.resetStudentPassword(student.id, newPwd, confirmPwd),
    onSuccess: () => setDone(true)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError('')
    if (newPwd !== confirmPwd) { setFieldError('Las contraseñas no coinciden'); return }
    if (newPwd.length < 8) { setFieldError('Mínimo 8 caracteres'); return }
    mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}>
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
        {done ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 mx-auto" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Contraseña actualizada</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{name}</p>
            <button onClick={onClose} className="btn-primary" style={{ marginTop: '1rem' }}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}>
                <KeyRound className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Resetear contraseña</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{name}</p>
              </div>
            </div>
            {((error as any)?.response?.data?.error || fieldError) && (
              <div className="px-4 py-3 rounded-lg text-sm mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
                {fieldError || (error as any)?.response?.data?.error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Nueva contraseña</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)}
                    placeholder="Mín. 8 car., mayúscula, número, símbolo"
                    className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}>
                    {showNew ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Confirmar contraseña</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                    placeholder="Repetí la contraseña"
                    className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}>
                    {showConfirm ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isPending || !newPwd || !confirmPwd} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Actualizando...</> : 'Actualizar contraseña'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

function UpgradeVitalicioModal({ student, onClose, onDone }: { student: Student; onClose: () => void; onDone: () => void }) {
  const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : student.email
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: () => subscriptionApi.upgrade(student.id, 'VITALICIO'),
    onSuccess: () => { onDone() }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-sm text-center"
      >
        {isSuccess ? (
          <div className="py-4 space-y-3">
            <CheckCircle className="w-12 h-12 mx-auto" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Plan Vitalicio activado</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{name}</p>
            <button onClick={onClose} className="btn-primary mt-2">Cerrar</button>
          </div>
        ) : (
          <>
            <Star className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Activar Plan Vitalicio</h3>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{name}</p>
            <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
              El alumno tendrá acceso permanente sin fecha de vencimiento. La suscripción actual será reemplazada.
            </p>
            {(error as any)?.response?.data?.error && (
              <p className="text-sm mb-4" style={{ color: '#F87171' }}>{(error as any).response.data.error}</p>
            )}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm" style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}>
                Cancelar
              </button>
              <button onClick={() => mutate()} disabled={isPending} className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ background: 'var(--color-gold)', color: '#0C0C0C' }}>
                {isPending ? 'Activando...' : 'Confirmar'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

function EditEmailModal({ student, onClose, onDone }: { student: Student; onClose: () => void; onDone: (newEmail: string) => void }) {
  const [email, setEmail] = useState(student.email)
  const [fieldError, setFieldError] = useState('')
  const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : student.email

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => adminUserApi.updateEmail(student.id, email),
    onSuccess: () => { onDone(email) }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError('')
    if (!email.includes('@')) { setFieldError('Email inválido'); return }
    mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}>
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}>
            <Mail className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Editar email</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{name} · DNI {student.dni}</p>
          </div>
        </div>
        {((error as any)?.response?.data?.error || fieldError) && (
          <div className="px-4 py-3 rounded-lg text-sm mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
            {fieldError || (error as any)?.response?.data?.error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Nuevo email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 focus:outline-none"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
            />
          </div>
          <button type="submit" disabled={isPending || !email || email === student.email}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : 'Guardar email'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

function DeleteModal({ student, onClose, onDeleted }: { student: Student; onClose: () => void; onDeleted: () => void }) {
  const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : student.email
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => adminUserApi.deleteStudent(student.id),
    onSuccess: () => { onDeleted(); onClose() }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-sm text-center"
      >
        <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#F87171' }} strokeWidth={1.5} />
        <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>¿Eliminar alumno?</h3>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{name}</p>
        <p className="text-xs mb-6" style={{ color: '#F87171' }}>
          Se eliminarán todos sus datos: métricas, interacciones, certificados y comisiones. Esta acción no puede deshacerse.
        </p>
        {(error as any)?.response?.data?.error && (
          <p className="text-sm mb-4" style={{ color: '#F87171' }}>{(error as any).response.data.error}</p>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm" style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}>
            Cancelar
          </button>
          <button onClick={() => mutate()} disabled={isPending} className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50" style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
            {isPending ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function CommissionsModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const qc = useQueryClient()
  const { isAdmin } = useAuth()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10))
  const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : student.email

  const { data: commissions = [], isLoading } = useQuery<SaleCommission[]>({
    queryKey: ['admin-commissions', student.id],
    queryFn: () => adminCommissionApi.list({ studentId: student.id }).then(r => r.data.commissions)
  })

  const addMutation = useMutation({
    mutationFn: () => adminCommissionApi.create({ userId: student.id, amount: parseFloat(amount), description: description || undefined, saleDate }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-commissions', student.id] }); setShowAdd(false); setAmount(''); setDescription('') }
  })

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => adminCommissionApi.markPaid(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-commissions', student.id] })
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCommissionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-commissions', student.id] })
  })

  const totalPending = commissions.filter(c => !c.isPaid).reduce((s, c) => s + c.amount, 0)
  const totalPaid = commissions.filter(c => c.isPaid).reduce((s, c) => s + c.amount, 0)

  function getCycleLabel(c: SaleCommission) {
    const start = new Date(c.cycleStart)
    const end = new Date(c.cycleEnd)
    return `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-separator)' }}>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            <div>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Comisiones — {name}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>DNI {student.dni}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}>
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 px-6 pt-4">
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <p className="text-xl font-bold" style={{ color: '#4ADE80' }}>${totalPaid.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Total pagado</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(196,151,42,0.08)', border: '1px solid var(--color-gold-border)' }}>
            <p className="text-xl font-bold" style={{ color: 'var(--color-gold)' }}>${totalPending.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Pendiente de pago</p>
          </div>
        </div>

        {/* Add form */}
        {isAdmin && (
          <div className="px-6 pt-3">
            {showAdd ? (
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Nueva comisión</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Monto ($)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01"
                      className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Fecha de venta</label>
                    <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Descripción (opcional)</label>
                  <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej: Venta de plan básico a empresa XYZ"
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'} onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm" style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}>
                    Cancelar
                  </button>
                  <button onClick={() => addMutation.mutate()} disabled={!amount || addMutation.isPending}
                    className="flex-1 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                    style={{ background: 'var(--color-gold)', color: '#0C0C0C' }}>
                    {addMutation.isPending ? 'Guardando...' : 'Guardar comisión'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 text-sm font-medium py-2"
                style={{ color: 'var(--color-gold)' }}>
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Agregar comisión
              </button>
            )}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-gold)' }} /></div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Sin comisiones registradas</p>
            </div>
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
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(c.saleDate).toLocaleDateString('es-AR')} · Ciclo {getCycleLabel(c)}
                    {c.description && ` · ${c.description}`}
                  </p>
                </div>
                {isAdmin && !c.isPaid && (
                  <button onClick={() => markPaidMutation.mutate(c.id)} disabled={markPaidMutation.isPending}
                    className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.3)' }}>
                    Marcar pagado
                  </button>
                )}
                {isAdmin && (
                  <button onClick={() => deleteMutation.mutate(c.id)} disabled={deleteMutation.isPending}
                    className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-separator)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Ciclo: del 21 al 20 de cada mes · Pago: 12–15 del mes siguiente
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function AlumnosPage() {
  const { isAdmin } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [commissionTarget, setCommissionTarget] = useState<Student | null>(null)
  const [upgradeTarget, setUpgradeTarget] = useState<Student | null>(null)
  const [editEmailTarget, setEditEmailTarget] = useState<Student | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyStudentData(student: Student) {
    const sub = student.subscriptions?.[0] || student.subscription
    const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : ''
    const text = [
      `Nombre: ${name}`,
      `Email: ${student.email}`,
      `DNI: ${student.dni}`,
      `Fecha de ingreso: ${new Date(student.createdAt).toLocaleDateString('es-AR')}`,
      sub?.activeUntil ? `Vencimiento: ${new Date(sub.activeUntil).toLocaleDateString('es-AR')}` : '',
      `Estado: ${sub?.status || 'Sin suscripción'}`,
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(text)
    setCopiedId(student.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => metricsApi.dashboard().then(r => r.data)
  })

  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['admin-students', search],
    queryFn: () => adminUserApi.students(search).then(r => r.data),
    staleTime: 30000
  })

  const students: Student[] = studentsData?.students ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Users className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          Alumnos
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Gestión y seguimiento de estudiantes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar alumno por nombre, email o DNI..."
          className="w-full rounded-xl px-4 py-3 pl-11 focus:outline-none"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats?.totalStudents ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Total alumnos</p>
        </div>
        <div className="card text-center" style={{ borderColor: 'var(--color-gold-border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>{stats?.activeSubscriptions ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Activos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stats?.alertStudents ?? '—'}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Con alertas</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Lista de alumnos</h2>
        {loadingStudents ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-gold)' }} />
          </div>
        ) : students.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron alumnos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students.map(student => {
              const name = student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : student.email
              const initial = (student.profile?.firstName || student.email)[0].toUpperCase()
              const sub = student.subscriptions?.[0] || student.subscription
              const isVitalicio = sub?.planType === 'VITALICIO'
              const isTrial = sub?.planType === 'TRIAL'
              const isActive = sub?.status === 'ACTIVE' || sub?.status === 'TRIAL'
              const isExpired = !isActive && !!sub
              const badgeLabel = isVitalicio ? 'Vitalicio' : isTrial ? 'Prueba' : isActive ? 'Activo' : isExpired ? 'Vencido' : 'Sin plan'
              const badgeColor = isVitalicio ? 'var(--color-gold)' : isTrial ? '#60A5FA' : isActive ? '#4ADE80' : isExpired ? '#F87171' : '#9CA3AF'
              const badgeBg = isVitalicio ? 'rgba(196,151,42,0.1)' : isTrial ? 'rgba(96,165,250,0.1)' : isActive ? 'rgba(74,222,128,0.1)' : isExpired ? 'rgba(239,68,68,0.1)' : 'rgba(156,163,175,0.1)'
              const daysLeft = getDaysRemaining(sub?.activeUntil)
              const fechaIngreso = new Date(student.createdAt).toLocaleDateString('es-AR')
              return (
                <div key={student.id} className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-card)', border: `1px solid ${isExpired ? 'rgba(239,68,68,0.2)' : 'var(--color-separator)'}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}>
                    <span className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>{initial}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                        {badgeLabel}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {student.email} · DNI {student.dni}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      Ingreso: {fechaIngreso}
                      {daysLeft !== null && (
                        <span style={{ color: daysLeft <= 0 ? '#F87171' : daysLeft <= 3 ? '#FBBF24' : 'var(--color-text-muted)' }}>
                          {' · '}
                          {daysLeft <= 0 ? 'Vencido' : `${daysLeft} día${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}`}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyStudentData(student)}
                      title="Copiar datos del alumno"
                      className="p-2 rounded-xl transition-all"
                      style={{ color: copiedId === student.id ? '#4ADE80' : 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }}
                    >
                      {copiedId === student.id
                        ? <Check className="w-4 h-4" strokeWidth={1.5} />
                        : <Copy className="w-4 h-4" strokeWidth={1.5} />}
                    </button>
                    {sub?.planType !== 'VITALICIO' && (
                      <button onClick={() => setUpgradeTarget(student)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
                        style={{ background: 'rgba(196,151,42,0.08)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}>
                        <Star className="w-4 h-4" strokeWidth={1.5} />
                        <span className="hidden lg:inline">Vitalicio</span>
                      </button>
                    )}
                    <button onClick={() => setEditEmailTarget(student)}
                      className="p-2 rounded-xl" style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }}>
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => setCommissionTarget(student)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(74,222,128,0.08)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }}>
                      <DollarSign className="w-4 h-4" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Comisiones</span>
                    </button>
                    <button onClick={() => setSelected(student)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}>
                      <KeyRound className="w-4 h-4" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Resetear</span>
                    </button>
                    {isAdmin && (
                      <button onClick={() => setDeleteTarget(student)}
                        className="p-2 rounded-xl" style={{ color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : stats?.recentAlerts?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Alumnos con alertas</h2>
          <div className="space-y-2">
            {stats.recentAlerts
              .filter((a: any) => !search || a.studentName.toLowerCase().includes(search.toLowerCase()))
              .map((alert: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}>
                    <span className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>{alert.studentName[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{alert.studentName}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{alert.agentName} · {alert.alertMessage || 'Rendimiento bajo'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBg(alert.status)}`}>{alert.status}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <ResetPasswordModal student={selected} onClose={() => setSelected(null)} />}
        {deleteTarget && (
          <DeleteModal
            student={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => qc.invalidateQueries({ queryKey: ['admin-students'] })}
          />
        )}
        {commissionTarget && <CommissionsModal student={commissionTarget} onClose={() => setCommissionTarget(null)} />}
        {upgradeTarget && (
          <UpgradeVitalicioModal
            student={upgradeTarget}
            onClose={() => setUpgradeTarget(null)}
            onDone={() => {
              qc.invalidateQueries({ queryKey: ['admin-students'] })
              setUpgradeTarget(null)
            }}
          />
        )}
        {editEmailTarget && (
          <EditEmailModal
            student={editEmailTarget}
            onClose={() => setEditEmailTarget(null)}
            onDone={() => {
              qc.invalidateQueries({ queryKey: ['admin-students'] })
              setEditEmailTarget(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
