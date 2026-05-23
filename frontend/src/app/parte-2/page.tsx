'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
    <div className="w-full" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ===== HERO ===== */}
      <section className="min-h-screen w-full flex items-center justify-center px-4 sm:px-8 lg:px-12 py-20 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(196,151,42,0.08) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl mx-auto text-center z-10"
        >
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 leading-snug"
            style={{ fontFamily: 'Cinzel, serif' }}
            {...fadeUp}
          >
            Asesor Elite Internacional
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base lg:text-lg mb-8 leading-relaxed"
            style={{ color: 'var(--color-gold)' }}
            {...fadeUp}
          >
            30 días de formación. 15 módulos especializados.
            <br className="hidden sm:block" />
            Certificación Internacional en Neuroventas.
          </motion.p>

          <motion.div className="flex flex-col items-center gap-5 mb-8" {...fadeUp}>
            <div>
              <p
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
              >
                En 30 días ganarás $2000+
              </p>
              <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                O tu dinero de vuelta garantizado
              </p>
            </div>

            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl text-base sm:text-lg transition-all hover:opacity-90 active:scale-95"
              style={{ boxShadow: '0 8px 28px rgba(196,151,42,0.45)', letterSpacing: '0.07em' }}
            >
              ENTRA AHORA
            </button>
          </motion.div>

          <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Acceso inmediato · Soporte 24/7 · Certificado internacional
          </p>
        </motion.div>
      </section>

      {/* ===== 15 MÓDULOS ===== */}
      <section className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'Cinzel, serif' }}
              {...fadeUp}
            >
              15 Módulos Especializados
            </motion.h2>
            <p className="text-xs sm:text-sm mt-3" style={{ color: 'var(--color-text-muted)' }}>
              Certificación Internacional en Neuroventas Aplicadas al Consumidor de Salud
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true }}
                onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                className="p-5 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: 'var(--color-gold-border)',
                  background: expandedModule === i ? 'rgba(196,151,42,0.1)' : 'rgba(20,20,20,0.8)'
                }}
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <p
                    className="font-bold text-xs sm:text-sm flex-shrink-0"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {mod.num}
                  </p>
                  <h3
                    className="font-bold text-sm sm:text-base leading-snug"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {mod.title}
                  </h3>
                </div>
                {expandedModule === i && (
                  <ul className="text-xs sm:text-sm mt-3 space-y-1.5 pl-7" style={{ color: 'var(--color-text-muted)' }}>
                    {mod.topics.map((topic, j) => (
                      <li key={j} className="flex gap-2">
                        <span style={{ color: 'var(--color-gold)' }}>·</span> {topic}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IAs ===== */}
      <section
        className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12"
        style={{ background: 'rgba(196,151,42,0.03)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-12"
            style={{ fontFamily: 'Cinzel, serif' }}
            {...fadeUp}
          >
            Acompañamiento Inteligente
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'IA Coach',
                desc: 'Mentoría personalizada. Responde dudas 24/7. Guía paso a paso. Acelera tu aprendizaje en cada módulo.',
                features: ['Respuestas inmediatas', 'Tutoría personalizada', 'Clarificación de conceptos', 'Motivación diaria']
              },
              {
                title: 'IA Mentalidad',
                desc: 'Trabaja tus bloqueos. Transformación emocional. Confianza profesional. Mentalidad de campeón.',
                features: ['Sesiones de mentalidad', 'Bloqueos identificados', 'Ejercicios prácticos', 'Transformación interna']
              }
            ].map((ia, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-xl border text-center"
                style={{ borderColor: 'var(--color-gold-border)', background: 'rgba(20,20,20,0.8)' }}
              >
                <h3
                  className="text-lg sm:text-xl font-bold mb-3"
                  style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
                >
                  {ia.title}
                </h3>
                <p className="text-xs sm:text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {ia.desc}
                </p>
                <ul className="text-xs sm:text-sm space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                  {ia.features.map((f, j) => (
                    <li key={j} className="flex gap-2 justify-center">
                      <span style={{ color: 'var(--color-gold)' }}>+</span> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-sm sm:max-w-md mx-auto text-center">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-10"
            style={{ fontFamily: 'Cinzel, serif' }}
            {...fadeUp}
          >
            Tu Inversión
          </motion.h2>

          <div
            className="p-8 sm:p-10 rounded-xl border-2"
            style={{
              borderColor: 'var(--color-gold)',
              background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(0,0,0,0.4) 100%)'
            }}
          >
            <p
              className="text-4xl sm:text-5xl font-bold mb-3"
              style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
            >
              $150 USD
            </p>
            <p className="text-xs sm:text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
              15 módulos + IA Coach + IA Mentalidad por 30 días
            </p>
            <p className="text-sm sm:text-base font-bold mb-8">Luego $20/mes (opcional)</p>

            <button
              onClick={() => router.push('/register')}
              className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl text-base sm:text-lg mb-5 transition-all hover:opacity-90 active:scale-95"
              style={{ boxShadow: '0 8px 28px rgba(196,151,42,0.45)', letterSpacing: '0.07em' }}
            >
              CONFIRMAR ACCESO
            </button>

            <p className="text-xs sm:text-sm" style={{ color: 'var(--color-gold)' }}>
              Garantía 30 días: No satisfecho, devolvemos 100%
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="w-full py-8 px-4 sm:px-8 border-t text-center"
        style={{ borderColor: 'var(--color-gold-border)', background: 'rgba(196,151,42,0.03)' }}
      >
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Certificación Internacional en Neuroventas
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Escuela de Asesores · Yami Mansilla
        </p>
      </footer>

    </div>
  )
}
