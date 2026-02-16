import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { Planning } from '../planning.types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { exportPlanningToPDF } from '@/shared/functions'
import { toast } from 'sonner'
import { usePlanningStore } from '../planning.store'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Edit, EllipsisVertical, Eye, FileText, Trash } from 'lucide-react'

interface Props {
  data: Planning[]
}

export function PlanningTable({ data }: Props) {
  const navigate = useNavigate()
  const removePlanning = usePlanningStore((state) => state.removePlanning)

  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [planningDeleteId, setPlanningDeleteId] = useState<string | undefined>(undefined)
  const pageSize = 10

  const handleDelete = (id: string) => {
    removePlanning(id)
    toast.success('Planejamento removido com sucesso.', {
      description: 'O planejamento foi excluído permanentemente.',
    })
    setPlanningDeleteId(undefined)
  }

  const filteredData = useMemo(() => {
    return data.filter(
      (p) =>
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.discipline.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage])

  return (
    <div className="space-y-4">
      {/* Filtro */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filtrar por título ou disciplina..."
          className="max-w-60"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* Tabela */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Ações</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Disciplina</TableHead>
            <TableHead>Série</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Dias</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.map((planning) => (
            <TableRow key={planning.id}>
              <TableCell className="text-left">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: '/plannings/$id',
                          params: { id: planning.id },
                        })
                      }
                    >
                      <Eye /> Visualizar
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: '/plannings/edit/$id',
                          params: { id: planning.id },
                        })
                      }
                    >
                      <Edit /> Editar
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setPlanningDeleteId(planning.id)}>
                      <Trash /> Excluir
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => exportPlanningToPDF(planning)}>
                      <FileText /> Exportar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="font-medium">{planning.title}</TableCell>
              <TableCell>{planning.discipline}</TableCell>
              <TableCell>{planning.grade}</TableCell>
              <TableCell>{planning.createdAt}</TableCell>
              <TableCell>{planning.totalDays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      <div className="flex justify-end items-center gap-2">
        <Button
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Anterior
        </Button>
        <span>
          {currentPage} / {totalPages || 1}
        </span>
        <Button
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Próximo
        </Button>
      </div>

      {/* Modal de exclusão */}
      <AlertDialog
        open={planningDeleteId !== undefined}
        onOpenChange={(open) => {
          if (!open) setPlanningDeleteId(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O planejamento será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(planningDeleteId!)}>
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
