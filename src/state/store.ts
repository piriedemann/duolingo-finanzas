import { useSyncExternalStore } from 'react'

export const MAX_HEARTS = 5
const HEART_REGEN_MS = 20 * 60 * 1000
const KEY = 'animalingo:v1'

export interface LessonRecord {
  times: number
  bestAccuracy: number // 0..1
  lastAt: string
}

export interface Mistake {
  lessonId: string
  exIndex: number
}

export interface State {
  onboarded: boolean
  name: string
  goal: string
  dailyGoal: number
  xp: number
  xpByDay: Record<string, number>
  streak: number
  bestStreak: number
  lastActiveDay: string | null
  streakFreezes: number
  hearts: number
  heartsUpdatedAt: number
  lucas: number
  completed: Record<string, LessonRecord>
  mistakes: Mistake[]
  listened: string[]
  toolsUsed: string[]
  achievements: string[]
  perfectLessons: number
  unlockAll: boolean
  sound: boolean
  questsDay: string
  questsClaimed: string[]
  lessonsToday: number
  perfectToday: number
  chests: string[]
  quizzes: Record<string, number>
}

export const today = (d = new Date()) => {
  const z = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

const dayDiff = (a: string, b: string) =>
  Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86400000)

const initial = (): State => ({
  onboarded: false,
  name: '',
  goal: '',
  dailyGoal: 30,
  xp: 0,
  xpByDay: {},
  streak: 0,
  bestStreak: 0,
  lastActiveDay: null,
  streakFreezes: 0,
  hearts: MAX_HEARTS,
  heartsUpdatedAt: Date.now(),
  lucas: 100,
  completed: {},
  mistakes: [],
  listened: [],
  toolsUsed: [],
  achievements: [],
  perfectLessons: 0,
  unlockAll: false,
  sound: true,
  questsDay: today(),
  questsClaimed: [],
  lessonsToday: 0,
  perfectToday: 0,
  chests: [],
  quizzes: {},
})

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch {
    /* almacenamiento no disponible */
  }
  return initial()
}

/** Ajustes que dependen del reloj: regenerar vidas, romper racha, reset de misiones */
function normalize(s: State): State {
  let next = s
  if (s.hearts < MAX_HEARTS) {
    const gained = Math.floor((Date.now() - s.heartsUpdatedAt) / HEART_REGEN_MS)
    if (gained > 0) {
      const hearts = Math.min(MAX_HEARTS, s.hearts + gained)
      next = { ...next, hearts, heartsUpdatedAt: hearts === MAX_HEARTS ? Date.now() : s.heartsUpdatedAt + gained * HEART_REGEN_MS }
    }
  }
  const t = today()
  if (next.lastActiveDay && next.streak > 0) {
    const gap = dayDiff(next.lastActiveDay, t)
    if (gap > 1) {
      const missed = gap - 1
      if (next.streakFreezes >= missed) {
        // los protectores cubren los días perdidos
        next = { ...next, streakFreezes: next.streakFreezes - missed, lastActiveDay: dayBefore(t) }
      } else {
        next = { ...next, streak: 0 }
      }
    }
  }
  if (next.questsDay !== t) {
    next = { ...next, questsDay: t, questsClaimed: [], lessonsToday: 0, perfectToday: 0 }
  }
  return next
}

function dayBefore(t: string) {
  const d = new Date(t + 'T12:00:00')
  d.setDate(d.getDate() - 1)
  return today(d)
}

let state: State = normalize(load())
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignorar */
  }
}

export function getState() {
  return state
}

export function setState(fn: (s: State) => State) {
  state = checkAchievements(fn(normalize(state)))
  persist()
  listeners.forEach((l) => l())
}

export function resetState() {
  state = initial()
  persist()
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state))
}

// re-normalizar cada minuto (vidas)
if (typeof window !== 'undefined') {
  setInterval(() => {
    const n = normalize(state)
    if (n !== state) {
      state = n
      persist()
      listeners.forEach((l) => l())
    }
  }, 60_000)
}

/* ---------- acciones ---------- */

export function addXp(s: State, amount: number): State {
  const t = today()
  let { streak, bestStreak } = s
  if (s.lastActiveDay !== t) {
    streak = s.lastActiveDay && dayDiff(s.lastActiveDay, t) === 1 ? streak + 1 : 1
    bestStreak = Math.max(bestStreak, streak)
  }
  return {
    ...s,
    xp: s.xp + amount,
    xpByDay: { ...s.xpByDay, [t]: (s.xpByDay[t] ?? 0) + amount },
    streak,
    bestStreak,
    lastActiveDay: t,
  }
}

export function loseHeart() {
  setState((s) => ({
    ...s,
    hearts: Math.max(0, s.hearts - 1),
    heartsUpdatedAt: s.hearts === MAX_HEARTS ? Date.now() : s.heartsUpdatedAt,
  }))
}

export function refillHearts(cost: number) {
  setState((s) => (s.lucas >= cost ? { ...s, lucas: s.lucas - cost, hearts: MAX_HEARTS, heartsUpdatedAt: Date.now() } : s))
}

export function buyFreeze(cost: number) {
  setState((s) => (s.lucas >= cost && s.streakFreezes < 2 ? { ...s, lucas: s.lucas - cost, streakFreezes: s.streakFreezes + 1 } : s))
}

export function completeLesson(lessonId: string, accuracy: number, xp: number, mistakes: number[]) {
  setState((s) => {
    const prev = s.completed[lessonId]
    const perfect = accuracy === 1
    let next = addXp(s, xp)
    next = {
      ...next,
      lucas: next.lucas + (perfect ? 15 : 5) + (prev ? 0 : 5),
      completed: {
        ...next.completed,
        [lessonId]: {
          times: (prev?.times ?? 0) + 1,
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
          lastAt: new Date().toISOString(),
        },
      },
      perfectLessons: next.perfectLessons + (perfect ? 1 : 0),
      lessonsToday: next.lessonsToday + 1,
      perfectToday: next.perfectToday + (perfect ? 1 : 0),
      mistakes: [
        ...next.mistakes.filter((m) => m.lessonId !== lessonId || mistakes.includes(m.exIndex)),
        ...mistakes
          .filter((i) => !next.mistakes.some((m) => m.lessonId === lessonId && m.exIndex === i))
          .map((exIndex) => ({ lessonId, exIndex })),
      ].slice(-60),
    }
    return next
  })
}

export function completePractice(xp: number, fixed: { lessonId: string; exIndex: number }[]) {
  setState((s) => {
    const next = addXp(s, xp)
    return {
      ...next,
      lessonsToday: next.lessonsToday + 1,
      mistakes: next.mistakes.filter((m) => !fixed.some((f) => f.lessonId === m.lessonId && f.exIndex === m.exIndex)),
    }
  })
}

export function markListened(id: string) {
  setState((s) => (s.listened.includes(id) ? s : { ...addXp(s, 5), listened: [...s.listened, id] }))
}

export function useTool(id: string) {
  setState((s) => (s.toolsUsed.includes(id) ? s : { ...addXp(s, 5), toolsUsed: [...s.toolsUsed, id] }))
}

export function claimQuest(id: string, reward: number) {
  setState((s) => (s.questsClaimed.includes(id) ? s : { ...s, lucas: s.lucas + reward, questsClaimed: [...s.questsClaimed, id] }))
}

/* ---------- logros ---------- */

export interface Achievement {
  id: string
  emoji: string
  title: string
  desc: string
  test: (s: State) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', emoji: '🥚', title: 'Primer paso', desc: 'Completa tu primera lección', test: (s) => Object.keys(s.completed).length >= 1 },
  { id: 'ten', emoji: '📚', title: 'Ratón de biblioteca', desc: 'Completa 10 lecciones', test: (s) => Object.keys(s.completed).length >= 10 },
  { id: 'xp100', emoji: '⚡', title: 'Cien de cien', desc: 'Gana 100 XP', test: (s) => s.xp >= 100 },
  { id: 'xp500', emoji: '💎', title: 'Medio millón (de XP… casi)', desc: 'Gana 500 XP', test: (s) => s.xp >= 500 },
  { id: 'streak3', emoji: '🔥', title: 'En llamas', desc: 'Racha de 3 días', test: (s) => s.bestStreak >= 3 },
  { id: 'streak7', emoji: '🌋', title: 'Volcán', desc: 'Racha de 7 días', test: (s) => s.bestStreak >= 7 },
  { id: 'perfect', emoji: '🎯', title: 'Francotirador', desc: 'Una lección sin errores', test: (s) => s.perfectLessons >= 1 },
  { id: 'perfect5', emoji: '🏹', title: 'Ojo de águila', desc: '5 lecciones perfectas', test: (s) => s.perfectLessons >= 5 },
  { id: 'listen5', emoji: '🎧', title: 'Oyente fiel', desc: 'Marca 5 episodios como escuchados', test: (s) => s.listened.length >= 5 },
  { id: 'quiz5', emoji: '🎙️', title: 'Fan del podcast', desc: 'Completa 5 quizzes de episodios', test: (s) => Object.keys(s.quizzes ?? {}).length >= 5 },
  { id: 'tools3', emoji: '🧮', title: 'Calculadora humana', desc: 'Usa 3 herramientas', test: (s) => s.toolsUsed.length >= 3 },
  { id: 'rich', emoji: '🐷', title: 'Chanchito lleno', desc: 'Junta 500 Lucas', test: (s) => s.lucas >= 500 },
]

function checkAchievements(s: State): State {
  const newly = ACHIEVEMENTS.filter((a) => !s.achievements.includes(a.id) && a.test(s)).map((a) => a.id)
  if (!newly.length) return s
  pendingToasts.push(...newly)
  return { ...s, achievements: [...s.achievements, ...newly] }
}

export const pendingToasts: string[] = []

export function openChest(id: string, reward: number) {
  setState((s) => (s.chests.includes(id) ? s : { ...s, lucas: s.lucas + reward, chests: [...s.chests, id] }))
}

export function isLessonUnlocked(s: State, index: number, orderedIds: string[]) {
  if (s.unlockAll || index === 0) return true
  return !!s.completed[orderedIds[index - 1]]
}

export function completeQuiz(id: string, accuracy: number, xp: number) {
  setState((s) => {
    const next = addXp(s, xp)
    const first = s.quizzes[id] === undefined
    return {
      ...next,
      lucas: next.lucas + (first ? 10 : 0),
      lessonsToday: next.lessonsToday + 1,
      perfectToday: next.perfectToday + (accuracy === 1 ? 1 : 0),
      quizzes: { ...next.quizzes, [id]: Math.max(s.quizzes[id] ?? 0, accuracy) },
    }
  })
}
