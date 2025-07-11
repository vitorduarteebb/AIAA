'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      if (response.ok) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ))
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST'
      })
      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando notificações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🔔 Notificações</h1>
            <p className="text-lg text-gray-600">Mantenha-se atualizado com as novidades</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            {/* Filtros e Ações */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'unread' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Não lidas ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'read' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Lidas ({notifications.length - unreadCount})
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Lista de Notificações */}
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'Nenhuma notificação' : 
                   filter === 'unread' ? 'Nenhuma notificação não lida' : 
                   'Nenhuma notificação lida'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' ? 'Você está em dia com suas notificações!' : 
                   filter === 'unread' ? 'Todas as notificações foram lidas!' : 
                   'Você ainda não leu nenhuma notificação'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-xl transition-all hover:shadow-md ${
                      notification.read ? 'border-gray-200 bg-gray-50' : 'border-primary-200 bg-primary-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Marcar como lida
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    {notification.link && (
                      <div className="mt-3">
                        <a
                          href={notification.link}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Ver detalhes →
                        </a>
                      </div>
                    )}
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