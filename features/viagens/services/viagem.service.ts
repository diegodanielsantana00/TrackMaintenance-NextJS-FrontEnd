import { api } from '@/lib/api'
import { Viagem, ViagemRequest, UpdateViagemRequest } from '../models/viagem'

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export const viagemService = {
  async getViagens(page = 0, size = 10): Promise<PageResponse<Viagem>> {
    const { data } = await api.get<PageResponse<Viagem>>('/v1/viagens', {
      params: { page, size }
    })
    return data
  },

  async getViagemById(id: number): Promise<Viagem> {
    const { data } = await api.get<Viagem>(`/v1/viagens/${id}`)
    return data
  },

  async createViagem(viagemData: ViagemRequest): Promise<Viagem> {
    const { data } = await api.post<Viagem>('/v1/viagens', viagemData)
    return data
  },

  async updateViagem(id: number, viagemData: UpdateViagemRequest): Promise<Viagem> {
    const { data } = await api.put<Viagem>(`/v1/viagens/${id}`, viagemData)
    return data
  },

  async deleteViagem(id: number): Promise<void> {
    await api.delete(`/v1/viagens/${id}`)
  }
}
