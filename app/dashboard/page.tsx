'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  HomeIcon,
  AcademicCapIcon,
  TrophyIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/components/providers/AuthProvider'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import AIChat from '@/components/AIChat'
import Leaderboard from '@/components/Leaderboard'

interface Module {
  id: string
  title: string
  description: string
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
  order: number
  completed: boolean
  progress: number
  isLocked: boolean
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregamento real dos módulos deve ser implementado aqui
    setModules([])
    setLoading(false)
  }, [user?.isPremium])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BASIC': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'ADVANCED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BASIC': return 'Básico'
      case 'INTERMEDIATE': return 'Intermediário'
      case 'ADVANCED': return 'Avançado'
      default: return level
    }
  }

  const completedModules = modules.filter(m => m.completed).length
  const totalProgress = modules.reduce((acc, m) => acc + m.progress, 0) / modules.length

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-secondary-600 dark:text-secondary-300">
                Bem-vindo de volta, {user?.name}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-secondary-600 dark:text-secondary-300">Pontos</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {user?.points || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-600 dark:text-secondary-300">Nível</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {user?.level || 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-4" />
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Progresso Geral</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {Math.round(totalProgress)}%
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400 mr-4" />
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Módulos Concluídos</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {completedModules}/30
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <TrophyIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-4" />
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Ranking</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    #{Math.floor(Math.random() * 1000) + 1}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                Seus Módulos
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300">
                Continue de onde parou ou comece um novo módulo
              </p>
            </div>
            <Link 
              href="/modules"
              className="btn-primary flex items-center space-x-2"
            >
              <AcademicCapIcon className="w-5 h-5" />
              <span>Ver Todos</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`card p-6 relative ${module.isLocked ? 'opacity-60' : ''}`}
              >
                {module.isLocked && (
                  <div className="absolute inset-0 bg-secondary-900/20 dark:bg-secondary-900/40 rounded-lg flex items-center justify-center">
                    <LockClosedIcon className="w-8 h-8 text-secondary-400" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-2">
                      {module.description}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(module.level)}`}>
                      {getLevelText(module.level)}
                    </span>
                  </div>
                  {module.completed && (
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 ml-2" />
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-300 mb-1">
                    <span>Progresso</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                {!module.isLocked ? (
                  <Link 
                    href={`/modules/${module.id}`}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    {module.completed ? 'Revisar' : 'Fazer Aula'}
                  </Link>
                ) : (
                  <Link 
                    href="/premium"
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    Upgrade Premium
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI & Community Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              IA & Comunidade
            </h2>
            <p className="text-secondary-600 dark:text-secondary-300">
              Conecte-se com a IA e veja o ranking global
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Chat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="h-96"
            >
              <AIChat />
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Leaderboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
} 