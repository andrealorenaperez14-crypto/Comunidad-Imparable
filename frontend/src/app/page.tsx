'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useTransform, animate as fmAnimate } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { ELITE_LINK } from '@/lib/constants'


const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const CoachIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3h12v8a6 6 0 01-12 0V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7H3a1 1 0 000 2l1.5 3A4 4 0 008 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 7h3a1 1 0 010 2l-1.5 3A4 4 0 0116 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17v4M8 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const MentalidadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c4 0 7-3.5 7-7.5 0-3-2-5.5-3.5-7-0.5 2-1 3.5-3 4.5 0-2.5-1-5-3-7C8 9.5 5 11 5 14.5c0 4 3 7.5 7 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22c1.5 0 2.5-1 2.5-2.5S13 17 11.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ConsultivaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9l3-5h14l3 5-10 11L2 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 9l4-5M16 9l-4-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8 9l4 11M16 9l-4 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const lineVariants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, delay: 0.35 + i * 0.2, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [countdown, setCountdown]     = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const router    = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const mouseX    = useMotionValue(0)
  const mouseY    = useMotionValue(0)
  const rotateX   = useTransform(mouseY, [-500, 500], [4, -4])
  const rotateY   = useTransform(mouseX, [-500, 500], [-4, 4])

  function onMouseMove(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }
  function onMouseLeave() {
    fmAnimate(mouseX, 0, { duration: 0.9, ease: 'easeOut' } as any)
    fmAnimate(mouseY, 0, { duration: 0.9, ease: 'easeOut' } as any)
  }

  useEffect(() => {
    const target = new Date('2026-07-01T00:00:00-03:00').getTime()
    function tick() {
      const diff = target - Date.now()
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setCountdown({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ width: '100%', background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'center', overflowX: 'hidden' }}>

      {/* Login shortcut */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
        <Link href="/login" style={{
          display: 'inline-block', background: 'rgba(12,12,12,0.85)',
          border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)',
          padding: '0.45rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.8rem',
          fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)', letterSpacing: '0.04em'
        }}>
          Iniciar Sesión
        </Link>
      </div>

      {/* ══════════════════ HERO CINEMATOGRÁFICO ══════════════════ */}
      <section
        ref={sectionRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ minHeight: '100svh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5rem,10vw,8rem) clamp(1rem,5vw,3rem)', position: 'relative', perspective: '1200px' }}
      >
        {/* Glow de fondo */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196,151,42,0.13) 0%, transparent 70%)' }} />
        {/* Líneas decorativas laterales */}
        <div style={{ position: 'absolute', left: 'clamp(1rem,4vw,3rem)', top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(196,151,42,0.25), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 'clamp(1rem,4vw,3rem)', top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(196,151,42,0.25), transparent)', pointerEvents: 'none' }} />

        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', width: '100%', maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          {/* Logo pequeño y elegante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}
          >
            <Image
              src="/assets/client1/LOGO_cuad_y_nombre_ESCUELA_DE_ASESORES.webp"
              alt="Escuela de Asesores"
              width={240} height={240} priority
              style={{ objectFit: 'contain', width: 'clamp(160px, 32vw, 260px)', height: 'auto', opacity: 0.92 }}
            />
          </motion.div>

          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.18em' }}
            transition={{ duration: 1, delay: 0.1 }}
            style={{ fontSize: 'clamp(0.6rem, 1.3vw, 0.72rem)', textTransform: 'uppercase', color: 'rgba(196,151,42,0.7)', marginBottom: '1.5rem', letterSpacing: '0.18em' }}
          >
            ✦ &nbsp; Rubro Salud · Método Exclusivo · Yami Mansilla &nbsp; ✦
          </motion.p>

          {/* HEADLINE — 3 líneas con stagger cinematográfico */}
          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '0.02em' }}>
            {[
              { text: 'Tu primer cliente', size: 'clamp(2.2rem, 7vw, 5rem)', color: 'var(--color-text)' },
              { text: 'de cobertura médica', size: 'clamp(1.8rem, 5.5vw, 3.8rem)', color: 'var(--color-text-muted)' },
              { text: 'en 3 días.', size: 'clamp(2.6rem, 8vw, 5.8rem)', color: 'var(--color-gold)' },
            ].map((line, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'block', fontSize: line.size, color: line.color }}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          {/* BADGE — GRATIS con shimmer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 1.75rem',
              borderRadius: '9999px',
              border: '1px solid rgba(196,151,42,0.45)',
              background: 'rgba(196,151,42,0.07)',
              backdropFilter: 'blur(8px)',
            }}>
              <span className="hero-shimmer-badge" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                ✦ &nbsp; COMPLETAMENTE GRATIS &nbsp;·&nbsp; SIN TARJETA &nbsp;·&nbsp; EMPEZÁS HOY &nbsp; ✦
              </span>
            </div>
          </motion.div>

          {/* ── ¿Esto es para mí? ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            style={{ marginBottom: '1.75rem' }}
          >
            {/* Pregunta gancho */}
            <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              ¿Trabajás con personas?
            </p>
            <p style={{ fontSize: 'clamp(0.82rem, 1.7vw, 0.95rem)', color: 'var(--color-gold)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
              Tenés una fuente de ingresos que todavía no estás usando.
            </p>

            {/* Ticker de profesiones */}
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '1rem', maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
              <div className="profession-ticker">
                {[
                  { t: 'Médicos',         tipo: 'pill' },
                  { t: 'Contadores',      tipo: 'pill' },
                  { t: 'Odontólogos',     tipo: 'pill' },
                  { t: '¿Trabajás con personas?', tipo: 'gold' },
                  { t: 'Abogados',        tipo: 'pill' },
                  { t: 'Nutricionistas',  tipo: 'pill' },
                  { t: 'Coaches',         tipo: 'pill' },
                  { t: 'Tu profesión aplica →', tipo: 'gold' },
                  { t: 'Terapeutas',      tipo: 'pill' },
                  { t: 'Psicólogos',      tipo: 'pill' },
                  { t: 'Docentes',        tipo: 'pill' },
                  { t: 'Cualquier profesional', tipo: 'gold' },
                  { t: 'Arquitectos',     tipo: 'pill' },
                  { t: 'Kinesiólogos',    tipo: 'pill' },
                  { t: 'Emprendedores',   tipo: 'pill' },
                  { t: '¿Tenés contactos? Ya tenés clientes →', tipo: 'gold' },
                  // duplicado para loop continuo
                  { t: 'Médicos',         tipo: 'pill' },
                  { t: 'Contadores',      tipo: 'pill' },
                  { t: 'Odontólogos',     tipo: 'pill' },
                  { t: '¿Trabajás con personas?', tipo: 'gold' },
                  { t: 'Abogados',        tipo: 'pill' },
                  { t: 'Nutricionistas',  tipo: 'pill' },
                  { t: 'Coaches',         tipo: 'pill' },
                  { t: 'Tu profesión aplica →', tipo: 'gold' },
                  { t: 'Terapeutas',      tipo: 'pill' },
                  { t: 'Psicólogos',      tipo: 'pill' },
                  { t: 'Docentes',        tipo: 'pill' },
                  { t: 'Cualquier profesional', tipo: 'gold' },
                  { t: 'Arquitectos',     tipo: 'pill' },
                  { t: 'Kinesiólogos',    tipo: 'pill' },
                  { t: 'Emprendedores',   tipo: 'pill' },
                  { t: '¿Tenés contactos? Ya tenés clientes →', tipo: 'gold' },
                ].map((item, idx) => (
                  <span key={idx} style={item.tipo === 'gold' ? {
                    fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
                    fontWeight: 700,
                    color: 'var(--color-gold)',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    padding: '0 0.25rem'
                  } : {
                    fontSize: 'clamp(0.68rem, 1.3vw, 0.78rem)',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(196,151,42,0.28)',
                    color: 'var(--color-text-muted)',
                    background: 'rgba(196,151,42,0.05)',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.t}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 'clamp(0.78rem, 1.5vw, 0.88rem)', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
              No necesitás experiencia en ventas. Solo saber escuchar.<br />
              <span style={{ color: 'var(--color-text)' }}>El reto te muestra cómo convertir tu red de contactos en ingresos en dólares.</span>
            </p>
          </motion.div>

          {/* Supporting copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.15 }}
            style={{ marginBottom: '0.75rem' }}
          >
            <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              Neuroventas · PNL · 3 IAs disponibles <strong style={{ color: 'var(--color-text)' }}>24/7</strong> · Método de <strong style={{ color: 'var(--color-gold)' }}>Yami Mansilla</strong>
            </p>
          </motion.div>

          {/* Prueba social micro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.25 }}
            style={{ fontSize: 'clamp(0.72rem, 1.4vw, 0.82rem)', color: 'rgba(196,151,42,0.55)', marginBottom: '2.5rem', letterSpacing: '0.06em' }}
          >
            +1.000 asesores formados · 13 años de método · Acceso en 2 minutos
          </motion.p>

          {/* CTA principal — glow pulsante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
          >
            <button
              onClick={() => { trackEvent('cta_clicked', { cta_type: 'junior' }); router.push('/register') }}
              className="hero-cta-glow"
              style={{
                padding: 'clamp(1rem,3vw,1.3rem) clamp(2.5rem,6vw,4.5rem)',
                background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                color: '#000',
                fontWeight: 800,
                borderRadius: '0.875rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                letterSpacing: '0.07em',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '440px',
                border: 'none',
                textTransform: 'uppercase'
              }}
            >
              Quiero mis 3 días gratis →
            </button>
            <p style={{ fontSize: '0.72rem', color: 'rgba(196,151,42,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Sin compromiso · Acceso inmediato a las 3 IAs
            </p>
          </motion.div>

          {/* Divisor — camino alternativo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '440px', margin: '2rem auto 1.75rem' }}
          >
            <div style={{ flex: 1, height: '1px', background: 'rgba(196,151,42,0.18)' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(196,151,42,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              ¿Ya estás convencido?
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(196,151,42,0.18)' }} />
          </motion.div>

          {/* CTA secundario — Asesor Elite */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
          >
            <button
              onClick={() => { trackEvent('cta_clicked', { cta_type: 'elite_skip' }); router.push(ELITE_LINK) }}
              style={{
                background: 'linear-gradient(135deg, rgba(196,151,42,0.12), rgba(196,151,42,0.06))',
                border: '1px solid rgba(196,151,42,0.5)',
                borderRadius: '0.75rem',
                color: 'var(--color-gold)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                fontWeight: 700,
                padding: '0.9rem 2rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                width: '100%',
                maxWidth: '440px',
                textTransform: 'uppercase'
              }}
            >
              Quiero ser Asesor Elite →
            </button>
            <p style={{ fontSize: '0.7rem', color: 'rgba(196,151,42,0.4)', letterSpacing: '0.06em' }}>
              Acceso completo · 150 USD · Certificación Internacional
            </p>
          </motion.div>

        </motion.div>
      </section>

      {/* ══════════════════ MANIFIESTO ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(5rem,10vw,8rem) clamp(1rem,5vw,3rem)',
        background: 'linear-gradient(180deg, rgba(196,151,42,0.04) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(196,151,42,0.15)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              fontWeight: 700,
              lineHeight: 1.45,
              marginBottom: '1.5rem',
              color: 'var(--color-text)'
            }}>
              Hay personas que llevan meses esperando el momento ideal.<br />
              <span style={{ color: 'var(--color-gold)' }}>Otras ya cerraron su primera venta.</span>
            </p>

            <p style={{
              fontSize: 'clamp(0.88rem, 2vw, 1.1rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.85,
              marginBottom: '1.5rem'
            }}>
              La diferencia no es el talento. No es la experiencia.<br />
              <strong style={{ color: 'var(--color-text)' }}>Es tener un método.</strong>
            </p>

            <div style={{
              width: '3rem',
              height: '2px',
              background: 'var(--color-gold)',
              margin: '0 auto 2rem'
            }} />

            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.85,
              marginBottom: '1.25rem'
            }}>
              La cobertura médica no es un lujo — es algo que{' '}
              <strong style={{ color: 'var(--color-text)' }}>todas las familias necesitan</strong> y muy pocas saben cómo elegir.
              Ahí está tu oportunidad.
            </p>

            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.85
            }}>
              El método de Yami no enseña a vender. Enseña a{' '}
              <strong style={{ color: 'var(--color-gold)' }}>orientar a cada persona hacia la mejor opción para su vida</strong>.
              Cuando ayudás de verdad, no necesitás convencer a nadie — el cliente recomienda solo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ 3 IAs ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'linear-gradient(135deg, rgba(196,151,42,0.05) 0%, transparent 100%)',
        borderTop: '1px solid rgba(196,151,42,0.2)',
        borderBottom: '1px solid rgba(196,151,42,0.2)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              Nunca estás solo
            </h2>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              Los 3 agentes IA transformarán tu forma de trabajar y vender
            </p>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-text-muted)' }}>
              Entrenados con el MÉTODO exclusivo para el Rubro Salud de Yami Mansilla
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { icon: <CoachIcon />, name: 'IA Coach', desc: 'Mentoría personalizada 24/7 en cada paso' },
              { icon: <MentalidadIcon />, name: 'IA Mentalidad', desc: 'La Venta es un Estado de Ánimo.\nYami ya pasó por eso, te ayuda a desbloquearlo' },
              { icon: <ConsultivaIcon />, name: 'IA Consultiva', desc: '+de 10.000 casos reales. Estrategias probadas' }
            ].map((a) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                style={{
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-gold-border)',
                  background: 'rgba(20,20,20,0.8)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '2.75rem', height: '2.75rem',
                  margin: '0 auto 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0.625rem',
                  background: 'rgba(196,151,42,0.15)',
                  color: 'var(--color-gold)'
                }}>
                  {a.icon}
                </div>
                <h3 style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  marginBottom: '0.5rem'
                }}>
                  {a.name}
                </h3>
                <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {a.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.h2
            {...fadeUp}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '3rem',
              textAlign: 'center'
            }}
          >
            De 0 a +10.000 Clientes. Rompiendo todos los Esquemas.
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { num: '+10,000', text: 'Clientes' },
              { num: '13', text: 'Años de experiencia' },
              { num: '+1.000', text: 'Asesores Formados' },
              { num: '+40.000', text: 'Dólares promedio por año' }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  padding: 'clamp(1rem,3vw,1.5rem)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-gold-border)',
                  background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, transparent 100%)',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--color-gold)' }}>
                  {s.num}
                </p>
                <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ YAMI STORY ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.h2
            {...fadeUp}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '3rem',
              textAlign: 'center'
            }}
          >
            Esto no es teoría.<br />
            <span style={{ color: 'var(--color-gold)' }}>Es mi vida</span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Image
                src="/assets/client1/yami-gemini.webp"
                alt="Yami Mansilla"
                width={400}
                height={500}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  height: 'auto',
                  borderRadius: '0.75rem',
                  boxShadow: '0 20px 48px rgba(196,151,42,0.2)'
                }}
              />
            </motion.div>

            {/* Texto */}
            <motion.div {...fadeUp} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', lineHeight: 1.85, marginBottom: '1rem' }}>
                A los 16 años, Yami salió a la calle con un folleto en la mano y cero experiencia.
                Sin guión, sin red de contactos, sin nada. Su primer contacto fue una persona que realmente
                necesitaba cobertura médica y no sabía cómo elegir.
              </p>
              <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', lineHeight: 1.85, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                Ahí entendió algo que cambió todo:{' '}
                <strong style={{ color: 'var(--color-text)' }}>no estaba vendiendo un producto. Estaba ayudando a alguien a cuidar su salud.</strong>{' '}
                Y cuando lo enfocó así, todo fluyó.
              </p>
              <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', lineHeight: 1.85, marginBottom: '1.25rem', color: 'var(--color-text-muted)' }}>
                Hoy, 13 años después, lidera{' '}
                <strong style={{ color: 'var(--color-gold)' }}>Medicina Prepaga Salud MPS</strong>,
                con más de 10.000 clientes que llegaron recomendados — porque Yami nunca cerró una venta,
                orientó a cada persona hacia la mejor opción para su vida.
              </p>
              <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
                Ese es el método que ahora enseña. Y en 3 días te lo muestra en acción.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {[
                  { v: 'HONESTIDAD', e: 'Digo NO, cuando NO se puede.' },
                  { v: 'MOVIMIENTO', e: '5 llamadas, 5 prospectos, 1 venta.' },
                  { v: 'SERVICIO', e: 'Siempre en excelencia, implica que 1 Cliente, genera mil Clientes.' }
                ].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      borderLeft: '4px solid var(--color-gold)',
                      background: 'rgba(196,151,42,0.05)',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                      {v.v}
                    </p>
                    <p style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>{v.e}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ 3 MÓDULOS ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'rgba(196,151,42,0.03)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700 }}>
              Tu primer cierre en 3 días
            </h2>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontStyle: 'italic', color: 'var(--color-gold)', marginTop: '0.75rem' }}>
              Solo se aprende haciendo
            </p>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontStyle: 'italic', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              Todo va a ser NO, buscamos el SÍ
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { d: '1', t: 'PROSPECCIÓN', label: 'Día 1', desc: 'Método "El Fichero": el orden exacto de preguntas para descubrir la mejor opción para tu cliente.' },
              { d: '2', t: 'DESCUBRIMIENTO', label: 'Día 2', desc: 'Te muestro el chat de un caso real y te explico el paso a paso de cómo se cierra.' },
              { d: '3', t: 'CIERRE', label: 'Día 3', desc: 'Te enseño a sacarle el máximo provecho a las IAs y cómo te acompañan en cada venta.' }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  padding: 'clamp(1.5rem,3vw,2rem)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-gold-border)',
                  background: i === 1
                    ? 'linear-gradient(135deg, rgba(196,151,42,0.12) 0%, transparent 100%)'
                    : 'rgba(20,20,20,0.6)',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>{s.label}</p>
                <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>{s.d}</p>
                <h4 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                  {s.t}
                </h4>
                <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(196,151,42,0.04) 100%)',
        borderTop: '1px solid rgba(196,151,42,0.2)'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
              ¿Listo para ir a fondo?
            </h2>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
              Los 3 días gratis te muestran el camino. El programa Elite te lleva hasta el final.
            </p>

            <div style={{
              padding: 'clamp(2rem,5vw,2.5rem)',
              borderRadius: '0.875rem',
              border: '2px solid var(--color-gold)',
              background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(0,0,0,0.4) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                ASESOR ELITE<br />en el RUBRO SALUD
              </h3>
              <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '2rem' }}>
                30 días de formación
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <Image
                  src="/assets/client1/LOGO_NEUROVENTAS.webp"
                  alt="Certificado Neuroventas"
                  width={100}
                  height={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Certificación Internacional en Neuroventas + 15 módulos + Club de asesores VIP ORO
              </p>

              <div style={{ width: '100%', borderTop: '1px solid var(--color-gold-border)', borderBottom: '1px solid var(--color-gold-border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginBottom: '0.1rem' }}>
                  270 USD
                </p>
                <p style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', lineHeight: 1 }}>
                  150 USD
                </p>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EAB308', marginTop: '0.25rem' }}>56% de AHORRO · Por ÚNICA vez</p>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginTop: '1rem', marginBottom: '0.5rem' }}>
                  Precio pre-lanzamiento termina en
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {[
                    { v: countdown.days,    l: 'días' },
                    { v: countdown.hours,   l: 'hs' },
                    { v: countdown.minutes, l: 'min' },
                    { v: countdown.seconds, l: 'seg' },
                  ].map(({ v, l }) => (
                    <div key={l} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      minWidth: 'clamp(2.75rem,8vw,3.5rem)',
                      padding: '0.5rem 0.4rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--color-gold-border)',
                      background: 'rgba(196,151,42,0.06)',
                    }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1rem,3vw,1.4rem)', color: 'var(--color-gold)', lineHeight: 1 }}>
                        {String(v).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 600, marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>+ 20 USD / mes<br />(membresía opcional)</p>
              </div>

              <button
                onClick={() => { trackEvent('final_cta_clicked'); router.push(ELITE_LINK) }}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                  color: '#000',
                  fontWeight: 700,
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  letterSpacing: '0.07em',
                  boxShadow: '0 8px 28px rgba(196,151,42,0.45)',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                RESERVAR MI LUGAR ELITE
              </button>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Ganá +1.000 USD en 30 días · Certificación Internacional</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.h2
            {...fadeUp}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            Preguntas frecuentes
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { q: '¿En 3 días puedo cerrar una venta de cobertura médica?', a: 'SÍ. El objetivo es que en 3 días hayas tenido al menos una conversación real con un prospecto. Eso ya te pone adelante del 95% de los que están "pensando en arrancar".' },
              { q: '¿Necesito experiencia previa?', a: 'No, sólo ganas de salir de tu zona de confort, fe y visión.' },
              { q: '¿Cuánto puedo ganar?', a: 'Entre 50 y 500 USD por cliente. Tu objetivo es aprender.' },
              { q: '¿Puedo hacerlo mientras trabajo?', a: 'Sí, como VENDEDOR TRADICIONAL: puede ser tu complemento.\nComo ASESOR ELITE: necesitas más dedicación y haces la diferencia.' }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ border: '1px solid var(--color-gold-border)', borderRadius: '0.75rem', overflow: 'hidden' }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                    background: expandedFaq === i ? 'rgba(196,151,42,0.1)' : 'transparent',
                    cursor: 'pointer',
                    color: 'var(--color-text)'
                  }}
                >
                  <span>{f.q}</span>
                  <span style={{ color: 'var(--color-gold)', fontSize: '1.25rem', flexShrink: 0, marginLeft: '1rem' }}>
                    {expandedFaq === i ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === i && (
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid var(--color-gold-border)',
                    background: 'rgba(196,151,42,0.05)',
                    color: 'var(--color-text-muted)',
                    fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                    lineHeight: 1.7,
                    textAlign: 'left',
                    whiteSpace: 'pre-line'
                  }}>
                    {f.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CIERRE ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'rgba(196,151,42,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <motion.div {...fadeUp}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <Image
                src="/assets/client1/YAMI_MANSILLA.jpeg"
                alt="Yami Mansilla"
                width={340}
                height={340}
                style={{ objectFit: 'contain', borderRadius: '0.75rem', filter: 'drop-shadow(0 12px 28px rgba(196,151,42,0.3))', width: 'clamp(260px, 55vw, 420px)', height: 'auto' }}
              />
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '0.4rem' }}>
              Capacitación de Alto Impacto
            </p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.85rem, 2vw, 1rem)', fontWeight: 700, color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '1rem' }}>
              Experiencia que Rompe Todos los Esquemas
            </p>
            <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
              Yami Mansilla
            </p>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              CEO & Fundadora | Escuela de Asesores en el Rubro Salud
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ EL MOMENTO ES HOY ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(5rem,10vw,8rem) clamp(1rem,5vw,3rem)',
        background: 'linear-gradient(135deg, rgba(196,151,42,0.12) 0%, rgba(0,0,0,0.6) 100%)',
        borderTop: '1px solid rgba(196,151,42,0.3)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{
              fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-gold)',
              marginBottom: '1rem'
            }}>
              El momento es HOY
            </p>
            <h2 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '1.25rem'
            }}>
              Cada día que esperas,<br />
              <span style={{ color: 'var(--color-gold)' }}>otro cierra su venta.</span>
            </h2>
            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              marginBottom: '2.5rem'
            }}>
              Empieza gratis hoy mismo o entra directo al programa Elite.<br />
              El primer paso siempre es el más importante.
            </p>
            <button
              onClick={() => { trackEvent('final_cta_clicked'); router.push('/register') }}
              style={{
                padding: 'clamp(1rem,3vw,1.25rem) clamp(2rem,5vw,3rem)',
                background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                color: '#000',
                fontWeight: 700,
                borderRadius: '0.75rem',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                letterSpacing: '0.07em',
                boxShadow: '0 12px 40px rgba(196,151,42,0.5)',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '420px',
                transition: 'opacity 0.2s'
              }}
            >
              Quiero mis 3 días gratis →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{
        width: '100%',
        padding: '2rem clamp(1rem,5vw,3rem)',
        borderTop: '1px solid var(--color-gold-border)',
        background: 'rgba(196,151,42,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/terminos" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Términos</Link>
            <Link href="/privacidad" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Privacidad</Link>
          </div>
          <a href="https://www.instagram.com/escueladeasesoresmps?igsh=MWw3a3I1dHp6ZG9wOQ==" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            Contacto
          </a>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
          © 2026 Escuela de Asesores en el Rubro Salud | Formamos Líderes, No Vendedores
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Desarrollado por: NUCLEO ESTRATEGICO IA
        </p>
      </footer>

    </div>
  )
}
