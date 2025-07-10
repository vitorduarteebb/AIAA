import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, level, order, isActive } = await req.json()
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Título e descrição são obrigatórios' }, { status: 400 })
    }

    const module = await prisma.module.update({
      where: { id: params.id },
      data: {
        title,
        description,
        level: level || 'BASIC',
        order: order || 0,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({ module })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar módulo' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.module.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Módulo excluído com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir módulo' }, { status: 500 })
  }
} 