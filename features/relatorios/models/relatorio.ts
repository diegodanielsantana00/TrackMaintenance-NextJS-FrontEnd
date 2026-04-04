export type RelatorioStatus = 'idle' | 'processing' | 'disponivel' | 'error'

export interface Relatorio {
  id: string
  nome: string
  descricao: string
  icone: string
  status: RelatorioStatus
  categoria: string
  ultimaGeracao?: string
}

export interface RelatorioState {
  relatorios: Relatorio[]
  updateStatus: (id: string, status: RelatorioStatus) => void
}

export interface Categoria {
  id: string
  label: string
}

export const categorias: Categoria[] = [
  { id: 'frota',       label: 'Frota' },
  { id: 'manutencao',  label: 'Manutenção' },
  { id: 'financeiro',  label: 'Financeiro' },
  { id: 'operacional', label: 'Operacional' },
]

export const relatoriosIniciais: Relatorio[] = [
  {
    id: 'km-total',
    nome: 'KM Total por Período',
    descricao: 'Análise completa da quilometragem percorrida pela frota em determinado período.',
    icone: 'route',
    status: 'disponivel',
    categoria: 'frota',
    ultimaGeracao: '2026-04-01T09:15:00',
  },
  {
    id: 'volume-categoria',
    nome: 'Volume por Categoria',
    descricao: 'Distribuição de entregas e cargas por categoria de produto ou tipo de veículo.',
    icone: 'package',
    status: 'idle',
    categoria: 'frota',
  },
  {
    id: 'utilizacao-frota',
    nome: 'Utilização da Frota',
    descricao: 'Taxa de ocupação e disponibilidade de cada veículo da frota.',
    icone: 'truck',
    status: 'idle',
    categoria: 'frota',
  },
  {
    id: 'manutencao-cronograma',
    nome: 'Cronograma de Manutenção',
    descricao: 'Programação de manutenções preventivas e corretivas dos veículos.',
    icone: 'wrench',
    status: 'disponivel',
    categoria: 'manutencao',
    ultimaGeracao: '2026-03-28T14:30:00',
  },
  {
    id: 'manutencao-custos',
    nome: 'Custos de Manutenção',
    descricao: 'Consolidado de gastos com manutenções corretivas e preventivas.',
    icone: 'wrench',
    status: 'processing',
    categoria: 'manutencao',
  },
  {
    id: 'projecao-financeira',
    nome: 'Projeção Financeira',
    descricao: 'Estimativa de custos operacionais e projeção de investimentos.',
    icone: 'chart',
    status: 'idle',
    categoria: 'financeiro',
  },
  {
    id: 'custo-por-km',
    nome: 'Custo por KM',
    descricao: 'Custo operacional detalhado por quilômetro rodado por veículo.',
    icone: 'chart',
    status: 'disponivel',
    categoria: 'financeiro',
    ultimaGeracao: '2026-04-02T11:00:00',
  },
  {
    id: 'ocorrencias',
    nome: 'Ocorrências Operacionais',
    descricao: 'Registro de paradas, atrasos e incidentes operacionais no período.',
    icone: 'package',
    status: 'idle',
    categoria: 'operacional',
  },
  {
    id: 'entregas-prazo',
    nome: 'Entregas no Prazo',
    descricao: 'Percentual de entregas realizadas dentro do prazo acordado.',
    icone: 'route',
    status: 'idle',
    categoria: 'operacional',
  },
]
