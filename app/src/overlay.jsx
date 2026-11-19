import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from './store'
import { Icon } from './ui'
import { vibrate } from './format'
import { sfx } from './sound'

export function SheetHost() {
  const { sheet, closeSheet } = useApp()
  React.useEffect(() => { if (sheet) sfx('sheet') }, [sheet])
  return (
    <AnimatePresence>
      {sheet && (
        <React.Fragment key={sheet.key || 'sheet'}>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSheet} />
          <motion.div className={`sheet ${sheet.light ? 'light' : ''}`} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 330, damping: 34 }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.05, bottom: 0.7 }} dragDirectionLock
            onDragEnd={(e, i) => { if (i.offset.y > 110 || i.velocity.y > 600) closeSheet() }}>
            <div className="grab" />
            {sheet.render(closeSheet)}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  )
}

export function ToastHost() {
  const { toastMsg } = useApp()
  return (
    <AnimatePresence>
      {toastMsg && (
        <motion.div key={toastMsg.k} className="toast glass" style={{ x: '-50%' }} initial={{ opacity: 0, scaleX: 0.35, scaleY: 0.8 }} animate={{ opacity: 1, scaleX: 1, scaleY: 1 }} exit={{ opacity: 0, scaleX: 0.35, scaleY: 0.8 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
          <Icon n={toastMsg.icon} s={18} c="#0EDBB9" />{toastMsg.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------- simulated iOS keyboard (desktop only) ------------- */
const setVal = (el, v) => {
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true }))
}
const ROWS = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del']]
const NUMROWS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']]
const SUBS = { 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO', 7: 'PQRS', 8: 'TUV', 9: 'WXYZ' }

export function Keyboard({ rootRef, enabled, touch }) {
  const [el, setEl] = useState(null)
  const [shift, setShift] = useState(false)
  const [sym, setSym] = useState(false)
  useEffect(() => {
    if (!enabled) return
    const root = rootRef.current
    const fi = (e) => { const t = e.target; if (t.tagName === 'INPUT' && !t.dataset.nokb) { if (touch) { if (t.dataset.im == null) t.dataset.im = t.inputMode || ''; t.setAttribute('inputmode', 'none') } setEl(t) } }
    const fo = () => setTimeout(() => { const a = document.activeElement; if (!a || a.tagName !== 'INPUT' || !root.contains(a)) setEl(null) }, 30)
    const pd = (e) => { const t = e.target.closest ? e.target.closest('input') : null; if (touch && t && !t.dataset.nokb) { if (t.dataset.im == null) t.dataset.im = t.inputMode || ''; t.setAttribute('inputmode', 'none') } }
    root.addEventListener('focusin', fi); root.addEventListener('focusout', fo); root.addEventListener('pointerdown', pd, true)
    return () => { root.removeEventListener('focusin', fi); root.removeEventListener('focusout', fo); root.removeEventListener('pointerdown', pd, true) }
  }, [enabled])
  useEffect(() => {
    const root = rootRef.current
    const im = el ? (el.dataset.im != null ? el.dataset.im : el.inputMode) : ''
    root.style.setProperty('--kb', el ? (im === 'numeric' || im === 'decimal' ? '252px' : '268px') : '0px')
    root.classList.toggle('kb-open', !!el)
    if (!el) return
    // mantém o campo visível acima do teclado
    const fit = () => {
      const sc = el.closest('.scroll'); if (!sc) return
      const d = root.getBoundingClientRect(), k = d.width / root.offsetWidth
      const r = el.closest('.inp, .field, label') || el
      const rb = (r.getBoundingClientRect().bottom - d.top) / k
      const lay = sc.closest('.layer'); const cta = lay ? lay.querySelector(':scope > .cta') : null
      const ctaH = cta ? cta.offsetHeight : 0
      const kbH = parseFloat(getComputedStyle(root).getPropertyValue('--kb')) || 0
      const limit = root.offsetHeight - kbH - ctaH - 16
      if (rb > limit) sc.scrollBy({ top: rb - limit, behavior: 'smooth' })
      const rt = (r.getBoundingClientRect().top - d.top) / k
      if (rt < 110) sc.scrollBy({ top: rt - 110, behavior: 'smooth' })
    }
    const t = setTimeout(fit, 320)
    const iv = setInterval(() => { if (!el.isConnected || !root.contains(el)) setEl(null) }, 250)
    const off = () => setEl(null)
    window.addEventListener('rd-kb-close', off)
    return () => { clearTimeout(t); clearInterval(iv); window.removeEventListener('rd-kb-close', off) }
  }, [el])
  const press = (k) => {
    if (!el) return
    vibrate(4)
    const ml = el.maxLength > 0 ? el.maxLength : 1e9
    if (k === 'del') { setVal(el, el.value.slice(0, -1)); return }
    if (k === 'shift') { setShift((s) => !s); return }
    if (k === 'sym') { setSym((s) => !s); return }
    if (k === 'ret') { el.form ? el.form.requestSubmit() : el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); el.blur(); return }
    if (el.value.length >= ml) return
    const ch = k === 'space' ? ' ' : shift ? k.toUpperCase() : k
    setVal(el, el.value + ch); if (shift) setShift(false)
  }
  const im2 = el ? (el.dataset.im != null ? el.dataset.im : el.inputMode) : ''
  const numeric = el && (im2 === 'numeric' || im2 === 'decimal')
  const keyStyle = { height: 42, borderRadius: 6, background: 'rgba(255,255,255,.28)', fontSize: 22, fontWeight: 400, display: 'grid', placeItems: 'center', boxShadow: '0 1px 0 rgba(0,0,0,.35)', color: '#fff' }
  const dark = { ...keyStyle, background: 'rgba(255,255,255,.13)', fontSize: 15 }
  const pd = (e) => e.preventDefault()
  return (
    <AnimatePresence>
      {el && (
        <motion.div key="kb" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          onPointerDown={pd} onMouseDown={pd}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 80, padding: '8px 4px 30px', background: 'rgba(42,44,56,.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          {numeric ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, padding: '0 4px' }}>
              {NUMROWS.flat().map((k, i) => (
                <motion.button key={i} whileTap={{ background: 'rgba(255,255,255,.5)' }} onClick={() => k && press(k)} style={{ ...keyStyle, height: 48, visibility: k ? 'visible' : 'hidden', background: k === 'del' ? 'transparent' : keyStyle.background, boxShadow: k === 'del' ? 'none' : keyStyle.boxShadow, flexDirection: 'column', lineHeight: 1 }}>
                  {k === 'del' ? <Icon n="Delete" s={24} /> : <><span style={{ fontSize: 25 }}>{k}</span>{SUBS[k] && <span style={{ fontSize: 9, letterSpacing: '.15em', fontWeight: 600, marginTop: 1 }}>{SUBS[k]}</span>}</>}
                </motion.button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {(sym ? [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], ['-', '/', ':', ';', '(', ')', '$', '&', '@'], ['.', ',', '?', '!', "'", '_', 'del']] : ROWS).map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: ri === 1 && !sym ? '0 18px' : 0 }}>
                  {row.map((k) => (
                    <motion.button key={k} whileTap={{ scale: 1.12, background: 'rgba(255,255,255,.55)' }} onClick={() => press(k)}
                      style={k === 'shift' || k === 'del' ? { ...dark, width: 44, background: k === 'shift' && shift ? '#fff' : dark.background, color: k === 'shift' && shift ? '#000' : '#fff' } : { ...keyStyle, flex: 1, maxWidth: 34 }}>
                      {k === 'shift' ? <Icon n="ArrowBigUp" s={20} /> : k === 'del' ? <Icon n="Delete" s={20} /> : shift ? k.toUpperCase() : k}
                    </motion.button>
                  ))}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => press('sym')} style={{ ...dark, width: 88 }}>{sym ? 'ABC' : '123'}</button>
                <button onClick={() => press('@')} style={{ ...dark, width: 44 }}>@</button>
                <motion.button whileTap={{ background: 'rgba(255,255,255,.5)' }} onClick={() => press('space')} style={{ ...keyStyle, flex: 1, fontSize: 15 }}>espaço</motion.button>
                <button onClick={() => press('ret')} style={{ ...dark, width: 88, background: '#0A84FF' }}>ir</button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
