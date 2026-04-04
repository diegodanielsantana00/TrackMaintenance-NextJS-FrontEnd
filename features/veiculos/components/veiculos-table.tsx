'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { veiculosData, statusConfig } from '../models/veiculo'

const PAGE_SIZE = 5

export function VeiculosTable() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [page, setPage]               = useState(1)

  const filtered = useMemo(() => {
    return veiculosData.filter((v) => {
      const matchSearch =
        v.placa.toLowerCase().includes(search.toLowerCase()) ||
        v.modelo.toLowerCase().includes(search.toLowerCase()) ||
        v.localizacao.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'todos' || v.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleFilterChange = (value: string) => { setStatusFilter(value); setPage(1) }
  const handleSearchChange = (value: string) => { setSearch(value);       setPage(1) }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, modelo..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="todos">Todos os status</option>
            <option value="disponivel">Disponível</option>
            <option value="em-transito">Em Trânsito</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Adicionar Veículo
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Placa</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Modelo</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">Localização</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">KM</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">Combustível</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhum veículo encontrado.
                </td>
              </tr>
            ) : (
              paginated.map((v) => {
                const s = statusConfig[v.status]
                return (
                  <tr key={v.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">{v.placa}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.modelo}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{v.localizacao}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{v.km} km</td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              v.combustivel > 70 ? 'bg-emerald-500' : v.combustivel > 40 ? 'bg-amber-500' : 'bg-destructive'
                            }`}
                            style={{ width: `${v.combustivel}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{v.combustivel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length === 0
            ? 'Nenhum resultado'
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} de ${filtered.length} veículos`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === currentPage ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPage(n)}
              className="h-8 w-8 p-0 text-xs"
            >
              {n}
            </Button>
          ))}
          <Button
            variant="ghost" size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
