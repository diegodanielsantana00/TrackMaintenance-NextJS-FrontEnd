'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts'

const data = [
  { category: 'Alimenticios', atual: 85, anterior: 70 },
  { category: 'Eletronicos', atual: 72, anterior: 65 },
  { category: 'Vestuario', atual: 68, anterior: 80 },
  { category: 'Moveis', atual: 55, anterior: 45 },
  { category: 'Outros', atual: 78, anterior: 60 },
  { category: 'Pereciveis', atual: 90, anterior: 75 },
]

export function CategoryRadar() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 font-semibold text-foreground">Categorias de Carga</h3>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fontSize: 10, fill: '#6B7280' }}
            />
            <Radar
              name="Mes Atual"
              dataKey="atual"
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.3}
            />
            <Radar
              name="Mes Anterior"
              dataKey="anterior"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.2}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
