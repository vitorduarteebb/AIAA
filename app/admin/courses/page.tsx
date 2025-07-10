"use client"

import { useState, useEffect } from 'react'

interface Course {
  id: string
  name: string
  description: string
  coverImage?: string
  level?: string
  category?: string
  isActive: boolean
  createdAt: string
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    level: '',
    category: '',
    isActive: true
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        setShowForm(false)
        setFormData({ name: '', description: '', coverImage: '', level: '', category: '', isActive: true })
        loadCourses()
        setMessage('Curso criado com sucesso!')
      } else {
        setMessage(data.error || 'Erro ao criar curso')
      }
    } catch {
      setMessage('Erro ao criar curso')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Cursos</h1>
      <button
        className="mb-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        onClick={() => setShowForm(true)}
      >
        + Novo Curso
      </button>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow mb-8 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Novo Curso</h2>
          <div>
            <label className="block mb-1">Nome *</label>
            <input type="text" className="input w-full" required value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1">Descrição *</label>
            <textarea className="input w-full" required value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1">Imagem de capa (URL)</label>
            <input type="text" className="input w-full" value={formData.coverImage} onChange={e => setFormData(f => ({ ...f, coverImage: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1">Nível</label>
            <select className="input w-full" value={formData.level} onChange={e => setFormData(f => ({ ...f, level: e.target.value }))}>
              <option value="">Selecione</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediário">Intermediário</option>
              <option value="avançado">Avançado</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Categoria</label>
            <input type="text" className="input w-full" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(f => ({ ...f, isActive: e.target.checked }))} />
            <label>Ativo</label>
          </div>
          <div className="flex space-x-2 mt-4">
            <button type="submit" className="btn-primary">Salvar</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Cursos Cadastrados</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : courses.length === 0 ? (
          <div>Nenhum curso cadastrado.</div>
        ) : (
          <ul className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {courses.map(course => (
              <li key={course.id} className="py-4 flex items-center space-x-4">
                {course.coverImage && <img src={course.coverImage} alt="Capa" className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-bold">{course.name}</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-300">{course.description}</div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    {course.level && <span className="mr-2">Nível: {course.level}</span>}
                    {course.category && <span>Categoria: {course.category}</span>}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{course.isActive ? 'Ativo' : 'Inativo'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 