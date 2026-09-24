export type Mood = 'happy' | 'sad' | 'wow' | 'think' | 'wink'

/** Chanchi, el chanchito de ahorro que guía la app */
export function Mascot({ mood = 'happy', size = 120, bounce = false }: { mood?: Mood; size?: number; bounce?: boolean }) {
  const eyes =
    mood === 'wink' ? (
      <>
        <path d="M44 52 q6 -6 12 0" stroke="#3c3c3c" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="52" r="6" fill="#3c3c3c" />
      </>
    ) : mood === 'sad' ? (
      <>
        <path d="M43 50 q7 5 14 0" stroke="#3c3c3c" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M77 50 q7 5 14 0" stroke="#3c3c3c" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M92 58 q3 8 0 12 q-3 -4 0 -12" fill="#7ad0ff" />
      </>
    ) : (
      <>
        <circle cx="50" cy="52" r={mood === 'wow' ? 8 : 6.5} fill="#3c3c3c" />
        <circle cx="84" cy="52" r={mood === 'wow' ? 8 : 6.5} fill="#3c3c3c" />
        <circle cx="52.5" cy="49.5" r="2.2" fill="#fff" />
        <circle cx="86.5" cy="49.5" r="2.2" fill="#fff" />
      </>
    )
  const mouth =
    mood === 'sad' ? (
      <path d="M58 92 q9 -7 18 0" stroke="#3c3c3c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    ) : mood === 'wow' ? (
      <ellipse cx="67" cy="93" rx="6" ry="7" fill="#8b2e3c" />
    ) : mood === 'think' ? (
      <path d="M59 92 h16" stroke="#3c3c3c" strokeWidth="3.5" strokeLinecap="round" />
    ) : (
      <path d="M55 89 q12 12 24 0" stroke="#3c3c3c" strokeWidth="3.5" fill="#8b2e3c" strokeLinecap="round" />
    )
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 134 134"
      className={bounce ? 'mascot bounce' : 'mascot'}
      aria-label="Chanchi, la mascota"
      role="img"
    >
      {/* sombra */}
      <ellipse cx="67" cy="128" rx="38" ry="5" fill="rgba(0,0,0,.08)" />
      {/* patitas */}
      <rect x="36" y="104" width="16" height="20" rx="6" fill="#f28fb0" />
      <rect x="82" y="104" width="16" height="20" rx="6" fill="#f28fb0" />
      {/* orejas */}
      <path d="M26 30 L36 6 L52 26 Z" fill="#f28fb0" stroke="#e0709a" strokeWidth="3" strokeLinejoin="round" />
      <path d="M108 30 L98 6 L82 26 Z" fill="#f28fb0" stroke="#e0709a" strokeWidth="3" strokeLinejoin="round" />
      {/* cuerpo */}
      <circle cx="67" cy="66" r="48" fill="#ffb3cb" stroke="#f28fb0" strokeWidth="3" />
      {/* ranura de moneda */}
      <rect x="54" y="20" width="26" height="5" rx="2.5" fill="#e0709a" />
      {mood === 'wow' || mood === 'happy' ? (
        <g className="coin">
          <circle cx="67" cy="10" r="8" fill="#ffc800" stroke="#e0a800" strokeWidth="2" />
          <text x="67" y="14" fontSize="10" textAnchor="middle" fill="#a67c00" fontWeight="900">$</text>
        </g>
      ) : null}
      {/* mejillas */}
      <circle cx="36" cy="72" r="7" fill="#ff8fb3" opacity=".7" />
      <circle cx="98" cy="72" r="7" fill="#ff8fb3" opacity=".7" />
      {eyes}
      {/* hocico */}
      <ellipse cx="67" cy="74" rx="17" ry="12" fill="#ff8fb3" stroke="#e0709a" strokeWidth="2.5" />
      <ellipse cx="61" cy="74" rx="3" ry="4.5" fill="#c2527a" />
      <ellipse cx="73" cy="74" rx="3" ry="4.5" fill="#c2527a" />
      {mouth}
      {mood === 'think' && (
        <g>
          <circle cx="116" cy="24" r="4" fill="#e5e5e5" />
          <circle cx="124" cy="12" r="6" fill="#e5e5e5" />
        </g>
      )}
    </svg>
  )
}

export function SpeechBubble({ children }: { children: React.ReactNode }) {
  return <div className="bubble">{children}</div>
}
