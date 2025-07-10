import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando.' }, { status: 400 })
    }
    // Verifica se já existe usuário
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    })
    // Token simulado
    const token = 'fake-token-' + user.id
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar.' }, { status: 500 })
  }
} 