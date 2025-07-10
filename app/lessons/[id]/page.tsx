'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/components/providers/AuthProvider'
import BottomNavigation from '@/components/navigation/BottomNavigation'

interface Lesson {
  id: string
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  codeExample?: string
  order: number
  moduleId: string
  module: {
    id: string
    title: string
  }
  quizzes: Quiz[]
}

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  points: number
}

interface LessonState {
  currentStep: 'content' | 'quiz' | 'results'
  currentQuizIndex: number
  answers: number[]
  timeSpent: number
  startTime: number
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [state, setState] = useState<LessonState>({
    currentStep: 'content',
    currentQuizIndex: 0,
    answers: [],
    timeSpent: 0,
    startTime: Date.now()
  })
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setLesson(data.lesson)
        } else {
          console.error('Erro ao carregar aula')
        }
      } catch (error) {
        console.error('Erro ao carregar aula:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLesson()
  }, [params.id])

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleStartQuiz = () => {
    setState(prev => ({ ...prev, currentStep: 'quiz' }))
  }

  const handleAnswerQuiz = (answerIndex: number) => {
    const currentQuiz = lesson?.quizzes[state.currentQuizIndex]
    if (!currentQuiz) return

    const correct = answerIndex === currentQuiz.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    setState(prev => ({
      ...prev,
      answers: [...prev.answers, answerIndex]
    }))

    setTimeout(() => {
      setShowFeedback(false)
      
      if (state.currentQuizIndex < (lesson?.quizzes.length || 0) - 1) {
        setState(prev => ({
          ...prev,
          currentQuizIndex: prev.currentQuizIndex + 1
        }))
      } else {
        setState(prev => ({ ...prev, currentStep: 'results' }))
      }
    }, 2000)
  }

  const handleFinish = () => {
    // Salvar progresso
    router.push('/dashboard')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCorrectAnswers = () => {
    return state.answers.filter((answer, index) => {
      const quiz = lesson?.quizzes[index]
      return quiz && answer === quiz.correctAnswer
    }).length
  }

  const getTotalPoints = () => {
    return state.answers.reduce((total, answer, index) => {
      const quiz = lesson?.quizzes[index]
      if (quiz && answer === quiz.correctAnswer) {
        return total + (quiz.points || 10)
      }
      return total
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Aula não encontrada
          </h2>
          <button 
            onClick={() => router.push('/modules')}
            className="btn-primary"
          >
            Voltar aos Módulos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/modules/${lesson.moduleId}`)}
              className="flex items-center text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-secondary-600 dark:text-secondary-300">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formatTime(state.timeSpent)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {state.currentStep === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="card p-8">
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
                {lesson.title}
              </h1>
              
              {/* Imagem da aula */}
              {lesson.imageUrl && (
                <div className="mb-8">
                  <img 
                    src={lesson.imageUrl} 
                    alt={lesson.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}

              <div 
                className="prose prose-lg max-w-none text-secondary-700 dark:text-secondary-300 mb-8"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />

              {/* Vídeo da aula */}
              {lesson.videoUrl && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                    Vídeo Explicativo
                  </h3>
                  <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                    <PlayIcon className="w-16 h-16 text-secondary-400" />
                  </div>
                </div>
              )}

              {/* Código de exemplo */}
              {lesson.codeExample && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                    Código de Exemplo
                  </h3>
                  <pre className="bg-secondary-900 dark:bg-secondary-800 text-secondary-100 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{lesson.codeExample}</code>
                  </pre>
                </div>
              )}

              {lesson.quizzes.length > 0 && (
                <div className="text-center">
                  <button 
                    onClick={handleStartQuiz}
                    className="btn-primary text-lg px-8 py-4 flex items-center mx-auto"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Fazer Quiz ({lesson.quizzes.length} perguntas)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {state.currentStep === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="card p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Quiz
                  </h2>
                  <span className="text-sm text-secondary-600 dark:text-secondary-300">
                    {state.currentQuizIndex + 1} de {lesson.quizzes.length}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((state.currentQuizIndex + 1) / lesson.quizzes.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-6">
                  {lesson.quizzes[state.currentQuizIndex].question}
                </h3>
                
                <div className="space-y-3">
                  {lesson.quizzes[state.currentQuizIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerQuiz(index)}
                      disabled={showFeedback}
                      className="w-full p-4 text-left border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors disabled:opacity-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {state.currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="card p-8 text-center">
              <div className="mb-8">
                <TrophyIcon className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                  Quiz Concluído!
                </h2>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Parabéns por completar esta aula
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Tempo Gasto</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {formatTime(state.timeSpent)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Acertos</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {getCorrectAnswers()}/{lesson.quizzes.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">Pontos Ganhos</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {getTotalPoints()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleFinish}
                  className="btn-primary"
                >
                  Continuar
                </button>
                <button 
                  onClick={() => setState(prev => ({ ...prev, currentStep: 'content' }))}
                  className="btn-secondary"
                >
                  Revisar Aula
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`p-8 rounded-full ${
                isCorrect 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {isCorrect ? (
                <CheckIcon className="w-16 h-16" />
              ) : (
                <XMarkIcon className="w-16 h-16" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  )
} 