import { v4 as uuid } from 'uuid'
import { usePlanningStore } from '../planning.store'
import type { Planning } from '../planning.types'
import { generatePlanningWithAI } from './ai.service'

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
  // Generate planning rows using AI
  const rows = await generatePlanningWithAI(payload)

  const planning: Planning = {
    id: uuid(),
    title: `Planejamento - ${payload.discipline} - ${payload.theme}`,
    discipline: payload.discipline,
    grade: payload.grade,
    createdAt: new Date().toISOString().split('T')[0],
    totalDays: payload.totalDays,
    prompt: payload.prompt,
    notes: payload.notes,
    rows,
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
  // Generate updated planning rows using AI
  const rows = await generatePlanningWithAI(payload)

  const updated: Planning = {
    ...existing,
    title: `Planejamento - ${payload.discipline} - ${payload.theme}`,
    discipline: payload.discipline,
    grade: payload.grade,
    totalDays: payload.totalDays,
    notes: payload.notes,
    prompt: payload.prompt,
    rows,
  }

  usePlanningStore.getState().updatePlanning(updated)

  return updated
}

