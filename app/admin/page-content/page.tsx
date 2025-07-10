"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { PlusIcon, TrashIcon, CheckCircleIcon, Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Block {
  id: string
  type: "title" | "text" | "image" | "button" | "video" | "list"
  value: string
  extra?: string
}

const blockTypes = [
  { type: "title", label: "Título" },
  { type: "text", label: "Texto" },
  { type: "image", label: "Imagem" },
  { type: "button", label: "Botão" },
  { type: "video", label: "Vídeo YouTube" },
  { type: "list", label: "Lista" },
]

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

function SortableBlock({block, index, onRemove, onEdit, listeners, attributes, isDragging}: any) {
  return (
    <div
      className={`relative group transition border-none bg-transparent p-0 mb-0 flex items-center`}
      {...attributes}
      {...listeners}
      style={{ cursor: 'grab' }}
    >
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
        <Bars3Icon className="w-5 h-5 text-secondary-400 cursor-grab" />
      </div>
      <div className="flex-1">
        {block.type === "title" && (
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-4 outline-none focus:ring-2 focus:ring-primary-400"
            onBlur={e => onEdit(block.id, e.currentTarget.innerText)}
            spellCheck={false}
          >{block.value}</h1>
        )}
        {block.type === "text" && (
          <p
            contentEditable
            suppressContentEditableWarning
            className="text-xl text-secondary-600 dark:text-secondary-300 mb-8 outline-none focus:ring-2 focus:ring-primary-400"
            onBlur={e => onEdit(block.id, e.currentTarget.innerText)}
            spellCheck={false}
          >{block.value}</p>
        )}
        {block.type === "image" && (
          <div className="flex flex-col items-center">
            <img src={block.value || "/placeholder.svg"} alt="Imagem" className="max-w-full rounded-lg mb-6 mx-auto" style={{maxHeight: 200}} />
            <input
              type="text"
              value={block.value}
              onChange={e => onEdit(block.id, e.target.value)}
              placeholder="URL da imagem"
              className="input w-full mt-2"
            />
          </div>
        )}
        {block.type === "button" && (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={block.value}
              onChange={e => onEdit(block.id, e.target.value, block.extra)}
              placeholder="Texto do botão"
              className="input w-full mb-2"
            />
            <input
              type="text"
              value={block.extra || ''}
              onChange={e => onEdit(block.id, block.value, e.target.value)}
              placeholder="URL do botão (ex: /register)"
              className="input w-full"
            />
            <a href={block.extra || '#'} className="btn-primary mt-2" target="_blank" rel="noopener noreferrer">{block.value || 'Botão'}</a>
          </div>
        )}
        {block.type === "video" && (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={block.value}
              onChange={e => onEdit(block.id, e.target.value)}
              placeholder="URL do vídeo do YouTube (ex: https://www.youtube.com/watch?v=...)"
              className="input w-full mb-2"
            />
            {block.value && (
              <div className="aspect-w-16 aspect-h-9 w-full max-w-xl mx-auto">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(block.value)}`}
                  title="Vídeo YouTube"
                  allowFullScreen
                  className="w-full h-64 rounded-lg border"
                />
              </div>
            )}
          </div>
        )}
        {block.type === "list" && (
          <div>
            <textarea
              value={block.value}
              onChange={e => onEdit(block.id, e.target.value)}
              placeholder="Itens da lista (um por linha)"
              className="input w-full mb-2"
              rows={3}
            />
            <ul className="list-disc pl-6">
              {block.value.split('\n').filter(Boolean).map((item: string, i: number) => (
                <li key={i} className="mb-1 text-secondary-800 dark:text-secondary-200">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(block.id)}
        className="ml-2 p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 opacity-0 group-hover:opacity-100 transition"
        title="Remover bloco"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)
  return match ? match[1] : ''
}

export default function AdminPageContent() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/page-content")
    const data = await res.json()
    if (data.content) {
      try {
        setBlocks(JSON.parse(data.content))
      } catch {
        setBlocks([])
      }
    }
    setLoading(false)
  }

  const saveContent = async () => {
    setSaving(true)
    await fetch("/api/admin/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: JSON.stringify(blocks) })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addBlock = (type: Block["type"]) => {
    let value = ''
    let extra = undefined
    if (type === 'title') value = 'Novo título'
    if (type === 'text') value = 'Novo texto'
    if (type === 'button') value = 'Clique aqui'
    if (type === 'list') value = 'Item 1\nItem 2\nItem 3'
    setBlocks([...blocks, { id: Date.now().toString(), type, value, extra }])
  }

  const updateBlock = (id: string, value: string, extra?: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value, extra: extra ?? b.extra } : b))
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
  }

  // dnd-kit setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)
      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 p-6 flex flex-col space-y-4 sticky top-0 h-screen z-40">
        <h2 className="text-lg font-bold mb-4 text-primary-600 dark:text-primary-400">Blocos</h2>
        {blockTypes.map(bt => (
          <button
            key={bt.type}
            onClick={() => addBlock(bt.type as Block["type"])}
            className="flex items-center px-4 py-2 rounded-lg shadow bg-primary-600 hover:bg-primary-700 text-white font-semibold transition"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> {bt.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={saveContent}
          disabled={saving}
          className="btn-primary flex items-center justify-center w-full mt-8"
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" /> {saving ? "Salvando..." : "Salvar"}
        </button>
        {saved && (
          <div className="mt-4 flex items-center justify-center bg-green-100 text-green-700 rounded-lg px-4 py-2">
            <CheckCircleIcon className="w-5 h-5 mr-2" /> Salvo!
          </div>
        )}
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="btn-secondary mt-8"
        >Voltar</button>
      </aside>
      {/* Editor visual central com layout real */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-30">
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
        {/* Hero Section com blocos editáveis */}
        <section className="relative overflow-hidden pt-16 pb-20 flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-6">
                  {loading ? (
                    <div>Carregando...</div>
                  ) : blocks.length === 0 ? (
                    <>
                      <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-4">
                        Aprenda com <span className="text-primary-600 dark:text-primary-400">IA</span>
                      </h1>
                      <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8">
                        Plataforma de aprendizado revolucionária com 30 módulos interativos, IA exclusiva para usuários Premium e sistema gamificado completo.
                      </p>
                    </>
                  ) : (
                    blocks.map((block, idx) => (
                      <SortableBlockWrapper key={block.id} id={block.id}>
                        <SortableBlock
                          block={block}
                          index={idx}
                          onRemove={removeBlock}
                          onEdit={updateBlock}
                        />
                      </SortableBlockWrapper>
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
            {/* Botões principais fixos */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Começar Gratuitamente
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                Ver Recursos
              </Link>
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
    </div>
  )
}

// Sortable wrapper para dnd-kit
function SortableBlockWrapper({ id, children }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1
  }
  return (
    <div ref={setNodeRef} style={style}>
      {children && typeof children === 'object' ?
        // Passa listeners/attributes para o bloco filho
        children.type === SortableBlock ?
          children && { ...children, props: { ...children.props, listeners, attributes, isDragging } } :
          children
        : children}
    </div>
  )
} 