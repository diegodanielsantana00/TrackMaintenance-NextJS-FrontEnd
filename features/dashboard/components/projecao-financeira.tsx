'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { manutencaoService } from '../../manutencao/services/manutencao-service'
import type { Manutencao } from '../../manutencao/models/manutencao'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value)
}

export function ProjecaoFinanceira() {
  const [data, setData] = useState<Manutencao[]>([])

  useEffect(() => {
    manutencaoService.list(0, 100)
      .then((res) => setData(res.data ?? []))
      .catch(() => {})
  }, [])

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Calcular custos do mês atual (pendentes + em realização)
  const custoMensal = data
    .filter(m => {
      const dataManutencao = new Date(m.dataInicio + 'T00:00:00')
      return dataManutencao.getMonth() === currentMonth && 
             dataManutencao.getFullYear() === currentYear &&
             (m.status === 'PENDENTE' || m.status === 'EM_REALIZACAO') &&
             m.custoEstimado
    })
    .reduce((total, m) => total + (m.custoEstimado || 0), 0)

  // Calcular custos já realizados este mês
  const custoRealizado = data
    .filter(m => {
      const dataManutencao = new Date(m.dataInicio + 'T00:00:00')
      return dataManutencao.getMonth() === currentMonth && 
             dataManutencao.getFullYear() === currentYear &&
             m.status === 'CONCLUIDA' &&
             m.custoEstimado
    })
    .reduce((total, m) => total + (m.custoEstimado || 0), 0)

  const custoTotal = custoMensal + custoRealizado

  // Contar manutenções pendentes
  const manutencoesPendentes = data.filter(m => {
    const dataManutencao = new Date(m.dataInicio + 'T00:00:00')
    return dataManutencao.getMonth() === currentMonth && 
           dataManutencao.getFullYear() === currentYear &&
           (m.status === 'PENDENTE' || m.status === 'EM_REALIZACAO')
  }).length

  const manutencoesConcluidas = data.filter(m => {
    const dataManutencao = new Date(m.dataInicio + 'T00:00:00')
    return dataManutencao.getMonth() === currentMonth && 
           dataManutencao.getFullYear() === currentYear &&
           m.status === 'CONCLUIDA'
  }).length

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Projeção Financeira</h3>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {/* Total do Mês */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Abril 2026</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(custoTotal)}</p>
          <p className="text-xs text-muted-foreground">Custo total em manutenções</p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <p className="text-xs font-medium text-muted-foreground">Realizado</p>
            </div>
            <p className="text-sm font-bold text-foreground">{formatCurrency(custoRealizado)}</p>
            <p className="text-xs text-muted-foreground">{manutencoesConcluidas} manutenções</p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-amber-600" />
              <p className="text-xs font-medium text-muted-foreground">Estimado</p>
            </div>
            <p className="text-sm font-bold text-foreground">{formatCurrency(custoMensal)}</p>
            <p className="text-xs text-muted-foreground">{manutencoesPendentes} pendentes</p>
          </div>
        </div>

        {/* Próximas Manutenções de Alto Custo */}
        <div className="border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Maiores custos pendentes:</p>
          {data
            .filter(m => {
              const dataManutencao = new Date(m.dataInicio + 'T00:00:00')
              return dataManutencao.getMonth() === currentMonth && 
                     dataManutencao.getFullYear() === currentYear &&
                     (m.status === 'PENDENTE' || m.status === 'EM_REALIZACAO') &&
                     m.custoEstimado
            })
            .sort((a, b) => (b.custoEstimado || 0) - (a.custoEstimado || 0))
            .slice(0, 2)
            .map(m => (
              <div key={m.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-medium text-foreground">{m.veiculoPlaca}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.tipoServico}</p>
                </div>
                <p className="text-xs font-bold text-foreground">{formatCurrency(m.custoEstimado || 0)}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}