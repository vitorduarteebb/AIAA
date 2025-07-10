import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: {
          include: {
            module: true
          }
        }
      },
      orderBy: [
        { lesson: { module: { order: 'asc' } } },
        { lesson: { order: 'asc' } },
        { order: 'asc' }
      ]
    })
    return NextResponse.json({ quizzes })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar quiz' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { question, options, correctAnswer, lessonId, order, isActive, points } = await req.json()
    
    if (!question || !lessonId) {
      return NextResponse.json({ error: 'Pergunta e aula são obrigatórios' }, { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        question,
        options: typeof options === 'string' ? options : JSON.stringify(options),
        correctAnswer: parseInt(correctAnswer),
        lessonId,
        order: order || 0,
        isActive: isActive !== false,
        points: points || 10
      }
    })

    return NextResponse.json({ quiz })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar quiz' }, { status: 500 })
  }
} 