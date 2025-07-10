import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SLUG = 'landing'

export async function GET() {
  const page = await prisma.pageContent.findUnique({ where: { slug: SLUG } })
  return NextResponse.json({ content: page?.content || '' })
}

export async function PUT(req: NextRequest) {
  const { content } = await req.json()
  if (!content) return NextResponse.json({ error: 'Conteúdo obrigatório' }, { status: 400 })
  const page = await prisma.pageContent.upsert({
    where: { slug: SLUG },
    update: { content },
    create: { slug: SLUG, content }
  })
  return NextResponse.json({ content: page.content })
} 