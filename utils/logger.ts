import fs from 'fs'
import path from 'path'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export enum LogCategory {
  AUTH = 'AUTH',
  USER = 'USER',
  MODULE = 'MODULE',
  LESSON = 'LESSON',
  QUIZ = 'QUIZ',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  BACKUP = 'BACKUP',
  REPORT = 'REPORT'
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  userId?: string
  action?: string
  details?: any
  ip?: string
  userAgent?: string
}

export class Logger {
  private logDir: string
  private maxLogSize: number = 10 * 1024 * 1024 // 10MB
  private maxLogFiles: number = 5

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs')
    this.ensureLogDir()
  }

  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  private getLogFileName(category: LogCategory): string {
    const date = new Date().toISOString().split('T')[0]
    return `${category.toLowerCase()}-${date}.log`
  }

  async writeLog(entry: LogEntry) {
    const logFile = path.join(this.logDir, this.getLogFileName(entry.category))
    const logLine = JSON.stringify(entry) + '\n'

    try {
      fs.appendFileSync(logFile, logLine)
      
      // Verificar tamanho do arquivo
      const stats = fs.statSync(logFile)
      if (stats.size > this.maxLogSize) {
        await this.rotateLogFile(logFile)
      }
    } catch (error) {
      console.error('Erro ao escrever log:', error)
    }
  }

  private async rotateLogFile(logFile: string) {
    try {
      const dir = path.dirname(logFile)
      const ext = path.extname(logFile)
      const base = path.basename(logFile, ext)
      
      // Mover arquivos existentes
      for (let i = this.maxLogFiles - 1; i >= 1; i--) {
        const oldFile = path.join(dir, `${base}.${i}${ext}`)
        const newFile = path.join(dir, `${base}.${i + 1}${ext}`)
        
        if (fs.existsSync(oldFile)) {
          fs.renameSync(oldFile, newFile)
        }
      }
      
      // Renomear arquivo atual
      const backupFile = path.join(dir, `${base}.1${ext}`)
      fs.renameSync(logFile, backupFile)
      
      // Criar novo arquivo
      fs.writeFileSync(logFile, '')
    } catch (error) {
      console.error('Erro ao rotacionar arquivo de log:', error)
    }
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    options?: {
      userId?: string
      action?: string
      details?: any
      ip?: string
      userAgent?: string
    }
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      userId: options?.userId,
      action: options?.action,
      details: options?.details,
      ip: options?.ip,
      userAgent: options?.userAgent
    }
  }

  async debug(category: LogCategory, message: string, options?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, category, message, options)
    await this.writeLog(entry)
  }

  async info(category: LogCategory, message: string, options?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, category, message, options)
    await this.writeLog(entry)
  }

  async warn(category: LogCategory, message: string, options?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, category, message, options)
    await this.writeLog(entry)
  }

  async error(category: LogCategory, message: string, options?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, category, message, options)
    await this.writeLog(entry)
  }

  // Métodos específicos para diferentes categorias
  async logAuth(action: string, userId?: string, details?: any) {
    await this.info(LogCategory.AUTH, `Ação de autenticação: ${action}`, {
      userId,
      action,
      details
    })
  }

  async logUserAction(action: string, userId: string, details?: any) {
    await this.info(LogCategory.USER, `Ação do usuário: ${action}`, {
      userId,
      action,
      details
    })
  }

  async logAdminAction(action: string, adminId: string, details?: any) {
    await this.info(LogCategory.ADMIN, `Ação administrativa: ${action}`, {
      userId: adminId,
      action,
      details
    })
  }

  async logSystemEvent(event: string, details?: any) {
    await this.info(LogCategory.SYSTEM, `Evento do sistema: ${event}`, {
      action: event,
      details
    })
  }

  async logError(error: Error, category: LogCategory = LogCategory.SYSTEM, context?: any) {
    await this.error(category, error.message, {
      action: 'ERROR',
      details: {
        stack: error.stack,
        context
      }
    })
  }

  // Métodos para buscar logs
  async getLogs(
    category?: LogCategory,
    level?: LogLevel,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<LogEntry[]> {
    try {
      const logs: LogEntry[] = []
      const files = fs.readdirSync(this.logDir)
      
      for (const file of files) {
        if (category && !file.startsWith(category.toLowerCase())) {
          continue
        }
        
        const filePath = path.join(this.logDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const lines = content.trim().split('\n')
        
        for (const line of lines) {
          if (!line.trim()) continue
          
          try {
            const entry: LogEntry = JSON.parse(line)
            
            // Filtrar por nível
            if (level && entry.level !== level) {
              continue
            }
            
            // Filtrar por data
            if (startDate && new Date(entry.timestamp) < startDate) {
              continue
            }
            
            if (endDate && new Date(entry.timestamp) > endDate) {
              continue
            }
            
            logs.push(entry)
          } catch (error) {
            console.error('Erro ao parsear linha do log:', error)
          }
        }
      }
      
      // Ordenar por timestamp e limitar
      return logs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
        
    } catch (error) {
      console.error('Erro ao buscar logs:', error)
      return []
    }
  }

  async getLogStats(): Promise<any> {
    try {
      const files = fs.readdirSync(this.logDir)
      const stats = {
        totalFiles: files.length,
        totalEntries: 0,
        byLevel: {} as Record<LogLevel, number>,
        byCategory: {} as Record<LogCategory, number>,
        recentErrors: 0
      }
      
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      
      for (const file of files) {
        const filePath = path.join(this.logDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const lines = content.trim().split('\n')
        
        for (const line of lines) {
          if (!line.trim()) continue
          
          try {
            const entry: LogEntry = JSON.parse(line)
            stats.totalEntries++
            
            // Contar por nível
            stats.byLevel[entry.level] = (stats.byLevel[entry.level] || 0) + 1
            
            // Contar por categoria
            stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1
            
            // Contar erros recentes
            if (entry.level === LogLevel.ERROR && new Date(entry.timestamp) > oneDayAgo) {
              stats.recentErrors++
            }
          } catch (error) {
            console.error('Erro ao parsear linha do log:', error)
          }
        }
      }
      
      return stats
    } catch (error) {
      console.error('Erro ao gerar estatísticas dos logs:', error)
      return {}
    }
  }

  async clearOldLogs(daysToKeep: number = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
      
      const files = fs.readdirSync(this.logDir)
      
      for (const file of files) {
        const filePath = path.join(this.logDir, file)
        const stats = fs.statSync(filePath)
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath)
          console.log(`Log antigo removido: ${file}`)
        }
      }
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error)
    }
  }
}

// Instância global
export const logger = new Logger()

// Middleware para logs de requisições
export const logRequest = (req: any, res: any, next: any) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
    
    logger.writeLog({
      timestamp: new Date().toISOString(),
      level: logLevel,
      category: LogCategory.SYSTEM,
      message: `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
      details: {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      }
    })
  })
  
  next()
} 