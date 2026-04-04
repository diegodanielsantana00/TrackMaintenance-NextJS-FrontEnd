import { api } from '@/lib/api'
import type { Manutencao, ManutencaoRequest, UpdateManutencaoRequest, StatusManutencao } from '../models/manutencao'

export const manutencaoService = {
  list: (page: number, size: number) =>
    api.getPaged<Manutencao>(`/v1/manutencoes?page=${page}&size=${size}`),

  getById: (id: number) =>
    api.get<Manutencao>(`/v1/manutencoes/${id}`),

  getByVeiculo: (veiculoId: number) =>
    api.get<Manutencao[]>(`/v1/manutencoes/veiculo/${veiculoId}`),

  getByStatus: (status: StatusManutencao) =>
    api.get<Manutencao[]>(`/v1/manutencoes/status/${status}`),

  create: (data: ManutencaoRequest) =>
    api.post<Manutencao>('/v1/manutencoes', data),

  update: (id: number, data: UpdateManutencaoRequest) =>
    api.put<Manutencao>(`/v1/manutencoes/${id}`, data),

  updateStatus: (id: number, status: StatusManutencao) =>
    api.patch<Manutencao>(`/v1/manutencoes/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/v1/manutencoes/${id}`),
}
