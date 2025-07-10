import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      where: {
        isActive: true
      },
      include: {
        lessons: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            order: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ modules })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar módulos' }, { status: 500 })
  }
} 