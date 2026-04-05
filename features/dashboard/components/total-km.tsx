'use client'

import { useEffect, useState, useCallback } from 'react'
import { Route } from 'lucide-react'
import { dashboardService } from '../services/dashboard-service'
import { veiculoService } from '../../veiculos/services/veiculo-service'
import type { Veiculo } from '../../veiculos/models/veiculo'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function formatKm(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(value)
}

export function TotalKm() {
  const [totalKm, setTotalKm] = useState(0)
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string>('todos')

  useEffect(() => {
    veiculoService.list(0, 100)
      .then((res) => setVeiculos(res.data))
      .catch(() => {})
  }, [])

  const fetchTotalKm = useCallback(() => {
    const veiculoId = selectedVeiculoId === 'todos' ? undefined : Number(selectedVeiculoId)
    dashboardService.getTotalKm(veiculoId)
      .then((res) => setTotalKm(res.data?.totalKm ?? 0))
      .catch(() => {})
  }, [selectedVeiculoId])

  useEffect(() => {
    fetchTotalKm()
  }, [fetchTotalKm])

  const selectedLabel = selectedVeiculoId === 'todos'
    ? 'Toda a frota'
    : veiculos.find(v => v.id.toString() === selectedVeiculoId)?.placa ?? ''

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Total de KM Percorrido</h3>
        <Select value={selectedVeiculoId} onValueChange={setSelectedVeiculoId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Toda a frota</SelectItem>
            {veiculos.map((v) => (
              <SelectItem key={v.id} value={v.id.toString()}>
                {v.placa} - {v.modelo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-emerald-500/10 p-3">
          <Route className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{formatKm(totalKm)} km</p>
          <p className="text-sm text-muted-foreground">{selectedLabel}</p>
        </div>
      </div>
    </div>
  )
}