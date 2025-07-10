'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon, 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Apaixonado por aprendizado e tecnologia. Sempre buscando novos conhecimentos!'
  })

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
  }

  const achievements = [
    { id: 1, title: 'Primeiro Módulo', description: 'Completou o primeiro módulo', icon: '🎯', unlocked: true },
    { id: 2, title: 'Estudante Dedicado', description: '7 dias seguidos de estudo', icon: '🔥', unlocked: true },
    { id: 3, title: 'Quiz Master', description: 'Acertou 10 questões seguidas', icon: '🧠', unlocked: true },
    { id: 4, title: 'Premium', description: 'Assinatura Premium ativa', icon: '⭐', unlocked: user?.isPremium },
    { id: 5, title: 'Comunidade', description: 'Participou de 5 discussões', icon: '👥', unlocked: false },
    { id: 6, title: 'Mestre', description: 'Completou todos os módulos', icon: '👑', unlocked: false },
  ]

  const stats = [
    { label: 'Módulos Completos', value: '3/30', color: 'text-green-600' },
    { label: 'Pontos Totais', value: user?.points?.toString() || '0', color: 'text-blue-600' },
    { label: 'Nível Atual', value: user?.level?.toString() || '1', color: 'text-purple-600' },
    { label: 'Dias de Estudo', value: '12', color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                Perfil
              </h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <PencilIcon className="w-5 h-5" />
              <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white dark:bg-secondary-700 rounded-full flex items-center justify-center shadow-lg">
                <CameraIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input text-xl font-bold text-center md:text-left"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input text-secondary-600 dark:text-secondary-300"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input resize-none"
                    rows={3}
                  />
                  <button onClick={handleSave} className="btn-primary">
                    Salvar Alterações
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                    {user?.name || 'Usuário'}
                  </h2>
                  <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                    {user?.email || 'usuario@email.com'}
                  </p>
                  <p className="text-secondary-700 dark:text-secondary-200">
                    {formData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="card p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-300">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
            Conquistas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  achievement.unlocked
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-secondary-200 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800/50 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">
                  {achievement.title}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-300">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
            Configurações
          </h3>
          <div className="space-y-4">
            <Link href="/settings" className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <CogIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                <span className="text-secondary-900 dark:text-white">Configurações Gerais</span>
              </div>
              <span className="text-secondary-400">→</span>
            </Link>

            <Link href="/notifications" className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <BellIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                <span className="text-secondary-900 dark:text-white">Notificações</span>
              </div>
              <span className="text-secondary-400">→</span>
            </Link>

            <Link href="/privacy" className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                <span className="text-secondary-900 dark:text-white">Privacidade</span>
              </div>
              <span className="text-secondary-400">→</span>
            </Link>

            <Link href="/billing" className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                <span className="text-secondary-900 dark:text-white">Faturamento</span>
              </div>
              <span className="text-secondary-400">→</span>
            </Link>

            <Link href="/help" className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <QuestionMarkCircleIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                <span className="text-secondary-900 dark:text-white">Ajuda & Suporte</span>
              </div>
              <span className="text-secondary-400">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Sair da Conta
          </button>
        </motion.div>
      </div>
    </div>
  )
} 