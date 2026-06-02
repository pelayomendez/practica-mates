// Una pregunta amb la seva zona de resposta, botó «Comprovar» i feedback.

import { useState } from 'react'
import { Part } from '../exercises/types'
import { checkAnswer } from '../lib/answer'
import { formatAnswer } from './format'

export type PartStatus = 'unanswered' | 'correct' | 'wrong'

interface Props {
  part: Part
  teacherMode: boolean
  value: string
  status: PartStatus
  onChange: (value: string) => void
  onCheck: () => void
}

export function PartInput({ part, teacherMode, value, status, onChange, onCheck }: Props) {
  const [showSteps, setShowSteps] = useState(false)
  const [hint, setHint] = useState<string | undefined>()

  function handleCheck() {
    const res = checkAnswer(value, part.answer)
    setHint(res.correct ? undefined : res.hint)
    onCheck()
  }

  const correctText = formatAnswer(part.answer)

  return (
    <div className={`part part-${status}`}>
      <label className="part-prompt">{part.prompt}</label>

      <div className="part-row">
        {part.inputKind === 'choice' && part.choices ? (
          <div className="choice-group">
            {part.choices.map((c) => (
              <button
                key={c}
                type="button"
                className={`choice-btn ${value === c ? 'choice-selected' : ''}`}
                onClick={() => onChange(c)}
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <input
            className="part-input"
            type="text"
            inputMode={part.inputKind === 'number' ? 'decimal' : 'text'}
            placeholder={part.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCheck()
            }}
          />
        )}

        {!teacherMode && (
          <button type="button" className="btn btn-check" onClick={handleCheck}>
            Comprovar
          </button>
        )}
      </div>

      {!teacherMode && status === 'correct' && (
        <p className="feedback feedback-ok">Correcte! 🎉</p>
      )}
      {!teacherMode && status === 'wrong' && (
        <p className="feedback feedback-no">
          Torna-ho a provar 🙂{hint ? ` — ${hint}` : ''}
        </p>
      )}

      {(teacherMode || status === 'correct' || status === 'wrong') && (
        <div className="part-help">
          {teacherMode && (
            <p className="solution">
              Resposta correcta: <strong>{correctText}</strong>
            </p>
          )}
          {teacherMode ? (
            <p className="steps">{part.explanation}</p>
          ) : (
            <>
              <button
                type="button"
                className="link-btn"
                onClick={() => setShowSteps((s) => !s)}
              >
                {showSteps ? 'Amaga els passos' : 'Veure els passos'}
              </button>
              {showSteps && <p className="steps">{part.explanation}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
