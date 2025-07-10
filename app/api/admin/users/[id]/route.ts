import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, points, level, isAdmin, planId, aiRequestsLimit, aiRequestsUsed } = await req.json()
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    // Verificar se email já existe em outro usuário
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: params.id }
      }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado por outro usuário' }, { status: 400 })
    }

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({ where: { id: params.id } })
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    let newAiRequestsLimit = aiRequestsLimit
    // Se o plano mudou, buscar o novo limite do plano
    if (planId && planId !== currentUser.planId) {
      const plan = await prisma.plan.findUnique({ where: { id: planId } })
      if (plan) {
        newAiRequestsLimit = plan.aiRequestsLimit
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        points: points || 0,
        level: level || 1,
        isAdmin: isAdmin || false,
        planId: planId || null,
        aiRequestsLimit: newAiRequestsLimit || 10,
        aiRequestsUsed: aiRequestsUsed ?? currentUser.aiRequestsUsed
      }
    })

    return NextResponse.json({ 
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        level: user.level,
        isAdmin: user.isAdmin,
        planId: user.planId,
        aiRequestsLimit: user.aiRequestsLimit,
        aiRequestsUsed: user.aiRequestsUsed,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 })
  }
} 