// Targeta d'un exercici: número, títol, enunciat, dibuix i preguntes.

import { Exercise } from '../exercises/types'
import { VISUALS } from '../exercises/visuals'
import { PartInput, PartStatus } from './PartInput'

export interface PartState {
  value: string
  status: PartStatus
}

interface Props {
  exercise: Exercise
  teacherMode: boolean
  answers: Record<string, PartState>
  onChange: (partId: string, value: string) => void
  onCheck: (partId: string) => void
}

export function ExerciseCard({ exercise, teacherMode, answers, onChange, onCheck }: Props) {
  const Visual = VISUALS[exercise.type]

  return (
    <section className="exercise-card">
      <header className="exercise-head">
        <span className="exercise-num">{exercise.number}</span>
        <div>
          <h2 className="exercise-title">{exercise.title}</h2>
          <p className="exercise-statement">{exercise.statement}</p>
        </div>
      </header>

      {Visual && (
        <div className="exercise-visual">
          {/* El registre garanteix que el tipus de data encaixa amb el component. */}
          <Visual data={exercise.data} />
        </div>
      )}

      <div className="exercise-parts">
        {exercise.parts.map((part) => {
          const st = answers[part.id] ?? { value: '', status: 'unanswered' as PartStatus }
          return (
            <PartInput
              key={part.id}
              part={part}
              teacherMode={teacherMode}
              value={st.value}
              status={st.status}
              onChange={(v) => onChange(part.id, v)}
              onCheck={() => onCheck(part.id)}
            />
          )
        })}
      </div>
    </section>
  )
}
