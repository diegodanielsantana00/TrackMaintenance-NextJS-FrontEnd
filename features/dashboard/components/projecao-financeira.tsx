'use client'

import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { manutencaoData } from '../../manutencao/models/manutencao'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value)
}

export function ProjecaoFinanceira() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Calcular custos do mês atual (agendadas + em andamento)
  const custoMensal = manutencaoData
    .filter(m => {
      const dataManutencao = new Date(m.dataAgendada)
      return dataManutencao.getMonth() === currentMonth && 
             dataManutencao.getFullYear() === currentYear &&
             (m.status === 'agendada' || m.status === 'em-andamento') &&
             m.custo
    })
    .reduce((total, m) => total + (m.custo || 0), 0)

  // Calcular custos já realizados este mês
  const custoRealizado = manutencaoData
    .filter(m => {
      if (!m.dataRealizada) return false
      const dataRealizada = new Date(m.dataRealizada)
      return dataRealizada.getMonth() === currentMonth && 
             dataRealizada.getFullYear() === currentYear &&
             m.status === 'concluida' &&
             m.custo
    })
    .reduce((total, m) => total + (m.custo || 0), 0)

  const custoTotal = custoMensal + custoRealizado

  // Contar manutenções agendadas
  const manutencoesPendentes = manutencaoData.filter(m => {
    const dataManutencao = new Date(m.dataAgendada)
    return dataManutencao.getMonth() === currentMonth && 
           dataManutencao.getFullYear() === currentYear &&
           (m.status === 'agendada' || m.status === 'em-andamento')
  }).length

  const manutencoesConcluidas = manutencaoData.filter(m => {
    if (!m.dataRealizada) return false
    const dataRealizada = new Date(m.dataRealizada)
    return dataRealizada.getMonth() === currentMonth && 
           dataRealizada.getFullYear() === currentYear &&
           m.status === 'concluida'
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
          {manutencaoData
            .filter(m => {
              const dataManutencao = new Date(m.dataAgendada)
              return dataManutencao.getMonth() === currentMonth && 
                     dataManutencao.getFullYear() === currentYear &&
                     (m.status === 'agendada' || m.status === 'em-andamento') &&
                     m.custo
            })
            .sort((a, b) => (b.custo || 0) - (a.custo || 0))
            .slice(0, 2)
            .map(m => (
              <div key={m.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-medium text-foreground">{m.veiculoPlaca}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.descricao}</p>
                </div>
                <p className="text-xs font-bold text-foreground">{formatCurrency(m.custo || 0)}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}