import type { Category, Episode, Exercise } from './types'
import raw from './episodes.json'
import { EPISODE_QUIZZES } from './episodeQuizzes'

export interface EpisodeX extends Episode {
  id: string
  date?: string
  fromTranscript?: boolean
}

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)

// Contenido generado desde transcripts (scripts/generate-from-transcripts.ts), si existe
const generated = import.meta.glob<{ default: unknown }>('./generated/*.json', { eager: true })
const genEpisodes = (generated['./generated/episodes.json']?.default ?? []) as (Episode & { date?: string })[]
export const GENERATED_QUIZZES = (generated['./generated/quizzes.json']?.default ?? {}) as Record<string, Exercise[]>

const idOf = (e: Episode) => (e.number !== null ? String(e.number) : slug(e.title))

/** Catálogo: lo generado desde transcripts tiene prioridad sobre research/episodes.json */
export const EPISODES: EpisodeX[] = (() => {
  const byId = new Map<string, EpisodeX>()
  for (const e of raw.episodes as (Episode & { date?: string })[]) {
    // con transcripts disponibles, se descartan los títulos no confirmados de la investigación inicial
    if (genEpisodes.length && e.title.includes('no confirmado')) continue
    byId.set(idOf(e), { ...e, id: idOf(e) })
  }
  for (const e of genEpisodes) byId.set(idOf(e), { ...byId.get(idOf(e)), ...e, id: idOf(e), fromTranscript: true })
  return [...byId.values()].sort((a, b) => (b.number ?? -1) - (a.number ?? -1))
})()

export const SHOW = raw.show as { name: string; hosts: string[]; tagline: string }

export const CATEGORY_LABEL: Record<Category, string> = {
  ahorro: 'Ahorro',
  presupuesto: 'Presupuesto',
  deudas: 'Deudas',
  inversion: 'Inversión',
  interes_compuesto: 'Interés compuesto',
  mentalidad: 'Mentalidad',
  carrera_ingresos: 'Carrera e ingresos',
  emprendimiento: 'Emprendimiento',
  jubilacion: 'Jubilación',
  vivienda: 'Vivienda',
  seguros_riesgo: 'Seguros y riesgo',
  cripto: 'Cripto',
  otros: 'Otros',
}

/** Qué unidad de la app refuerza cada categoría de episodio */
export const CATEGORY_UNIT: Record<Category, string> = {
  ahorro: 'hormiga',
  presupuesto: 'abeja',
  deudas: 'zorro',
  inversion: 'toro',
  interes_compuesto: 'tortuga',
  mentalidad: 'buho',
  carrera_ingresos: 'aguila',
  emprendimiento: 'aguila',
  jubilacion: 'elefante',
  vivienda: 'zorro',
  seguros_riesgo: 'ardilla',
  cripto: 'toro',
  otros: 'buho',
}

export const spotifySearch = (e: Episode) =>
  'https://open.spotify.com/search/' + encodeURIComponent(`Animales Financieros ${e.title}`)

/** Quiz de un episodio: el generado desde el transcript tiene prioridad */
export const quizFor = (id: string): Exercise[] | undefined => GENERATED_QUIZZES[id] ?? EPISODE_QUIZZES[id]

/* ---------- capítulos del mes ---------- */

/** Clave de mes YYYY-MM (hora local) */
export const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

/** Nombre del mes en español, ej. 'octubre 2026' (con año solo si no es el actual) */
export function monthLabel(key: string, withYear = false) {
  const [y, m] = key.split('-').map(Number)
  const name = new Date(y, m - 1, 15).toLocaleDateString('es-CL', { month: 'long' })
  return withYear || y !== new Date().getFullYear() ? `${name} ${y}` : name
}

/** Episodios publicados en un mes (los que no tienen fecha no cuentan), del más reciente al más antiguo */
export const episodesOfMonth = (key: string) => EPISODES.filter((e) => e.date?.startsWith(key))

export interface MonthEpisodes {
  /** mes que se muestra (YYYY-MM) */
  key: string
  /** mes calendario actual (YYYY-MM) */
  current: string
  episodes: EpisodeX[]
  /** true cuando el mes actual aún no tiene capítulos y se muestra el último mes con episodios */
  fallback: boolean
}

/**
 * Capítulos del mes en curso. Si todavía no se ha cargado ninguno (típico a comienzos de mes),
 * se muestra el último mes que sí tiene, marcado como `fallback`.
 */
export function currentMonthEpisodes(now = new Date()): MonthEpisodes {
  const current = monthKey(now)
  const episodes = episodesOfMonth(current)
  if (episodes.length) return { key: current, current, episodes, fallback: false }
  const last = EPISODES.filter((e) => e.date && e.date.slice(0, 7) < current)
    .map((e) => e.date!.slice(0, 7))
    .sort()
    .pop()
  if (!last) return { key: current, current, episodes: [], fallback: false }
  return { key: last, current, episodes: episodesOfMonth(last), fallback: true }
}

/** Fecha corta para listas, ej. '15 sep' */
export const shortDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }).replace('.', '')
