'use client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Award, Download, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react'
import { certificateApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import type { Certificate } from '@/types'

export default function CertificadosPage() {
  const { user } = useAuth()

  const { data: certs = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['certificates', user?.id],
    queryFn: () => certificateApi.list(user!.id).then(r => r.data),
    enabled: !!user?.id
  })

  const handleDownload = async (cert: Certificate) => {
    try {
      const response = await certificateApi.download(cert.id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `certificado-${cert.serialNumber}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el certificado. Por favor intenta nuevamente.')
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      <section className="overflow-hidden">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
          Mis Certificados
        </h1>
        <p className="mt-4" style={{ color: 'var(--color-text-muted)' }}>
          {certs.length} certificado{certs.length !== 1 ? 's' : ''} obtenido{certs.length !== 1 ? 's' : ''}
        </p>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
          <Award className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-text)' }}>Aún no tienes certificados</h3>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Completa los módulos del curso para obtener tu certificado de completación verificable.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-xl p-8 transition-all"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(196,151,42,0.1)', border: '1px solid var(--color-gold-border)' }}
                >
                  <Award className="w-6 h-6" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{cert.courseName}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Emitido el {formatDate(cert.issueDate)}
                      </p>
                    </div>
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                      style={{
                        background: cert.status === 'ISSUED' ? 'rgba(196,151,42,0.1)' : 'rgba(239,68,68,0.1)',
                        color: cert.status === 'ISSUED' ? 'var(--color-gold)' : '#EF4444',
                        border: `1px solid ${cert.status === 'ISSUED' ? 'var(--color-gold-border)' : 'rgba(239,68,68,0.3)'}`
                      }}
                    >
                      {cert.status === 'ISSUED' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {cert.status === 'ISSUED' ? 'Válido' : 'Revocado'}
                    </span>
                  </div>

                  <p className="text-xs mb-6 font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    Serie: {cert.serialNumber}
                  </p>

                  <div className="flex items-center gap-4">
                    {cert.status === 'ISSUED' && (
                      <button
                        onClick={() => handleDownload(cert)}
                        className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all btn-primary"
                      >
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                        Descargar PDF
                      </button>
                    )}
                    <a
                      href={`/verificar/${cert.serialNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded text-sm transition-all"
                      style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)' }}
                    >
                      <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                      Verificar
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
