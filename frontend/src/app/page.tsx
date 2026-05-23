'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'


const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const CoachIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 11v8M8 14h8M6 19h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const MentalidadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
  </svg>
)

const ConsultivaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
  </svg>
)

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedPath, setSelectedPath] = useState<'junior' | 'elite' | null>(null)
  const router = useRouter()

  return (
    <div
      style={{
        width: '100%',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        textAlign: 'center',
        overflowX: 'hidden'
      }}
    >

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
          style={{ width: '100%', maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <Image
              src="/assets/client1/LOGO_cuad_y_nombre_ESCUELA_DE_ASESORES.png"
              alt="Escuela de Asesores"
              width={220}
              height={220}
              style={{ objectFit: 'contain' }}
            />
          </div>

          <motion.div {...fadeUp}>
            <p style={{
              fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-gold)',
              marginBottom: '1.25rem'
            }}>
              Elige tu camino
            </p>
            <h1 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: '2.5rem'
            }}>
              ¿Vas a seguir siendo un Vendedor Junior{' '}
              o das el salto a Asesor de Elite?
            </h1>
          </motion.div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { id: 'junior', title: 'Reto 3 Días', desc: 'Asesor Junior: Vende copiando y pegando asistido por la IA', price: 'GRATIS' },
              { id: 'elite', title: 'En 30 Días', desc: 'Conviértete en Asesor de Elite con aval internacional', price: '$150 USD' }
            ].map(({ id, title, desc, price }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPath(id as 'junior' | 'elite')}
                style={{
                  padding: 'clamp(1.5rem,4vw,2rem)',
                  borderRadius: '0.75rem',
                  border: `2px solid ${selectedPath === id ? 'var(--color-gold)' : 'var(--color-gold-border)'}`,
                  background: selectedPath === id
                    ? 'linear-gradient(135deg, rgba(196,151,42,0.15) 0%, rgba(0,0,0,0.4) 100%)'
                    : 'rgba(20,20,20,0.8)',
                  boxShadow: selectedPath === id ? '0 0 32px rgba(196,151,42,0.25)' : 'none',
                  textAlign: 'center',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <h2 style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  marginBottom: '0.75rem'
                }}>
                  {title}
                </h2>
                <p style={{
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem'
                }}>
                  {desc}
                </p>
                <div style={{ borderTop: '1px solid var(--color-gold-border)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--color-gold)' }}>
                    {price}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {selectedPath && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={() => router.push(selectedPath === 'junior' ? '/register' : '/parte-2')}
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
                  transition: 'opacity 0.2s',
                  width: '100%',
                  maxWidth: '360px'
                }}
              >
                {selectedPath === 'junior' ? 'EMPEZAR RETO GRATIS' : 'ACCEDER A PARTE 2'}
              </button>
            </motion.div>
          )}
        </motion.div>
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
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-text-muted)' }}>
              Los 3 agentes IA que transformarán tu forma de trabajar y vender
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { icon: <CoachIcon />, name: 'IA Coach', desc: 'Mentoría personalizada 24/7 en cada paso' },
              { icon: <MentalidadIcon />, name: 'IA Mentalidad', desc: 'Transforma tus creencias limitantes' },
              { icon: <ConsultivaIcon />, name: 'IA Consultiva', desc: '2000+ casos reales. Estrategias probadas' }
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
                <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
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
            De 0 a más de 10.000 clientes
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}
            className="lg-grid-4"
          >
            {[
              { num: '+10,000', text: 'Clientes' },
              { num: '13', text: 'Años de experiencia' },
              { num: '1000+', text: 'Asesores Formados' },
              { num: '$1500+', text: 'Dólares promedio' }
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
                src="/assets/client1/yami-gemini.png"
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
              <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Crecí en Rosario, sin nada. A los 16 años trabajé por primera vez como asesor.
                Hoy, después de más de 10 mil clientes, sé exactamente la diferencia entre quien vende y quien no.
              </p>
              <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
                No es don. No es suerte. Es MOVIMIENTO.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {[
                  { v: 'HONESTIDAD', e: 'Digo No cuando no sirve' },
                  { v: 'MOVIMIENTO', e: '3 llamadas, 5 prospectos, 1 venta' },
                  { v: 'SERVICIO', e: 'Un cliente son mil' }
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
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { d: '1', t: 'PROSPECCIÓN', label: 'Módulo 1' },
              { d: '2', t: 'DESCUBRIMIENTO', label: 'Módulo 2' },
              { d: '3', t: 'CIERRE', label: 'Módulo 3' }
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
                <h4 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-gold)' }}>
                  {s.t}
                </h4>
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
              Después de 3 días
            </h2>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
              Si cerraste tu primer cliente, estás listo para Elite
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
                ASESOR ELITE
              </h3>
              <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '2rem' }}>
                30 días de formación
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <Image
                  src="/assets/client1/LOGO_NEUROVENTAS.png"
                  alt="Certificado Neuroventas"
                  width={100}
                  height={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Certificación Internacional en Neuroventas + 15 módulos + Red de asesores
              </p>

              <div style={{ width: '100%', borderTop: '1px solid var(--color-gold-border)', borderBottom: '1px solid var(--color-gold-border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
                <p style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}>
                  $150 USD
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>Precio lanzamiento</p>
                <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 600, marginTop: '0.75rem' }}>$20 USD/mes</p>
              </div>

              <button
                onClick={() => router.push('/parte-2')}
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
                ACCEDER A PARTE 2
              </button>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Gana $2000+ en 30 días</p>
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
              { q: '¿En 3 días puedo cerrar una venta?', a: 'Si sigues los pasos: Sí.' },
              { q: '¿Necesito experiencia previa?', a: 'No. Solo ganas, fe y disposición.' },
              { q: '¿Cuánto puedo ganar?', a: '$100–500 por cliente. Tu objetivo es aprender.' },
              { q: '¿Puedo hacerlo mientras trabajo?', a: 'Sí. En las noches. En Elite necesitas más dedicación.' },
              { q: '¿Qué pasa si no cierro?', a: 'Si hiciste todo, el cliente dirá sí en 5–7 días.' },
              { q: '¿Qué horarios tienen las IAs?', a: 'Las 3 IAs atienden 24/7.' }
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
                    textAlign: 'left'
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
                width={260}
                height={260}
                style={{ objectFit: 'contain', borderRadius: '0.75rem', filter: 'drop-shadow(0 12px 28px rgba(196,151,42,0.3))' }}
              />
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '1rem' }}>
              "Todo lo que toco lo transformo en oro."
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
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
          © 2026 Escuela de Asesores | Formamos Líderes, No Vendedores
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Desarrollado por: NUCLEO ESTRATEGICO IA
        </p>
      </footer>

    </div>
  )
}
