'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { sanitizeHtml } from '@/lib/sanitize'

// Programa principal con precio en USD
const USD_CONECTA  = 83
const API_URL      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// WhatsApp con texto pre-cargado según programa
const WA_BASE = 'https://wa.me/5492914708460'
const WA_CLARIDAD  = `${WA_BASE}?text=${encodeURIComponent('Hola Cintia, llegué desde tu web (Sesión de Claridad) y me gustaría agendar mi sesión gratuita de 20 minutos.')}`
const WA_CONECTA   = `${WA_BASE}?text=${encodeURIComponent('Hola Cintia, llegué desde tu web (Método Conecta con tu Ser) y tengo una consulta antes de inscribirme.')}`
const WA_VENDER    = `${WA_BASE}?text=${encodeURIComponent('Hola Cintia, llegué desde tu web (Método Vender desde tu Ser) y quiero saber más sobre el programa grupal.')}`

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ border: '1px solid var(--color-gold-border)', borderRadius: '0.75rem', overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '1rem 1.25rem',
          textAlign: 'left', fontWeight: 600,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
          background: open ? 'rgba(193,125,26,0.1)' : 'transparent',
          cursor: 'pointer', color: 'var(--color-text)', border: 'none'
        }}
      >
        <span>{q}</span>
        <span style={{ color: 'var(--color-gold)', fontSize: '1.25rem', flexShrink: 0, marginLeft: '1rem' }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--color-gold-border)',
          background: 'rgba(193,125,26,0.05)',
          color: 'var(--color-text-muted)',
          fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
          lineHeight: 1.7, textAlign: 'left'
        }}>
          {a}
        </div>
      )}
    </motion.div>
  )
}

export default function Parte2() {
  return (
    <Suspense>
      <Parte2Inner />
    </Suspense>
  )
}

const PILARES = [
  { num: 'I',   title: 'Escucha',    desc: 'Comprender qué está viviendo la persona, sin juzgarla.' },
  { num: 'II',  title: 'Consciencia', desc: 'Identificar los bloqueos, patrones o creencias que condicionan sus decisiones.' },
  { num: 'III', title: 'Claridad',   desc: 'Reconocer lo que quiere, sus capacidades y una dirección posible.' },
  { num: 'IV',  title: 'Acción',     desc: 'Impulsarla a tomar decisiones y dar pasos concretos hacia lo que desea.' },
]

function PilaresCarousel() {
  const [active, setActive] = useState(0)
  const total = PILARES.length

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % total), 3200)
    return () => clearInterval(id)
  }, [total])

  const getPos = (i: number) => {
    const diff = ((i - active + total) % total)
    if (diff === 0) return { scale: 1, x: '0%', z: 10, opacity: 1 }
    if (diff === 1 || diff === total - 1) {
      const side = diff === 1 ? 1 : -1
      return { scale: 0.82, x: `${side * 110}%`, z: 6, opacity: 0.55 }
    }
    return { scale: 0.65, x: diff < total / 2 ? '200%' : '-200%', z: 1, opacity: 0.15 }
  }

  return (
    <section style={{ width: '100%', padding: 'clamp(3rem,6vw,5rem) 0 0', overflow: 'hidden' }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <p style={{ textAlign: 'center', fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1.75rem' }}>
          Mi metodología · 4 pilares
        </p>

        <div style={{ position: 'relative', height: 'clamp(160px, 28vw, 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {PILARES.map((pilar, i) => {
            const pos = getPos(i)
            return (
              <motion.div
                key={pilar.num}
                onClick={() => setActive(i)}
                animate={{ scale: pos.scale, x: pos.x, opacity: pos.opacity, zIndex: pos.z }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'absolute',
                  width: 'clamp(220px, 36vw, 320px)',
                  cursor: 'pointer',
                  borderRadius: '0.875rem',
                  border: `1px solid ${i === active ? 'var(--color-gold)' : 'rgba(193,125,26,0.25)'}`,
                  background: i === active
                    ? 'linear-gradient(135deg, rgba(43,27,61,0.98) 0%, rgba(31,18,56,0.98) 100%)'
                    : 'rgba(31,18,56,0.9)',
                  boxShadow: i === active ? '0 16px 48px rgba(193,125,26,0.18), 0 0 0 1px rgba(193,125,26,0.12)' : 'none',
                  padding: 'clamp(1.25rem,2.5vw,1.75rem)',
                  userSelect: 'none',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {pilar.num}
                </p>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, color: i === active ? 'var(--color-text)' : 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  {pilar.title}
                </h3>
                <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {pilar.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginTop: '1.5rem' }}>
          {PILARES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? '1.5rem' : '0.375rem',
                height: '0.375rem',
                borderRadius: '9999px',
                background: i === active ? 'var(--color-gold)' : 'rgba(193,125,26,0.25)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease', padding: 0
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function Parte2Inner() {
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ nombre: '', apellido: '', dni: '', email: '', whatsapp: '' })
  const [sending, setSending]     = useState(false)
  const [formError, setFormError] = useState('')
  const [mepRate, setMepRate]     = useState<number | null>(null)
  const [mepLoading, setMepLoading] = useState(true)
  const searchParams              = useSearchParams()
  const pagoStatus                = searchParams.get('pago')
  const { executeRecaptcha }      = useGoogleReCaptcha()

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/bolsa')
      .then(r => r.json())
      .then(d => setMepRate(d.venta))
      .catch(() => setMepRate(null))
      .finally(() => setMepLoading(false))
  }, [])

  const pesoAmount = mepRate ? Math.round(USD_CONECTA * mepRate) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.apellido.trim() || !form.dni.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setFormError('Completá todos los campos')
      return
    }
    if (!/^\d{7,8}$/.test(form.dni.trim())) {
      setFormError('El DNI debe tener 7 u 8 dígitos')
      return
    }
    setSending(true)
    setFormError('')
    try {
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('vip_payment') : undefined
      const safeForm = {
        nombre:   sanitizeHtml(form.nombre),
        apellido: sanitizeHtml(form.apellido),
        dni:      form.dni.trim(),
        email:    form.email.trim(),
        whatsapp: sanitizeHtml(form.whatsapp),
      }
      const res  = await fetch(`${API_URL}/api/payments/vip/create`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...safeForm, recaptchaToken })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear el pago')
      trackEvent('vip_payment_started')
      window.location.href = data.init_point
    } catch (err: any) {
      setFormError(err.message || 'Hubo un error. Intentá de nuevo.')
      setSending(false)
    }
  }

  return (
    <div style={{
      width: '100%',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      textAlign: 'center',
      overflowX: 'hidden'
    }}>

      {/* Nav fija superior derecha */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '0.5rem' }}>
        <Link href="/" style={{
          display: 'inline-block',
          background: 'rgba(22,13,40,0.85)',
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
          ← Inicio
        </Link>
        <Link href="/login" style={{
          display: 'inline-block',
          background: 'rgba(22,13,40,0.85)',
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
          Plataforma
        </Link>
      </div>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem,8vw,6rem) clamp(1rem,5vw,3rem) clamp(2rem,4vw,3rem)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center top, rgba(193,125,26,0.13) 0%, transparent 65%)'
        }} />
        <div style={{ position: 'absolute', left: 0, top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(193,125,26,0.3), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(193,125,26,0.3), transparent)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: '1.25rem' }}
          >
            Mentora en Transformación Personal
          </motion.p>

          {/* Nombre */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '0.5rem',
              letterSpacing: '0.04em'
            }}
          >
            Cintia
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '0.04em',
              color: 'var(--color-gold)'
            }}
          >
            Paolucci
          </motion.h1>

          {/* Separador */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ height: '2px', width: '80px', background: 'linear-gradient(to right, var(--color-gold), transparent)', margin: '0 auto 1.75rem', borderRadius: '2px' }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
              color: 'var(--color-text)',
              lineHeight: 1.8,
              maxWidth: '540px',
              margin: '0 auto 1.75rem',
            }}
          >
            Recuperá la confianza en vos, encontrá claridad y{' '}
            <strong style={{ color: 'var(--color-gold)' }}>animate a ir por eso que hace tiempo venís postergando.</strong>
          </motion.p>

          {/* Valores de oferta */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem', marginBottom: '2rem' }}
          >
            {[
              { label: 'Transformación personal' },
              { label: 'Identidad y confianza' },
              { label: 'Claridad y acción' },
              { label: 'De adentro hacia afuera' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '0.45rem 1rem',
                borderRadius: '2rem',
                border: '1px solid var(--color-gold-border)',
                background: 'rgba(193,125,26,0.06)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)'
              }}>
                {item.label}
              </div>
            ))}
          </motion.div>

          {/* CTA scroll */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}
          >
            Conocé los programas disponibles ↓
          </motion.p>

        </div>
      </section>

      {/* ══════════════════ CARRUSEL PILARES ══════════════════ */}
      <PilaresCarousel />

      {/* ══════════════════ SOBRE CINTIA ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1rem', textAlign: 'center' }}
          >
            Mi historia
          </motion.p>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 700, marginBottom: '2.5rem', textAlign: 'center' }}
          >
            Acompaño desde lo que viví
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Foto */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ flex: '0 0 clamp(200px, 30vw, 280px)', maxWidth: '280px', margin: '0 auto' }}
            >
              <img
                src="/assets/client1/cintia0.webp"
                alt="Cintia Paolucci"
                style={{ width: '100%', aspectRatio: '3/4', borderRadius: '1.25rem', border: '1px solid rgba(193,125,26,0.2)', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </motion.div>

            {/* Texto */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              'Fui mamá adolescente, atravesé diferentes desafíos personales y laborales y aprendí desde muy joven la importancia de la resiliencia.',
              'Me formé en el mundo de la estética y durante esos años descubrí algo que siempre estuvo en mí: me apasionaba escuchar a las personas y acompañarlas. Sin embargo, internamente atravesaba inseguridades, miedos y creencias que muchas veces me hacían sentir que no era suficiente.',
              'Mi búsqueda de crecimiento personal y espiritual me llevó a cuestionarme, escucharme, conectar con mi interior. Me formé en coaching ontológico integrando conocimientos y herramientas a mi propio proceso.',
              'Hoy pongo mi historia, mi experiencia y mi capacidad de escucha al servicio de otras personas. No acompaño desde la idea de tener todas las respuestas. Acompaño desde la comprensión, la verdad, la experiencia y el compromiso con la transformación personal.',
            ].map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: 'var(--color-text-muted)', lineHeight: 1.85 }}
              >
                {p}
              </motion.p>
            ))}

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                marginTop: '1.5rem',
                padding: '1.5rem 2rem',
                borderRadius: '0.875rem',
                border: '1px solid var(--color-gold-border)',
                background: 'rgba(193,125,26,0.06)',
                textAlign: 'center'
              }}
            >
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--color-gold)', fontStyle: 'italic', lineHeight: 1.5 }}>
                &ldquo;No viniste a encajar, viniste a recordar quién sos.&rdquo;
              </p>
            </motion.div>
          </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PROGRAMAS ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'rgba(193,125,26,0.03)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1rem', textAlign: 'center' }}
          >
            Programas y acompañamientos
          </motion.p>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}
          >
            Encontrá el espacio que necesitás
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

            {/* A — Sesión de Claridad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              style={{
                padding: 'clamp(1.5rem,3vw,2rem)',
                borderRadius: '0.875rem',
                border: '1px solid var(--color-gold-border)',
                background: 'rgba(22,13,40,0.9)',
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '1rem'
              }}
            >
              <div>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>A</p>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                  Sesión de Claridad
                </h3>
                <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  Un espacio individual de escucha y orientación para ordenar lo que estás viviendo, reconocer qué puede estar frenándote y encontrar mayor claridad sobre tu próximo paso.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Zoom · 20 min', 'Gratuita', 'Individual'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--color-gold-border)', color: 'var(--color-text-muted)' }}>{tag}</span>
                ))}
              </div>
              <div style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}>
                GRATIS
              </div>
              <a
                href={WA_CLARIDAD}
                target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent('claridad_whatsapp_clicked')}
                style={{
                  width: '100%', padding: '0.875rem 1.5rem',
                  background: 'rgba(193,125,26,0.1)',
                  color: 'var(--color-gold)',
                  fontWeight: 700, borderRadius: '0.75rem',
                  fontSize: '0.9rem', letterSpacing: '0.05em',
                  border: '1px solid var(--color-gold-border)',
                  cursor: 'pointer', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="var(--color-gold)"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.424A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Agendar por WhatsApp
              </a>
            </motion.div>

            {/* B — Conecta con tu Ser */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                padding: 'clamp(1.5rem,3vw,2rem)',
                borderRadius: '0.875rem',
                border: '2px solid var(--color-gold)',
                background: 'linear-gradient(135deg, rgba(193,125,26,0.08) 0%, rgba(22,13,40,0.95) 100%)',
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-gold)', color: '#160D28', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', padding: '0.2rem 1rem', borderRadius: '0 0 0.5rem 0.5rem', textTransform: 'uppercase' }}>
                Más elegido
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>B</p>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                  Método: Conecta con tu Ser
                </h3>
                <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  Acompañamiento individual para trabajar tu confianza, identidad, creencias, claridad, potencial y capacidad de tomar acción. Dejá de postergarte y comenzá a tomar decisiones más alineadas con quien elegís ser.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['5 encuentros · 1 h', 'Zoom individual', 'Ejercicios prácticos'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--color-gold-border)', color: 'var(--color-text-muted)' }}>{tag}</span>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', lineHeight: 1 }}>
                  83 USD
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Pago único · 5 sesiones</p>
              </div>
              <button
                onClick={() => { document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); trackEvent('conecta_buy_clicked') }}
                style={{
                  width: '100%', padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #D4943A, #C17D1A)',
                  color: '#160D28', fontWeight: 700, borderRadius: '0.75rem',
                  fontSize: '0.95rem', letterSpacing: '0.05em',
                  boxShadow: '0 8px 24px rgba(193,125,26,0.4)',
                  cursor: 'pointer', border: 'none'
                }}
              >
                Inscribirme ahora
              </button>
              <a
                href={WA_CONECTA}
                target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent('conecta_whatsapp_clicked')}
                style={{
                  width: '100%', padding: '0.75rem',
                  background: 'transparent', color: 'var(--color-text-muted)',
                  fontSize: '0.82rem', letterSpacing: '0.04em',
                  border: '1px solid var(--color-gold-border)',
                  cursor: 'pointer', textDecoration: 'none', borderRadius: '0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.424A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </motion.div>

            {/* C — Vender desde tu Ser */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              style={{
                padding: 'clamp(1.5rem,3vw,2rem)',
                borderRadius: '0.875rem',
                border: '1px solid var(--color-gold-border)',
                background: 'rgba(22,13,40,0.9)',
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '1rem'
              }}
            >
              <div>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>C · Grupal</p>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                  Método: Vender desde tu Ser
                </h3>
                <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  Programa grupal de 3 meses para personas que tienen un producto, servicio o emprendimiento y desean transformar su relación con la venta — desde la confianza, no desde la presión.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Mes 1: Creencias sobre la venta + confianza',
                  'Mes 2: Mostrarte y conectar con clientes',
                  'Mes 3: Ofrecimientos reales + sostener la acción',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                    <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['12 encuentros · 3 meses', 'En vivo', 'WhatsApp grupal'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--color-gold-border)', color: 'var(--color-text-muted)' }}>{tag}</span>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Inversión</p>
                <p style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}>
                  Consultar
                </p>
              </div>
              <a
                href={WA_VENDER}
                target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent('vender_whatsapp_clicked')}
                style={{
                  width: '100%', padding: '0.875rem 1.5rem',
                  background: 'rgba(193,125,26,0.1)',
                  color: 'var(--color-gold)',
                  fontWeight: 700, borderRadius: '0.75rem',
                  fontSize: '0.9rem', letterSpacing: '0.05em',
                  border: '1px solid var(--color-gold-border)',
                  cursor: 'pointer', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="var(--color-gold)"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.424A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════ OFERTA IRRESISTIBLE ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'linear-gradient(180deg, rgba(22,13,40,0) 0%, rgba(193,125,26,0.05) 50%, rgba(22,13,40,0) 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(300px,60vw,700px)', height: 'clamp(300px,60vw,700px)', background: 'radial-gradient(circle, rgba(193,125,26,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: '1rem' }}
          >
            La transformación que te espera
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.4rem, 3.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '1.25rem' }}
          >
            ¿Qué cambia cuando trabajás<br />
            <span style={{ color: 'var(--color-gold)' }}>con Cintia?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'var(--color-text-muted)', lineHeight: 1.85, marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}
          >
            Muchas personas saben lo que quieren. El problema no es la claridad sobre el destino.
            El problema es que hay algo entre vos y eso que querés —
            un miedo, una creencia, una voz que dice <em>&ldquo;no puedo&rdquo;</em>, <em>&ldquo;no es para mí&rdquo;</em>, <em>&ldquo;ya es tarde&rdquo;</em>.
            El trabajo de Cintia es ayudarte a descubrir exactamente qué es, y acompañarte a atravesarlo.
          </motion.p>

          {/* Antes / Después */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

            {/* Antes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                padding: 'clamp(1.5rem,3vw,2rem)',
                borderRadius: '0.875rem',
                border: '1px solid rgba(250,248,245,0.1)',
                background: 'rgba(22,13,40,0.7)',
                textAlign: 'left'
              }}
            >
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(250,248,245,0.35)', marginBottom: '1.25rem' }}>Hoy, antes del proceso</p>
              {[
                'Sabés que tenés potencial, pero no te animás a actuar sobre él',
                'Empezás cosas y las dejás — no por floja, sino por miedo a fallar',
                'Buscás la aprobación de otros antes de confiar en tus decisiones',
                'Sentís que siempre es el momento equivocado para empezar',
                'Hay algo que venís postergando hace meses (o años)',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'rgba(250,248,245,0.25)', marginTop: '0.1rem', flexShrink: 0, fontSize: '0.9rem' }}>✗</span>
                  <span style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'rgba(250,248,245,0.45)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Después */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                padding: 'clamp(1.5rem,3vw,2rem)',
                borderRadius: '0.875rem',
                border: '1px solid var(--color-gold)',
                background: 'linear-gradient(135deg, rgba(193,125,26,0.1) 0%, rgba(22,13,40,0.85) 100%)',
                textAlign: 'left',
                boxShadow: '0 8px 32px rgba(193,125,26,0.15)'
              }}
            >
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>Después del proceso con Cintia</p>
              {[
                'Reconocés tu valor y confiás en tus capacidades para actuar',
                'Tomás decisiones coherentes con quien elegís ser — sin pedir permiso',
                'Identificás y atravesás los miedos en lugar de dejar que te paren',
                'Empezás a cumplirte los compromisos que asumís con vos misma',
                'Ese proyecto que venías postergando — finalmente empieza a moverse',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', marginTop: '0.1rem', flexShrink: 0, fontSize: '0.9rem' }}>✓</span>
                  <span style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--color-text)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Quote central */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: 'clamp(1.75rem,4vw,2.5rem) clamp(1.5rem,4vw,3rem)',
              borderRadius: '0.875rem',
              border: '1px solid var(--color-gold-border)',
              background: 'rgba(193,125,26,0.04)',
              marginBottom: '2.5rem'
            }}
          >
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              &ldquo;No necesitás dejar de tener miedo para empezar.<br />
              <span style={{ color: 'var(--color-gold)' }}>Podés sentir miedo y aun así animarte a dar el siguiente paso.&rdquo;</span>
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>— Cintia Paolucci</p>
          </motion.div>

          {/* Para quién es */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '2.5rem' }}
          >
            <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1rem' }}>
              Este acompañamiento es para vos si…
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem' }}>
              {[
                'Tenés ideas que venís postergando',
                'Sabés que querés algo más',
                'Te cuesta reconocer tu propio valor',
                'Buscás claridad y dirección',
                'Querés emprender o crear un proyecto',
                'Necesitás animarte a mostrarte',
                'Querés tomar decisiones más conscientes',
                'Estás cansada de bloquearte sola',
              ].map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--color-gold-border)',
                    background: 'rgba(193,125,26,0.05)',
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA final */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              El primer paso es gratis. Sin compromisos. Solo una conversación.
            </p>
            <a
              href={WA_CLARIDAD}
              target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent('transformacion_claridad_clicked')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                padding: '1.1rem 2.5rem',
                background: 'linear-gradient(135deg, #D4943A, #C17D1A)',
                color: '#160D28', fontWeight: 700, borderRadius: '0.75rem',
                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', letterSpacing: '0.04em',
                boxShadow: '0 8px 28px rgba(193,125,26,0.45)',
                cursor: 'pointer', textDecoration: 'none'
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#160D28"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.424A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#160D28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Quiero mi Sesión de Claridad gratuita
            </a>
            <button
              onClick={() => { document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); trackEvent('transformacion_conecta_clicked') }}
              style={{
                padding: '0.875rem 2rem',
                background: 'transparent',
                color: 'var(--color-gold)',
                fontWeight: 600, borderRadius: '0.75rem',
                fontSize: '0.9rem',
                border: '1px solid var(--color-gold-border)',
                cursor: 'pointer'
              }}
            >
              Ver programa Conecta con tu Ser — 83 USD →
            </button>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════ IA CONSULTIVA ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Acompañamiento inteligente
          </motion.h2>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Al inscribirte en la Academia Comunidad Imparable, accedés a la <strong style={{ color: 'var(--color-gold)' }}>IA Consultiva 24/7</strong> — tu asistente de desarrollo personal que responde tus dudas, guía tu proceso y acompaña tu crecimiento cuando lo necesitás.
          </motion.p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-gold-border)',
            color: 'var(--color-gold)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: 'rgba(193,125,26,0.06)'
          }}>
            Ver Academia Comunidad Imparable →
          </Link>
        </div>
      </section>

      {/* ══════════════════ INSCRIPCIÓN — Conecta con tu Ser ══════════════════ */}
      <section id="inscripcion" style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)', background: 'rgba(193,125,26,0.03)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '0.75rem' }}
          >
            Método B · Inscripción
          </motion.p>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '2.5rem' }}>
            Conecta con tu Ser
          </motion.h2>

          <div style={{
            padding: 'clamp(1.75rem,5vw,2.5rem)',
            borderRadius: '0.875rem',
            border: '2px solid var(--color-gold)',
            background: 'linear-gradient(135deg, rgba(193,125,26,0.08) 0%, rgba(0,0,0,0.4) 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
          }}>

            {/* Precio */}
            <div style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', background: 'rgba(193,125,26,0.07)', border: '1px solid var(--color-gold-border)', textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', marginBottom: '0.15rem', lineHeight: 1 }}>
                83 USD
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>5 encuentros individuales · 1 h por Zoom</p>
            </div>

            {/* Cotización MEP */}
            <div style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-gold-border)', background: 'rgba(193,125,26,0.05)', textAlign: 'center' }}>
              {mepLoading ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Calculando cotización...</p>
              ) : pesoAmount ? (
                <>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    83 USD al Dólar MEP (cotización en tiempo real)
                  </p>
                  <p style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}>
                    ${pesoAmount.toLocaleString('es-AR')}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Cotización actualizada · Mercado Pago acepta tarjeta de crédito y débito
                  </p>
                </>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Equivalente a 83 USD en pesos</p>
              )}
            </div>

            <div style={{ width: '100%', height: '1px', background: 'var(--color-gold-border)' }} />

            {/* Formulario / botón pagar */}
            {pagoStatus === 'exitoso' ? (
              <div style={{ width: '100%', padding: '1.5rem', borderRadius: '0.75rem', background: 'rgba(193,125,26,0.08)', border: '1px solid var(--color-gold-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Inscripción confirmada!</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Revisá tu email — Cintia te contactará para coordinar la primera sesión.</p>
              </div>
            ) : pagoStatus === 'fallido' ? (
              <div style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gold)', fontWeight: 700, marginBottom: '0.25rem' }}>El pago no se completó</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Podés intentarlo de nuevo.</p>
              </div>
            ) : !showForm ? (
              <button
                onClick={() => { setShowForm(true); trackEvent('vip_buy_clicked') }}
                style={{
                  width: '100%', padding: '1.5rem 2rem',
                  background: 'linear-gradient(135deg, #D4943A, #C17D1A)',
                  color: '#160D28', fontWeight: 700, borderRadius: '0.75rem',
                  fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', letterSpacing: '0.05em',
                  boxShadow: '0 8px 28px rgba(193,125,26,0.55)',
                  cursor: 'pointer', border: 'none', lineHeight: 1.4
                }}
              >
                INSCRIBIRME — 83 USD<br />
                <span style={{ fontSize: '0.78em', fontWeight: 600, opacity: 0.85 }}>Pago seguro con Mercado Pago</span>
              </button>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                  Completá tus datos — te vamos a redirigir al pago seguro con Mercado Pago:
                </p>
                {[
                  { field: 'nombre'   as const, placeholder: 'Nombre',              maxLength: 60 },
                  { field: 'apellido' as const, placeholder: 'Apellido',             maxLength: 60 },
                  { field: 'dni'      as const, placeholder: 'DNI (sin puntos)',     maxLength: 8 },
                  { field: 'email'    as const, placeholder: 'Tu email',             maxLength: 100, type: 'email' },
                  { field: 'whatsapp' as const, placeholder: 'Tu WhatsApp (+54...)', maxLength: 30 },
                ].map(({ field, placeholder, type, maxLength }) => (
                  <input
                    key={field} type={type || 'text'} placeholder={placeholder}
                    maxLength={maxLength}
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.875rem 1rem', borderRadius: '0.625rem',
                      border: '1px solid var(--color-gold-border)',
                      background: 'rgba(0,0,0,0.4)', color: 'var(--color-text)',
                      fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                ))}
                {formError && <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>{formError}</p>}
                <button
                  type="submit" disabled={sending}
                  style={{
                    width: '100%', padding: '1.25rem',
                    background: sending ? 'rgba(193,125,26,0.5)' : 'linear-gradient(135deg, #D4943A, #C17D1A)',
                    color: '#160D28', fontWeight: 700, borderRadius: '0.75rem',
                    fontSize: '1rem', cursor: sending ? 'not-allowed' : 'pointer', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  {sending ? 'Redirigiendo...' : (
                    <>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="#160D28" strokeWidth="1.5"/>
                        <path d="M8 12h8M14 9l3 3-3 3" stroke="#160D28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pagar con Mercado Pago
                    </>
                  )}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  Pago seguro · Tarjeta de crédito o débito · Confirmación automática
                </p>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}
          >
            Preguntas frecuentes
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { q: '¿Necesito experiencia en desarrollo personal para empezar?', a: 'No. Los programas están diseñados para personas que están comenzando su proceso y también para las que ya avanzaron y quieren ir más profundo. Partimos siempre desde donde estás.' },
              { q: '¿Qué pasa en la Sesión de Claridad?', a: 'Es un espacio gratuito de 20 minutos por Zoom donde podés contarme qué estás viviendo, qué te está frenando y encontrar mayor claridad sobre tu próximo paso. Sin compromiso de compra.' },
              { q: '¿Cuánto tiempo lleva el Método Conecta con tu Ser?', a: '5 encuentros de 1 hora por Zoom, a un ritmo que acordamos juntos. Podemos espaciarlos semana a semana o adaptar el ritmo a tu agenda y proceso.' },
              { q: '¿El Método Vender desde tu Ser es para cualquier tipo de emprendimiento?', a: 'Sí. Está pensado para profesionales, emprendedores y freelancers que ya tienen algo para ofrecer pero sienten miedo, incomodidad o bloqueo al momento de vender o mostrarse.' },
              { q: '¿Puedo pagar en cuotas?', a: 'Sí. Mercado Pago acepta tarjeta de crédito con cuotas según tu banco. El monto en pesos se calcula al Dólar MEP del día del pago.' },
              { q: '¿Qué diferencia tiene tu acompañamiento?', a: 'Mi fortaleza está en la capacidad de escuchar e identificar los miedos, creencias e inseguridades que frenan a una persona. No acompaño desde fórmulas ni respuestas genéricas — acompaño desde la comprensión, la verdad y la experiencia de haber atravesado mi propio proceso.' },
            ].map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{
        width: '100%',
        padding: '2rem clamp(1rem,5vw,3rem)',
        borderTop: '1px solid var(--color-gold-border)',
        background: 'rgba(193,125,26,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-gold)' }}>Cintia Paolucci</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Mentora en Transformación Personal · Cofundadora de Comunidad Imparable</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/cin.paolucci" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              @cin.paolucci
            </a>
            <Link href="/terminos" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Términos</Link>
            <Link href="/privacidad" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacidad</Link>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
          © 2026 Academia Comunidad Imparable | Transformamos personas a través del Desarrollo Personal
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Desarrollado por: <a href="https://crm-ia-hazel.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>IA Núcleo Estratégico</a>
        </p>
      </footer>

    </div>
  )
}
