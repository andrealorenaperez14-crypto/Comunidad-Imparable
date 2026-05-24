'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'


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

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
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
          style={{ width: '100%', maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 10 }}
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
              fontSize: 'clamp(1.2rem, 3.5vw, 2.4rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: '1rem'
            }}>
              ¿Vas a seguir siendo un Vendedor Tradicional{' '}
              o das el salto a{' '}
              <span style={{ color: 'var(--color-gold)' }}>Asesor de Elite en el Rubro Salud</span>?
            </h1>
            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              maxWidth: '620px',
              margin: '0 auto 2.5rem'
            }}>
              Ayudamos a asesores/profesionales a escalar a <strong style={{ color: 'var(--color-gold)' }}>+1.000 USD por mes</strong>,<br />implementando Neuroventas con la IA entregada como tu socio.
            </p>
          </motion.div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {([
              { id: 'junior', title: 'Reto 3 Días', desc: 'Asesor Tradicional: Vende copiando y pegando un speech, asistido con la IA de MPS', price: 'GRATIS', cta: 'EMPEZAR RETO GRATIS', href: '/register', note: 'Acceso por ÚNICA vez' },
              { id: 'elite', title: 'En 30 Días', desc: 'Conviértete en Asesor de Elite con aval internacional, con el MÉTODO exclusivo para el Rubro SALUD, de Yami Mansilla', price: '$150 USD', cta: 'QUIERO SABER MÁS', href: '/parte-2', note: '' }
            ] as const).map(({ id, title, desc, price, cta, href, note }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.02 }}
                style={{
                  padding: 'clamp(1.5rem,4vw,2rem)',
                  borderRadius: '0.75rem',
                  border: '2px solid var(--color-gold-border)',
                  background: 'rgba(20,20,20,0.8)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column'
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
                  marginBottom: '1.25rem',
                  flexGrow: 1
                }}>
                  {desc}
                </p>
                <div style={{ borderTop: '1px solid var(--color-gold-border)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '1rem' }}>
                    {price}
                  </p>
                  <button
                    onClick={() => { trackEvent('cta_clicked', { cta_type: id }); router.push(href) }}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                      color: '#000',
                      fontWeight: 700,
                      borderRadius: '0.625rem',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                      letterSpacing: '0.05em',
                      boxShadow: '0 6px 20px rgba(196,151,42,0.4)',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {cta}
                  </button>
                  {note ? (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', marginTop: '0.6rem', letterSpacing: '0.04em' }}>
                      {note}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
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
              { icon: <MentalidadIcon />, name: 'IA Mentalidad', desc: 'La Venta es un Estado de Ánimo. Yami ya pasó por eso, te ayuda a desbloquearlo' },
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
                A los 16 años, trabajé como asesora,
                Hoy, después de más de 10 mil clientes, sé exactamente la diferencia entre quien vende y quien no.
              </p>
              <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
                La diferencia no es talento. Es MÉTODO.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {[
                  { v: 'HONESTIDAD', e: 'Digo NO, cuando NO se puede' },
                  { v: 'MOVIMIENTO', e: '5 llamadas, 5 prospectos, 1 venta' },
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
                ASESOR ELITE<br />en el RUBRO SALUD
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
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>inversión por lanzamiento con un 80% menos</p>
                <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 600, marginTop: '0.75rem' }}>$20 USD/mes</p>
              </div>

              <button
                onClick={() => { trackEvent('final_cta_clicked'); router.push('/parte-2') }}
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
                QUIERO SER ASESOR de ELITE
              </button>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>Gana +1.000 USD en 30 días</p>
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
              { q: '¿En 3 días puedo cerrar una venta?', a: 'SÍ, aunque todo va a ser NO, buscamos el SÍ.' },
              { q: '¿Necesito experiencia previa?', a: 'NO. Solo ganas, movimiento y ambición.' },
              { q: '¿Cuánto puedo ganar?', a: 'Entre 50 y 500 USD por cliente. Tu objetivo es aprender.' },
              { q: '¿Puedo hacerlo mientras trabajo?', a: 'SÍ, puede ser tu complemento. En ELITE, necesitas más dedicación.' }
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
              COMIENZA AHORA
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
