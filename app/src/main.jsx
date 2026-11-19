import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useMotionValue, animate, useTransform } from 'framer-motion'
import QRCode from 'qrcode'
import './styles.css'
import { AppProvider, Stack, useApp } from './store'
import { SheetHost, ToastHost, Keyboard } from './overlay'
import { Icon, Logo, Wordmark, Spark, Avatar } from './ui'
import { FIGMA_URL, GITHUB_URL, TEAM, PAT_SERIES } from './data'
import { vibrate } from './format'
import { sfx } from './sound'
const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms) } catch (e) {} }

import * as A from './screens/auth'
import { Tabs } from './screens/tabs'
import * as M from './screens/money'
import * as B from './screens/banks'
import * as C from './screens/card'

const SCREENS = {
  splash: A.Splash, intro: A.Intro, login: A.Login, biometria: A.Biometria, recuperar: A.Recuperar, cadastro: A.Cadastro, otp: A.OTP, senha: A.Senha, contaCriada: A.ContaCriada, sobre: A.Sobre,
  tabs: Tabs,
  investir: M.Investir, resgatar: M.Resgatar, sucesso: M.Sucesso, ativo: M.Ativo, graficos: M.Graficos, mercadoBusca: M.MercadoBusca, metas: M.Metas, meta: M.Meta, novaMeta: M.NovaMeta,
  extrato: M.Extrato, notificacoes: M.Notificacoes, config: M.Config, perfilInv: M.PerfilInv, dados: M.Dados, ajuda: M.Ajuda, txDetalhe: M.TxDetalhe,
  ofHub: B.OfHub, ofConectar: B.OfConectar, ofPermissoes: B.OfPermissoes, ofSync: B.OfSync, ofErro: B.OfErro, ofPronto: B.OfPronto, ofContas: B.OfContas,
  extratoUni: B.ExtratoUni, pixDetalhe: B.PixDetalhe, classificar: B.Classificar, categorias: B.Categorias, pix: B.Pix, pixChaves: B.PixChaves, pixCobrar: B.PixCobrar, pixEnviar: B.PixEnviar, pixValor: B.PixValor,
  cartao: C.Cartao, fatura: C.Fatura, controles: C.Controles, cartaoEstados: C.CartaoEstados, empresa: C.Empresa, dashboard: C.Dashboard, cobrancas: C.Cobrancas, socios: C.Socios,
}

const isMobile = () => window.matchMedia('(max-width: 600px), (pointer: coarse) and (max-width: 1024px)').matches
// iPhone instalado na tela de início: a Ilha/entalhe de verdade aparece sobre o app; nos outros celulares, desenhamos
const nativeIsland = () => /iPhone/.test(navigator.userAgent) && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone)
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || new URLSearchParams(location.search).has('app')

function useClock() {
  const [d, setD] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setD(new Date()), 10000); return () => clearInterval(t) }, [])
  return d
}
const SHOT = new URLSearchParams(location.search).has('shot')
const hm = (d) => (SHOT ? '9:41' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

function StatusBar({ dark }) {
  const d = useClock()
  return (
    <div className="statusbar" style={{ color: dark ? '#000' : '#fff' }}>
      <span>{hm(d)}</span>
      <span className="r">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.6c2.2 0 4.2.9 5.7 2.3l1.1-1.1A9.6 9.6 0 0 0 8 1C5.4 1 3 2 1.2 3.8l1.1 1.1A8 8 0 0 1 8 2.6Zm0 3.2c1.3 0 2.5.5 3.4 1.4l1.1-1.1A6.3 6.3 0 0 0 8 4.2c-1.7 0-3.3.7-4.5 1.9l1.1 1.1A4.8 4.8 0 0 1 8 5.8Zm0 3.2c-.5 0-1 .2-1.3.5L8 10.8l1.3-1.3C9 9.2 8.5 9 8 9Z" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".5" /></svg>
      </span>
    </div>
  )
}

/* ---------------- iOS lock ---------------- */
function Lock({ onUnlock }) {
  const d = useClock()
  const y = useMotionValue(0)
  const op = useTransform(y, [-260, 0], [0, 1])
  const date0 = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); const date = date0.charAt(0).toUpperCase() + date0.slice(1)
  const notes = [['Rendash', 'Rendimento creditado', 'Tesouro Selic rendeu + R$ 45,20 hoje.', 'agora'], ['Rendash', 'Pix recebido', 'Marina Costa enviou R$ 3.200,00 para você.', '12 min']]
  return (
    <motion.div className="layer" style={{ y, opacity: op, zIndex: 20 }} drag="y" dragConstraints={{ top: -400, bottom: 0 }} dragElastic={{ top: 0.6, bottom: 0.05 }}
      onDragEnd={(e, i) => { if (i.offset.y < -120 || i.velocity.y < -500) onUnlock(); else animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 }) }}
      exit={{ y: -900, transition: { type: 'spring', stiffness: 200, damping: 30 } }}>
      <div className="ios-wall" />
      <div style={{ position: 'absolute', top: 'calc(var(--safe-top) + 6px)', left: 0, right: 0, textAlign: 'center' }}>
        <Icon n="Lock" s={18} />
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 6, opacity: 0.9 }}>{date}</div>
        <div className="num" style={{ fontSize: 92, fontWeight: 650, lineHeight: 1, letterSpacing: '-.03em', marginTop: 2, textShadow: '0 4px 30px rgba(0,0,0,.2)' }}>{hm(d)}</div>
      </div>
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 'calc(var(--safe-bot) + 110px)' }}>
        {notes.map(([app, t, b, q], i) => (
          <motion.button key={i} onClick={onUnlock} initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.25, type: 'spring', stiffness: 260, damping: 24 }}
            className="glass row" style={{ width: '100%', textAlign: 'left', borderRadius: 22, padding: '12px 14px', marginBottom: 8, background: 'rgba(30,30,50,.35)', alignItems: 'flex-start' }}>
            <img src="img/appicon.png" style={{ width: 38, height: 38, borderRadius: 9 }} />
            <div className="grow"><div className="between"><b style={{ fontSize: 14 }}>{t}</b><span style={{ fontSize: 12, opacity: 0.6 }}>{q}</span></div><div style={{ fontSize: 13.5, opacity: 0.9, marginTop: 1 }}>{b}</div></div>
          </motion.button>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 46, right: 46, bottom: 'calc(var(--safe-bot) + 26px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {['Flashlight', 'Camera'].map((i) => <button key={i} className="glass" style={{ width: 50, height: 50, borderRadius: 25, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.25)' }}><Icon n={i} s={22} /></button>)}
      </div>
      <motion.div animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: 'calc(var(--safe-bot) + 8px)', left: 0, right: 0, textAlign: 'center', fontSize: 13, fontWeight: 500 }}>Deslize para cima ou toque para abrir</motion.div>
    </motion.div>
  )
}

/* ---------------- iOS home ---------------- */
const APPS = [
  ['Mensagens', 'MessageCircle', 'linear-gradient(#5BF675,#0CBD2A)'], ['Calendário', 'cal', '#fff'], ['Fotos', 'flower', '#fff'], ['Câmera', 'Camera', 'linear-gradient(#d9d9d9,#8e8e8e)'],
  ['Mapas', 'Map', 'linear-gradient(#7fe08d,#55b4f5)'], ['Clima', 'CloudSun', 'linear-gradient(#4aa8ff,#1d6bd9)'], ['Notas', 'NotebookPen', 'linear-gradient(#fff 30%,#ffd84d 30%)'], ['Ajustes', 'Settings', 'linear-gradient(#b0b0b8,#6d6d75)'],
]
const DOCK = [['Phone', 'linear-gradient(#5BF675,#0CBD2A)'], ['Compass', 'linear-gradient(#fff,#e8f2ff)'], ['Mail', 'linear-gradient(#4ab0ff,#1d6bd9)'], ['Music', 'linear-gradient(#ff5c7a,#fa233b)']]
function AppTile({ name, icon, bg }) {
  const [shake, setShake] = useState(0)
  const content = icon === 'cal' ? <div style={{ color: '#000', textAlign: 'center', lineHeight: 1 }}><div style={{ fontSize: 9, color: '#f33', fontWeight: 700, textTransform: 'uppercase' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</div><div style={{ fontSize: 30, fontWeight: 300 }}>{new Date().getDate()}</div></div>
    : icon === 'flower' ? <svg width="40" height="40" viewBox="0 0 40 40">{['#f9b233', '#f37021', '#e6007e', '#a3519f', '#3a7fc1', '#2fb7b0', '#6dbe45', '#d6d72f'].map((c, i) => <ellipse key={i} cx="20" cy="11" rx="5" ry="9" fill={c} opacity=".85" transform={`rotate(${i * 45} 20 20)`} />)}</svg>
      : <Icon n={icon} s={30} c={['Notas'].includes(name) ? '#c9a100' : '#fff'} />
  return (
    <motion.button className="app" animate={shake ? { rotate: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} whileTap={{ scale: 0.88 }} onClick={() => { setShake((s) => s + 1); vibrate(20) }} key={shake}>
      <div className="ai" style={{ background: bg }}>{content}</div>{name}
    </motion.button>
  )
}
function Home({ onOpen, iconRef }) {
  const [hint, setHint] = useState(false)
  useEffect(() => { const t = setTimeout(() => setHint(true), 1800); return () => clearTimeout(t) }, [])
  const s = PAT_SERIES['1M']
  return (
    <motion.div className="layer" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 26 }}>
      <div className="ios-wall" style={{ filter: 'saturate(1.1)' }} />
      <div style={{ position: 'absolute', top: 'calc(var(--safe-top) + 14px)', left: 0, right: 0 }}>
        {/* widget */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, padding: '0 22px', marginBottom: 22 }}>
          <motion.button onClick={(e) => onOpen(e.currentTarget)} whileTap={{ scale: 0.95 }} className="glass" style={{ gridColumn: 'span 2', borderRadius: 24, padding: 16, textAlign: 'left', background: 'rgba(10,14,27,.55)', height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="between"><span className="row" style={{ gap: 8 }}><img src="img/appicon.png" style={{ width: 22, borderRadius: 6 }} /><b style={{ fontSize: 13 }}>Rendash</b></span><span className="badge">+2,41% hoje</span></div>
            <div className="between" style={{ alignItems: 'flex-end' }}>
              <div><div style={{ fontSize: 11, opacity: 0.6, letterSpacing: '.08em' }}>PATRIMÔNIO</div><div className="num" style={{ fontSize: 26, fontWeight: 700 }}>R$ 124.850<span style={{ fontSize: 15, opacity: 0.55 }}>,32</span></div></div>
              <Spark data={s} w={120} h={46} delay={0.6} />
            </div>
          </motion.button>
        </div>
        <div className="appgrid">
          {APPS.map(([n, i, bg]) => <AppTile key={n} name={n} icon={i} bg={bg} />)}
          <div className="app" style={{ position: 'relative' }}>
            <motion.button ref={iconRef} onClick={(e) => onOpen(e.currentTarget)} whileTap={{ scale: 0.86 }} className="ai" style={{ padding: 0 }}>
              <img src="img/appicon.png" style={{ width: '100%', height: '100%' }} />
            </motion.button>
            <motion.span className="app-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 18 }}>2</motion.span>
            Rendash
            <AnimatePresence>{hint && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="glass" style={{ position: 'absolute', top: 88, left: -12, zIndex: 3, whiteSpace: 'nowrap', padding: '7px 12px', borderRadius: 14, fontSize: 12, fontWeight: 600, background: 'rgba(14,219,185,.9)', color: '#04130F' }}>
                Toque para abrir
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1 }} style={{ position: 'absolute', top: -8, left: 36, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '8px solid rgba(14,219,185,.9)' }} />
              </motion.div>
            )}</AnimatePresence>
          </div>
        </div>
      </div>
      <div className="glass" style={{ position: 'absolute', bottom: 'calc(var(--safe-bot) + 116px)', left: '50%', transform: 'translateX(-50%)', padding: '7px 16px', borderRadius: 18, fontSize: 13, background: 'rgba(255,255,255,.18)' }}><span className="row" style={{ gap: 6 }}><Icon n="Search" s={14} />Buscar</span></div>
      <div className="dock glass" style={{ bottom: 'calc(var(--safe-bot) + 6px)', background: 'rgba(255,255,255,.18)' }}>
        {DOCK.map(([i, bg]) => <motion.button key={i} whileTap={{ scale: 0.88 }} className="app"><div className="ai" style={{ background: bg }}><Icon n={i} s={30} c={i === 'Compass' ? '#1d6bd9' : '#fff'} /></div></motion.button>)}
      </div>
    </motion.div>
  )
}


/* ---------------- Dynamic Island (live activity) ---------------- */
const ISLAND_ICON = { pix: ['pix', '#32BCAD'], investir: ['TrendingUp', '#0EDBB9'], resgatar: ['ArrowDownToLine', '#0EDBB9'], fatura: ['CreditCard', '#8E7CFF'], meta: ['PiggyBank', '#0EDBB9'], banco: ['Landmark', '#0EDBB9'], ok: ['Check', '#0EDBB9'] }
function Island({ floating, maxW = 362 }) {
  const [d, setD] = useState(null)
  useEffect(() => {
    let t
    const on = (e) => { clearTimeout(t); setD({ ...e.detail, k: Date.now() }); t = setTimeout(() => setD(null), e.detail.ms || 3200) }
    window.addEventListener('rd-island', on); return () => { window.removeEventListener('rd-island', on); clearTimeout(t) }
  }, [])
  const big = !!d
  const [ic, col] = ISLAND_ICON[d?.kind] || ISLAND_ICON.ok
  return (
    <motion.div className={`island ${floating ? 'floating' : ''}`} initial={false} style={{ x: '-50%' }} onClick={() => setD(null)}
      animate={floating ? { width: big ? 'min(362px, calc(100% - 20px))' : 124, height: big ? 78 : 36, borderRadius: big ? 40 : 20, opacity: big ? 1 : 0, scale: big ? 1 : 0.7, y: big ? 0 : -24 } : { width: big ? maxW : 124, height: big ? 78 : 36, borderRadius: big ? 40 : 20, top: big ? 9 : 11 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.9 }}>
      <AnimatePresence>
        {big && (
          <motion.div key={d.k} initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { delay: 0.12 } }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(6px)', transition: { duration: 0.15 } }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px 0 16px' }}>
            <motion.div initial={{ scale: 0.4, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.18 }}
              style={{ width: 46, height: 46, borderRadius: 23, display: 'grid', placeItems: 'center', background: col + '26', flex: 'none' }}>
              {ic === 'pix' ? <Logo k="pix" s={26} /> : <Icon n={ic} s={24} c={col} w={2.4} />}
            </motion.div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.sub || 'Rendash'}</div>
              <div style={{ fontSize: 15.5, fontWeight: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
            </div>
            {d.value && <div className="num" style={{ fontSize: 17, fontWeight: 700, color: col, flex: 'none' }}>{d.value}</div>}
          </motion.div>
        )}
      </AnimatePresence>
      <i className="cam" style={{ opacity: big ? 0 : 1 }} />
    </motion.div>
  )
}

/* ---------------- iOS notification banner ---------------- */
function Banner() {
  const [d, setD] = useState(null)
  useEffect(() => {
    let t
    const on = (e) => { clearTimeout(t); setD({ ...e.detail, k: Date.now() }); buzz(12); t = setTimeout(() => setD(null), e.detail.ms || 5000) }
    window.addEventListener('rd-banner', on); return () => { window.removeEventListener('rd-banner', on); clearTimeout(t) }
  }, [])
  return (
    <AnimatePresence>
      {d && (
        <motion.button key={d.k} className="ios-banner" style={{ top: 'calc(var(--safe-top) + 2px)' }}
          initial={{ y: -140, scale: 0.92, opacity: 0.4 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -140, scale: 0.94, opacity: 0, transition: { type: 'spring', stiffness: 320, damping: 32 } }}
          transition={{ type: 'spring', stiffness: 330, damping: 24 }}
          drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.9, bottom: 0.15 }} onDragEnd={(e, i) => { if (i.offset.y < -30) setD(null) }}
          onClick={() => { setD(null); if (d.go && window.__app) window.__app.push(d.go) }}>
          <img src="img/appicon.png" style={{ width: 38, height: 38, borderRadius: 9, flex: 'none' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="between"><b style={{ fontSize: 14.5 }}>{d.title}</b><span style={{ fontSize: 12.5, opacity: 0.6 }}>agora</span></div>
            <div style={{ fontSize: 14, opacity: 0.92, marginTop: 1, lineHeight: 1.3 }}>{d.body}</div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ---------------- running app ---------------- */
function AppInner({ deviceRef, desktop }) {
  const app = useApp()
  const { W, H } = app
  useEffect(() => { window.__app = app })
  useLayoutEffect(() => {
    const upd = () => { const r = deviceRef.current; if (r) { W.current = r.offsetWidth; H.current = r.offsetHeight } }
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd)
  }, [])
  return (
    <>
      <Stack />
      <SheetHost />
      <ToastHost />
    </>
  )
}

let firstOpen = true
function Device({ mobile, sim, jump, setJump }) {
  const ref = useRef(null)
  const iconRef = useRef(null)
  const sa = standalone()
  const [phase, setPhase] = useState(sa ? 'app' : 'lock')
  const [origin, setOrigin] = useState(null)
  const [appKey, setAppKey] = useState(1)
  const [initial, setInitial] = useState({ name: 'splash', params: { next: 'intro' } })

  useEffect(() => {
    if (!jump) return
    setInitial(jump); setAppKey((k) => k + 1); setPhase('app'); setOrigin(null); setJump(null)
  }, [jump])

  const open = (el) => {
    const d = ref.current.getBoundingClientRect(), r = (el || iconRef.current).getBoundingClientRect()
    const sc = d.width / ref.current.offsetWidth
    const o = { x: (r.left + r.width / 2 - d.left) / sc, y: (r.top + r.height / 2 - d.top) / sc, w: r.width / sc, h: r.height / sc }
    setOrigin(o)
    setInitial({ name: 'splash', params: { next: firstOpen ? 'intro' : 'biometria', from: o.w < 120 ? o : null } }); firstOpen = false
    setAppKey((k) => k + 1); setPhase('app'); buzz(10); sfx('open')
  }
  const close = () => { if (phase === 'app') { try { document.activeElement && document.activeElement.blur() } catch (e) {} window.dispatchEvent(new Event('rd-kb-close')); setPhase('home'); buzz(8); sfx('close') } }
  const w = ref.current ? ref.current.offsetWidth : 393, h = ref.current ? ref.current.offsetHeight : 852
  const R = mobile ? 0 : 56
  const clipOf = (o) => { const t = o.y - o.h / 2, l = o.x - o.w / 2; return `inset(${t}px ${w - l - o.w}px ${h - t - o.h}px ${l}px round ${o.w < 120 ? 14 : 24}px)` }
  const full = `inset(0px 0px 0px 0px round ${R}px)`
  // home indicator swipe
  const ind = useRef(null)
  return (
    <div className="device" ref={ref}>
      <AnimatePresence>
        {phase === 'lock' && <Lock key="lock" onUnlock={() => { buzz(10); sfx('unlock'); setPhase('home') }} />}
      </AnimatePresence>
      {phase !== 'lock' && <Home onOpen={open} iconRef={iconRef} />}
      <AnimatePresence>
        {phase === 'app' && (
          <motion.div key={appKey} className="layer" style={{ zIndex: 10, overflow: 'hidden', background: '#0A0E1B' }}
            initial={origin ? { clipPath: clipOf(origin), opacity: 1 } : { opacity: 0, clipPath: full }} animate={{ clipPath: full, opacity: 1 }}
            exit={origin ? { clipPath: clipOf(origin), opacity: 0, transition: { clipPath: { type: 'spring', stiffness: 260, damping: 30 }, opacity: { duration: 0.25, delay: 0.12 } } } : { opacity: 0 }}
            transition={{ clipPath: { type: 'spring', stiffness: 210, damping: 26, mass: 0.9 }, opacity: { duration: 0.2 } }}>
            <AppProvider screens={SCREENS} initial={initial.name} initialParams={initial.params} key={appKey}>
              <AppRoot initial={initial} deviceRef={ref} />
            </AppProvider>
          </motion.div>
        )}
      </AnimatePresence>
      <StatusBar />
      <Banner />
      <Keyboard rootRef={ref} enabled touch={isMobile()} />
      {mobile && <Island floating={!sim} maxW={Math.min(362, (ref.current ? ref.current.offsetWidth : window.innerWidth) - 24)} />}
      <div className="home-ind" ref={ind}
        onPointerUp={() => { if (phase === 'lock') { sfx('unlock'); buzz(10); setPhase('home'); return } close() }}
        title={phase === 'app' ? 'Voltar à tela inicial' : ''}>
        <i style={{ opacity: phase === 'home' ? 0.35 : 0.9 }} />
      </div>
    </div>
  )
}
function AppRoot({ initial, deviceRef }) {
  return <AppInner deviceRef={deviceRef} />
}

/* ---------------- page ---------------- */
function Side({ onJump }) {
  const [qr, setQr] = useState('')
  useEffect(() => { QRCode.toDataURL(location.href.split('?')[0], { margin: 1, width: 220, color: { dark: '#0A0E1B', light: '#ffffff' } }).then(setQr) }, [])
  const jumps = [['Início do app', { name: 'tabs', params: {} }], ['Login', { name: 'login', params: {} }], ['Primeiro acesso', { name: 'intro', params: {} }], ['Investir', { name: 'investir', params: { id: 'selic' } }], ['Open Finance', { name: 'ofHub', params: {} }], ['Cartão', { name: 'cartao', params: {} }], ['Créditos', { name: 'sobre', params: {} }]]
  return (
    <aside className="side">
      <Wordmark h={34} style={{ marginBottom: 18 }} />
      <h1>Protótipo interativo do app</h1>
      <p>Toque no ícone do Rendash na tela inicial do iPhone. Tudo é clicável, com animações reais. Use o traço embaixo do celular para voltar à tela inicial e arraste da borda esquerda para voltar uma tela.</p>
      <button className="lnk" onClick={() => window.open(FIGMA_URL, '_blank')}><Icon n="Figma" s={20} c="#0EDBB9" /><span>Projeto no Figma<small>Telas e design system</small></span></button>
      <button className="lnk" onClick={() => window.open(GITHUB_URL, '_blank')}><Icon n="Github" s={20} c="#0EDBB9" /><span>Código no GitHub<small>Protótipo e documentação</small></span></button>
      <div className="lnk" style={{ display: 'block', cursor: 'default' }}>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>Ir direto para</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {jumps.map(([l, j]) => <button key={l} className="chip" style={{ fontSize: 12 }} onClick={() => onJump(j)}>{l}</button>)}
        </div>
      </div>
      {qr && <div className="row" style={{ gap: 14, marginTop: 6 }}><img src={qr} style={{ width: 92, height: 92, borderRadius: 12 }} /><span style={{ fontSize: 12.5 }}>Abra no celular: o app ocupa a tela inteira e se ajusta a qualquer tamanho.</span></div>}
      <div className="team">
        <img src={TEAM[0].foto} /><img src={TEAM[1].foto} style={{ marginLeft: -18 }} />
        <span style={{ fontSize: 12.5 }}>Guilherme Matias e Julio Mendes<br /><span style={{ color: 'var(--t3)' }}>IFPE Garanhuns · 4º TI Tarde</span></span>
      </div>
    </aside>
  )
}

function Page() {
  const [mobile, setMobile] = useState(isMobile())
  const [scale, setScale] = useState(1)
  const [jump, setJump] = useState(null)
  const [wide, setWide] = useState(window.innerWidth > 900)
  useEffect(() => {
    const f = () => {
      const m = isMobile(); setMobile(m); setWide(window.innerWidth > 900)
      const small = window.innerWidth < 600
      setScale(m ? 1 : Math.min(small ? 1.2 : 1, (window.innerHeight - (small ? 28 : 48)) / 882, (window.innerWidth - (small ? 20 : 32)) / 425))
      document.documentElement.style.setProperty('--vh', window.innerHeight + 'px')
    }
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f)
  }, [])
  const sim = mobile && !nativeIsland()
  return (
    <div className={`page ${mobile ? 'mobile' : ''} ${sim ? 'sim' : ''} ${!mobile && !wide ? 'framed-small' : ''}`}>
      {!mobile && wide && <Side onJump={setJump} />}
      <div className="device-wrap" style={mobile ? {} : { transform: `scale(${scale})`, width: 393, height: 852, margin: `${(852 * scale - 852) / 2}px ${(393 * scale - 393) / 2}px` }}>
        {!mobile && <><div className="bezel" /><Island />
          <i className="btn-side" style={{ left: -16, top: 180, height: 32 }} /><i className="btn-side" style={{ left: -16, top: 236, height: 60 }} /><i className="btn-side" style={{ left: -16, top: 308, height: 60 }} /><i className="btn-side" style={{ right: -16, top: 250, height: 96 }} /></>}
        <Device mobile={mobile} sim={sim} jump={jump} setJump={setJump} />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<Page />)
if ('serviceWorker' in navigator && location.protocol === 'https:' && !SHOT) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}))
