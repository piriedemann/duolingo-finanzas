export type Category =
  | 'ahorro'
  | 'presupuesto'
  | 'deudas'
  | 'inversion'
  | 'interes_compuesto'
  | 'mentalidad'
  | 'carrera_ingresos'
  | 'emprendimiento'
  | 'jubilacion'
  | 'vivienda'
  | 'seguros_riesgo'
  | 'cripto'
  | 'otros'

/** Tarjeta de concepto: enseña antes de preguntar. No tiene respuesta. */
export interface ConceptCard {
  type: 'concept'
  title: string
  body: string // admite **negritas** simples
  emoji?: string
}

export interface MultipleChoice {
  type: 'mc'
  prompt: string
  options: string[]
  answer: number
  /** Feedback opcional por opción (útil para escenarios) */
  feedback?: string[]
  explain: string
}

export interface TrueFalse {
  type: 'tf'
  statement: string
  answer: boolean
  explain: string
}

/** Oración con un hueco "___" y opciones para completarlo */
export interface FillBlank {
  type: 'fill'
  sentence: string
  options: string[]
  answer: number
  explain: string
}

export interface MatchPairs {
  type: 'match'
  prompt: string
  pairs: [string, string][] // 3 a 5 pares
}

/** Ordenar pasos: items vienen en el orden correcto, la app los baraja */
export interface OrderSteps {
  type: 'order'
  prompt: string
  items: string[]
  explain: string
}

/** Estimar un número con un slider */
export interface NumberEstimate {
  type: 'number'
  prompt: string
  min: number
  max: number
  step: number
  answer: number
  tolerance: number // diferencia absoluta aceptada
  unit?: string // '$', '%', 'años', etc.
  explain: string
}

export type Exercise =
  | ConceptCard
  | MultipleChoice
  | TrueFalse
  | FillBlank
  | MatchPairs
  | OrderSteps
  | NumberEstimate

export interface Lesson {
  id: string // único global, ej. 'hormiga-1'
  title: string
  /** números de episodio relacionados (ver data/episodes.ts) */
  episodeRefs?: number[]
  exercises: Exercise[]
}

export interface Unit {
  id: string
  animal: string // nombre, ej. 'La Hormiga'
  emoji: string
  color: string // color principal (hex)
  colorDark: string // sombra de botón (hex)
  title: string
  description: string
  lessons: Lesson[]
}

export interface Episode {
  number: number | null
  title: string
  guest?: string | null
  summary: string
  takeaways: string[]
  category: Category
  source?: string
  confidence?: 'high' | 'medium' | 'low'
}
