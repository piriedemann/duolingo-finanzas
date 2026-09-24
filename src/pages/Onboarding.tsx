import { useState } from 'react'
import { setState } from '../state/store'
import { Mascot, SpeechBubble } from '../components/Mascot'
import { SHOW } from '../data/episodes'
import { go } from '../lib/util'

const GOALS = [
  ['🐷', 'Empezar a ahorrar'],
  ['🦊', 'Salir de deudas'],
  ['🐂', 'Aprender a invertir'],
  ['🐘', 'Pensar en mi jubilación'],
  ['🦅', 'Ganar más plata'],
  ['🦉', 'Entender mejor el dinero'],
]
const DAILY = [
  [10, 'Relajada', '5 min/día'],
  [30, 'Normal', '10 min/día'],
  [50, 'Seria', '15 min/día'],
  [100, 'Intensa', '20 min/día'],
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
        <Mascot size={180} bounce />
        <h1 className="brand-big">Animalingo</h1>
        <p className="lead">
          Aprende finanzas personales en 5 minutos al día, con el contenido de <strong>{SHOW.name}</strong>.
        </p>
        <p className="muted small">"{SHOW.tagline}"</p>
        <button className="btn primary wide" onClick={() => setStep(1)}>
          Empezar
        </button>
      </div>
    )
  }

  return (
    <div className="onboard">
      <div className="onboard-top">
        <button className="icon-btn" onClick={() => setStep(step - 1)} aria-label="Atrás">
          ←
        </button>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>
      {step === 1 && (
        <>
          <div className="with-mascot">
            <Mascot size={90} mood="wink" />
            <SpeechBubble>¡Hola, animal! Soy Chanchi 🐷 ¿Qué quieres lograr con tu plata?</SpeechBubble>
          </div>
          <div className="options">
            {GOALS.map(([e, g]) => (
              <button key={g} className={'choice' + (goal === g ? ' selected' : '')} onClick={() => setGoal(g)}>
                <span className="key">{e}</span>
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
          <div className="with-mascot">
            <Mascot size={90} mood="think" />
            <SpeechBubble>¿Cuál será tu meta diaria? Lo importante es la constancia, como el interés compuesto 🐢</SpeechBubble>
          </div>
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
          <div className="with-mascot">
            <Mascot size={90} />
            <SpeechBubble>¿Cómo te llamo?</SpeechBubble>
          </div>
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
            ¡Vamos!
          </button>
        </>
      )}
    </div>
  )
}
