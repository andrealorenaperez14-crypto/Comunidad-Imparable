'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Plus, Pencil, Trash2, X, Loader2, GripVertical, Lock, Globe } from 'lucide-react'
import { adminCourseApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface Course {
  id: string
  title: string
  description: string
  content: string
  videoUrl?: string
  pdfUrl?: string
  type: 'FREE' | 'PAID'
  order: number
}

const empty: Omit<Course, 'id' | 'order'> = { title: '', description: '', content: '', videoUrl: '', pdfUrl: '', type: 'FREE' }

const inputClass = 'w-full rounded-xl px-4 py-3 focus:outline-none transition-all placeholder-shown:text-[var(--color-text-muted)]'
const inputStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-separator)',
  color: 'var(--color-text)'
}

export default function CursosPage() {
  const { isAdmin } = useAuth()
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ open: boolean; course: Partial<Course> | null }>({ open: false, course: null })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    queryFn: () => adminCourseApi.list().then(r => r.data)
  })

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Course>) =>
      data.id ? adminCourseApi.update(data.id, data) : adminCourseApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-courses'] }); closeModal() },
    onError: (e: any) => setError(e.response?.data?.error || 'Error al guardar')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCourseApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-courses'] }); setDeleteId(null) }
  })

  const openNew = () => { setError(''); setModal({ open: true, course: { ...empty } }) }
  const openEdit = (c: Course) => { setError(''); setModal({ open: true, course: { ...c } }) }
  const closeModal = () => setModal({ open: false, course: null })

  const handleSave = () => {
    if (!modal.course?.title?.trim()) return setError('El título es requerido')
    if (!modal.course?.content?.trim()) return setError('El contenido es requerido')
    setError('')
    saveMutation.mutate(modal.course)
  }

  const set = (field: string, value: string) =>
    setModal(m => ({ ...m, course: { ...m.course, [field]: value } }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <BookOpen className="w-7 h-7" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
            Cursos
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Gestiona el contenido del curso para tus alumnos</p>
        </div>
        {isAdmin && (
          <button
            onClick={openNew}
            className="btn-primary flex items-center gap-2"
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nueva lección
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{courses.length}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Lecciones totales</p>
        </div>
        <div className="card text-center" style={{ borderColor: 'var(--color-gold-border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>{courses.filter(c => c.type === 'FREE').length}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Lecciones gratuitas</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : courses.length === 0 ? (
        <div className="card text-center" style={{ border: '2px dashed var(--color-separator)' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
          <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Sin lecciones aún</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Crea tu primera lección para que los alumnos puedan estudiar</p>
          {isAdmin && (
            <button onClick={openNew} className="mt-4 text-sm font-medium" style={{ color: 'var(--color-gold)' }}>
              + Crear primera lección
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-all group"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}
            >
              <div className="flex items-center gap-2 pt-0.5">
                <GripVertical className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
                <span className="text-sm font-mono w-5 text-center" style={{ color: 'var(--color-text-muted)' }}>{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{course.title}</h3>
                  <span
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={course.type === 'FREE'
                      ? { color: 'var(--color-gold)', border: '1px solid var(--color-gold-border)', background: 'rgba(196,151,42,0.08)' }
                      : { color: 'var(--color-text-muted)', border: '1px solid var(--color-separator)', background: 'var(--color-bg)' }
                    }
                  >
                    {course.type === 'FREE' ? <Globe className="w-3 h-3" strokeWidth={1.5} /> : <Lock className="w-3 h-3" strokeWidth={1.5} />}
                    {course.type === 'FREE' ? 'Gratis' : 'De pago'}
                  </span>
                </div>
                {course.description && (
                  <p className="text-sm line-clamp-1" style={{ color: 'var(--color-text-muted)' }}>{course.description}</p>
                )}
                <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>{course.content.substring(0, 100)}...</p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(course)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: 'var(--color-text-muted)' }}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setDeleteId(course.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: 'var(--color-text-muted)' }}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal.open && modal.course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-separator)' }}>
              <h2 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                {modal.course.id ? 'Editar lección' : 'Nueva lección'}
              </h2>
              <button onClick={closeModal} className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {error && (
                <div
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}
                >
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Título *</label>
                <input
                  value={modal.course.title || ''}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Ej: Introducción al curso"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Descripción corta</label>
                <input
                  value={modal.course.description || ''}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Resumen de esta lección"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Tipo</label>
                <div className="flex gap-3">
                  {(['FREE', 'PAID'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('type', t)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={modal.course?.type === t
                        ? { background: 'rgba(196,151,42,0.15)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }
                        : { background: 'transparent', border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }
                      }
                    >
                      {t === 'FREE'
                        ? <><Globe className="w-4 h-4" strokeWidth={1.5} /> Gratuita</>
                        : <><Lock className="w-4 h-4" strokeWidth={1.5} /> De pago</>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>URL de video (YouTube)</label>
                <input
                  value={modal.course.videoUrl || ''}
                  onChange={e => set('videoUrl', e.target.value)}
                  placeholder="https://youtu.be/... o https://www.youtube.com/watch?v=..."
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>URL del PDF descargable</label>
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>Subí el PDF a Google Drive → "Compartir" → "Cualquiera con el enlace" → pegá el link acá. Solo lo ven los alumnos con plan de pago.</p>
                <input
                  value={(modal.course as any).pdfUrl || ''}
                  onChange={e => set('pdfUrl', e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Contenido *</label>
                <textarea
                  value={modal.course.content || ''}
                  onChange={e => set('content', e.target.value)}
                  rows={10}
                  placeholder="Escribe el contenido completo de la lección aquí. Puedes usar Markdown."
                  className="w-full rounded-xl px-4 py-3 focus:outline-none resize-none font-mono text-sm transition-all"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-separator)'}
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--color-separator)' }}>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                style={{ background: 'var(--color-gold)', color: '#0C0C0C' }}
              >
                {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : 'Guardar lección'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div
            className="w-full max-w-sm p-6 text-center rounded-2xl"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-gold-border)' }}
          >
            <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#F87171' }} strokeWidth={1.5} />
            <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>¿Eliminar lección?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                style={{ border: '1px solid var(--color-separator)', color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
