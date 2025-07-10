"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UsersIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Stats {
  totalUsers: number
  totalModules: number
  totalLessons: number
  totalQuizzes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalModules: 0,
    totalLessons: 0,
    totalQuizzes: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se é admin
    const adminUser = localStorage.getItem('adminUser')
    if (!adminUser) {
      router.push('/admin/login')
      return
    }

    const user = JSON.parse(adminUser)
    if (!user.isAdmin) {
      router.push('/admin/login')
      return
    }

    // Carregar estatísticas
    loadStats()
  }, [router])

  const loadStats = async () => {
    try {
      const [usersRes, modulesRes, lessonsRes, quizzesRes] = await Promise.all([
        fetch('/api/admin/users/count'),
        fetch('/api/admin/modules/count'),
        fetch('/api/admin/lessons/count'),
        fetch('/api/admin/quizzes/count')
      ])

      const [usersData, modulesData, lessonsData, quizzesData] = await Promise.all([
        usersRes.json(),
        modulesRes.json(),
        lessonsRes.json(),
        quizzesRes.json()
      ])

      setStats({
        totalUsers: usersData.count || 0,
        totalModules: modulesData.count || 0,
        totalLessons: lessonsData.count || 0,
        totalQuizzes: quizzesData.count || 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const menuItems = [
    {
      title: 'Gerenciar Usuários',
      description: 'Visualizar e gerenciar usuários da plataforma',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Gerenciar Módulos',
      description: 'Criar e editar módulos de curso',
      icon: BookOpenIcon,
      href: '/admin/modules',
      color: 'bg-green-500'
    },
    {
      title: 'Gerenciar Aulas',
      description: 'Criar e editar aulas dos módulos',
      icon: EyeIcon,
      href: '/admin/lessons',
      color: 'bg-purple-500'
    },
    {
      title: 'Gerenciar Quiz',
      description: 'Criar e editar perguntas de quiz',
      icon: QuestionMarkCircleIcon,
      href: '/admin/quizzes',
      color: 'bg-orange-500'
    },
    {
      title: 'Estatísticas',
      description: 'Visualizar relatórios e métricas',
      icon: ChartBarIcon,
      href: '/admin/stats',
      color: 'bg-red-500'
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais da plataforma',
      icon: CogIcon,
      href: '/admin/settings',
      color: 'bg-gray-500'
    },
    {
      title: 'Sistema',
      description: 'Backups, logs e relatórios',
      icon: ChartBarIcon,
      href: '/admin/system',
      color: 'bg-indigo-500'
    }
  ]

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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                AIA Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => router.push('/admin/users')}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Total de Usuários
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => router.push('/admin/modules')}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <BookOpenIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Módulos
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.totalModules}
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => router.push('/admin/lessons')}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <EyeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Aulas
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.totalLessons}
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => router.push('/admin/quizzes')}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <QuestionMarkCircleIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Quiz
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.totalQuizzes}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {menuItems.map((item) => (
            <div
              key={item.title}
              onClick={() => router.push(item.href)}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6 border border-secondary-200 dark:border-secondary-700"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full ${item.color} bg-opacity-10`}>
                  <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-secondary-900 dark:text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4">
                {item.description}
              </p>
              <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                Acessar
                <ArrowRightOnRectangleIcon className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
          <div
            className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 cursor-pointer hover:ring-2 hover:ring-primary-500 transition"
            onClick={() => router.push('/admin/page-content')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="inline-block w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">LP</span>
              </span>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Editar Landing Page</h2>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm">Monte o layout e conteúdo da página inicial pública.</p>
          </div>
          <div
            className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6 cursor-pointer hover:ring-2 hover:ring-primary-500 transition"
            onClick={() => router.push('/admin/ai-logs')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="inline-block w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">IA</span>
              </span>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Logs de Uso da IA</h2>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm">Veja o histórico de uso da IA por todos os usuários.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 