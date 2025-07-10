import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
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
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar aula' }, { status: 500 })
  }
} 