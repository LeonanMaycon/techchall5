import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { NewPlanningFormLayout } from '../components/new-planning-form'
import { createPlanning } from '../services/planning.service'

export function NewPlanningForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    discipline: '',
    grade: '',
    theme: '',
    totalDays: 5,
    duration: 50,
    weeklyObjective: '',
    classLevel: 'Intermediário',
    notes: '',
    prompt: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await createPlanning(form)

    setLoading(false)
    navigate({ to: `/plannings/${response.id}` })
  }

  return (
    <NewPlanningFormLayout
      title="Novo Planejamento"
      form={form}
      setForm={setForm}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Gerar Planejamento"
    />
  )
}
