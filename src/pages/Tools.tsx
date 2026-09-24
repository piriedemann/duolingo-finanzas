import { useEffect, useState } from 'react'
import { clp, go } from '../lib/util'
import { useTool } from '../state/store'
import { ArrowLeft } from '../components/Icons'
import { CreditCard, PieChart, ShieldCheck, TrendingUp } from 'lucide-react'

const TOOLS = [
  { id: 'interes', Icon: TrendingUp, title: 'Simulador de interés compuesto', desc: '¿Cuánto crece tu plata si la dejas trabajar?', color: '#2c6a86' },
  { id: 'presupuesto', Icon: PieChart, title: 'Presupuesto 50/30/20', desc: 'Reparte tu sueldo líquido en 3 celdas.', color: '#a8741a' },
  { id: 'emergencia', Icon: ShieldCheck, title: 'Fondo de emergencia', desc: 'Cuánto necesitas y cuándo lo tendrás.', color: '#a85a2a' },
  { id: 'deuda', Icon: CreditCard, title: 'La trampa del pago mínimo', desc: 'Cuánto cuesta de verdad pagar el mínimo.', color: '#a8433a' },
]

export function Tools({ id }: { id?: string }) {
  const tool = TOOLS.find((t) => t.id === id)
  useEffect(() => {
    if (tool) {
      const t = setTimeout(() => useTool(tool.id), 4000) // cuenta como usada tras interactuar un rato
      return () => clearTimeout(t)
    }
  }, [tool])

  if (!tool) {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <h1>Herramientas</h1>
            <p className="muted">Calculadoras para llevar la teoría a tus números. +5 XP la primera vez que usas cada una.</p>
          </div>

        </div>
        <div className="tool-grid">
          {TOOLS.map((t) => (
            <button key={t.id} className="tool-card" onClick={() => go('herramientas/' + t.id)}>
              <span className="tool-emoji" style={{ background: t.color }}>
                <t.Icon size={22} color="#fff" />
              </span>
              <strong>{t.title}</strong>
              <span className="muted small">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="page">
      <button className="back" onClick={() => go('herramientas')}>
        <ArrowLeft size={16} /> Herramientas
      </button>
      <div className="page-head">
        <h1>{tool.title}</h1>
      </div>
      {tool.id === 'interes' && <Compound />}
      {tool.id === 'presupuesto' && <Budget />}
      {tool.id === 'emergencia' && <Emergency />}
      {tool.id === 'deuda' && <MinPayment />}
      <p className="muted small disclaimer">Herramienta educativa, no constituye asesoría financiera. Supuestos simplificados.</p>
    </div>
  )
}

function Field({
  label,
  value,
  set,
  min,
  max,
  step,
  fmt,
}: {
  label: string
  value: number
  set: (n: number) => void
  min: number
  max: number
  step: number
  fmt: (n: number) => string
}) {
  return (
    <label className="field">
      <div className="field-top">
        <span>{label}</span>
        <strong>{fmt(value)}</strong>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )
}

const pct = (n: number) => n.toLocaleString('es-CL', { maximumFractionDigits: 1 }) + '%'

function Compound() {
  const [initial, setInitial] = useState(1_000_000)
  const [monthly, setMonthly] = useState(100_000)
  const [rate, setRate] = useState(6)
  const [years, setYears] = useState(25)
  const [hover, setHover] = useState<number | null>(null)

  const rows: { year: number; contributed: number; total: number }[] = []
  let total = initial
  const r = rate / 100 / 12
  for (let y = 0; y <= years; y++) {
    if (y > 0) for (let m = 0; m < 12; m++) total = total * (1 + r) + monthly
    rows.push({ year: y, contributed: initial + monthly * 12 * y, total })
  }
  const last = rows[rows.length - 1]
  const interest = last.total - last.contributed
  const W = 640
  const H = 240
  const pad = { l: 8, r: 8, t: 12, b: 24 }
  const maxV = last.total * 1.05
  const bw = (W - pad.l - pad.r) / rows.length
  const yv = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / maxV)
  const h = hover !== null ? rows[hover] : null

  return (
    <>
      <div className="tool-layout">
        <div className="card">
          <Field label="Monto inicial" value={initial} set={setInitial} min={0} max={20_000_000} step={100_000} fmt={clp} />
          <Field label="Aporte mensual" value={monthly} set={setMonthly} min={0} max={1_000_000} step={10_000} fmt={clp} />
          <Field label="Rentabilidad anual" value={rate} set={setRate} min={0} max={12} step={0.5} fmt={pct} />
          <Field label="Años" value={years} set={setYears} min={1} max={45} step={1} fmt={(n) => n + ' años'} />
        </div>
        <div className="card">
          <div className="kpis">
            <div>
              <div className="muted small">Tendrías</div>
              <div className="kpi">{clp(last.total)}</div>
            </div>
            <div>
              <div className="muted small">Pusiste tú</div>
              <div className="kpi">{clp(last.contributed)}</div>
            </div>
            <div>
              <div className="muted small">Ganaste en intereses</div>
              <div className="kpi green-text">{clp(interest)}</div>
            </div>
          </div>
          <div className="legend">
            <span><i style={{ background: 'var(--chart-a)' }} /> Aportes</span>
            <span><i style={{ background: 'var(--chart-b)' }} /> Intereses</span>
          </div>
          <div className="chart-wrap" onMouseLeave={() => setHover(null)}>
            <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Crecimiento de la inversión por año">
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1={pad.l} x2={W - pad.r} y1={yv(maxV * f)} y2={yv(maxV * f)} className="grid" />
              ))}
              {rows.map((row, i) => {
                const x = pad.l + i * bw + 1
                const w = Math.max(1, bw - 2)
                const yc = yv(row.contributed)
                const yt = yv(row.total)
                return (
                  <g key={i} opacity={hover === null || hover === i ? 1 : 0.45}>
                    <rect x={x} y={yc} width={w} height={H - pad.b - yc} rx={Math.min(3, w / 2)} className="bar-a" />
                    {row.total - row.contributed > 0 && (
                      <rect x={x} y={yt} width={w} height={Math.max(0, yc - yt - 2)} rx={Math.min(3, w / 2)} className="bar-b" />
                    )}
                    <rect x={pad.l + i * bw} y={0} width={bw} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)} />
                  </g>
                )
              })}
              <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} className="axis" />
              <text x={pad.l} y={H - 6} className="tick">Año 0</text>
              <text x={W - pad.r} y={H - 6} className="tick" textAnchor="end">Año {years}</text>
            </svg>
            {h && (
              <div className="tooltip" style={{ left: `${((hover! + 0.5) / rows.length) * 100}%` }}>
                <strong>Año {h.year}</strong>
                <div>Total: {clp(h.total)}</div>
                <div>Aportes: {clp(h.contributed)}</div>
                <div>Intereses: {clp(h.total - h.contributed)}</div>
              </div>
            )}
          </div>
          <p className="insight">
            {interest > last.contributed ? '¡Tus intereses superan lo que aportaste! Eso es el interés compuesto trabajando.' : `Los intereses son el ${Math.round((interest / Math.max(1, last.total)) * 100)}% del total. Mientras más tiempo, más pesa esta parte.`}
          </p>
        </div>
      </div>
    </>
  )
}

function Budget() {
  const [income, setIncome] = useState(900_000)
  const parts = [
    { label: 'Necesidades', pct: 50, emoji: 'N', desc: 'Arriendo, cuentas, supermercado, transporte', color: '#2c6a86' },
    { label: 'Gustos', pct: 30, emoji: 'G', desc: 'Salidas, delivery, streaming, ropa', color: '#5b4f96' },
    { label: 'Ahorro e inversión', pct: 20, emoji: 'A', desc: 'Fondo de emergencia, metas, inversión', color: '#2f6f4f' },
  ]
  return (
    <div className="tool-layout">
      <div className="card">
        <Field label="Sueldo líquido mensual" value={income} set={setIncome} min={300_000} max={5_000_000} step={10_000} fmt={clp} />
        <p className="muted small">El 50/30/20 es un punto de partida, no una ley. Si tu arriendo se come más del 50%, ajusta los gustos antes que el ahorro.</p>
      </div>
      <div className="card">
        <div className="stackbar" role="img" aria-label="Distribución 50/30/20">
          {parts.map((p) => (
            <div key={p.label} style={{ width: p.pct + '%', background: p.color }}>
              {p.pct}%
            </div>
          ))}
        </div>
        {parts.map((p) => (
          <div key={p.label} className="budget-row">
            <span className="budget-emoji" style={{ background: p.color }}>
              {p.emoji}
            </span>
            <div className="grow">
              <strong>
                {p.label} · {p.pct}%
              </strong>
              <div className="muted small">{p.desc}</div>
            </div>
            <div className="kpi small-kpi">{clp((income * p.pct) / 100)}</div>
          </div>
        ))}
        <p className="insight">Ahorrando {clp(income * 0.2)} al mes, en un año juntas {clp(income * 0.2 * 12)}.</p>
      </div>
    </div>
  )
}

function Emergency() {
  const [expenses, setExpenses] = useState(700_000)
  const [months, setMonths] = useState(4)
  const [saved, setSaved] = useState(300_000)
  const [monthly, setMonthly] = useState(120_000)
  const goal = expenses * months
  const missing = Math.max(0, goal - saved)
  const eta = monthly > 0 ? Math.ceil(missing / monthly) : Infinity
  const progress = Math.min(1, saved / goal)
  return (
    <div className="tool-layout">
      <div className="card">
        <Field label="Gastos mensuales esenciales" value={expenses} set={setExpenses} min={200_000} max={3_000_000} step={10_000} fmt={clp} />
        <Field label="Meses de colchón" value={months} set={setMonths} min={1} max={12} step={1} fmt={(n) => n + ' meses'} />
        <Field label="Ya tengo ahorrado" value={saved} set={setSaved} min={0} max={10_000_000} step={50_000} fmt={clp} />
        <Field label="Puedo ahorrar al mes" value={monthly} set={setMonthly} min={0} max={1_000_000} step={10_000} fmt={clp} />
      </div>
      <div className="card center">
        <div className="jar">
          <div className="jar-fill" style={{ height: progress * 100 + '%' }} />
          <div className="jar-label">{Math.round(progress * 100)}%</div>
        </div>
        <div className="kpis">
          <div>
            <div className="muted small">Tu meta</div>
            <div className="kpi">{clp(goal)}</div>
          </div>
          <div>
            <div className="muted small">Te falta</div>
            <div className="kpi">{clp(missing)}</div>
          </div>
          <div>
            <div className="muted small">Lo logras en</div>
            <div className="kpi green-text">{missing === 0 ? '¡Listo!' : eta === Infinity ? '—' : eta + ' meses'}</div>
          </div>
        </div>
        <p className="insight">Guárdalo en algo líquido y de bajo riesgo (cuenta de ahorro, depósito a plazo renovable o fondo money market), separado de tu cuenta del día a día.</p>
      </div>
    </div>
  )
}

function MinPayment() {
  const [debt, setDebt] = useState(1_000_000)
  const [rate, setRate] = useState(2.5)
  const [minPct, setMinPct] = useState(5)
  const [extra, setExtra] = useState(100_000)

  const sim = (fixed: number | null) => {
    let bal = debt
    let paid = 0
    let months = 0
    while (bal > 1 && months < 600) {
      const interest = bal * (rate / 100)
      const minimum = Math.max(bal * (minPct / 100), 10_000)
      const pay = Math.min(bal + interest, fixed ?? minimum)
      bal = bal + interest - pay
      paid += pay
      months++
      if (fixed !== null && pay <= interest) return { months: Infinity, paid: Infinity }
    }
    return { months, paid }
  }
  const a = sim(null)
  const fixedPay = Math.max(debt * (minPct / 100), 10_000) + extra
  const b = sim(fixedPay)
  const f = (m: number) => (m === Infinity ? 'nunca' : m >= 12 ? `${Math.floor(m / 12)} años ${m % 12} meses` : `${m} meses`)
  return (
    <div className="tool-layout">
      <div className="card">
        <Field label="Deuda en tarjeta" value={debt} set={setDebt} min={100_000} max={5_000_000} step={50_000} fmt={clp} />
        <Field label="Interés mensual" value={rate} set={setRate} min={0.5} max={4} step={0.1} fmt={pct} />
        <Field label="Pago mínimo (% del saldo)" value={minPct} set={setMinPct} min={2} max={15} step={1} fmt={pct} />
        <Field label="Extra que podrías pagar al mes" value={extra} set={setExtra} min={0} max={500_000} step={10_000} fmt={clp} />
      </div>
      <div className="card">
        <div className="versus">
          <div className="vs-box bad">
            <div className="vs-title">Solo el pago mínimo</div>
            <div className="muted small">Tardas</div>
            <div className="kpi">{f(a.months)}</div>
            <div className="muted small">Pagas en total</div>
            <div className="kpi">{a.paid === Infinity ? '∞' : clp(a.paid)}</div>
            <div className="muted small">Intereses</div>
            <div className="kpi red-text">{a.paid === Infinity ? '∞' : clp(a.paid - debt)}</div>
          </div>
          <div className="vs-box good">
            <div className="vs-title">Cuota fija de {clp(fixedPay)}</div>
            <div className="muted small">Tardas</div>
            <div className="kpi">{f(b.months)}</div>
            <div className="muted small">Pagas en total</div>
            <div className="kpi">{b.paid === Infinity ? '∞' : clp(b.paid)}</div>
            <div className="muted small">Intereses</div>
            <div className="kpi green-text">{b.paid === Infinity ? '∞' : clp(b.paid - debt)}</div>
          </div>
        </div>
        {a.paid !== Infinity && b.paid !== Infinity && (
          <p className="insight">Pagando una cuota fija te ahorras {clp(a.paid - b.paid)} en intereses. El pago mínimo baja junto con tu deuda, por eso se estira tanto.</p>
        )}
      </div>
    </div>
  )
}
