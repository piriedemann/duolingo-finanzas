import type { Category, Episode, Exercise } from './types'
import raw from './episodes.json'

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
  for (const e of raw.episodes as (Episode & { date?: string })[]) byId.set(idOf(e), { ...e, id: idOf(e) })
  for (const e of genEpisodes) byId.set(idOf(e), { ...byId.get(idOf(e)), ...e, id: idOf(e), fromTranscript: true })
  return [...byId.values()].sort((a, b) => (b.number ?? -1) - (a.number ?? -1))
})()

export const SHOW = raw.show as { name: string; hosts: string[]; tagline: string }

export const CATEGORY_LABEL: Record<Category, string> = {
  ahorro: '🐜 Ahorro',
  presupuesto: '🐝 Presupuesto',
  deudas: '🦊 Deudas',
  inversion: '🐂 Inversión',
  interes_compuesto: '🐢 Interés compuesto',
  mentalidad: '🦉 Mentalidad',
  carrera_ingresos: '🦅 Carrera e ingresos',
  emprendimiento: '🚀 Emprendimiento',
  jubilacion: '🐘 Jubilación',
  vivienda: '🏠 Vivienda',
  seguros_riesgo: '🐿️ Seguros y riesgo',
  cripto: '🪙 Cripto',
  otros: '🎙️ Otros',
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
