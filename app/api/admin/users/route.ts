import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        level: true,
        isAdmin: true,
        planId: true,
        aiRequestsLimit: true,
        aiRequestsUsed: true,
        createdAt: true
      }
    })
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, points, level, isAdmin, planId } = await req.json()
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }

    let aiRequestsLimit = 10
    if (planId) {
      const plan = await prisma.plan.findUnique({ where: { id: planId } })
      if (plan) aiRequestsLimit = plan.aiRequestsLimit
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'temp-password', // Senha temporária
        points: points || 0,
        level: level || 1,
        isAdmin: isAdmin || false,
        planId: planId || null,
        aiRequestsLimit,
        aiRequestsUsed: 0
      }
    })

    return NextResponse.json({ 
      message: 'Usuário criado com sucesso',
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
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
} 