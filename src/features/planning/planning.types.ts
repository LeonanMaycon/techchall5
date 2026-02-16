export interface PlanningRow {
  day: string
  objective: string
  content: string
  methodology: string
  activity: string
}

export interface Planning {
  id: string
  title: string
  discipline: string
  grade: string
  createdAt: string
  totalDays: number
  notes?: string
  prompt?: string
  rows: PlanningRow[]
}
