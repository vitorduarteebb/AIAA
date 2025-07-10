import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ courses })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar cursos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, coverImage, level, category, isActive } = await req.json()
    if (!name || !description) {
      return NextResponse.json({ error: 'Nome e descrição são obrigatórios' }, { status: 400 })
    }
    const course = await prisma.course.create({
      data: {
        name,
        description,
        coverImage,
        level,
        category,
        isActive: isActive !== false
      }
    })
    return NextResponse.json({ course })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar curso' }, { status: 500 })
  }
} 