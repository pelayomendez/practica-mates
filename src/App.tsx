// Component arrel: gestiona la navegació entre pantalles i l'estat de l'examen.

import { useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { ExamScreen } from './screens/ExamScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { generateExam } from './exercises/generators'
import { Exam } from './exercises/types'
import {
  ExamResult,
  clearResults,
  loadResults,
  saveResult,
} from './state/storage'

type Screen = 'home' | 'exam' | 'results'

const ORIGINAL_SEED = 20240601

function newSeed(): number {
  // Llavor pràcticament única per a cada variant nova.
  return (Date.now() ^ Math.floor(Math.random() * 0xffffff)) >>> 0
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [exam, setExam] = useState<Exam | null>(null)
  const [results, setResults] = useState<ExamResult[]>(() => loadResults())
  const [latestId, setLatestId] = useState<string | undefined>()

  function startOriginal() {
    setExam(generateExam(ORIGINAL_SEED, { original: true }))
    setScreen('exam')
  }

  function startVariant() {
    setExam(generateExam(newSeed()))
    setScreen('exam')
  }

  function handleFinish(result: ExamResult) {
    saveResult(result)
    setResults(loadResults())
    setLatestId(result.id)
    setScreen('results')
  }

  function handleClear() {
    clearResults()
    setResults([])
    setLatestId(undefined)
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          onOriginal={startOriginal}
          onVariant={startVariant}
          onResults={() => setScreen('results')}
          hasResults={results.length > 0}
        />
      )}

      {screen === 'exam' && exam && (
        <ExamScreen
          exam={exam}
          onExit={() => setScreen('home')}
          onRegenerate={startVariant}
          onFinish={handleFinish}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          results={results}
          latestId={latestId}
          onHome={() => setScreen('home')}
          onNewVariant={startVariant}
          onClear={handleClear}
        />
      )}
    </>
  )
}
