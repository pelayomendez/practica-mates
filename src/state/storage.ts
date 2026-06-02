// Desat de resultats a localStorage (sense backend).

export interface ExerciseScore {
  number: number
  title: string
  correct: number
  total: number
}

export interface ExamResult {
  id: string
  seed: number
  isOriginal: boolean
  date: number
  studentName: string
  correct: number
  total: number
  perExercise: ExerciseScore[]
}

const KEY = 'practica-mates-resultats'

export function loadResults(): ExamResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveResult(result: ExamResult): void {
  const all = loadResults()
  all.unshift(result)
  // Conservem com a màxim els 50 últims.
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)))
}

export function clearResults(): void {
  localStorage.removeItem(KEY)
}
