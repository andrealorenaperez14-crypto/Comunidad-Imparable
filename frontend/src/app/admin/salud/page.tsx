'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Activity, Database, MessageSquare, Server } from 'lucide-react'
import { healthApi } from '@/lib/api'

interface UsageData {
  groq: { usadoHoy: number; limiteDiario: number; porcentaje: number }
  iaInteracciones: { hoy: number }
  database: { conexionesActivas: number; maxConexiones: number; porcentaje: number } | null
  redis: string
}

function colorFor(pct: number) {
  if (pct >= 85) return 'var(--color-gold)'
  if (pct >= 60) return 'rgba(196,151,42,0.6)'
  return 'rgba(196,151,42,0.35)'
}

function UsageCard({ label, icon, used, total, pct, sub }: {
  label: string; icon: React.ReactNode; used: number | string; total?: number; pct?: number; sub?: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(196,151,42,0.1)', color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)' }}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        {used}{total != null && <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}> / {total}</span>}
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>}
      {pct != null && (
        <div className="mt-3" style={{ height: 6, borderRadius: 999, background: 'rgba(196,151,42,0.1)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: colorFor(pct), transition: 'width 0.3s' }} />
        </div>
      )}
    </motion.div>
  )
}

export default function SaludPage() {
  const { data, isLoading, dataUpdatedAt } = useQuery<UsageData>({
    queryKey: ['health-usage'],
    queryFn: () => healthApi.usage().then(r => r.data),
    refetchInterval: 60000
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Salud del sistema</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Consumo de los puntos críticos en tiempo real. Se actualiza cada 1 minuto.
        </p>
      </div>

      <div className="card-grid card-grid-4">
        <UsageCard
          label="Cuota Groq (IA gratuita) hoy"
          icon={<MessageSquare className="w-6 h-6" strokeWidth={1.5} />}
          used={isLoading ? '...' : data?.groq.usadoHoy ?? 0}
          total={data?.groq.limiteDiario}
          pct={data?.groq.porcentaje}
          sub={data?.groq.porcentaje != null ? `${data.groq.porcentaje}% del límite diario` : undefined}
        />
        <UsageCard
          label="Conexiones a la base de datos"
          icon={<Database className="w-6 h-6" strokeWidth={1.5} />}
          used={isLoading ? '...' : data?.database?.conexionesActivas ?? '—'}
          total={data?.database?.maxConexiones}
          pct={data?.database?.porcentaje}
        />
        <UsageCard
          label="Consultas a IA hoy (todas)"
          icon={<Activity className="w-6 h-6" strokeWidth={1.5} />}
          used={isLoading ? '...' : data?.iaInteracciones.hoy ?? 0}
        />
        <UsageCard
          label="Redis (cache / rate limit)"
          icon={<Server className="w-6 h-6" strokeWidth={1.5} />}
          used={isLoading ? '...' : data?.redis ?? '—'}
        />
      </div>

      <div className="card" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        <p style={{ color: 'var(--color-text)', fontWeight: 600, marginBottom: '0.5rem' }}>Cómo leer esto</p>
        <ul style={{ paddingLeft: '1.25rem', listStyle: 'disc' }}>
          <li>
            <strong style={{ color: 'var(--color-text)' }}>Cuota Groq</strong>: el chat de IA usa Groq gratis primero;
            si llega al 100% del día, el sistema sigue funcionando pero cae a proveedores de respaldo (más lentos o pagos).
          </li>
          <li>
            <strong style={{ color: 'var(--color-text)' }}>Conexiones a la base de datos</strong>: si se acerca al máximo,
            las páginas empiezan a tardar o fallar al cargar datos.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text)' }}>Redis</strong>: si dice &quot;degradado&quot; o &quot;no configurado&quot;,
            el sistema sigue andando pero más lento (sin cache ni límites por usuario).
          </li>
        </ul>
        {dataUpdatedAt > 0 && (
          <p className="mt-3 text-xs">Última actualización: {new Date(dataUpdatedAt).toLocaleTimeString('es-AR')}</p>
        )}
      </div>
    </div>
  )
}
