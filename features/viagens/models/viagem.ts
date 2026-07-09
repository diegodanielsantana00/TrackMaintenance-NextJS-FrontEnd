export interface Viagem {
  id: number
  veiculoId: number
  dataSaida: string
  dataChegada: string | null
  origem: string
  destino: string
  kmPercorrida: number
}

export interface ViagemRequest {
  veiculoId: number
  dataSaida: string
  dataChegada: string | null
  origem: string
  destino: string
  kmPercorrida: number
}

export interface UpdateViagemRequest {
  veiculoId: number
  dataSaida: string
  dataChegada: string | null
  origem: string
  destino: string
  kmPercorrida: number
}
