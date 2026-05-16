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

const PASSWORD_MSG = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'

const schema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  dni: z.string().min(6, 'DNI inválido').max(20, 'DNI demasiado largo'),
  password: z.string()
    .min(8, PASSWORD_MSG)
    .regex(/[A-Z]/, PASSWORD_MSG)
    .regex(/[0-9]/, PASSWORD_MSG)
    .regex(/[!@#$%^&*]/, PASSWORD_MSG),
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
  if (pwd.length >= 8)       score++
  if (/[A-Z]/.test(pwd))    score++
  if (/[0-9]/.test(pwd))    score++
  if (/[!@#$%^&*]/.test(pwd)) score++
  if (score <= 1) return { label: 'Débil',  score }
  if (score <= 3) return { label: 'Media',  score }
  return               { label: 'Fuerte', score }
}

const STRENGTH_COLOR: Record<string, string> = {
  'Débil':  '#F87171',
  'Media':  '#C4972A',
  'Fuerte': '#4ADE80',
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}
          >
            <Brain className="w-8 h-8" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Crea tu cuenta</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            <span className="font-medium" style={{ color: 'var(--color-gold)' }}>5 días gratis</span> con acceso completo
          </p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Nombre</label>
                <input
                  {...register('firstName')}
                  placeholder="María"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                {errors.firstName && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Apellido</label>
                <input
                  {...register('lastName')}
                  placeholder="García"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
                {errors.lastName && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.email && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                DNI / Documento de identidad
              </label>
              <input
                {...register('dni')}
                placeholder="12345678"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.dni && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.dni.message}</p>}
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>Usado como identificador único — no puede duplicarse</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Contraseña</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mín. 8 car., mayúscula, número y símbolo"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all pr-12"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                  onChange={e => setPasswordValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>

              {/* Strength indicator */}
              {strength && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength.score
                            ? STRENGTH_COLOR[strength.label]
                            : 'var(--color-separator)'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: STRENGTH_COLOR[strength.label] }}>
                    {strength.label}
                  </p>
                </div>
              )}

              {errors.password && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Confirmar contraseña</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Repite tu contraseña"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 w-4 h-4 rounded"
                style={{ border: '1px solid var(--color-separator)', background: 'var(--color-bg)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Acepto los{' '}
                <Link href="/terminos" className="hover:underline" style={{ color: 'var(--color-gold)' }}>
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" className="hover:underline" style={{ color: 'var(--color-gold)' }}>
                  política de privacidad
                </Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs" style={{ color: '#F87171' }}>{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting || (strength !== null && strength.label === 'Débil')}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium" style={{ color: 'var(--color-gold)' }}>
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
