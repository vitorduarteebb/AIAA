'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface Friend {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastSeen?: string
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends')
      if (response.ok) {
        const data = await response.json()
        setFriends(data.friends || [])
        setPendingRequests(data.pendingRequests || [])
      }
    } catch (error) {
      console.error('Erro ao buscar amigos:', error)
    } finally {
      setLoading(false)
    }
  }

  const acceptFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendId}/accept`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchFriends()
      }
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error)
    }
  }

  const rejectFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendId}/reject`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchFriends()
      }
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error)
    }
  }

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando amigos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">👥 Amigos</h1>
            <p className="text-lg text-gray-600">Conecte-se com outros alunos</p>
          </div>

          {/* Solicitações Pendentes */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitações Pendentes</h2>
              <div className="grid gap-4">
                {pendingRequests.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptFriendRequest(friend.id)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(friend.id)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Amigos */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Seus Amigos ({filteredFriends.length})</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar amigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {filteredFriends.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum amigo encontrado</h3>
                <p className="text-gray-600">Adicione amigos para começar a se conectar!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-green-500' :
                          friend.status === 'away' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                        <p className="text-xs text-gray-400">
                          {friend.status === 'online' ? 'Online' :
                           friend.status === 'away' ? 'Ausente' :
                           `Visto por último: ${friend.lastSeen}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        Mensagem
                      </button>
                      <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 