export type TipoVeiculo = 'LEVE' | 'PESADO'

export interface Veiculo {
  id: number
  placa: string
  modelo: string
  tipo: TipoVeiculo
  ano: number | null
}

export interface VeiculoRequest {
  placa: string
  modelo: string
  tipo: TipoVeiculo
  ano: number | null
}

export const tipoConfig: Record<TipoVeiculo, { label: string; variant: 'default' | 'secondary' }> = {
  'LEVE':   { label: 'Leve',   variant: 'secondary' },
  'PESADO': { label: 'Pesado', variant: 'default' },
}
