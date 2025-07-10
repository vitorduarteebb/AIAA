import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { question, options, correctAnswer, lessonId, order, isActive, points } = await req.json()
    
    if (!question || !lessonId) {
      return NextResponse.json({ error: 'Pergunta e aula são obrigatórios' }, { status: 400 })
    }

    const quiz = await prisma.quiz.update({
      where: { id: params.id },
      data: {
        question,
        options: typeof options === 'string' ? options : JSON.stringify(options),
        correctAnswer: parseInt(correctAnswer),
        lessonId,
        order: order || 0,
        points: points || 10,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({ quiz })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar quiz' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.quiz.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Quiz excluído com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir quiz' }, { status: 500 })
  }
} 