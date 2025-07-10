import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.lesson.count()
    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao contar aulas' }, { status: 500 })
  }
} 