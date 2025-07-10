import { NextRequest, NextResponse } from 'next/server'
import { backupService } from '@/utils/backup'
import { logger, LogCategory } from '@/utils/logger'
import { renewAllUserAILimits } from '@/utils/backup'

export async function GET() {
  try {
    const backups = await backupService.listBackups()
    const backupInfos = await Promise.all(
      backups.map(async (filename) => {
        try {
          return await backupService.getBackupInfo(filename)
        } catch (error) {
          return { filename, error: 'Erro ao ler informações' }
        }
      })
    )

    await logger.info(LogCategory.BACKUP, 'Listagem de backups solicitada')

    return NextResponse.json({ backups: backupInfos })
  } catch (error) {
    await logger.error(LogCategory.BACKUP, 'Erro ao listar backups', { error: (error as Error).message })
    return NextResponse.json({ error: 'Erro ao listar backups' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { action } = await req.json()
  if (action === 'renew-ai-limits') {
    await renewAllUserAILimits()
    return NextResponse.json({ message: 'Limites de requisições IA renovados para todos os usuários.' })
  }
  try {
    const filename = await backupService.createBackup()
    
    await logger.info(LogCategory.BACKUP, 'Backup criado com sucesso', { filename })

    return NextResponse.json({ 
      message: 'Backup criado com sucesso',
      filename 
    })
  } catch (error) {
    await logger.error(LogCategory.BACKUP, 'Erro ao criar backup', { error: (error as Error).message })
    return NextResponse.json({ error: 'Erro ao criar backup' }, { status: 500 })
  }
} 