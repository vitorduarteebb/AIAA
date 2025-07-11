'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface User {
  id: string
  name: string
  email: string
  points: number
  level: number
  avatar?: string
}

export default function RankingPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/ranking')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Erro ao buscar ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Ranking dos Alunos</h1>
            <p className="text-lg text-gray-600">Veja quem está se destacando na plataforma</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="grid gap-4">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      index === 0 ? 'border-yellow-400 bg-yellow-50' :
                      index === 1 ? 'border-gray-300 bg-gray-50' :
                      index === 2 ? 'border-orange-400 bg-orange-50' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-500' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-primary-500'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{user.points}</div>
                        <div className="text-sm text-gray-500">pontos</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-700">Nível {user.level}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sua Posição</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Você está em</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {users.findIndex(u => u.id === user.id) + 1}º lugar
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Seus pontos</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {users.find(u => u.id === user.id)?.points || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 