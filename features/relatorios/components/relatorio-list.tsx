'use client'

import { useState } from 'react'
import {
  Route, Package, Wrench, TrendingUp, Truck,
  FileDown, Loader2, CheckCircle2, Clock,
  ChevronDown, RefreshCw, Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  relatoriosIniciais,
  categorias,
  type Relatorio,
  type RelatorioStatus,
} from '../models/relatorio'
import { gerarRelatorio, baixarPDF } from '../services/relatorio-service'

// ─── helpers ─────────────────────────────────────────────────────────────────

const iconeMap: Record<string, React.ReactNode> = {
  route:   <Route      className="h-4 w-4" />,
  package: <Package    className="h-4 w-4" />,
  wrench:  <Wrench     className="h-4 w-4" />,
  chart:   <TrendingUp className="h-4 w-4" />,
  truck:   <Truck      className="h-4 w-4" />,
}

function formatDate(iso?: string) {
  if (!iso) return null
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: RelatorioStatus }) {
  if (status === 'disponivel') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="h-3 w-3" />
        Disponível
      </span>
    )
  }
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        Em Processamento
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
        Erro
      </span>
    )
  }
  return null
}

// ─── main component ───────────────────────────────────────────────────────────

export function RelatorioList() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>(relatoriosIniciais)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categorias.map((c) => [c.id, true]))
  )

  const toggleCategory = (id: string) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }))

  const updateRelatorio = (id: string, patch: Partial<Relatorio>) =>
    setRelatorios((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const handleSolicitar = async (id: string) => {
    updateRelatorio(id, { status: 'processing' })
    try {
      const rel = relatorios.find((r) => r.id === id)!
      await gerarRelatorio(rel)
      updateRelatorio(id, { status: 'disponivel', ultimaGeracao: new Date().toISOString() })
    } catch {
      updateRelatorio(id, { status: 'error' })
    }
  }

  const handleBaixar = (id: string) => {
    const rel = relatorios.find((r) => r.id === id)
    if (rel) baixarPDF(rel)
  }

  return (
    <div className="space-y-3">
      {categorias.map((cat) => {
        const items = relatorios.filter((r) => r.categoria === cat.id)
        if (items.length === 0) return null
        const isOpen = openCategories[cat.id]

        return (
          <div key={cat.id} className="overflow-hidden rounded-lg border border-border bg-card">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Report rows */}
            {isOpen && (
              <div className="divide-y divide-border border-t border-border">
                {items.map((rel) => (
                  <div
                    key={rel.id}
                    className="grid grid-cols-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/20 sm:grid-cols-[auto_1fr_auto_auto_auto]"
                  >
                    {/* Icon */}
                    <div className="hidden h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground sm:flex">
                      {iconeMap[rel.icone] ?? <FileDown className="h-4 w-4" />}
                    </div>

                    {/* Name + description */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-foreground">{rel.nome}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{rel.descricao}</p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <StatusBadge status={rel.status} />
                    </div>

                    {/* Last generated */}
                    <div className="hidden items-center gap-1 whitespace-nowrap text-xs text-muted-foreground md:flex">
                      {rel.ultimaGeracao ? (
                        <>
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatDate(rel.ultimaGeracao)}
                        </>
                      ) : (
                        <span className="text-muted-foreground/50"> </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {rel.status === 'disponivel' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => handleBaixar(rel.id)}
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          Baixar
                        </Button>
                      )}
                      <Button
                        variant={rel.status === 'disponivel' ? 'outline' : 'default'}
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        disabled={rel.status === 'processing'}
                        onClick={() => handleSolicitar(rel.id)}
                      >
                        {rel.status === 'processing' ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Processando
                          </>
                        ) : rel.status === 'disponivel' ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            Novo
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Solicitar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
