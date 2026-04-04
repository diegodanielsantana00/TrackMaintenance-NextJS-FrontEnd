import type { Relatorio } from '../models/relatorio'

const TEMPO_PROCESSAMENTO_MIN = 2000
const TEMPO_PROCESSAMENTO_MAX = 4000

export async function gerarRelatorio(relatorio: Relatorio): Promise<{ sucesso: boolean; mensagem: string }> {
  const tempo = Math.random() * (TEMPO_PROCESSAMENTO_MAX - TEMPO_PROCESSAMENTO_MIN) + TEMPO_PROCESSAMENTO_MIN

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ sucesso: true, mensagem: `Relatório "${relatorio.nome}" gerado com sucesso!` })
    }, tempo)
  })
}

export function baixarPDF(relatorio: Relatorio): void {
  const conteudo = `
========================================
${relatorio.nome.toUpperCase()}
========================================

Descrição: ${relatorio.descricao}

Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
Hora: ${new Date().toLocaleTimeString('pt-BR')}

[Este é um arquivo PDF simulado para demonstração]

----------------------------------------
LogiTrack Pro - Sistema de Gestão Logística
----------------------------------------
  `

  const blob = new Blob([conteudo], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `${relatorio.id}-${Date.now()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
