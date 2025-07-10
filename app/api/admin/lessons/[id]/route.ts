import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
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
      message: 'Aula atualizada com sucesso',
      lesson
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar aula' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Aula excluída com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir aula' }, { status: 500 })
  }
} 