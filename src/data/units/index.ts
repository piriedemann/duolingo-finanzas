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

export const UNITS: Unit[] = [hormiga, abeja, ardilla, zorro, tortuga, toro, buho, elefante, aguila]

export const ALL_LESSONS: { lesson: Lesson; unit: Unit; index: number }[] = UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ lesson, unit, index: 0 })),
).map((x, index) => ({ ...x, index }))

export function findLesson(id: string) {
  return ALL_LESSONS.find((x) => x.lesson.id === id)
}
