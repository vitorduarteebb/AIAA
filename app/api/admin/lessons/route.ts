import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        module: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: [
        { moduleId: 'asc' },
        { order: 'asc' }
      ]
    })
    return NextResponse.json({ lessons })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar aulas' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, moduleId, order, imageUrl, videoUrl, codeExample } = await req.json()
    
    if (!title || !content || !moduleId) {
      return NextResponse.json({ error: 'Título, conteúdo e módulo são obrigatórios' }, { status: 400 })
    }

    // Verificar se o módulo existe
    const module = await prisma.module.findUnique({ where: { id: moduleId } })
    if (!module) {
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        moduleId,
        order: order || 1,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        codeExample: codeExample || null
      },
      include: {
        module: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Aula criada com sucesso',
      lesson
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar aula' }, { status: 500 })
  }
} 