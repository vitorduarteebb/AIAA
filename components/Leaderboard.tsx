'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/outline'

interface LeaderboardEntry {
  id: string
  name: string
  points: number
  level: number
  avatar: string
  isCurrentUser: boolean
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week')

  useEffect(() => {
    // Carregamento real do ranking deve ser implementado aqui
    setLeaderboard([])
  }, [timeFilter])

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <TrophyIcon className="w-6 h-6 text-yellow-500" />
      case 2:
        return <TrophyIcon className="w-6 h-6 text-gray-400" />
      case 3:
        return <StarIcon className="w-6 h-6 text-orange-500" />
      default:
        return <span className="text-lg font-bold text-secondary-400">{position}</span>
    }
  }

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default:
        return 'bg-secondary-200 dark:bg-secondary-700'
    }
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Ranking Global
        </h2>
        <div className="flex space-x-2">
          {(['week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-600'
              }`}
            >
              {filter === 'week' ? 'Semana' : filter === 'month' ? 'Mês' : 'Geral'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`text-center p-4 rounded-lg ${getRankBadge(index + 1)} ${
              entry.isCurrentUser ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="text-3xl mb-2">{entry.avatar}</div>
            <div className="text-lg font-semibold text-white mb-1">
              {entry.name}
            </div>
            <div className="text-sm text-white/80">
              {entry.points.toLocaleString()} pts
            </div>
            <div className="text-xs text-white/60">
              Nível {entry.level}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="space-y-2">
        {leaderboard.slice(3).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 3) * 0.05 }}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              entry.isCurrentUser
                ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                : 'hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 mr-4">
              {getRankIcon(index + 4)}
            </div>
            
            <div className="text-2xl mr-3">{entry.avatar}</div>
            
            <div className="flex-1">
              <div className="font-medium text-secondary-900 dark:text-white">
                {entry.name}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                    Você
                  </span>
                )}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-300">
                Nível {entry.level}
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-secondary-900 dark:text-white">
                {entry.points.toLocaleString()}
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                pontos
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current User Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Seu Progresso</h3>
            <p className="text-sm opacity-90">
              Continue assim! Você está no caminho certo.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">1.250</div>
            <div className="text-sm opacity-90">pontos</div>
          </div>
        </div>
      </div>
    </div>
  )
} 