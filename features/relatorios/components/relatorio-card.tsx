'use client'

import { Route, Package, Wrench, TrendingUp, Truck, FileDown, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Relatorio, RelatorioStatus } from '../models/relatorio'
import { cn } from '@/lib/utils'

interface RelatorioCardProps {
  relatorio: Relatorio
  onGerarRelatorio: (id: string) => void
  onBaixarPDF: (id: string) => void
}

const iconeMap: Record<string, React.ReactNode> = {
  route:   <Route      className="h-6 w-6" />,
  package: <Package    className="h-6 w-6" />,
  wrench:  <Wrench     className="h-6 w-6" />,
  chart:   <TrendingUp className="h-6 w-6" />,
  truck:   <Truck      className="h-6 w-6" />,
}

const statusColors: Record<RelatorioStatus, string> = {
  idle:       'bg-muted',
  processing: 'bg-chart-2/20',
  disponivel: 'bg-chart-2/20',
  error:      'bg-destructive/20',
}

export function RelatorioCard({ relatorio, onGerarRelatorio, onBaixarPDF }: RelatorioCardProps) {
  const { id, nome, descricao, icone, status } = relatorio

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
              statusColors[status],
              status === 'disponivel' && 'text-chart-2',
              status === 'processing' && 'text-chart-2',
              status === 'idle'       && 'text-muted-foreground',
              status === 'error'      && 'text-destructive'
            )}
          >
            {iconeMap[icone]}
          </div>
          {status === 'disponivel' && (
            <div className="flex items-center gap-1.5 rounded-full bg-chart-2/20 px-2.5 py-1 text-xs font-medium text-chart-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Disponível
            </div>
          )}
          {status === 'processing' && (
            <div className="flex items-center gap-1.5 rounded-full bg-chart-1/20 px-2.5 py-1 text-xs font-medium text-chart-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Processando...
            </div>
          )}
        </div>
        <CardTitle className="mt-3 text-lg">{nome}</CardTitle>
        <CardDescription className="line-clamp-2">{descricao}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1" />

      <CardFooter className="flex gap-2 border-t border-border pt-4">
        {status === 'disponivel' ? (
          <>
            <Button variant="outline" className="flex-1" onClick={() => onGerarRelatorio(id)}>
              Gerar Novamente
            </Button>
            <Button className="flex-1 gap-2" onClick={() => onBaixarPDF(id)}>
              <FileDown className="h-4 w-4" />
              Baixar PDF
            </Button>
          </>
        ) : (
          <Button className="w-full" disabled={status === 'processing'} onClick={() => onGerarRelatorio(id)}>
            {status === 'processing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Gerar Relatório'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
