'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Cell
} from 'recharts'

const data = [
  { range: 'Seg', value: 64, color: '#4F46E5' },
  { range: 'Ter', value: 58, color: '#4F46E5' },
  { range: 'Qua', value: 72, color: '#4F46E5' },
  { range: 'Qui', value: 45, color: '#4F46E5' },
  { range: 'Sex', value: 85, color: '#4F46E5' },
  { range: 'Sab', value: 32, color: '#93C5FD' },
  { range: 'Dom', value: 18, color: '#93C5FD' },
]

export function DeliveryChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Entregas por Dia</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Dias Uteis</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-300" />
            <span className="text-xs text-muted-foreground">Fim de Semana</span>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barCategoryGap="20%">
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="range" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              width={40}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
