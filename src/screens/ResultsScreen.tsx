// Pantalla de resultats: nota de l'últim examen, exercicis a repassar i historial.

import { ExamResult } from '../state/storage'

interface Props {
  results: ExamResult[]
  latestId?: string
  onHome: () => void
  onNewVariant: () => void
  onClear: () => void
}

function pct(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100)
}

function emoji(p: number): string {
  if (p >= 90) return '🌟'
  if (p >= 70) return '😀'
  if (p >= 50) return '🙂'
  return '💪'
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ResultsScreen({ results, latestId, onHome, onNewVariant, onClear }: Props) {
  const latest = results.find((r) => r.id === latestId) ?? results[0]

  return (
    <div className="results">
      <div className="exam-toolbar no-print">
        <button className="btn btn-ghost" onClick={onHome}>
          ← Inici
        </button>
        <div className="toolbar-right">
          <button className="btn btn-ghost" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
          <button className="btn btn-secondary" onClick={onNewVariant}>
            🎲 Nova variant
          </button>
        </div>
      </div>

      {latest && (
        <div className="result-hero">
          <div className="result-score">
            <span className="result-emoji">{emoji(pct(latest.correct, latest.total))}</span>
            <div>
              <div className="result-big">
                {latest.correct} / {latest.total}
              </div>
              <div className="result-pct">{pct(latest.correct, latest.total)} % encertat</div>
            </div>
          </div>

          <div className="result-review">
            <h3>Exercicis per repassar</h3>
            {latest.perExercise.filter((e) => e.correct < e.total).length === 0 ? (
              <p className="all-good">Tot perfecte! No cal repassar res. 🎉</p>
            ) : (
              <ul>
                {latest.perExercise
                  .filter((e) => e.correct < e.total)
                  .map((e) => (
                    <li key={e.number}>
                      <strong>
                        {e.number}. {e.title}
                      </strong>{' '}
                      — {e.correct}/{e.total}
                    </li>
                  ))}
              </ul>
            )}
            <h3>Detall per exercici</h3>
            <div className="result-grid">
              {latest.perExercise.map((e) => (
                <div
                  key={e.number}
                  className={`result-cell ${e.correct === e.total ? 'cell-ok' : 'cell-no'}`}
                  title={e.title}
                >
                  <span className="cell-num">{e.number}</span>
                  <span className="cell-frac">
                    {e.correct}/{e.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="history">
          <h3>Historial d'exàmens</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Nom</th>
                <th>Tipus</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id + r.date} className={r.id === latest?.id ? 'row-latest' : ''}>
                  <td>{formatDate(r.date)}</td>
                  <td>{r.studentName || '—'}</td>
                  <td>{r.isOriginal ? 'Original' : `Variant #${r.seed % 1000}`}</td>
                  <td>
                    {r.correct}/{r.total} ({pct(r.correct, r.total)} %)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-ghost btn-clear no-print" onClick={onClear}>
            Esborra l'historial
          </button>
        </div>
      )}
    </div>
  )
}
