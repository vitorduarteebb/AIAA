import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Configurações padrão
const defaultSettings = {
  siteName: 'AIA - Plataforma de Aprendizado',
  siteDescription: 'Aprenda com inteligência artificial',
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  maxLoginAttempts: 5,
  sessionTimeout: 24,
  defaultUserPoints: 0,
  defaultUserLevel: 1,
  enableNotifications: true,
  enableGamification: true,
  enableLeaderboard: true
}

export async function GET() {
  try {
    // Por enquanto, retornamos as configurações padrão
    // Em uma implementação real, você salvaria isso no banco de dados
    return NextResponse.json({ settings: defaultSettings })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao carregar configurações' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const settings = await req.json()
    
    // Por enquanto, apenas validamos e retornamos sucesso
    // Em uma implementação real, você salvaria isso no banco de dados
    
    // Validações básicas
    if (settings.maxLoginAttempts < 1 || settings.maxLoginAttempts > 10) {
      return NextResponse.json({ error: 'Máximo de tentativas deve estar entre 1 e 10' }, { status: 400 })
    }
    
    if (settings.sessionTimeout < 1 || settings.sessionTimeout > 168) {
      return NextResponse.json({ error: 'Timeout da sessão deve estar entre 1 e 168 horas' }, { status: 400 })
    }
    
    if (settings.defaultUserPoints < 0) {
      return NextResponse.json({ error: 'Pontos iniciais não podem ser negativos' }, { status: 400 })
    }
    
    if (settings.defaultUserLevel < 1) {
      return NextResponse.json({ error: 'Nível inicial deve ser pelo menos 1' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      message: 'Configurações salvas com sucesso',
      settings 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
} 