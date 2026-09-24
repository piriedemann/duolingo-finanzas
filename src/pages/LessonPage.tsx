import { useEffect, useMemo, useState } from 'react'
import { ALL_LESSONS, findLesson } from '../data/units'
import { LessonPlayer, type LessonResult, type QueueItem } from '../components/LessonPlayer'
import { completeLesson, completePractice, getState, isLessonUnlocked, setState, MAX_HEARTS, useStore } from '../state/store'
import { go } from '../lib/util'
import { confetti } from '../lib/confetti'
import { sfx } from '../lib/sound'
import { Mascot } from '../components/Mascot'
import { EPISODES } from '../data/episodes'

const ORDERED = ALL_LESSONS.map((x) => x.lesson.id)

export function LessonPage({ id }: { id: string }) {
  const found = findLesson(id)
  const s = getState()
  const [result, setResult] = useState<(LessonResult & { xp: number }) | null>(null)
  const [runKey, setRunKey] = useState(0)
  const items = useMemo<QueueItem[]>(
    () => (found ? found.lesson.exercises.map((ex, exIndex) => ({ ex, lessonId: id, exIndex })) : []),
    [found, id],
  )
  if (!found) return <NotFound />
  if (!isLessonUnlocked(s, found.index, ORDERED)) {
    go('aprender')
    return null
  }
  const { lesson, unit } = found
  const wasDone = !!s.completed[id]

  if (result) {
    const eps = EPISODES.filter((e) => e.number !== null && lesson.episodeRefs?.includes(e.number))
    return (
      <Results
        result={result}
        color={unit.color}
        extra={
          eps.length > 0 && (
            <div className="card result-eps">
              <div className="muted small">🎧 Profundiza en el podcast</div>
              {eps.map((e) => (
                <a key={e.number} className="ep-link" href={'#/episodio/' + e.id}>
                  #{e.number} · {e.title}
                </a>
              ))}
            </div>
          )
        }
        onContinue={() => go('aprender')}
        onRetry={() => {
          setResult(null)
          setRunKey((k) => k + 1)
        }}
      />
    )
  }

  return (
    <LessonPlayer
      key={runKey}
      items={items}
      color={unit.color}
      onExit={() => go('aprender')}
      onFinish={(r) => {
        const perfect = r.accuracy === 1
        const xp = (wasDone ? 5 : 10) + (perfect ? 5 : 0) + Math.floor(r.maxCombo / 5) * 2
        completeLesson(id, r.accuracy, xp, r.mistakes.map((m) => m.exIndex))
        setResult({ ...r, xp })
      }}
    />
  )
}

export function PracticePage() {
  const mistakes = useStore((s) => s.mistakes)
  const [result, setResult] = useState<(LessonResult & { xp: number }) | null>(null)
  const items = useMemo<QueueItem[]>(() => {
    const fromMistakes = mistakes
      .map((m) => {
        const f = findLesson(m.lessonId)
        const ex = f?.lesson.exercises[m.exIndex]
        return ex ? { ex, lessonId: m.lessonId, exIndex: m.exIndex } : null
      })
      .filter((x): x is QueueItem => !!x)
      .slice(-10)
    if (fromMistakes.length >= 3) return fromMistakes
    // sin suficientes errores: repaso aleatorio de lecciones completadas
    const done = ALL_LESSONS.filter((x) => getState().completed[x.lesson.id])
    const pool = (done.length ? done : ALL_LESSONS.slice(0, 2)).flatMap((x) =>
      x.lesson.exercises
        .map((ex, exIndex) => ({ ex, lessonId: x.lesson.id, exIndex }))
        .filter((q) => q.ex.type !== 'concept'),
    )
    return [...fromMistakes, ...pool.sort(() => Math.random() - 0.5)].slice(0, 8)
  }, [])

  if (result) {
    return <Results result={result} color="#ce82ff" onContinue={() => go('aprender')} practice />
  }
  return (
    <LessonPlayer
      items={items}
      color="#ce82ff"
      practice
      onExit={() => go('aprender')}
      onFinish={(r) => {
        const xp = 8 + (r.accuracy === 1 ? 4 : 0)
        const failed = new Set(r.mistakes.map((m) => `${m.lessonId}:${m.exIndex}`))
        completePractice(
          xp,
          items.filter((i) => !failed.has(`${i.lessonId}:${i.exIndex}`)),
        )
        // practicar recupera una vida
        setState((st) => ({ ...st, hearts: Math.min(MAX_HEARTS, st.hearts + 1) }))
        setResult({ ...r, xp })
      }}
    />
  )
}

function Results({
  result,
  color,
  onContinue,
  onRetry,
  practice,
  extra,
}: {
  result: LessonResult & { xp: number }
  color: string
  onContinue: () => void
  onRetry?: () => void
  practice?: boolean
  extra?: React.ReactNode
}) {
  const streak = useStore((s) => s.streak)
  const perfect = result.accuracy === 1
  useEffect(() => {
    sfx.finish()
    const t = setTimeout(() => confetti(), 150)
    return () => clearTimeout(t)
  }, [])
  const mm = Math.floor(result.seconds / 60)
  const ss = String(result.seconds % 60).padStart(2, '0')
  return (
    <div className="results" style={{ ['--unit' as string]: color }}>
      <Mascot mood={perfect ? 'wow' : 'happy'} size={160} bounce />
      <h1 className="results-title">{practice ? '¡Práctica completada!' : perfect ? '¡Lección perfecta!' : '¡Lección completada!'}</h1>
      <div className="stat-row">
        <div className="stat gold">
          <div className="stat-head">XP TOTAL</div>
          <div className="stat-val">⚡ {result.xp}</div>
        </div>
        <div className="stat green">
          <div className="stat-head">{perfect ? 'PERFECTO' : 'PRECISIÓN'}</div>
          <div className="stat-val">🎯 {Math.round(result.accuracy * 100)}%</div>
        </div>
        <div className="stat blue">
          <div className="stat-head">TIEMPO</div>
          <div className="stat-val">⏱ {mm}:{ss}</div>
        </div>
      </div>
      <div className="streak-note">🔥 Racha de {streak} {streak === 1 ? 'día' : 'días'}</div>
      {extra}
      <div className="results-actions">
        {onRetry && (
          <button className="btn ghost" onClick={onRetry}>
            Repetir
          </button>
        )}
        <button className="btn primary wide" onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="center-page">
      <Mascot mood="sad" />
      <h2>No encontramos esa lección</h2>
      <button className="btn primary" onClick={() => go('aprender')}>
        Volver
      </button>
    </div>
  )
}
