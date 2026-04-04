import { api } from '@/lib/api'
import type { Veiculo, VeiculoRequest } from '../models/veiculo'

export const veiculoService = {
  list: (page: number, size: number) =>
    api.getPaged<Veiculo>(`/v1/veiculos?page=${page}&size=${size}`),

  getById: (id: number) =>
    api.get<Veiculo>(`/v1/veiculos/${id}`),

  create: (data: VeiculoRequest) =>
    api.post<Veiculo>('/v1/veiculos', data),

  update: (id: number, data: VeiculoRequest) =>
    api.put<Veiculo>(`/v1/veiculos/${id}`, data),

  delete: (id: number) =>
    api.delete(`/v1/veiculos/${id}`),
}
