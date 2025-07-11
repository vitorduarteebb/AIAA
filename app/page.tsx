import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface Block {
  id: string
  type: 'title' | 'text' | 'image'
  value: string
}

const features = [
  {
    icon: '💡',
    title: 'IA Exclusiva Premium',
    description: 'Acesso a inteligência artificial avançada para aprendizado personalizado.'
  },
  {
    icon: '🏆',
    title: 'Sistema de Conquistas',
    description: 'Ganhe pontos e suba no ranking global com suas conquistas.'
  },
  {
    icon: '👥',
    title: 'Comunidade Ativa',
    description: 'Conecte-se com outros estudantes e compartilhe experiências.'
  },
  {
    icon: '🎮',
    title: '30 Módulos Interativos',
    description: 'Conteúdo estruturado em 10 básicos, 10 médios e 10 avançados.'
  },
  {
    icon: '⭐',
    title: 'Aprendizado Gamificado',
    description: 'Quiz interativo com feedback imediato e progresso visual.'
  }
]

export default async function LandingPage() {
  // Buscar conteúdo salvo
  let blocks: Block[] = []
  try {
    const page = await prisma.pageContent.findUnique({ where: { slug: 'landing' } })
    if (page?.content) {
      blocks = JSON.parse(page.content)
    }
  } catch (error) {
    console.error('Erro ao carregar conteúdo da página:', error)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                AIA
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-secondary">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary">
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section com blocos do editor */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            {blocks.length === 0 ? (
              <>
                <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-4">
                  Aprenda com <span className="text-primary-600 dark:text-primary-400">IA</span>
                </h1>
                <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8">
                  Plataforma de aprendizado revolucionária com 30 módulos interativos, IA exclusiva para usuários Premium e sistema gamificado completo.
                </p>
              </>
            ) : (
              blocks.map(block => (
                <div key={block.id}>
                  {block.type === 'title' && <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-4">{block.value}</h1>}
                  {block.type === 'text' && <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8">{block.value}</p>}
                  {block.type === 'image' && block.value && (
                    <img src={block.value} alt="Imagem" className="max-w-full rounded-lg mb-6 mx-auto" />
                  )}
                </div>
              ))
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Começar Gratuitamente
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                Ver Recursos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
              Por que escolher a AIA?
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300">
              Recursos exclusivos para maximizar seu aprendizado
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="card p-6 text-center bg-secondary-50 dark:bg-secondary-900 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">AIA</h3>
            <p className="text-secondary-300 mb-6">
              Plataforma de aprendizado com IA integrada
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/sobre" className="text-secondary-300 hover:text-white">
                Sobre
              </Link>
              <Link href="/contato" className="text-secondary-300 hover:text-white">
                Contato
              </Link>
              <Link href="/privacidade" className="text-secondary-300 hover:text-white">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
} 