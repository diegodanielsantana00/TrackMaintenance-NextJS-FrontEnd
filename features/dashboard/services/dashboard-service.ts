import { api } from '@/lib/api'
import type {
  TotalKm,
  VeiculoPorCategoria,
  CronogramaManutencao,
  RankingUtilizacao,
  ProjecaoFinanceira,
} from '../models/dashboard'

export const dashboardService = {
  getTotalKm: (veiculoId?: number) =>
    api.get<TotalKm>(`/v1/dashboard/total-km${veiculoId ? `?veiculoId=${veiculoId}` : ''}`),

  getVolumePorCategoria: () =>
    api.get<VeiculoPorCategoria[]>('/v1/dashboard/volume-por-categoria'),

  getCronogramaManutencao: () =>
    api.get<CronogramaManutencao[]>('/v1/dashboard/cronograma-manutencao'),

  getRankingUtilizacao: () =>
    api.get<RankingUtilizacao[]>('/v1/dashboard/ranking-utilizacao'),

  getProjecaoFinanceira: () =>
    api.get<ProjecaoFinanceira>('/v1/dashboard/projecao-financeira'),
}
