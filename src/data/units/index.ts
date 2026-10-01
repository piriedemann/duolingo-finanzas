import type { Lesson, Unit } from '../types'
import { unit as hormiga } from './hormiga'
import { unit as abeja } from './abeja'
import { unit as ardilla } from './ardilla'
import { unit as zorro } from './zorro'
import { unit as tortuga } from './tortuga'
import { unit as toro } from './toro'
import { unit as buho } from './buho'
import { unit as elefante } from './elefante'
import { unit as aguila } from './aguila'

// Paleta sobria por unidad (sobrescribe los colores de cada archivo)
const PALETTE: Record<string, [string, string]> = {
  hormiga: ['#8a5a32', '#70482a'],
  abeja: ['#c28a14', '#a07210'],
  ardilla: ['#b5602a', '#94491f'],
  zorro: ['#a94a2d', '#8c3b23'],
  tortuga: ['#3a7d5c', '#2e6449'],
  toro: ['#7d3a4a', '#652e3b'],
  buho: ['#44527a', '#364262'],
  elefante: ['#6b6f78', '#555962'],
  aguila: ['#2e6b86', '#24566c'],
}

export const UNITS: Unit[] = [hormiga, abeja, ardilla, zorro, tortuga, toro, buho, elefante, aguila].map((u) =>
  PALETTE[u.id] ? { ...u, color: PALETTE[u.id][0], colorDark: PALETTE[u.id][1] } : u,
)

export const ALL_LESSONS: { lesson: Lesson; unit: Unit; index: number }[] = UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ lesson, unit, index: 0 })),
).map((x, index) => ({ ...x, index }))

export function findLesson(id: string) {
  return ALL_LESSONS.find((x) => x.lesson.id === id)
}
