import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando.' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 401 })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
    }
    // Token simulado
    const token = 'fake-token-' + user.id
    return NextResponse.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin 
      }, 
      token 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao logar.' }, { status: 500 })
  }
} 