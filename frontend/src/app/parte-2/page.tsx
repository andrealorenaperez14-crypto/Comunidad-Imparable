'use client'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'

const USD_AMOUNT  = 150
const API_URL     = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}


export default function Parte2() {
  return (
    <Suspense>
      <Parte2Inner />
    </Suspense>
  )
}

function Parte2Inner() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const [showForm, setShowForm]             = useState(false)
  const [form, setForm]                     = useState({ nombre: '', apellido: '', dni: '', email: '', whatsapp: '' })
  const [sending, setSending]               = useState(false)
  const [formError, setFormError]           = useState('')
  const [mepRate, setMepRate]               = useState<number | null>(null)
  const [mepLoading, setMepLoading]         = useState(true)
  const [countdown, setCountdown]           = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const router       = useRouter()
  const searchParams = useSearchParams()
  const pagoStatus   = searchParams.get('pago') // 'exitoso' | 'fallido' | 'pendiente'

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

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/bolsa')
      .then(r => r.json())
      .then(d => setMepRate(d.venta))
      .catch(() => setMepRate(null))
      .finally(() => setMepLoading(false))
  }, [])

  const pesoAmount = mepRate ? Math.round(USD_AMOUNT * mepRate) : null

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
      const res  = await fetch(`${API_URL}/api/payments/vip/create`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form)
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

  const modules = [
    { num: '01', title: 'Neuroventas aplicadas en Consumidor de Salud', topics: ['Introducción al Comportamiento humano', 'Qué compra realmente una persona', 'Cómo funciona la decisión emocional'] },
    { num: '02', title: 'Cerebro Reptiliano del Consumidor de Salud', topics: ['Miedo', 'Supervivencia', 'Seguridad', 'Dolor', 'Urgencia'] },
    { num: '03', title: 'Cerebro Límbico del Consumidor de Salud', topics: ['Emociones', 'Apego', 'Familia', 'Empatía estratégica', 'Escucha activa', 'Tomo nota', 'Cuadro sinóptico'] },
    { num: '04', title: 'Neocórtex del Consumidor de Salud', topics: ['Argumentos', 'Comparativas', 'Lógica', 'Validación mental', 'No vendemos bajo presión al cliente', 'Brindamos un Servicio de Primera necesidad', 'Ayudamos a las personas'] },
    { num: '05', title: 'Botón de Compra - Adultos Mayores', topics: ['Seguridad', 'Transparencia', 'Comunicación con la familia', 'Hijos protectores', 'Objeciones comunes', 'Experiencia', 'Excelencia'] },
    { num: '06', title: 'Botón de Compra - Madres', topics: ['Instinto protector biológico', 'Bajar culpa, brindar el servicio que está a su alcance', 'Seguridad infantil ante todo', 'A veces no se puede, y no se puede', 'Nunca insistimos'] },
    { num: '07', title: 'Botón de Compra - Familias', topics: ['Roles familiares', 'Influenciadores', 'Liderazgo emocional', 'Inclusión'] },
    { num: '08', title: 'Psicología de Objeciones, persuasión', topics: ['"Está caro"', '"Tengo otra cobertura"', '"Después te aviso"', '"Lo consulto con mi..."'] },
    { num: '09', title: 'Cotización Inteligente', topics: ['Cómo presentar valor', 'Cómo evitar competir por precio', 'Cómo guiar mentalmente al cliente', 'Sin diálogo no hay conversación', 'No hacemos monólogos'] },
    { num: '10', title: 'Persuasión aplicada a la Venta Online', topics: ['Palabras de impacto', 'Timing emocional', 'Vos', 'WhatsApp', 'Videollamadas'] },
    { num: '11', title: 'Hipnosis Conversacional y PNL en Consumidor de Salud', topics: ['Cómo respondo', 'Cómo hago el seguimiento', 'Cuando sé que ya no es un cliente potencial', 'Cómo convertir un cliente en mil clientes'] },
    { num: '12', title: 'Agenda y Organización de un Asesor de Elite', topics: ['Cierre emocional como Líder', 'Cierre racional para delegar', 'Uso de Drive efectivo', 'Mis socios se convierten en colaboradores'] },
    { num: '13', title: 'Asesor de Salud - un oficio que deja herencia', topics: ['Autoimagen', 'Energía', 'Liderazgo emocional', 'Gratitud'] },
    { num: '14', title: 'Bonus: Enfermedades preexistentes y Medicamentos', topics: ['Preexistencias modulables', 'Anticonceptivos', 'Programa de Fertilización', 'Interrupción Legal del Embarazo', 'Resolución  310/2004', 'Enfermedades y Preexistencias'] },
    { num: '15', title: 'Certificación Elite Internacional', topics: ['Evaluación final', 'Simulaciones de ventas', 'Casos reales', 'Entrega de la Certificación Internacional en Neuroventas, aplicada al Consumidor de Salud'] }
  ]

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
        <Link href="/login" style={{
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
          Iniciar Sesión
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
        {/* Fondo radial dorado */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center top, rgba(196,151,42,0.13) 0%, transparent 65%)'
        }} />
        {/* Líneas decorativas laterales */}
        <div style={{ position: 'absolute', left: 0, top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(196,151,42,0.3), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(196,151,42,0.3), transparent)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* Logo con glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}
          >
            <Image
              src="/assets/client1/LOGO_NEUROVENTAS.webp"
              alt="Neuroventas"
              width={280}
              height={280}
              priority
              style={{
                objectFit: 'contain',
                width: 'clamp(160px, 38vw, 260px)',
                height: 'auto',
                filter: 'drop-shadow(0 0 18px rgba(196,151,42,0.75)) drop-shadow(0 0 40px rgba(196,151,42,0.45)) drop-shadow(0 0 80px rgba(196,151,42,0.2))',
              }}
            />
          </motion.div>

          {/* Título grande */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2rem, 5.5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '1rem',
              letterSpacing: '0.02em'
            }}
          >
            Asesor Elite<br />
            <span style={{ color: 'var(--color-gold)' }}>Internacional</span>
          </motion.h1>

          {/* Separador dorado */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ height: '2px', width: '80px', background: 'linear-gradient(to right, var(--color-gold), transparent)', margin: '0 auto 1.75rem', borderRadius: '2px' }}
          />

          {/* Badges de propuesta de valor */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem', marginBottom: '2rem' }}
          >
            {[
              { num: '30', label: 'días de formación' },
              { num: '15', label: 'módulos especializados' },
              { num: '2', label: 'mentorías en vivo / sem' },
              { num: '24/7', label: 'IAs de acompañamiento' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                border: '1px solid var(--color-gold-border)',
                background: 'rgba(196,151,42,0.06)',
              }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-gold)' }}>{item.num}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Cuerpo principal */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
              color: 'var(--color-text)',
              lineHeight: 1.85,
              maxWidth: '520px',
              margin: '0 auto 1.5rem',
            }}
          >
            El programa que convierte asesores en{' '}
            <strong style={{ color: 'var(--color-gold)' }}>Profesionales de Alto Valor</strong>{' '}
            en el rubro Salud.
          </motion.p>

          {/* Frase de impacto */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{
              padding: '1.25rem 2rem',
              borderRadius: '0.875rem',
              border: '1px solid var(--color-gold-border)',
              background: 'rgba(196,151,42,0.06)',
              marginBottom: '1.75rem',
              maxWidth: '480px',
              margin: '0 auto 1.75rem'
            }}
          >
            <p style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.4rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', marginBottom: '0.25rem' }}>
              Escalá a +1.000 USD en 30 días
            </p>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', color: 'var(--color-text-muted)' }}>
              o seguís como asesor tradicional.
            </p>
          </motion.div>

          {/* Call to scroll */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}
          >
            Precio de pre-lanzamiento disponible <strong style={{ color: 'var(--color-gold)' }}>hasta el 1 de julio</strong>.<br />
            <span style={{ color: '#f87171', fontWeight: 700 }}>
              Después sube a 270 USD. Reservá tu lugar ahora ↓
            </span>
          </motion.p>

        </div>
      </section>

      {/* ══════════════════ 15 MÓDULOS ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.h2
              {...fadeUp}
              style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700 }}
            >
              15 Módulos Especializados
            </motion.h2>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
              Certificación Internacional en Neuroventas<br />Aplicadas al consumidor de coberturas médicas
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true }}
                onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                style={{
                  padding: '1.125rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-gold-border)',
                  background: expandedModule === i ? 'rgba(196,151,42,0.1)' : 'rgba(20,20,20,0.8)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-gold)', flexShrink: 0 }}>{mod.num}</p>
                  <h3 style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', color: 'var(--color-gold)', lineHeight: 1.35 }}>
                    {mod.title}
                  </h3>
                </div>
                {expandedModule === i && (
                  <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {mod.topics.map((topic, j) => (
                      <li key={j} style={{ display: 'flex', gap: '0.5rem', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)' }}>
                        <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>·</span> {topic}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ IAs ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'rgba(196,151,42,0.03)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '3rem' }}
          >
            Acompañamiento Inteligente
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              {
                icon: <CoachIcon />,
                title: 'IA Coach',
                desc: 'Mentoría personalizada. Responde dudas 24/7. Guía paso a paso. Acelera tu aprendizaje.'
              },
              {
                icon: <MentalidadIcon />,
                title: 'IA Mentalidad',
                desc: 'Trabaja tus Bloqueos y Miedos. La venta es un estado de Ánimo.'
              }
            ].map((ia, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                style={{
                  padding: 'clamp(1.5rem,3vw,2rem)',
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
                  {ia.icon}
                </div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                  {ia.title}
                </h3>
                <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  {ia.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ ASESORES VIP ══════════════════ */}
      <section id="asesores-elite" style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Asesores ELITE
          </motion.h2>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            ¿Listo para llevar tus asesorías al siguiente nivel?<br />
            La versión avanzada de la <strong style={{ color: 'var(--color-gold)' }}>Escuela de Asesores ELITE</strong> en el rubro Salud, llega en julio.
          </motion.p>

          <div style={{
            padding: 'clamp(1.75rem,5vw,2.5rem)',
            borderRadius: '0.875rem',
            border: '2px solid var(--color-gold)',
            background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(0,0,0,0.4) 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
          }}>

            {/* Countdown */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                Precio pre-lanzamiento termina en
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                {[
                  { v: countdown.days,    l: 'días' },
                  { v: countdown.hours,   l: 'hs' },
                  { v: countdown.minutes, l: 'min' },
                  { v: countdown.seconds, l: 'seg' },
                ].map(({ v, l }) => (
                  <div key={l} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    minWidth: 'clamp(3rem,10vw,4rem)',
                    padding: '0.625rem 0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-gold-border)',
                    background: 'rgba(196,151,42,0.06)',
                  }}>
                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.25rem,4vw,1.75rem)', color: 'var(--color-gold)', lineHeight: 1 }}>
                      {String(v).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gancho precio */}
            <div style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', background: 'rgba(196,151,42,0.07)', border: '1px solid var(--color-gold-border)', textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Accedé ahora al precio de pre-lanzamiento. El <strong style={{ color: 'var(--color-gold)' }}>1 de julio sube a 270 USD</strong> y no habrá excepciones.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginBottom: '0.1rem' }}>
                270 USD
              </p>
              <p style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', marginBottom: '0.15rem', lineHeight: 1 }}>
                150 USD
              </p>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EAB308', marginBottom: '0.25rem' }}>
                56% de AHORRO · Por ÚNICA vez
              </p>
              <p style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 600 }}>
                Precio sube el 1 jul · Quedan pocos cupos
              </p>
            </div>

            {/* Separador */}
            <div style={{ width: '100%', height: '1px', background: 'var(--color-separator)' }} />

            {/* Cotización MEP */}
            <div style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-gold-border)', background: 'rgba(196,151,42,0.05)', textAlign: 'center' }}>
              {mepLoading ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Calculando cotización...</p>
              ) : pesoAmount ? (
                <>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    150 USD al Dólar MEP (cotización en tiempo real)
                  </p>
                  <p style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}>
                    ${pesoAmount.toLocaleString('es-AR')}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Cotización actualizada · Mercado Pago acepta tarjeta de crédito y débito
                  </p>
                </>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Equivalente a 150 USD en pesos</p>
              )}
            </div>

            {/* Formulario + botón pagar */}
            {pagoStatus === 'exitoso' ? (
              <div style={{ width: '100%', padding: '1.5rem', borderRadius: '0.75rem', background: 'rgba(196,151,42,0.08)', border: '1px solid var(--color-gold-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Pago confirmado!</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Tu lugar ELITE está confirmado. Revisá tu email — vas a recibir el acceso en los próximos minutos.</p>
              </div>
            ) : pagoStatus === 'fallido' ? (
              <div style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', textAlign: 'center' }}>
                <p style={{ color: '#F87171', fontWeight: 700, marginBottom: '0.25rem' }}>El pago no se completó</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Podés intentarlo de nuevo.</p>
              </div>
            ) : !showForm ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => { setShowForm(true); trackEvent('vip_buy_clicked') }}
                  style={{
                    width: '100%', padding: '1.5rem 2rem',
                    background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                    color: '#000', fontWeight: 700, borderRadius: '0.75rem',
                    fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', letterSpacing: '0.05em',
                    boxShadow: '0 8px 28px rgba(196,151,42,0.55)',
                    cursor: 'pointer', border: 'none', lineHeight: 1.4
                  }}
                >
                  COMPRAR AHORA — 150 USD<br />
                  <span style={{ fontSize: '0.78em', fontWeight: 600, opacity: 0.85 }}>Acceso inmediato · Pago seguro con Mercado Pago</span>
                </button>
                <p style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 600, textAlign: 'center' }}>
                  El precio sube a 270 USD el 1 de julio
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                  Completá tus datos — te vamos a redirigir al pago seguro con Mercado Pago:
                </p>
                {[
                  { field: 'nombre'   as const, placeholder: 'Nombre' },
                  { field: 'apellido' as const, placeholder: 'Apellido' },
                  { field: 'dni'      as const, placeholder: 'DNI (sin puntos)' },
                  { field: 'email'    as const, placeholder: 'Tu email', type: 'email' },
                  { field: 'whatsapp' as const, placeholder: 'Tu WhatsApp (+54...)' },
                ].map(({ field, placeholder, type }) => (
                  <input
                    key={field} type={type || 'text'} placeholder={placeholder}
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
                {formError && <p style={{ color: '#F87171', fontSize: '0.85rem' }}>{formError}</p>}
                <button
                  type="submit" disabled={sending}
                  style={{
                    width: '100%', padding: '1.25rem',
                    background: sending ? 'rgba(196,151,42,0.5)' : 'linear-gradient(135deg, #EAB308, #CA8A04)',
                    color: '#000', fontWeight: 700, borderRadius: '0.75rem',
                    fontSize: '1rem', cursor: sending ? 'not-allowed' : 'pointer', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  {sending ? 'Redirigiendo...' : (
                    <>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="#000" strokeWidth="1.5"/>
                        <path d="M8 12h8M14 9l3 3-3 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

            {/* Botón WhatsApp */}
            <a
              href="https://chat.whatsapp.com/Lvxh9N5rk6m6kz4Ks8lRGL"
              target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent('vip_whatsapp_clicked')}
              style={{
                width: '100%', padding: '0.875rem 2rem',
                background: 'rgba(245,240,232,0.05)', color: '#F5F0E8',
                fontWeight: 700, borderRadius: '0.75rem',
                fontSize: 'clamp(0.85rem, 2vw, 1rem)', letterSpacing: '0.05em',
                border: '1px solid rgba(245,240,232,0.25)',
                cursor: 'pointer', textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem'
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="var(--color-gold)"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.424A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sumarme al Club de Asesores VIP ORO
            </a>

          </div>
        </div>
      </section>

      {/* ══════════════════ YAMI ══════════════════ */}
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

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{
        width: '100%',
        padding: '2rem clamp(1rem,5vw,3rem)',
        borderTop: '1px solid var(--color-gold-border)',
        background: 'rgba(196,151,42,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['Términos', 'Privacidad', 'Contacto'].map((t) => (
            <Link key={t} href="#" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t}</Link>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
          Certificación Internacional en Neuroventas · Yami Mansilla
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Desarrollado por: NUCLEO ESTRATEGICO IA
        </p>
      </footer>

    </div>
  )
}
