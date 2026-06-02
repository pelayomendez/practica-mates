// Geometria per a l'exercici de triangles: classificació per costats i angles.

export interface Point {
  x: number
  y: number
}

export type SideClass = 'equilàter' | 'isòsceles' | 'escalè'
export type AngleClass = 'rectangle' | 'acutangle' | 'obtusangle'

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function classifySides(p: Point[]): SideClass {
  const [a, b, c] = [dist(p[0], p[1]), dist(p[1], p[2]), dist(p[2], p[0])]
  const eq = (x: number, y: number) => Math.abs(x - y) < 0.5
  if (eq(a, b) && eq(b, c)) return 'equilàter'
  if (eq(a, b) || eq(b, c) || eq(a, c)) return 'isòsceles'
  return 'escalè'
}

export function classifyAngles(p: Point[]): AngleClass {
  // Costats al quadrat
  const sides = [dist(p[0], p[1]), dist(p[1], p[2]), dist(p[2], p[0])]
    .map((s) => s * s)
    .sort((x, y) => x - y)
  const [s1, s2, s3] = sides // s3 és el costat més gran
  const diff = s3 - (s1 + s2)
  const tol = 3 // marge per al cas recte
  if (Math.abs(diff) <= tol) return 'rectangle'
  if (diff > 0) return 'obtusangle'
  return 'acutangle'
}

// Plantilles de triangles amb classificació coneguda i comprovable.
// Coordenades pensades per dibuixar-se bé en un viewBox d'uns 120x110.
export interface TriangleTemplate {
  points: Point[]
}

export const TRIANGLE_TEMPLATES: TriangleTemplate[] = [
  // Equilàter (acutangle)
  { points: [{ x: 60, y: 9 }, { x: 10, y: 96 }, { x: 110, y: 96 }] },
  // Isòsceles acutangle (alt i estret però <90)
  { points: [{ x: 60, y: 8 }, { x: 28, y: 98 }, { x: 92, y: 98 }] },
  // Isòsceles rectangle
  { points: [{ x: 15, y: 15 }, { x: 15, y: 100 }, { x: 100, y: 100 }] },
  // Isòsceles obtusangle (ample i molt baix)
  { points: [{ x: 60, y: 58 }, { x: 8, y: 100 }, { x: 112, y: 100 }] },
  // Escalè rectangle (catets ben diferents)
  { points: [{ x: 18, y: 18 }, { x: 18, y: 100 }, { x: 105, y: 100 }] },
  // Escalè acutangle
  { points: [{ x: 55, y: 12 }, { x: 15, y: 92 }, { x: 112, y: 78 }] },
  // Escalè obtusangle
  { points: [{ x: 10, y: 30 }, { x: 40, y: 95 }, { x: 120, y: 80 }] },
]
