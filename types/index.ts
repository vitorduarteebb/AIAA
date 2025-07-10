export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  points: number
  level: number
  isPremium: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  title: string
  description: string
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
  order: number
  isActive: boolean
  lessons: Lesson[]
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  order: number
  moduleId: string
  isActive: boolean
  quizzes: Quiz[]
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  lessonId: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserModule {
  id: string
  userId: string
  moduleId: string
  completed: boolean
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  timeSpent: number
  createdAt: Date
  updatedAt: Date
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
  createdAt: Date
}

export interface Friendship {
  id: string
  userId: string
  friendId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'FRIEND_REQUEST' | 'LESSON_COMPLETED' | 'QUIZ_RESULT' | 'SYSTEM' | 'PREMIUM'
  isRead: boolean
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  stripeId: string
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID'
  planType: 'MONTHLY' | 'YEARLY'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Tournament {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  isActive: boolean
  rewards?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
}

export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export interface LessonState {
  currentStep: 'content' | 'quiz' | 'results'
  currentQuizIndex: number
  answers: number[]
  timeSpent: number
  startTime: number
} 