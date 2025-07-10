import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se o plano existe
    const plan = await prisma.plan.findUnique({
      where: { id }
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há usuários usando este plano
    const usersWithPlan = await prisma.user.count({
      where: { planId: id }
    })

    if (usersWithPlan > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um plano que possui usuários associados' },
        { status: 400 }
      )
    }

    // Excluir o plano
    await prisma.plan.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Plano excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir plano:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 