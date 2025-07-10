"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useNotification } from '@/components/NotificationSystem'

interface BackupInfo {
  filename: string
  timestamp: string
  version: string
  size: number
  users: number
  modules: number
  lessons: number
  quizzes: number
}

interface LogEntry {
  timestamp: string
  level: string
  category: string
  message: string
  userId?: string
  action?: string
}

export default function AdminSystem() {
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'backups' | 'logs' | 'reports'>('backups')
  const router = useRouter()
  const notification = useNotification()

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'backups') {
        const response = await fetch('/api/admin/backup')
        const data = await response.json()
        setBackups(data.backups || [])
      } else if (activeTab === 'logs') {
        const response = await fetch('/api/admin/logs?limit=50')
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      notification.error('Erro', 'Erro ao carregar dados do sistema')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST'
      })
      
      if (response.ok) {
        notification.success('Sucesso', 'Backup criado com sucesso!')
        loadData()
      } else {
        notification.error('Erro', 'Erro ao criar backup')
      }
    } catch (error) {
      notification.error('Erro', 'Erro ao criar backup')
    }
  }

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm('Tem certeza que deseja restaurar este backup? Isso substituirá todos os dados atuais.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/backup/${filename}/restore`, {
        method: 'POST'
      })
      
      if (response.ok) {
        notification.success('Sucesso', 'Backup restaurado com sucesso!')
      } else {
        notification.error('Erro', 'Erro ao restaurar backup')
      }
    } catch (error) {
      notification.error('Erro', 'Erro ao restaurar backup')
    }
  }

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm('Tem certeza que deseja excluir este backup?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/backup/${filename}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        notification.success('Sucesso', 'Backup excluído com sucesso!')
        loadData()
      } else {
        notification.error('Erro', 'Erro ao excluir backup')
      }
    } catch (error) {
      notification.error('Erro', 'Erro ao excluir backup')
    }
  }

  const handleGenerateReport = async (type: string) => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio-${type}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        notification.success('Sucesso', 'Relatório gerado e baixado com sucesso!')
      } else {
        notification.error('Erro', 'Erro ao gerar relatório')
      }
    } catch (error) {
      notification.error('Erro', 'Erro ao gerar relatório')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-100'
      case 'WARN': return 'text-yellow-600 bg-yellow-100'
      case 'INFO': return 'text-blue-600 bg-blue-100'
      case 'DEBUG': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
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
                Gerenciamento do Sistema
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('backups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'backups'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              Backups
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              Relatórios
            </button>
          </nav>
        </div>

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                Backups do Sistema
              </h2>
              <button
                onClick={handleCreateBackup}
                className="btn-primary flex items-center space-x-2"
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                <span>Criar Backup</span>
              </button>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow">
              {backups.length === 0 ? (
                <div className="p-8 text-center">
                  <CloudArrowUpIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-500 dark:text-secondary-400">
                    Nenhum backup encontrado.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {backups.map((backup) => (
                    <div key={backup.filename} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                            {backup.filename}
                          </h3>
                          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                            Criado em: {new Date(backup.timestamp).toLocaleString('pt-BR')}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                            <span>Tamanho: {formatFileSize(backup.size)}</span>
                            <span>Usuários: {backup.users}</span>
                            <span>Módulos: {backup.modules}</span>
                            <span>Aulas: {backup.lessons}</span>
                            <span>Quizzes: {backup.quizzes}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRestoreBackup(backup.filename)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Restaurar"
                          >
                            <CloudArrowDownIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBackup(backup.filename)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Excluir"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                Logs do Sistema
              </h2>
              <button
                onClick={loadData}
                className="btn-secondary flex items-center space-x-2"
              >
                <ClockIcon className="h-5 w-5" />
                <span>Atualizar</span>
              </button>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow">
              {logs.length === 0 ? (
                <div className="p-8 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-500 dark:text-secondary-400">
                    Nenhum log encontrado.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {logs.map((log, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-900 dark:text-white">
                            {log.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                            <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                            <span>Categoria: {log.category}</span>
                            {log.userId && <span>Usuário: {log.userId}</span>}
                            {log.action && <span>Ação: {log.action}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
              Relatórios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                    Relatório de Usuários
                  </h3>
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Lista completa de usuários com informações detalhadas.
                </p>
                <button
                  onClick={() => handleGenerateReport('users')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                    Relatório de Módulos
                  </h3>
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Informações sobre módulos e aulas disponíveis.
                </p>
                <button
                  onClick={() => handleGenerateReport('modules')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                    Relatório Completo
                  </h3>
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Relatório abrangente com todas as estatísticas da plataforma.
                </p>
                <button
                  onClick={() => handleGenerateReport('comprehensive')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3" />
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                    Relatório de Atividade
                  </h3>
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Atividade dos últimos 7 dias com novos usuários e ações.
                </p>
                <button
                  onClick={() => handleGenerateReport('activity')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Gerar PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 