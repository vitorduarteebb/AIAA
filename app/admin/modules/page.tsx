"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface Module {
  id: string
  title: string
  description: string
  level: string
  order: number
  isActive: boolean
  createdAt: string
  lessons: any[]
}

interface Course {
  id: string
  name: string
}

export default function AdminModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'BASIC',
    order: 0,
    isActive: true,
    courseId: ''
  })
  const router = useRouter()

  useEffect(() => {
    loadModules()
    loadCourses()
  }, [])

  const loadModules = async () => {
    try {
      const response = await fetch('/api/admin/modules')
      const data = await response.json()
      setModules(data.modules || [])
    } catch (error) {
      console.error('Erro ao carregar módulos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch {
      setCourses([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingModule 
        ? `/api/admin/modules/${editingModule.id}`
        : '/api/admin/modules'
      
      const method = editingModule ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingModule(null)
        setFormData({
          title: '',
          description: '',
          level: 'BASIC',
          order: 0,
          isActive: true,
          courseId: ''
        })
        loadModules()
      }
    } catch (error) {
      console.error('Erro ao salvar módulo:', error)
    }
  }

  const handleEdit = (module: Module) => {
    setEditingModule(module)
    setFormData({
      title: module.title,
      description: module.description,
      level: module.level,
      order: module.order,
      isActive: module.isActive,
      courseId: (module as any).courseId || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return
    
    try {
      const response = await fetch(`/api/admin/modules/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadModules()
      }
    } catch (error) {
      console.error('Erro ao excluir módulo:', error)
    }
  }

  const handleViewLessons = (moduleId: string) => {
    router.push(`/admin/modules/${moduleId}/lessons`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Voltar</span>
              </button>
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Gerenciar Módulos
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Novo Módulo</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                {editingModule ? 'Editar Módulo' : 'Novo Módulo'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="input w-full"
                    placeholder="Título do módulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={3}
                    className="input w-full"
                    placeholder="Descrição do módulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Nível
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="input w-full"
                  >
                    <option value="BASIC">Básico</option>
                    <option value="INTERMEDIATE">Intermediário</option>
                    <option value="ADVANCED">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="input w-full"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Curso
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                    required
                    className="input w-full"
                  >
                    <option value="">Selecione o curso</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    Ativo
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingModule ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingModule(null)
                      setFormData({
                        title: '',
                        description: '',
                        level: 'BASIC',
                        order: 0,
                        isActive: true,
                        courseId: ''
                      })
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modules List */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
              Módulos ({modules.length})
            </h3>
          </div>
          
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {modules.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-secondary-500 dark:text-secondary-400">
                  Nenhum módulo encontrado. Crie o primeiro módulo!
                </p>
              </div>
            ) : (
              modules.map((module) => (
                <div key={module.id} className="px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-secondary-900 dark:text-white">
                          {module.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          module.level === 'BASIC' ? 'bg-green-100 text-green-800' :
                          module.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {module.level}
                        </span>
                        {!module.isActive && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                        {module.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                        <span>Ordem: {module.order}</span>
                        <span>Aulas: {module.lessons?.length || 0}</span>
                        <span>Criado em: {new Date(module.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewLessons(module.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Ver aulas"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(module)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(module.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Excluir"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 