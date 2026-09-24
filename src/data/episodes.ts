import type { Category, Episode } from './types'
import raw from './episodes.json'

export interface EpisodeX extends Episode {
  id: string
  date?: string
}

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)

/** Catálogo de episodios (research/episodes.json). Se reemplaza con los transcripts cuando estén disponibles. */
export const EPISODES: EpisodeX[] = (raw.episodes as (Episode & { date?: string })[])
  .map((e) => ({ ...e, id: e.number !== null ? String(e.number) : slug(e.title) }))
  .sort((a, b) => (b.number ?? -1) - (a.number ?? -1))

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
