import { claimQuest, today, useStore } from '../state/store'

export function useQuests() {
  const s = useStore((s) => s)
  const xpToday = s.xpByDay[today()] ?? 0
  return [
    { id: 'xp', emoji: '⚡', title: `Gana ${s.dailyGoal} XP`, cur: xpToday, goal: s.dailyGoal, reward: 20 },
    { id: 'lessons', emoji: '📘', title: 'Completa 2 lecciones', cur: s.lessonsToday, goal: 2, reward: 15 },
    { id: 'perfect', emoji: '🎯', title: 'Haz 1 lección perfecta', cur: s.perfectToday, goal: 1, reward: 20 },
  ].map((q) => ({ ...q, done: q.cur >= q.goal, claimed: s.questsClaimed.includes(q.id) }))
}

export function Quests() {
  const quests = useQuests()
  return (
    <div className="card">
      <h3>Misiones del día</h3>
      {quests.map((q) => (
        <div className="quest" key={q.id}>
          <span className="quest-emoji">{q.emoji}</span>
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
            <span className="quest-reward done">✔</span>
          ) : q.done ? (
            <button className="btn small gold" onClick={() => claimQuest(q.id, q.reward)}>
              +{q.reward} 🪙
            </button>
          ) : (
            <span className="quest-reward">🎁</span>
          )}
        </div>
      ))}
    </div>
  )
}
