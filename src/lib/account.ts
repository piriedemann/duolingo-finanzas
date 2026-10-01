import { useSyncExternalStore } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { markLeagueDirty, onAuthChanged } from './leaderboard'
import { getState, resetState, setState, subscribeStore, type State } from '../state/store'

/**
 * Cuenta y progreso en la nube.
 *
 * Sin iniciar sesión, el progreso vive solo en el navegador (localStorage) y la liga usa una
 * sesión anónima de Supabase. Al iniciar sesión (Google o código por correo) la sesión pasa a ser
 * la de la cuenta, se baja el estado guardado en `progress`, se mezcla con el local y se sube.
 * Desde ahí, cada cambio del estado se sube con debounce, y al volver a la pestaña se vuelve a bajar.
 */

export interface Account {
  id: string
  email: string | null
  /** nombre que entrega el proveedor (p. ej. Google), si lo hay */
  name: string | null
  provider: string
}

export type CloudStatus = 'off' | 'anon' | 'syncing' | 'ok' | 'error'

const PUSH_DEBOUNCE_MS = 1500
const AFTER_LOGIN_KEY = 'animalingo:after-login'

let account: Account | null = null
let status: CloudStatus = supabase ? 'anon' : 'off'
let errorMsg: string | null = null
const listeners = new Set<() => void>()
let snapshot: { account: Account | null; status: CloudStatus; error: string | null } = { account, status, error: errorMsg }

function emit() {
  snapshot = { account, status, error: errorMsg }
  listeners.forEach((l) => l())
}

function setStatus(st: CloudStatus, err: string | null = null) {
  status = st
  errorMsg = err
  emit()
}

export function useAccount() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => {
        listeners.delete(l)
      }
    },
    () => snapshot,
  )
}

export function getAccount() {
  return account
}

/* ---------- mezcla de progreso ---------- */

const max = (a?: number, b?: number) => Math.max(a ?? 0, b ?? 0)
const union = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])]
const maxMap = (a: Record<string, number> = {}, b: Record<string, number> = {}) => {
  const r = { ...a }
  for (const [k, v] of Object.entries(b)) r[k] = Math.max(r[k] ?? 0, v)
  return r
}

/**
 * Une el estado local con el guardado en la nube. Como base se toma el que tenga más XP
 * (empate: la nube, que es la fuente de verdad de la cuenta); encima se unen las colecciones
 * que solo crecen (lecciones completadas, logros, episodios escuchados, quizzes…).
 * Los ajustes propios del dispositivo (sonido, modo demo) siempre quedan locales.
 */
export function mergeState(local: State, cloudPartial: Partial<State>): State {
  const cloud: State = { ...local, ...cloudPartial }
  const localFresh = local.xp === 0 && Object.keys(local.completed).length === 0
  const base = localFresh || cloud.xp >= local.xp ? cloud : local
  const other = base === cloud ? local : cloud
  const completed = { ...other.completed }
  for (const [id, rec] of Object.entries(base.completed)) {
    const o = completed[id]
    completed[id] = o
      ? { times: Math.max(o.times, rec.times), bestAccuracy: Math.max(o.bestAccuracy, rec.bestAccuracy), lastAt: o.lastAt > rec.lastAt ? o.lastAt : rec.lastAt }
      : rec
  }
  return {
    ...base,
    sound: local.sound,
    unlockAll: local.unlockAll,
    onboarded: local.onboarded || cloud.onboarded,
    name: base.name || other.name,
    goal: base.goal || other.goal,
    cohort: base.cohort ?? other.cohort,
    bestStreak: max(base.bestStreak, other.bestStreak),
    perfectLessons: max(base.perfectLessons, other.perfectLessons),
    completed,
    listened: union(base.listened, other.listened),
    toolsUsed: union(base.toolsUsed, other.toolsUsed),
    achievements: union(base.achievements, other.achievements),
    chests: union(base.chests, other.chests),
    quizzes: maxMap(base.quizzes, other.quizzes),
    workshop: maxMap(base.workshop, other.workshop),
    questsClaimed: base.questsDay === other.questsDay ? union(base.questsClaimed, other.questsClaimed) : base.questsClaimed,
  }
}

/* ---------- subir y bajar ---------- */

let applying = false
let pushTimer: ReturnType<typeof setTimeout> | undefined
let lastPushed = ''

async function pull(): Promise<Partial<State> | null> {
  if (!supabase || !account) return null
  const { data, error } = await supabase.from('progress').select('state').eq('user_id', account.id).maybeSingle()
  if (error) throw error
  return (data?.state as Partial<State> | undefined) ?? null
}

async function push(s: State) {
  if (!supabase || !account) return
  const key = JSON.stringify(s)
  if (key === lastPushed) return
  const { error } = await supabase.from('progress').upsert({ user_id: account.id, state: s, updated_at: new Date().toISOString() })
  if (error) throw error
  lastPushed = key
}

function schedulePush() {
  clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    push(getState())
      .then(() => setStatus('ok'))
      .catch((e: Error) => setStatus('error', friendly(e)))
  }, PUSH_DEBOUNCE_MS)
}

/** Baja lo guardado, lo mezcla con lo local y sube el resultado. */
export async function syncNow() {
  if (!supabase || !account) return
  const acc = account
  setStatus('syncing')
  try {
    const cloud = await pull()
    if (account?.id !== acc.id) return // cerró sesión mientras tanto
    const local = getState()
    let merged = cloud ? mergeState(local, cloud) : local
    if (!merged.name && acc.name) merged = { ...merged, name: acc.name.slice(0, 20) }
    if (JSON.stringify(merged) !== JSON.stringify(local)) {
      applying = true
      try {
        setState(() => merged)
      } finally {
        applying = false
      }
    }
    await push(getState())
    setStatus('ok')
  } catch (e) {
    setStatus('error', friendly(e as Error))
  }
}

function friendly(e: Error) {
  const m = e.message ?? String(e)
  if (/relation .*progress.* does not exist|schema cache/i.test(m)) return 'Falta crear la tabla progress (ejecutar supabase/schema.sql).'
  if (/provider is not enabled|Unsupported provider/i.test(m)) return 'Google no está habilitado en Supabase (Authentication → Providers).'
  if (/rate limit|over_email_send_rate_limit/i.test(m)) return 'Se enviaron demasiados correos. Espera unos minutos e intenta de nuevo.'
  if (/invalid|expired/i.test(m) && /token|otp/i.test(m)) return 'El código no es válido o ya venció. Pide uno nuevo.'
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Sin conexión. Se reintentará al volver.'
  return m
}

/* ---------- sesión ---------- */

function accountFrom(session: Session | null): Account | null {
  const u = session?.user
  if (!u || u.is_anonymous) return null
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>
  const full = (meta.full_name ?? meta.name) as string | undefined
  return {
    id: u.id,
    email: u.email ?? null,
    name: full ? full.trim().split(/\s+/)[0] : null,
    provider: (u.app_metadata?.provider as string | undefined) ?? 'email',
  }
}

function cleanUrl() {
  const q = new URLSearchParams(window.location.search)
  if (!q.has('code') && !q.has('error') && !q.has('error_description')) return null
  const err = q.get('error_description') ?? q.get('error')
  window.history.replaceState(null, '', window.location.pathname + window.location.hash)
  return err
}

/** Sincroniza el progreso con la cuenta. Llamar una vez al arrancar la app. */
export function startCloudSync() {
  if (!supabase) return
  const client = supabase

  client.auth.onAuthStateChange((_event, session) => {
    const next = accountFrom(session)
    const changed = next?.id !== account?.id
    // Supabase emite varios eventos para la misma sesión (INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED):
    // conservar el mismo objeto si la cuenta no cambió, para no interrumpir una sincronización en curso.
    if (changed) account = next
    onAuthChanged(session?.user.id ?? null)
    if (!next) {
      // sin cuenta (o sesión anónima): conservar un error visible, si lo había
      if (status === 'ok' || status === 'syncing') setStatus('anon')
      else emit()
      return
    }
    emit()
    if (changed) {
      // volver a donde estaba el usuario antes de salir a Google
      const back = sessionStorage.getItem(AFTER_LOGIN_KEY)
      if (back) {
        sessionStorage.removeItem(AFTER_LOGIN_KEY)
        window.location.hash = back
      }
      void syncNow()
    }
  })

  // getSession espera a que el cliente procese el ?code= o ?error= con que vuelve Google
  void client.auth.getSession().then(() => {
    const oauthError = cleanUrl()
    if (oauthError) setStatus('error', oauthError)
  })

  subscribeStore(() => {
    if (account && !applying) schedulePush()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && account) void syncNow()
  })
}

const appUrl = () => window.location.origin + window.location.pathname

/** Antes de cambiar de sesión: borrar la fila anónima de la liga para no quedar duplicado. */
async function dropAnonRow() {
  if (!supabase) return
  const { data } = await supabase.auth.getSession()
  const u = data.session?.user
  if (u?.is_anonymous) {
    await supabase.from('players').delete().eq('id', u.id)
    markLeagueDirty()
  }
}

export async function signInWithGoogle(returnTo = window.location.hash) {
  if (!supabase) throw new Error('Supabase no configurado')
  sessionStorage.setItem(AFTER_LOGIN_KEY, returnTo || '#/aprender')
  await dropAnonRow()
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: appUrl() } })
  if (error) {
    sessionStorage.removeItem(AFTER_LOGIN_KEY)
    throw new Error(friendly(error))
  }
}

export async function sendEmailCode(email: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: appUrl(), shouldCreateUser: true },
  })
  if (error) throw new Error(friendly(error))
}

export async function verifyEmailCode(email: string, code: string) {
  if (!supabase) throw new Error('Supabase no configurado')
  await dropAnonRow()
  const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'email' })
  if (error) throw new Error(friendly(error))
}

/** Cierra la sesión en este dispositivo. El progreso queda en la cuenta; el dispositivo vuelve a cero. */
export async function signOut() {
  if (!supabase) return
  clearTimeout(pushTimer)
  account = null
  lastPushed = ''
  setStatus('anon')
  resetState()
  await supabase.auth.signOut({ scope: 'local' })
}

