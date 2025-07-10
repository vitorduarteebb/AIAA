'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon
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
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  order: number
}

export default function ModulesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await fetch('/api/modules')
        if (response.ok) {
          const data = await response.json()
          setModules(data.modules || [])
        }
      } catch (error) {
        console.error('Erro ao carregar módulos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

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

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Módulos de Aprendizado
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                <UserIcon className="w-4 h-4 mr-1" />
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {modules.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              Nenhum módulo disponível
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Aguarde enquanto preparamos conteúdo para você.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/modules/${module.id}`)}
              >
                {module.coverImage && (
                  <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 rounded-t-lg overflow-hidden">
                    <img 
                      src={module.coverImage} 
                      alt={module.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(module.level)}`}>
                      {getLevelText(module.level)}
                    </span>
                    <span className="text-sm text-secondary-500">
                      #{module.order}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <div className="flex items-center">
                        <BookOpenIcon className="w-4 h-4 mr-1" />
                        {module.lessons.length} aulas
                      </div>
                      {module.duration && (
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {module.duration}
                        </div>
                      )}
                    </div>
                    
                    <ArrowRightIcon className="w-5 h-5 text-secondary-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
} 