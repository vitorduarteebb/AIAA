"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

interface Quiz {
  id: string
  question: string
  options: string
  correctAnswer: number
  lessonId: string
  order: number
  points: number
  isActive: boolean
  createdAt: string
  lesson?: {
    title: string
    module?: {
      title: string
    }
  }
}

interface Lesson {
  id: string
  title: string
  module?: {
    title: string
  }
}

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    lessonId: '',
    order: 0,
    points: 10,
    isActive: true
  })
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [quizzesRes, lessonsRes] = await Promise.all([
        fetch('/api/admin/quizzes'),
        fetch('/api/admin/lessons')
      ])
      
      const [quizzesData, lessonsData] = await Promise.all([
        quizzesRes.json(),
        lessonsRes.json()
      ])
      
      setQuizzes(quizzesData.quizzes || [])
      setLessons(lessonsData.lessons || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingQuiz 
        ? `/api/admin/quizzes/${editingQuiz.id}`
        : '/api/admin/quizzes'
      
      const method = editingQuiz ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          options: JSON.stringify(formData.options)
        })
      })

      if (response.ok) {
        setShowForm(false)
        setEditingQuiz(null)
        setFormData({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          lessonId: '',
          order: 0,
          points: 10,
          isActive: true
        })
        loadData()
      }
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
    }
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setFormData({
      question: quiz.question,
      options: JSON.parse(quiz.options),
      correctAnswer: quiz.correctAnswer,
      lessonId: quiz.lessonId,
      order: quiz.order,
      points: quiz.points,
      isActive: quiz.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return
    
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Erro ao excluir quiz:', error)
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({...formData, options: newOptions})
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
                Gerenciar Quiz
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Nova Pergunta</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                {editingQuiz ? 'Editar Pergunta' : 'Nova Pergunta'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Pergunta
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    required
                    rows={3}
                    className="input w-full"
                    placeholder="Digite a pergunta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Aula
                  </label>
                  <select
                    value={formData.lessonId}
                    onChange={(e) => setFormData({...formData, lessonId: e.target.value})}
                    required
                    className="input w-full"
                  >
                    <option value="">Selecione uma aula</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.module?.title} - {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Opções
                  </label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={index}
                        checked={formData.correctAnswer === index}
                        onChange={(e) => setFormData({...formData, correctAnswer: parseInt(e.target.value)})}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        required
                        className="input flex-1"
                        placeholder={`Opção ${index + 1}`}
                      />
                    </div>
                  ))}
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
                    Pontos por Pergunta
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                    className="input w-full"
                    placeholder="10"
                    min="1"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Pontos que o usuário ganha ao acertar esta pergunta
                  </p>
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
                    {editingQuiz ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingQuiz(null)
                      setFormData({
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: 0,
                        lessonId: '',
                        order: 0,
                        points: 10,
                        isActive: true
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

        {/* Quizzes List */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
              Perguntas ({quizzes.length})
            </h3>
          </div>
          
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {quizzes.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-secondary-500 dark:text-secondary-400">
                  Nenhuma pergunta encontrada. Crie a primeira pergunta!
                </p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-secondary-900 dark:text-white">
                          {quiz.question}
                        </h4>
                        {!quiz.isActive && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            Inativo
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                        <div className="flex items-center space-x-2">
                          <BookOpenIcon className="h-4 w-4" />
                          <span>
                            {quiz.lesson?.module?.title} - {quiz.lesson?.title}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {JSON.parse(quiz.options).map((option: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                              index === quiz.correctAnswer 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </span>
                            <span className={index === quiz.correctAnswer ? 'font-medium text-green-700' : 'text-secondary-600'}>
                              {option}
                            </span>
                            {index === quiz.correctAnswer && (
                              <span className="text-xs text-green-600 font-medium">✓ Correta</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                        <span>Ordem: {quiz.order}</span>
                        <span>Pontos: {quiz.points}</span>
                        <span>Criado em: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
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