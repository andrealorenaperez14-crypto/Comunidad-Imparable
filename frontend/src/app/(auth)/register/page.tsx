'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número'

const schema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  dni: z.string()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos numéricos')
    .refine(v => { const n = parseInt(v, 10); return n >= 8000000 && n <= 99999999 }, 'El DNI debe estar entre 08000000 y 99999999'),
  password: z.string()
    .min(8, PASSWORD_MSG)
    .regex(/[A-Z]/, PASSWORD_MSG)
    .regex(/[0-9]/, PASSWORD_MSG),
  confirmPassword: z.string(),
  terms: z.boolean().refine(v => v, 'Debes aceptar los términos')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

type FormData = z.infer<typeof schema>

const inputStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-separator)',
  color: 'var(--color-text)'
}

function getStrength(pwd: string): { label: string; score: number } {
  let score = 0
  if (pwd.length >= 8)    score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (score <= 1) return { label: 'Débil',  score }
  if (score <= 2) return { label: 'Media',  score }
  return               { label: 'Fuerte', score }
}

const STRENGTH_COLOR: Record<string, string> = {
  'Débil':  '#F87171',
  'Media':  '#C4972A',
  'Fuerte': '#4ADE80',
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const router = useRouter()
  const { register: registerUser } = useAuth()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const strength = passwordValue ? getStrength(passwordValue) : null

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      await registerUser({
        email: data.email,
        dni: data.dni,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse. Por favor intenta nuevamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--color-bg)' }}>
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
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Crea tu cuenta</h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            <span className="font-medium" style={{ color: 'var(--color-gold)' }}>5 días gratis, por ÚNICA vez</span>
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          {/* Error message */}
          {error && (
            <div
              className="px-5 py-4 rounded-lg text-sm mb-8 leading-relaxed"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}
            >
              {error}
            </div>
          )}

          {/* Form - MÁS SEPARACIÓN */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Name and Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text)', marginBottom: '1rem', display: 'block', fontSize: '13px' }}>
                  Nombre
                </label>
                <input
                  {...register('firstName')}
                  placeholder="María"
                  className="w-full rounded-xl px-4 py-10 focus:outline-none transition-all text-base"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                {errors.firstName && (
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text)', marginBottom: '1rem', display: 'block', fontSize: '13px' }}>
                  Apellido
                </label>
                <input
                  {...register('lastName')}
                  placeholder="García"
                  className="w-full rounded-xl px-4 py-10 focus:outline-none transition-all text-base"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                {errors.lastName && (
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text)', marginBottom: '1rem', display: 'block', fontSize: '13px' }}>
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl px-4 py-10 focus:outline-none transition-all text-base"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.email && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* DNI */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text)', marginBottom: '1rem', display: 'block', fontSize: '13px' }}>
                DNI
              </label>
              <input
                {...register('dni')}
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="12345678"
                className="w-full rounded-xl px-4 py-10 focus:outline-none transition-all text-base"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                onInput={e => {
                  const t = e.currentTarget
                  t.value = t.value.replace(/\D/g, '').slice(0, 8)
                }}
              />
              {errors.dni && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                  {errors.dni.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text)', marginBottom: '1rem', display: 'block', fontSize: '13px' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password', { onChange: e => setPasswordValue(e.target.value) })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mín. 8 car., 1 mayúscula y 1 número"
                  className="w-full rounded-xl px-4 py-10 focus:outline-none transition-all pr-12 text-base"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* Strength indicator - MÁS ESPACIO */}
              {strength && (
                <div className="mt-4 space-y-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength.score
                            ? STRENGTH_COLOR[strength.label]
                            : 'var(--color-separator)'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: STRENGTH_COLOR[strength.label] }}>
                    Contraseña {strength.label.toLowerCase()}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text)', marginBottom: '1rem', display: 'block', fontSize: '13px' }}>
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  className="w-full rounded-xl px-4 py-10 focus:outline-none transition-all pr-12 text-base"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: '#F87171' }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms - MÁS ESPACIO */}
            <label className="flex items-start gap-4 cursor-pointer pt-2">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1.5 w-5 h-5 rounded flex-shrink-0"
                style={{ border: '1px solid var(--color-separator)', background: 'var(--color-bg)' }}
              />
              <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Acepto los{' '}
                <Link href="/terminos" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--color-gold)' }}>
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--color-gold)' }}>
                  política de privacidad
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs leading-relaxed" style={{ color: '#F87171' }}>
                {errors.terms.message}
              </p>
            )}

            {/* Submit button - MÁS ALTURA */}
            <button
              type="submit"
              disabled={isSubmitting || (strength !== null && strength.label === 'Débil')}
              className="btn-primary w-full flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed py-10 text-base font-medium mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" strokeWidth={1.5} />
                  Crear cuenta gratis
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer - MÁS ESPACIO */}
        <p className="text-center mt-10 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--color-gold)' }}>
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
