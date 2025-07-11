'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    question: "Como começar a usar a plataforma?",
    answer: "Para começar, crie uma conta gratuita, faça login e explore os módulos disponíveis. Você pode começar com qualquer módulo que desejar.",
    category: "Primeiros Passos"
  },
  {
    question: "Como funciona o sistema de pontos?",
    answer: "Você ganha pontos completando aulas, passando em quizzes e participando ativamente da plataforma. Os pontos determinam seu nível e posição no ranking.",
    category: "Gamificação"
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento através da página de faturamento. O acesso será mantido até o final do período atual.",
    category: "Faturamento"
  },
  {
    question: "Como funciona o chat com IA?",
    answer: "O chat com IA está disponível para responder suas dúvidas sobre o conteúdo dos cursos. Basta clicar no ícone do chat no canto inferior direito.",
    category: "Funcionalidades"
  },
  {
    question: "Posso baixar o conteúdo para estudar offline?",
    answer: "Atualmente, o conteúdo está disponível apenas online. Estamos trabalhando para implementar downloads em breve.",
    category: "Funcionalidades"
  },
  {
    question: "Como reportar um problema técnico?",
    answer: "Use o formulário de contato abaixo ou envie um email para suporte@aia-learning.com. Inclua detalhes sobre o problema para que possamos ajudar melhor.",
    category: "Suporte"
  }
]

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const categories = ['Todos', ...Array.from(new Set(faqs.map(faq => faq.category)))]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      })
      if (response.ok) {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setContactForm({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">❓ Ajuda e Suporte</h1>
            <p className="text-lg text-gray-600">Encontre respostas para suas dúvidas ou entre em contato conosco</p>
          </div>

          {/* Busca e Filtros */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhuma pergunta encontrada com os filtros selecionados.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      {faq.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-700">suporte@aia-learning.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Chat ao vivo disponível 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Resposta em até 24 horas</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Descreva seu problema ou dúvida..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 