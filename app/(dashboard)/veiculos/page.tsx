import { Header } from '@/components/layout/header'
import { VeiculosTable } from '@/features/veiculos/components/veiculos-table'

export default function VeiculosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo="Veículos" subtitulo="" />
      <div className="flex-1 p-6">
        <VeiculosTable />
      </div>
    </div>
  )
}
