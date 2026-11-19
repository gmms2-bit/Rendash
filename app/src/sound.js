// Sons do Rendash: amostras gravadas (CC0, kenney.nl) e sinos sintetizados com Web Audio
import { SAMPLES } from './sfxdata'
let ctx = null, master = null
let on = (() => { try { return localStorage.getItem('rd-sound') !== '0' } catch (e) { return true } })()
export const soundOn = () => on
export const setSound = (v) => { on = v; try { localStorage.setItem('rd-sound', v ? '1' : '0') } catch (e) {} }
const SHOT = typeof location !== 'undefined' && location.search.includes('shot')
function ac() {
  if (SHOT) return null
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return null
    ctx = new C(); master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination)
    loadSamples()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}
// destrava o áudio no primeiro toque (exigência do iOS/Chrome)
if (typeof window !== 'undefined') { const u = () => { ac(); window.removeEventListener('pointerdown', u, true) }; window.addEventListener('pointerdown', u, true) }
function tone(f, t0, dur, { type = 'sine', vol = 0.12, f2, attack = 0.004 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02)
}
let noiseBuf = null
function noise(t0, dur, { vol = 0.1, type = 'bandpass', f = 3000, f2, q = 1 } = {}) {
  if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
  const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain()
  s.buffer = noiseBuf; fl.type = type; fl.frequency.setValueAtTime(f, t0); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + dur); fl.Q.value = q
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t0); s.stop(t0 + dur + 0.02)
}

// amostras decodificadas uma vez; até carregarem, toca a versão sintetizada
const buf = {}
function loadSamples() {
  for (const [k, uri] of Object.entries(SAMPLES)) {
    try {
      const bin = atob(uri.split(',')[1]); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i)
      ctx.decodeAudioData(a.buffer, (b) => { buf[k] = b }, () => {})
    } catch (e) {}
  }
}
function smp(k, t0, { vol = 1, rate = 1 } = {}) {
  if (!buf[k]) return false
  const s = ctx.createBufferSource(), g = ctx.createGain()
  s.buffer = buf[k]; s.playbackRate.value = rate; g.gain.value = vol
  s.connect(g); g.connect(master); s.start(t0); return true
}
// sino FM (timbre metálico de "plim", como os avisos de pagamento dos bancos)
function bell(f, t0, dur, vol = 0.1, ratio = 3.5, index = 2.2) {
  const c = ctx.createOscillator(), m = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain()
  c.frequency.value = f; m.frequency.value = f * ratio
  mg.gain.setValueAtTime(f * index, t0); mg.gain.exponentialRampToValueAtTime(f * 0.05, t0 + dur * 0.6)
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  m.connect(mg); mg.connect(c.frequency); c.connect(g); g.connect(master)
  c.start(t0); m.start(t0); c.stop(t0 + dur + 0.05); m.stop(t0 + dur + 0.05)
}
const S = {
  tick: (t) => smp('tick', t, { vol: 0.35 }) || noise(t, 0.018, { vol: 0.05, f: 3800, q: 2 }),
  tap: (t) => { if (!smp('tap', t, { vol: 0.4 })) { tone(820, t, 0.05, { vol: 0.07, f2: 560 }); noise(t, 0.015, { vol: 0.03, f: 4000, q: 2 }) } },
  key: (t) => smp('key', t, { vol: 0.45, rate: 0.96 + Math.random() * 0.08 }) || noise(t, 0.022, { vol: 0.12, type: 'highpass', f: 1800 }),
  toggle: (t) => { if (!smp('toggle', t, { vol: 0.45 })) { tone(1250, t, 0.035, { vol: 0.08 }); tone(1650, t + 0.045, 0.04, { vol: 0.07 }) } },
  success: (t) => { bell(1568, t, 1.1, 0.11); bell(2349.3, t + 0.12, 1.5, 0.1); bell(3136, t + 0.12, 0.6, 0.025, 2, 1); tone(784, t + 0.12, 0.5, { vol: 0.03 }) },
  coin: (t) => { if (!smp('coins', t, { vol: 0.5 })) { tone(1975.5, t, 0.07, { type: 'square', vol: 0.035 }); tone(2637, t + 0.07, 0.28, { type: 'square', vol: 0.03 }) } else bell(2637, t + 0.05, 0.5, 0.035) },
  notify: (t) => { smp('notify', t, { vol: 0.35 }); bell(1318.5, t, 0.7, 0.07, 2, 1.2); bell(1760, t + 0.13, 0.9, 0.07, 2, 1.2) },
  error: (t) => { if (smp('error', t, { vol: 0.5 })) smp('error', t + 0.12, { vol: 0.4, rate: 0.84 }); else { tone(233, t, 0.12, { type: 'triangle', vol: 0.12 }); tone(185, t + 0.13, 0.18, { type: 'triangle', vol: 0.12 }) } },
  open: (t) => { noise(t, 0.28, { vol: 0.05, f: 500, f2: 2600, q: 0.8 }); tone(523, t + 0.05, 0.25, { vol: 0.035, f2: 784 }) },
  close: (t) => noise(t, 0.22, { vol: 0.045, f: 2400, f2: 500, q: 0.8 }),
  unlock: (t) => { if (!smp('unlock', t, { vol: 0.5 })) { noise(t, 0.03, { vol: 0.09, f: 2200, q: 3 }); noise(t + 0.05, 0.03, { vol: 0.07, f: 3000, q: 3 }) } },
  sheet: (t) => noise(t, 0.16, { vol: 0.03, f: 900, f2: 1800, q: 0.7 }),
  faceid: (t) => { if (!smp('faceid', t, { vol: 0.45 })) { tone(1568, t, 0.12, { vol: 0.07 }); tone(2093, t + 0.09, 0.3, { vol: 0.07 }) } },
}
let pendingTick = null
export function sfx(name) {
  if (!on || !S[name]) return
  const c = ac(); if (!c) return
  if (name !== 'tick' && pendingTick) { clearTimeout(pendingTick); pendingTick = null }
  try { S[name](c.currentTime + 0.005) } catch (e) {}
}
// toque genérico em qualquer botão, se nenhum som específico tocar no mesmo clique
if (typeof window !== 'undefined') window.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('button, a, [role="button"], .chip, .li')
  if (!b || !on) return
  clearTimeout(pendingTick); pendingTick = setTimeout(() => { pendingTick = null; sfx('tick') }, 0)
}, true)
