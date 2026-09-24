import { useEffect, useState } from 'react'
import { ACHIEVEMENTS, pendingToasts, today, useStore } from './state/store'
import { go, useHashRoute } from './lib/util'
import { Learn } from './pages/Learn'
import { LessonPage, PracticePage } from './pages/LessonPage'
import { EpisodeDetail, Episodes } from './pages/Episodes'
import { Tools } from './pages/Tools'
import { League, useLeague } from './pages/League'
import { Profile } from './pages/Profile'
import { Onboarding } from './pages/Onboarding'
import { Quests } from './components/Quests'
import { Mascot } from './components/Mascot'
import { sfx } from './lib/sound'

const NAV = [
  { id: 'aprender', label: 'Aprender', icon: '🏠' },
  { id: 'episodios', label: 'Episodios', icon: '🎧' },
  { id: 'herramientas', label: 'Herramientas', icon: '🧮' },
  { id: 'liga', label: 'Liga', icon: '🏆' },
  { id: 'perfil', label: 'Perfil', icon: '🐷' },
]

export default function App() {
  const route = useHashRoute()
  const onboarded = useStore((s) => s.onboarded)
  const [page, arg] = route

  if (!onboarded) return <Onboarding />
  if (page === 'leccion' && arg) return <LessonPage id={arg} key={arg} />
  if (page === 'practica') return <PracticePage />

  let content: React.ReactNode
  switch (page) {
    case 'episodios':
      content = <Episodes />
      break
    case 'episodio':
      content = <EpisodeDetail id={arg} />
      break
    case 'herramientas':
      content = <Tools id={arg} />
      break
    case 'liga':
      content = (
        <>
          <League />
          <div className="mobile-only" style={{ marginTop: 16 }}>
            <Quests />
          </div>
        </>
      )
      break
    case 'perfil':
      content = <Profile />
      break
    default:
      content = (
        <>
          <div className="mobile-only mobile-panel">
            <DailyGoal />
            <PracticeCard />
          </div>
          <Learn />
        </>
      )
  }
  const active = page === 'episodio' ? 'episodios' : page

  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="#/aprender">
          <Mascot size={40} /> <span>animalingo</span>
        </a>
        <nav>
          {NAV.map((n) => (
            <a key={n.id} href={'#/' + n.id} className={'nav-item' + (active === n.id ? ' active' : '')}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-foot muted small">
          Contenido inspirado en el podcast <strong>Animales Financieros</strong>. Prototipo educativo.
        </div>
      </aside>
      <div className="main-col">
        <TopStats />
        <main className="content">{content}</main>
      </div>
      <aside className="rightbar">
        <TopStats inline />
        <DailyGoal />
        <PracticeCard />
        <Quests />
        <LeagueMini />
      </aside>
      <nav className="bottomnav">
        {NAV.map((n) => (
          <a key={n.id} href={'#/' + n.id} className={'bn-item' + (active === n.id ? ' active' : '')}>
            <span>{n.icon}</span>
            <small>{n.label}</small>
          </a>
        ))}
      </nav>
      <AchievementToast />
    </div>
  )
}

function TopStats({ inline }: { inline?: boolean }) {
  const s = useStore((s) => s)
  const activeToday = s.lastActiveDay === today()
  return (
    <div className={inline ? 'topstats inline' : 'topstats'}>
      <span className="ts" title="Racha">
        <span className={activeToday ? '' : 'grey'}>🔥</span> <b className={activeToday ? 'orange-text' : 'muted'}>{s.streak}</b>
      </span>
      <span className="ts" title="Lucas">
        🪙 <b className="gold-text">{s.lucas}</b>
      </span>
      <span className="ts" title="Vidas">
        ❤️ <b className="red-text">{s.hearts}</b>
      </span>
      <span className="ts" title="XP total">
        ⚡ <b className="blue-text">{s.xp}</b>
      </span>
    </div>
  )
}

function DailyGoal() {
  const s = useStore((s) => s)
  const xp = s.xpByDay[today()] ?? 0
  const p = Math.min(1, xp / s.dailyGoal)
  const R = 34
  const C = 2 * Math.PI * R
  return (
    <div className="card goal-card">
      <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`Meta diaria ${xp} de ${s.dailyGoal} XP`}>
        <circle cx="42" cy="42" r={R} fill="none" stroke="var(--line)" strokeWidth="9" />
        <circle
          cx="42"
          cy="42"
          r={R}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
          transform="rotate(-90 42 42)"
          style={{ transition: 'stroke-dashoffset .6s' }}
        />
        <text x="42" y="48" textAnchor="middle" fontSize="18">
          {p >= 1 ? '🏆' : '⚡'}
        </text>
      </svg>
      <div>
        <h3>Meta diaria</h3>
        <div className="muted">
          {xp} / {s.dailyGoal} XP
        </div>
        {p >= 1 && <div className="green-text small">¡Meta cumplida! 🎉</div>}
      </div>
    </div>
  )
}

function PracticeCard() {
  const mistakes = useStore((s) => s.mistakes.length)
  const any = useStore((s) => Object.keys(s.completed).length > 0)
  if (!any) return null
  return (
    <button className="card practice-card" onClick={() => go('practica')}>
      <span className="big-animal">🏋️</span>
      <div>
        <h3>Practicar</h3>
        <div className="muted small">{mistakes > 0 ? `Repasa tus ${mistakes} errores y recupera ❤️` : 'Repaso rápido para no olvidar'}</div>
      </div>
    </button>
  )
}

function LeagueMini() {
  const list = useLeague()
  const pos = list.findIndex((x) => x.me)
  const around = list.slice(Math.max(0, pos - 1), pos + 2)
  return (
    <a className="card league-mini" href="#/liga">
      <h3>🥉 Liga Hormiga</h3>
      {around.map((x) => (
        <div key={x.name} className={'league-row small' + (x.me ? ' me' : '')}>
          <span className="rank">{list.indexOf(x) + 1}</span>
          <span className="avatar">{x.emoji}</span>
          <span className="grow">{x.name}</span>
          <span className="muted">{x.xp} XP</span>
        </div>
      ))}
    </a>
  )
}

function AchievementToast() {
  const ach = useStore((s) => s.achievements)
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (pendingToasts.length && !toast) {
      const id = pendingToasts.shift()!
      setToast(id)
      sfx.finish()
      const t = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(t)
    }
  }, [ach, toast])
  const a = ACHIEVEMENTS.find((x) => x.id === toast)
  if (!a) return null
  return (
    <div className="toast" onClick={() => setToast(null)}>
      <span className="toast-emoji">{a.emoji}</span>
      <div>
        <div className="muted small">¡Logro desbloqueado!</div>
        <strong>{a.title}</strong>
      </div>
    </div>
  )
}
