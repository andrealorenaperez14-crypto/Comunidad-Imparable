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
    <div className="w-full" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ===== HERO / PATH SELECTOR ===== */}
      <section className="min-h-screen w-full flex items-center justify-center px-4 sm:px-8 lg:px-12 py-20 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(196,151,42,0.08) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto text-center z-10"
        >
          <motion.div {...fadeUp}>
            <p
              className="text-xs sm:text-sm uppercase tracking-widest mb-5"
              style={{ color: 'var(--color-gold)' }}
            >
              Elige tu camino
            </p>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 leading-snug"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              ¿Vas a seguir siendo un Vendedor Junior
              <br className="hidden sm:block" />
              {' '}o das el salto a Asesor de Elite?
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Reto 3 Días */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedPath('junior')}
              className="w-full p-6 sm:p-8 rounded-xl border-2 transition-all text-center"
              style={{
                borderColor: selectedPath === 'junior' ? 'var(--color-gold)' : 'var(--color-gold-border)',
                background: selectedPath === 'junior'
                  ? 'linear-gradient(135deg, rgba(196,151,42,0.15) 0%, rgba(0,0,0,0.4) 100%)'
                  : 'rgba(20,20,20,0.8)',
                boxShadow: selectedPath === 'junior' ? '0 0 32px rgba(196,151,42,0.25)' : 'none'
              }}
            >
              <h2
                className="text-base sm:text-lg md:text-xl font-bold mb-3"
                style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
              >
                Reto 3 Días
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
                Asesor Junior: Vende copiando y pegando asistido por la IA
              </p>
              <div className="pt-4 border-t" style={{ borderColor: 'var(--color-gold-border)' }}>
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-gold)' }}>GRATIS</p>
              </div>
            </motion.button>

            {/* 30 Días Elite */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedPath('elite')}
              className="w-full p-6 sm:p-8 rounded-xl border-2 transition-all text-center"
              style={{
                borderColor: selectedPath === 'elite' ? 'var(--color-gold)' : 'var(--color-gold-border)',
                background: selectedPath === 'elite'
                  ? 'linear-gradient(135deg, rgba(196,151,42,0.15) 0%, rgba(0,0,0,0.4) 100%)'
                  : 'rgba(20,20,20,0.8)',
                boxShadow: selectedPath === 'elite' ? '0 0 32px rgba(196,151,42,0.25)' : 'none'
              }}
            >
              <h2
                className="text-base sm:text-lg md:text-xl font-bold mb-3"
                style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
              >
                En 30 Días
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
                Conviértete en Asesor de Elite con aval internacional
              </p>
              <div className="pt-4 border-t" style={{ borderColor: 'var(--color-gold-border)' }}>
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-gold)' }}>$150 USD</p>
              </div>
            </motion.button>
          </div>

          {selectedPath && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={() => router.push(selectedPath === 'junior' ? '/register' : '/parte-2')}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl text-base sm:text-lg transition-all hover:opacity-90 active:scale-95"
                style={{ boxShadow: '0 8px 28px rgba(196,151,42,0.45)', letterSpacing: '0.07em' }}
              >
                {selectedPath === 'junior' ? 'EMPEZAR RETO GRATIS' : 'ACCEDER A PARTE 2'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ===== 3 IAs ===== */}
      <section
        className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12"
        style={{
          background: 'linear-gradient(135deg, rgba(196,151,42,0.05) 0%, transparent 100%)',
          borderTop: '1px solid rgba(196,151,42,0.2)',
          borderBottom: '1px solid rgba(196,151,42,0.2)'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div className="mb-12 text-center" {...fadeUp}>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Nunca estás solo
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--color-text-muted)' }}>
              Los 3 agentes IA que transformarán tu forma de trabajar y vender
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                className="p-6 rounded-xl border text-center"
                style={{ borderColor: 'var(--color-gold-border)', background: 'rgba(20,20,20,0.8)' }}
              >
                <div
                  className="w-11 h-11 mx-auto mb-4 flex items-center justify-center rounded-xl"
                  style={{ background: 'rgba(196,151,42,0.15)', color: 'var(--color-gold)' }}
                >
                  {a.icon}
                </div>
                <h3
                  className="text-sm sm:text-base font-bold mb-2"
                  style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
                >
                  {a.name}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {a.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-12"
            style={{ fontFamily: 'Cinzel, serif' }}
            {...fadeUp}
          >
            De 0 a más de 10.000 clientes
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                className="p-4 sm:p-6 rounded-xl border text-center"
                style={{
                  borderColor: 'var(--color-gold-border)',
                  background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, transparent 100%)'
                }}
              >
                <p
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {s.num}
                </p>
                <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YAMI STORY ===== */}
      <section className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-12 text-center"
            style={{ fontFamily: 'Cinzel, serif' }}
            {...fadeUp}
          >
            Esto no es teoría.
            <br />
            <span style={{ color: 'var(--color-gold)' }}>Es mi vida</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Imagen — arriba en mobile */}
            <motion.div
              className="flex justify-center order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src="/assets/client1/yami-gemini.png"
                alt="Yami Mansilla CEO"
                width={420}
                height={520}
                className="w-full max-w-xs sm:max-w-sm md:max-w-full h-auto rounded-xl"
                style={{ boxShadow: '0 20px 48px rgba(196,151,42,0.2)' }}
              />
            </motion.div>

            {/* Texto — abajo en mobile */}
            <motion.div
              className="space-y-5 text-center md:text-left order-2 md:order-1"
              {...fadeUp}
            >
              <p className="text-sm sm:text-base leading-relaxed">
                Crecí en Rosario, sin nada. A los 16 años trabajé por primera vez como asesor.
                Hoy, después de más de 10 mil clientes, sé exactamente la diferencia entre
                quien vende y quien no.
              </p>
              <p className="text-base sm:text-lg font-bold" style={{ color: 'var(--color-gold)' }}>
                No es don. No es suerte. Es MOVIMIENTO.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
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
                    className="p-4 rounded-lg border-l-4 text-center"
                    style={{ borderColor: 'var(--color-gold)', background: 'rgba(196,151,42,0.05)' }}
                  >
                    <p
                      className="font-bold text-xs sm:text-sm mb-1"
                      style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
                    >
                      {v.v}
                    </p>
                    <p className="text-xs sm:text-sm">{v.e}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 3 MÓDULOS ===== */}
      <section
        className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12"
        style={{ background: 'rgba(196,151,42,0.03)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div className="mb-12" {...fadeUp}>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Tu primer cierre en 3 días
            </h2>
            <p className="text-sm sm:text-base italic mt-3" style={{ color: 'var(--color-gold)' }}>
              Solo se aprende haciendo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                className="p-6 sm:p-8 rounded-xl border text-center"
                style={{
                  borderColor: 'var(--color-gold-border)',
                  background: i === 1
                    ? 'linear-gradient(135deg, rgba(196,151,42,0.12) 0%, transparent 100%)'
                    : 'rgba(20,20,20,0.6)'
                }}
              >
                <p className="text-xs sm:text-sm mb-2" style={{ color: 'var(--color-gold)' }}>{s.label}</p>
                <p className="text-4xl sm:text-5xl font-bold mb-2" style={{ color: 'var(--color-gold)' }}>{s.d}</p>
                <h4
                  className="font-bold text-sm sm:text-base"
                  style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
                >
                  {s.t}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section
        className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12"
        style={{
          background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(196,151,42,0.04) 100%)',
          borderTop: '1px solid rgba(196,151,42,0.2)'
        }}
      >
        <div className="max-w-lg mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Después de 3 días
            </h2>
            <p className="text-sm sm:text-base mb-10" style={{ color: 'var(--color-text-muted)' }}>
              Si cerraste tu primer cliente, estás listo para Elite
            </p>

            <div
              className="p-8 sm:p-10 rounded-xl border-2 flex flex-col items-center"
              style={{
                borderColor: 'var(--color-gold)',
                background: 'linear-gradient(135deg, rgba(196,151,42,0.08) 0%, rgba(0,0,0,0.4) 100%)'
              }}
            >
              <h3
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                ASESOR ELITE
              </h3>
              <p className="text-base sm:text-lg font-bold mb-8" style={{ color: 'var(--color-gold)' }}>
                30 días de formación
              </p>

              <div className="mb-8">
                <Image
                  src="/assets/client1/LOGO_NEUROVENTAS.png"
                  alt="Certificado Neuroventas"
                  width={110}
                  height={110}
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <p className="text-sm sm:text-base mb-8 leading-relaxed">
                Certificación Internacional en Neuroventas + 15 módulos + Red de asesores
              </p>

              <div
                className="w-full mb-8 py-6 border-y text-center"
                style={{ borderColor: 'var(--color-gold-border)' }}
              >
                <p
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}
                >
                  $150 USD
                </p>
                <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  Precio lanzamiento
                </p>
                <p className="text-base sm:text-lg font-semibold mt-3">$20 USD/mes</p>
              </div>

              <button
                onClick={() => router.push('/parte-2')}
                className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl text-base sm:text-lg mb-4 transition-all hover:opacity-90 active:scale-95"
                style={{ boxShadow: '0 8px 28px rgba(196,151,42,0.45)', letterSpacing: '0.07em' }}
              >
                ACCEDER A PARTE 2
              </button>
              <p className="text-sm" style={{ color: 'var(--color-gold)' }}>
                Gana $2000+ en 30 días
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ fontFamily: 'Cinzel, serif' }}
            {...fadeUp}
          >
            Preguntas frecuentes
          </motion.h2>

          <div className="space-y-3">
            {[
              { q: '¿En 3 días puedo cerrar una venta?', a: 'Si sigues los pasos: Sí.' },
              { q: '¿Necesito experiencia previa?', a: 'No. Solo ganas, fe y disposición.' },
              { q: '¿Cuánto puedo ganar?', a: '$100-500 por cliente. Tu objetivo es aprender.' },
              { q: '¿Puedo hacerlo mientras trabajo?', a: 'Sí. En las noches. En Elite necesitas más dedicación.' },
              { q: '¿Qué pasa si no cierro?', a: 'Si hiciste todo, el cliente dirá sí en 5-7 días.' },
              { q: '¿Qué horarios tienen las IAs?', a: 'Las 3 IAs atienden 24/7.' }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border rounded-xl overflow-hidden"
                style={{ borderColor: 'var(--color-gold-border)' }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left font-semibold flex justify-between items-center text-sm sm:text-base transition-all"
                  style={{ background: expandedFaq === i ? 'rgba(196,151,42,0.1)' : 'transparent' }}
                >
                  <span>{f.q}</span>
                  <span
                    className="text-xl ml-4 flex-shrink-0"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {expandedFaq === i ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === i && (
                  <div
                    className="px-5 py-4 border-t text-sm sm:text-base leading-relaxed"
                    style={{
                      borderColor: 'var(--color-gold-border)',
                      background: 'rgba(196,151,42,0.05)',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    {f.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CIERRE YAMI ===== */}
      <section
        className="w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 text-center"
        style={{ background: 'rgba(196,151,42,0.03)' }}
      >
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/client1/LOGO_YAMI_MANSILLA.jpeg"
                alt="Yami Mansilla"
                width={200}
                height={200}
                className="rounded-xl"
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 28px rgba(196,151,42,0.3))'
                }}
              />
            </div>
            <p
              className="text-base sm:text-lg lg:text-xl font-bold mb-4 italic"
              style={{ fontFamily: 'Georgia, serif', color: 'var(--color-gold)' }}
            >
              "Todo lo que toco lo transformo en oro."
            </p>
            <p className="font-bold text-sm sm:text-base" style={{ fontFamily: 'Cinzel, serif' }}>
              Yami Mansilla
            </p>
            <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
              CEO & Fundadora | Escuela de Asesores
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="w-full py-8 px-4 sm:px-8 border-t text-center"
        style={{ borderColor: 'var(--color-gold-border)', background: 'rgba(196,151,42,0.03)' }}
      >
        <div
          className="flex flex-wrap justify-center gap-6 text-xs mb-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Link href="#" className="hover:text-yellow-400 transition">Términos</Link>
          <Link href="#" className="hover:text-yellow-400 transition">Privacidad</Link>
          <Link href="#" className="hover:text-yellow-400 transition">Contacto</Link>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          © 2026 Escuela de Asesores | Formamos Líderes, No Vendedores
        </p>
      </footer>

    </div>
  )
}
