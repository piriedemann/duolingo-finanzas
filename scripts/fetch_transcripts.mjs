/**
 * Descarga los transcripts de los episodios desde el Estudio de Animales Financieros
 * (mundo.animalesfinancieros.com, app Rails con login por email+password) y los guarda
 * LOCALMENTE en transcripts/ (ignorado por git: es contenido privado, no se publica).
 *
 * Uso:  AF_EMAIL=... AF_PASSWORD=... NODE_USE_ENV_PROXY=1 node scripts/fetch_transcripts.mjs [--force]
 *
 * Flujo:
 *   1. GET /session/new → cookie de sesión + csrf-token
 *   2. POST /session (authenticity_token, email, password) → 302 a /studio
 *   3. GET /api/internal/episodes?page=N → catálogo paginado
 *   4. GET /api/internal/episodes/:id/transcript → { body, source, ... } (204 si no hay)
 *
 * Salida: transcripts/index.json [{number,title,guest,date,file,chars}] + transcripts/<NNN>-<slug>.txt
 * Solo hace lecturas (GET) después del login.
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE = 'https://mundo.animalesfinancieros.com'
const OUT = path.join(process.cwd(), 'transcripts')
const { AF_EMAIL, AF_PASSWORD } = process.env
if (!AF_EMAIL || !AF_PASSWORD) {
  console.error('Faltan AF_EMAIL / AF_PASSWORD')
  process.exit(1)
}
const force = process.argv.includes('--force')

const jar = new Map()
const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ')
function storeCookies(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [kv] = c.split(';')
    const i = kv.indexOf('=')
    jar.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim())
  }
}
async function req(url, opts = {}) {
  const res = await fetch(BASE + url, {
    redirect: 'manual',
    ...opts,
    headers: { cookie: cookieHeader(), ...(opts.headers ?? {}) },
  })
  storeCookies(res)
  return res
}
const api = async (p) => {
  for (let attempt = 0; ; attempt++) {
    const res = await req('/api/internal' + p, { headers: { accept: 'application/json' } })
    if (res.status === 204 || res.status === 404) return null
    if (res.ok) return res.json()
    if (attempt >= 3) throw new Error(`${p} → HTTP ${res.status}`)
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt))
  }
}

const slug = (t) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

async function login() {
  const page = await (await req('/session/new')).text()
  const token = page.match(/name="csrf-token" content="([^"]+)"/)?.[1]
  if (!token) throw new Error('No encontré csrf-token en /session/new')
  const res = await req('/session', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ authenticity_token: token, email: AF_EMAIL, password: AF_PASSWORD }),
  })
  const loc = res.headers.get('location') ?? ''
  if (res.status !== 302 || loc.includes('/session')) throw new Error(`Login falló (HTTP ${res.status} → ${loc})`)
}

async function main() {
  await login()
  console.log('✓ login')
  fs.mkdirSync(OUT, { recursive: true })

  const episodes = []
  for (let page = 1; ; page++) {
    const d = await api(`/episodes?page=${page}`)
    episodes.push(...d.items)
    if (!d.pagination?.next) break
  }
  console.log(`✓ ${episodes.length} episodios en el catálogo`)

  const index = []
  let missing = 0
  for (const ep of episodes) {
    const n = ep.number
    const file = `${n != null ? String(n).padStart(3, '0') : 'x'}-${slug(ep.title)}.txt`
    const fp = path.join(OUT, file)
    const guest = (ep.guests ?? []).map((g) => g.name ?? g).filter(Boolean).join(', ') || null
    const meta = { number: n, title: ep.title, guest, date: ep.publishedOn ?? null, file }
    if (!force && fs.existsSync(fp)) {
      index.push({ ...meta, chars: fs.statSync(fp).size })
      continue
    }
    const t = await api(`/episodes/${ep.id}/transcript`)
    const body = t?.body ?? t?.text ?? t?.content
    if (!body) {
      missing++
      continue
    }
    fs.writeFileSync(fp, body)
    index.push({ ...meta, chars: body.length })
    process.stdout.write(`  #${n} ${body.length} chars\n`)
  }
  index.sort((a, b) => (a.number ?? 1e9) - (b.number ?? 1e9))
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1))
  console.log(`✓ ${index.length} transcripts guardados, ${missing} episodios sin transcript`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
