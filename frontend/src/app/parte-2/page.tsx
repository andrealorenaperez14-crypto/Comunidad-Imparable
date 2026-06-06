'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'

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

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxjS0oqQK6ISclBZS9h2BKrMhrNr_sCsCtzx6kYBzFclzWcax2OPrB9VFrmtkEQ_6cg/exec'

export default function Parte2() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setFormError('Completá todos los campos')
      return
    }
    setSending(true)
    setFormError('')
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setSent(true)
      trackEvent('vip_waitlist_submitted')
    } catch {
      setFormError('Hubo un error. Intentá de nuevo.')
    } finally {
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
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem,10vw,8rem) clamp(1rem,5vw,3rem)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(196,151,42,0.09) 0%, transparent 70%)'
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <Image
              src="/assets/client1/LOGO_cuad_y_nombre_ESCUELA_DE_ASESORES.png"
              alt="Escuela de Asesores"
              width={300}
              height={300}
              style={{ objectFit: 'contain', width: 'clamp(220px, 48vw, 380px)', height: 'auto' }}
            />
          </div>

          <motion.h1
            {...fadeUp}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: '1.25rem'
            }}
          >
            Asesor Elite Internacional
          </motion.h1>

          <motion.p
            {...fadeUp}
            style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
              color: 'var(--color-gold)',
              lineHeight: 1.7,
              marginBottom: '1rem'
            }}
          >
            30 días de formación. 15 módulos especializados.
            <br />Certificación Internacional en Neuroventas.
            <br />2 Mentorías semanales en vivo.
          </motion.p>

          <motion.p
            {...fadeUp}
            style={{
              fontSize: 'clamp(0.82rem, 1.8vw, 1rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto 2rem'
            }}
          >
            El programa que convierte asesores<br />en Profesionales de Alto Valor.<br />
            <strong style={{ color: 'var(--color-gold)' }}>Escalá a +1.000 USD en 30 días</strong><br />o seguí como asesor tradicional.
          </motion.p>

          <motion.div {...fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => { trackEvent('cta_clicked', { cta_type: 'elite_hero' }); router.push('/register') }}
              style={{
                padding: '1rem 2.5rem',
                background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                color: '#000',
                fontWeight: 700,
                borderRadius: '0.75rem',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                letterSpacing: '0.07em',
                boxShadow: '0 8px 28px rgba(196,151,42,0.45)',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '360px'
              }}
            >
              QUIERO SER ASESOR de ELITE
            </button>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)' }}>
              Acceso inmediato · Soporte 24/7 · Certificado internacional
            </p>
          </motion.div>
        </motion.div>
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
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '2.5rem' }}
          >
            Asesores ELITE
          </motion.h2>

          <div style={{
            padding: 'clamp(2rem,5vw,2.5rem)',
            borderRadius: '0.875rem',
            border: '2px solid var(--color-gold)',
            background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(0,0,0,0.4) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>

            {/* Texto principal */}
            <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: 'var(--color-text)', lineHeight: 1.75 }}>
              ¿Listo para llevar tus asesorías al siguiente nivel?<br />
              La versión avanzada de la <strong style={{ color: 'var(--color-gold)' }}>Escuela de Asesores ELITE en el rubro Salud</strong>, llega en julio.
            </p>

            {/* Formulario Lista de Espera */}
            {!sent ? (
              !showForm ? (
                <button
                  onClick={() => { setShowForm(true); trackEvent('vip_waitlist_clicked') }}
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                    color: '#000',
                    fontWeight: 700,
                    borderRadius: '0.75rem',
                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                    letterSpacing: '0.05em',
                    boxShadow: '0 8px 28px rgba(196,151,42,0.45)',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  Unirme a la Lista VIP (Pre-lanzamiento)
                </button>
              ) : (
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(['nombre', 'email', 'whatsapp'] as const).map((field) => (
                    <input
                      key={field}
                      type={field === 'email' ? 'email' : 'text'}
                      placeholder={field === 'nombre' ? 'Tu nombre' : field === 'email' ? 'Tu email' : 'Tu WhatsApp (con código de país)'}
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.625rem',
                        border: '1px solid var(--color-gold-border)',
                        background: 'rgba(0,0,0,0.4)',
                        color: 'var(--color-text)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  ))}
                  {formError && (
                    <p style={{ color: '#F87171', fontSize: '0.85rem' }}>{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: sending ? 'rgba(196,151,42,0.5)' : 'linear-gradient(135deg, #EAB308, #CA8A04)',
                      color: '#000',
                      fontWeight: 700,
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      cursor: sending ? 'not-allowed' : 'pointer',
                      border: 'none'
                    }}
                  >
                    {sending ? 'Enviando...' : 'Confirmar mi lugar VIP'}
                  </button>
                </form>
              )
            ) : (
              <div style={{
                width: '100%',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.3)',
                textAlign: 'center'
              }}>
                <p style={{ color: '#4ADE80', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>¡Estás en la lista!</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Te vamos a avisar antes que nadie cuando abramos el acceso ELITE en julio.
                </p>
              </div>
            )}

            {/* Botón 2 — WhatsApp Club */}
            <a
              href="https://chat.whatsapp.com/KORGh8M1Vbw46UQ1VqW2Gr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('vip_whatsapp_clicked')}
              style={{
                width: '100%',
                padding: '0.875rem 2rem',
                background: 'rgba(245,240,232,0.05)',
                color: '#F5F0E8',
                fontWeight: 700,
                borderRadius: '0.75rem',
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                letterSpacing: '0.05em',
                border: '1px solid rgba(245,240,232,0.25)',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center'
              }}
            >
              Sumarme al Club de Asesores VIP ORO
            </a>

            {/* Separador */}
            <div style={{ width: '100%', height: '1px', background: 'var(--color-separator)' }} />

            {/* Gancho precio */}
            <div style={{
              width: '100%',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              background: 'rgba(196,151,42,0.07)',
              border: '1px solid var(--color-gold-border)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Quienes estén en la lista de espera recibirán un beneficio exclusivo que no estará disponible para el público general el día del lanzamiento.
              </p>
              <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', marginBottom: '0.25rem' }}>
                INVERSIÓN 150 USD
              </p>
              <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '0.5rem' }}>
                con 80% dto.
              </p>
              <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--color-text-muted)' }}>
                Después <strong style={{ color: 'var(--color-text)' }}>270 USD</strong>
              </p>
            </div>

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
