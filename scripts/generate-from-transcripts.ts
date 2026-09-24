/**
 * Convierte transcripts del podcast en contenido para la app:
 * resumen, ideas clave, categoría y un quiz por episodio.
 *
 * Entrada:  transcripts/index.json  +  transcripts/<archivo>.txt
 *           (index: [{ number, title, guest, file, ... }])
 * Salida:   src/data/generated/episodes.json (mismo formato que src/data/episodes.json)
 *           src/data/generated/quizzes.json   ({ [episodeId]: Exercise[] })
 *
 * Uso:  ANTHROPIC_API_KEY=... node scripts/generate-from-transcripts.ts [--only 70,92] [--force]
 * Es incremental: salta episodios ya generados salvo --force.
 */
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'src/data/generated')
const EP_OUT = path.join(OUT_DIR, 'episodes.json')
const QZ_OUT = path.join(OUT_DIR, 'quizzes.json')

const CATEGORIES = [
  'ahorro', 'presupuesto', 'deudas', 'inversion', 'interes_compuesto', 'mentalidad',
  'carrera_ingresos', 'emprendimiento', 'jubilacion', 'vivienda', 'seguros_riesgo', 'cripto', 'otros',
] as const

const Concept = z.object({ type: z.literal('concept'), title: z.string(), body: z.string(), emoji: z.string() })
const MC = z.object({ type: z.literal('mc'), prompt: z.string(), options: z.array(z.string()), answer: z.number().int(), explain: z.string() })
const TF = z.object({ type: z.literal('tf'), statement: z.string(), answer: z.boolean(), explain: z.string() })
const Fill = z.object({ type: z.literal('fill'), sentence: z.string(), options: z.array(z.string()), answer: z.number().int(), explain: z.string() })
const Match = z.object({ type: z.literal('match'), prompt: z.string(), pairs: z.array(z.array(z.string())) })
const Order = z.object({ type: z.literal('order'), prompt: z.string(), items: z.array(z.string()), explain: z.string() })

const EpisodeContent = z.object({
  summary: z.string(),
  takeaways: z.array(z.string()),
  category: z.enum(CATEGORIES),
  exercises: z.array(z.union([Concept, MC, TF, Fill, Match, Order])),
})
type EpisodeContent = z.infer<typeof EpisodeContent>

const SYSTEM = fs.readFileSync(path.join(ROOT, 'research/CONTENT_BRIEF.md'), 'utf8') + `

Tarea: recibes el transcript completo de un episodio del podcast Animales Financieros.
Devuelve:
- summary: 2-3 frases en español sobre de qué trata el episodio.
- takeaways: 4-6 ideas clave accionables, tal como se discuten en el episodio.
- category: la categoría principal.
- exercises: 7-9 ejercicios. Empieza con 1 "concept" con la gran idea del episodio.
  Mezcla mc, tf, fill, match (3-4 pares [izquierda, derecha]) y order (3-5 pasos en orden correcto).
  "fill" usa exactamente un "___". "answer" es el índice (desde 0) de la opción correcta.
  Todo debe salir de lo que efectivamente se dice en el transcript: no inventes datos ni citas.
  Puedes citar textualmente frases breves del episodio si están en el transcript.`

function validate(c: EpisodeContent): string[] {
  const errs: string[] = []
  c.exercises.forEach((e, i) => {
    if ((e.type === 'mc' || e.type === 'fill') && (e.answer < 0 || e.answer >= e.options.length)) errs.push(`#${i} answer fuera de rango`)
    if (e.type === 'fill' && e.sentence.split('___').length !== 2) errs.push(`#${i} fill sin un único ___`)
    if (e.type === 'match' && e.pairs.some((p) => p.length !== 2)) errs.push(`#${i} par inválido`)
  })
  return errs
}

const readJson = <T,>(p: string, fallback: T): T => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback)

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const onlyArg = args[args.indexOf('--only') + 1]
  const only = args.includes('--only') ? new Set(onlyArg.split(',')) : null

  const index = readJson<{ number: number | null; title: string; guest?: string | null; date?: string | null; file: string }[]>(
    path.join(ROOT, 'transcripts/index.json'),
    [],
  )
  if (!index.length) throw new Error('No hay transcripts/index.json')
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const episodes = readJson<Record<string, unknown>[]>(EP_OUT, [])
  const quizzes = readJson<Record<string, unknown>>(QZ_OUT, {})
  const client = new Anthropic()

  for (const ep of index) {
    const id = String(ep.number ?? ep.file.replace(/\.txt$/, ''))
    if (only && !only.has(id)) continue
    if (!force && quizzes[id]) continue
    const transcript = fs.readFileSync(path.join(ROOT, 'transcripts', ep.file), 'utf8')
    console.log(`→ #${id} ${ep.title} (${transcript.length} chars)`)

    try {
      const response = await client.messages.parse({
        model: 'claude-opus-5',
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium', format: zodOutputFormat(EpisodeContent) },
        // el brief es igual en cada llamada: se cachea
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [
          {
            role: 'user',
            content: `Episodio #${ep.number ?? '?'}: "${ep.title}"${ep.guest ? ` con ${ep.guest}` : ''}\n\n<transcript>\n${transcript}\n</transcript>`,
          },
        ],
      })
      if (response.stop_reason === 'refusal' || !response.parsed_output) {
        console.warn(`  ✗ sin resultado (${response.stop_reason})`)
        continue
      }
      const c = response.parsed_output
      const errs = validate(c)
      if (errs.length) {
        console.warn(`  ✗ inválido: ${errs.join('; ')}`)
        continue
      }
      const rest = episodes.filter((e) => String(e.number ?? e.id) !== id)
      rest.push({ number: ep.number, title: ep.title, guest: ep.guest ?? null, date: ep.date ?? null, summary: c.summary, takeaways: c.takeaways, category: c.category, confidence: 'high' })
      episodes.splice(0, episodes.length, ...rest)
      quizzes[id] = c.exercises
      // guardar tras cada episodio para poder retomar
      fs.writeFileSync(EP_OUT, JSON.stringify(episodes, null, 1))
      fs.writeFileSync(QZ_OUT, JSON.stringify(quizzes, null, 1))
      console.log(`  ✓ ${c.exercises.length} ejercicios`)
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        console.warn('  rate limit: espera y vuelve a correr (es incremental)')
        break
      } else if (err instanceof Anthropic.APIError) {
        console.warn(`  ✗ API ${err.status}: ${err.message}`)
      } else throw err
    }
  }
}

main()
