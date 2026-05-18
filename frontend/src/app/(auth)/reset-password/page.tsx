'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { authApi } from '@/lib/api'

const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'

const schema = z.object({
  email: z.string().email('Email inválido'),
  otp: z.string().length(6, 'El código debe tener 6 dígitos').regex(/^\d+$/, 'Solo números'),
  newPassword: z.string()
    .min(8, PASSWORD_MSG).regex(/[A-Z]/, PASSWORD_MSG)
    .regex(/[0-9]/, PASSWORD_MSG).regex(/[!@#$%^&*]/, PASSWORD_MSG),
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

function ResetPasswordForm() {
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: params.get('email') || '' }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      await authApi.resetPassword(data.email, data.otp, data.newPassword)
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Código inválido o expirado.')
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 mx-auto" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Contraseña actualizada</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 1, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}
          >
            <KeyRound className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Nueva contraseña</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Ingresá el código y tu nueva contraseña</p>
        </div>

        <div className="card">
          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm mb-6"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.email && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Código de 6 dígitos
              </label>
              <input
                {...register('otp')}
                maxLength={6}
                placeholder="123456"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-center text-xl font-mono tracking-widest"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.otp && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.otp.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Nueva contraseña</label>
              <div className="relative">
                <input
                  {...register('newPassword')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mín. 8 car., mayúscula, número y símbolo"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Confirmar contraseña</label>
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

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          ¿No recibiste el código?{' '}
          <Link href="/forgot-password" style={{ color: 'var(--color-gold)', minHeight: 'unset', minWidth: 'unset' }}>
            Reenviar
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
