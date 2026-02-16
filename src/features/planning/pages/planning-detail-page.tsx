import { useNavigate, useParams } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { exportPlanningToPDF } from '@/shared/functions'
import { ArrowLeft, FileText } from 'lucide-react'
import { usePlanningStore } from '../planning.store'

export default function PlanningDetailPage() {
  const { id } = useParams({
    from: '/protected/plannings/$id',
  })
  const navigate = useNavigate()

  const planning = usePlanningStore((state) =>
    state.plannings.find((p) => p.id === id)
  )

  const handleExportDetail = () => {
    if (!planning) return
    exportPlanningToPDF(planning)
  }

  if (!planning) {
    return (
      <div className="text-center mt-10">
        <p>Planejamento não encontrado.</p>
        <Button
          onClick={() => navigate({ to: '/plannings' })}
          variant={'outline'}
          className="w-full max-w-30"
        >
          <ArrowLeft />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{planning.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-4">
          <Badge>{planning.discipline}</Badge>
          <Badge variant="secondary">{planning.grade}</Badge>
          <Badge variant="outline">
            {planning.totalDays} dias
          </Badge>
          <Badge variant="outline">
            {planning.createdAt}
          </Badge>
        </CardContent>
      </Card>

      <Separator />

      {/* Tabela do planejamento */}
      <Card>
        <CardContent className="p-6" id="planning-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Conteúdo</TableHead>
                <TableHead>Metodologia</TableHead>
                <TableHead>Atividade</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {planning.rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.day}</TableCell>
                  <TableCell>{row.objective}</TableCell>
                  <TableCell>{row.content}</TableCell>
                  <TableCell>{row.methodology}</TableCell>
                  <TableCell>{row.activity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Button
          onClick={() => navigate({ to: '/plannings' })}
          variant={'outline'}
          className="w-full max-w-30"
        >
          <ArrowLeft />
          Voltar
        </Button>

        <Button onClick={handleExportDetail}>
          <FileText /> Exportar PDF
        </Button>
      </div>
    </div>
  )
}
