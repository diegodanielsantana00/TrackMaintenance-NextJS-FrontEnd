'use client'

import { TrendingUp } from 'lucide-react'
import { veiculosData } from '../../veiculos/models/veiculo'

export function TotalKm() {
  const totalKm = veiculosData.reduce((sum, veiculo) => {
    const km = parseInt(veiculo.km.replace(/\D/g, '')) // Remove pontos e vírgulas
    return sum + km
  }, 0)

  const formattedKm = totalKm.toLocaleString('pt-BR')

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de KM Percorrido</p>
          <p className="text-2xl font-bold text-foreground">{formattedKm} km</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Quilometragem acumulada de toda a frota
      </p>
    </div>
  )
}