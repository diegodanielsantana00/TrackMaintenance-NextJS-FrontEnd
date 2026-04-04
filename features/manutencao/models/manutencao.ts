export type ManutencaoStatus = 'agendada' | 'em-andamento' | 'concluida' | 'cancelada'
export type ManutencaoTipo = 'preventiva' | 'corretiva' | 'urgente'

export interface Manutencao {
  id: number
  veiculoPlaca: string
  veiculoModelo: string
  tipo: ManutencaoTipo
  status: ManutencaoStatus
  dataAgendada: string
  dataRealizada?: string
  descricao: string
  custo?: number
  tecnicoResponsavel: string
  kmAtual?: number
}

export const statusConfig: Record<ManutencaoStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  'agendada':     { label: 'Agendada',      variant: 'outline' },
  'em-andamento': { label: 'Em Andamento', variant: 'default' },
  'concluida':    { label: 'Concluída',    variant: 'secondary' },
  'cancelada':    { label: 'Cancelada',    variant: 'destructive' },
}

export const tipoConfig: Record<ManutencaoTipo, { label: string; color: string }> = {
  'preventiva': { label: 'Preventiva', color: 'text-emerald-600' },
  'corretiva':  { label: 'Corretiva',  color: 'text-amber-600' },
  'urgente':    { label: 'Urgente',    color: 'text-destructive' },
}

export const manutencaoData: Manutencao[] = [
  {
    id: 1,
    veiculoPlaca: 'ABC-1234',
    veiculoModelo: 'Volvo FH 540',
    tipo: 'preventiva',
    status: 'agendada',
    dataAgendada: '2026-04-08',
    descricao: 'Troca de óleo e filtros',
    custo: 1200,
    tecnicoResponsavel: 'João Silva',
    kmAtual: 125430,
  },
  {
    id: 2,
    veiculoPlaca: 'DEF-5678',
    veiculoModelo: 'Scania R450',
    tipo: 'corretiva',
    status: 'em-andamento',
    dataAgendada: '2026-04-05',
    descricao: 'Reparo no sistema de freios',
    custo: 2500,
    tecnicoResponsavel: 'Carlos Santos',
    kmAtual: 98200,
  },
  {
    id: 3,
    veiculoPlaca: 'GHI-9012',
    veiculoModelo: 'Mercedes Actros',
    tipo: 'urgente',
    status: 'em-andamento',
    dataAgendada: '2026-04-04',
    descricao: 'Vazamento no radiador',
    custo: 1800,
    tecnicoResponsavel: 'Pedro Oliveira',
    kmAtual: 210150,
  },
  {
    id: 4,
    veiculoPlaca: 'JKL-3456',
    veiculoModelo: 'Volvo FH 460',
    tipo: 'preventiva',
    status: 'concluida',
    dataAgendada: '2026-03-28',
    dataRealizada: '2026-03-28',
    descricao: 'Revisão geral - 100.000 km',
    custo: 3200,
    tecnicoResponsavel: 'Ana Costa',
    kmAtual: 87600,
  },
  {
    id: 5,
    veiculoPlaca: 'MNO-7890',
    veiculoModelo: 'DAF XF 530',
    tipo: 'corretiva',
    status: 'concluida',
    dataAgendada: '2026-03-25',
    dataRealizada: '2026-03-26',
    descricao: 'Substituição da embreagem',
    custo: 4500,
    tecnicoResponsavel: 'Roberto Lima',
    kmAtual: 156800,
  },
  {
    id: 6,
    veiculoPlaca: 'PQR-1122',
    veiculoModelo: 'Scania S500',
    tipo: 'preventiva',
    status: 'agendada',
    dataAgendada: '2026-04-12',
    descricao: 'Calibração de pneus e alinhamento',
    custo: 800,
    tecnicoResponsavel: 'João Silva',
    kmAtual: 42300,
  },
  {
    id: 7,
    veiculoPlaca: 'STU-3344',
    veiculoModelo: 'MAN TGX 440',
    tipo: 'preventiva',
    status: 'agendada',
    dataAgendada: '2026-04-10',
    descricao: 'Inspeção de 50.000 km',
    custo: 1500,
    tecnicoResponsavel: 'Carlos Santos',
    kmAtual: 73100,
  },
  {
    id: 8,
    veiculoPlaca: 'VWX-5566',
    veiculoModelo: 'Iveco Stralis',
    tipo: 'urgente',
    status: 'cancelada',
    dataAgendada: '2026-04-02',
    descricao: 'Reparo elétrico - cancelado por disponibilidade',
    tecnicoResponsavel: 'Pedro Oliveira',
    kmAtual: 198400,
  },
  {
    id: 9,
    veiculoPlaca: 'EFG-1010',
    veiculoModelo: 'Mercedes Axor',
    tipo: 'corretiva',
    status: 'agendada',
    dataAgendada: '2026-04-15',
    descricao: 'Troca de pastilhas de freio',
    custo: 900,
    tecnicoResponsavel: 'Ana Costa',
    kmAtual: 145200,
  },
  {
    id: 10,
    veiculoPlaca: 'HIJ-2020',
    veiculoModelo: 'Volvo FM 370',
    tipo: 'urgente',
    status: 'agendada',
    dataAgendada: '2026-04-06',
    descricao: 'Motor com superaquecimento',
    custo: 5200,
    tecnicoResponsavel: 'Roberto Lima',
    kmAtual: 302800,
  },
]