'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { KeyRound } from 'lucide-react'

function ResetPasswordContent() {
  const params = useSearchParams()
  const email = params.get('email') || ''

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md text-center space-y-6">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2"
          style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}
        >
          <KeyRound className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Revisá tu email</h1>

        <div className="card text-left space-y-4">
          <p style={{ color: 'var(--color-text-muted)' }}>
            Te enviamos una contraseña provisoria
            {email && <> a <span style={{ color: 'var(--color-text)' }}>{email}</span></>}.
          </p>
          <ol className="space-y-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <li><span style={{ color: 'var(--color-gold)' }}>1.</span> Buscá el email con asunto "Tu acceso a la Escuela".</li>
            <li><span style={{ color: 'var(--color-gold)' }}>2.</span> Iniciá sesión con esa contraseña provisoria.</li>
            <li><span style={{ color: 'var(--color-gold)' }}>3.</span> El sistema te pedirá crear una contraseña nueva.</li>
          </ol>
        </div>

        <Link
          href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
          className="btn-primary w-full flex items-center justify-center"
        >
          Ir al login
        </Link>

        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          ¿No recibiste el email?{' '}
          <Link href="/forgot-password" style={{ color: 'var(--color-gold)' }}>
            Volver a intentar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
