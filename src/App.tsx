import { useEffect, useState } from 'react'
import { ACHIEVEMENTS, pendingToasts, today, useStore } from './state/store'
import { go, useHashRoute } from './lib/util'
import { Learn } from './pages/Learn'
import { LessonPage, PracticePage, QuizPage } from './pages/LessonPage'
import { EpisodeDetail, Episodes } from './pages/Episodes'
import { Tools } from './pages/Tools'
import { League, useLeague } from './pages/League'
import { Profile } from './pages/Profile'
import { Onboarding } from './pages/Onboarding'
import { Quests } from './components/Quests'
import { Calculator, ChevronRight, Coins, Flame, Headphones, Heart, Home, RotateCcw, Trophy, User, Zap } from './components/Icons'
import { sfx } from './lib/sound'

const NAV = [
  { id: 'aprender', label: 'Aprender', Icon: Home },
  { id: 'episodios', label: 'Episodios', Icon: Headphones },
  { id: 'herramientas', label: 'Herramientas', Icon: Calculator },
  { id: 'liga', label: 'Liga', Icon: Trophy },
  { id: 'perfil', label: 'Perfil', Icon: User },
]

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">A</span>
      <span className="brand-text">
        Animalingo
        <small>con Animales Financieros</small>
      </span>
    </span>
  )
}

export default function App() {
  const route = useHashRoute()
  const onboarded = useStore((s) => s.onboarded)
  const [page, arg] = route

  if (!onboarded) return <Onboarding />
  if (page === 'leccion' && arg) return <LessonPage id={arg} key={arg} />
  if (page === 'practica') return <PracticePage />
  if (page === 'quiz' && arg) return <QuizPage id={arg} key={arg} />

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
        <a href="#/aprender" className="brand-link">
          <Brand />
        </a>
        <nav>
          {NAV.map(({ id, label, Icon }) => (
            <a key={id} href={'#/' + id} className={'nav-item' + (active === id ? ' active' : '')}>
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-foot muted small">Prototipo educativo basado en el podcast Animales Financieros. No es asesoría financiera.</div>
      </aside>
      <div className="main-col">
        <div className="mobile-top">
          <Brand />
          <TopStats />
        </div>
        <main className="content">{content}</main>
      </div>
      <aside className="rightbar">
        <TopStats />
        <DailyGoal />
        <PracticeCard />
        <Quests />
        <LeagueMini />
      </aside>
      <nav className="bottomnav">
        {NAV.map(({ id, label, Icon }) => (
          <a key={id} href={'#/' + id} className={'bn-item' + (active === id ? ' active' : '')}>
            <Icon size={21} strokeWidth={1.8} />
            <small>{label}</small>
          </a>
        ))}
      </nav>
      <AchievementToast />
    </div>
  )
}

function TopStats() {
  const s = useStore((s) => s)
  const activeToday = s.lastActiveDay === today()
  return (
    <div className="topstats">
      <span className={'ts' + (activeToday ? ' on-streak' : '')} title="Racha de días">
        <Flame size={17} /> {s.streak}
      </span>
      <span className="ts ts-gold" title="Lucas">
        <Coins size={17} /> {s.lucas}
      </span>
      <span className="ts ts-red" title="Vidas">
        <Heart size={17} /> {s.hearts}
      </span>
      <span className="ts ts-blue" title="XP total">
        <Zap size={17} /> {s.xp}
      </span>
    </div>
  )
}

function DailyGoal() {
  const s = useStore((s) => s)
  const xp = s.xpByDay[today()] ?? 0
  const p = Math.min(1, xp / s.dailyGoal)
  const R = 26
  const C = 2 * Math.PI * R
  return (
    <div className="card goal-card">
      <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`Meta diaria ${xp} de ${s.dailyGoal} XP`}>
        <circle cx="32" cy="32" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
          transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset .6s' }}
        />
        <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--ink)">
          {Math.round(p * 100)}%
        </text>
      </svg>
      <div>
        <div className="card-label">Meta diaria</div>
        <div className="card-value">
          {xp} <span className="muted">/ {s.dailyGoal} XP</span>
        </div>
        {p >= 1 && <div className="ok-text small">Cumplida hoy</div>}
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
      <span className="icon-chip">
        <RotateCcw size={18} />
      </span>
      <div className="grow">
        <div className="card-label">Repaso</div>
        <div className="small muted">{mistakes > 0 ? `${mistakes} ejercicios por reforzar` : 'Refresca lo aprendido'}</div>
      </div>
      <ChevronRight size={18} className="muted" />
    </button>
  )
}

function LeagueMini() {
  const list = useLeague()
  const pos = list.findIndex((x) => x.me)
  const around = list.slice(Math.max(0, pos - 1), pos + 2)
  return (
    <a className="card league-mini" href="#/liga">
      <div className="card-label">Liga semanal · Bronce</div>
      {around.map((x) => (
        <div key={x.name} className={'league-row small' + (x.me ? ' me' : '')}>
          <span className="rank">{list.indexOf(x) + 1}</span>
          <span className="avatar">{x.name[0]}</span>
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
        <div className="muted small">Logro desbloqueado</div>
        <strong>{a.title}</strong>
      </div>
    </div>
  )
}
