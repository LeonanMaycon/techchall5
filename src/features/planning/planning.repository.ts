import type { Planning } from './planning.types'

const STORAGE_KEY = 'plannings-db'

export const planningRepository = {
  getAll(): Planning[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveAll(plannings: Planning[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plannings))
  },

  add(planning: Planning) {
    const current = this.getAll()
    this.saveAll([...current, planning])
  },

  remove(id: string) {
    const current = this.getAll()
    const updated = current.filter((p) => p.id !== id)
    this.saveAll(updated)
  },

  update(updatedPlanning: Planning) {
    const current = this.getAll()

    const newList = current.map((p) =>
      p.id === updatedPlanning.id ? updatedPlanning : p
    )

    this.saveAll(newList)
  }
}
