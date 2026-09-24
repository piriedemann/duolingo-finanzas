import { useEffect, useState } from 'react'

export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr]
  let r = seed ?? Math.random() * 1e9
  const rand = () => {
    r = (r * 9301 + 49297) % 233280
    return r / 233280
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor((seed === undefined ? Math.random() : rand()) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const clp = (n: number) =>
  '$' + Math.round(n).toLocaleString('es-CL', { maximumFractionDigits: 0 })

export const fmtNum = (n: number, unit?: string) => {
  if (unit === '$') return clp(n)
  const s = n.toLocaleString('es-CL', { maximumFractionDigits: 2 })
  if (!unit) return s
  if (unit === '%') return s + '%'
  return `${s} ${unit}`
}

/** Router mínimo basado en hash, compatible con GitHub Pages */
export function useHashRoute(): string[] {
  const get = () => (window.location.hash.replace(/^#\/?/, '') || 'aprender').split('/')
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const on = () => {
      setRoute(get())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const go = (path: string) => {
  window.location.hash = '/' + path
}

/** Renderiza **negritas** simples */
export function richText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
  )
}
