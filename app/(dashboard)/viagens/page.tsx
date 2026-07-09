import { Header } from '@/components/layout/header'
import { ViagensTable } from '@/features/viagens/components/viagens-table'

export default function ViagensPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo="Viagens" subtitulo="Gerencie as viagens da frota." />
      <div className="flex-1 p-4 sm:p-6">
        <ViagensTable />
      </div>
    </div>
  )
}
