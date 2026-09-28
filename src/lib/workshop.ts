import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { ensureSession } from './leaderboard'
import { MODULES, WORKSHOP } from '../data/workshop/e2020'

/**
 * Respuestas del taller en vivo. Cada participante registra el primer intento de cada
 * pregunta en `workshop_answers`; el panel del facilitador agrega los resultados.
 */

export interface AnswerRow {
  user_id: string
  module: string
  question: number
  correct: boolean
}

export async function recordAnswer(module: string, question: number, correct: boolean) {
  if (!supabase) return
  const id = await ensureSession()
  if (!id) return
  const { error } = await supabase
    .from('workshop_answers')
    .upsert(
      { user_id: id, workshop: WORKSHOP.id, module, question, correct },
      { onConflict: 'user_id,workshop,module,question', ignoreDuplicates: true }, // solo cuenta el primer intento
    )
  if (error) console.warn('[taller] no se pudo registrar la respuesta', error.message)
}

export interface QuestionStat {
  question: number
  prompt: string
  correct: number
  wrong: number
}

export interface ModuleStat {
  id: string
  title: string
  concept: string
  emoji: string
  responders: number // personas que respondieron al menos una
  finished: number // personas que respondieron todas
  questions: QuestionStat[]
}

export interface WorkshopStats {
  participants: { id: string; name: string; xp: number; challengeXp: number }[]
  modules: ModuleStat[]
}

function promptOf(ex: { type: string; prompt?: string; statement?: string; sentence?: string; title?: string }) {
  return ex.prompt ?? ex.statement ?? ex.sentence ?? ex.title ?? ''
}

export async function fetchWorkshopStats(): Promise<WorkshopStats> {
  if (!supabase) throw new Error('Supabase no configurado')
  const [players, answers] = await Promise.all([
    supabase.from('players').select('id,name,xp,challenge_xp').eq('cohort', WORKSHOP.id).order('name'),
    supabase.from('workshop_answers').select('user_id,module,question,correct').eq('workshop', WORKSHOP.id).limit(5000),
  ])
  if (players.error) throw players.error
  if (answers.error) throw answers.error
  const rows = (answers.data ?? []) as AnswerRow[]
  const modules = MODULES.map((m) => {
    const mine = rows.filter((r) => r.module === m.id)
    const byUser = new Map<string, number>()
    for (const r of mine) byUser.set(r.user_id, (byUser.get(r.user_id) ?? 0) + 1)
    const total = m.exercises.filter((e) => e.type !== 'concept').length
    return {
      id: m.id,
      title: m.title,
      concept: m.concept,
      emoji: m.emoji,
      responders: byUser.size,
      finished: [...byUser.values()].filter((n) => n >= total).length,
      questions: m.exercises
        .map((ex, question) => ({ ex, question }))
        .filter(({ ex }) => ex.type !== 'concept')
        .map(({ ex, question }) => ({
          question,
          prompt: promptOf(ex),
          correct: mine.filter((r) => r.question === question && r.correct).length,
          wrong: mine.filter((r) => r.question === question && !r.correct).length,
        })),
    }
  })
  return {
    participants: (players.data ?? []).map((p) => ({ id: p.id, name: p.name, xp: p.xp, challengeXp: p.challenge_xp ?? 0 })),
    modules,
  }
}

export function useWorkshopStats(pollMs = 5000) {
  const [stats, setStats] = useState<WorkshopStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const refresh = useCallback(async () => {
    try {
      setStats(await fetchWorkshopStats())
      setUpdatedAt(new Date())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])
  useEffect(() => {
    void refresh()
    const t = setInterval(() => void refresh(), pollMs)
    return () => clearInterval(t)
  }, [refresh, pollMs])
  return { stats, error, updatedAt, refresh }
}
