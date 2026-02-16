import { create } from 'zustand'
import { planningRepository } from './planning.repository'
import type { Planning } from './planning.types'

interface PlanningState {
  plannings: Planning[]
  loadPlannings: () => void
  addPlanning: (planning: Planning) => void
  updatePlanning: (planning: Planning) => void
  removePlanning: (id: string) => void
}
export const usePlanningStore = create<PlanningState>((set) => ({
  plannings: [],

  loadPlannings: () => {
    const data = planningRepository.getAll()
    set({ plannings: data })
  },

  addPlanning: (planning) => {
    planningRepository.add(planning)
    set((state) => ({
      plannings: [...state.plannings, planning],
    }))
  },

  removePlanning: (id) => {
    planningRepository.remove(id)
    set((state) => ({
      plannings: state.plannings.filter(
        (p) => p.id !== id
      ),
    }))
  },

  updatePlanning: (planning) => {
    planningRepository.update(planning)

    set((state) => ({
      plannings: state.plannings.map((p) =>
        p.id === planning.id ? planning : p
      ),
    }))
  },
}))
