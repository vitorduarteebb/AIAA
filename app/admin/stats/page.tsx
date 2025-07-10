"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  UsersIcon,
  BookOpenIcon,
  EyeIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

interface Stats {
  totalUsers: number
  totalModules: number
  totalLessons: number
  totalQuizzes: number
  activeUsers: number
  completedLessons: number
  averageScore: number
}

interface ChartData {
  name: string
  value: number
  users?: number
  lessons?: number
  quizzes?: number
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalModules: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    activeUsers: 0,
    completedLessons: 0,
    averageScore: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Dados simulados para os gráficos
  const userActivityData = [
    { name: 'Seg', users: 12, lessons: 8, quizzes: 5 },
    { name: 'Ter', users: 18, lessons: 15, quizzes: 12 },
    { name: 'Qua', users: 22, lessons: 20, quizzes: 18 },
    { name: 'Qui', users: 25, lessons: 24, quizzes: 22 },
    { name: 'Sex', users: 28, lessons: 26, quizzes: 25 },
    { name: 'Sáb', users: 20, lessons: 18, quizzes: 16 },
    { name: 'Dom', users: 15, lessons: 12, quizzes: 10 }
  ]

  const moduleProgressData = [
    { name: 'JavaScript', progress: 85, students: 25 },
    { name: 'React', progress: 72, students: 20 },
    { name: 'Node.js', progress: 68, students: 18 },
    { name: 'Python', progress: 90, students: 30 },
    { name: 'SQL', progress: 78, students: 22 }
  ]

  const userDistributionData = [
    { name: 'Ativos', value: 18, color: '#10B981' },
    { name: 'Inativos', value: 7, color: '#EF4444' }
  ]

  const scoreDistributionData = [
    { name: '90-100%', value: 8, color: '#10B981' },
    { name: '80-89%', value: 12, color: '#3B82F6' },
    { name: '70-79%', value: 15, color: '#F59E0B' },
    { name: '60-69%', value: 10, color: '#F97316' },
    { name: '<60%', value: 5, color: '#EF4444' }
  ]

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Por enquanto, vamos usar dados simulados
      // Em uma implementação real, você buscaria dados reais das APIs
      setStats({
        totalUsers: 25,
        totalModules: 8,
        totalLessons: 32,
        totalQuizzes: 16,
        activeUsers: 18,
        completedLessons: 156,
        averageScore: 78.5
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
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
                Estatísticas
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Usuários Ativos
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.activeUsers}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  de {stats.totalUsers} total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <BookOpenIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Aulas Concluídas
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.completedLessons}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  de {stats.totalLessons} total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Média de Pontuação
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {stats.averageScore}%
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  nos quizzes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <CalendarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Taxa de Engajamento
                </p>
                <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  usuários ativos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Chart */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Atividade Semanal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Usuários"
                />
                <Area 
                  type="monotone" 
                  dataKey="lessons" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Aulas"
                />
                <Area 
                  type="monotone" 
                  dataKey="quizzes" 
                  stackId="1" 
                  stroke="#F59E0B" 
                  fill="#F59E0B" 
                  fillOpacity={0.6}
                  name="Quizzes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Chart */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Progresso dos Módulos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#8B5CF6" name="Progresso (%)" />
                <Bar dataKey="students" fill="#F59E0B" name="Estudantes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Distribution */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Distribuição de Usuários
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Score Distribution */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Distribuição de Pontuações
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="mt-8 bg-white dark:bg-secondary-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Estatísticas Detalhadas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stats.totalModules}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Módulos Criados
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stats.totalLessons}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Aulas Disponíveis
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stats.totalQuizzes}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Quizzes Criados
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-secondary-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Atividade Recente
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Novo usuário registrado - João Silva
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-auto">
                  há 2 horas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Aula "Introdução ao JavaScript" foi concluída por 5 usuários
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-auto">
                  há 4 horas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Quiz "Fundamentos de React" foi criado
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-auto">
                  há 6 horas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Módulo "Desenvolvimento Web" foi atualizado
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-auto">
                  há 1 dia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 