import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, aiRequestsLimit, isActive } = body

    // Validar campos obrigatórios
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Nome e descrição são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe um plano com o mesmo nome
    const existingPlan = await prisma.plan.findFirst({
      where: { name }
    })

    if (existingPlan) {
      return NextResponse.json(
        { error: 'Já existe um plano com este nome' },
        { status: 400 }
      )
    }

    // Criar novo plano
    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price: price || 0,
        aiRequestsLimit: aiRequestsLimit || 10,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Erro ao criar plano:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, aiRequestsLimit, isActive } = body

    // Validar campos obrigatórios
    if (!id || !name || !description) {
      return NextResponse.json(
        { error: 'ID, nome e descrição são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe outro plano com o mesmo nome
    const existingPlan = await prisma.plan.findFirst({
      where: { 
        name,
        id: { not: id }
      }
    })

    if (existingPlan) {
      return NextResponse.json(
        { error: 'Já existe um plano com este nome' },
        { status: 400 }
      )
    }

    // Atualizar plano
    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name,
        description,
        price: price || 0,
        aiRequestsLimit: aiRequestsLimit || 10,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Erro ao atualizar plano:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 