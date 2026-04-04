'use client'

import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { veiculoService } from '../../veiculos/services/veiculo-service'

export function TotalKm() {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    veiculoService.list(0, 100).then((res) => setTotal(res.totalElements)).catch(() => {})
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total de Veículos</p>
          <p className="text-2xl font-bold text-foreground">{total}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <Truck className="h-6 w-6 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Veículos cadastrados na frota
      </p>
    </div>
  )
}