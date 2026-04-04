import { Header } from '@/components/layout/header'
import { ManutencaoTable } from '@/features/manutencao/components/manutencao-table'

export default function ManutencaoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo="Manutenção" subtitulo="" />
      <div className="flex-1 p-6">
        <ManutencaoTable />
      </div>
    </div>
  )
}