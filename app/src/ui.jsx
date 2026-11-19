import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import * as L from './icons'
import { sfx } from './sound'
import LOGOS from './logos.json'
import confetti from 'canvas-confetti'
import NumberFlow from '@number-flow/react'
import { brl, smoothPath, resample, vibrate } from './format'
import { useApp } from './store'

export const spring = { type: 'spring', stiffness: 380, damping: 32 }
export const soft = { type: 'spring', stiffness: 170, damping: 24 }

/* ---------- icon ---------- */
const ICONS = {
  food: L.UtensilsCrossed, sub: L.Repeat, car: L.Car, cart: L.ShoppingCart, work: L.Briefcase, home: L.House, heart: L.HeartPulse,
  party: L.PartyPopper, brief: L.BriefcaseBusiness, up: L.TrendingUp, dots: L.Ellipsis, plane: L.Plane, coffee: L.Coffee, alert: L.TriangleAlert,
  target: L.Target, coin: L.Coins, shield: L.ShieldCheck, card: L.CreditCard, sync: L.RefreshCw,
}
const warned = {}
export function Icon({ n, s = 20, c, w = 1.9, style }) {
  const C = ICONS[n] || L[n] || (n && !warned[n] && (warned[n] = 1) && console.warn('icone ausente: ' + n), L.Circle)
  return <C size={s} color={c || 'currentColor'} strokeWidth={w} style={style} />
}

/* ---------- logo ---------- */
const MONO = {
  tesouro: { t: 'TD', bg: 'linear-gradient(135deg,#0E7C4A,#0A5A36)', fg: '#FFD84D' },
  vale: { t: 'V', bg: 'linear-gradient(135deg,#00877C,#006E63)', fg: '#F2C230' },
  c6: { t: 'C6', bg: '#121212', fg: '#fff' },
  atlas: { t: 'A', bg: 'linear-gradient(135deg,#3C7BFF,#2554C7)', fg: '#fff' },
  fii: { t: 'FII', bg: 'linear-gradient(135deg,#6B5BFF,#4B3CD9)', fg: '#fff' },
}
export function Logo({ k, s = 40, r = 0.3, ring }) {
  const box = { width: s, height: s, borderRadius: s * r, flex: 'none', overflow: 'hidden', display: 'grid', placeItems: 'center', position: 'relative', boxShadow: ring ? '0 0 0 1px rgba(255,255,255,.12)' : 'inset 0 0 0 1px rgba(255,255,255,.08)' }
  if (k === 'rendash') return <div style={{ ...box }}><img src="img/appicon.png" alt="Rendash" style={{ width: '100%', height: '100%' }} /></div>
  const m = MONO[k]
  if (m) return <div style={{ ...box, background: m.bg, color: m.fg, fontWeight: 800, fontSize: s * (m.t.length > 2 ? 0.3 : m.t.length > 1 ? 0.36 : 0.46), letterSpacing: '-.04em' }}>{m.t}</div>
  const d = LOGOS[k]
  if (!d) return <div style={{ ...box, background: 'rgba(255,255,255,.1)', fontWeight: 700, fontSize: s * 0.42 }}>{String(k || '?')[0].toUpperCase()}</div>
  const pad = s * 0.18
  return (
    <div style={{ ...box, background: d.bg }}>
      <div className={d.glyph ? 'lg g' : 'lg'} style={{ width: s - pad * 2, height: s - pad * 2, '--g': d.glyph }} dangerouslySetInnerHTML={{ __html: d.svg }} />
    </div>
  )
}

export function Avatar({ src, ini, s = 40, ring = true }) {
  return src ? (
    <img src={src} alt="" style={{ width: s, height: s, borderRadius: '50%', objectFit: 'cover', flex: 'none', boxShadow: ring ? '0 0 0 2px #0A0E1B, 0 0 0 3.5px var(--teal)' : 'none' }} />
  ) : (
    <div style={{ width: s, height: s, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', fontWeight: 650, fontSize: s * 0.36, background: 'linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.06))', border: '1px solid rgba(255,255,255,.16)' }}>{ini}</div>
  )
}

export const Wordmark = ({ h = 34, style }) => <img src="img/wordmark.png" alt="Rendash" style={{ height: h, display: 'block', ...style }} />

/* ---------- press ---------- */
export const Tap = React.forwardRef(function Tap({ children, onClick, className = '', style, scale = 0.96, disabled, as = 'button', haptic = true, ...rest }, ref) {
  const C = motion[as]
  return (
    <C ref={ref} className={className} style={style} disabled={disabled}
      whileTap={disabled ? undefined : { scale }} transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      onClick={(e) => { if (disabled) return; if (haptic) vibrate(6); onClick && onClick(e) }} {...rest}>
      {children}
    </C>
  )
})
export function Btn({ kind = 'primary', children, icon, onClick, disabled, className = '', loading, style }) {
  return (
    <Tap type="button" className={`btn ${kind} ${kind !== 'primary' ? 'glass' : ''} ${className}`} onClick={onClick} disabled={disabled || loading} style={style}>
      {loading ? <Spinner c={kind === 'primary' ? '#04130F' : '#fff'} /> : <>{icon && <Icon n={icon} s={18} />}{children}</>}
    </Tap>
  )
}
export const Spinner = ({ c = '#fff', s = 20 }) => (
  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    style={{ width: s, height: s, borderRadius: '50%', border: `2.4px solid ${c}`, borderTopColor: 'transparent', display: 'inline-block' }} />
)
export function CircBtn({ n, onClick, dot, s = 40, label }) {
  return (
    <Tap className="circ glass" style={{ width: s, height: s }} onClick={onClick} aria-label={label}>
      <Icon n={n} s={18} />{dot && <span className="dot" />}
    </Tap>
  )
}

/* ---------- header ---------- */
export function Header({ title, sub, back = true, right, big, children }) {
  const { pop } = useApp()
  return (
    <div className="header">
      {back && <CircBtn n="ChevronLeft" onClick={pop} label="Voltar" />}
      <div className="tt">
        <h1 className={big || !back ? '' : 'sm'}>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {children}
      {right}
    </div>
  )
}

/* ---------- money / count ---------- */
export function useCount(to, { from = 0, delay = 0, duration = 1.4, key } = {}) {
  const mv = useMotionValue(from)
  const prev = useRef(from)
  useEffect(() => {
    const c = animate(mv, to, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    prev.current = to
    return () => c.stop()
  }, [to, key])
  return mv
}
export function Count({ to, from = 0, delay = 0, duration = 1.4, fmt = (v) => brl(v), className, style }) {
  const ref = useRef(null)
  const mv = useCount(to, { from, delay, duration })
  useEffect(() => mv.on('change', (v) => { if (ref.current) ref.current.textContent = fmt(v) }), [mv, fmt])
  return <span ref={ref} className={`num ${className || ''}`} style={style}>{fmt(from)}</span>
}
/** big money with smaller cents, animated */
export function Money({ v, size = 34, hidden, from = 0, delay = 0, duration = 1.6, color, k }) {
  const ref = useRef(null), cref = useRef(null)
  const mv = useMotionValue(from)
  useEffect(() => {
    const c = animate(mv, v, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [v, k])
  useEffect(() => mv.on('change', (x) => {
    const [i, d] = Math.abs(x).toFixed(2).split('.')
    if (ref.current) ref.current.textContent = (x < 0 ? '− ' : '') + Number(i).toLocaleString('pt-BR')
    if (cref.current) cref.current.textContent = ',' + d
  }), [mv])
  const [i0, d0] = Math.abs(from).toFixed(2).split('.')
  return (
    <div className="num" style={{ display: 'flex', alignItems: 'baseline', fontWeight: 650, fontSize: size, letterSpacing: '-.035em', color, lineHeight: 1.1 }}>
      <span style={{ fontSize: size * 0.5, opacity: 0.7, marginRight: 6, fontWeight: 600 }}>R$</span>
      <AnimatePresence mode="wait" initial={false}>
        {hidden ? (
          <motion.span key="h" initial={{ opacity: 0, filter: 'blur(6px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(6px)' }} style={{ letterSpacing: '.08em' }}>••••••</motion.span>
        ) : (
          <motion.span key="v" initial={{ opacity: 0, filter: 'blur(6px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(6px)' }}>
            <span ref={ref}>{Number(i0).toLocaleString('pt-BR')}</span>
            <span ref={cref} style={{ fontSize: size * 0.55, opacity: 0.55 }}>,{d0}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- controls ---------- */
export function Toggle({ on, onChange }) {
  return (
    <button className={`tg ${on ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); vibrate(6); onChange(!on) }} aria-pressed={on}>
      <motion.i animate={{ x: on ? 20 : 0 }} transition={{ type: 'spring', stiffness: 700, damping: 35 }} />
    </button>
  )
}
let segId = 0
export function Seg({ items, value, onChange, style }) {
  const id = useMemo(() => 'seg' + segId++, [])
  return (
    <div className="seg" style={style}>
      {items.map((it) => (
        <button key={it} className={it === value ? 'on' : ''} onClick={() => { vibrate(5); onChange(it) }}>
          {it === value && <motion.span layoutId={id} className="sp" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          {it}
        </button>
      ))}
    </div>
  )
}
export function Chips({ items, value, onChange }) {
  return (
    <div className="chips">
      {items.map((it) => (
        <Tap key={it} className={`chip ${it === value ? 'on' : ''}`} onClick={() => onChange(it)}>{it}</Tap>
      ))}
    </div>
  )
}

/* ---------- list ---------- */
export function Li({ icon, logo, avatar, title, sub, value, vsub, vcls, chevron = true, onClick, right, delay = 0 }) {
  return (
    <Tap as="button" className="li" scale={0.985} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {logo ? <Logo k={logo} s={40} /> : avatar ? avatar : icon ? <div className="ic"><Icon n={icon} s={19} /></div> : null}
      <div className="grow">
        <div className="ti ell">{title}</div>
        {sub && <div className="su ell">{sub}</div>}
      </div>
      {right}
      {value != null && <div><div className={`va num ${vcls || ''}`}>{value}</div>{vsub && <div className="vs">{vsub}</div>}</div>}
      {chevron && onClick && <Icon n="ChevronRight" s={17} c="rgba(255,255,255,.35)" />}
    </Tap>
  )
}

/* stagger container */
export const Stagger = ({ children, delay = 0, gap = 0.05, className, style }) => (
  <motion.div className={className} style={style} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: gap, delayChildren: delay } } }}>
    {children}
  </motion.div>
)
export const Item = ({ children, className, style, onClick }) => (
  <motion.div className={className} style={style} onClick={onClick}
    variants={{ h: { opacity: 0, y: 18, scale: 0.98 }, s: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 26 } } }}>
    {children}
  </motion.div>
)

/* ---------- charts ---------- */
export function LineChart({ data, h = 110, color = '#0EDBB9', dkey, draw = true, delay = 0.2, interactive = true, fmt = (v) => brl(v), area = true, dot = true, labels }) {
  const W = 320, H = h, N = 40
  const vals = resample(data, N)
  const min = Math.min(...vals), max = Math.max(...vals), pad = (max - min) * 0.12 || 1
  const pts = vals.map((v, i) => [(i / (N - 1)) * W, H - 6 - ((v - min + pad) / (max - min + pad * 2)) * (H - 12)])
  const d = smoothPath(pts)
  const ad = d + ` L${W},${H} L0,${H} Z`
  const gid = useMemo(() => 'g' + Math.random().toString(36).slice(2), [])
  const [hover, setHover] = useState(null)
  const ref = useRef(null)
  const onMove = (e) => {
    if (!interactive) return
    const r = ref.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    setHover(Math.round(x * (N - 1)))
  }
  const last = pts[pts.length - 1]
  return (
    <div ref={ref} style={{ position: 'relative', touchAction: 'pan-y' }} onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)} onPointerUp={() => setTimeout(() => setHover(null), 900)}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && <motion.path initial={{ opacity: 0, d: ad }} animate={{ opacity: 1, d: ad }} transition={{ opacity: { delay: delay + 0.5, duration: 0.8 }, d: soft }} fill={`url(#${gid})`} />}
        <motion.path initial={draw ? { pathLength: 0, d } : { d }} animate={{ pathLength: 1, d }}
          transition={{ pathLength: { delay, duration: 1.3, ease: [0.65, 0, 0.35, 1] }, d: soft }}
          fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 4px 10px ${color}66)` }} />
      </svg>
      {dot && hover == null && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, left: `${(last[0] / W) * 100}%`, top: last[1] }} transition={{ delay: draw ? delay + 1.2 : 0, ...spring }}
          style={{ position: 'absolute', width: 10, height: 10, marginLeft: -5, marginTop: -5, borderRadius: '50%', background: color, boxShadow: `0 0 0 4px ${color}33` }}>
          <motion.span animate={{ scale: [1, 2.6], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
        </motion.div>
      )}
      {hover != null && (
        <>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(pts[hover][0] / W) * 100}%`, width: 1, background: 'rgba(255,255,255,.35)' }} />
          <div style={{ position: 'absolute', left: `${(pts[hover][0] / W) * 100}%`, top: pts[hover][1], width: 12, height: 12, margin: '-6px 0 0 -6px', borderRadius: '50%', background: '#fff', border: `3px solid ${color}` }} />
          <div className="glass num" style={{ position: 'absolute', top: -34, left: `clamp(0px, calc(${(pts[hover][0] / W) * 100}% - 52px), calc(100% - 104px))`, width: 104, textAlign: 'center', padding: '5px 0', borderRadius: 10, fontSize: 12, fontWeight: 650 }}>{fmt(vals[hover])}</div>
        </>
      )}
      {labels && <div className="between t3" style={{ fontSize: 11, marginTop: 6 }}>{labels.map((l, i) => <span key={i}>{l}</span>)}</div>}
    </div>
  )
}

export function Spark({ data, color = '#0EDBB9', w = 70, h = 28, delay = 0.3 }) {
  const N = 24, vals = resample(data, N), min = Math.min(...vals), max = Math.max(...vals) || 1
  const pts = vals.map((v, i) => [(i / (N - 1)) * w, h - 2 - ((v - min) / (max - min || 1)) * (h - 4)])
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', display: 'block' }}>
      <motion.path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 1, ease: 'easeInOut' }} />
    </svg>
  )
}

export function Bars({ data, labels, h = 140, hl = data.length - 1, fmt = (v) => brl(v), dkey, color = '#0EDBB9' }) {
  const max = Math.max(...data)
  const [sel, setSel] = useState(null)
  useEffect(() => setSel(null), [dkey])
  const act = sel ?? hl
  return (
    <div>
      <div style={{ height: 22, position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={`${dkey}-${act}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="num" style={{ fontSize: 12, fontWeight: 650, color }}>
            {labels?.[act] ? `${labels[act]} · ` : ''}{fmt(data[act])}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: data.length > 8 ? 6 : 10, height: h }}>
        {data.map((v, i) => (
          <motion.button key={i} onClick={() => { vibrate(5); setSel(i) }}
            initial={{ height: 0 }} animate={{ height: `${Math.max(6, (v / max) * 100)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.15 + i * 0.045 }}
            style={{ flex: 1, borderRadius: 8, background: i === act ? `linear-gradient(180deg, ${color}, ${color}99)` : 'linear-gradient(180deg, rgba(217,217,222,.85), rgba(217,217,222,.35))', boxShadow: i === act ? `0 0 18px ${color}66` : 'none', transition: 'background .25s, box-shadow .25s' }} />
        ))}
      </div>
      {labels && (
        <div style={{ display: 'flex', gap: data.length > 8 ? 6 : 10, marginTop: 8 }}>
          {labels.map((l, i) => <span key={i} className="t3" style={{ flex: 1, textAlign: 'center', fontSize: 10.5 }}>{l}</span>)}
        </div>
      )}
    </div>
  )
}

export function Ring({ p, s = 56, sw = 6, color = '#0EDBB9', delay = 0.2, children, track = 'rgba(255,255,255,.1)' }) {
  const r = (s - sw) / 2
  return (
    <div style={{ width: s, height: s, position: 'relative', flex: 'none' }}>
      <svg width={s} height={s} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={s / 2} cy={s / 2} r={r} stroke={track} strokeWidth={sw} fill="none" />
        <motion.circle cx={s / 2} cy={s / 2} r={r} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: Math.max(0.001, p / 100) }} transition={{ delay, type: 'spring', stiffness: 50, damping: 14 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>
  )
}

export function Donut({ parts, s = 150, sw = 16, sel, onSel, children }) {
  const r = (s - sw) / 2, C = 2 * Math.PI * r, gap = 0.012
  let acc = 0
  return (
    <div style={{ width: s, height: s, position: 'relative', flex: 'none' }}>
      <svg width={s} height={s} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <circle cx={s / 2} cy={s / 2} r={r} stroke="rgba(255,255,255,.06)" strokeWidth={sw} fill="none" />
        {parts.map((p, i) => {
          const frac = p.p / 100, start = acc; acc += frac
          const on = sel == null || sel === i
          return (
            <motion.circle key={p.k} cx={s / 2} cy={s / 2} r={r} fill="none" stroke={p.cor} strokeLinecap="round" onClick={() => onSel && onSel(sel === i ? null : i)}
              strokeDasharray={`${C} ${C}`}
              initial={{ strokeDashoffset: C, opacity: 1 }}
              animate={{ strokeDashoffset: C - (frac - gap) * C, opacity: on ? 1 : 0.3, strokeWidth: sel === i ? sw + 6 : sw }}
              transition={{ strokeDashoffset: { delay: 0.25 + i * 0.22, duration: 0.7, ease: [0.65, 0, 0.35, 1] }, default: spring }}
              style={{ transform: `rotate(${start * 360}deg)`, transformOrigin: '50% 50%', cursor: 'pointer', filter: sel === i ? `drop-shadow(0 0 8px ${p.cor})` : 'none' }} />
          )
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none' }}>{children}</div>
    </div>
  )
}

export function ProgressBar({ p, color = '#0EDBB9', h = 6, delay = 0.3 }) {
  return (
    <div style={{ height: h, borderRadius: h, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ delay, type: 'spring', stiffness: 60, damping: 16 }} style={{ height: '100%', borderRadius: h, background: color, boxShadow: `0 0 10px ${color}88` }} />
    </div>
  )
}

/* ---------- celebration ---------- */
/* confetti: canvas-confetti (ISC) desenhado num canvas dentro da tela, saindo do centro de [data-confetti-anchor] */
export function Confetti({ n = 70, coins = true, delay = 380 }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const fire = confetti.create(canvas, { resize: true, useWorker: false })
    let alive = true
    const timers = []
    timers.push(setTimeout(() => {
      if (!alive) return
      const scr = canvas.closest('.screen') || canvas.parentElement
      const a = scr && scr.querySelector('[data-confetti-anchor]')
      const cr = canvas.getBoundingClientRect()
      let x = 0.5, y = 0.36
      if (a && cr.width) { const r = a.getBoundingClientRect(); x = (r.left + r.width / 2 - cr.left) / cr.width; y = (r.top + r.height / 2 - cr.top) / cr.height }
      const colors = ['#0EDBB9', '#34ECD0', '#8E7CFF', '#FFFFFF', '#5AA9FF', '#FFD84D']
      fire({ particleCount: n, spread: 75, startVelocity: 40, origin: { x, y }, colors, scalar: 0.9, ticks: 230, gravity: 1, zIndex: 5 })
      fire({ particleCount: Math.round(n * 0.5), spread: 160, startVelocity: 24, origin: { x, y }, colors, scalar: 0.7, ticks: 200, zIndex: 5 })
      if (coins) setTimeout(() => sfx('coin'), 180)
      if (coins) fire({ particleCount: 16, spread: 110, startVelocity: 34, origin: { x, y }, shapes: ['circle'], colors: ['#F7C948', '#FFD84D', '#E0A82E'], scalar: 1.5, ticks: 250, gravity: 1.15, zIndex: 5 })
      timers.push(setTimeout(() => {
        if (!alive) return
        fire({ particleCount: Math.round(n * 0.4), angle: 62, spread: 50, startVelocity: 52, origin: { x: 0, y: 0.92 }, colors, zIndex: 5 })
        fire({ particleCount: Math.round(n * 0.4), angle: 118, spread: 50, startVelocity: 52, origin: { x: 1, y: 0.92 }, colors, zIndex: 5 })
      }, 260))
    }, delay))
    return () => { alive = false; timers.forEach(clearTimeout); fire.reset() }
  }, [])
  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} />
}

/* valor que muda: dígitos rolando (@number-flow/react, MIT) */
const FLOW_FMT = {
  brl: { style: 'currency', currency: 'BRL' },
  brl0: { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 },
  brlSign: { style: 'currency', currency: 'BRL', signDisplay: 'exceptZero' },
  int: { maximumFractionDigits: 0 },
}
export function Flow({ value, kind = 'brl', suffix, className, style }) {
  return <NumberFlow value={value} locales="pt-BR" format={FLOW_FMT[kind]} suffix={suffix} className={`num ${className || ''}`} style={style} willChange />
}

export function SuccessMark({ s = 96, color = '#0EDBB9' }) {
  return (
    <motion.div data-confetti-anchor initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
      style={{ width: s, height: s, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${color}, #08A88E)`, display: 'grid', placeItems: 'center', boxShadow: `0 0 0 10px ${color}22, 0 0 60px ${color}66`, margin: '0 auto' }}>
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="none" stroke="#04130F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.45, ease: 'easeOut' }} />
      </svg>
    </motion.div>
  )
}

/* ---------- face id ---------- */
export function FaceID({ state = 'scan', s = 110 }) {
  // state: scan | ok | fail
  const col = state === 'ok' ? '#0EDBB9' : state === 'fail' ? '#FF6B6B' : '#fff'
  return (
    <motion.div animate={state === 'fail' ? { x: [0, -12, 12, -8, 8, 0] } : { x: 0 }} transition={{ duration: 0.45 }} style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="0 0 100 100" width={s} height={s} fill="none" stroke={col} strokeWidth="5" strokeLinecap="round" style={{ transition: 'stroke .3s' }}>
        <path d="M8 30V18a10 10 0 0 1 10-10h12M70 8h12a10 10 0 0 1 10 10v12M92 70v12a10 10 0 0 1-10 10H70M30 92H18A10 10 0 0 1 8 82V70" />
        <AnimatePresence mode="wait">
          {state === 'ok' ? (
            <motion.path key="ok" d="M30 52l13 13 27-30" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          ) : (
            <motion.g key="face" exit={{ opacity: 0, scale: 0.8 }} style={{ transformOrigin: '50px 50px' }}>
              <path d="M34 36v6M66 36v6M50 36v16h-4M38 68c7 6 17 6 24 0" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      {state === 'scan' && (
        <motion.div animate={{ top: ['14%', '82%', '14%'] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: '12%', right: '12%', height: 3, borderRadius: 2, background: 'linear-gradient(90deg, transparent, #0EDBB9, transparent)', boxShadow: '0 0 14px #0EDBB9' }} />
      )}
    </motion.div>
  )
}

/* ---------- empty / misc ---------- */
export const Note = ({ icon = 'Info', children, style }) => (
  <div className="row t2" style={{ fontSize: 12.5, alignItems: 'flex-start', margin: '14px 4px 0', ...style }}>
    <Icon n={icon} s={15} style={{ marginTop: 1, flex: 'none' }} /><span>{children}</span>
  </div>
)
export const Stat = ({ label, value, cls, sub }) => (
  <div className="card flat" style={{ flex: 1, minWidth: 0, padding: '12px 11px', borderRadius: 18 }}>
    <div className="ovl" style={{ fontSize: 9.5, letterSpacing: '.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
    <div className={`num ${cls || ''}`} style={{ fontWeight: 650, fontSize: 14.5, letterSpacing: '-.02em', marginTop: 4, whiteSpace: 'nowrap' }}>{value}</div>
    {sub && <div className="t3" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>}
  </div>
)
