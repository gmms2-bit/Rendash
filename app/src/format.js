export const brl = (v, { sign = false, cents = true } = {}) => {
  const n = Math.abs(v)
  const s = n.toLocaleString('pt-BR', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })
  const pre = sign ? (v < 0 ? '− ' : '+ ') : v < 0 ? '− ' : ''
  return `${pre}R$ ${s}`
}
export const pct = (v, d = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })}%`
export const num = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
export const kfmt = (v) => (Math.abs(v) >= 1e6 ? `R$ ${num(v / 1e6, 1)} mi` : Math.abs(v) >= 1e3 ? `R$ ${num(v / 1e3, 1)} mil` : brl(v))
export const parseCents = (digits) => Number(digits || '0') / 100
export const maskCPF = (s) => s.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
export const maskPhone = (s) => {
  const d = s.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
export const validCPF = (s) => {
  const d = s.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false
  const calc = (n) => { let t = 0; for (let i = 0; i < n; i++) t += +d[i] * (n + 1 - i); const r = (t * 10) % 11; return r === 10 ? 0 : r }
  return calc(9) === +d[9] && calc(10) === +d[10]
}
import { sfx } from './sound'
export const vibrate = (ms = 8) => {
  try { navigator.vibrate && navigator.vibrate(ms) } catch (e) {}
  // cada vibração ganha o som correspondente
  if (Array.isArray(ms)) sfx('success'); else if (ms >= 50) sfx('error'); else if (ms <= 4) sfx('key'); else if (ms === 6) sfx('toggle'); else sfx('tap')
}
// smooth path through points (catmull-rom -> bezier)
export function smoothPath(pts) {
  if (!pts.length) return ''
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return d
}
export function resample(values, n) {
  if (values.length === n) return values
  const out = []
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (values.length - 1), a = Math.floor(t), b = Math.min(values.length - 1, a + 1), f = t - a
    out.push(values[a] * (1 - f) + values[b] * f)
  }
  return out
}
// deterministic pseudo-random series
export function series(seed, n, start, drift, vol) {
  let x = seed, v = start; const out = []
  for (let i = 0; i < n; i++) { x = (x * 9301 + 49297) % 233280; const r = x / 233280 - 0.5; v = v * (1 + drift + r * vol); out.push(v) }
  return out
}

export const island = (d) => { try { window.dispatchEvent(new CustomEvent('rd-island', { detail: d })) } catch (e) {} }
export const iosBanner = (d) => {
  sfx('notify')
  // aparelho real: se o app estiver instalado e com permissão, o aviso sai na tela do aparelho
  try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && navigator.serviceWorker && !location.search.includes('shot')) navigator.serviceWorker.ready.then((r) => r.showNotification(d.title, { body: d.body, icon: 'img/icon-192.png', badge: 'img/icon-192.png', tag: 'rd-' + d.title })) } catch (e) {}
  try { window.dispatchEvent(new CustomEvent('rd-banner', { detail: d })) } catch (e) {} }
