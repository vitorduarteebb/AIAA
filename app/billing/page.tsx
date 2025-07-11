'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

interface Subscription {
  id: string
  planId: string
  status: 'active' | 'canceled' | 'past_due'
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export default function BillingPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
    fetchSubscription()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    }
  }

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription || null)
      }
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToPlan = async (planId: string) => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId })
      })
      if (response.ok) {
        const data = await response.json()
        // Redirecionar para checkout ou processar pagamento
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error('Erro ao assinar plano:', error)
    }
  }

  const cancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) return

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST'
      })
      if (response.ok) {
        fetchSubscription()
        alert('Assinatura cancelada com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando planos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">💳 Faturamento</h1>
            <p className="text-lg text-gray-600">Escolha o plano ideal para você</p>
          </div>

          {/* Assinatura Atual */}
          {subscription && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sua Assinatura Atual</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plano</p>
                  <p className="font-semibold text-gray-900">
                    {plans.find(p => p.id === subscription.planId)?.name || 'Plano Ativo'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'canceled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status === 'active' ? 'Ativo' :
                     subscription.status === 'canceled' ? 'Cancelado' : 'Vencido'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Próxima cobrança</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              {subscription.status === 'active' && (
                <div className="mt-4">
                  <button
                    onClick={cancelSubscription}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancelar Assinatura
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Planos Disponíveis */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-xl p-6 relative ${
                  plan.popular ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">
                      R$ {plan.price}
                    </span>
                    <span className="text-gray-500">
                      /{plan.interval === 'month' ? 'mês' : 'ano'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => subscribeToPlan(plan.id)}
                  disabled={subscription?.planId === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    subscription?.planId === plan.id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {subscription?.planId === plan.id ? 'Plano Atual' : 'Escolher Plano'}
                </button>
              </div>
            ))}
          </div>

          {/* Informações Adicionais */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações Importantes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cancelamento</h3>
                <p className="text-gray-600 text-sm">
                  Você pode cancelar sua assinatura a qualquer momento. O acesso será mantido 
                  até o final do período atual.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reembolso</h3>
                <p className="text-gray-600 text-sm">
                  Oferecemos reembolso total nos primeiros 7 dias após a assinatura, 
                  caso não esteja satisfeito com nossos serviços.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Segurança</h3>
                <p className="text-gray-600 text-sm">
                  Todos os pagamentos são processados de forma segura através de 
                  provedores certificados de pagamento.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Suporte</h3>
                <p className="text-gray-600 text-sm">
                  Em caso de dúvidas sobre faturamento, entre em contato com nosso 
                  suporte através do chat ou email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 