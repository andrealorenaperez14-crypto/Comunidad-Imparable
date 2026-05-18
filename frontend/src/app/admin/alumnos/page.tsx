'use client'
import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp, Loader2, Search, KeyRound, Eye, EyeOff, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { metricsApi, adminUserApi } from '@/lib/api'
import { getStatusBg } from '@/lib/utils'

interface Student {
  id: string
  email: string
  dni: string
  profile: { firstName: string; lastName: string } | null
  subscription: { status: string } | null
}

function ResetPasswordModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [fieldError, setFieldError] = useState('')

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

  const inputStyle = {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-separator)',
    color: 'var(--color-text)'
  }

  const name = student.profile
    ? `${student.profile.firstName} ${student.profile.lastName}`
    : student.email

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

export default function AlumnosPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Users className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            Alumnos
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Gestión y seguimiento de estudiantes</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar alumno por nombre o email..."
          className="w-full rounded-xl px-4 py-3 pl-11 focus:outline-none"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-separator)',
            color: 'var(--color-text)'
          }}
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
            {students.map((student) => {
              const name = student.profile
                ? `${student.profile.firstName} ${student.profile.lastName}`
                : student.email
              const initial = (student.profile?.firstName || student.email)[0].toUpperCase()
              const isActive = student.subscription?.status === 'ACTIVE'
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}>
                    <span className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>{initial}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: isActive ? 'rgba(74,222,128,0.1)' : 'rgba(156,163,175,0.1)',
                          color: isActive ? '#4ADE80' : '#9CA3AF',
                          border: `1px solid ${isActive ? '#4ADE8040' : '#9CA3AF40'}`
                        }}>
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {student.email} · DNI {student.dni}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(student)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium flex-shrink-0"
                    style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
                  >
                    <KeyRound className="w-4 h-4" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Resetear</span>
                  </button>
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
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}
                  >
                    <span className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>
                      {alert.studentName[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{alert.studentName}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {alert.agentName} · {alert.alertMessage || 'Rendimiento bajo'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBg(alert.status)}`}>
                    {alert.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <ResetPasswordModal student={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
