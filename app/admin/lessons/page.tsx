"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Module {
  id: string
  title: string
}

interface Lesson {
  id: string
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  codeExample?: string
  moduleId: string
  module: Module
  order: number
  createdAt: string
}

export default function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    moduleId: '',
    order: 1,
    imageUrl: '',
    videoUrl: '',
    codeExample: ''
  })
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [lessonsResponse, modulesResponse] = await Promise.all([
        fetch('/api/admin/lessons'),
        fetch('/api/admin/modules')
      ])
      
      const lessonsData = await lessonsResponse.json()
      const modulesData = await modulesResponse.json()
      
      setLessons(lessonsData.lessons || [])
      setModules(modulesData.modules || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLesson 
        ? `/api/admin/lessons/${editingLesson.id}`
        : '/api/admin/lessons'
      
      const method = editingLesson ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingLesson(null)
        setFormData({
          title: '',
          content: '',
          moduleId: '',
          order: 1,
          imageUrl: '',
          videoUrl: '',
          codeExample: ''
        })
        loadData()
      }
    } catch (error) {
      console.error('Erro ao salvar aula:', error)
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      content: lesson.content,
      moduleId: lesson.moduleId,
      order: lesson.order,
      imageUrl: lesson.imageUrl || '',
      videoUrl: lesson.videoUrl || '',
      codeExample: lesson.codeExample || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return
    
    try {
      const response = await fetch(`/api/admin/lessons/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Erro ao excluir aula:', error)
    }
  }

  const handleDuplicate = async (lesson: Lesson) => {
    try {
      const duplicateData = {
        title: `${lesson.title} (Cópia)`,
        content: lesson.content,
        moduleId: lesson.moduleId,
        order: lesson.order + 1,
        imageUrl: lesson.imageUrl,
        videoUrl: lesson.videoUrl,
        codeExample: lesson.codeExample
      }
      
      const response = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Erro ao duplicar aula:', error)
    }
  }

  const handlePreview = (lesson: Lesson) => {
    // Abrir preview em nova aba
    window.open(`/lessons/${lesson.id}`, '_blank')
  }

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.module.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                Gerenciar Aulas
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Nova Aula</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Buscar aulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full pl-10"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                {editingLesson ? 'Editar Aula' : 'Nova Aula'}
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
                    placeholder="Título da aula"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Módulo
                  </label>
                  <select
                    value={formData.moduleId}
                    onChange={(e) => setFormData({...formData, moduleId: e.target.value})}
                    required
                    className="input w-full"
                  >
                    <option value="">Selecione um módulo</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
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
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Conteúdo
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                    rows={8}
                    className="input w-full"
                    placeholder="Conteúdo da aula..."
                  />
                </div>

                {/* Campos Opcionais */}
                <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                    Campos Opcionais
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="input w-full"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                      <p className="text-xs text-secondary-500 mt-1">
                        URL de uma imagem para ilustrar a aula
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        URL do Vídeo
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                        className="input w-full"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-secondary-500 mt-1">
                        URL de um vídeo explicativo (YouTube, Vimeo, etc.)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Código de Exemplo
                      </label>
                      <textarea
                        value={formData.codeExample}
                        onChange={(e) => setFormData({...formData, codeExample: e.target.value})}
                        rows={6}
                        className="input w-full font-mono text-sm"
                        placeholder="// Seu código de exemplo aqui..."
                      />
                      <p className="text-xs text-secondary-500 mt-1">
                        Código de exemplo para demonstrar conceitos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingLesson ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingLesson(null)
                      setFormData({
                        title: '',
                        content: '',
                        moduleId: '',
                        order: 1,
                        imageUrl: '',
                        videoUrl: '',
                        codeExample: ''
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

        {/* Lessons List */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
              Aulas ({filteredLessons.length})
            </h3>
          </div>
          
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {filteredLessons.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <BookOpenIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-500 dark:text-secondary-400">
                  {searchTerm ? 'Nenhuma aula encontrada.' : 'Nenhuma aula cadastrada.'}
                </p>
              </div>
            ) : (
              filteredLessons.map((lesson) => (
                <div key={lesson.id} className="px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                          #{lesson.order}
                        </span>
                        <h4 className="text-lg font-medium text-secondary-900 dark:text-white">
                          {lesson.title}
                        </h4>
                      </div>
                      <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                        Módulo: {lesson.module.title}
                      </p>
                      <p className="text-secondary-500 dark:text-secondary-400 mt-2 text-sm line-clamp-2">
                        {lesson.content.substring(0, 150)}...
                      </p>
                      
                      {/* Indicadores de mídia */}
                      <div className="flex items-center space-x-4 mt-2">
                        {lesson.imageUrl && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            📷 Imagem
                          </span>
                        )}
                        {lesson.videoUrl && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            🎥 Vídeo
                          </span>
                        )}
                        {lesson.codeExample && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            💻 Código
                          </span>
                        )}
                      </div>
                      
                      <p className="text-secondary-500 dark:text-secondary-400 mt-2 text-xs">
                        Criado em: {new Date(lesson.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(lesson)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Visualizar"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(lesson)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Duplicar"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
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