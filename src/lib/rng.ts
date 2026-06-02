// Generador de nombres pseudoaleatoris amb llavor (seed) determinista.
// Mateixa llavor -> mateixa seqüència. Imprescindible per regenerar exàmens.

export class RNG {
  private state: number

  constructor(seed: number) {
    // Assegurem un estat inicial diferent de zero.
    this.state = (seed >>> 0) || 0x9e3779b9
  }

  // Mulberry32: ràpid, determinista i prou bo per a aquest ús.
  next(): number {
    this.state |= 0
    this.state = (this.state + 0x6d2b79f5) | 0
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  // Enter entre min i max, tots dos inclosos.
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  // Tria un element d'una llista.
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)]
  }

  // Barreja una còpia de la llista (Fisher-Yates).
  shuffle<T>(arr: readonly T[]): T[] {
    const copy = arr.slice()
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i)
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }
}

// Converteix qualsevol text en una llavor numèrica estable (hash).
export function seedFromString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
