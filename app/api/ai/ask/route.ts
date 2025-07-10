import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Função para buscar config ativa da IA
async function getActiveAIConfig() {
  return prisma.aIConfig.findFirst({ where: { isActive: true } })
}

// Função para buscar usuário autenticado (exemplo usando cookie 'userId')
async function getUserFromRequest(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return null
  return prisma.user.findUnique({ where: { id: userId } })
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
    }

    // Buscar usuário autenticado
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    // Verificar limite de requisições
    if (user.aiRequestsUsed >= user.aiRequestsLimit) {
      // Log de limite atingido
      await prisma.aILog.create({
        data: {
          userId: user.id,
          message,
          response: 'Limite de requisições atingido',
          status: 'limit'
        }
      })
      return NextResponse.json({ error: 'Limite de requisições à IA atingido para seu plano.' }, { status: 403 })
    }

    // Buscar configuração ativa da IA
    const aiConfig = await getActiveAIConfig()
    if (!aiConfig || !aiConfig.apiKey) {
      await prisma.aILog.create({
        data: {
          userId: user.id,
          message,
          response: 'Configuração da IA não encontrada',
          status: 'error'
        }
      })
      return NextResponse.json({ error: 'Configuração da IA não encontrada.' }, { status: 500 })
    }

    // Chamar IA (OpenAI, exemplo)
    let aiResponse = 'Resposta simulada da IA.'
    let status = 'success'
    if (aiConfig.provider === 'openai') {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.apiKey}`
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [
              { role: 'system', content: 'Você é um assistente educacional.' },
              { role: 'user', content: message }
            ],
            max_tokens: aiConfig.maxTokens,
            temperature: aiConfig.temperature
          })
        })
        const data = await openaiRes.json()
        aiResponse = data.choices?.[0]?.message?.content || 'Não foi possível obter resposta da IA.'
      } catch (err) {
        aiResponse = 'Erro ao consultar a IA.'
        status = 'error'
      }
    }

    // Incrementar contador de requisições
    await prisma.user.update({
      where: { id: user.id },
      data: { aiRequestsUsed: { increment: 1 } }
    })

    // Log de uso
    await prisma.aILog.create({
      data: {
        userId: user.id,
        message,
        response: aiResponse,
        status
      }
    })

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar requisição à IA.' }, { status: 500 })
  }
} 