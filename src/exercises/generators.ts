// Generadors de cada tipus d'exercici i la funció generateExam(seed).
// Cada generador produeix dades reals i respostes calculades (no maquetes).

import { RNG } from '../lib/rng'
import {
  Fraction,
  fr,
  addFr,
  subFr,
  mulFr,
  simplify,
  fracToString,
  toMixed,
  factorsToString,
  gcd,
  lcm,
  mean,
  median,
  mode,
  round,
} from '../lib/math'
import { Exam, Exercise, ExerciseType } from './types'
import { Point, TRIANGLE_TEMPLATES, classifySides, classifyAngles } from './geometry'

// ---------- Dades específiques de cada exercici ----------

export interface EstadisticaData {
  edats: number[]
  freqs: number[]
}
export interface McxData {
  pairs: [number, number][]
}
export interface FraccionsData {
  ops: { op: '+' | '−' | '×'; a: Fraction; b: Fraction }[]
}
export interface PercentatgesData {
  preu: number
  descompte: number
}
export interface RuletaData {
  sectors: { label: string; weight: number }[]
  total: number
  askX: string
  askY: string
}
export interface PizzaData {
  total: number
  companys: number
  perCompany: number
  youEat: number
}
export interface OmbresData {
  ombraArbre: number
  ombraMeva: number
  alcadaMeva: number
}
export interface TrianglesData {
  triangles: { points: Point[] }[]
}
export interface AreaData {
  shape: 'rectangle' | 'trapezi'
  base?: number
  alcada?: number
  base1?: number
  base2?: number
}
export interface FraccioMixtData {
  panes: number
  figures: number[] // vidres pintats per finestra
}

// ============================================================
// EXERCICI 1 — Estadística
// ============================================================
function genEstadistica(rng: RNG, original: boolean, num: number): Exercise<EstadisticaData> {
  let edats: number[]
  let freqs: number[]

  if (original) {
    edats = [7, 8, 9, 10, 11, 12, 13]
    freqs = [1, 2, 8, 3, 3, 2, 1]
  } else {
    const start = rng.int(6, 9)
    const count = rng.int(6, 7)
    edats = Array.from({ length: count }, (_, i) => start + i)
    freqs = edats.map(() => rng.int(1, 9))
    // Garantim una moda única: si hi ha empat al màxim, el desfem.
    const max = Math.max(...freqs)
    const maxIdxs = freqs.flatMap((f, i) => (f === max ? [i] : []))
    if (maxIdxs.length > 1) freqs[maxIdxs[0]] = max + 1
  }

  const values: number[] = []
  edats.forEach((e, i) => {
    for (let k = 0; k < freqs[i]; k++) values.push(e)
  })
  const total = freqs.reduce((a, b) => a + b, 0)
  const med = median(values)
  const mod = mode(values)
  const mit = round(mean(values), 2)

  return {
    id: `e${num}`,
    type: 'estadistica',
    number: num,
    title: 'Estadística',
    statement:
      'Les edats dels participants en una competició de piragüisme són les següents.',
    data: { edats, freqs },
    parts: [
      {
        id: `e${num}-total`,
        prompt: 'Quants participants hi ha?',
        inputKind: 'number',
        placeholder: 'Nombre total',
        answer: { kind: 'number', value: total, tolerance: 0 },
        explanation: `Sumem totes les freqüències: ${freqs.join(' + ')} = ${total}.`,
      },
      {
        id: `e${num}-mediana`,
        prompt: 'Quina és la mediana de les edats?',
        inputKind: 'number',
        placeholder: 'Mediana',
        answer: { kind: 'number', value: med, tolerance: 0.01 },
        explanation: `Ordenem les ${total} edats i busquem el valor central. La mediana és ${med}.`,
      },
      {
        id: `e${num}-moda`,
        prompt: 'Quina és la moda de les edats?',
        inputKind: 'number',
        placeholder: 'Moda',
        answer: { kind: 'number', value: mod, tolerance: 0 },
        explanation: `La moda és l'edat que es repeteix més vegades: ${mod} anys.`,
      },
      {
        id: `e${num}-mitjana`,
        prompt: 'Quina és la mitjana de les edats?',
        inputKind: 'number',
        placeholder: 'Mitjana',
        answer: { kind: 'number', value: mit, tolerance: 0.05 },
        explanation:
          `Sumem (edat × participants) i dividim pel total: ` +
          `${edats.map((e, i) => `${e}·${freqs[i]}`).join(' + ')} = ${values.reduce((a, b) => a + b, 0)}; ` +
          `${values.reduce((a, b) => a + b, 0)} ÷ ${total} ≈ ${mit}.`,
      },
    ],
  }
}

// ============================================================
// EXERCICI 2 — m.c.d.
// ============================================================
function makeCoprimePair(rng: RNG): [number, number] {
  const g = rng.int(2, 8)
  let m = rng.int(2, 6)
  let n = rng.int(2, 6)
  while (gcd(m, n) !== 1 || m === n) {
    m = rng.int(2, 6)
    n = rng.int(2, 7)
  }
  return [g * m, g * n]
}

function genMcd(rng: RNG, original: boolean, num: number): Exercise<McxData> {
  const pairs: [number, number][] = original
    ? [
        [9, 24],
        [12, 16],
      ]
    : [makeCoprimePair(rng), makeCoprimePair(rng)]

  return {
    id: `e${num}`,
    type: 'mcd',
    number: num,
    title: 'Màxim comú divisor',
    statement: 'Calcula el màxim comú divisor de cada parella de nombres.',
    data: { pairs },
    parts: pairs.map(([a, b], i) => {
      const res = gcd(a, b)
      return {
        id: `e${num}-${i}`,
        prompt: `m.c.d. (${a}, ${b})`,
        inputKind: 'number' as const,
        placeholder: 'm.c.d.',
        answer: { kind: 'number' as const, value: res, tolerance: 0 },
        explanation:
          `Descomponem: ${a} = ${factorsToString(a)} i ${b} = ${factorsToString(b)}. ` +
          `Multipliquem els factors comuns amb el menor exponent → m.c.d. = ${res}.`,
      }
    }),
  }
}

// ============================================================
// EXERCICI 3 — m.c.m.
// ============================================================
function genMcm(rng: RNG, original: boolean, num: number): Exercise<McxData> {
  const pairs: [number, number][] = original
    ? [
        [4, 6],
        [2, 14],
      ]
    : [
        [rng.int(2, 9), rng.int(3, 12)],
        [rng.int(2, 8), rng.int(4, 14)],
      ]

  return {
    id: `e${num}`,
    type: 'mcm',
    number: num,
    title: 'Mínim comú múltiple',
    statement: 'Calcula el mínim comú múltiple de cada parella de nombres.',
    data: { pairs },
    parts: pairs.map(([a, b], i) => {
      const res = lcm(a, b)
      return {
        id: `e${num}-${i}`,
        prompt: `m.c.m. (${a}, ${b})`,
        inputKind: 'number' as const,
        placeholder: 'm.c.m.',
        answer: { kind: 'number' as const, value: res, tolerance: 0 },
        explanation:
          `Descomponem: ${a} = ${factorsToString(a)} i ${b} = ${factorsToString(b)}. ` +
          `Agafem tots els factors amb el major exponent → m.c.m. = ${res}.`,
      }
    }),
  }
}

// ============================================================
// EXERCICI 4 — Fraccions
// ============================================================
function properFraction(rng: RNG): Fraction {
  const den = rng.int(2, 9)
  const numv = rng.int(1, den - 1)
  return fr(numv, den)
}

function genFraccions(rng: RNG, original: boolean, num: number): Exercise<FraccionsData> {
  let ops: FraccionsData['ops']
  if (original) {
    ops = [
      { op: '+', a: fr(1, 4), b: fr(3, 8) },
      { op: '−', a: fr(5, 6), b: fr(1, 2) },
      { op: '×', a: fr(2, 3), b: fr(3, 4) },
    ]
  } else {
    let a = properFraction(rng)
    let b = properFraction(rng)
    // Per a la resta, ens assegurem que el resultat no sigui negatiu.
    if (subFr(a, b).num < 0) [a, b] = [b, a]
    ops = [
      { op: '+', a: properFraction(rng), b: properFraction(rng) },
      { op: '−', a, b },
      { op: '×', a: properFraction(rng), b: properFraction(rng) },
    ]
  }

  const opName = { '+': 'suma', '−': 'resta', '×': 'multiplicació' }

  return {
    id: `e${num}`,
    type: 'fraccions',
    number: num,
    title: 'Operacions amb fraccions',
    statement: 'Calcula i simplifica el resultat sempre que es pugui.',
    data: { ops },
    parts: ops.map((o, i) => {
      const res =
        o.op === '+' ? addFr(o.a, o.b) : o.op === '−' ? subFr(o.a, o.b) : mulFr(o.a, o.b)
      const resS = simplify(res)
      let steps: string
      if (o.op === '×') {
        steps = `Multipliquem numeradors i denominadors: ${o.a.num}·${o.b.num}/${o.a.den}·${o.b.den} = ${o.a.num * o.b.num}/${o.a.den * o.b.den}, i simplifiquem → ${fracToString(resS)}.`
      } else {
        const den = o.a.den * o.b.den
        const symbol = o.op === '+' ? '+' : '−'
        steps = `Reduïm a denominador comú (${den}) i ${opName[o.op]}: ${o.a.num * o.b.den}/${den} ${symbol} ${o.b.num * o.a.den}/${den}, i simplifiquem → ${fracToString(resS)}.`
      }
      return {
        id: `e${num}-${i}`,
        prompt: `${fracToString(o.a)} ${o.op} ${fracToString(o.b)} =`,
        inputKind: 'fraction' as const,
        placeholder: 'p. ex. 3/4',
        answer: { kind: 'fraction' as const, value: resS, requireSimplified: true },
        explanation: steps,
      }
    }),
  }
}

// ============================================================
// EXERCICI 5 — Percentatges (descompte)
// ============================================================
function genPercentatges(rng: RNG, original: boolean, num: number): Exercise<PercentatgesData> {
  const preu = original ? 16 : rng.int(2, 20) * 4 // múltiple de 4, 8..80
  const descompte = original ? 25 : rng.pick([10, 15, 20, 25, 30, 40, 50])
  const rebaixa = round((preu * descompte) / 100, 2)
  const final = round(preu - rebaixa, 2)

  return {
    id: `e${num}`,
    type: 'percentatges',
    number: num,
    title: 'Percentatges',
    statement: `El preu d'un producte és de ${preu} €. Si tens un descompte del ${descompte} %, quant costa al final?`,
    data: { preu, descompte },
    parts: [
      {
        id: `e${num}-0`,
        prompt: 'Preu final amb el descompte (€):',
        inputKind: 'number',
        placeholder: '€',
        answer: { kind: 'number', value: final, tolerance: 0.01 },
        explanation:
          `El descompte és ${preu} × ${descompte}/100 = ${rebaixa} €. ` +
          `El preu final és ${preu} − ${rebaixa} = ${final} €.`,
      },
    ],
  }
}

// ============================================================
// EXERCICI 6 — Probabilitat amb ruleta
// ============================================================
const PREMI_POOL = [
  'pizza i beguda',
  'samarreta',
  'tovallola',
  'got de vidre',
  'pizza',
  'gorra',
  'clauer',
  'val de 5 €',
]

function genRuleta(rng: RNG, original: boolean, num: number): Exercise<RuletaData> {
  let sectors: { label: string; weight: number }[]
  if (original) {
    sectors = [
      { label: 'pizza i beguda', weight: 3 },
      { label: 'samarreta', weight: 1 },
      { label: 'tovallola', weight: 1 },
      { label: 'got de vidre', weight: 1 },
      { label: 'pizza', weight: 2 },
    ]
  } else {
    const labels = rng.shuffle(PREMI_POOL).slice(0, rng.int(4, 5))
    sectors = labels.map((label) => ({ label, weight: rng.int(1, 3) }))
    // Moda única (premi més probable únic).
    const max = Math.max(...sectors.map((s) => s.weight))
    const maxs = sectors.filter((s) => s.weight === max)
    if (maxs.length > 1) maxs[0].weight = max + 1
  }

  const total = sectors.reduce((a, s) => a + s.weight, 0)
  const maxW = Math.max(...sectors.map((s) => s.weight))
  const minW = Math.min(...sectors.map((s) => s.weight))
  const mostProbable = sectors.find((s) => s.weight === maxW)!.label
  const leastLabels = sectors.filter((s) => s.weight === minW).map((s) => s.label)

  // Triem dos premis per a les preguntes c) i d).
  const askX = sectors[0].label
  const askY = sectors[sectors.length - 1].label
  const pX = simplify(fr(sectors[0].weight, total))
  const pY = simplify(fr(sectors[sectors.length - 1].weight, total))

  return {
    id: `e${num}`,
    type: 'ruleta',
    number: num,
    title: 'Probabilitat amb la ruleta',
    statement:
      'En acabar la competició, el club reparteix premis amb una ruleta. Cada sector té la mateixa mida.',
    data: { sectors, total, askX, askY },
    parts: [
      {
        id: `e${num}-a`,
        prompt: 'Quin premi és més probable que et toqui?',
        inputKind: 'choice',
        choices: sectors.map((s) => s.label),
        answer: { kind: 'choice', value: mostProbable },
        explanation: `«${mostProbable}» ocupa més sectors (${maxW} de ${total}), per tant és el més probable.`,
      },
      {
        id: `e${num}-b`,
        prompt: 'Quin premi és menys probable?',
        inputKind: 'choice',
        choices: sectors.map((s) => s.label),
        answer: { kind: 'choice', value: leastLabels[0], accept: leastLabels },
        explanation: `El premi (o premis) amb menys sectors (${minW} de ${total}) és el menys probable.`,
      },
      {
        id: `e${num}-c`,
        prompt: `Quina probabilitat tens que et toqui «${askX}»?`,
        inputKind: 'fraction',
        placeholder: 'p. ex. 1/8',
        answer: { kind: 'fraction', value: pX },
        explanation: `Hi ha ${sectors[0].weight} sectors de «${askX}» sobre ${total} → ${fracToString(pX)}.`,
      },
      {
        id: `e${num}-d`,
        prompt: `Quina probabilitat tens que et toqui «${askY}»?`,
        inputKind: 'fraction',
        placeholder: 'p. ex. 1/8',
        answer: { kind: 'fraction', value: pY },
        explanation: `Hi ha ${sectors[sectors.length - 1].weight} sectors de «${askY}» sobre ${total} → ${fracToString(pY)}.`,
      },
    ],
  }
}

// ============================================================
// EXERCICI 7 — Fraccions de pizza
// ============================================================
function genPizza(rng: RNG, original: boolean, num: number): Exercise<PizzaData> {
  let total: number, companys: number, perCompany: number, youEat: number
  if (original) {
    total = 12
    companys = 2
    perCompany = 3
    youEat = 3
  } else {
    do {
      total = rng.pick([8, 10, 12, 16])
      companys = rng.int(1, 3)
      perCompany = rng.int(1, 3)
      youEat = rng.int(1, 4)
    } while (companys * perCompany + youEat >= total || companys * perCompany + youEat < 1)
  }
  const eaten = companys * perCompany + youEat
  const left = total - eaten
  const fEaten = simplify(fr(eaten, total))
  const fLeft = simplify(fr(left, total))

  return {
    id: `e${num}`,
    type: 'pizza',
    number: num,
    title: 'Fraccions de pizza',
    statement: `Tens una pizza tallada en ${total} trossos. Dones ${perCompany} trossos a cadascun dels teus ${companys} ${companys === 1 ? 'company' : 'companys'} i tu en menges ${youEat}.`,
    data: { total, companys, perCompany, youEat },
    parts: [
      {
        id: `e${num}-menjat`,
        prompt: 'Quina fracció de la pizza heu menjat en total?',
        inputKind: 'fraction',
        placeholder: `p. ex. ${eaten}/${total}`,
        answer: { kind: 'fraction', value: fEaten },
        explanation: `Menjats: ${companys}·${perCompany} + ${youEat} = ${eaten} trossos de ${total} → ${eaten}/${total} = ${fracToString(fEaten)}.`,
      },
      {
        id: `e${num}-sobrat`,
        prompt: 'Quina fracció de la pizza ha sobrat?',
        inputKind: 'fraction',
        placeholder: `p. ex. ${left}/${total}`,
        answer: { kind: 'fraction', value: fLeft },
        explanation: `Sobren ${total} − ${eaten} = ${left} trossos de ${total} → ${left}/${total} = ${fracToString(fLeft)}.`,
      },
    ],
  }
}

// ============================================================
// EXERCICI 8 — Proporcionalitat (ombres)
// ============================================================
function genOmbres(rng: RNG, original: boolean, num: number): Exercise<OmbresData> {
  let ombraMeva: number, alcadaMeva: number, k: number
  if (original) {
    ombraMeva = 6
    alcadaMeva = 1.5
    k = 5
  } else {
    ombraMeva = rng.int(4, 8)
    alcadaMeva = rng.pick([1.4, 1.5, 1.6, 1.7])
    k = rng.int(3, 7)
  }
  const ombraArbre = ombraMeva * k
  const alcadaArbre = round(alcadaMeva * k, 2)

  return {
    id: `e${num}`,
    type: 'ombres',
    number: num,
    title: 'Proporcionalitat (ombres)',
    statement: `L'ombra d'un arbre fa ${ombraArbre} m. La teva ombra fa ${ombraMeva} m i la teva alçada és ${String(alcadaMeva).replace('.', ',')} m. Quina és l'alçada de l'arbre?`,
    data: { ombraArbre, ombraMeva, alcadaMeva },
    parts: [
      {
        id: `e${num}-0`,
        prompt: "Alçada de l'arbre (m):",
        inputKind: 'number',
        placeholder: 'm',
        answer: { kind: 'number', value: alcadaArbre, tolerance: 0.05 },
        explanation:
          `Regla de tres: alçada = (ombra arbre × alçada teva) ÷ ombra teva = ` +
          `(${ombraArbre} × ${String(alcadaMeva).replace('.', ',')}) ÷ ${ombraMeva} = ${String(alcadaArbre).replace('.', ',')} m.`,
      },
    ],
  }
}

// ============================================================
// EXERCICI 9 — Tipus de triangles
// ============================================================
function genTriangles(rng: RNG, original: boolean, num: number): Exercise<TrianglesData> {
  const chosen = original
    ? [TRIANGLE_TEMPLATES[4], TRIANGLE_TEMPLATES[1], TRIANGLE_TEMPLATES[6]]
    : rng.shuffle(TRIANGLE_TEMPLATES).slice(0, 3)

  return {
    id: `e${num}`,
    type: 'triangles',
    number: num,
    title: 'Tipus de triangles',
    statement:
      'Observa cada triangle i classifica\'l segons els seus costats i segons els seus angles.',
    data: { triangles: chosen.map((t) => ({ points: t.points })) },
    parts: chosen.flatMap((t, i) => {
      const sides = classifySides(t.points)
      const angles = classifyAngles(t.points)
      return [
        {
          id: `e${num}-${i}-costats`,
          prompt: `Triangle ${i + 1} — segons els costats:`,
          inputKind: 'choice' as const,
          choices: ['equilàter', 'isòsceles', 'escalè'],
          answer: { kind: 'choice' as const, value: sides },
          explanation: `Comparant les longituds dels costats, el triangle ${i + 1} és ${sides}.`,
        },
        {
          id: `e${num}-${i}-angles`,
          prompt: `Triangle ${i + 1} — segons els angles:`,
          inputKind: 'choice' as const,
          choices: ['rectangle', 'acutangle', 'obtusangle'],
          answer: { kind: 'choice' as const, value: angles },
          explanation: `Mirant l'angle més gran, el triangle ${i + 1} és ${angles}.`,
        },
      ]
    }),
  }
}

// ============================================================
// EXERCICI 10 — Àrea
// ============================================================
function genArea(rng: RNG, original: boolean, num: number): Exercise<AreaData> {
  let data: AreaData
  let area: number
  let steps: string

  if (original) {
    data = { shape: 'rectangle', base: 10, alcada: 5 }
    area = 50
    steps = 'Àrea del rectangle = base × alçada = 10 × 5 = 50 m².'
  } else if (rng.next() < 0.5) {
    const base = rng.int(4, 15)
    const alcada = rng.int(3, 10)
    data = { shape: 'rectangle', base, alcada }
    area = base * alcada
    steps = `Àrea del rectangle = base × alçada = ${base} × ${alcada} = ${area} m².`
  } else {
    const base1 = rng.int(4, 10)
    const base2 = base1 + rng.int(2, 8) // bases diferents
    const alcada = rng.int(3, 8)
    data = { shape: 'trapezi', base1, base2, alcada }
    area = round(((base1 + base2) / 2) * alcada, 2)
    steps = `Àrea del trapezi = (base gran + base petita) ÷ 2 × alçada = (${base2} + ${base1}) ÷ 2 × ${alcada} = ${area} m².`
  }

  return {
    id: `e${num}`,
    type: 'area',
    number: num,
    title: 'Àrea de la figura',
    statement: 'Calcula l\'àrea de la teulada a partir de les mides del dibuix.',
    data,
    parts: [
      {
        id: `e${num}-0`,
        prompt: 'Àrea (m²):',
        inputKind: 'number',
        placeholder: 'm²',
        answer: { kind: 'number', value: area, tolerance: 0.05 },
        explanation: steps,
      },
    ],
  }
}

// ============================================================
// EXERCICI 11 — Fracció impròpia i nombre mixt
// ============================================================
function genFraccioMixt(rng: RNG, original: boolean, num: number): Exercise<FraccioMixtData> {
  let panes: number
  let figures: number[]
  if (original) {
    panes = 4
    figures = [4, 4, 2] // 10/4 = 2 2/4
  } else {
    panes = rng.pick([4, 6])
    const nFig = rng.int(3, 4)
    do {
      figures = Array.from({ length: nFig }, () => rng.int(0, panes))
    } while (
      figures.reduce((a, b) => a + b, 0) <= panes || // ha de ser impròpia (> 1)
      figures.every((f) => f === panes) // que no estiguin totes plenes
    )
  }

  const filled = figures.reduce((a, b) => a + b, 0)
  const improper = fr(filled, panes)
  const mixed = toMixed(improper)

  return {
    id: `e${num}`,
    type: 'fraccio-mixt',
    number: num,
    title: 'Fracció impròpia i nombre mixt',
    statement:
      'Cada finestra està dividida en vidres. Expressa els vidres pintats de blau en forma de fracció impròpia i com a nombre mixt.',
    data: { panes, figures },
    parts: [
      {
        id: `e${num}-impropia`,
        prompt: 'Fracció impròpia:',
        inputKind: 'fraction',
        placeholder: `p. ex. ${filled}/${panes}`,
        answer: { kind: 'fraction', value: improper },
        explanation: `Hi ha ${filled} vidres pintats i cada finestra en té ${panes} → ${filled}/${panes}.`,
      },
      {
        id: `e${num}-mixt`,
        prompt: 'Nombre mixt:',
        inputKind: 'mixed',
        placeholder: 'p. ex. 2 1/4',
        answer: { kind: 'mixed', value: mixed },
        explanation: `${filled} ÷ ${panes} = ${mixed.whole} i sobren ${mixed.num} → ${mixed.whole} ${mixed.num}/${mixed.den}.`,
      },
    ],
  }
}

// ============================================================
// generateExam(seed)
// ============================================================
export interface GenerateOptions {
  original?: boolean
}

export function generateExam(seed: number, opts: GenerateOptions = {}): Exam {
  const original = opts.original ?? false
  const rng = new RNG(seed)

  const exercises: Exercise[] = [
    genEstadistica(rng, original, 1),
    genMcd(rng, original, 2),
    genMcm(rng, original, 3),
    genFraccions(rng, original, 4),
    genPercentatges(rng, original, 5),
    genRuleta(rng, original, 6),
    genPizza(rng, original, 7),
    genOmbres(rng, original, 8),
    genTriangles(rng, original, 9),
    genArea(rng, original, 10),
    genFraccioMixt(rng, original, 11),
  ]

  return {
    seed,
    isOriginal: original,
    createdAt: 0, // l'assigna qui el desa, per mantenir-lo determinista
    exercises,
  }
}

export const EXERCISE_ORDER: ExerciseType[] = [
  'estadistica',
  'mcd',
  'mcm',
  'fraccions',
  'percentatges',
  'ruleta',
  'pizza',
  'ombres',
  'triangles',
  'area',
  'fraccio-mixt',
]
