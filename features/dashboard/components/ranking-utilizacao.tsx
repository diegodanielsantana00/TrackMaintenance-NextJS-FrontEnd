'use client'

import { useEffect, useState } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'
import { veiculoService } from '../../veiculos/services/veiculo-service'
import type { Veiculo } from '../../veiculos/models/veiculo'

export function RankingUtilizacao() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  useEffect(() => {
    veiculoService.list(0, 5).then((res) => setVeiculos(res.data)).catch(() => {})
  }, [])

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {position}
          </span>
        )
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'border-l-yellow-500 bg-yellow-50/50'
      case 2: return 'border-l-gray-400 bg-gray-50/50'  
      case 3: return 'border-l-amber-600 bg-amber-50/50'
      default: return 'border-l-muted bg-muted/20'
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Últimos Veículos</h3>
        <Trophy className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {veiculos.map((veiculo, index) => {
          const position = index + 1
          
          return (
            <div 
              key={veiculo.id}
              className={`flex items-center gap-3 rounded-lg border-l-4 p-3 ${getRankColor(position)}`}
            >
              <div className="flex items-center justify-center">
                {getRankIcon(position)}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {veiculo.placa}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {veiculo.modelo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      {veiculo.tipo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {veiculo.ano || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}