import { useMemo, useState } from 'react'
import type { Exercise, MatchPairs, NumberEstimate, OrderSteps } from '../data/types'
import { fmtNum, richText, shuffle } from '../lib/util'
import { sfx } from '../lib/sound'
import { Mascot, SpeechBubble } from './Mascot'

export type Answer = number | boolean | string[] | null

export function isGradable(ex: Exercise) {
  return ex.type !== 'concept' && ex.type !== 'match'
}

export function initialAnswer(ex: Exercise): Answer {
  if (ex.type === 'number') return snap(ex, (ex.min + ex.max) / 2)
  if (ex.type === 'order') return []
  return null
}

function snap(ex: NumberEstimate, v: number) {
  return Math.round((v - ex.min) / ex.step) * ex.step + ex.min
}

export function canCheck(ex: Exercise, a: Answer) {
  if (ex.type === 'order') return Array.isArray(a) && a.length === ex.items.length
  if (ex.type === 'number') return typeof a === 'number'
  return a !== null
}

export function grade(ex: Exercise, a: Answer): boolean {
  switch (ex.type) {
    case 'mc':
    case 'fill':
      return a === ex.answer
    case 'tf':
      return a === ex.answer
    case 'number':
      return typeof a === 'number' && Math.abs(a - ex.answer) <= ex.tolerance
    case 'order':
      return Array.isArray(a) && a.every((x, i) => x === ex.items[i])
    default:
      return true
  }
}

export function correctText(ex: Exercise): string {
  switch (ex.type) {
    case 'mc':
      return ex.options[ex.answer]
    case 'fill':
      return ex.sentence.replace('___', ex.options[ex.answer])
    case 'tf':
      return ex.answer ? 'Verdadero' : 'Falso'
    case 'number':
      return fmtNum(ex.answer, ex.unit)
    case 'order':
      return ex.items.map((x, i) => `${i + 1}. ${x}`).join('  ')
    default:
      return ''
  }
}

export function explanation(ex: Exercise, a: Answer): string {
  if (ex.type === 'mc' && ex.feedback && typeof a === 'number' && ex.feedback[a]) {
    return ex.feedback[a] + (a !== ex.answer ? ' ' + ex.explain : '')
  }
  return 'explain' in ex ? ex.explain : ''
}

interface Props {
  ex: Exercise
  answer: Answer
  setAnswer: (a: Answer) => void
  locked: boolean
  seed: number
  onMatchDone?: (errors: number) => void
}

export function ExerciseView(p: Props) {
  const { ex } = p
  switch (ex.type) {
    case 'concept':
      return (
        <div className="concept">
          <div className="concept-emoji">{ex.emoji ?? '💡'}</div>
          <h2>{ex.title}</h2>
          <p>{richText(ex.body)}</p>
        </div>
      )
    case 'mc':
      return (
        <>
          <Prompt text={ex.prompt} />
          <Options options={ex.options} {...p} />
        </>
      )
    case 'fill': {
      const [a, b] = ex.sentence.split('___')
      const chosen = typeof p.answer === 'number' ? ex.options[p.answer] : null
      return (
        <>
          <h2 className="ex-title">Completa la frase</h2>
          <div className="fill-sentence">
            {a}
            <span className={'blank' + (chosen ? ' filled' : '')}>{chosen ?? ' '}</span>
            {b}
          </div>
          <Options options={ex.options} {...p} chips />
        </>
      )
    }
    case 'tf':
      return (
        <>
          <h2 className="ex-title">¿Verdadero o falso?</h2>
          <div className="with-mascot">
            <Mascot mood="think" size={90} />
            <SpeechBubble>{ex.statement}</SpeechBubble>
          </div>
          <div className="tf-row">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                disabled={p.locked}
                className={'choice big' + (p.answer === v ? ' selected' : '')}
                onClick={() => {
                  sfx.tap()
                  p.setAnswer(v)
                }}
              >
                {v ? '👍 Verdadero' : '👎 Falso'}
              </button>
            ))}
          </div>
        </>
      )
    case 'number':
      return <NumberView {...p} ex={ex} />
    case 'order':
      return <OrderView {...p} ex={ex} />
    case 'match':
      return <MatchView {...p} ex={ex} />
  }
}

function Prompt({ text }: { text: string }) {
  return <h2 className="ex-title">{richText(text)}</h2>
}

function Options({ options, answer, setAnswer, locked, chips }: Props & { options: string[]; chips?: boolean }) {
  return (
    <div className={chips ? 'chips' : 'options'}>
      {options.map((o, i) => (
        <button
          key={i}
          disabled={locked}
          className={(chips ? 'chip' : 'choice') + (answer === i ? ' selected' : '')}
          onClick={() => {
            sfx.tap()
            setAnswer(i)
          }}
        >
          {!chips && <span className="key">{i + 1}</span>}
          <span>{o}</span>
        </button>
      ))}
    </div>
  )
}

function NumberView({ ex, answer, setAnswer, locked }: Props & { ex: NumberEstimate }) {
  const v = typeof answer === 'number' ? answer : ex.min
  return (
    <>
      <Prompt text={ex.prompt} />
      <div className="number-box">
        <div className="number-value">{fmtNum(v, ex.unit)}</div>
        <input
          type="range"
          min={ex.min}
          max={ex.max}
          step={ex.step}
          value={v}
          disabled={locked}
          onChange={(e) => setAnswer(Number(e.target.value))}
        />
        <div className="number-scale">
          <span>{fmtNum(ex.min, ex.unit)}</span>
          <span>{fmtNum(ex.max, ex.unit)}</span>
        </div>
        <div className="number-steps">
          <button className="btn small ghost" disabled={locked || v <= ex.min} onClick={() => setAnswer(Math.max(ex.min, v - ex.step))}>
            −
          </button>
          <span className="muted">Afina con los botones · margen ±{fmtNum(ex.tolerance, ex.unit)}</span>
          <button className="btn small ghost" disabled={locked || v >= ex.max} onClick={() => setAnswer(Math.min(ex.max, v + ex.step))}>
            +
          </button>
        </div>
      </div>
    </>
  )
}

function OrderView({ ex, answer, setAnswer, locked, seed }: Props & { ex: OrderSteps }) {
  const pool = useMemo(() => {
    let s = shuffle(ex.items, seed)
    if (s.every((x, i) => x === ex.items[i])) s = [...s].reverse()
    return s
  }, [ex, seed])
  const chosen = (answer as string[]) ?? []
  return (
    <>
      <Prompt text={ex.prompt} />
      <div className="order-slots">
        {chosen.length === 0 && <div className="muted center">Toca los pasos en el orden correcto 👇</div>}
        {chosen.map((x, i) => (
          <button key={x} className="order-item placed" disabled={locked} onClick={() => setAnswer(chosen.filter((y) => y !== x))}>
            <span className="key">{i + 1}</span> {x}
          </button>
        ))}
      </div>
      <div className="order-pool">
        {pool.map((x) => {
          const used = chosen.includes(x)
          return (
            <button
              key={x}
              className={'order-item' + (used ? ' used' : '')}
              disabled={locked || used}
              onClick={() => {
                sfx.tap()
                setAnswer([...chosen, x])
              }}
            >
              {x}
            </button>
          )
        })}
      </div>
    </>
  )
}

function MatchView({ ex, seed, onMatchDone }: Props & { ex: MatchPairs }) {
  const left = useMemo(() => shuffle(ex.pairs.map((p) => p[0]), seed), [ex, seed])
  const right = useMemo(() => shuffle(ex.pairs.map((p) => p[1]), seed + 7), [ex, seed])
  const [selL, setSelL] = useState<string | null>(null)
  const [selR, setSelR] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])
  const [bad, setBad] = useState<string[]>([])
  const [errors, setErrors] = useState(0)

  const attempt = (l: string | null, r: string | null) => {
    if (!l || !r) return
    const ok = ex.pairs.some((p) => p[0] === l && p[1] === r)
    if (ok) {
      sfx.correct()
      const nd = [...done, l, r]
      setDone(nd)
      if (nd.length === ex.pairs.length * 2) setTimeout(() => onMatchDone?.(errors), 350)
    } else {
      sfx.wrong()
      setErrors((e) => e + 1)
      setBad([l, r])
      setTimeout(() => setBad([]), 500)
    }
    setSelL(null)
    setSelR(null)
  }

  const cls = (x: string, sel: string | null) =>
    'match-item' + (done.includes(x) ? ' done' : '') + (sel === x ? ' selected' : '') + (bad.includes(x) ? ' bad' : '')

  return (
    <>
      <Prompt text={ex.prompt} />
      <div className="match-grid">
        <div className="match-col">
          {left.map((l) => (
            <button
              key={l}
              className={cls(l, selL)}
              disabled={done.includes(l)}
              onClick={() => {
                sfx.tap()
                setSelL(l)
                attempt(l, selR)
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((r) => (
            <button
              key={r}
              className={cls(r, selR)}
              disabled={done.includes(r)}
              onClick={() => {
                sfx.tap()
                setSelR(r)
                attempt(selL, r)
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

/** Baraja las opciones de mc/fill manteniendo la respuesta y el feedback alineados */
export function shuffleOptions(ex: Exercise): Exercise {
  if (ex.type !== 'mc' && ex.type !== 'fill') return ex
  const order = shuffle(ex.options.map((_, i) => i))
  const base = { ...ex, options: order.map((i) => ex.options[i]), answer: order.indexOf(ex.answer) }
  if (ex.type === 'mc' && ex.feedback) return { ...base, feedback: order.map((i) => ex.feedback![i]) } as Exercise
  return base as Exercise
}
