import { NextResponse } from 'next/server'
import { reportGenerator } from '@/utils/reports'
import { logger, LogCategory } from '@/utils/logger'

export async function POST(req: Request) {
  try {
    const { type, days } = await req.json()
    
    let pdfBuffer: Buffer
    
    switch (type) {
      case 'users':
        pdfBuffer = await reportGenerator.generateUserReport()
        break
      case 'modules':
        pdfBuffer = await reportGenerator.generateModuleReport()
        break
      case 'quizzes':
        pdfBuffer = await reportGenerator.generateQuizReport()
        break
      case 'comprehensive':
        pdfBuffer = await reportGenerator.generateComprehensiveReport()
        break
      case 'activity':
        pdfBuffer = await reportGenerator.generateActivityReport(days || 7)
        break
      default:
        return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 })
    }

    await logger.info(LogCategory.REPORT, `Relatório ${type} gerado com sucesso`)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${type}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })
  } catch (error) {
    await logger.error(LogCategory.REPORT, 'Erro ao gerar relatório', { error: (error as Error).message })
    return NextResponse.json({ error: 'Erro ao gerar relatório' }, { status: 500 })
  }
} 