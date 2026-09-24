import { claimQuest, today, useStore } from '../state/store'
import { BookOpen, Check, Target, Zap } from './Icons'

export function useQuests() {
  const s = useStore((s) => s)
  const xpToday = s.xpByDay[today()] ?? 0
  return [
    { id: 'xp', Icon: Zap, title: `Gana ${s.dailyGoal} XP`, cur: xpToday, goal: s.dailyGoal, reward: 20 },
    { id: 'lessons', Icon: BookOpen, title: 'Completa 2 lecciones', cur: s.lessonsToday, goal: 2, reward: 15 },
    { id: 'perfect', Icon: Target, title: 'Haz 1 lección perfecta', cur: s.perfectToday, goal: 1, reward: 20 },
  ].map((q) => ({ ...q, done: q.cur >= q.goal, claimed: s.questsClaimed.includes(q.id) }))
}

export function Quests() {
  const quests = useQuests()
  return (
    <div className="card">
      <div className="card-label">Misiones de hoy</div>
      {quests.map((q) => (
        <div className="quest" key={q.id}>
          <span className="quest-emoji"><q.Icon size={18} /></span>
          <div className="quest-main">
            <div className="quest-title">{q.title}</div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${Math.min(100, (q.cur / q.goal) * 100)}%` }} />
              <span className="bar-label">
                {Math.min(q.cur, q.goal)} / {q.goal}
              </span>
            </div>
          </div>
          {q.claimed ? (
            <span className="quest-reward done"><Check size={18} /></span>
          ) : q.done ? (
            <button className="btn small gold" onClick={() => claimQuest(q.id, q.reward)}>
              +{q.reward} Lucas
            </button>
          ) : (
            <span className="quest-reward muted small">+{q.reward}</span>
          )}
        </div>
      ))}
    </div>
  )
}
