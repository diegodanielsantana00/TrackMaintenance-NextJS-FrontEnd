'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Calendar, DollarSign, ArrowRightLeft } from 'lucide-react'
import { toast } from 'sonner'
import { manutencaoService } from '../services/manutencao-service'
import { veiculoService } from '@/features/veiculos/services/veiculo-service'
import type { Manutencao, ManutencaoRequest, UpdateManutencaoRequest, StatusManutencao } from '../models/manutencao'
import { statusConfig, statusTransitions } from '../models/manutencao'
import type { Veiculo } from '@/features/veiculos/models/veiculo'
import { ApiError } from '@/lib/api'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ' '
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

function formatCurrency(value: number | null) {
  if (value == null) return ' '
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function ManutencaoTable() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([])
  const [loading, setLoading]         = useState(true)
  const [page, setPage]               = useState(0)
  const [pageSize, setPageSize]       = useState(10)
  const [totalPages, setTotalPages]   = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch]           = useState('')

  // Veículos for select
  const [veiculos, setVeiculos]       = useState<Veiculo[]>([])

  // Dialog state
  const [dialogOpen, setDialogOpen]   = useState(false)
  const [dialogMode, setDialogMode]   = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId]     = useState<number | null>(null)
  const [saving, setSaving]           = useState(false)

  // Delete dialog
  const [deleteOpen, setDeleteOpen]   = useState(false)
  const [deletingId, setDeletingId]   = useState<number | null>(null)
  const [deleting, setDeleting]       = useState(false)

  // Form fields
  const [formVeiculoId, setFormVeiculoId]       = useState('')
  const [formDataInicio, setFormDataInicio]       = useState('')
  const [formDataFinalizacao, setFormDataFinalizacao] = useState('')
  const [formTipoServico, setFormTipoServico]   = useState('')
  const [formCustoEstimado, setFormCustoEstimado] = useState('')
  const [formStatus, setFormStatus]             = useState<StatusManutencao>('PENDENTE')

  const fetchManutencoes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await manutencaoService.list(page, pageSize)
      setManutencoes(res.data ?? [])
      setTotalPages(res.totalPages ?? 1)
      setTotalElements(res.totalElements ?? 0)
    } catch {
      toast.error('Erro ao carregar manutenções.')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  const fetchVeiculos = useCallback(async () => {
    try {
      const res = await veiculoService.list(0, 100)
      setVeiculos(res.data ?? [])
    } catch {
      /* silently ignore */
    }
  }, [])

  useEffect(() => {
    fetchManutencoes()
  }, [fetchManutencoes])

  useEffect(() => {
    fetchVeiculos()
  }, [fetchVeiculos])

  const filtered = manutencoes.filter((m) => {
    const q = search.toLowerCase()
    return (
      m.veiculoPlaca.toLowerCase().includes(q) ||
      m.veiculoModelo.toLowerCase().includes(q) ||
      m.tipoServico.toLowerCase().includes(q)
    )
  })

  // CRUD handlers
  const openCreate = () => {
    setDialogMode('create')
    setEditingId(null)
    setFormVeiculoId('')
    setFormDataInicio('')
    setFormDataFinalizacao('')
    setFormTipoServico('')
    setFormCustoEstimado('')
    setFormStatus('PENDENTE')
    setDialogOpen(true)
  }

  const openEdit = (m: Manutencao) => {
    setDialogMode('edit')
    setEditingId(m.id)
    setFormVeiculoId(m.veiculoId.toString())
    setFormDataInicio(m.dataInicio)
    setFormDataFinalizacao(m.dataFinalizacao ?? '')
    setFormTipoServico(m.tipoServico)
    setFormCustoEstimado(m.custoEstimado?.toString() ?? '')
    setFormStatus(m.status)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (dialogMode === 'create') {
        const payload: ManutencaoRequest = {
          veiculoId: parseInt(formVeiculoId),
          dataInicio: formDataInicio,
          dataFinalizacao: formDataFinalizacao || null,
          tipoServico: formTipoServico,
          custoEstimado: formCustoEstimado ? parseFloat(formCustoEstimado) : null,
        }
        await manutencaoService.create(payload)
        toast.success('Manutenção agendada com sucesso!')
      } else {
        const payload: UpdateManutencaoRequest = {
          dataInicio: formDataInicio,
          dataFinalizacao: formDataFinalizacao || null,
          tipoServico: formTipoServico,
          custoEstimado: formCustoEstimado ? parseFloat(formCustoEstimado) : null,
          status: formStatus,
        }
        await manutencaoService.update(editingId!, payload)
        toast.success('Manutenção atualizada com sucesso!')
      }
      setDialogOpen(false)
      fetchManutencoes()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao salvar manutenção.')
      }
    } finally {
      setSaving(false)
    }
  }

  const openDelete = (id: number) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    try {
      await manutencaoService.delete(deletingId)
      toast.success('Manutenção removida com sucesso!')
      setDeleteOpen(false)
      fetchManutencoes()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao remover manutenção.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (id: number, status: StatusManutencao) => {
    try {
      await manutencaoService.updateStatus(id, status)
      toast.success('Status atualizado com sucesso!')
      fetchManutencoes()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao atualizar status.')
      }
    }
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value))
    setPage(0)
  }

  const startItem = totalElements === 0 ? 0 : page * pageSize + 1
  const endItem = Math.min((page + 1) * pageSize, totalElements)

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, modelo, serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova Manutenção
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Veículo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Serviço</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">Data Início</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">Finalização</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">Custo Est.</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhuma manutenção encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const s = statusConfig[m.status]
                return (
                  <tr key={m.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{m.veiculoPlaca}</p>
                        <p className="text-xs text-muted-foreground">{m.veiculoModelo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {m.tipoServico}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(m.dataInicio)}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {formatDate(m.dataFinalizacao)}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className={m.custoEstimado != null ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                          {formatCurrency(m.custoEstimado)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.variant} className="text-xs">
                        {s.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {statusTransitions[m.status] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2 text-xs"
                            onClick={() => handleStatusChange(m.id, statusTransitions[m.status]!)}
                            title={`Avançar para ${statusConfig[statusTransitions[m.status]!].label}`}
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                            <span className="hidden lg:inline">{statusConfig[statusTransitions[m.status]!].label}</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => openDelete(m.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Linhas por página:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs sm:text-sm">
            {totalElements === 0
              ? 'Nenhum resultado'
              : `${startItem}–${endItem} de ${totalElements}`}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1 sm:justify-end">
          <Button
            variant="ghost" size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i).map((n) => (
            <Button
              key={n}
              variant={n === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPage(n)}
              className="h-8 w-8 p-0 text-xs"
            >
              {n + 1}
            </Button>
          ))}
          <Button
            variant="ghost" size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Agendar Manutenção' : 'Editar Manutenção'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {dialogMode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="veiculoId">Veículo</Label>
                <Select value={formVeiculoId} onValueChange={setFormVeiculoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculos.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>
                        {v.placa}   {v.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="tipoServico">Tipo de Serviço</Label>
              <Input
                id="tipoServico"
                placeholder="Ex: Troca de Óleo"
                value={formTipoServico}
                onChange={(e) => setFormTipoServico(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formDataInicio}
                  onChange={(e) => setFormDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFinalizacao">Data Finalização</Label>
                <Input
                  id="dataFinalizacao"
                  type="date"
                  value={formDataFinalizacao}
                  onChange={(e) => setFormDataFinalizacao(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custoEstimado">Custo Estimado (R$)</Label>
              <Input
                id="custoEstimado"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 350.00"
                value={formCustoEstimado}
                onChange={(e) => setFormCustoEstimado(e.target.value)}
              />
            </div>
            {dialogMode === 'edit' && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as StatusManutencao)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={formStatus}>
                      {statusConfig[formStatus].label} (atual)
                    </SelectItem>
                    {statusTransitions[formStatus] && (
                      <SelectItem value={statusTransitions[formStatus]!}>
                        {statusConfig[statusTransitions[formStatus]!].label}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formTipoServico || !formDataInicio || (dialogMode === 'create' && !formVeiculoId)}
            >
              {saving ? 'Salvando...' : dialogMode === 'create' ? 'Agendar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Tem certeza que deseja remover esta manutenção? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}