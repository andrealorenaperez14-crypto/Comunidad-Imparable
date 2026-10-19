'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'

const WA_BASE     = 'https://wa.me/5492915768045'
const WA_SESION   = `${WA_BASE}?text=${encodeURIComponent('Hola Alejandra, llegué desde tu web (Sesión de Exploración) y me gustaría agendar una sesión gratuita.')}`
const WA_REIKI    = `${WA_BASE}?text=${encodeURIComponent('Hola Alejandra, llegué desde tu web (Acompañamiento con Reiki) y tengo una consulta.')}`
const WA_ESPIRIT  = `${WA_BASE}?text=${encodeURIComponent('Hola Alejandra, llegué desde tu web (Acompañamiento Espiritual Integral) y quiero saber más.')}`
const WA_GENERAL  = `${WA_BASE}?text=${encodeURIComponent('Hola Alejandra, llegué desde tu web y me gustaría conectarme con vos.')}`

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

export default function Parte3() {
  return (
    <Suspense>
      <Parte3Inner />
    </Suspense>
  )
}

const HERRAMIENTAS = [
  { num: 'I',   title: 'Reiki',            desc: 'Canalización de energía vital para restablecer el equilibrio físico, emocional y espiritual. Alejandra es Maestra de Reiki certificada.' },
  { num: 'II',  title: 'Metafísica',       desc: '16 años de práctica y 12 como facilitadora en las enseñanzas de Metafísica: leyes universales, pensamiento creativo y consciencia.' },
  { num: 'III', title: 'Biodescodificación', desc: 'Comprensión de los mensajes que el cuerpo envía a través de síntomas o patrones, conectando el origen emocional con el proceso de sanación.' },
  { num: 'IV',  title: 'Gemoterapia',      desc: 'Uso terapéutico de cristales y piedras para armonizar la energía, elevar la vibración y apoyar procesos de transformación interior.' },
  { num: 'V',   title: 'Psicomagia',       desc: 'Actos simbólicos que interpelan al inconsciente y generan movimiento real en situaciones donde el pensamiento racional se estanca.' },
]

function HerramientasCarousel() {
  const [active, setActive] = useState(0)
  const total = HERRAMIENTAS.length

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % total), 3400)
    return () => clearInterval(id)
  }, [total])

  const getPos = (i: number) => {
    const diff = ((i - active + total) % total)
    if (diff === 0) return { scale: 1, x: '0%', z: 10, opacity: 1 }
    if (diff === 1 || diff === total - 1) {
      const side = diff === 1 ? 1 : -1
      return { scale: 0.82, x: `${side * 110}%`, z: 6, opacity: 0.55 }
    }
    return { scale: 0.65, x: diff < total / 2 ? '200%' : '-200%', z: 1, opacity: 0.12 }
  }

  return (
    <section style={{ width: '100%', padding: 'clamp(3rem,6vw,5rem) 0 0', overflow: 'hidden' }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <p style={{ textAlign: 'center', fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1.75rem' }}>
          Herramientas de acompañamiento
        </p>

        <div style={{ position: 'relative', height: 'clamp(170px, 30vw, 230px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {HERRAMIENTAS.map((h, i) => {
            const pos = getPos(i)
            return (
              <motion.div
                key={h.num}
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
                  userSelect: 'none', textAlign: 'center'
                }}
              >
                <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{h.num}</p>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: i === active ? 'var(--color-text)' : 'var(--color-text-muted)', marginBottom: '0.625rem' }}>{h.title}</h3>
                <p style={{ fontSize: 'clamp(0.72rem, 1.4vw, 0.82rem)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{h.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginTop: '1.5rem' }}>
          {HERRAMIENTAS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? '1.5rem' : '0.375rem', height: '0.375rem', borderRadius: '9999px', background: i === active ? 'var(--color-gold)' : 'rgba(193,125,26,0.25)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function Parte3Inner() {
  const searchParams = useSearchParams()
  // reservado para futuros pagos
  void searchParams

  return (
    <div style={{ width: '100%', background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'center', overflowX: 'hidden' }}>

      {/* Nav */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '0.5rem' }}>
        {[{ href: '/', label: '← Inicio' }, { href: '/login', label: 'Plataforma' }].map(({ href, label }) => (
          <Link key={href} href={href} style={{ display: 'inline-block', background: 'rgba(22,13,40,0.85)', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)', padding: '0.45rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)', letterSpacing: '0.04em' }}>
            {label}
          </Link>
        ))}
      </div>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5rem,8vw,6rem) clamp(1rem,5vw,3rem) clamp(2rem,4vw,3rem)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center top, rgba(193,125,26,0.11) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', left: 0, top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(193,125,26,0.3), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: '20%', width: '1px', height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(193,125,26,0.3), transparent)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>
            Maestra de Reiki · Facilitadora de Desarrollo Espiritual
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            Alejandra
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '0.04em', color: 'var(--color-gold)' }}>
            Cuello
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ height: '2px', width: '80px', background: 'linear-gradient(to right, var(--color-gold), transparent)', margin: '0 auto 1.75rem', borderRadius: '2px' }} />

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', color: 'var(--color-text)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto 1.75rem' }}>
            <strong style={{ color: 'var(--color-gold)' }}>Sanar desde adentro transforma tu vida.</strong>{' '}
            Te acompaño en tu camino espiritual para que reconectes con tu esencia y des pasos concretos hacia la vida que elegís.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
            {['Reiki · 16 años de práctica', 'Metafísica', 'Expansión de consciencia', 'De adentro hacia afuera'].map((item, i) => (
              <div key={i} style={{ padding: '0.45rem 1rem', borderRadius: '2rem', border: '1px solid var(--color-gold-border)', background: 'rgba(193,125,26,0.06)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item}</div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.65 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <a href={WA_SESION} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('hero_sesion_clicked')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.25rem', background: 'linear-gradient(135deg, #D4943A, #C17D1A)', color: '#160D28', fontWeight: 700, borderRadius: '0.75rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)', boxShadow: '0 8px 24px rgba(193,125,26,0.4)', textDecoration: 'none' }}>
              <WaIcon color="#160D28" />
              Sesión de Exploración gratuita
            </a>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>20 min · Zoom · Sin compromiso</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CARRUSEL HERRAMIENTAS ══════════════════ */}
      <HerramientasCarousel />

      {/* ══════════════════ SOBRE ALEJANDRA ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'left' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1rem', textAlign: 'center' }}>
            Mi recorrido
          </motion.p>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            Un camino de 16 años junto a otros
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              'Mi camino está profundamente conectado con el desarrollo espiritual, el autoconocimiento y la transformación interior. Cuento con 16 años de práctica en las enseñanzas de Metafísica, de los cuales 12 me desempeñé como facilitadora, acompañando a otras personas en su camino espiritual.',
              'Soy Maestra de Reiki y, a lo largo de mi recorrido, también me formé en Gemoterapia, Biodescodificación, Sincronario Maya y en el abordaje de las heridas de la infancia desde mi formación y experiencia personal.',
              'Actualmente participo en un grupo de servicio donde acompaño con Reiki a personas que atraviesan situaciones oncológicas y a sus familiares, brindando un espacio de presencia y bienestar espiritual complementario.',
              'Mi manera de acompañar comienza con la escucha. Creo que cada persona tiene una historia, necesidades y tiempos diferentes. Por eso, no aplico las mismas herramientas a todos — busco comprender qué está viviendo cada persona y cómo puedo acompañarla desde mi experiencia.',
            ].map((p, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: 'var(--color-text-muted)', lineHeight: 1.85 }}>
                {p}
              </motion.p>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '2.5rem', padding: '1.5rem 2rem', borderRadius: '0.875rem', border: '1px solid var(--color-gold-border)', background: 'rgba(193,125,26,0.06)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--color-gold)', fontStyle: 'italic', lineHeight: 1.5 }}>
              &ldquo;La transformación comienza cuando nos damos permiso para mirar hacia adentro.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ OFERTA IRRESISTIBLE ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)', background: 'linear-gradient(180deg, rgba(22,13,40,0) 0%, rgba(193,125,26,0.05) 50%, rgba(22,13,40,0) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(300px,60vw,700px)', height: 'clamp(300px,60vw,700px)', background: 'radial-gradient(circle, rgba(193,125,26,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: '1rem' }}>
            La transformación que te espera
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.4rem, 3.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '1.25rem' }}>
            ¿Qué cambia cuando trabajás<br /><span style={{ color: 'var(--color-gold)' }}>con Alejandra?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'var(--color-text-muted)', lineHeight: 1.85, maxWidth: '600px', margin: '0 auto 3rem' }}>
            Hay patrones que se repiten, vínculos que duelen, bloqueos que no ceden sin importar cuánto lo intentás desde la razón.
            El trabajo de Alejandra apunta al origen — ese espacio interior donde todo empieza a moverse cuando se le da permiso.
          </motion.p>

          {/* Antes / Después */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ padding: 'clamp(1.5rem,3vw,2rem)', borderRadius: '0.875rem', border: '1px solid rgba(250,248,245,0.1)', background: 'rgba(22,13,40,0.7)', textAlign: 'left' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(250,248,245,0.35)', marginBottom: '1.25rem' }}>Antes del proceso</p>
              {[
                'Sentís que hay algo que querés sanar pero no sabés por dónde empezar',
                'Los mismos patrones y situaciones se repiten aunque ponés intención en cambiarlos',
                'Hay emociones que se acumulan sin encontrar un espacio seguro donde procesarlas',
                'Sentís desconexión con vos misma, con tu cuerpo o con tu camino',
                'Buscás claridad y propósito pero la mente sola no alcanza',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'rgba(250,248,245,0.25)', flexShrink: 0, fontSize: '0.9rem' }}>✗</span>
                  <span style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'rgba(250,248,245,0.45)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ padding: 'clamp(1.5rem,3vw,2rem)', borderRadius: '0.875rem', border: '1px solid var(--color-gold)', background: 'linear-gradient(135deg, rgba(193,125,26,0.1) 0%, rgba(22,13,40,0.85) 100%)', textAlign: 'left', boxShadow: '0 8px 32px rgba(193,125,26,0.15)' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>Después del proceso con Alejandra</p>
              {[
                'Encontrás un espacio de escucha real donde podés mirar hacia adentro sin juzgarte',
                'Empezás a identificar el origen energético y emocional de tus patrones repetitivos',
                'Sentís mayor equilibrio, calma y conexión con tu ser interior',
                'Reconectás con tu propósito y encontrás dirección desde un lugar más profundo',
                'Tomás decisiones más alineadas con quien verdaderamente sos',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0, fontSize: '0.9rem' }}>✓</span>
                  <span style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--color-text)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: 'clamp(1.75rem,4vw,2.5rem) clamp(1.5rem,4vw,3rem)', borderRadius: '0.875rem', border: '1px solid var(--color-gold-border)', background: 'rgba(193,125,26,0.04)', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
              &ldquo;No busco que dependas de mí para avanzar.<br />
              <span style={{ color: 'var(--color-gold)' }}>Busco que aprendas a confiar en tu propio camino interior.&rdquo;</span>
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>— Alejandra Cuello</p>
          </motion.div>

          {/* Para quién */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1rem' }}>
              Este acompañamiento es para vos si…
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem' }}>
              {['Querés sanar desde adentro', 'Sentís que hay algo que liberar', 'Buscás equilibrio energético', 'Atravesás un momento difícil', 'Querés expandir tu consciencia', 'Necesitás reconectar con tu propósito', 'Sentís bloqueos que no ceden', 'Querés iniciar un camino espiritual'].map((tag, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--color-gold-border)', background: 'rgba(193,125,26,0.05)', fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', color: 'var(--color-text-muted)' }}>
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--color-text-muted)' }}>El primer paso es gratis. Sin compromisos. Solo una conversación.</p>
            <a href={WA_SESION} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('transformacion_sesion_clicked')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '1.1rem 2.5rem', background: 'linear-gradient(135deg, #D4943A, #C17D1A)', color: '#160D28', fontWeight: 700, borderRadius: '0.75rem', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', letterSpacing: '0.04em', boxShadow: '0 8px 28px rgba(193,125,26,0.45)', textDecoration: 'none' }}>
              <WaIcon color="#160D28" />
              Quiero mi Sesión de Exploración gratuita
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ ACOMPAÑAMIENTOS ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)', background: 'rgba(193,125,26,0.03)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold)', marginBottom: '1rem', textAlign: 'center' }}>
            Espacios de acompañamiento
          </motion.p>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
            Encontrá el espacio que necesitás
          </motion.h2>

          {/* Fila 1: sesión gratis */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -3 }} style={{ marginBottom: '1.25rem', padding: 'clamp(1.25rem,2.5vw,1.5rem) clamp(1.5rem,3vw,2rem)', borderRadius: '0.875rem', border: '1px solid var(--color-gold-border)', background: 'rgba(22,13,40,0.9)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
            <div style={{ flex: '1 1 340px' }}>
              <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.3rem' }}>Entrada · Gratuita</p>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', fontWeight: 700, marginBottom: '0.4rem' }}>Sesión de Exploración</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>20 minutos por Zoom para conocernos, escuchar qué estás atravesando y ver cómo puedo acompañarte.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.625rem', minWidth: '160px' }}>
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gold)', lineHeight: 1 }}>GRATIS</p>
              <a href={WA_SESION} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('sesion_wa_clicked')} style={{ padding: '0.625rem 1.25rem', background: 'rgba(193,125,26,0.1)', color: 'var(--color-gold)', fontWeight: 700, borderRadius: '0.625rem', fontSize: '0.82rem', border: '1px solid var(--color-gold-border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                <WaIcon color="var(--color-gold)" /> Agendar
              </a>
            </div>
          </motion.div>

          {/* Fila 2: servicios con precio */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>

            {[
              { id: 'A', badge: null, label: 'Sesión individual', title: 'Gemoterapia', desc: 'Uso terapéutico de cristales y piedras para armonizar la energía, liberar bloqueos y elevar la vibración.', tags: ['60 min', 'Zoom o presencial'], usd: 20, wa: WA_ESPIRIT, ev: 'gemo_wa_clicked' },
              { id: 'B', badge: 'Más solicitado', label: 'Sesión individual', title: 'Reiki', desc: 'Canalización de energía vital para restablecer el equilibrio físico, emocional y espiritual. Presencial o a distancia.', tags: ['60 min', 'Zoom o presencial'], usd: 20, wa: WA_REIKI, ev: 'reiki_wa_clicked' },
              { id: 'C', badge: null, label: 'Sesión individual', title: 'Biodescodificación', desc: 'Comprensión del mensaje que el cuerpo envía a través de síntomas o patrones, conectando el origen emocional con la sanación.', tags: ['90 min', 'Zoom'], usd: 90, wa: WA_ESPIRIT, ev: 'biodesc_wa_clicked' },
              { id: 'D', badge: 'Mayor impacto', label: 'Pack · 4 sesiones', title: 'Proceso de Transformación', desc: '4 sesiones de 60 minutos para trabajar en profundidad un proceso de sanación, autoconocimiento o cambio concreto.', tags: ['4 × 60 min', 'Zoom'], usd: 80, wa: WA_ESPIRIT, ev: 'proceso_wa_clicked' },
              { id: 'E', badge: null, label: 'Mentoría · 3 a 6 meses', title: 'Acompañamiento 1 a 1', desc: 'Proceso integral sostenido en el tiempo. Herramientas combinadas (Reiki, Metafísica, Biodescodificación, Gemoterapia) según lo que cada etapa requiera.', tags: ['3 a 6 meses', 'Personalizado'], usd: 80, wa: WA_ESPIRIT, ev: 'mentoria_wa_clicked' },
            ].map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }} style={{ padding: 'clamp(1.5rem,3vw,2rem)', borderRadius: '0.875rem', border: s.badge ? '2px solid var(--color-gold)' : '1px solid var(--color-gold-border)', background: s.badge ? 'linear-gradient(135deg, rgba(193,125,26,0.08) 0%, rgba(22,13,40,0.95) 100%)' : 'rgba(22,13,40,0.9)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                {s.badge && <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-gold)', color: '#160D28', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.18rem 0.875rem', borderRadius: '0 0 0.5rem 0.5rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.badge}</div>}
                <div style={{ marginTop: s.badge ? '0.4rem' : 0 }}>
                  <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-gold)', marginBottom: '0.3rem' }}>{s.label}</p>
                  <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', fontWeight: 700, marginBottom: '0.6rem' }}>{s.title}</h3>
                  <p style={{ fontSize: 'clamp(0.78rem, 1.7vw, 0.875rem)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {s.tags.map(t => <span key={t} style={{ fontSize: '0.68rem', padding: '0.2rem 0.7rem', borderRadius: '2rem', border: '1px solid var(--color-gold-border)', color: 'var(--color-text-muted)' }}>{t}</span>)}
                </div>
                <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)', fontWeight: 700, color: 'var(--color-gold)', lineHeight: 1 }}>
                  {s.usd} USD
                </p>
                <a href={s.wa} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent(s.ev)} style={{ width: '100%', padding: '0.875rem', background: s.badge ? 'linear-gradient(135deg, #D4943A, #C17D1A)' : 'rgba(193,125,26,0.1)', color: s.badge ? '#160D28' : 'var(--color-gold)', fontWeight: 700, borderRadius: '0.625rem', fontSize: '0.875rem', border: s.badge ? 'none' : '1px solid var(--color-gold-border)', boxShadow: s.badge ? '0 6px 20px rgba(193,125,26,0.35)' : 'none', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <WaIcon color={s.badge ? '#160D28' : 'var(--color-gold)'} /> Consultar por WhatsApp
                </a>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ══════════════════ IA CONSULTIVA ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Acompañamiento inteligente
          </motion.h2>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Al unirte a la Academia Comunidad Imparable, accedés a la <strong style={{ color: 'var(--color-gold)' }}>IA Consultiva 24/7</strong> — tu asistente de desarrollo personal disponible cuando lo necesitás, fuera de las sesiones.
          </motion.p>
          <Link href="/" style={{ display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '0.75rem', border: '1px solid var(--color-gold-border)', color: 'var(--color-gold)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', background: 'rgba(193,125,26,0.06)' }}>
            Ver Academia Comunidad Imparable →
          </Link>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)', background: 'rgba(193,125,26,0.03)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.h2 {...fadeUp} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
            Preguntas frecuentes
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { q: '¿Necesito experiencia espiritual previa para trabajar con Alejandra?', a: 'No. Alejandra acompaña tanto a personas que recién empiezan su camino espiritual como a quienes ya llevan años en él. Cada proceso es único y se adapta a vos.' },
              { q: '¿Qué pasa en la Sesión de Exploración?', a: 'Es un espacio gratuito de 20 minutos por Zoom para conocernos, escuchar qué estás atravesando y ver si hay una manera en que Alejandra pueda acompañarte. Sin presión ni compromiso.' },
              { q: '¿Reiki funciona de manera remota?', a: 'Sí. Las sesiones de Reiki se pueden realizar a distancia con los mismos resultados que en persona. Alejandra tiene amplia experiencia en sesiones remotas por Zoom.' },
              { q: '¿Cómo se define cuáles herramientas se usan en el proceso?', a: 'Alejandra no aplica las mismas herramientas a todos. En las primeras sesiones comprende qué está viviendo la persona y diseña el proceso desde ahí — puede integrar Reiki, Metafísica, Biodescodificación, Gemoterapia o ejercicios de reflexión según lo que cada situación requiera.' },
              { q: '¿Cuánto tiempo dura un proceso?', a: 'Depende de cada persona y de lo que necesita trabajar. Hay quienes se benefician con pocas sesiones y otros eligen un proceso más prolongado. Alejandra no impone tiempos ni promete resultados milagrosos: respeta los ritmos personales.' },
              { q: '¿Es compatible con un tratamiento médico o psicológico?', a: 'Sí. El acompañamiento espiritual de Alejandra es complementario y no reemplaza tratamientos médicos ni psicológicos. Si estás bajo atención profesional, pueden coexistir perfectamente.' },
            ].map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA FINAL ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,6rem) clamp(1rem,5vw,3rem)', textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
          Tu camino comienza adentro
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Una sola conversación puede ser el primer paso. No necesitás tener todo claro para empezar.
        </motion.p>
        <motion.a initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} href={WA_GENERAL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_final_clicked')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '1.1rem 2.5rem', background: 'linear-gradient(135deg, #D4943A, #C17D1A)', color: '#160D28', fontWeight: 700, borderRadius: '0.75rem', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', boxShadow: '0 8px 28px rgba(193,125,26,0.45)', textDecoration: 'none' }}>
          <WaIcon color="#160D28" />
          Escribirle a Alejandra
        </motion.a>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ width: '100%', padding: '2rem clamp(1rem,5vw,3rem)', borderTop: '1px solid var(--color-gold-border)', background: 'rgba(193,125,26,0.03)', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-gold)' }}>Alejandra Cuello</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Maestra de Reiki · Facilitadora Espiritual · Cofundadora de Comunidad Imparable</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/alejandra.cuello28" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              @alejandra.cuello28
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

function WaIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill={color}/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.424A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
