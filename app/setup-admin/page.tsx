"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupAdmin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const createAdmin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}\n\nEmail: ${data.admin.email}\nSenha: admin123`)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              Configuração Inicial
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Criar administrador do sistema
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium mb-2">📋 Informações do Administrador:</p>
              <ul className="space-y-1 text-xs">
                <li>• Email: admin@aia.com</li>
                <li>• Senha: admin123</li>
                <li>• Nome: Administrador</li>
              </ul>
            </div>

            <button
              onClick={createAdmin}
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-medium"
            >
              {loading ? 'Criando...' : 'Criar Administrador'}
            </button>

            {message && (
              <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                {message}
              </div>
            )}

            <div className="text-center space-y-3">
              <a
                href="/admin/login"
                className="block text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                → Ir para login administrativo
              </a>
              <a
                href="/"
                className="block text-sm text-secondary-600 dark:text-secondary-400 hover:underline"
              >
                ← Voltar ao site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 