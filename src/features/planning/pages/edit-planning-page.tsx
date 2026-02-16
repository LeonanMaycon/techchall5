import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { NewPlanningFormLayout } from '../components/new-planning-form'
import { usePlanningStore } from '../planning.store'
import { updatePlanning } from '../services/planning.service'

export function EditPlanningForm() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false })
  const { plannings } = usePlanningStore()

  const planning = plannings.find((p) => p.id === id)

  const [form, setForm] = useState({
    discipline: planning?.discipline ?? '',
    grade: planning?.grade ?? '',
    theme: planning?.title?.split(' - ')[2] ?? '',
    totalDays: planning?.totalDays ?? 5,
    duration: 50,
    weeklyObjective: planning?.rows?.[0]?.objective ?? '',
    classLevel: 'Intermediário',
    notes: planning?.notes ?? '',
    prompt: planning?.prompt ?? '',
  })

  const [loading, setLoading] = useState(false)

  if (!planning) return <div>Planejamento não encontrado</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await updatePlanning(
      { ...form, id: planning.id },
      planning
    )

    setLoading(false)
    navigate({ to: `/plannings/${response.id}` })
  }

  return (
    <NewPlanningFormLayout
      title="Editar Planejamento"
      form={form}
      setForm={setForm}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Salvar alterações"
    />
  )
}
