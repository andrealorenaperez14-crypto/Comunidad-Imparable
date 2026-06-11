'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Star, RefreshCw, Loader2 } from 'lucide-react'
import { subscriptionApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'

const WHATSAPP_LINK = 'https://chat.whatsapp.com/BkMTtbFbGwjAOsgD8pjUFH'
const API_URL       = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ExpiredPage() {
  const { user }                   = useAuth()
  const [loading, setLoading]      = useState(false)
  const [error, setError]          = useState('')

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn:  () => subscriptionApi.status().then(r => r.data),
    enabled:  !!user && user.role === 'STUDENT',
    retry:    false
  })

  const isPaidExpired = subData?.isExpired && !subData?.isTrial

  async function handleRenewal() {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res  = await fetch(`${API_URL}/api/payments/renewal/create`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: '{}',
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al generar el pago')
      window.location.href = data.init_point
    } catch (err: any) {
      setError(err.message || 'Hubo un error. Intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--color-bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-lg text-center space-y-8"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(196,151,42,0.15)', border: '2px solid var(--color-gold-border)' }}
          >
            {isPaidExpired
              ? <RefreshCw className="w-12 h-12" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
              : <Star      className="w-12 h-12" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            }
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold leading-tight" style={{ color: 'var(--color-gold)' }}>
            {isPaidExpired
              ? 'Tu acceso venció'
              : '¡Ya cumpliste tus 5 días GRATUITOS!'
            }
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text)' }}>
            {isPaidExpired
              ? 'Renová tu membresía para seguir en la plataforma.'
              : 'Esperamos que hayas descubierto todo tu potencial como asesor.'
            }
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {isPaidExpired
              ? 'Podés renovar cuando quieras. Cada pago activa 30 días de acceso.'
              : 'Tu período de prueba ha finalizado. Elegí el camino que mejor se adapta a vos.'
            }
          </p>
        </div>

        <div className="h-px w-full" style={{ background: 'var(--color-separator)' }} />

        {/* CTAs */}
        <div className="space-y-4">
          {isPaidExpired ? (
            <>
              {/* Renovar */}
              <motion.button
                onClick={handleRenewal}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex items-center gap-4 p-5 rounded-2xl text-left w-full disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(196,151,42,0.2) 0%, rgba(196,151,42,0.05) 100%)',
                  border: '1px solid var(--color-gold-border)',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-gold)' }}>
                  {loading
                    ? <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#0C0C0C' }} />
                    : <RefreshCw className="w-6 h-6" style={{ color: '#0C0C0C' }} strokeWidth={2} />
                  }
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--color-gold)' }}>
                    Renovar membresía — 20 USD/mes
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Pago seguro con Mercado Pago · Acceso inmediato por 30 días
                  </p>
                </div>
              </motion.button>
              {error && <p className="text-sm" style={{ color: '#F87171' }}>{error}</p>}
            </>
          ) : (
            /* Trial vencido → ir a Elite */
            <motion.a
              href="/parte-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-5 rounded-2xl text-left w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(196,151,42,0.2) 0%, rgba(196,151,42,0.05) 100%)',
                border: '1px solid var(--color-gold-border)',
                textDecoration: 'none'
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-gold)' }}>
                <Star className="w-6 h-6" style={{ color: '#0C0C0C' }} strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--color-gold)' }}>
                  INICIAR membresía ASESOR ELITE Internacional
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  Acceso completo · Formación avanzada · Comunidad exclusiva
                </p>
              </div>
            </motion.a>
          )}

          {/* WhatsApp siempre visible */}
          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-5 rounded-2xl text-left w-full"
            style={{
              background: 'rgba(196,151,42,0.08)',
              border: '1px solid var(--color-gold-border)',
              textDecoration: 'none'
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold-border)' }}>
              <MessageCircle className="w-6 h-6" style={{ color: 'var(--color-gold)' }} strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
                {isPaidExpired ? 'Necesito ayuda' : 'Comenzar como ASESOR Tradicional'}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {isPaidExpired ? 'Contactanos por WhatsApp' : 'Medicina Prepaga Salud MPS · Unite al grupo de WhatsApp'}
              </p>
            </div>
          </motion.a>
        </div>

        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          ¿Tenés dudas? Contactanos a través de WhatsApp.
        </p>
      </motion.div>
    </div>
  )
}
