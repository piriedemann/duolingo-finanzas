import { ACHIEVEMENTS, buyFreeze, refillHearts, resetState, setState, today, useStore, MAX_HEARTS } from '../state/store'
import { ALL_LESSONS } from '../data/units'
import { Coins, Crown, Flame, Heart, Snowflake, Target, Zap, BookOpen } from '../components/Icons'

export function Profile() {
  const s = useStore((s) => s)
  const done = Object.keys(s.completed).length
  // últimos 7 días de XP
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { label: d.toLocaleDateString('es-CL', { weekday: 'short' }).slice(0, 2), xp: s.xpByDay[today(d)] ?? 0 }
  })
  const maxXp = Math.max(s.dailyGoal, ...days.map((d) => d.xp))
  return (
    <div className="page">
      <div className="profile-head">
        <div className="profile-avatar">{(s.name || 'A')[0].toUpperCase()}</div>
        <div>
          <h1>{s.name || 'Animal financiero'}</h1>
          <p className="muted">Meta: {s.goal || 'aprender'} · {s.dailyGoal} XP diarios</p>
        </div>
      </div>

      <h2 className="section-title">Estadísticas</h2>
      <div className="stats-grid">
        <div className="stat-card"><span><Flame size={22} /></span><div><strong>{s.streak}</strong><div className="muted small">Racha actual</div></div></div>
        <div className="stat-card"><span><Zap size={22} /></span><div><strong>{s.xp}</strong><div className="muted small">XP total</div></div></div>
        <div className="stat-card"><span><BookOpen size={22} /></span><div><strong>{done}/{ALL_LESSONS.length}</strong><div className="muted small">Lecciones</div></div></div>
        <div className="stat-card"><span><Crown size={22} /></span><div><strong>{s.perfectLessons}</strong><div className="muted small">Perfectas</div></div></div>
      </div>

      <div className="card">
        <h3>XP de la semana</h3>
        <div className="week-bars" role="img" aria-label="XP por día en los últimos 7 días">
          {days.map((d, i) => (
            <div key={i} className="week-col" title={`${d.xp} XP`}>
              <span className="week-val">{d.xp || ''}</span>
              <div className="week-bar" style={{ height: `${(d.xp / maxXp) * 100}%` }} />
              <span className="week-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="section-title">Tienda <span className="muted small"><Coins size={15} /> {s.lucas} Lucas disponibles</span></h2>
      <div className="shop">
        <div className="shop-item">
          <span className="icon-chip"><Heart size={18} /></span>
          <div className="grow"><strong>Recargar vidas</strong><div className="muted small">Vuelve a {MAX_HEARTS} vidas</div></div>
          <button className="btn small gold" disabled={s.lucas < 50 || s.hearts >= MAX_HEARTS} onClick={() => refillHearts(50)}>50 Lucas</button>
        </div>
        <div className="shop-item">
          <span className="icon-chip"><Snowflake size={18} /></span>
          <div className="grow"><strong>Protector de racha</strong><div className="muted small">Salva tu racha si un día no practicas ({s.streakFreezes}/2)</div></div>
          <button className="btn small gold" disabled={s.lucas < 100 || s.streakFreezes >= 2} onClick={() => buyFreeze(100)}>100 Lucas</button>
        </div>
      </div>

      <h2 className="section-title">Logros</h2>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const got = s.achievements.includes(a.id)
          return (
            <div key={a.id} className={'ach' + (got ? ' got' : '')}>
              <span className="ach-emoji">{got ? a.emoji : <Target size={22} />}</span>
              <strong>{a.title}</strong>
              <span className="muted small">{a.desc}</span>
            </div>
          )
        })}
      </div>

      <h2 className="section-title">Ajustes</h2>
      <div className="card settings">
        <label className="toggle">
          <span>Sonidos</span>
          <input type="checkbox" checked={s.sound} onChange={(e) => setState((st) => ({ ...st, sound: e.target.checked }))} />
        </label>
        <label className="toggle">
          <span>Modo demo: desbloquear todas las lecciones</span>
          <input type="checkbox" checked={s.unlockAll} onChange={(e) => setState((st) => ({ ...st, unlockAll: e.target.checked }))} />
        </label>
        <label className="toggle">
          <span>Meta diaria</span>
          <select value={s.dailyGoal} onChange={(e) => setState((st) => ({ ...st, dailyGoal: Number(e.target.value) }))}>
            <option value={10}>Liviano · 10 XP</option>
            <option value={30}>Constante · 30 XP</option>
            <option value={50}>Comprometido · 50 XP</option>
            <option value={100}>Intensivo · 100 XP</option>
          </select>
        </label>
        <button
          className="btn ghost danger-text"
          onClick={() => {
            if (confirm('¿Borrar todo tu progreso?')) resetState()
          }}
        >
          Reiniciar progreso
        </button>
      </div>
    </div>
  )
}
