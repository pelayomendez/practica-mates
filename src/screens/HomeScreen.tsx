// Pantalla inicial amb els tres botons principals.

import { ShareButtons } from '../components/ShareButtons'

interface Props {
  onOriginal: () => void
  onVariant: () => void
  onResults: () => void
  hasResults: boolean
}

export function HomeScreen({ onOriginal, onVariant, onResults, hasResults }: Props) {
  return (
    <div className="home">
      <div className="home-card">
        <h1 className="home-title">Practica l'examen de mates</h1>
        <p className="home-sub">
          Fes l'examen original o genera variants noves amb altres números. Tot funciona al
          navegador!
        </p>

        <div className="home-buttons">
          <button className="btn btn-primary btn-big" onClick={onOriginal}>
            Fer examen original
          </button>
          <button className="btn btn-secondary btn-big" onClick={onVariant}>
            Generar variant
          </button>
          <button
            className="btn btn-ghost btn-big"
            onClick={onResults}
            disabled={!hasResults}
            title={hasResults ? '' : 'Encara no has acabat cap examen'}
          >
            Veure resultats
          </button>
        </div>

        <ShareButtons />
      </div>
    </div>
  )
}
