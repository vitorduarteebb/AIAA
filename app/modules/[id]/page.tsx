'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/components/providers/AuthProvider'
import BottomNavigation from '@/components/navigation/BottomNavigation'

interface Module {
  id: string
  title: string
  description: string
  level: string
  order: number
  coverImage?: string
  duration?: string
}

interface Lesson {
  id: string
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  codeExample?: string
  order: number
  moduleId: string
  module: {
    id: string
    title: string
  }
  quizzes: Quiz[]
}

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [module, setModule] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadModuleData = async () => {
      try {
        // Carregar dados do módulo
        const moduleResponse = await fetch(`/api/modules/${params.id}`)
        if (moduleResponse.ok) {
          const moduleData = await moduleResponse.json()
          setModule(moduleData.module)
        }

        // Carregar lições do módulo
        const lessonsResponse = await fetch(`/api/lessons?moduleId=${params.id}`)
        if (lessonsResponse.ok) {
          const lessonsData = await lessonsResponse.json()
          setLessons(lessonsData.lessons || [])
        }
      } catch (error) {
        console.error('Erro ao carregar dados do módulo:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModuleData()
  }, [params.id])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BASIC':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BASIC':
        return 'Iniciante'
      case 'INTERMEDIATE':
        return 'Intermediário'
      case 'ADVANCED':
        return 'Avançado'
      default:
        return level
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Módulo não encontrado
          </h2>
          <button 
            onClick={() => router.push('/modules')}
            className="btn-primary"
          >
            Voltar aos Módulos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/modules')}
                className="flex items-center text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {module.title}
              </h1>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${getLevelColor(module.level)}`}>
              {getLevelText(module.level)}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações do módulo */}
        <div className="card p-6 mb-8">
          {module.coverImage && (
            <img 
              src={module.coverImage} 
              alt={module.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-3">
            {module.title}
          </h2>
          
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            {module.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-secondary-500">
            <div className="flex items-center">
              <BookOpenIcon className="w-4 h-4 mr-1" />
              {lessons.length} aulas
            </div>
            {module.duration && (
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {module.duration}
              </div>
            )}
          </div>
        </div>

        {/* Lista de lições */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Aulas do Módulo
          </h3>
          
          {lessons.length === 0 ? (
            <div className="card p-8 text-center">
              <BookOpenIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600 dark:text-secondary-400">
                Nenhuma aula disponível neste módulo.
              </p>
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/lessons/${lesson.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                      Aula #{lesson.order}
                    </span>
                    <ArrowRightIcon className="w-5 h-5 text-secondary-400" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    {lesson.title}
                  </h4>
                  
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-2">
                    {lesson.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  
                  {/* Indicadores de mídia */}
                  <div className="flex items-center space-x-4">
                    {lesson.imageUrl && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <PhotoIcon className="w-3 h-3 mr-1" />
                        Imagem
                      </span>
                    )}
                    {lesson.videoUrl && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        <VideoCameraIcon className="w-3 h-3 mr-1" />
                        Vídeo
                      </span>
                    )}
                    {lesson.codeExample && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <CodeBracketIcon className="w-3 h-3 mr-1" />
                        Código
                      </span>
                    )}
                    {lesson.quizzes.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        <PlayIcon className="w-3 h-3 mr-1" />
                        Quiz ({lesson.quizzes.length})
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
} 