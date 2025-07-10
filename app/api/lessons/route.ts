import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    
    if (!moduleId) {
      return NextResponse.json({ error: 'ID do módulo é obrigatório' }, { status: 400 })
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId: moduleId,
        isActive: true
      },
      include: {
        module: {
          select: {
            id: true,
            title: true
          }
        },
        quizzes: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar aulas' }, { status: 500 })
  }
} 