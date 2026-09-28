import { useLeague } from '../lib/leaderboard'

const PROMOTE = 5 // los 5 primeros suben
const MIN_FOR_ZONES = 8 // con menos jugadores las zonas no tienen sentido

export function League() {
  const { list, status, refresh } = useLeague()
  const myPos = list.findIndex((x) => x.me) + 1
  const daysLeft = 7 - ((new Date().getDay() + 6) % 7)
  const zones = list.length >= MIN_FOR_ZONES
  return (
    <div className="page">
      <div className="league-head">
        <div className="card-label">Liga semanal</div>
        <h1>Bronce</h1>
        <p className="muted">
          Los {PROMOTE} primeros suben a <strong>Plata</strong>. Quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'}.
        </p>
      </div>

      {status === 'local' && (
        <div className="card muted small">
          La liga está en modo local: falta configurar Supabase (ver README). Solo ves tu propio XP.
        </div>
      )}
      {status === 'error' && (
        <div className="card muted small">
          No pudimos cargar la liga.{' '}
          <button className="btn small ghost" onClick={() => void refresh()}>
            Reintentar
          </button>
        </div>
      )}

      <div className="card league-list">
        {list.map((x, i) => (
          <div key={x.id}>
            {zones && i === PROMOTE && <div className="zone up">Zona de ascenso</div>}
            {zones && i === list.length - 3 && <div className="zone down">Zona de descenso</div>}
            <div className={'league-row' + (x.me ? ' me' : '')}>
              <span className={'rank' + (i < 3 ? ' top' + i : '')}>{i + 1}</span>
              <span className="avatar">{x.name[0]}</span>
              <span className="grow">{x.me ? <strong>{x.name}</strong> : x.name}</span>
              <span className="muted">{x.weekXp} XP</span>
            </div>
          </div>
        ))}
        {status === 'loading' && <div className="muted small center">Cargando liga…</div>}
      </div>

      {status === 'ok' && list.length === 1 ? (
        <p className="muted small center">Eres la primera persona esta semana. Comparte el link para competir con tu equipo.</p>
      ) : (
        <p className="muted small center">
          Estás en el puesto #{myPos} de {list.length}. Cada lección suma XP a tu semana.
        </p>
      )}
      {status === 'ok' && (
        <p className="muted small center">
          Jugadores reales de esta semana. Tu nombre y XP son públicos para quienes entren a la liga.
        </p>
      )}
    </div>
  )
}
