'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
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
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Calendar, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { viagemService } from '../services/viagem.service'
import { veiculoService } from '@/features/veiculos/services/veiculo-service'
import type { Viagem, ViagemRequest, UpdateViagemRequest } from '../models/viagem'
import type { Veiculo } from '@/features/veiculos/models/veiculo'
import { ApiError } from '@/lib/api'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ' '
  const isoStr = dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00'
  return new Date(isoStr).toLocaleDateString('pt-BR')
}

export function ViagensTable() {
  const [viagens, setViagens] = useState<Viagem[]>([])
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
  const [formDataSaida, setFormDataSaida]       = useState('')
  const [formDataChegada, setFormDataChegada] = useState('')
  const [formOrigem, setFormOrigem]   = useState('')
  const [formDestino, setFormDestino] = useState('')
  const [formKmPercorrida, setFormKmPercorrida] = useState('')

  const fetchViagens = useCallback(async () => {
    setLoading(true)
    try {
      const res = await viagemService.getViagens(page, pageSize)
      setViagens(res.data ?? [])
      setTotalPages(res.totalPages ?? 1)
      setTotalElements(res.totalElements ?? 0)
    } catch {
      toast.error('Erro ao carregar viagens.')
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
    fetchViagens()
  }, [fetchViagens])

  useEffect(() => {
    fetchVeiculos()
  }, [fetchVeiculos])

  const filtered = viagens.filter((v) => {
    const q = search.toLowerCase()
    return (
      v.origem.toLowerCase().includes(q) ||
      v.destino.toLowerCase().includes(q)
    )
  })

  // CRUD handlers
  const openCreate = () => {
    setDialogMode('create')
    setEditingId(null)
    setFormVeiculoId('')
    setFormDataSaida('')
    setFormDataChegada('')
    setFormOrigem('')
    setFormDestino('')
    setFormKmPercorrida('')
    setDialogOpen(true)
  }

  const openEdit = (v: Viagem) => {
    setDialogMode('edit')
    setEditingId(v.id)
    setFormVeiculoId(v.veiculoId.toString())
    setFormDataSaida(v.dataSaida.split('T')[0])
    setFormDataChegada(v.dataChegada ? v.dataChegada.split('T')[0] : '')
    setFormOrigem(v.origem)
    setFormDestino(v.destino)
    setFormKmPercorrida(v.kmPercorrida?.toString() ?? '')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (dialogMode === 'create') {
        const payload: ViagemRequest = {
          veiculoId: parseInt(formVeiculoId),
          dataSaida: formDataSaida ? `${formDataSaida}T00:00:00` : '',
          dataChegada: formDataChegada ? `${formDataChegada}T00:00:00` : null,
          origem: formOrigem,
          destino: formDestino,
          kmPercorrida: formKmPercorrida ? parseFloat(formKmPercorrida) : 0, // BUG 2: Aceita negativos no backend
        }
        await viagemService.createViagem(payload)
        toast.success('Viagem agendada com sucesso!')
      } else {
        const payload: UpdateViagemRequest = {
          veiculoId: parseInt(formVeiculoId), // BUG 4: O backend ignora isso, mas enviamos
          dataSaida: formDataSaida ? `${formDataSaida}T00:00:00` : '',
          dataChegada: formDataChegada ? `${formDataChegada}T00:00:00` : null,
          origem: formOrigem,
          destino: formDestino,
          kmPercorrida: formKmPercorrida ? parseFloat(formKmPercorrida) : 0,
        }
        await viagemService.updateViagem(editingId!, payload)
        toast.success('Viagem atualizada com sucesso!')
      }
      setDialogOpen(false)
      fetchViagens()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao salvar viagem.')
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
      await viagemService.deleteViagem(deletingId)
      toast.success('Viagem removida com sucesso!')
      setDeleteOpen(false)
      fetchViagens()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao remover viagem.')
      }
    } finally {
      setDeleting(false)
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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por origem ou destino..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova Viagem
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Veículo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Trajeto</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">Data Saída</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">Chegada</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">KM Percorrida</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhuma viagem encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const veiculo = veiculos.find(ve => ve.id === v.veiculoId)
                return (
                  <tr key={v.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{veiculo?.placa || 'Desconhecido'}</p>
                        <p className="text-xs text-muted-foreground">{veiculo?.modelo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                         <MapPin className="h-3 w-3" />
                         {v.origem} - {v.destino}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(v.dataSaida)}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {formatDate(v.dataChegada)}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <span className={v.kmPercorrida != null ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                          {v.kmPercorrida} km
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(v)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => openDelete(v.id)}>
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
            onClick={() => setPage((p) => Math.max(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Adicionar Viagem' : 'Editar Viagem'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Input
                  id="origem"
                  placeholder="Ex: São Paulo"
                  value={formOrigem}
                  onChange={(e) => setFormOrigem(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Input
                  id="destino"
                  placeholder="Ex: Rio de Janeiro"
                  value={formDestino}
                  onChange={(e) => setFormDestino(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataSaida">Data Saída</Label>
                <Input
                  id="dataSaida"
                  type="date"
                  value={formDataSaida}
                  onChange={(e) => setFormDataSaida(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataChegada">Data Chegada</Label>
                <Input
                  id="dataChegada"
                  type="date"
                  value={formDataChegada}
                  onChange={(e) => setFormDataChegada(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kmPercorrida">Quilometragem Percorrida (KM)</Label>
              <Input
                id="kmPercorrida"
                type="number"
                step="0.1"
                placeholder="Ex: 400.5"
                value={formKmPercorrida}
                onChange={(e) => setFormKmPercorrida(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formDataSaida || !formVeiculoId}
            >
              {saving ? 'Salvando...' : dialogMode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Tem certeza que deseja remover esta viagem? Esta ação não pode ser desfeita.
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
