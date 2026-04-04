'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { veiculoService } from '../../veiculos/services/veiculo-service'
import type { Veiculo } from '../../veiculos/models/veiculo'

export function VolumePorCategoria() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  useEffect(() => {
    veiculoService.list(0, 100).then((res) => setVeiculos(res.data)).catch(() => {})
  }, [])

  const categoryData = veiculos.reduce((acc, veiculo) => {
    const category = veiculo.tipo === 'PESADO' ? 'Pesado' : 'Leve'
    
    if (!acc[category]) {
      acc[category] = { count: 0 }
    }
    
    acc[category].count += 1
    
    return acc
  }, {} as Record<string, { count: number }>)

  const total = veiculos.length || 1

  const chartData = Object.entries(categoryData).map(([name, data]) => ({
    name,
    viagens: data.count,
    percentage: ((data.count / total) * 100).toFixed(1)
  }))

  const colors = {
    'Leve': '#10B981',
    'Pesado': '#4F46E5'
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 font-semibold text-foreground">Volume por Categoria</h3>
      
      <div className="flex items-center justify-between">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                paddingAngle={5}
                dataKey="viagens"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[entry.name as keyof typeof colors]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} veículos`, 'Quantidade']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col gap-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: colors[item.name as keyof typeof colors] }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.viagens} veículos ({item.percentage}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}