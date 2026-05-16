'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpen, Award, BarChart2, ChevronRight, Check, Brain, Target, TrendingUp } from 'lucide-react'

const agents = [
  {
    icon: <Brain className="w-5 h-5" strokeWidth={1.5} />,
    name: 'IA Coach',
    description: 'Acompaña tu aprendizaje 24/7 con guía personalizada en cada paso del proceso.',
  },
  {
    icon: <Target className="w-5 h-5" strokeWidth={1.5} />,
    name: 'IA Mentalidad',
    description: 'Trabaja tus bloqueos y miedos para que nada detenga tu crecimiento.',
  },
  {
    icon: <TrendingUp className="w-5 h-5" strokeWidth={1.5} />,
    name: 'IA Consultiva',
    description: 'Te asiste en cada venta y cierre con estrategias probadas en tiempo real.',
  }
]

const features = [
  { icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} />, label: 'Acceso inmediato a los 3 agentes IA desde día 1' },
  { icon: <Award className="w-5 h-5" strokeWidth={1.5} />, label: 'Certificación Neuroventas + B.I.I.A.' },
  { icon: <BarChart2 className="w-5 h-5" strokeWidth={1.5} />, label: 'Métricas de rendimiento semanales' },
  { icon: <Check className="w-5 h-5" strokeWidth={1.5} />, label: '5 días de acceso gratuito completo' },
  { icon: <Check className="w-5 h-5" strokeWidth={1.5} />, label: 'Ranking de élite actualizado a diario' },
  { icon: <Check className="w-5 h-5" strokeWidth={1.5} />, label: 'Sin apps — funciona en cualquier dispositivo' },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
}

const card3DHover = {
  whileHover: { scale: 1.02, rotateX: 2, rotateY: 2, y: -4 },
  transition: { duration: 0.3 },
  style: { transformStyle: 'preserve-3d' as const, perspective: 1000 }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--color-separator)' }}>
        <div className="container flex items-center justify-between py-4">
          <Image
            src="/assets/client1/LOGO_y_nombre_ESCUELA_DE_ASESORES.png"
            alt="Escuela de Asesores"
            width={180}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Iniciar sesión
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              <Link href="/register" className="btn-primary text-sm" style={{ marginTop: 0, marginBottom: 0 }}>
                Comenzar gratis
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="section text-center">
        <div className="container">
          <motion.div {...fadeUp}>
            {/* Logo */}
            <div className="flex justify-center w-full mb-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/assets/client1/LOGO_SOLO_ESCUELA_DE_ASESORES.png"
                  alt="Escuela de Asesores"
                  width={140}
                  height={140}
                  className="mx-auto block"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(196,151,42,0.4))' }}
                />
              </motion.div>
            </div>

            <span
              className="inline-block text-xs font-medium px-4 py-2 rounded-full"
              style={{
                color: 'var(--color-gold)',
                border: '1px solid var(--color-gold-border)',
                background: 'rgba(196,151,42,0.08)',
                letterSpacing: '0.15em'
              }}
            >
              ROMPE TODOS LOS ESQUEMAS
            </span>

            <h1 className="text-4xl md:text-6xl font-bold">
              Escuela de Asesores
            </h1>

            <p className="text-xl" style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
              Formamos Líderes, No Vendedores.
            </p>
            <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
              Transformamos Vidas, No Solo Negocios.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                <Link href="/register" className="btn-primary gap-2">
                  Comenzar — 5 días gratis
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
              </motion.div>
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Ya tengo cuenta
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Agentes IA */}
      <section className="section section-even">
        <div className="container">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Nunca estás solo/a</h2>
            <p className="text-lg" style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', maxWidth: '42rem', margin: '0 auto 2rem' }}>
              La primera plataforma donde todo tu proceso — aprender, crecer y vender — es asistido por inteligencia artificial las 24 horas.
            </p>
          </motion.div>

          <div className="card-grid card-grid-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2, y: -4 }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                className="card"
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{
                    background: 'rgba(196,151,42,0.1)',
                    color: 'var(--color-gold)',
                    border: '1px solid var(--color-gold-border)'
                  }}
                >
                  {agent.icon}
                </div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-gold)' }}>
                  {agent.name}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                  {agent.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Beneficios */}
      <section className="section">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold">
              Por qué elegir Escuela de Asesores
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
              Todo lo que necesitas para destacar como asesor de élite.
            </p>

            <div className="card-grid card-grid-2 text-left" style={{ marginTop: '2rem' }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2, y: -4 }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: 1000,
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-gold-border)',
                    borderRadius: '6px'
                  }}
                  className="flex items-start gap-3 p-6"
                >
                  <span style={{ color: 'var(--color-gold)' }} className="mt-0.5 flex-shrink-0">{f.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{f.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="inline-block">
              <Link href="/register" className="btn-primary gap-2">
                Comenzar mi formación
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Fundadora */}
      <section className="section section-even">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            {/* Yami logo */}
            <div className="flex justify-center w-full mb-10">
              <motion.div
                animate={{ rotateY: [0, 8, 0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/assets/client1/LOGO_1_YAMI_MANSILLA.png"
                  alt="Yami Mansilla"
                  width={100}
                  height={100}
                  className="mx-auto block"
                />
              </motion.div>
            </div>

            <p className="text-4xl font-script" style={{ color: 'var(--color-gold)' }}>
              Yami Mansilla
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.2em' }}>
              VISIONARIA · EMPRESARIA · CAPACITADORA
            </p>
            <p className="text-lg italic" style={{ color: 'var(--color-text-muted)' }}>
              "No sigo tendencias, las creo."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center text-sm"
        style={{ borderTop: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}
      >
        <div className="container py-8">
          <p>© 2026 Escuela de Asesores. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}
