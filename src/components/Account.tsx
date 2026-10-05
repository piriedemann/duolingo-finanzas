import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { sendEmailCode, signInWithGoogle, signOut, useAccount, verifyEmailCode } from '../lib/account'
import { cloudEnabled } from '../lib/supabase'
import { useStore } from '../state/store'
import { Check, LogOut, MoreHorizontal, User, X } from './Icons'

const HIDE_NUDGE = 'animalingo:hide-save-nudge'
// El login por correo necesita SMTP propio en Supabase (plantilla con código). Se activa con VITE_AUTH_EMAIL=1.
const EMAIL_LOGIN = import.meta.env.VITE_AUTH_EMAIL === '1'

/** Iniciar sesión / estado de la cuenta. Se usa en Perfil y en la bienvenida. */
export function AccountPanel({ returnTo }: { returnTo: string }) {
  const { account, status, error } = useAccount()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  if (!cloudEnabled) {
    return <p className="muted small">Para guardar el progreso en la nube falta configurar Supabase (ver README).</p>
  }

  if (account) {
    const label = account.email ?? account.name ?? 'Tu cuenta'
    const line =
      status === 'syncing'
        ? 'Sincronizando…'
        : status === 'error'
          ? error
          : 'Conectada · tu progreso se guarda solo'
    const tone = status === 'error' ? 'danger-text' : 'muted'
    return (
      <div className="account">
        <div className="account-row">
          <span className="avatar">{label[0].toUpperCase()}</span>
          <div className="grow">
            <strong>{label}</strong>
            <div className={'small account-status ' + tone}>
              {status === 'ok' && <Check className="ok-icon" size={15} strokeWidth={2.75} />}
              <span>{line}</span>
            </div>
          </div>
          <AccountMenu />
        </div>
      </div>
    )
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setErr(null)
    try {
      await fn()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }
  const send = (e: FormEvent) => {
    e.preventDefault()
    void run(async () => {
      await sendEmailCode(email)
      setSent(true)
      setCode('')
    })
  }
  const verify = (e: FormEvent) => {
    e.preventDefault()
    void run(() => verifyEmailCode(email, code))
  }

  return (
    <div className="account">
      <button className="btn wide google" disabled={busy} onClick={() => void run(() => signInWithGoogle(returnTo))}>
        <GoogleMark /> Continuar con Google
      </button>
      {EMAIL_LOGIN && <div className="or">o con tu correo</div>}
      {!EMAIL_LOGIN ? null : !sent ? (
        <form onSubmit={send}>
          <input
            className="search"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@correo.cl"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn primary wide" disabled={busy || !email.includes('@')}>
            Enviarme un código
          </button>
        </form>
      ) : (
        <form onSubmit={verify}>
          <p className="muted small">
            Te enviamos un código a <strong>{email}</strong>. Si llegó como link, ábrelo en este mismo navegador.
          </p>
          <input
            className="search code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={8}
            placeholder="Código"
            value={code}
            autoFocus
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
          <button className="btn primary wide" disabled={busy || code.length < 6}>
            Entrar
          </button>
          <button type="button" className="btn ghost wide" disabled={busy} onClick={() => setSent(false)}>
            Usar otro correo o reenviar
          </button>
        </form>
      )}
      {(err ?? (status === 'error' ? error : null)) && <p className="small danger-text">{err ?? error}</p>}
      <p className="muted small">
        Sin contraseñas. Tu progreso queda en tu cuenta y lo recuperas en cualquier teléfono o computador.{' '}
        <a href="privacidad.html">Política de privacidad</a>
      </p>
    </div>
  )
}

/* El aviso se oculta en todas sus instancias (panel móvil y barra lateral) con un solo clic. */
let nudgeHidden = (() => {
  try {
    return localStorage.getItem(HIDE_NUDGE) === '1'
  } catch {
    return false
  }
})()
const nudgeListeners = new Set<() => void>()
function hideNudge() {
  nudgeHidden = true
  try {
    localStorage.setItem(HIDE_NUDGE, '1')
  } catch {
    /* ignorar */
  }
  nudgeListeners.forEach((l) => l())
}

/** Aviso para quien ya lleva progreso sin cuenta. Se puede ocultar (solo en este dispositivo). */
export function SaveProgressCard() {
  const { account } = useAccount()
  const xp = useStore((s) => s.xp)
  const hidden = useSyncExternalStore(
    (l) => {
      nudgeListeners.add(l)
      return () => {
        nudgeListeners.delete(l)
      }
    },
    () => nudgeHidden,
  )
  if (!cloudEnabled || account || hidden || xp < 30) return null
  return (
    <div className="card save-card">
      <span className="icon-chip">
        <User size={18} />
      </span>
      <div className="grow">
        <div className="card-label">Guarda tu progreso</div>
        <div className="small muted">Inicia sesión para recuperarlo en cualquier teléfono o computador.</div>
      </div>
      <a className="btn small primary" href="#/perfil">
        Entrar
      </a>
      <button className="icon-btn" aria-label="Ocultar" onClick={hideNudge}>
        <X size={16} />
      </button>
    </div>
  )
}

/** Menú "⋯" con las acciones poco frecuentes de la cuenta (cerrar sesión). */
function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <div className="menu-wrap" ref={ref}>
      <button className="icon-btn" aria-label="Opciones de la cuenta" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <MoreHorizontal size={20} />
      </button>
      {open && (
        <div className="menu" role="menu">
          <button
            role="menuitem"
            className="danger-text"
            onClick={() => {
              setOpen(false)
              if (confirm('Tu progreso queda guardado en tu cuenta. Este dispositivo volverá a cero. ¿Cerrar sesión?')) void signOut()
            }}
          >
            <LogOut size={16} /> Cerrar sesión en este dispositivo
          </button>
        </div>
      )}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 2.9-2.2 5.4-4.7 7.1l7.6 5.9c4.4-4.1 6.9-10.1 6.9-17z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.6-5.9c-2.1 1.4-4.8 2.3-8 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  )
}
