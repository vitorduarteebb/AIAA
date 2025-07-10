"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Log {
  id: string
  userId: string
  user: { name: string; email: string }
  message: string
  response: string
  status: string
  createdAt: string
}

export default function AdminAILogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(50)
  const router = useRouter()

  useEffect(() => {
    loadLogs()
  }, [search, status, page])

  const loadLogs = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.append("userId", search)
    if (status) params.append("status", status)
    params.append("limit", limit.toString())
    params.append("skip", ((page - 1) * limit).toString())
    const res = await fetch(`/api/admin/ai-logs?${params.toString()}`)
    const data = await res.json()
    setLogs(data.logs)
    setTotal(data.total)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <header className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
              >
                <span>Voltar</span>
              </button>
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Logs de Uso da IA
              </h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
          <input
            type="text"
            placeholder="Buscar por ID do usuário..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input w-full md:w-64"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="">Todos os Status</option>
            <option value="success">Sucesso</option>
            <option value="error">Erro</option>
            <option value="limit">Limite</option>
          </select>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Usuário</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Mensagem</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Resposta</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Carregando...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">Nenhum log encontrado.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium text-secondary-900 dark:text-white">{log.user?.name || log.userId}</div>
                      <div className="text-xs text-secondary-500">{log.user?.email}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-pre-line text-xs max-w-xs break-words">{log.message}</td>
                    <td className="px-4 py-2 whitespace-pre-line text-xs max-w-xs break-words">{log.response}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'limit' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Paginação */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-secondary-500">Total: {total}</span>
          <div className="space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary"
            >Anterior</button>
            <span className="text-sm">Página {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= total}
              className="btn-secondary"
            >Próxima</button>
          </div>
        </div>
      </div>
    </div>
  )
} 