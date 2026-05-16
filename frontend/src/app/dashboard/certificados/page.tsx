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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-emerald-400" />
          Mis Certificados
        </h1>
        <p className="text-gray-400 mt-1">
          {certs.length} certificado{certs.length !== 1 ? 's' : ''} obtenido{certs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Aún no tienes certificados</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Completa los módulos del curso para obtener tu certificado de completación verificable.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-white font-semibold">{cert.courseName}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Emitido el {formatDate(cert.issueDate)}
                      </p>
                    </div>

                    {/* Status */}
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      cert.status === 'ISSUED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {cert.status === 'ISSUED'
                        ? <CheckCircle className="w-3 h-3" />
                        : <XCircle className="w-3 h-3" />}
                      {cert.status === 'ISSUED' ? 'Válido' : 'Revocado'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs mt-2 font-mono">
                    Serie: {cert.serialNumber}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4">
                    {cert.status === 'ISSUED' && (
                      <button
                        onClick={() => handleDownload(cert)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Descargar PDF
                      </button>
                    )}
                    <a
                      href={`/verificar/${cert.serialNumber}`}
                      target="_blank"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
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
