import { useMemo, useState } from 'react'
import { CATEGORY_LABEL, CATEGORY_UNIT, EPISODES, currentMonthEpisodes, monthLabel, quizFor, shortDate, spotifySearch } from '../data/episodes'
import type { Category } from '../data/types'
import { UNITS } from '../data/units'
import { markListened, pointsFor, quizPoints, quizXpFor, useStore } from '../state/store'
import { go } from '../lib/util'
import { ArrowLeft, Calendar, Check, Crown, Headphones, Mic, Play, Zap } from '../components/Icons'

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
      {q === '' && cat === 'all' && <MonthEpisodes />}
      {q === '' && cat === 'all' && <h2 className="section-title">Todos los episodios</h2>}
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

/**
 * Capítulos del mes: los episodios publicados este mes y los puntos que llevas en sus quizzes.
 * Es la base de la competencia mensual: solo cuentan estos capítulos, no todo el catálogo.
 */
export function MonthEpisodes() {
  const s = useStore((s) => s)
  const month = useMemo(() => currentMonthEpisodes(), [])
  if (!month.episodes.length) return null
  const ids = month.episodes.map((e) => e.id)
  const points = pointsFor(s, ids)
  const maxPoints = ids.length * quizXpFor(1)
  const played = ids.filter((id) => s.quizzes?.[id] !== undefined).length
  const next = month.episodes.find((e) => s.quizzes?.[e.id] === undefined && quizFor(e.id))
  return (
    <section className="month" id="capitulos-del-mes">
      <div className="card month-head">
        <span className="icon-chip big">
          <Calendar size={20} />
        </span>
        <div className="grow">
          <div className="card-label">Capítulos del mes</div>
          <h2 className="month-title">{monthLabel(month.key)}</h2>
          <div className="muted small">
            {month.fallback
              ? `Aún no hay capítulos de ${monthLabel(month.current)}. Mientras tanto, los de ${monthLabel(month.key)}.`
              : `${ids.length} ${ids.length === 1 ? 'capítulo' : 'capítulos'} · quiz hecho en ${played} de ${ids.length}`}
          </div>
        </div>
        <div className="month-points" title="Suma del mejor resultado en el quiz de cada capítulo del mes">
          <strong>
            <Zap size={16} /> {points}
          </strong>
          <span className="muted small">de {maxPoints} pts</span>
        </div>
      </div>
      <div className="bar thin month-bar">
        <div className="bar-fill" style={{ width: `${maxPoints ? (points / maxPoints) * 100 : 0}%` }} />
      </div>
      <div className="ep-list">
        {month.episodes.map((e) => {
          const score = s.quizzes?.[e.id]
          const pts = quizPoints(s, e.id)
          return (
            <button key={e.id} className={'ep-card' + (next?.id === e.id ? ' next' : '')} onClick={() => go('episodio/' + e.id)}>
              <div className="ep-num">{e.number !== null ? e.number : <Mic size={18} />}</div>
              <div className="ep-main">
                <div className="ep-title">{e.title}</div>
                {e.guest && <div className="ep-guest">con {e.guest}</div>}
                <div className="ep-cat">
                  {e.date && shortDate(e.date)} · {CATEGORY_LABEL[e.category]}
                </div>
              </div>
              <div className="ep-points">
                {score !== undefined ? (
                  <>
                    <strong>{pts} pts</strong>
                    <span className="muted small">{score === 1 ? <Crown size={14} /> : <Check size={14} />} {Math.round(score * 100)}%</span>
                  </>
                ) : quizFor(e.id) ? (
                  <span className={'step-cta' + (next?.id === e.id ? ' primary' : '')}>Jugar · +{quizXpFor(1)}</span>
                ) : (
                  <span className="muted small">Sin quiz</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
      <p className="muted small">
        Los puntos del mes suman el mejor resultado de cada quiz: {quizXpFor(0)} por completarlo y {quizXpFor(1)} si es perfecto.
        Repetir un quiz solo cuenta si mejoras.
      </p>
    </section>
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
