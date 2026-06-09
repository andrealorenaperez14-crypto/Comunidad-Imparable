'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const PASSWORD_MSG = 'Mínimo 8 caracteres, una mayúscula y un número'

const schema = z.object({
  currentPassword: z.string().min(1, 'Ingresá tu contraseña provisoria'),
  newPassword: z.string().min(8, PASSWORD_MSG).regex(/[A-Z]/, PASSWORD_MSG).regex(/[0-9]/, PASSWORD_MSG),
  confirmPassword: z.string()
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden', path: ['confirmPassword']
})

type FormData = z.infer<typeof schema>

const inputStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-separator)',
  color: 'var(--color-text)'
}

export default function CambiarContrasenaPage() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword)
      setDone(true)
      setTimeout(() => {
        router.push(user?.role === 'ADMIN' || user?.role === 'CLIENT' ? '/admin' : '/dashboard')
      }, 2000)
    } catch (err: any) {
      setError('currentPassword', { message: err.response?.data?.error || 'Contraseña incorrecta.' })
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 mx-auto" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>¡Contraseña actualizada!</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}
          >
            <KeyRound className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Cambiá tu contraseña</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Ingresaste con una contraseña provisoria. Creá una nueva para continuar.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Contraseña provisoria</label>
              <div className="relative">
                <input
                  {...register('currentPassword')}
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="La que recibiste por email"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.currentPassword && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Nueva contraseña</label>
              <div className="relative">
                <input
                  {...register('newPassword')}
                  type={showNew ? 'text' : 'password'}
                  placeholder="Mín. 8 caracteres, mayúscula y número"
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
              {errors.newPassword && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Confirmar nueva contraseña</label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repetí tu nueva contraseña"
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
              {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Actualizando...</> : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
