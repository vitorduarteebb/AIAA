import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const config = await prisma.aIConfig.findFirst({
      where: { isActive: true }
    })

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Erro ao buscar configuração da IA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, provider, model, maxTokens, temperature, isActive } = body

    // Validar campos obrigatórios
    if (!apiKey || !provider || !model) {
      return NextResponse.json(
        { error: 'Chave da API, provedor e modelo são obrigatórios' },
        { status: 400 }
      )
    }

    // Desativar configurações existentes
    await prisma.aIConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    // Criar nova configuração
    const config = await prisma.aIConfig.create({
      data: {
        apiKey,
        provider,
        model,
        maxTokens: maxTokens || 1000,
        temperature: temperature || 0.7,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Erro ao salvar configuração da IA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 