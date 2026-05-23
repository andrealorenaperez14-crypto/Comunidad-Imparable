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

export default function Parte2() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const router = useRouter()

  const modules = [
    { num: '01', title: 'Neuroventas en Consumidor de Salud', topics: ['Comportamiento humano', 'Qué compra realmente una persona', 'Decisión emocional'] },
    { num: '02', title: 'Cerebro Reptiliano', topics: ['Necesidad urgente de protección', 'Miedo', 'Supervivencia', 'Seguridad', 'Urgencia'] },
    { num: '03', title: 'Cerebro Límbico', topics: ['Conexión emocional', 'Emociones', 'Apego', 'Familia', 'Empatía estratégica', 'Escucha activa'] },
    { num: '04', title: 'Neocórtex del Consumidor', topics: ['Racionalizar decisiones', 'Argumentos', 'Comparativas', 'Lógica', 'Validación mental'] },
    { num: '05', title: 'Botón de Compra - Adultos Mayores', topics: ['Bajar el miedo', 'Seguridad', 'Transparencia', 'Comunicación familiar', 'Objeciones comunes'] },
    { num: '06', title: 'Botón de Compra - Madres', topics: ['Protección emocional', 'Instinto protector', 'Seguridad infantil', 'Sin presión'] },
    { num: '07', title: 'Botón de Compra - Familias', topics: ['Quién decide realmente', 'Roles familiares', 'Influenciadores', 'Liderazgo emocional'] },
    { num: '08', title: 'Psicología de Objeciones', topics: ['Responder sin presionar', '10000+ casos reales', 'Técnicas comprobadas', '"Está caro"', '"Tengo otra cobertura"'] },
    { num: '09', title: 'Cotización Inteligente', topics: ['Cotizar de verdad', 'Presentar valor', 'No competir por precio', 'Guía mental del cliente'] },
    { num: '10', title: 'Persuasión Online', topics: ['Atención en pantalla', 'Palabras de impacto', 'Timing emocional', 'WhatsApp', 'Videollamadas'] },
    { num: '11', title: 'Hipnosis Conversacional y PNL', topics: ['Técnicas avanzadas', 'Cierres de alto impacto', 'Seguimiento efectivo', 'Multiplicador de clientes'] },
    { num: '12', title: 'Agenda y Organización Elite', topics: ['Manejo de tiempos', 'Crecimiento de cartera', 'Cierre emocional', 'Delegación', 'Drive efectivo'] },
    { num: '13', title: 'Asesor de Salud - Profesional', topics: ['Seguridad y presencia', 'Autoridad', 'Autoimagen', 'Energía', 'Liderazgo emocional', 'Gratitud'] },
    { num: '14', title: 'Bonus: Enfermedades y Medicamentos', topics: ['Preexistencias modulables', 'Anticonceptivos', 'Fertilización', 'Legislación 310/2004', 'Medicamentos al 100%'] },
    { num: '15', title: 'Certificación Elite Internacional', topics: ['De vendedor a profesional', 'Evaluación final', 'Simulaciones de ventas', 'Certificado oficial'] }
  ]

  return (
    <div style={{
      width: '100%',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      textAlign: 'center',
      overflowX: 'hidden'
    }}>

      {/* Login shortcut */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
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
            El programa que convierte asesores en profesionales de alto valor.<br />
            <strong style={{ color: 'var(--color-gold)' }}>$2000+ en 30 días</strong> — o seguís como estás.
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
              fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-gold)',
              marginBottom: '2rem'
            }}>
              Por qué esto importa ahora
            </p>

            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
              fontWeight: 700,
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              color: 'var(--color-text)'
            }}>
              El rubro de la salud es de primera necesidad, y hoy, la demanda de{' '}
              <span style={{ color: 'var(--color-gold)' }}>Asesores de Medicina Prepaga altamente capacitados</span>{' '}
              está en su punto histórico más alto.
            </p>

            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              marginBottom: '2.5rem'
            }}>
              Las familias necesitan respuestas, no vendedores.
            </p>

            <div style={{
              width: '3rem',
              height: '2px',
              background: 'var(--color-gold)',
              margin: '0 auto 2.5rem'
            }} />

            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              marginBottom: '1.5rem'
            }}>
              A través del{' '}
              <strong style={{ color: 'var(--color-text)' }}>método exclusivo de Yami Mansilla</strong>,
              transformamos por completo tu enfoque: dejás de ser un simple "vendedor" persiguiendo comisiones,
              para convertirte en un{' '}
              <strong style={{ color: 'var(--color-gold)' }}>verdadero aliado estratégico</strong>.
            </p>

            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8
            }}>
              Aprenderás a guiar a cada cliente/paciente con{' '}
              <strong style={{ color: 'var(--color-text)' }}>autoridad y empatía</strong>,
              ayudándole a encontrar la opción de salud perfecta,
              diseñada exactamente a su medida.
            </p>
          </motion.div>
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
              Certificación Internacional en Neuroventas Aplicadas al Consumidor de Salud
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
                desc: 'Mentoría personalizada. Responde dudas 24/7. Guía paso a paso. Acelera tu aprendizaje.',
                features: ['Respuestas inmediatas', 'Tutoría personalizada', 'Clarificación de conceptos', 'Motivación diaria']
              },
              {
                icon: <MentalidadIcon />,
                title: 'IA Mentalidad',
                desc: 'Trabaja tus bloqueos. Transformación emocional. Confianza profesional. Mentalidad de campeón.',
                features: ['Sesiones de mentalidad', 'Bloqueos identificados', 'Ejercicios prácticos', 'Transformación interna']
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
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {ia.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-gold)' }}>+</span> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section style={{ width: '100%', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '2.5rem' }}
          >
            Tu Inversión
          </motion.h2>

          <div style={{
            padding: 'clamp(2rem,5vw,2.5rem)',
            borderRadius: '0.875rem',
            border: '2px solid var(--color-gold)',
            background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(0,0,0,0.4) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Image
                src="/assets/client1/LOGO_NEUROVENTAS.png"
                alt="Certificado Neuroventas"
                width={100}
                height={100}
                style={{ objectFit: 'contain' }}
              />
            </div>

            <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif', marginBottom: '0.5rem' }}>
              $150 USD
            </p>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              15 módulos + IA Coach + IA Mentalidad por 30 días
            </p>
            <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', fontWeight: 700, marginBottom: '2rem' }}>
              Luego $20/mes (opcional)
            </p>

            <button
              onClick={() => { trackEvent('final_cta_clicked'); router.push('/register') }}
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
                marginBottom: '1.25rem'
              }}
            >
              QUIERO SER ASESOR de ELITE
            </button>

            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)' }}>
              Podés cancelar tu membresía en cualquier momento
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ CIERRE YAMI ══════════════════ */}
      <section style={{
        width: '100%',
        padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem)',
        background: 'rgba(196,151,42,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <Image
                src="/assets/client1/YAMI_MANSILLA.jpeg"
                alt="Yami Mansilla"
                width={340}
                height={340}
                style={{ objectFit: 'contain', borderRadius: '0.75rem', filter: 'drop-shadow(0 12px 28px rgba(196,151,42,0.3))', width: 'clamp(260px, 55vw, 420px)', height: 'auto' }}
              />
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '1rem' }}>
              "Capacitación de Alto Impacto que Rompe todos los Esquemas"
            </p>
            <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
              Yami Mansilla
            </p>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              CEO & Fundadora | Escuela de Asesores
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
              30 días. 15 módulos. Certificación internacional.<br />
              Todo lo que necesitás para escalar a $2000+ al mes.
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
              QUIERO SER ASESOR de ELITE
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['Términos', 'Privacidad', 'Contacto'].map((t) => (
            <Link key={t} href="#" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t}</Link>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
          Certificación Internacional en Neuroventas · Escuela de Asesores · Yami Mansilla
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Desarrollado por: NUCLEO ESTRATEGICO IA
        </p>
      </footer>

    </div>
  )
}
