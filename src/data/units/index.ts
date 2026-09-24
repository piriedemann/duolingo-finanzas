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
  hormiga: ['#2f6f4f', '#245a3f'],
  abeja: ['#a8741a', '#8a5f13'],
  ardilla: ['#a85a2a', '#8c4a21'],
  zorro: ['#a8433a', '#8a352e'],
  tortuga: ['#2c6a86', '#22566d'],
  toro: ['#5b4f96', '#4a407c'],
  buho: ['#35527f', '#2a4266'],
  elefante: ['#5a6472', '#48505c'],
  aguila: ['#1f7a6b', '#186357'],
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
