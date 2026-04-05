'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { dashboardService } from '../services/dashboard-service'
import type { VeiculoPorCategoria } from '../models/dashboard'

export function VolumePorCategoria() {
  const [data, setData] = useState<VeiculoPorCategoria[]>([])

  useEffect(() => {
    dashboardService.getVolumePorCategoria()
      .then((res) => setData(res.data ?? []))
      .catch(() => {})
  }, [])

  const chartData = data.map((item) => ({
    name: item.tipo === 'PESADO' ? 'Pesado' : 'Leve',
    viagens: item.quantidade,
    percentage: item.percentual.toFixed(1),
  }))

  const colors: Record<string, string> = {
    'Leve': '#10B981',
    'Pesado': '#4F46E5',
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 font-semibold text-foreground">Volume por Categoria</h3>
      
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="h-48 w-48 shrink-0">
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
                    fill={colors[entry.name] ?? '#888'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} viagens`, 'Quantidade']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col gap-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: colors[item.name] ?? '#888' }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.viagens} viagens ({item.percentage}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}