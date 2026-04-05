export interface TotalKm {
  totalKm: number
}

export interface VeiculoPorCategoria {
  tipo: string
  quantidade: number
  percentual: number
}

export interface CronogramaManutencao {
  id: number
  veiculoPlaca: string
  veiculoModelo: string
  tipoServico: string
  dataInicio: string
  dataFinalizacao: string | null
  custoEstimado: number | null
  status: string
}

export interface RankingUtilizacao {
  veiculoId: number
  placa: string
  modelo: string
  tipo: string
  totalViagens: number
  totalKm: number
}

export interface ProjecaoFinanceira {
  mes: number
  ano: number
  custoTotal: number
  totalManutencoes: number
}
