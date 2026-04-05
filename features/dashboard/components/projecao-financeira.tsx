'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Wrench } from 'lucide-react'
import { dashboardService } from '../services/dashboard-service'
import type { ProjecaoFinanceira as ProjecaoData } from '../models/dashboard'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value)
}

const meses = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function ProjecaoFinanceira() {
  const [data, setData] = useState<ProjecaoData | null>(null)

  useEffect(() => {
    dashboardService.getProjecaoFinanceira()
      .then((res) => setData(res.data ?? null))
      .catch(() => {})
  }, [])

  const mesLabel = data ? `${meses[data.mes]} ${data.ano}` : ''

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Projeção Financeira</h3>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{mesLabel}</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(data?.custoTotal ?? 0)}</p>
          <p className="text-xs text-muted-foreground">Custo total estimado em manutenções</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Wrench className="h-4 w-4" />
          <p className="text-sm">{data?.totalManutencoes ?? 0} manutenções no mês</p>
        </div>
      </div>
    </div>
  )
}