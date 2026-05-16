'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Plus, Pencil, Trash2, X, Loader2, GripVertical, Lock, Globe } from 'lucide-react'
import { adminCourseApi } from '@/lib/api'

interface Course {
  id: string
  title: string
  description: string
  content: string
  type: 'FREE' | 'PAID'
  order: number
}

const empty: Omit<Course, 'id' | 'order'> = { title: '', description: '', content: '', type: 'FREE' }

export default function CursosPage() {
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-400" />
            Cursos
          </h1>
          <p className="text-gray-400 mt-1">Gestiona el contenido del curso para tus alumnos</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva lección
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{courses.length}</p>
          <p className="text-gray-400 text-sm mt-1">Lecciones totales</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{courses.filter(c => c.type === 'FREE').length}</p>
          <p className="text-gray-400 text-sm mt-1">Lecciones gratuitas</p>
        </div>
      </div>

      {/* Course list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 border-dashed rounded-2xl">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Sin lecciones aún</p>
          <p className="text-gray-500 text-sm mt-1">Crea tu primera lección para que los alumnos puedan estudiar</p>
          <button onClick={openNew} className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
            + Crear primera lección
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-2 pt-0.5">
                <GripVertical className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm font-mono w-5 text-center">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium truncate">{course.title}</h3>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                    course.type === 'FREE'
                      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                      : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  }`}>
                    {course.type === 'FREE' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {course.type === 'FREE' ? 'Gratis' : 'De pago'}
                  </span>
                </div>
                {course.description && (
                  <p className="text-gray-400 text-sm line-clamp-1">{course.description}</p>
                )}
                <p className="text-gray-600 text-xs mt-1 line-clamp-1">{course.content.substring(0, 100)}...</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(course)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(course.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modal.open && modal.course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#1a2234] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-semibold text-lg">
                {modal.course.id ? 'Editar lección' : 'Nueva lección'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
                <input
                  value={modal.course.title || ''}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Ej: Introducción al curso"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción corta</label>
                <input
                  value={modal.course.description || ''}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Resumen de esta lección"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                <div className="flex gap-3">
                  {(['FREE', 'PAID'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => set('type', t)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        modal.course?.type === t
                          ? t === 'FREE'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'border-white/20 text-gray-400 hover:border-white/40'
                      }`}
                    >
                      {t === 'FREE' ? <><Globe className="w-4 h-4" /> Gratuita</> : <><Lock className="w-4 h-4" /> De pago</>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contenido *</label>
                <textarea
                  value={modal.course.content || ''}
                  onChange={e => set('content', e.target.value)}
                  rows={10}
                  placeholder="Escribe el contenido completo de la lección aquí. Puedes usar Markdown."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : 'Guardar lección'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#1a2234] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">¿Eliminar lección?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-gray-400 hover:text-white transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-all text-sm font-medium"
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
