import { useMemo, useState } from 'react'
import { CATEGORY_LABEL, CATEGORY_UNIT, EPISODES, quizFor, spotifySearch } from '../data/episodes'
import type { Category } from '../data/types'
import { UNITS } from '../data/units'
import { markListened, useStore } from '../state/store'
import { go } from '../lib/util'
import { ArrowLeft, Check, Crown, Headphones, Mic, Play } from '../components/Icons'

export function Episodes() {
  const listened = useStore((s) => s.listened)
  const quizzes = useStore((s) => s.quizzes ?? {})
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const cats = useMemo(() => [...new Set(EPISODES.map((e) => e.category))], [])
  const list = EPISODES.filter(
    (e) =>
      (cat === 'all' || e.category === cat) &&
      (q === '' ||
        (e.title + ' ' + (e.guest ?? '') + ' ' + e.summary + ' ' + e.takeaways.join(' '))
          .toLowerCase()
          .includes(q.toLowerCase())),
  )
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Episodios</h1>
          <p className="muted">
            {EPISODES.length} episodios con quiz. Escucha, marca como escuchado y practica lo aprendido.
          </p>
        </div>

      </div>
      <input className="search" placeholder="Buscar por tema, invitado o concepto…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="filter-row">
        <button className={'pill' + (cat === 'all' ? ' on' : '')} onClick={() => setCat('all')}>
          Todos
        </button>
        {cats.map((c) => (
          <button key={c} className={'pill' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
      {list.length === 0 && (
        <div className="center-page">
          <p className="muted">No hay episodios que coincidan.</p>
        </div>
      )}
      <div className="ep-list">
        {list.map((e) => {
          const done = listened.includes(e.id)
          return (
            <button key={e.id} className="ep-card" onClick={() => go('episodio/' + e.id)}>
              <div className="ep-num">{e.number !== null ? e.number : <Mic size={18} />}</div>
              <div className="ep-main">
                <div className="ep-title">{e.title}</div>
                {e.guest && <div className="ep-guest">con {e.guest}</div>}
                <div className="ep-cat">{CATEGORY_LABEL[e.category]}</div>
              </div>
              <div className="ep-state">
                {quizzes[e.id] !== undefined ? quizzes[e.id] === 1 ? <Crown size={18} /> : <Check size={18} /> : done ? <Headphones size={18} /> : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function EpisodeDetail({ id }: { id: string }) {
  const listened = useStore((s) => s.listened)
  const quizScore = useStore((s) => s.quizzes?.[id])
  const e = EPISODES.find((x) => x.id === id)
  const [flipped, setFlipped] = useState<number[]>([])
  if (!e) {
    return (
      <div className="center-page">
        <p>Episodio no encontrado</p>
        <button className="btn primary" onClick={() => go('episodios')}>
          Volver
        </button>
      </div>
    )
  }
  const unit = UNITS.find((u) => u.id === CATEGORY_UNIT[e.category])
  const done = listened.includes(e.id)
  return (
    <div className="page">
      <button className="back" onClick={() => go('episodios')}>
        <ArrowLeft size={16} /> Episodios
      </button>
      <div className="ep-hero">
        <div className="ep-hero-num">{e.number !== null ? '#' + e.number : <Mic size={24} />}</div>
        <div>
          <div className="ep-cat">
            {CATEGORY_LABEL[e.category]}
            {e.fromTranscript && ' · Basado en la transcripción'}
          </div>
          <h1>{e.title}</h1>
          {e.guest && <div className="ep-guest">con {e.guest}</div>}
        </div>
      </div>
      <p className="ep-summary">{e.summary}</p>
      <div className="ep-actions">
        <a className="btn spotify" href={spotifySearch(e)} target="_blank" rel="noreferrer">
          <Play size={16} /> Escuchar en Spotify
        </a>
        <button className={'btn ' + (done ? 'ghost' : 'primary')} disabled={done} onClick={() => markListened(e.id)}>
          {done ? 'Escuchado' : 'Marcar como escuchado · +5 XP'}
        </button>
      </div>

      {quizFor(e.id) && (
        <button className="card quiz-cta" onClick={() => go('quiz/' + e.id)}>
          <span className="icon-chip big"><Mic size={20} /></span>
          <div className="grow">
            <strong>Quiz del episodio</strong>
            <div className="muted small">
              {quizFor(e.id)!.length} preguntas ·{' '}
              {quizScore !== undefined ? `mejor resultado ${Math.round(quizScore * 100)}%` : '+8 XP y 10 Lucas la primera vez'}
            </div>
          </div>
          <span className="btn small primary">{quizScore !== undefined ? 'Repetir' : 'Jugar'}</span>
        </button>
      )}

      {e.takeaways.length > 0 && (
        <>
          <h2 className="section-title">Ideas clave</h2>
          <p className="muted small">Intenta recordar cada idea antes de revelarla.</p>
          <div className="flash-grid">
            {e.takeaways.map((t, i) => {
              const on = flipped.includes(i)
              return (
                <button key={i} className={'flash' + (on ? ' on' : '')} onClick={() => setFlipped(on ? flipped.filter((x) => x !== i) : [...flipped, i])}>
                  {on ? t : <span className="flash-front">Idea {i + 1}</span>}
                </button>
              )
            })}
          </div>
        </>
      )}

      {unit && (
        <div className="card related" style={{ borderColor: unit.color }}>
          <span className="unit-symbol small">{unit.emoji}</span>
          <div>
            <div className="muted small">Practica este tema</div>
            <strong>
              {unit.animal}: {unit.title}
            </strong>
          </div>
          <button
            className="btn small"
            style={{ background: unit.color, borderColor: unit.colorDark, color: '#fff' }}
            onClick={() => {
              go('aprender')
              setTimeout(() => document.getElementById('unidad-' + unit.id)?.scrollIntoView({ behavior: 'smooth' }), 80)
            }}
          >
            Ir
          </button>
        </div>
      )}
      {e.source && (
        <p className="muted small">
          Fuente: <a href={e.source} target="_blank" rel="noreferrer">{new URL(e.source).hostname}</a>
        </p>
      )}
    </div>
  )
}
