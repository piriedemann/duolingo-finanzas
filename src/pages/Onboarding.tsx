import { useState } from 'react'
import { setState } from '../state/store'
import { SHOW } from '../data/episodes'
import { go } from '../lib/util'
import { Brand } from '../App'
import { ArrowLeft } from '../components/Icons'

const GOALS = [
  'Ordenar mis gastos y empezar a ahorrar',
  'Salir de deudas',
  'Aprender a invertir',
  'Preparar mi jubilación',
  'Aumentar mis ingresos',
  'Entender mejor mi relación con el dinero',
]
const DAILY = [
  [10, 'Liviano', '5 min al día'],
  [30, 'Constante', '10 min al día'],
  [50, 'Comprometido', '15 min al día'],
  [100, 'Intensivo', '20 min al día'],
] as const

export function Onboarding() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [daily, setDaily] = useState(30)
  const [name, setName] = useState('')

  const finish = () => {
    setState((s) => ({ ...s, onboarded: true, goal, dailyGoal: daily, name: name.trim() }))
    go('aprender')
  }

  if (step === 0) {
    return (
      <div className="onboard welcome">
        <Brand />
        <h1 className="hero-title">Finanzas personales, cinco minutos al día.</h1>
        <p className="lead">
          Lecciones cortas, práctica y herramientas basadas en las conversaciones de <strong>{SHOW.name}</strong>.
        </p>
        <ul className="hero-points">
          <li>27 lecciones en 9 unidades, del ahorro a la jubilación</li>
          <li>Quizzes de cada episodio del podcast</li>
          <li>Calculadoras para aplicarlo a tus números</li>
        </ul>
        <button className="btn primary wide" onClick={() => setStep(1)}>
          Comenzar
        </button>
        <p className="muted small">"{SHOW.tagline}"</p>
      </div>
    )
  }

  return (
    <div className="onboard">
      <div className="onboard-top">
        <button className="icon-btn" onClick={() => setStep(step - 1)} aria-label="Atrás">
          <ArrowLeft size={22} />
        </button>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>
      {step === 1 && (
        <>
          <h2 className="onboard-q">¿Qué te gustaría lograr con tu plata?</h2>
          <div className="options">
            {GOALS.map((g) => (
              <button key={g} className={'choice' + (goal === g ? ' selected' : '')} onClick={() => setGoal(g)}>
                {g}
              </button>
            ))}
          </div>
          <button className="btn primary wide" disabled={!goal} onClick={() => setStep(2)}>
            Continuar
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="onboard-q">¿Cuánto tiempo le quieres dedicar?</h2>
          <p className="muted">Como con el interés compuesto, la constancia pesa más que la intensidad.</p>
          <div className="options">
            {DAILY.map(([xp, label, time]) => (
              <button key={xp} className={'choice row' + (daily === xp ? ' selected' : '')} onClick={() => setDaily(xp)}>
                <strong>{label}</strong>
                <span className="muted">
                  {time} · {xp} XP
                </span>
              </button>
            ))}
          </div>
          <button className="btn primary wide" onClick={() => setStep(3)}>
            Continuar
          </button>
        </>
      )}
      {step === 3 && (
        <>
          <h2 className="onboard-q">¿Cómo te llamas?</h2>
          <input
            className="search"
            autoFocus
            placeholder="Tu nombre"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && finish()}
          />
          <button className="btn primary wide" onClick={finish}>
            Empezar a aprender
          </button>
        </>
      )}
    </div>
  )
}
