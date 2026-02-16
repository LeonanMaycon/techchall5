import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from '@tanstack/react-router'

import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { PlanningTable } from '../components/planning-table'
import { usePlanningStore } from '../planning.store'

export default function PlanningListPage() {
  const navigate = useNavigate()

  const plannings = usePlanningStore(
    (state) => state.plannings
  )

  const loadPlannings = usePlanningStore(
    (state) => state.loadPlannings
  )

  useEffect(() => {
    loadPlannings()
  }, [loadPlannings])


  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">
              Meus Planejamentos
            </CardTitle>

            <Button
              onClick={() =>
                navigate({
                  to: '/plannings/new',
                })
              }
            >
              <Plus />
              Novo Planejamento
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">

            {plannings.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum planejamento criado ainda.
              </div>
            ) : (
              <PlanningTable data={plannings} />
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
