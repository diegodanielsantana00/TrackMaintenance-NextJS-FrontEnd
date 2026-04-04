export type StatusManutencao = 'PENDENTE' | 'EM_REALIZACAO' | 'CONCLUIDA'

export interface Manutencao {
  id: number
  veiculoId: number
  veiculoPlaca: string
  veiculoModelo: string
  dataInicio: string
  dataFinalizacao: string | null
  tipoServico: string
  custoEstimado: number | null
  status: StatusManutencao
}

export interface ManutencaoRequest {
  veiculoId: number
  dataInicio: string
  dataFinalizacao: string | null
  tipoServico: string
  custoEstimado: number | null
}

export interface UpdateManutencaoRequest {
  dataInicio: string
  dataFinalizacao: string | null
  tipoServico: string
  custoEstimado: number | null
  status: StatusManutencao
}

export const statusConfig: Record<StatusManutencao, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  'PENDENTE':      { label: 'Pendente',       variant: 'outline' },
  'EM_REALIZACAO': { label: 'Em Realização',  variant: 'default' },
  'CONCLUIDA':     { label: 'Concluída',      variant: 'secondary' },
}