'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, ChevronLeft, ChevronRight, Wrench, Calendar, DollarSign } from 'lucide-react'
import { manutencaoData, statusConfig, tipoConfig } from '../models/manutencao'

const PAGE_SIZE = 5

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatCurrency(value?: number) {
  if (!value) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function ManutencaoTable() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [tipoFilter, setTipoFilter]   = useState<string>('todos')
  const [page, setPage]               = useState(1)

  const filtered = useMemo(() => {
    return manutencaoData.filter((m) => {
      const matchSearch =
        m.veiculoPlaca.toLowerCase().includes(search.toLowerCase()) ||
        m.veiculoModelo.toLowerCase().includes(search.toLowerCase()) ||
        m.descricao.toLowerCase().includes(search.toLowerCase()) ||
        m.tecnicoResponsavel.toLowerCase().includes(search.toLowerCase())
      
      const matchStatus = statusFilter === 'todos' || m.status === statusFilter
      const matchTipo   = tipoFilter === 'todos' || m.tipo === tipoFilter
      
      return matchSearch && matchStatus && matchTipo
    })
  }, [search, statusFilter, tipoFilter])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleFilterChange = (type: 'status' | 'tipo', value: string) => {
    if (type === 'status') setStatusFilter(value)
    if (type === 'tipo')   setTipoFilter(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, modelo, descrição..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="todos">Todos status</option>
            <option value="agendada">Agendada</option>
            <option value="em-andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <select
            value={tipoFilter}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="todos">Todos tipos</option>
            <option value="preventiva">Preventiva</option>
            <option value="corretiva">Corretiva</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nova Manutenção
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Veículo</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Descrição</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">Técnico</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">Data</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">Custo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhuma manutenção encontrada.
                </td>
              </tr>
            ) : (
              paginated.map((m) => {
                const statusInfo = statusConfig[m.status]
                const tipoInfo   = tipoConfig[m.tipo]
                
                return (
                  <tr key={m.id} className="transition-colors hover:bg-muted/40">
                    {/* Veículo */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{m.veiculoPlaca}</p>
                        <p className="text-xs text-muted-foreground">{m.veiculoModelo}</p>
                      </div>
                    </td>
                    
                    {/* Tipo */}
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`text-sm font-medium ${tipoInfo.color}`}>
                        {tipoInfo.label}
                      </span>
                    </td>
                    
                    {/* Descrição */}
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground line-clamp-1 max-w-[200px]">
                        {m.descricao}
                      </p>
                    </td>
                    
                    {/* Técnico */}
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {m.tecnicoResponsavel}
                    </td>
                    
                    {/* Data */}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(m.dataAgendada)}
                        </div>
                        {m.dataRealizada && (
                          <div className="text-xs text-emerald-600 mt-0.5">
                            Realizada: {formatDate(m.dataRealizada)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Custo */}
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className={m.custo ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                          {formatCurrency(m.custo)}
                        </span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant={statusInfo.variant} className="text-xs">
                        {statusInfo.label}
                      </Badge>
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
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} de ${filtered.length} manutenções`}
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