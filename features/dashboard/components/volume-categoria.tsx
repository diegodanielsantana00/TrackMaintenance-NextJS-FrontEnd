'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { veiculosData } from '../../veiculos/models/veiculo'

// Classificar veículos como Leve ou Pesado baseado no modelo
function getVehicleCategory(modelo: string): 'Leve' | 'Pesado' {
  const pesadoModels = ['Volvo FH', 'Scania R', 'Mercedes Actros', 'DAF XF', 'Scania S', 'MAN TGX', 'Iveco Stralis']
  
  return pesadoModels.some(model => modelo.includes(model)) ? 'Pesado' : 'Leve'
}

export function VolumePorCategoria() {
  const categoryData = veiculosData.reduce((acc, veiculo) => {
    const category = getVehicleCategory(veiculo.modelo)
    
    if (!acc[category]) {
      acc[category] = { count: 0, km: 0 }
    }
    
    acc[category].count += 1
    acc[category].km += parseInt(veiculo.km.replace(/\D/g, ''))
    
    return acc
  }, {} as Record<string, { count: number; km: number }>)

  const chartData = Object.entries(categoryData).map(([name, data]) => ({
    name,
    viagens: data.count,
    km: data.km,
    percentage: ((data.count / veiculosData.length) * 100).toFixed(1)
  }))

  const colors = {
    'Leve': '#10B981',   // green
    'Pesado': '#4F46E5'  // indigo
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
                <p className="text-xs text-muted-foreground">
                  {item.km.toLocaleString('pt-BR')} km
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}