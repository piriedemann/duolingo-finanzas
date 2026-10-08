import { useMemo, useState } from 'react'
import type { Exercise, MatchPairs } from '../data/types'
import { richText, shuffle } from '../lib/util'
import { sfx } from '../lib/sound'

export type Answer = number | boolean | null

export function isGradable(ex: Exercise) {
  return ex.type !== 'concept' && ex.type !== 'match'
}

export function initialAnswer(_ex: Exercise): Answer {
  return null
}

export function canCheck(_ex: Exercise, a: Answer) {
  return a !== null
}

export function grade(ex: Exercise, a: Answer): boolean {
  switch (ex.type) {
    case 'mc':
    case 'fill':
      return a === ex.answer
    case 'tf':
      return a === ex.answer
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
          <div className="concept-kicker">Concepto</div>
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
          <blockquote className="statement">{ex.statement}</blockquote>
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
                {v ? 'Verdadero' : 'Falso'}
              </button>
            ))}
          </div>
        </>
      )
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

function MatchView({ ex, seed, onMatchDone }: Props & { ex: MatchPairs }) {
  // Se trabaja con índices, no con textos: dos tarjetas pueden tener el mismo texto
  // (ej. dos gastos que son "Necesidad (50%)") y deben resolverse por separado.
  const left = useMemo(() => shuffle(ex.pairs.map((_, i) => i), seed), [ex, seed])
  const right = useMemo(() => shuffle(ex.pairs.map((_, i) => i), seed + 7), [ex, seed])
  const [selL, setSelL] = useState<number | null>(null)
  const [selR, setSelR] = useState<number | null>(null)
  const [doneL, setDoneL] = useState<number[]>([])
  const [doneR, setDoneR] = useState<number[]>([])
  const [bad, setBad] = useState<{ l: number; r: number } | null>(null)
  const [errors, setErrors] = useState(0)

  const attempt = (l: number | null, r: number | null) => {
    if (l === null || r === null) return
    const [lText] = ex.pairs[l]
    const rText = ex.pairs[r][1]
    const ok = ex.pairs.some((p) => p[0] === lText && p[1] === rText)
    if (ok) {
      sfx.correct()
      const nl = [...doneL, l]
      setDoneL(nl)
      setDoneR([...doneR, r])
      if (nl.length === ex.pairs.length) setTimeout(() => onMatchDone?.(errors), 350)
    } else {
      sfx.wrong()
      setErrors((e) => e + 1)
      setBad({ l, r })
      setTimeout(() => setBad(null), 500)
    }
    setSelL(null)
    setSelR(null)
  }

  const cls = (isDone: boolean, isSel: boolean, isBad: boolean) =>
    'match-item' + (isDone ? ' done' : '') + (isSel ? ' selected' : '') + (isBad ? ' bad' : '')

  return (
    <>
      <Prompt text={ex.prompt} />
      <div className="match-grid">
        <div className="match-col">
          {left.map((i) => (
            <button
              key={i}
              className={cls(doneL.includes(i), selL === i, bad?.l === i)}
              disabled={doneL.includes(i)}
              onClick={() => {
                sfx.tap()
                setSelL(i)
                attempt(i, selR)
              }}
            >
              {ex.pairs[i][0]}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((i) => (
            <button
              key={i}
              className={cls(doneR.includes(i), selR === i, bad?.r === i)}
              disabled={doneR.includes(i)}
              onClick={() => {
                sfx.tap()
                setSelR(i)
                attempt(selL, i)
              }}
            >
              {ex.pairs[i][1]}
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
