import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { getState, subscribeStore, today } from '../state/store'

/**
 * Liga semanal con gente real.
 *
 * Cada jugador recibe una sesión anónima de Supabase (guardada en el navegador) y publica su XP
 * en la tabla `players`. La liga lee esa tabla. Cuando se agreguen logins, la misma sesión anónima
 * se puede vincular a un email/Google y el jugador conserva su id y su progreso.
 */

export interface Player {
  id: string
  name: string
  weekXp: number
  xp: number
  me: boolean
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
  }
}

async function pushMe() {
  if (!supabase || !getState().onboarded) return
  const id = await ensureSession()
  if (!id) return
  const row = myRow()
  const key = JSON.stringify(row)
  if (key === lastPushed) return
  const { error } = await supabase.from('players').upsert({ id, ...row, updated_at: new Date().toISOString() })
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
  return { id: userId ?? 'me', name: s.name.trim() || 'Tú', weekXp: weeklyXp(s.xpByDay), xp: s.xp, me: true }
}

export async function fetchLeague(): Promise<Player[]> {
  if (!supabase) return [me()]
  const id = await ensureSession()
  const { data, error } = await supabase
    .from('players')
    .select('id,name,xp,week_xp')
    .eq('week_start', weekKey())
    .order('week_xp', { ascending: false })
    .limit(MAX_ROWS)
  if (error) throw error
  const mine = me()
  const list: Player[] = (data ?? []).map((r) =>
    r.id === id ? mine : { id: r.id, name: r.name, weekXp: r.week_xp, xp: r.xp, me: false },
  )
  // mi fila local siempre es la más fresca; si aún no está publicada, la agregamos igual
  if (!list.some((p) => p.me)) list.push(mine)
  return list.sort(byXp)
}

const byXp = (a: Player, b: Player) => b.weekXp - a.weekXp || a.name.localeCompare(b.name)

export function useLeague() {
  const [list, setList] = useState<Player[]>(() => [me()])
  const [status, setStatus] = useState<LeagueStatus>(supabase ? 'loading' : 'local')

  const refresh = useCallback(async () => {
    try {
      setList(await fetchLeague())
      setStatus('ok')
    } catch (e) {
      console.warn('[liga] no se pudo cargar', e)
      setStatus((s) => (s === 'ok' ? s : 'error'))
    }
  }, [])

  useEffect(() => {
    // modo local: solo mi fila, actualizada con el estado
    if (!supabase) return subscribeStore(() => setList([me()]))
    void refresh()
    const t = setInterval(() => void refresh(), POLL_MS)
    const onSync = () => void refresh()
    syncListeners.add(onSync)
    // mientras llega la sincronización, reflejar mi XP local al instante
    const unsubStore = subscribeStore(() => setList((l) => l.map((p) => (p.me ? me() : p)).sort(byXp)))
    return () => {
      clearInterval(t)
      syncListeners.delete(onSync)
      unsubStore()
    }
  }, [refresh])

  return { list, status, refresh }
}
