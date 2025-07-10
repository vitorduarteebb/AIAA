import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        lessons: true,
        course: true
      },
      orderBy: {
        order: 'asc'
      }
    })
    return NextResponse.json({ modules })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar módulos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, level, order, isActive, courseId } = await req.json()
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Título e descrição são obrigatórios' }, { status: 400 })
    }

    const module = await prisma.module.create({
      data: {
        title,
        description,
        level: level || 'BASIC',
        order: order || 0,
        isActive: isActive !== false,
        courseId: courseId || null
      }
    })

    return NextResponse.json({ module })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar módulo' }, { status: 500 })
  }
} 