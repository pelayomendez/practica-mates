// Mostra una resposta correcta en format llegible.

import { Answer } from '../lib/answer'
import { Fraction, MixedNumber, fracToString } from '../lib/math'

export function formatAnswer(answer: Answer): string {
  switch (answer.kind) {
    case 'number':
      return String(answer.value).replace('.', ',')
    case 'fraction':
      return fracToString(answer.value as Fraction)
    case 'mixed': {
      const m = answer.value as MixedNumber
      return m.num === 0 ? `${m.whole}` : `${m.whole} ${m.num}/${m.den}`
    }
    case 'choice':
    case 'text':
      return String(answer.value)
    default:
      return ''
  }
}
