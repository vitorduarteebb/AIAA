'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, XMarkIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizProps {
  questions: Question[]
  onComplete: (score: number, total: number) => void
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setShowResults(true)
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0), questions.length)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setShowResults(false)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0)
    const percentage = (finalScore / questions.length) * 100

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="mb-6">
          {percentage >= 80 ? (
            <TrophyIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          ) : percentage >= 60 ? (
            <StarIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          ) : (
            <XMarkIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
          Quiz Concluído!
        </h2>

        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          {finalScore}/{questions.length}
        </div>

        <div className="text-lg text-secondary-600 dark:text-secondary-300 mb-6">
          {percentage >= 80 ? 'Excelente! Você é incrível!' :
           percentage >= 60 ? 'Bom trabalho! Continue assim!' :
           'Continue estudando! Você vai melhorar!'}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRetry}
            className="btn-secondary"
          >
            Tentar Novamente
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-300 mb-2">
          <span>Questão {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? isAnswered
                    ? index === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-secondary-900 dark:text-white">
                  {option}
                </span>
                {isAnswered && selectedAnswer === index && (
                  <div className="flex items-center space-x-2">
                    {index === currentQ.correctAnswer ? (
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <XMarkIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Explicação:</strong> {currentQ.explanation}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <div></div>
        <button
          onClick={isAnswered ? handleNextQuestion : handleSubmitAnswer}
          disabled={selectedAnswer === null}
          className="btn-primary"
        >
          {isAnswered 
            ? currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'
            : 'Responder'
          }
        </button>
      </div>
    </div>
  )
} 