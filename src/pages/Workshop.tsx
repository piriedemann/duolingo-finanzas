import { useMemo, useState } from 'react'
import { MODULES, WORKSHOP } from '../data/workshop/e2020'
import { completeWorkshopModule, joinWorkshop, useStore } from '../state/store'
import { LessonPlayer, type LessonResult, type QueueItem } from '../components/LessonPlayer'
import { Results } from './LessonPage'
import { useLeague } from '../lib/leaderboard'
import { cloudEnabled } from '../lib/supabase'
import { recordAnswer, useWorkshopStats } from '../lib/workshop'
import { go } from '../lib/util'
import { ArrowLeft, Check, ChevronRight, Trophy, Zap } from '../components/Icons'

/** Módulo especial del taller: #/taller, #/taller/<módulo>, #/taller/panel */
export function Workshop({ sub }: { sub?: string }) {
  if (sub === 'panel') return <Panel />
  const mod = MODULES.find((m) => m.id === sub)
  if (mod) return <ModulePlay id={mod.id} key={mod.id} />
  return <Home />
}

function Header({ back }: { back?: string }) {
  return (
    <header className="ws-head">
      {back ? (
        <button className="back" onClick={() => go(back)}>
          <ArrowLeft size={18} /> Volver
        </button>
      ) : (
        <div className="card-label">Taller de educación financiera</div>
      )}
      <div className="ws-brand">
        <strong>Animales Financieros</strong> <span className="muted">×</span> <strong>{WORKSHOP.org}</strong>
      </div>
    </header>
  )
}

function Home() {
  const s = useStore((s) => s)
  const inWorkshop = s.onboarded && s.cohort === WORKSHOP.id
  const [name, setName] = useState(s.name)
  const [editing, setEditing] = useState(false)

  if (!inWorkshop || editing) {
    const join = () => {
      if (!name.trim()) return
      joinWorkshop(name, WORKSHOP.id)
      setEditing(false)
    }
    return (
      <div className="ws">
        <Header />
        <h1 className="hero-title">Ustedes ya van adelante.</h1>
        <p className="lead">
          Durante el taller vamos a responder unas pocas preguntas después de cada historia. Nadie comparte montos personales:
          entra con un apodo.
        </p>
        <label className="ws-label" htmlFor="apodo">
          Tu apodo
        </label>
        <input
          id="apodo"
          className="search"
          autoFocus
          placeholder="Por ejemplo: Cami, Tomi, La Dani"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && join()}
        />
        <button className="btn primary wide" disabled={!name.trim()} onClick={join}>
          Entrar al taller
        </button>
        {editing && (
          <button className="btn ghost wide" onClick={() => setEditing(false)}>
            Cancelar
          </button>
        )}
        <p className="muted small">Sin registro ni descarga. Tu apodo y tus puntos son visibles para el grupo.</p>
      </div>
    )
  }

  return (
    <div className="ws">
      <Header />
      <div className="ws-hello">
        <h1>Hola, {s.name}</h1>
        <button className="btn ghost small" onClick={() => setEditing(true)}>
          Cambiar apodo
        </button>
      </div>
      <p className="muted">
        Cuando Pablo o Francisco lo indiquen, entra al módulo que corresponde y responde. Al terminar, vuelve acá.
      </p>

      <div className="ws-modules">
        {MODULES.map((m) => {
          const acc = s.workshop[m.id]
          const done = acc !== undefined
          return (
            <button key={m.id} className="card ws-module" style={{ ['--unit' as string]: m.color }} onClick={() => go('taller/' + m.id)}>
              <span className="ws-emoji">{m.emoji}</span>
              <span className="grow">
                <strong>{m.title}</strong>
                <span className="muted small">
                  {done ? `Completado · ${Math.round(acc * 100)}% correcto · ${m.concept}` : `${m.exercises.length} preguntas`}
                </span>
              </span>
              {done ? <Check size={20} className="ws-done" /> : <ChevronRight size={20} className="muted" />}
            </button>
          )
        })}
      </div>

      <Challenge />

      <div className="card ws-more">
        <div className="card-label">Después del taller</div>
        <p className="muted small">
          Fito Finanzas completo tiene 27 lecciones, quizzes de más de 180 episodios del podcast y calculadoras. Todo lo que hagas ahí suma
          puntos al desafío.
        </p>
        <a className="btn primary wide" href="#/aprender">
          Ir al camino de aprendizaje
        </a>
      </div>
      <p className="muted small center">Prototipo educativo. No constituye asesoría financiera.</p>
    </div>
  )
}

function Challenge() {
  const { list, status } = useLeague(WORKSHOP.id)
  const top = list.slice(0, 10)
  const myPos = list.findIndex((p) => p.me) + 1
  return (
    <div className="card">
      <div className="ws-challenge-head">
        <div>
          <div className="card-label">Desafío de una semana</div>
          <strong>Quien más puntos junte gana {WORKSHOP.prize}</strong>
          <div className="muted small">Del 1 al 8 de octubre. Cuentan las preguntas del taller y todo Fito Finanzas.</div>
        </div>
        <Trophy size={26} className="ws-trophy" />
      </div>
      {status === 'local' && <p className="muted small">El ranking necesita conexión (Supabase no configurado).</p>}
      {status === 'error' && <p className="muted small">No pudimos cargar el ranking. Reintentamos solos.</p>}
      {top.length > 0 && (
        <div className="league-list">
          {top.map((p, i) => (
            <div key={p.id} className={'league-row small' + (p.me ? ' me' : '')}>
              <span className={'rank' + (i < 3 ? ' top' + i : '')}>{i + 1}</span>
              <span className="avatar">{p.name[0]}</span>
              <span className="grow">{p.name}</span>
              <span className="muted">
                <Zap size={14} /> {p.challengeXp}
              </span>
            </div>
          ))}
        </div>
      )}
      {status === 'ok' && myPos > 10 && <p className="muted small center">Vas en el puesto #{myPos} de {list.length}.</p>}
    </div>
  )
}

function ModulePlay({ id }: { id: string }) {
  const mod = MODULES.find((m) => m.id === id)!
  const inWorkshop = useStore((s) => s.onboarded && s.cohort === WORKSHOP.id)
  const [result, setResult] = useState<(LessonResult & { xp: number }) | null>(null)
  const items = useMemo<QueueItem[]>(() => mod.exercises.map((ex, exIndex) => ({ ex, lessonId: 'taller:' + id, exIndex })), [mod, id])
  if (!inWorkshop) {
    go('taller')
    return null
  }
  if (result) {
    return (
      <Results
        result={result}
        color={mod.color}
        title={`${mod.emoji} ${mod.concept}`}
        onContinue={() => go('taller')}
        extra={<p className="muted">Eso que acabas de ver se llama <strong>{mod.concept.toLowerCase()}</strong>. Vuelve a la sesión: ahora lo conversamos.</p>}
      />
    )
  }
  return (
    <LessonPlayer
      items={items}
      color={mod.color}
      practice
      label={mod.title.split(':')[0]}
      onExit={() => go('taller')}
      onAnswer={(item, correct) => void recordAnswer(id, item.exIndex, correct)}
      onFinish={(r) => {
        const xp = 10 + (r.accuracy === 1 ? 5 : 0)
        completeWorkshopModule(id, r.accuracy, xp)
        setResult({ ...r, xp })
      }}
    />
  )
}

/* ---------- panel del facilitador ---------- */

function Panel() {
  const { stats, error, updatedAt, refresh } = useWorkshopStats()
  if (!cloudEnabled) {
    return (
      <div className="ws">
        <Header back="taller" />
        <h1>Panel del taller</h1>
        <p className="muted">Supabase no está configurado: sin conexión no hay resultados en vivo.</p>
      </div>
    )
  }
  return (
    <div className="ws ws-wide">
      <Header back="taller" />
      <div className="ws-panel-head">
        <div>
          <h1>Resultados en vivo</h1>
          <p className="muted small">
            {WORKSHOP.name} · {WORKSHOP.date} · se actualiza cada 5 s
            {updatedAt && ` · último: ${updatedAt.toLocaleTimeString('es-CL')}`}
          </p>
        </div>
        <button className="btn ghost small" onClick={() => void refresh()}>
          Actualizar
        </button>
      </div>
      {error && <div className="card muted small">Error al cargar: {error}</div>}
      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div><strong>{stats.participants.length}</strong><div className="muted small">Conectados con apodo</div></div></div>
            {stats.modules.map((m) => (
              <div key={m.id} className="stat-card">
                <span>{m.emoji}</span>
                <div>
                  <strong>{m.finished}<span className="muted small"> / {m.responders}</span></strong>
                  <div className="muted small">Terminaron / empezaron {m.concept.toLowerCase()}</div>
                </div>
              </div>
            ))}
          </div>

          {stats.modules.map((m) => (
            <div key={m.id} className="card">
              <div className="card-label">{m.emoji} {m.title} · {m.concept}</div>
              {m.questions.map((q) => {
                const n = q.correct + q.wrong
                const pct = n ? Math.round((q.correct / n) * 100) : 0
                const weak = n >= 3 && pct < 60
                return (
                  <div key={q.question} className={'ws-q' + (weak ? ' weak' : '')}>
                    <div className="ws-q-text">
                      <span className="muted small">P{q.question + 1}</span> {q.prompt}
                    </div>
                    <div className="ws-q-bar" title={`${q.correct} correctas, ${q.wrong} incorrectas`}>
                      <div className="ws-q-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="ws-q-num">
                      {n ? <><strong>{pct}%</strong> <span className="muted small">{q.correct}/{n}</span></> : <span className="muted small">sin respuestas</span>}
                    </div>
                  </div>
                )
              })}
              <p className="muted small">Se cuenta solo el primer intento de cada persona. En rojo: menos del 60% correcto con 3 o más respuestas.</p>
            </div>
          ))}

          <div className="card">
            <div className="card-label">Participantes ({stats.participants.length})</div>
            <div className="ws-people">
              {stats.participants.map((p) => (
                <span key={p.id} className="ws-chip">
                  {p.name} <span className="muted">{p.challengeXp}</span>
                </span>
              ))}
              {!stats.participants.length && <span className="muted small">Todavía nadie ha entrado con apodo.</span>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
