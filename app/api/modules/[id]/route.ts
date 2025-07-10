import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const module = await prisma.module.findUnique({
      where: {
        id: params.id,
        isActive: true
      }
    })

    if (!module) {
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ module })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar módulo' }, { status: 500 })
  }
} 