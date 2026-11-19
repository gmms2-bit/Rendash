import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
let uid = 1
const SPRING = { type: 'spring', stiffness: 320, damping: 36, mass: 1 }

export function AppProvider({ children, screens, initial, initialParams, onExit }) {
  const [stack, setStack] = useState(() => [{ id: uid++, name: initial, params: initialParams || {}, mode: 'fade', born: true }])
  const [tab, setTab] = useState('inicio')
  const [toastMsg, setToast] = useState(null)
  const [sheet, setSheet] = useState(null)
  const [prefs, setPrefs] = useState({ hidden: false, bio: true, bioConf: true, alRend: true, alMerc: false, hideOpen: false, cardLocked: false, aprox: true, intl: true, online: true, limite: 8500, readAll: false, contactless: true })
  const [state, setState] = useState({ saldo: 18420.8, patrimonio: 124850.32, invested: [], connected: ['rendash', 'itau', 'nubank'] })
  const busy = useRef(false)
  const W = useRef(393), H = useRef(852)

  const push = useCallback((name, params = {}, mode = 'push') => {
    if (busy.current) return
    busy.current = true; setTimeout(() => (busy.current = false), 260)
    setStack((s) => [...s, { id: uid++, name, params, mode, born: true }])
  }, [])
  const pop = useCallback((n = 1) => {
    setStack((s) => {
      if (s.length <= 1) return s
      const k = Math.min(n, s.length - 1)
      const top = s[s.length - 1]
      top.leaving = true
      if (k > 1) { const keep = s.slice(0, s.length - k); return [...keep, top] }
      return [...s]
    })
  }, [])
  const remove = useCallback((id) => setStack((s) => s.filter((e) => e.id !== id)), [])
  const replace = useCallback((name, params = {}, mode = 'fade') => setStack((s) => [...s.slice(0, -1), { id: uid++, name, params, mode, born: true }]), [])
  const reset = useCallback((name, params = {}, mode = 'fade') => { setStack([{ id: uid++, name, params, mode, born: true }]); setSheet(null) }, [])
  const toast = useCallback((msg, icon = 'CircleCheck') => { setToast({ msg, icon, k: uid++ }) }, [])
  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t) }, [toastMsg])
  const goTab = useCallback((t) => { setTab(t); setStack((s) => (s.length > 1 ? (s[s.length - 1].leaving = true, [s[0], s[s.length - 1]]) : s)) }, [])

  const api = useMemo(() => ({ stack, push, pop, replace, reset, tab, setTab, goTab, toast, toastMsg, sheet, openSheet: setSheet, closeSheet: () => setSheet(null), prefs, setPref: (k, v) => setPrefs((p) => ({ ...p, [k]: v })), state, setState, W, H, screens, remove, onExit }),
    [stack, tab, toastMsg, sheet, prefs, state, push, pop, replace, reset, toast, goTab, remove, onExit])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

/* one screen entry with its own progress mv (0 = visible, 1 = hidden) */
function Entry({ e, idx, n, coverP, setP }) {
  const { screens, remove, W, H, pop } = useApp()
  const p = useMotionValue(e.born ? 1 : 0)
  useEffect(() => { setP(e.id, p) }, [])
  useEffect(() => { if (e.born) { e.born = false; animate(p, 0, e.mode === 'modal' ? { type: 'spring', stiffness: 300, damping: 34 } : SPRING) } }, [])
  useEffect(() => {
    if (e.leaving) animate(p, 1, { type: 'spring', stiffness: 360, damping: 40, restDelta: 0.002 }).then(() => remove(e.id))
  }, [e.leaving])
  const isTop = idx === n - 1
  const zero = useMotionValue(0)
  const cov = coverP || zero
  const coverMode = coverP ? coverP.mode : null
  // own transform when top
  const x = useTransform([p, cov], ([a, c]) => {
    if (e.mode === 'push') { const own = a * W.current; const under = coverMode === 'push' ? -(1 - c) * 0.28 * W.current : 0; return own + under }
    return coverMode === 'push' ? -(1 - c) * 0.28 * W.current : 0
  })
  const y = useTransform(p, (a) => (e.mode === 'modal' ? a * H.current : 0))
  const op = useTransform(p, (a) => (e.mode === 'fade' ? 1 - a : 1))
  const sc = useTransform([p, cov], ([a, c]) => (e.mode === 'fade' ? 1.04 - (1 - a) * 0.04 : coverMode === 'modal' ? 1 - (1 - c) * 0.06 : 1))
  const dim = useTransform(cov, (c) => (coverMode ? (1 - c) * (coverMode === 'modal' ? 0.5 : 0.35) : 0))
  const rad = useTransform(cov, (c) => (coverMode === 'modal' ? (1 - c) * 40 : 0))
  const shadow = e.mode === 'push' && idx > 0 ? '-20px 0 40px rgba(0,0,0,.45)' : 'none'
  const hidden = idx < n - 2 && !(n >= 2 && idx === n - 2)
  const S = screens[e.name]
  // edge swipe back
  const drag = useRef(null)
  const onDown = (ev) => {
    if (!isTop || idx === 0 || e.mode === 'fade') return
    const r = ev.currentTarget.getBoundingClientRect()
    const lx = ev.clientX - r.left, ly = ev.clientY - r.top
    const ok = e.mode === 'push' ? lx < 26 : ly < 90
    if (!ok) return
    drag.current = { x: ev.clientX, y: ev.clientY, t: performance.now(), scale: r.width / W.current }
    ev.currentTarget.setPointerCapture(ev.pointerId)
  }
  const onMove = (ev) => {
    if (!drag.current) return
    const d = e.mode === 'push' ? (ev.clientX - drag.current.x) / drag.current.scale / W.current : (ev.clientY - drag.current.y) / drag.current.scale / H.current
    p.set(Math.max(0, Math.min(1, d)))
  }
  const onUp = (ev) => {
    if (!drag.current) return
    const dt = performance.now() - drag.current.t
    const v = p.get() / (dt / 1000)
    drag.current = null
    if (p.get() > 0.35 || v > 1.4) pop()
    else animate(p, 0, SPRING)
  }
  return (
    <motion.div className="screen" style={{ x, y, opacity: op, scale: sc, zIndex: idx + 1, boxShadow: shadow, visibility: hidden ? 'hidden' : 'visible', borderRadius: rad, pointerEvents: isTop ? 'auto' : 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="appbg" />
      {S ? <S {...e.params} /> : <div style={{ padding: 80 }}>Tela {e.name}</div>}
      <motion.div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim, pointerEvents: 'none', zIndex: 99 }} />
    </motion.div>
  )
}

export function Stack() {
  const { stack } = useApp()
  const ps = useRef({})
  const [, force] = useState(0)
  const setP = (id, mv) => { ps.current[id] = mv; force((x) => x + 1) }
  return (
    <>
      {stack.map((e, i) => {
        const next = stack[i + 1]
        let coverP = null
        if (next && ps.current[next.id]) { coverP = ps.current[next.id]; coverP.mode = next.mode }
        return <Entry key={e.id} e={e} idx={i} n={stack.length} coverP={coverP} setP={setP} />
      })}
    </>
  )
}
