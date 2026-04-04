export type VeiculoStatus = 'em-transito' | 'disponivel' | 'manutencao'

export interface Veiculo {
  id: number
  placa: string
  modelo: string
  status: VeiculoStatus
  km: string
  combustivel: number
  localizacao: string
}

export const statusConfig: Record<VeiculoStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  'em-transito': { label: 'Em Trânsito', variant: 'default' },
  'disponivel':  { label: 'Disponível',  variant: 'secondary' },
  'manutencao':  { label: 'Manutenção',  variant: 'destructive' },
}

export const veiculosData: Veiculo[] = [
  { id: 1,  placa: 'ABC-1234', modelo: 'Volvo FH 540',    status: 'em-transito', km: '125.430', combustivel: 78, localizacao: 'São Paulo - SP' },
  { id: 2,  placa: 'DEF-5678', modelo: 'Scania R450',      status: 'disponivel',  km: '98.200',  combustivel: 92, localizacao: 'Centro de Distribuição' },
  { id: 3,  placa: 'GHI-9012', modelo: 'Mercedes Actros',  status: 'manutencao',  km: '210.150', combustivel: 45, localizacao: 'Oficina Central' },
  { id: 4,  placa: 'JKL-3456', modelo: 'Volvo FH 460',     status: 'em-transito', km: '87.600',  combustivel: 65, localizacao: 'Campinas - SP' },
  { id: 5,  placa: 'MNO-7890', modelo: 'DAF XF 530',       status: 'disponivel',  km: '156.800', combustivel: 88, localizacao: 'Centro de Distribuição' },
  { id: 6,  placa: 'PQR-1122', modelo: 'Scania S500',      status: 'em-transito', km: '42.300',  combustivel: 55, localizacao: 'Guarulhos - SP' },
  { id: 7,  placa: 'STU-3344', modelo: 'MAN TGX 440',      status: 'disponivel',  km: '73.100',  combustivel: 70, localizacao: 'Centro de Distribuição' },
  { id: 8,  placa: 'VWX-5566', modelo: 'Iveco Stralis',    status: 'manutencao',  km: '198.400', combustivel: 30, localizacao: 'Oficina Central' },
  { id: 9,  placa: 'YZA-7788', modelo: 'Volvo FH 500',     status: 'em-transito', km: '61.900',  combustivel: 50, localizacao: 'Ribeirão Preto - SP' },
  { id: 10, placa: 'BCD-9900', modelo: 'Scania R500',      status: 'disponivel',  km: '112.600', combustivel: 95, localizacao: 'Centro de Distribuição' },
  { id: 11, placa: 'EFG-1010', modelo: 'Mercedes Axor',    status: 'em-transito', km: '145.200', combustivel: 60, localizacao: 'Santos - SP' },
  { id: 12, placa: 'HIJ-2020', modelo: 'Volvo FM 370',     status: 'manutencao',  km: '302.800', combustivel: 20, localizacao: 'Oficina Central' },
]
