import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

interface BackupData {
  users: any[]
  modules: any[]
  lessons: any[]
  quizzes: any[]
  timestamp: string
  version: string
}

export class BackupService {
  private backupDir: string
  private maxBackups: number = 10

  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups')
    this.ensureBackupDir()
  }

  private ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  async createBackup(): Promise<string> {
    try {
      console.log('🔄 Iniciando backup do banco de dados...')

      // Buscar todos os dados
      const [users, modules, lessons, quizzes] = await Promise.all([
        prisma.user.findMany(),
        prisma.module.findMany(),
        prisma.lesson.findMany(),
        prisma.quiz.findMany()
      ])

      const backupData: BackupData = {
        users,
        modules,
        lessons,
        quizzes,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }

      // Criar nome do arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `backup-${timestamp}.json`
      const filepath = path.join(this.backupDir, filename)

      // Salvar backup
      fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2))

      // Limpar backups antigos
      await this.cleanOldBackups()

      console.log(`✅ Backup criado com sucesso: ${filename}`)
      return filename

    } catch (error) {
      console.error('❌ Erro ao criar backup:', error)
      throw error
    }
  }

  async restoreBackup(filename: string): Promise<void> {
    try {
      console.log(`🔄 Restaurando backup: ${filename}`)

      const filepath = path.join(this.backupDir, filename)
      
      if (!fs.existsSync(filepath)) {
        throw new Error('Arquivo de backup não encontrado')
      }

      const backupData: BackupData = JSON.parse(fs.readFileSync(filepath, 'utf8'))

      // Limpar banco atual
      await prisma.quiz.deleteMany()
      await prisma.lesson.deleteMany()
      await prisma.module.deleteMany()
      await prisma.user.deleteMany()

      // Restaurar dados
      if (backupData.users.length > 0) {
        await prisma.user.createMany({
          data: backupData.users.map(user => ({
            ...user,
            id: undefined // Deixar o Prisma gerar novos IDs
          }))
        })
      }

      if (backupData.modules.length > 0) {
        await prisma.module.createMany({
          data: backupData.modules.map(module => ({
            ...module,
            id: undefined
          }))
        })
      }

      if (backupData.lessons.length > 0) {
        await prisma.lesson.createMany({
          data: backupData.lessons.map(lesson => ({
            ...lesson,
            id: undefined
          }))
        })
      }

      if (backupData.quizzes.length > 0) {
        await prisma.quiz.createMany({
          data: backupData.quizzes.map(quiz => ({
            ...quiz,
            id: undefined
          }))
        })
      }

      console.log('✅ Backup restaurado com sucesso')

    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error)
      throw error
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.backupDir)
      return files
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
          const statA = fs.statSync(path.join(this.backupDir, a))
          const statB = fs.statSync(path.join(this.backupDir, b))
          return statB.mtime.getTime() - statA.mtime.getTime()
        })
    } catch (error) {
      console.error('❌ Erro ao listar backups:', error)
      return []
    }
  }

  async deleteBackup(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.backupDir, filename)
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        console.log(`✅ Backup deletado: ${filename}`)
      }
    } catch (error) {
      console.error('❌ Erro ao deletar backup:', error)
      throw error
    }
  }

  private async cleanOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups()
      
      if (backups.length > this.maxBackups) {
        const toDelete = backups.slice(this.maxBackups)
        
        for (const backup of toDelete) {
          await this.deleteBackup(backup)
        }
        
        console.log(`🧹 ${toDelete.length} backups antigos removidos`)
      }
    } catch (error) {
      console.error('❌ Erro ao limpar backups antigos:', error)
    }
  }

  async getBackupInfo(filename: string): Promise<any> {
    try {
      const filepath = path.join(this.backupDir, filename)
      
      if (!fs.existsSync(filepath)) {
        throw new Error('Arquivo de backup não encontrado')
      }

      const backupData: BackupData = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      const stats = fs.statSync(filepath)

      return {
        filename,
        timestamp: backupData.timestamp,
        version: backupData.version,
        size: stats.size,
        users: backupData.users.length,
        modules: backupData.modules.length,
        lessons: backupData.lessons.length,
        quizzes: backupData.quizzes.length
      }
    } catch (error) {
      console.error('❌ Erro ao obter informações do backup:', error)
      throw error
    }
  }
}

// Instância global
export const backupService = new BackupService()

// Função para backup automático (pode ser chamada por cron job)
export async function autoBackup() {
  try {
    await backupService.createBackup()
  } catch (error) {
    console.error('❌ Erro no backup automático:', error)
  }
} 

export async function renewAllUserAILimits() {
  // Atualiza todos os usuários para zerar o contador de requisições IA
  await prisma.user.updateMany({
    data: { aiRequestsUsed: 0 }
  })
} 

// Agendamento automático: todo dia 1º à 00:00
cron.schedule('0 0 1 * *', async () => {
  await renewAllUserAILimits()
  // Opcional: logar a renovação
  console.log('Limites de requisições IA renovados para todos os usuários (agendamento mensal).')
}) 