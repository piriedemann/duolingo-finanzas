import { useEffect, useMemo, useRef, useState } from 'react'
import type { Exercise } from '../data/types'
import { shuffleOptions, canCheck, correctText, ExerciseView, explanation, grade, initialAnswer, isGradable, type Answer } from './Exercises'
import { loseHeart, MAX_HEARTS, refillHearts, useStore } from '../state/store'
import { sfx } from '../lib/sound'
import { Heart, X } from './Icons'

export interface QueueItem {
  ex: Exercise
  /** clave para registrar errores: lección + índice */
  lessonId: string
  exIndex: number
}

export interface LessonResult {
  accuracy: number
  mistakes: QueueItem[]
  maxCombo: number
  seconds: number
  gradedCount: number
}

const CHEERS = ['Correcto', 'Exacto', 'Muy bien', 'Bien visto', 'Correcto']
const HEART_COST = 50

export function LessonPlayer({
  items,
  color,
  practice = false,
  onExit,
  onFinish,
}: {
  items: QueueItem[]
  color: string
  practice?: boolean
  onExit: () => void
  onFinish: (r: LessonResult) => void
}) {
  const hearts = useStore((s) => s.hearts)
  const lucas = useStore((s) => s.lucas)
  const [queue, setQueue] = useState<QueueItem[]>(() => items.map((it) => ({ ...it, ex: shuffleOptions(it.ex) })))
  const [pos, setPos] = useState(0)
  // respuesta y estado van atados a la posición: al avanzar se reinician sin un render intermedio
  const [slot, setSlot] = useState<{ pos: number; answer: Answer; status: 'idle' | 'correct' | 'wrong' }>({
    pos: 0,
    answer: initialAnswer(items[0].ex),
    status: 'idle',
  })
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [cheer, setCheer] = useState('')
  const [confirmExit, setConfirmExit] = useState(false)
  const mistakes = useRef<Map<string, QueueItem>>(new Map())
  const firstTry = useRef<Set<string>>(new Set())
  const start = useRef(Date.now())
  const totalGradable = useMemo(() => items.filter((i) => i.ex.type !== 'concept').length, [items])

  const cur = queue[pos]
  const ex = cur.ex
  const key = `${cur.lessonId}:${cur.exIndex}`
  const progress = pos / queue.length

  const fresh = slot.pos === pos
  const answer = fresh ? slot.answer : initialAnswer(ex)
  const status = fresh ? slot.status : 'idle'
  const setAnswer = (a: Answer) => setSlot({ pos, answer: a, status: 'idle' })
  const setStatus = (st: 'idle' | 'correct' | 'wrong') => setSlot({ pos, answer, status: st })
  const outOfHearts = !practice && hearts <= 0 && status !== 'wrong'

  const finish = () => {
    const graded = totalGradable
    const wrong = mistakes.current.size
    onFinish({
      accuracy: graded ? Math.max(0, (graded - wrong) / graded) : 1,
      mistakes: [...mistakes.current.values()],
      maxCombo,
      seconds: Math.round((Date.now() - start.current) / 1000),
      gradedCount: graded,
    })
  }

  const next = () => {
    if (pos + 1 >= queue.length) finish()
    else setPos(pos + 1)
  }

  const markCorrect = () => {
    const c = combo + 1
    setCombo(c)
    setMaxCombo((m) => Math.max(m, c))
    setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)])
    setStatus('correct')
    sfx.correct()
  }

  const check = () => {
    if (!canCheck(ex, answer)) return
    if (grade(ex, answer)) {
      markCorrect()
    } else {
      setStatus('wrong')
      setCombo(0)
      sfx.wrong()
      mistakes.current.set(key, cur)
      if (!practice) loseHeart()
      // Estilo Duolingo: el ejercicio fallado vuelve al final
      if (!firstTry.current.has(key)) {
        firstTry.current.add(key)
        setQueue((q) => [...q, cur])
      }
    }
  }

  // Atajos de teclado: 1-4 para opciones, Enter para comprobar/continuar
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (ex.type === 'concept' || status !== 'idle') next()
        else check()
      }
      if (status === 'idle' && (ex.type === 'mc' || ex.type === 'fill')) {
        const n = Number(e.key)
        if (n >= 1 && n <= ex.options.length) setAnswer(n - 1)
      }
      if (status === 'idle' && ex.type === 'tf') {
        if (e.key === '1' || e.key.toLowerCase() === 'v') setAnswer(true)
        if (e.key === '2' || e.key.toLowerCase() === 'f') setAnswer(false)
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  return (
    <div className="lesson" style={{ ['--unit' as string]: color }}>
      <header className="lesson-top">
        <button className="icon-btn" onClick={() => setConfirmExit(true)} aria-label="Salir">
          <X size={22} />
        </button>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${Math.max(4, progress * 100)}%` }} />
          {combo >= 3 && <span className="combo">{combo} seguidas</span>}
        </div>
        <div className="hearts" title="Vidas">
          {practice ? <span className="muted small">Repaso</span> : <><Heart size={18} /> {hearts}</>}
        </div>
      </header>

      <main className="lesson-body" key={pos}>
        {ex.type !== 'concept' && firstTry.current.has(key) && status === 'idle' && (
          <div className="retry-tag">Revisemos este de nuevo</div>
        )}
        <ExerciseView
          ex={ex}
          answer={answer}
          setAnswer={setAnswer}
          locked={status !== 'idle'}
          seed={pos * 31 + cur.exIndex}
          onMatchDone={(errors) => {
            if (errors >= 2) mistakes.current.set(key, cur)
            markCorrect()
          }}
        />
      </main>

      <footer className={'lesson-foot ' + status}>
        {status === 'idle' ? (
          <div className="foot-inner">
            {ex.type === 'concept' ? (
              <button className="btn primary wide" onClick={next}>
                Continuar
              </button>
            ) : ex.type === 'match' ? (
              <span className="muted">Une cada concepto con su pareja</span>
            ) : (
              <>
                {isGradable(ex) && (
                  <button className="btn ghost hide-mobile" onClick={() => {
                    // saltar cuenta como error, sin perder vida
                    mistakes.current.set(key, cur)
                    next()
                  }}>
                    Saltar
                  </button>
                )}
                <button className="btn primary wide" disabled={!canCheck(ex, answer)} onClick={check}>
                  Comprobar
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="foot-inner">
            <div className="feedback">
              <div className="feedback-head">
                <strong>{status === 'correct' ? cheer : 'No exactamente. La respuesta es:'}</strong>
              </div>
              {status === 'wrong' && <div className="feedback-answer">{correctText(ex)}</div>}
              {explanation(ex, answer) && <p className="feedback-explain">{explanation(ex, answer)}</p>}
            </div>
            <button className={'btn wide ' + (status === 'correct' ? 'primary' : 'danger')} onClick={next}>
              Continuar
            </button>
          </div>
        )}
      </footer>

      {outOfHearts && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Sin vidas por ahora</h2>
            <p className="muted">Se recupera una cada 20 minutos. También puedes recargarlas con Lucas o hacer un repaso.</p>
            <button className="btn primary wide" disabled={lucas < HEART_COST} onClick={() => refillHearts(HEART_COST)}>
              Recargar {MAX_HEARTS} vidas · {HEART_COST} Lucas
            </button>
            <button className="btn ghost wide" onClick={onExit}>
              Salir de la lección
            </button>
          </div>
        </div>
      )}

      {confirmExit && (
        <div className="modal-backdrop" onClick={() => setConfirmExit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>¿Salir de la lección?</h2>
            <p className="muted">Perderás el progreso de esta lección.</p>
            <button className="btn primary wide" onClick={() => setConfirmExit(false)}>
              Continuar lección
            </button>
            <button className="btn ghost wide danger-text" onClick={onExit}>
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
