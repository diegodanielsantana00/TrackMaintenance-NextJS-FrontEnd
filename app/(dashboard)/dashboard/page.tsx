'use client'

import { Header } from '@/components/layout/header'
import { TotalKm } from '@/features/dashboard/components/total-km'
import { VolumePorCategoria } from '@/features/dashboard/components/volume-categoria'
import { CronogramaManutencao } from '@/features/dashboard/components/cronograma-manutencao'
import { RankingUtilizacao } from '@/features/dashboard/components/ranking-utilizacao'
import { ProjecaoFinanceira } from '@/features/dashboard/components/projecao-financeira'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        titulo="Dashboard"
        subtitulo="Visao geral da sua operacao logistica"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Primeira linha - KM Total */}
        <div className="grid gap-6">
          <TotalKm />
        </div>

        {/* Segunda linha - Gráficos e Cronograma */}
        <div className="grid gap-6 lg:grid-cols-2">
          <VolumePorCategoria />
          <CronogramaManutencao />
        </div>

        {/* Terceira linha - Ranking e Projeção */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RankingUtilizacao />
          <ProjecaoFinanceira />
        </div>
      </div>
    </div>
  )
}
