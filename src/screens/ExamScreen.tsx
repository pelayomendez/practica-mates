// Pantalla d'examen en format full: tots els exercicis, correcció i puntuació.

import { useMemo, useState } from 'react'
import { Exam } from '../exercises/types'
import { checkAnswer } from '../lib/answer'
import { ExerciseCard, PartState } from '../components/ExerciseCard'
import { ExamResult, ExerciseScore } from '../state/storage'

interface Props {
  exam: Exam
  onExit: () => void
  onRegenerate: () => void
  onFinish: (result: ExamResult) => void
}

type Answers = Record<string, PartState>

function buildResult(exam: Exam, answers: Answers, studentName: string): ExamResult {
  const perExercise: ExerciseScore[] = exam.exercises.map((ex) => {
    let correct = 0
    for (const part of ex.parts) {
      const val = answers[part.id]?.value ?? ''
      if (checkAnswer(val, part.answer).correct) correct++
    }
    return { number: ex.number, title: ex.title, correct, total: ex.parts.length }
  })
  const correct = perExercise.reduce((a, e) => a + e.correct, 0)
  const total = perExercise.reduce((a, e) => a + e.total, 0)
  return {
    id: `${exam.seed}-${exam.exercises.length}-${studentName || 'alumne'}`,
    seed: exam.seed,
    isOriginal: exam.isOriginal,
    date: Date.now(),
    studentName,
    correct,
    total,
    perExercise,
  }
}

export function ExamScreen({ exam, onExit, onRegenerate, onFinish }: Props) {
  const [answers, setAnswers] = useState<Answers>({})
  const [teacherMode, setTeacherMode] = useState(false)
  const [studentName, setStudentName] = useState('')

  const totalParts = useMemo(
    () => exam.exercises.reduce((a, ex) => a + ex.parts.length, 0),
    [exam],
  )
  const answeredCount = Object.values(answers).filter((a) => a.status !== 'unanswered').length

  function handleChange(partId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [partId]: { value, status: 'unanswered' } }))
  }

  function checkPart(partId: string, prev: Answers): PartState {
    const part = exam.exercises.flatMap((e) => e.parts).find((p) => p.id === partId)!
    const value = prev[partId]?.value ?? ''
    const ok = checkAnswer(value, part.answer).correct
    return { value, status: ok ? 'correct' : 'wrong' }
  }

  function handleCheck(partId: string) {
    setAnswers((prev) => ({ ...prev, [partId]: checkPart(partId, prev) }))
  }

  function handleCheckAll() {
    setAnswers((prev) => {
      const next: Answers = { ...prev }
      for (const ex of exam.exercises) {
        for (const part of ex.parts) {
          next[part.id] = checkPart(part.id, prev)
        }
      }
      return next
    })
  }

  function handleFinish() {
    handleCheckAll()
    onFinish(buildResult(exam, answers, studentName))
  }

  return (
    <div className="exam">
      <div className="exam-toolbar no-print">
        <button className="btn btn-ghost" onClick={onExit}>
          ← Inici
        </button>
        <div className="toolbar-right">
          <label className="teacher-toggle">
            <input
              type="checkbox"
              checked={teacherMode}
              onChange={(e) => setTeacherMode(e.target.checked)}
            />
            Mode profe/pares
          </label>
          <button className="btn btn-ghost" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
          <button className="btn btn-secondary" onClick={onRegenerate}>
            🎲 Nova variant
          </button>
        </div>
      </div>

      <div className="exam-sheet">
        <header className="sheet-head">
          <div className="sheet-brand">EMAT · Control de matemàtiques</div>
          <div className="sheet-meta">
            <label>
              Nom:
              <input
                className="name-input"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="el teu nom"
              />
            </label>
            <span className="sheet-tag">
              {exam.isOriginal ? 'Examen original' : `Variant #${exam.seed % 1000}`}
            </span>
          </div>
        </header>

        {teacherMode && (
          <div className="teacher-banner no-print">
            Mode profe/pares activat: es mostren les respostes correctes i els passos. 🧑‍🏫
          </div>
        )}

        {exam.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            teacherMode={teacherMode}
            answers={answers}
            onChange={handleChange}
            onCheck={handleCheck}
          />
        ))}

        <footer className="exam-footer no-print">
          <p className="progress-line">
            Has comprovat {answeredCount} de {totalParts} preguntes.
          </p>
          <div className="footer-buttons">
            <button className="btn btn-secondary" onClick={handleCheckAll}>
              Comprovar-ho tot
            </button>
            <button className="btn btn-primary" onClick={handleFinish}>
              Finalitzar i veure la nota
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
