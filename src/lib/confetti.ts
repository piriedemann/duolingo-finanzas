/** Confeti liviano con canvas, sin dependencias */
export function confetti(duration = 2200) {
  const c = document.createElement('canvas')
  c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999'
  c.width = innerWidth
  c.height = innerHeight
  document.body.appendChild(c)
  const g = c.getContext('2d')!
  const colors = ['#58cc02', '#ffc800', '#ff4b4b', '#1cb0f6', '#ce82ff', '#ff9600']
  const ps = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200,
    y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -14 - 4,
    r: Math.random() * 6 + 4,
    a: Math.random() * Math.PI,
    va: (Math.random() - 0.5) * 0.3,
    col: colors[Math.floor(Math.random() * colors.length)],
  }))
  const t0 = performance.now()
  const frame = (t: number) => {
    g.clearRect(0, 0, c.width, c.height)
    for (const p of ps) {
      p.vy += 0.35
      p.x += p.vx
      p.y += p.vy
      p.a += p.va
      g.save()
      g.translate(p.x, p.y)
      g.rotate(p.a)
      g.fillStyle = p.col
      g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2)
      g.restore()
    }
    if (t - t0 < duration) requestAnimationFrame(frame)
    else c.remove()
  }
  requestAnimationFrame(frame)
}
