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
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { veiculoService } from '../services/veiculo-service'
import type { Veiculo, VeiculoRequest, TipoVeiculo } from '../models/veiculo'
import { tipoConfig } from '../models/veiculo'
import { ApiError } from '@/lib/api'

export function VeiculosTable() {
  const [veiculos, setVeiculos]       = useState<Veiculo[]>([])
  const [loading, setLoading]         = useState(true)
  const [page, setPage]               = useState(0)
  const [pageSize, setPageSize]       = useState(10)
  const [totalPages, setTotalPages]   = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch]           = useState('')

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
  const [formPlaca, setFormPlaca]     = useState('')
  const [formModelo, setFormModelo]   = useState('')
  const [formTipo, setFormTipo]       = useState<TipoVeiculo>('LEVE')
  const [formAno, setFormAno]         = useState('')

  const fetchVeiculos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await veiculoService.list(page, pageSize)
      setVeiculos(res.data ?? [])
      setTotalPages(res.totalPages ?? 1)
      setTotalElements(res.totalElements ?? 0)
    } catch {
      toast.error('Erro ao carregar veículos.')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchVeiculos()
  }, [fetchVeiculos])

  const filtered = veiculos.filter((v) => {
    const q = search.toLowerCase()
    return (
      v.placa.toLowerCase().includes(q) ||
      v.modelo.toLowerCase().includes(q)
    )
  })

  // CRUD handlers
  const openCreate = () => {
    setDialogMode('create')
    setEditingId(null)
    setFormPlaca('')
    setFormModelo('')
    setFormTipo('LEVE')
    setFormAno('')
    setDialogOpen(true)
  }

  const openEdit = (v: Veiculo) => {
    setDialogMode('edit')
    setEditingId(v.id)
    setFormPlaca(v.placa)
    setFormModelo(v.modelo)
    setFormTipo(v.tipo)
    setFormAno(v.ano?.toString() || '')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: VeiculoRequest = {
      placa: formPlaca,
      modelo: formModelo,
      tipo: formTipo,
      ano: formAno ? parseInt(formAno) : null,
    }

    try {
      if (dialogMode === 'create') {
        await veiculoService.create(payload)
        toast.success('Veículo criado com sucesso!')
      } else {
        await veiculoService.update(editingId!, payload)
        toast.success('Veículo atualizado com sucesso!')
      }
      setDialogOpen(false)
      fetchVeiculos()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao salvar veículo.')
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
      await veiculoService.delete(deletingId)
      toast.success('Veículo removido com sucesso!')
      setDeleteOpen(false)
      fetchVeiculos()
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao remover veículo.')
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
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
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
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">Tipo</th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">Ano</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhum veículo encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const t = tipoConfig[v.tipo]
                return (
                  <tr key={v.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">{v.placa}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.modelo}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge variant={t.variant} className="text-xs">{t.label}</Badge>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {v.ano || '—'}
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

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Linhas por página:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
          <span>
            {totalElements === 0
              ? 'Nenhum resultado'
              : `${startItem}–${endItem} de ${totalElements}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
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
              {dialogMode === 'create' ? 'Adicionar Veículo' : 'Editar Veículo'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="placa">Placa</Label>
              <Input
                id="placa"
                placeholder="ABC-1234"
                value={formPlaca}
                onChange={(e) => setFormPlaca(e.target.value.toUpperCase())}
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                placeholder="Ex: Volvo FH 540"
                value={formModelo}
                onChange={(e) => setFormModelo(e.target.value)}
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formTipo} onValueChange={(v) => setFormTipo(v as TipoVeiculo)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEVE">Leve</SelectItem>
                  <SelectItem value="PESADO">Pesado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                placeholder="Ex: 2024"
                value={formAno}
                onChange={(e) => setFormAno(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !formPlaca || !formModelo}>
              {saving ? 'Salvando...' : dialogMode === 'create' ? 'Criar' : 'Salvar'}
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
            Tem certeza que deseja remover este veículo? Esta ação não pode ser desfeita.
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
