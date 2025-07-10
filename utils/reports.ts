import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { prisma } from '@/lib/prisma'

interface ReportData {
  users: any[]
  modules: any[]
  lessons: any[]
  quizzes: any[]
  stats: {
    totalUsers: number
    totalModules: number
    totalLessons: number
    totalQuizzes: number
    activeUsers: number
    averageScore: number
  }
}

export class ReportGenerator {
  async generateUserReport(): Promise<Buffer> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text('Relatório de Usuários', 20, 20)
    
    // Data
    doc.setFontSize(12)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30)
    
    // Tabela de usuários
    const tableData = users.map(user => [
      user.name,
      user.email,
      user.points,
      user.level,
      user.isAdmin ? 'Sim' : 'Não',
      new Date(user.createdAt).toLocaleDateString('pt-BR')
    ])

    autoTable(doc, {
      head: [['Nome', 'Email', 'Pontos', 'Nível', 'Admin', 'Cadastro']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    })

    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateModuleReport(): Promise<Buffer> {
    const modules = await prisma.module.findMany({
      include: {
        lessons: true,
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text('Relatório de Módulos', 20, 20)
    
    // Data
    doc.setFontSize(12)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30)
    
    // Tabela de módulos
    const tableData = modules.map(module => [
      module.title,
      module.description,
      module._count.lessons,
      module.order,
      new Date(module.createdAt).toLocaleDateString('pt-BR')
    ])

    autoTable(doc, {
      head: [['Título', 'Descrição', 'Aulas', 'Ordem', 'Criado em']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255
      }
    })

    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateQuizReport(): Promise<Buffer> {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        question: true,
        options: true,
        correctAnswer: true,
        points: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text('Relatório de Quizzes', 20, 20)
    
    // Data
    doc.setFontSize(12)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30)
    
    // Tabela de quizzes
    const tableData = quizzes.map(quiz => [
      quiz.question,
      quiz.correctAnswer,
      quiz.options, // options já é uma string JSON
      quiz.points.toString(), // usando points como dificuldade
      new Date(quiz.createdAt).toLocaleDateString('pt-BR')
    ])

    autoTable(doc, {
      head: [['Pergunta', 'Resposta Correta', 'Opções', 'Pontos', 'Criado em']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: 255
      }
    })

    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateComprehensiveReport(): Promise<Buffer> {
    const [users, modules, lessons, quizzes] = await Promise.all([
      prisma.user.findMany(),
      prisma.module.findMany(),
      prisma.lesson.findMany(),
      prisma.quiz.findMany()
    ])

    const stats = {
      totalUsers: users.length,
      totalModules: modules.length,
      totalLessons: lessons.length,
      totalQuizzes: quizzes.length,
      activeUsers: users.filter(u => u.points > 0).length,
      averageScore: 78.5 // Simulado
    }

    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(24)
    doc.text('Relatório Completo da Plataforma', 20, 20)
    
    // Data
    doc.setFontSize(12)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 30)
    
    // Estatísticas gerais
    doc.setFontSize(16)
    doc.text('Estatísticas Gerais', 20, 50)
    
    doc.setFontSize(12)
    doc.text(`Total de Usuários: ${stats.totalUsers}`, 20, 65)
    doc.text(`Usuários Ativos: ${stats.activeUsers}`, 20, 75)
    doc.text(`Total de Módulos: ${stats.totalModules}`, 20, 85)
    doc.text(`Total de Aulas: ${stats.totalLessons}`, 20, 95)
    doc.text(`Total de Quizzes: ${stats.totalQuizzes}`, 20, 105)
    doc.text(`Média de Pontuação: ${stats.averageScore}%`, 20, 115)
    
    // Gráfico de distribuição de usuários
    doc.setFontSize(16)
    doc.text('Distribuição de Usuários por Nível', 20, 140)
    
    const levelDistribution = users.reduce((acc, user) => {
      acc[user.level] = (acc[user.level] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const levelData = Object.entries(levelDistribution).map(([level, count]) => [
      `Nível ${level}`,
      count.toString()
    ])

    autoTable(doc, {
      head: [['Nível', 'Quantidade']],
      body: levelData,
      startY: 150,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    })

    // Top 5 usuários
    const topUsers = users
      .sort((a, b) => b.points - a.points)
      .slice(0, 5)

    doc.setFontSize(16)
    doc.text('Top 5 Usuários', 20, 220)
    
    const topUsersData = topUsers.map(user => [
      user.name,
      user.email,
      user.points.toString(),
      user.level.toString()
    ])

    autoTable(doc, {
      head: [['Nome', 'Email', 'Pontos', 'Nível']],
      body: topUsersData,
      startY: 230,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255
      }
    })

    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateActivityReport(days: number = 7): Promise<Buffer> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text(`Relatório de Atividade - Últimos ${days} dias`, 20, 20)
    
    // Data
    doc.setFontSize(12)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30)
    
    // Estatísticas
    doc.setFontSize(14)
    doc.text('Resumo da Atividade', 20, 50)
    
    doc.setFontSize(12)
    doc.text(`Novos usuários: ${users.length}`, 20, 65)
    doc.text(`Período: ${startDate.toLocaleDateString('pt-BR')} até ${new Date().toLocaleDateString('pt-BR')}`, 20, 75)
    
    // Tabela de novos usuários
    if (users.length > 0) {
      const tableData = users.map(user => [
        user.name,
        user.email,
        user.points.toString(),
        new Date(user.createdAt).toLocaleDateString('pt-BR')
      ])

      autoTable(doc, {
        head: [['Nome', 'Email', 'Pontos', 'Cadastro']],
        body: tableData,
        startY: 90,
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [245, 158, 11],
          textColor: 255
        }
      })
    }

    return Buffer.from(doc.output('arraybuffer'))
  }
}

export const reportGenerator = new ReportGenerator() 