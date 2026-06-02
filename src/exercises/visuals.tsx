// Components de dibuix per a cada tipus d'exercici (taules i SVG).
// S'associen al tipus mitjançant el registre `VISUALS`.

import { ExerciseType } from './types'
import {
  EstadisticaData,
  RuletaData,
  PizzaData,
  OmbresData,
  TrianglesData,
  AreaData,
  FraccioMixtData,
} from './generators'

const SECTOR_COLORS = [
  '#ffd166',
  '#06d6a0',
  '#118ab2',
  '#ef476f',
  '#8338ec',
  '#fb5607',
  '#3a86ff',
  '#80b918',
]

// ---------- Estadística: taula edats / participants ----------
function EstadisticaVisual({ data }: { data: EstadisticaData }) {
  return (
    <div className="viz-table-wrap">
      <table className="viz-table">
        <tbody>
          <tr>
            <th>Edat</th>
            {data.edats.map((e) => (
              <td key={e}>{e}</td>
            ))}
          </tr>
          <tr>
            <th>Nre. de participants</th>
            {data.freqs.map((f, i) => (
              <td key={i}>{f}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ---------- Ruleta SVG ----------
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function wedgePath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end)
  const e = polarToCartesian(cx, cy, r, start)
  const largeArc = end - start <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} Z`
}

function RuletaVisual({ data }: { data: RuletaData }) {
  const cx = 130
  const cy = 130
  const r = 115
  const per = 360 / data.total
  let acc = 0
  const unitWedges: { path: string; color: string }[] = []
  const labelMarks: { x: number; y: number; label: string }[] = []

  data.sectors.forEach((sec, si) => {
    const color = SECTOR_COLORS[si % SECTOR_COLORS.length]
    const startGroup = acc
    for (let k = 0; k < sec.weight; k++) {
      unitWedges.push({ path: wedgePath(cx, cy, r, acc, acc + per), color })
      acc += per
    }
    const mid = (startGroup + acc) / 2
    const pos = polarToCartesian(cx, cy, r * 0.62, mid)
    labelMarks.push({ x: pos.x, y: pos.y, label: sec.label })
  })

  return (
    <div className="viz-ruleta">
      <svg viewBox="0 0 260 285" width="260" role="img" aria-label="Ruleta de premis">
        {unitWedges.map((w, i) => (
          <path key={i} d={w.path} fill={w.color} stroke="#fff" strokeWidth="2" />
        ))}
        {labelMarks.map((m, i) => (
          <text
            key={i}
            x={m.x}
            y={m.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="ruleta-label"
          >
            {m.label}
          </text>
        ))}
        {/* fletxa indicadora */}
        <polygon points={`${cx},6 ${cx - 10},28 ${cx + 10},28`} fill="#222" />
        <circle cx={cx} cy={cy} r="8" fill="#222" />
      </svg>
      <ul className="viz-legend">
        {data.sectors.map((s, i) => (
          <li key={i}>
            <span
              className="legend-swatch"
              style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }}
            />
            {s.label}: {s.weight} {s.weight === 1 ? 'sector' : 'sectors'}
          </li>
        ))}
        <li className="legend-total">Total: {data.total} sectors</li>
      </ul>
    </div>
  )
}

// ---------- Pizza SVG ----------
function PizzaVisual({ data }: { data: PizzaData }) {
  const cx = 110
  const cy = 110
  const r = 100
  const per = 360 / data.total
  const eaten = data.companys * data.perCompany + data.youEat
  const slices = Array.from({ length: data.total }, (_, i) => {
    const path = wedgePath(cx, cy, r, i * per, (i + 1) * per)
    return { path, eaten: i < eaten }
  })
  return (
    <div className="viz-pizza">
      <svg viewBox="0 0 220 220" width="220" role="img" aria-label="Pizza per trossos">
        <circle cx={cx} cy={cy} r={r + 4} fill="#e8b04b" />
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.eaten ? '#c44536' : '#ffe9b0'}
            stroke="#a8521f"
            strokeWidth="2"
          />
        ))}
      </svg>
      <ul className="viz-legend">
        <li>
          <span className="legend-swatch" style={{ background: '#c44536' }} />
          Trossos menjats
        </li>
        <li>
          <span className="legend-swatch" style={{ background: '#ffe9b0' }} />
          Trossos que sobren
        </li>
      </ul>
    </div>
  )
}

// ---------- Ombres SVG ----------
function OmbresVisual({ data }: { data: OmbresData }) {
  return (
    <div className="viz-ombres">
      <svg viewBox="0 0 320 180" width="320" role="img" aria-label="Arbre i ombres">
        {/* terra */}
        <line x1="0" y1="150" x2="320" y2="150" stroke="#8a6d3b" strokeWidth="3" />
        {/* arbre */}
        <rect x="60" y="70" width="10" height="80" fill="#7a4a1e" />
        <circle cx="65" cy="60" r="34" fill="#3aa655" />
        {/* ombra arbre */}
        <polygon points="70,150 70,146 175,150" fill="#9aa0a6" opacity="0.7" />
        <text x="120" y="168" textAnchor="middle" className="viz-measure">
          ombra arbre = {data.ombraArbre} m
        </text>
        {/* persona */}
        <circle cx="245" cy="120" r="7" fill="#222" />
        <rect x="242" y="127" width="6" height="23" fill="#222" />
        {/* ombra persona */}
        <polygon points="248,150 248,147 280,150" fill="#9aa0a6" opacity="0.7" />
        <text x="255" y="115" textAnchor="middle" className="viz-measure">
          jo = {String(data.alcadaMeva).replace('.', ',')} m
        </text>
        <text x="280" y="168" textAnchor="middle" className="viz-measure">
          ombra = {data.ombraMeva} m
        </text>
      </svg>
    </div>
  )
}

// ---------- Triangles SVG ----------
function TrianglesVisual({ data }: { data: TrianglesData }) {
  return (
    <div className="viz-triangles">
      {data.triangles.map((t, i) => (
        <div key={i} className="viz-triangle">
          <svg viewBox="0 0 124 112" width="130" role="img" aria-label={`Triangle ${i + 1}`}>
            <polygon
              points={t.points.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="#cfe8ff"
              stroke="#1f6fb2"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
          <span className="viz-triangle-num">Triangle {i + 1}</span>
        </div>
      ))}
    </div>
  )
}

// ---------- Àrea SVG ----------
function AreaVisual({ data }: { data: AreaData }) {
  if (data.shape === 'rectangle') {
    const b = data.base!
    const h = data.alcada!
    return (
      <div className="viz-area">
        <svg viewBox="0 0 240 170" width="260" role="img" aria-label="Teulada rectangular">
          {/* casa amb teulada */}
          <polygon points="30,80 120,30 210,80" fill="#9c4a2f" stroke="#6e3320" strokeWidth="2" />
          <rect x="50" y="80" width="140" height="70" fill="#f0e2c8" stroke="#b9a37d" strokeWidth="2" />
          <rect x="105" y="110" width="30" height="40" fill="#8a6d3b" />
          <text x="120" y="22" textAnchor="middle" className="viz-measure">
            base = {b} m
          </text>
          <text x="225" y="58" textAnchor="middle" className="viz-measure">
            {h} m
          </text>
          <line x1="30" y1="80" x2="210" y2="80" stroke="#333" strokeDasharray="4 3" />
        </svg>
      </div>
    )
  }
  // trapezi
  const b1 = data.base1!
  const b2 = data.base2!
  const h = data.alcada!
  return (
    <div className="viz-area">
      <svg viewBox="0 0 240 160" width="260" role="img" aria-label="Teulada trapezoïdal">
        <polygon points="70,30 170,30 210,120 30,120" fill="#9c4a2f" stroke="#6e3320" strokeWidth="2" />
        <text x="120" y="22" textAnchor="middle" className="viz-measure">
          {b1} m
        </text>
        <text x="120" y="138" textAnchor="middle" className="viz-measure">
          {b2} m
        </text>
        <text x="225" y="78" textAnchor="middle" className="viz-measure">
          {h} m
        </text>
      </svg>
    </div>
  )
}

// ---------- Finestres (fracció impròpia / nombre mixt) ----------
function FraccioMixtVisual({ data }: { data: FraccioMixtData }) {
  const cols = data.panes === 6 ? 3 : 2
  const rows = data.panes / cols
  const cell = 26
  const w = cols * cell
  const h = rows * cell
  return (
    <div className="viz-windows">
      {data.figures.map((filled, fi) => {
        const cells = []
        for (let i = 0; i < data.panes; i++) {
          const c = i % cols
          const rr = Math.floor(i / cols)
          cells.push(
            <rect
              key={i}
              x={c * cell}
              y={rr * cell}
              width={cell}
              height={cell}
              fill={i < filled ? '#3a86ff' : '#fff'}
              stroke="#264653"
              strokeWidth="2"
            />,
          )
        }
        return (
          <svg
            key={fi}
            viewBox={`-2 -2 ${w + 4} ${h + 4}`}
            width={w + 4}
            height={h + 4}
            role="img"
            aria-label={`Finestra ${fi + 1}`}
          >
            {cells}
          </svg>
        )
      })}
    </div>
  )
}

// ---------- Registre ----------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VISUALS: Partial<Record<ExerciseType, (props: { data: any }) => JSX.Element>> = {
  estadistica: EstadisticaVisual,
  ruleta: RuletaVisual,
  pizza: PizzaVisual,
  ombres: OmbresVisual,
  triangles: TrianglesVisual,
  area: AreaVisual,
  'fraccio-mixt': FraccioMixtVisual,
}
