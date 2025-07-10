import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    console.log('Iniciando criação de admin...')
    
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true }
    })

    if (existingAdmin) {
      console.log('Admin já existe:', existingAdmin.email)
      return NextResponse.json({ 
        message: 'Administrador já existe',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name
        }
      })
    }

    console.log('Criando hash da senha...')
    // Criar admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    console.log('Criando usuário admin...')
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@aia.com',
        password: hashedPassword,
        isAdmin: true,
        points: 0,
        level: 1
      }
    })

    console.log('Admin criado com sucesso:', admin.email)
    return NextResponse.json({ 
      message: 'Administrador criado com sucesso',
      admin: {
        email: admin.email,
        name: admin.name
      }
    })
  } catch (error) {
    console.error('Erro ao criar admin:', error)
    return NextResponse.json({ 
      error: 'Erro ao criar administrador',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 