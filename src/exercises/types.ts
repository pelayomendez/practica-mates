// Model de dades d'un exercici i les seves preguntes.
// Les dades són serialitzables (es poden desar a localStorage); el component
// de dibuix s'associa al tipus mitjançant un registre (renderRegistry).

import { Answer } from '../lib/answer'

export type ExerciseType =
  | 'estadistica'
  | 'mcd'
  | 'mcm'
  | 'fraccions'
  | 'percentatges'
  | 'ruleta'
  | 'pizza'
  | 'ombres'
  | 'triangles'
  | 'area'
  | 'fraccio-mixt'

// Una pregunta concreta dins d'un exercici (un exercici en pot tenir diverses).
export interface Part {
  id: string
  prompt: string
  inputKind: Answer['kind']
  // Per a preguntes de selecció: opcions a mostrar.
  choices?: string[]
  placeholder?: string
  answer: Answer
  explanation: string
}

export interface Exercise<TData = unknown> {
  id: string
  type: ExerciseType
  number: number // posició a l'examen (1..11)
  title: string
  statement: string
  data: TData
  parts: Part[]
}

export interface Exam {
  seed: number
  isOriginal: boolean
  createdAt: number
  exercises: Exercise[]
}
