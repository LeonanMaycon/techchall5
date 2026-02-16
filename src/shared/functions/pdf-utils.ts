import type { Planning } from '@/features/planning/planning.types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportPlanningToPDF = (planning: Planning) => {
  const doc = new jsPDF('p', 'mm', 'a4')

  doc.setFontSize(18)
  doc.text(planning.title, 14, 20)

  // Cabeçalho com informações gerais
  doc.setFontSize(12)
  doc.text(`Disciplina: ${planning.discipline}`, 14, 28)
  doc.text(`Série: ${planning.grade}`, 14, 34)
  doc.text(`Total de dias: ${planning.totalDays}`, 14, 40)
  doc.text(`Criado em: ${new Date(planning.createdAt).toLocaleDateString()}`, 14, 46)

  // Tabela detalhada
  const columns = ['Dia', 'Objetivo', 'Conteúdo', 'Metodologia', 'Atividade']
  const rows = planning.rows.map(r => [
    r.day,
    r.objective,
    r.content,
    r.methodology,
    r.activity
  ])

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 55,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 144, 255] } // azul, opcional
  })

  doc.save(`${planning.title || 'planning'}.pdf`)
}
