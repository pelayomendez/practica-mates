// Utilitats matemàtiques: divisors, m.c.d., m.c.m. i fraccions.

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs(a * b) / gcd(a, b)
}

// Descomposició en factors primers, p.ex. 24 -> {2:3, 3:1}
export function primeFactors(n: number): Record<number, number> {
  const factors: Record<number, number> = {}
  let m = Math.abs(n)
  for (let d = 2; d * d <= m; d++) {
    while (m % d === 0) {
      factors[d] = (factors[d] || 0) + 1
      m /= d
    }
  }
  if (m > 1) factors[m] = (factors[m] || 0) + 1
  return factors
}

// Representació textual de la descomposició: "2³ · 3"
export function factorsToString(n: number): string {
  const f = primeFactors(n)
  const keys = Object.keys(f).map(Number).sort((a, b) => a - b)
  if (keys.length === 0) return String(n)
  const sup = ['', '', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
  return keys
    .map((p) => (f[p] === 1 ? `${p}` : `${p}${sup[f[p]] ?? '^' + f[p]}`))
    .join(' · ')
}

export function divisors(n: number): number[] {
  const result: number[] = []
  for (let i = 1; i <= Math.abs(n); i++) {
    if (n % i === 0) result.push(i)
  }
  return result
}

// ---------- Fraccions ----------

export interface Fraction {
  num: number
  den: number
}

export function fr(num: number, den: number): Fraction {
  return { num, den }
}

export function simplify({ num, den }: Fraction): Fraction {
  if (den === 0) return { num, den }
  const sign = den < 0 ? -1 : 1
  num *= sign
  den *= sign
  const g = gcd(num, den) || 1
  return { num: num / g, den: den / g }
}

export function isSimplified(f: Fraction): boolean {
  const s = simplify(f)
  return s.num === f.num && s.den === f.den
}

export function addFr(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den + b.num * a.den, den: a.den * b.den })
}

export function subFr(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den - b.num * a.den, den: a.den * b.den })
}

export function mulFr(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.num, den: a.den * b.den })
}

export function fracEqual(a: Fraction, b: Fraction): boolean {
  // Igualtat per valor: 2/4 == 1/2
  return a.num * b.den === b.num * a.den
}

export function fracToString({ num, den }: Fraction): string {
  return `${num}/${den}`
}

// Nombre mixt a partir d'una fracció impròpia: 7/3 -> {whole:2, num:1, den:3}
export interface MixedNumber {
  whole: number
  num: number
  den: number
}

export function toMixed({ num, den }: Fraction): MixedNumber {
  const whole = Math.trunc(num / den)
  const rem = Math.abs(num % den)
  return { whole, num: rem, den }
}

// ---------- Estadística ----------

export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

// Retorna la moda (un sol valor). Si n'hi ha diverses, retorna la més petita.
export function mode(values: number[]): number {
  const counts = new Map<number, number>()
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1)
  let best = values[0]
  let bestCount = -1
  for (const v of [...counts.keys()].sort((a, b) => a - b)) {
    const c = counts.get(v)!
    if (c > bestCount) {
      bestCount = c
      best = v
    }
  }
  return best
}

// Arrodoneix a n decimals evitant errors de coma flotant.
export function round(value: number, decimals = 2): number {
  const f = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * f) / f
}
