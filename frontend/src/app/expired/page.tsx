'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Star, Trophy } from 'lucide-react'

const ELITE_LINK = '/parte-2'
const WHATSAPP_LINK = '#' // TODO: reemplazar con el link del grupo de WhatsApp MPS

export default function ExpiredPage() {
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
        {/* Trophy icon */}
        <div className="flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(196,151,42,0.15)', border: '2px solid var(--color-gold-border)' }}
          >
            <Trophy className="w-12 h-12" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ color: 'var(--color-gold)' }}
          >
            ¡Ya cumpliste tus<br />5 días GRATUITOS!
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text)' }}>
            Esperamos que hayas descubierto todo tu potencial como asesor.
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Tu período de prueba ha finalizado. Elegí el camino que mejor se adapta a vos para continuar creciendo.
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ background: 'var(--color-separator)' }}
        />

        {/* CTA cards */}
        <div className="space-y-4">
          {/* Option 1: Elite */}
          <motion.a
            href={ELITE_LINK}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-5 rounded-2xl text-left w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(196,151,42,0.2) 0%, rgba(196,151,42,0.05) 100%)',
              border: '1px solid var(--color-gold-border)',
              textDecoration: 'none'
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-gold)' }}
            >
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

          {/* Option 2: WhatsApp MPS */}
          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-5 rounded-2xl text-left w-full"
            style={{
              background: 'rgba(37,211,102,0.08)',
              border: '1px solid rgba(37,211,102,0.3)',
              textDecoration: 'none'
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#25D366' }}
            >
              <MessageCircle className="w-6 h-6" style={{ color: '#fff' }} strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: '#25D366' }}>
                Comenzar como ASESOR Tradicional
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                Medicina Prepaga Salud MPS · Unite al grupo de WhatsApp
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
