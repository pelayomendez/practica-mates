// Lògica de correcció: interpreta el que escriu l'alumne i el compara amb
// la resposta correcta, acceptant formats equivalents.

import {
  Fraction,
  MixedNumber,
  fracEqual,
  simplify,
  round,
} from './math'

export type AnswerKind = 'number' | 'fraction' | 'mixed' | 'text' | 'choice'

export interface Answer {
  kind: AnswerKind
  // Valor canònic correcte.
  value: number | Fraction | MixedNumber | string
  // Fraccions: si cal que estigui simplificada al màxim.
  requireSimplified?: boolean
  // Nombres: marge d'error acceptat (per defecte petit).
  tolerance?: number
  // Text/choice: alternatives acceptades (ja normalitzades o no).
  accept?: string[]
}

export interface CheckResult {
  correct: boolean
  // Pista breu quan la resposta té bona forma però no és correcta.
  hint?: string
}

// ---------- Parsers tolerants ----------

// Accepta coma o punt decimal, espais, i el símbol € o %.
export function parseNumber(raw: string): number | null {
  if (raw == null) return null
  const cleaned = raw
    .trim()
    .replace(/[€%\s]/g, '')
    .replace(',', '.')
  if (cleaned === '' || isNaN(Number(cleaned))) return null
  return Number(cleaned)
}

// Accepta "3/4", "3 / 4" o un enter "5" (com a 5/1).
export function parseFraction(raw: string): Fraction | null {
  if (raw == null) return null
  const t = raw.trim().replace(/\s+/g, '')
  if (t === '') return null
  if (t.includes('/')) {
    const [n, d] = t.split('/')
    const num = Number(n.replace(',', '.'))
    const den = Number(d.replace(',', '.'))
    if (isNaN(num) || isNaN(den) || den === 0) return null
    return { num, den }
  }
  const num = parseNumber(t)
  if (num == null || !Number.isInteger(num)) return null
  return { num, den: 1 }
}

// Accepta "2 1/3", "2 i 1/3", "2_1/3" o una fracció impròpia equivalent "7/3".
export function parseMixed(raw: string): MixedNumber | Fraction | null {
  if (raw == null) return null
  const t = raw.trim().replace(/\bi\b/g, ' ').replace(/_/g, ' ')
  const m = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (m) {
    const whole = Number(m[1])
    const num = Number(m[2])
    const den = Number(m[3])
    if (den === 0) return null
    return { whole, num, den }
  }
  // Si no és nombre mixt, intentem fracció (poden haver respost amb impròpia).
  return parseFraction(t)
}

// Normalitza text: minúscules, sense accents, sense signes de puntuació.
export function normalizeText(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // treu accents combinats
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

// ---------- Correcció ----------

export function checkAnswer(userInput: string, answer: Answer): CheckResult {
  if (userInput == null || userInput.trim() === '') {
    return { correct: false }
  }

  switch (answer.kind) {
    case 'number': {
      const u = parseNumber(userInput)
      if (u == null) return { correct: false, hint: 'Escriu un nombre.' }
      const target = answer.value as number
      const tol = answer.tolerance ?? 0.001
      return { correct: Math.abs(u - target) <= tol }
    }

    case 'fraction': {
      const u = parseFraction(userInput)
      if (u == null) return { correct: false, hint: 'Escriu una fracció com 3/4.' }
      const target = answer.value as Fraction
      const equalValue = fracEqual(u, target)
      if (!equalValue) return { correct: false }
      if (answer.requireSimplified) {
        const s = simplify(u)
        if (s.num !== u.num || s.den !== u.den) {
          return { correct: false, hint: 'Gairebé! Recorda simplificar la fracció.' }
        }
      }
      return { correct: true }
    }

    case 'mixed': {
      const parsed = parseMixed(userInput)
      if (parsed == null) return { correct: false, hint: 'Escriu-ho com 2 1/3.' }
      const target = answer.value as MixedNumber
      const targetValue = target.whole + target.num / target.den
      let userValue: number
      if ('whole' in parsed) {
        userValue = parsed.whole + parsed.num / parsed.den
      } else {
        userValue = parsed.num / parsed.den
      }
      return { correct: round(userValue, 6) === round(targetValue, 6) }
    }

    case 'choice': {
      const u = normalizeText(userInput)
      const target = normalizeText(String(answer.value))
      if (u === target) return { correct: true }
      const accepted = (answer.accept ?? []).map(normalizeText)
      return { correct: accepted.includes(u) }
    }

    case 'text': {
      const u = normalizeText(userInput)
      const target = normalizeText(String(answer.value))
      const accepted = (answer.accept ?? []).map(normalizeText)
      return { correct: u === target || accepted.includes(u) }
    }

    default:
      return { correct: false }
  }
}
