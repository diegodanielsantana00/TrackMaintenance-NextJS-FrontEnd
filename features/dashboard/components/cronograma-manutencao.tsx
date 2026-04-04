'use client'

import { Calendar, Clock, Wrench, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { manutencaoData, tipoConfig } from '../../manutencao/models/manutencao'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

function getDaysUntil(dateStr: string) {
  const target = new Date(dateStr)
  const today = new Date()
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Amanhã'
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`
  return `Em ${diffDays} dias`
}

export function CronogramaManutencao() {
  // Filtrar apenas manutenções agendadas e em andamento, ordenar por data
  const proximasManutencoes = manutencaoData
    .filter(m => m.status === 'agendada' || m.status === 'em-andamento')
    .sort((a, b) => new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime())
    .slice(0, 5)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Cronograma de Manutenção</h3>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {proximasManutencoes.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Nenhuma manutenção agendada
          </p>
        ) : (
          proximasManutencoes.map((manutencao) => {
            const tipoInfo = tipoConfig[manutencao.tipo]
            const daysUntil = getDaysUntil(manutencao.dataAgendada)
            const isUrgent = manutencao.tipo === 'urgente' || daysUntil === 'Hoje'
            
            return (
              <div 
                key={manutencao.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <div className={`rounded-full p-2 ${isUrgent ? 'bg-destructive/10' : 'bg-muted'}`}>
                  {isUrgent ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {manutencao.veiculoPlaca}
                    </p>
                    <span className={`text-xs font-medium ${tipoInfo.color}`}>
                      {tipoInfo.label}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {manutencao.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(manutencao.dataAgendada)}
                    </div>
                    
                    <Badge 
                      variant={daysUntil === 'Hoje' || manutencao.tipo === 'urgente' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {daysUntil}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Técnico: {manutencao.tecnicoResponsavel}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}