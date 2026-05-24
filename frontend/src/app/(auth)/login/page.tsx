'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const result = await login(data.email, data.password)
      const role = result.user.role
      router.push(role === 'ADMIN' || role === 'CLIENT' ? '/admin' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--color-bg)' }}>
      {/* Volver al inicio */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
        <Link href="/" style={{
          display: 'inline-block',
          background: 'rgba(12,12,12,0.85)',
          border: '1px solid var(--color-gold-border)',
          color: 'var(--color-gold)',
          padding: '0.45rem 1.1rem',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          textDecoration: 'none',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.04em'
        }}>
          ← Volver al INICIO
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 1, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header - MÁS ESPACIO */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}
          >
            <Brain className="w-8 h-8" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Bienvenido de vuelta</h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Card - MÁS PADDING INTERNO */}
        <div className="card p-8">
          {/* Error message - MÁS ESPACIO */}
          {error && (
            <div
              className="px-5 py-4 rounded-lg text-sm mb-8 leading-relaxed"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}
            >
              {error}
            </div>
          )}

          {/* Form - MÁS SEPARACIÓN */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
            {/* Email field */}
            <div>
              <label className="block text-sm font-bold mb-5" style={{ color: 'var(--color-text)' }}>
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl px-4 py-7 transition-all focus:outline-none text-base"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-separator)',
                  color: 'var(--color-text)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.email && (
                <p className="mt-2.5 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-bold mb-5" style={{ color: 'var(--color-text)' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-7 transition-all focus:outline-none pr-12 text-base"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-separator)',
                    color: 'var(--color-text)'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-1"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2.5 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button - MÁS ALTURA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed py-7 text-base font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer links - MÁS ESPACIO */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            <Link
              href="/forgot-password"
              style={{ color: 'var(--color-gold)' }}
              className="hover:opacity-80 transition-opacity"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-gold)' }}
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
