'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, KeyRound, Eye, EyeOff, Loader2, CheckCircle, X, Users } from 'lucide-react'
import { adminUserApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface User { id: string; email: string; dni: string; role: string; profile: { firstName: string; lastName: string } | null }

function RoleLabel({ role }: { role: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    ADMIN:   { bg: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)' },
    STUDENT: { bg: 'rgba(74,222,128,0.1)', color: '#4ADE80' },
    CLIENT:  { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA' },
  }
  const s = styles[role] || styles.STUDENT
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {role}
    </span>
  )
}

function ResetModal({ user, isAdmin, onClose }: { user: User; isAdmin: boolean; onClose: () => void }) {
  const [newPwd, setNewPwd]       = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNew, setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone]           = useState(false)
  const [fieldError, setFieldError] = useState('')

  const { mutate, isPending, error } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (): Promise<any> => user.role === 'STUDENT'
      ? adminUserApi.resetStudentPassword(user.id, newPwd, confirmPwd)
      : adminUserApi.resetPassword(user.email, newPwd, confirmPwd),
    onSuccess: () => setDone(true)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError('')
    if (newPwd !== confirmPwd) { setFieldError('Las contraseñas no coinciden'); return }
    if (newPwd.length < 8) { setFieldError('Mínimo 8 caracteres'); return }
    mutate()
  }

  const inputStyle = {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-separator)',
    color: 'var(--color-text)'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {done ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 mx-auto" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Contraseña actualizada</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
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
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {user.profile?.firstName} {user.profile?.lastName} · <RoleLabel role={user.role} />
                </p>
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
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                    placeholder="Mín. 8 car., mayúscula, número, símbolo"
                    className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPwd}
                    onChange={e => setConfirmPwd(e.target.value)}
                    placeholder="Repetí la contraseña"
                    className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isPending || !newPwd || !confirmPwd}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Actualizando...</> : 'Actualizar contraseña'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function UsuariosAdminPage() {
  const { isAdmin } = useAuth()
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)

  const handleSearch = async () => {
    if (query.trim().length < 2) return
    setSearching(true)
    try {
      const res = await adminUserApi.search(query.trim())
      setResults(res.data)
    } catch { setResults([]) }
    finally { setSearching(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Users className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          Gestión de Usuarios
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Resetear contraseña de cualquier usuario por email o DNI</p>
      </div>

      <div className="card">
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-text)' }}>Buscar usuario</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Email o DNI..."
              className="w-full rounded-xl px-4 py-3 pl-10 focus:outline-none transition-all"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || query.trim().length < 2}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
            style={{ margin: 0 }}
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" strokeWidth={1.5} />}
            Buscar
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 1, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}>
                <span className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>
                  {(user.profile?.firstName || user.email)[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                    {user.profile?.firstName} {user.profile?.lastName}
                  </p>
                  <RoleLabel role={user.role} />
                </div>
                <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                  {user.email} · DNI {user.dni}
                </p>
              </div>
              {(isAdmin || user.role === 'STUDENT') && (
                <button
                  onClick={() => setSelected(user)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0"
                  style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                >
                  <KeyRound className="w-4 h-4" strokeWidth={1.5} />
                  Resetear
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !searching && (
        <div className="card text-center">
          <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron usuarios para "{query}"</p>
        </div>
      )}

      <AnimatePresence>
        {selected && <ResetModal user={selected} isAdmin={isAdmin} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
