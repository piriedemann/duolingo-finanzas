import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { getState, subscribeStore, today } from '../state/store'
import { WORKSHOP } from '../data/workshop/e2020'

/**
 * Liga semanal con gente real.
 *
 * Cada jugador recibe una sesión anónima de Supabase (guardada en el navegador) y publica su XP
 * en la tabla `players`. La liga lee esa tabla. Al iniciar sesión (ver lib/account.ts) la sesión
 * pasa a ser la de la cuenta: la fila anónima se borra y el XP se publica con el id de la cuenta.
 */

export interface Player {
  id: string
  name: string
  weekXp: number
  xp: number
  /** XP ganado durante el desafío del taller (si pertenece a uno) */
  challengeXp: number
  me: boolean
}

/** XP sumado entre dos fechas inclusivas (YYYY-MM-DD) */
export function xpBetween(xpByDay: Record<string, number>, from: string, to: string) {
  let sum = 0
  for (const [day, xp] of Object.entries(xpByDay)) if (day >= from && day <= to) sum += xp
  return sum
}

export type LeagueStatus = 'local' | 'loading' | 'ok' | 'error'

const POLL_MS = 30_000
const SYNC_DEBOUNCE_MS = 1500
const MAX_ROWS = 50

/* ---------- semana ---------- */

export function weekStart(d = new Date()) {
  const s = new Date(d)
  const day = (s.getDay() + 6) % 7 // lunes = 0
  s.setDate(s.getDate() - day)
  s.setHours(12, 0, 0, 0)
  return s
}

export const weekKey = (d = new Date()) => today(weekStart(d))

export function weeklyXp(xpByDay: Record<string, number>) {
  const start = weekStart()
  let sum = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    sum += xpByDay[today(d)] ?? 0
  }
  return sum
}

/* ---------- sesión anónima ---------- */

let userId: string | null = null
let sessionPromise: Promise<string | null> | null = null

export function getUserId() {
  return userId
}

/** La sesión cambió (login, logout o sesión anónima nueva): republicar con el id nuevo. */
export function onAuthChanged(id: string | null) {
  if (id === userId) return
  userId = id
  sessionPromise = id ? Promise.resolve(id) : null
  lastPushed = ''
  if (id) void pushMe()
}

/** Obliga a volver a publicar la fila en el próximo cambio (p. ej. tras borrarla). */
export function markLeagueDirty() {
  lastPushed = ''
}

export function ensureSession(): Promise<string | null> {
  if (!supabase) return Promise.resolve(null)
  if (!sessionPromise) {
    const client = supabase
    sessionPromise = (async () => {
      const { data } = await client.auth.getSession()
      if (data.session) return (userId = data.session.user.id)
      const { data: anon, error } = await client.auth.signInAnonymously()
      if (error || !anon.user) {
        console.warn('[liga] no se pudo crear la sesión anónima', error?.message)
        sessionPromise = null // reintentar la próxima vez
        return null
      }
      return (userId = anon.user.id)
    })()
  }
  return sessionPromise
}

/* ---------- publicar mi XP ---------- */

const syncListeners = new Set<() => void>()
let lastPushed = ''
let syncTimer: ReturnType<typeof setTimeout> | undefined
let syncStarted = false

function myRow() {
  const s = getState()
  return {
    name: s.name.trim() || 'Anónimo',
    xp: s.xp,
    week_start: weekKey(),
    week_xp: weeklyXp(s.xpByDay),
    streak: s.streak,
    cohort: s.cohort,
    challenge_xp: s.cohort ? xpBetween(s.xpByDay, WORKSHOP.challengeStart, WORKSHOP.challengeEnd) : 0,
  }
}

async function pushMe() {
  if (!supabase || !getState().onboarded) return
  const id = await ensureSession()
  if (!id) return
  const row = myRow()
  const key = JSON.stringify(row)
  if (key === lastPushed) return
  let { error } = await supabase.from('players').upsert({ id, ...row, updated_at: new Date().toISOString() })
  if (error && /column/i.test(error.message)) {
    // esquema sin las columnas del taller (falta correr supabase/schema.sql): publicar solo lo básico
    const { cohort, challenge_xp, ...legacy } = row
    void cohort, challenge_xp
    ;({ error } = await supabase.from('players').upsert({ id, ...legacy, updated_at: new Date().toISOString() }))
  }
  if (error) {
    console.warn('[liga] no se pudo publicar el XP', error.message)
    return
  }
  lastPushed = key
  syncListeners.forEach((l) => l())
}

/** Publica el XP cada vez que cambia el estado (con debounce). Llamar una vez al arrancar la app. */
export function startLeagueSync() {
  if (!supabase || syncStarted) return
  syncStarted = true
  void pushMe()
  subscribeStore(() => {
    clearTimeout(syncTimer)
    syncTimer = setTimeout(() => void pushMe(), SYNC_DEBOUNCE_MS)
  })
  // al volver a la pestaña, re-sincronizar (por si cambió la semana)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void pushMe()
  })
}

/* ---------- leer la liga ---------- */

function me(): Player {
  const s = getState()
  return {
    id: userId ?? 'me',
    name: s.name.trim() || 'Tú',
    weekXp: weeklyXp(s.xpByDay),
    xp: s.xp,
    challengeXp: xpBetween(s.xpByDay, WORKSHOP.challengeStart, WORKSHOP.challengeEnd),
    me: true,
  }
}

/**
 * Liga semanal (sin cohort) o ranking del desafío de un taller (con cohort: solo esos
 * jugadores, ordenados por el XP ganado durante las fechas del desafío).
 */
export async function fetchLeague(cohort?: string): Promise<Player[]> {
  if (!supabase) return [me()]
  const id = await ensureSession()
  const base = supabase.from('players').select('id,name,xp,week_xp,challenge_xp')
  const q = cohort
    ? base.eq('cohort', cohort).order('challenge_xp', { ascending: false })
    : base.eq('week_start', weekKey()).order('week_xp', { ascending: false })
  const { data, error } = await q.limit(MAX_ROWS)
  if (error) throw error
  const mine = me()
  const list: Player[] = (data ?? []).map((r) =>
    r.id === id ? mine : { id: r.id, name: r.name, weekXp: r.week_xp, xp: r.xp, challengeXp: r.challenge_xp ?? 0, me: false },
  )
  // mi fila local siempre es la más fresca; si aún no está publicada, la agregamos igual
  const inCohort = !cohort || getState().cohort === cohort
  if (inCohort && !list.some((p) => p.me)) list.push(mine)
  return list.sort(cohort ? byChallenge : byXp)
}

const byXp = (a: Player, b: Player) => b.weekXp - a.weekXp || a.name.localeCompare(b.name)
const byChallenge = (a: Player, b: Player) => b.challengeXp - a.challengeXp || a.name.localeCompare(b.name)

export function useLeague(cohort?: string) {
  const [list, setList] = useState<Player[]>(() => [me()])
  const [status, setStatus] = useState<LeagueStatus>(supabase ? 'loading' : 'local')

  const refresh = useCallback(async () => {
    try {
      setList(await fetchLeague(cohort))
      setStatus('ok')
    } catch (e) {
      console.warn('[liga] no se pudo cargar', e)
      setStatus((s) => (s === 'ok' ? s : 'error'))
    }
  }, [cohort])

  useEffect(() => {
    // modo local: solo mi fila, actualizada con el estado
    if (!supabase) return subscribeStore(() => setList([me()]))
    void refresh()
    const t = setInterval(() => void refresh(), POLL_MS)
    const onSync = () => void refresh()
    syncListeners.add(onSync)
    // mientras llega la sincronización, reflejar mi XP local al instante
    const unsubStore = subscribeStore(() => setList((l) => l.map((p) => (p.me ? me() : p)).sort(cohort ? byChallenge : byXp)))
    return () => {
      clearInterval(t)
      syncListeners.delete(onSync)
      unsubStore()
    }
  }, [refresh, cohort])

  return { list, status, refresh }
}
