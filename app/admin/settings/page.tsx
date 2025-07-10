"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  CogIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CheckIcon,
  KeyIcon,
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Settings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxLoginAttempts: number
  sessionTimeout: number
  defaultUserPoints: number
  defaultUserLevel: number
  enableNotifications: boolean
  enableGamification: boolean
  enableLeaderboard: boolean
}

interface AIConfig {
  id?: string
  apiKey: string
  provider: string
  model: string
  maxTokens: number
  temperature: number
  isActive: boolean
}

interface Plan {
  id?: string
  name: string
  description: string
  price: number
  aiRequestsLimit: number
  isActive: boolean
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'AIA - Plataforma de Aprendizado',
    siteDescription: 'Aprenda com inteligência artificial',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    defaultUserPoints: 0,
    defaultUserLevel: 1,
    enableNotifications: true,
    enableGamification: true,
    enableLeaderboard: true
  })
  
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    apiKey: '',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    isActive: true
  })
  
  const [plans, setPlans] = useState<Plan[]>([])
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [showPlanForm, setShowPlanForm] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
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

    loadSettings()
    loadAIConfig()
    loadPlans()
  }, [router])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const loadAIConfig = async () => {
    try {
      const response = await fetch('/api/admin/ai-config')
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setAiConfig(data.config)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração da IA:', error)
    }
  }

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiConfig)
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Erro ao salvar configuração da IA:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlan = async () => {
    if (!editingPlan) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/plans', {
        method: editingPlan.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlan)
      })

      if (response.ok) {
        setShowPlanForm(false)
        setEditingPlan(null)
        loadPlans()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Erro ao salvar plano:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return
    
    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadPlans()
      }
    } catch (error) {
      console.error('Erro ao excluir plano:', error)
    }
  }

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAIChange = (key: keyof AIConfig, value: any) => {
    setAiConfig(prev => ({ ...prev, [key]: value }))
  }

  const handlePlanChange = (key: keyof Plan, value: any) => {
    if (!editingPlan) return
    setEditingPlan(prev => prev ? { ...prev, [key]: value } : null)
  }

  const openPlanForm = (plan?: Plan) => {
    setEditingPlan(plan || {
      name: '',
      description: '',
      price: 0,
      aiRequestsLimit: 10,
      isActive: true
    })
    setShowPlanForm(true)
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
                Configurações
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
            ✅ Configurações salvas com sucesso!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda */}
          <div className="space-y-8">
            {/* Configurações Gerais */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Configurações Gerais
                  </h2>
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Nome do Site
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Descrição do Site
                  </label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    Modo Manutenção
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="allowRegistration" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    Permitir Registro
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações da IA */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <KeyIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Configuração da IA
                  </h2>
                </div>
                <button
                  onClick={handleSaveAI}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Chave da API
                  </label>
                  <input
                    type="password"
                    value={aiConfig.apiKey}
                    onChange={(e) => handleAIChange('apiKey', e.target.value)}
                    className="input w-full"
                    placeholder="sk-..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Provedor
                    </label>
                    <select
                      value={aiConfig.provider}
                      onChange={(e) => handleAIChange('provider', e.target.value)}
                      className="input w-full"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={aiConfig.model}
                      onChange={(e) => handleAIChange('model', e.target.value)}
                      className="input w-full"
                      placeholder="gpt-3.5-turbo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Máximo de Tokens
                    </label>
                    <input
                      type="number"
                      value={aiConfig.maxTokens}
                      onChange={(e) => handleAIChange('maxTokens', parseInt(e.target.value))}
                      className="input w-full"
                      min="100"
                      max="4000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Temperatura
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={aiConfig.temperature}
                      onChange={(e) => handleAIChange('temperature', parseFloat(e.target.value))}
                      className="input w-full"
                      min="0"
                      max="2"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aiActive"
                    checked={aiConfig.isActive}
                    onChange={(e) => handleAIChange('isActive', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="aiActive" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    IA Ativa
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-8">
            {/* Gerenciamento de Planos */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CreditCardIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Planos de Assinatura
                  </h2>
                </div>
                <button
                  onClick={() => openPlanForm()}
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Novo Plano</span>
                </button>
              </div>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white">{plan.name}</h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">{plan.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-green-600 dark:text-green-400">
                            R$ {plan.price.toFixed(2)}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {plan.aiRequestsLimit} req/IA
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            plan.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {plan.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openPlanForm(plan)}
                          className="p-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id!)}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {plans.length === 0 && (
                  <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
                    Nenhum plano configurado
                  </div>
                )}
              </div>
            </div>

            {/* Configurações de Segurança */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Segurança
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Máximo de Tentativas de Login
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="input w-full"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Timeout da Sessão (horas)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    className="input w-full"
                    min="1"
                    max="168"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    Requer Verificação de Email
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Gamificação */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Gamificação
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Pontos Iniciais do Usuário
                  </label>
                  <input
                    type="number"
                    value={settings.defaultUserPoints}
                    onChange={(e) => handleChange('defaultUserPoints', parseInt(e.target.value))}
                    className="input w-full"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Nível Inicial do Usuário
                  </label>
                  <input
                    type="number"
                    value={settings.defaultUserLevel}
                    onChange={(e) => handleChange('defaultUserLevel', parseInt(e.target.value))}
                    className="input w-full"
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableGamification"
                    checked={settings.enableGamification}
                    onChange={(e) => handleChange('enableGamification', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableGamification" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    Habilitar Gamificação
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableLeaderboard"
                    checked={settings.enableLeaderboard}
                    onChange={(e) => handleChange('enableLeaderboard', e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableLeaderboard" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                    Habilitar Ranking
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Notificações */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <BellIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Notificações
                </h2>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableNotifications" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                  Habilitar Notificações
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Plano */}
      {showPlanForm && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {editingPlan.id ? 'Editar Plano' : 'Novo Plano'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => handlePlanChange('name', e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => handlePlanChange('description', e.target.value)}
                  className="input w-full"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={(e) => handlePlanChange('price', parseFloat(e.target.value))}
                    className="input w-full"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Limite de Req. IA
                  </label>
                  <input
                    type="number"
                    value={editingPlan.aiRequestsLimit}
                    onChange={(e) => handlePlanChange('aiRequestsLimit', parseInt(e.target.value))}
                    className="input w-full"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="planActive"
                  checked={editingPlan.isActive}
                  onChange={(e) => handlePlanChange('isActive', e.target.checked)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="planActive" className="ml-2 text-sm text-secondary-700 dark:text-secondary-300">
                  Plano Ativo
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPlanForm(false)
                  setEditingPlan(null)
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 