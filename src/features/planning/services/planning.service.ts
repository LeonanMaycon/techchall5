import { v4 as uuid } from 'uuid'
import { usePlanningStore } from '../planning.store'
import type { Planning } from '../planning.types'

const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
]

interface CreatePlanningPayload {
  discipline: string
  grade: string
  theme: string
  totalDays: number
  duration: number
  weeklyObjective: string
  classLevel: string
  notes?: string
  prompt: string
}

export async function createPlanning(
  payload: CreatePlanningPayload
): Promise<Planning> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const days = weekDays.slice(0, Number(payload.totalDays))

  const planning: Planning = {
    id: uuid(),
    title: `Plano Semanal - ${payload.discipline} - ${payload.theme}`,
    discipline: payload.discipline,
    grade: payload.grade,
    createdAt: new Date().toISOString().split('T')[0],
    totalDays: payload.totalDays,
    prompt: payload.prompt,
    notes: payload.notes,
    rows: days.map((day) => ({
      day,
      objective:
        payload.weeklyObjective || 'Objetivo da aula',
      content: `Conteúdo relacionado a ${payload.theme}`,
      methodology:
        'Aula expositiva com exercícios práticos',
      activity: 'Lista de exercícios para fixação',
    })),
  }

  usePlanningStore.getState().addPlanning(planning)

  return planning
}

interface UpdatePlanningPayload {
  id: string
  discipline: string
  grade: string
  theme: string
  totalDays: number
  duration: number
  weeklyObjective: string
  classLevel: string
  notes?: string
  prompt: string
}

export async function updatePlanning(
  payload: UpdatePlanningPayload,
  existing: Planning
): Promise<Planning> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const days = existing.rows.map((r) => r.day).slice(0, payload.totalDays)

  const updated: Planning = {
    ...existing,
    title: `Plano Semanal - ${payload.discipline} - ${payload.theme}`,
    discipline: payload.discipline,
    grade: payload.grade,
    totalDays: payload.totalDays,
    notes: payload.notes,
    prompt: payload.prompt,
    rows: days.map((day) => ({
      day,
      objective: payload.weeklyObjective || 'Objetivo da aula',
      content: `Conteúdo relacionado a ${payload.theme}`,
      methodology: 'Aula expositiva com exercícios práticos',
      activity: 'Lista de exercícios para fixação',
    })),
  }

  usePlanningStore.getState().updatePlanning(updated)

  return updated
}

