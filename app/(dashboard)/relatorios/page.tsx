import { Header } from '@/components/layout/header'
import { RelatorioList } from '@/features/relatorios/components/relatorio-list'

export default function RelatoriosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header titulo="Relatórios" subtitulo="" />
      <div className="flex-1 p-6">
        <RelatorioList />
      </div>
    </div>
  )
}
