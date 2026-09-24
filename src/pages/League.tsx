import { useMemo } from 'react'
import { today, useStore } from '../state/store'

// Rivales ficticios con XP semanal determinístico según la semana
const RIVALS = [
  ['Cata', '🦩'], ['Benja', '🦦'], ['Sofi', '🦄'], ['Nico', '🐧'], ['Vale', '🦜'], ['Tomi', '🐨'],
  ['Javi', '🐼'], ['Martu', '🐙'], ['Diego', '🦖'], ['Isi', '🐬'], ['Rodri', '🦝'], ['Flo', '🐞'],
  ['Maxi', '🦔'], ['Anto', '🐸'],
] as const

function weekStart() {
  const d = new Date()
  const day = (d.getDay() + 6) % 7 // lunes = 0
  d.setDate(d.getDate() - day)
  return d
}

export function weeklyXp(xpByDay: Record<string, number>) {
  const start = weekStart()
  let sum = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    sum += xpByDay[today(d)] ?? 0
  }
  return sum
}

export function useLeague() {
  const xpByDay = useStore((s) => s.xpByDay)
  const name = useStore((s) => s.name)
  return useMemo(() => {
    const start = weekStart()
    const seed = start.getDate() + start.getMonth() * 31
    const dayOfWeek = (new Date().getDay() + 6) % 7
    const progress = (dayOfWeek + new Date().getHours() / 24 + 0.3) / 7
    const rivals = RIVALS.map(([n, e], i) => {
      const base = ((seed * (i + 3) * 7919) % 260) + 20
      return { name: n, emoji: e, xp: Math.round(base * progress), me: false }
    })
    const me = { name: name || 'Tú', emoji: '🐷', xp: weeklyXp(xpByDay), me: true }
    return [...rivals, me].sort((a, b) => b.xp - a.xp)
  }, [xpByDay, name])
}

export function League() {
  const list = useLeague()
  const myPos = list.findIndex((x) => x.me) + 1
  const daysLeft = 7 - ((new Date().getDay() + 6) % 7)
  return (
    <div className="page">
      <div className="league-head">
        <div className="league-badge">🥉</div>
        <h1>Liga Hormiga</h1>
        <p className="muted">
          Los 5 primeros suben a la <strong>Liga Ardilla</strong>. Quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'}.
        </p>
      </div>
      <div className="card league-list">
        {list.map((x, i) => (
          <div key={x.name + i}>
            {i === 5 && <div className="zone up">⬆ ZONA DE ASCENSO ⬆</div>}
            {i === list.length - 3 && <div className="zone down">⬇ ZONA DE DESCENSO ⬇</div>}
            <div className={'league-row' + (x.me ? ' me' : '')}>
              <span className={'rank' + (i < 3 ? ' top' + i : '')}>{i + 1}</span>
              <span className="avatar">{x.emoji}</span>
              <span className="grow">{x.me ? <strong>{x.name}</strong> : x.name}</span>
              <span className="muted">{x.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
      <p className="muted small center">Estás en el puesto #{myPos}. ¡Completa lecciones para subir!</p>
    </div>
  )
}
