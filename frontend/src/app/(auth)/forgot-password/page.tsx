'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { KeyRound, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const schema = z.object({ email: z.string().email('Email inválido') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { executeRecaptcha } = useGoogleReCaptcha()

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('forgot_password') : undefined
      await authApi.forgotPassword(data.email, recaptchaToken)
      setSent(true)
    } catch {
      setError('Error al enviar el email. Intenta nuevamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            {sent ? 'Email enviado' : 'Olvidé mi contraseña'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {sent ? 'Revisá tu bandeja de entrada' : 'Te enviamos una contraseña provisoria'}
          </p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center space-y-6">
              <CheckCircle className="w-12 h-12 mx-auto" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
              <div className="space-y-2">
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  Si <span style={{ color: 'var(--color-gold)' }}>{getValues('email')}</span> está registrado, vas a recibir una contraseña provisoria por email.
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Usala para ingresar y luego cambiala desde tu perfil.
                </p>
              </div>
              <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                Ir al login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div
                  className="px-4 py-3 rounded-lg text-sm mb-6"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}
                >
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-separator)', color: 'var(--color-text)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  />
                  {errors.email && <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>{errors.email.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar contraseña provisoria'}
                </button>
              </form>
            </>
          )}
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 mt-6 text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--color-text-muted)', minHeight: 'unset', minWidth: 'unset' }}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Volver al login
        </Link>
      </motion.div>
    </div>
  )
}
