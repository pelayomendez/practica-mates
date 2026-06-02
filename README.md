# Practica l'examen de mates 🧮

Web app educativa per **repetir i practicar** un examen de matemàtiques de
primària (català). Permet fer l'examen original o **generar variants automàtiques**
amb números nous mantenint el mateix tipus de problema. Tot funciona al navegador,
sense backend.

## Posar-ho en marxa

```bash
npm install
npm run dev      # servidor de desenvolupament (http://localhost:5173)
npm run build    # compila per a producció a dist/
npm run preview  # serveix la build de producció
```

## Què fa

- **Pantalla inicial**: «Fer examen original», «Generar variant», «Veure resultats».
- **Examen en format full** amb 11 exercicis, zona de resposta, botó *Comprovar*
  i feedback (correcte / torna-ho a provar) amb explicació pas a pas opcional.
- **Mode profe/pares**: mostra les respostes correctes i els passos de tots els
  exercicis.
- **Puntuació final** amb percentatge, exercicis a repassar i historial
  (desat a `localStorage`).
- Botons per **imprimir** i **generar una variant nova**.

### Els 11 exercicis

1. Estadística (total, mediana, moda, mitjana) amb taula d'edats/participants.
2. Màxim comú divisor (m.c.d.).
3. Mínim comú múltiple (m.c.m.).
4. Operacions amb fraccions (suma, resta, multiplicació) demanant simplificar.
5. Percentatges (problema de descompte).
6. Probabilitat amb ruleta (SVG).
7. Fraccions de pizza (SVG).
8. Proporcionalitat amb ombres (regla de tres).
9. Tipus de triangles (classificació per costats i angles, SVG).
10. Àrea d'una teulada rectangular o trapezoïdal (SVG).
11. Fracció impròpia i nombre mixt (finestres amb vidres pintats, SVG).

## Arquitectura

| Fitxer | Responsabilitat |
|---|---|
| `src/lib/rng.ts` | Generador aleatori amb llavor (determinista). |
| `src/lib/math.ts` | m.c.d., m.c.m., fraccions, estadística. |
| `src/lib/answer.ts` | `checkAnswer` tolerant (fraccions equivalents, coma/punt decimal). |
| `src/exercises/generators.ts` | `generateExam(seed)` i un generador per exercici. |
| `src/exercises/geometry.ts` | Classificació de triangles. |
| `src/exercises/visuals.tsx` | Components de dibuix (taules i SVG) per tipus. |
| `src/components/` | `ExerciseCard`, `PartInput`, format de respostes. |
| `src/screens/` | Pantalles Home, Exam i Results. |
| `src/state/storage.ts` | Desat de resultats a `localStorage`. |

### Generació i correcció

`generateExam(seed, { original? })` retorna un examen complet i **determinista**:
la mateixa llavor produeix sempre el mateix examen (clau per regenerar-lo). Cada
exercici té `id`, `type`, `statement`, `data`, les seves preguntes amb la
`correctAnswer` calculada i una `explanation`. El component de dibuix s'associa al
`type` mitjançant el registre `VISUALS`.

La correcció (`checkAnswer`) accepta respostes equivalents:

- Fraccions: `2/4` = `1/2` (i pot exigir simplificació quan cal).
- Nombres: coma o punt decimal, amb marge d'error petit.
- Text/opcions: sense distingir majúscules ni accents.
