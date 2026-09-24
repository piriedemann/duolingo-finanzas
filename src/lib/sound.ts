import { getState } from '../state/store'

let ctx: AudioContext | null = null

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  if (!ctx) ctx = new AudioContext()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  const t = ctx.currentTime + start
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

export const sfx = {
  correct() {
    if (!getState().sound) return
    tone(660, 0, 0.12, 'triangle')
    tone(990, 0.09, 0.22, 'triangle')
  },
  wrong() {
    if (!getState().sound) return
    tone(220, 0, 0.18, 'sawtooth', 0.08)
    tone(180, 0.12, 0.25, 'sawtooth', 0.08)
  },
  tap() {
    if (!getState().sound) return
    tone(520, 0, 0.05, 'sine', 0.06)
  },
  finish() {
    if (!getState().sound) return
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle'))
  },
}
