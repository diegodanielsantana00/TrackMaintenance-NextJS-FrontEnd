import { api, PagedApiResponse } from '@/lib/api'
import { Viagem, ViagemRequest, UpdateViagemRequest } from '../models/viagem'

export const viagemService = {
  async getViagens(page = 0, size = 10): Promise<PagedApiResponse<Viagem>> {
    const res = await api.getPaged<Viagem>(`/v1/viagens?page=${page}&size=${size}`)
    return res
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
