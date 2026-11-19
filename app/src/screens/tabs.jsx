import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../store'
import { Tap, Icon, Header, CircBtn, Avatar, Logo, Money, Count, Seg, Chips, Li, LineChart, Spark, Bars, Ring, Donut, ProgressBar, Stagger, Item, Stat, Note, Btn, Wordmark, spring , Flow } from '../ui'
import { USER, PAT_SERIES, RANGES, ASSETS, ALOC, EARN, EARN_HIST, MARKET_IDX, STOCKS, TX, CARD, FIGMA_URL, GITHUB_URL, GOALS } from '../data'
import { brl, pct, num, iosBanner } from '../format'

const TABS = [
  { k: 'inicio', l: 'Início', i: 'House' },
  { k: 'carteira', l: 'Carteira', i: 'WalletCards' },
  { k: 'rendimentos', l: 'Rendimentos', i: 'ChartColumnBig' },
  { k: 'mercado', l: 'Mercado', i: 'ChartCandlestick' },
  { k: 'perfil', l: 'Perfil', i: 'CircleUserRound' },
]

let bannerShown = false
export function Tabs({ welcome, then }) {
  const { tab, setTab, toast, push } = useApp()
  useEffect(() => {
    if (welcome) setTimeout(() => toast(`Bem-vindo de volta, ${USER.primeiro}`, 'Hand'), 600)
    if (then) setTimeout(() => push(then), 900)
    if (!bannerShown && !location.search.includes('shot')) { bannerShown = true; let t, tries = 0
      const fire = () => { const a = window.__app; if (a && a.stack.length === 1 && !a.sheet && !document.querySelector('.kb-open')) iosBanner({ title: 'Rendimento creditado', body: 'Tesouro Selic rendeu + R$ 45,20 hoje. Toque para ver.', go: 'notificacoes' }); else if (++tries < 8) t = setTimeout(fire, 3000) }
      t = setTimeout(fire, 6500); return () => clearTimeout(t) }
  }, [])
  const C = { inicio: Inicio, carteira: Carteira, rendimentos: Rendimentos, mercado: Mercado, perfil: Perfil }[tab]
  return (
    <div className="layer">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={tab} className="layer" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.22 }}>
          <C />
        </motion.div>
      </AnimatePresence>
      <div className="tabfade" />
      <nav className="tabbar glass">
        {TABS.map((t) => (
          <Tap key={t.k} className={`tab ${tab === t.k ? 'on' : ''}`} scale={0.9} onClick={() => setTab(t.k)}>
            {tab === t.k && <motion.span layoutId="tabpill" className="pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <motion.span animate={tab === t.k ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 0.35 }}><Icon n={t.i} s={21} /></motion.span>
            {t.l}
          </Tap>
        ))}
      </nav>
    </div>
  )
}

const hello = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite' }

/* ---------------- INÍCIO ---------------- */
function Inicio() {
  const { push, prefs, setPref, setTab, state } = useApp()
  const [range, setRange] = useState('1M')
  const s = PAT_SERIES[range]
  const chg = ((s[s.length - 1] - s[0]) / s[0]) * 100
  const actions = [
    { l: 'Investir', i: 'Plus', go: () => push('investir', { id: 'selic' }) },
    { l: 'Resgatar', i: 'ArrowDownToLine', go: () => push('resgatar', { id: 'selic' }) },
    { l: 'Pix', i: 'pix', go: () => push('pix') },
    { l: 'Transferir', i: 'Send', go: () => push('pixEnviar') },
  ]
  const quick = [
    { l: 'Extrato', i: 'ReceiptText', go: () => push('extratoUni') }, { l: 'Bancos', i: 'Landmark', go: () => push('ofHub') },
    { l: 'Cartão', i: 'CreditCard', go: () => push('cartao') }, { l: 'Metas', i: 'Target', go: () => push('metas') },
    { l: 'Categorias', i: 'ChartPie', go: () => push('categorias') }, { l: 'Empresa', i: 'Building2', go: () => push('empresa') },
  ]
  return (
    <>
      <div className="header">
        <Tap onClick={() => setTab('perfil')} scale={0.92}><Avatar src={USER.foto} s={42} /></Tap>
        <div className="tt"><div className="sub" style={{ marginTop: 0 }}>{hello()},</div><h1 className="sm" style={{ fontSize: 18 }}>{USER.nome}</h1></div>
        <CircBtn n={prefs.hidden ? 'EyeOff' : 'Eye'} onClick={() => setPref('hidden', !prefs.hidden)} label="Ocultar saldo" />
        <CircBtn n="Bell" dot={!prefs.readAll} onClick={() => push('notificacoes')} label="Notificações" />
      </div>
      <div className="scroll">
        <Stagger gap={0.07}>
          <Item className="card hero">
            <div className="between">
              <span className="ovl">Patrimônio total</span>
              <Tap className="badge" onClick={() => push('ofHub')} style={{ cursor: 'pointer' }}><Icon n="Radio" s={11} />Ao vivo</Tap>
            </div>
            <div style={{ margin: '10px 0 8px' }}><Money v={state.patrimonio} size={36} hidden={prefs.hidden} delay={0.25} duration={1.8} /></div>
            <div className="row" style={{ gap: 8 }}>
              <motion.span key={range} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`badge ${chg < 0 ? 'neg' : ''}`}><Icon n={chg < 0 ? 'TrendingDown' : 'TrendingUp'} s={12} />{pct(chg, 2)}</motion.span>
              <span className="t2 num" style={{ fontSize: 12.5 }}>{prefs.hidden ? '•••• hoje' : <>+ <Count to={2930.12} delay={0.4} fmt={(v) => brl(v)} /> hoje</>}</span>
            </div>
            <div style={{ margin: '18px -4px 10px' }}><LineChart data={s} h={96} dkey={range} delay={0.5} /></div>
            <Seg items={RANGES} value={range} onChange={setRange} />
          </Item>

          <Item style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
            {actions.map((a, i) => (
              <Tap key={a.l} onClick={a.go} className="col" style={{ alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 550 }} scale={0.9}>
                <motion.div className="glass" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring, delay: 0.35 + i * 0.06 }} style={{ width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center' }}>
                  {a.i === 'pix' ? <div style={{ width: 22, height: 22 }}><PixGlyph /></div> : <Icon n={a.i} s={22} />}
                </motion.div>
                {a.l}
              </Tap>
            ))}
          </Item>

          <Item style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <Tap className="card row" style={{ flex: 1, padding: 14, gap: 10, textAlign: 'left' }} onClick={() => push('meta', { id: 'reserva' })} scale={0.97}>
              <Ring p={75} s={52} sw={5} delay={0.6}><span className="num" style={{ fontSize: 12, fontWeight: 700 }}>75%</span></Ring>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>Reserva</div><div className="t2" style={{ fontSize: 12 }}>R$ 15k de 20k</div></div>
            </Tap>
            <Tap className="card" style={{ flex: 1, padding: 14, textAlign: 'left' }} onClick={() => setTab('rendimentos')} scale={0.97}>
              <div className="ovl" style={{ fontSize: 10 }}>No mês</div>
              <div className="num pos" style={{ fontWeight: 700, fontSize: 19, marginTop: 4 }}>{prefs.hidden ? '••••' : <>+<Count to={2340} delay={0.6} fmt={(v) => brl(v, { cents: false })} /></>}</div>
              <div className="t2" style={{ fontSize: 12 }}>112% do CDI</div>
            </Tap>
          </Item>

          <Item>
            <Tap className="card row" style={{ marginTop: 14, width: '100%', textAlign: 'left' }} onClick={() => push('ofHub')} scale={0.98}>
              <div className="row" style={{ gap: 0 }}>
                {['rendash', 'itau', 'nubank'].map((k, i) => <div key={k} style={{ marginLeft: i ? -10 : 0, borderRadius: '50%', boxShadow: '0 0 0 2.5px #12152a' }}><Logo k={k} s={34} r={0.5} /></div>)}
              </div>
              <div className="grow"><div style={{ fontWeight: 600, fontSize: 14 }}>3 bancos conectados</div><div className="t2" style={{ fontSize: 12 }}>Open Finance · atualizado há 2 min</div></div>
              <Icon n="ChevronRight" s={18} c="rgba(255,255,255,.4)" />
            </Tap>
          </Item>

          <Item>
            <Tap className="card" style={{ marginTop: 14, width: '100%', textAlign: 'left' }} onClick={() => push('cartao')} scale={0.98}>
              <div className="between">
                <div className="row" style={{ minWidth: 0 }}><MiniCard /><div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 14 }}>Fatura de setembro</div><div className="t2" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Fecha em 3 dias · final {CARD.final}</div></div></div>
                <div className="num" style={{ fontWeight: 650, whiteSpace: 'nowrap', flex: 'none', marginLeft: 8 }}>{prefs.hidden ? '••••' : brl(CARD.fatura)}</div>
              </div>
              <div style={{ marginTop: 12 }}><ProgressBar p={43} delay={0.8} /></div>
              <div className="between t3" style={{ fontSize: 11, marginTop: 6 }}><span>Limite utilizado 43%</span><span>Disponível {brl(CARD.limite - CARD.usado)}</span></div>
            </Tap>
          </Item>

          <Item className="sec"><h3>Ações rápidas</h3><span className="t3" style={{ fontSize: 12 }}>{quick.length} atalhos</span></Item>
          <Item className="chips" style={{ gap: 10 }}>
            {quick.map((q) => (
              <Tap key={q.l} className="card col" onClick={q.go} style={{ alignItems: 'center', gap: 8, padding: '14px 4px', width: 84, flex: 'none', fontSize: 12, fontWeight: 550 }} scale={0.93}>
                <Icon n={q.i} s={22} c="#0EDBB9" />{q.l}
              </Tap>
            ))}
          </Item>

          <Item className="sec"><h3>Últimos movimentos</h3><button onClick={() => push('extratoUni')}>Ver todos</button></Item>
          <Item className="list">
            {TX.slice(0, 4).map((t) => <TxRow key={t.id} t={t} hidden={prefs.hidden} />)}
          </Item>
        </Stagger>
      </div>
    </>
  )
}
export function PixGlyph({ c = '#fff' }) {
  return <svg viewBox="0 0 24 24" width="100%" height="100%" fill={c}><path d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67.67 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156" /></svg>
}
export const MiniCard = () => (
  <div style={{ width: 44, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#1d2b4f,#0b1326 60%,#0EDBB9 140%)', border: '1px solid rgba(255,255,255,.15)', position: 'relative', flex: 'none' }}>
    <div style={{ position: 'absolute', left: 5, top: 8, width: 9, height: 7, borderRadius: 2, background: '#d4b25c' }} />
  </div>
)
export function TxRow({ t, hidden }) {
  const { push } = useApp()
  return (
    <Li logo={t.logo} icon={t.ic} title={t.t} sub={t.s} value={hidden ? '••••' : brl(t.v, { sign: true })} vcls={t.v > 0 ? 'pos' : ''} chevron={false}
      onClick={() => (t.id.startsWith('pix') ? push('pixDetalhe', { id: t.id }) : push('txDetalhe', { t }))} />
  )
}

/* ---------------- CARTEIRA ---------------- */
function Carteira() {
  const { push, prefs, openSheet } = useApp()
  const [sel, setSel] = useState(null)
  const total = ASSETS.reduce((a, b) => a + b.valor, 0)
  const list = sel == null ? ASSETS : ASSETS.filter((a) => a.tipo === ALOC[sel].k)
  const center = sel == null ? total : list.reduce((a, b) => a + b.valor, 0)
  return (
    <>
      <Header back={false} title="Minha carteira" sub="Atualizado agora" right={<CircBtn n="SlidersHorizontal" onClick={() => openSheet({ render: (c) => <FilterSheet close={c} sel={sel} setSel={setSel} /> })} />} />
      <div className="scroll">
        <Stagger>
          <Item className="card hero">
            <div className="row" style={{ gap: 18, alignItems: 'center' }}>
              <Donut parts={ALOC} s={148} sw={15} sel={sel} onSel={setSel}>
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div key={sel ?? 'all'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      <div className="ovl" style={{ fontSize: 9 }}>{sel == null ? 'Total' : ALOC[sel].k}</div>
                      <div className="num" style={{ fontWeight: 700, fontSize: 15 }}>{prefs.hidden ? '••••' : brl(center, { cents: false })}</div>
                      <div className="t3" style={{ fontSize: 10.5 }}>{sel == null ? '100%' : ALOC[sel].p + '%'}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Donut>
              <div className="grow col" style={{ gap: 4 }}>
                {ALOC.map((a, i) => (
                  <Tap key={a.k} className="between" onClick={() => setSel(sel === i ? null : i)} style={{ padding: '6px 8px', borderRadius: 10, background: sel === i ? 'rgba(255,255,255,.08)' : 'transparent', fontSize: 13 }} scale={0.96}>
                    <span className="row" style={{ gap: 8 }}><i style={{ width: 9, height: 9, borderRadius: 3, background: a.cor, boxShadow: `0 0 8px ${a.cor}` }} />{a.k}</span>
                    <b className="num">{a.p}%</b>
                  </Tap>
                ))}
              </div>
            </div>
            <div className="between" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.07)' }}>
              <span className="t2" style={{ fontSize: 13 }}>Valor investido</span>
              <b className="num">{prefs.hidden ? '••••' : <Count to={total - 6900} fmt={(v) => brl(v)} />}</b>
            </div>
          </Item>
          <Item className="sec"><h3>{sel == null ? 'Ativos na carteira' : ALOC[sel].k}</h3><button onClick={() => setSel(null)}>{sel == null ? `${ASSETS.length} ativos` : 'Ver todos'}</button></Item>
          <Item>
            <motion.div layout className="list">
              <AnimatePresence initial={false}>
                {list.map((a) => (
                  <motion.div key={a.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Li logo={a.logo} title={a.nome} sub={a.sub} value={prefs.hidden ? '••••' : brl(a.valor, { cents: false })} vsub={<span className="pos">{pct(a.rent)}</span>} onClick={() => push('ativo', { id: a.id })} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Item>
          <Item className="card row" style={{ marginTop: 14, alignItems: 'flex-start' }}>
            <Icon n="Sparkles" s={18} c="#0EDBB9" style={{ flex: 'none', marginTop: 2 }} />
            <div style={{ fontSize: 13 }}><b>Sua carteira está bem diversificada.</b> <span className="t2">Risco atual: moderado. Cripto representa 10%, dentro do seu perfil.</span></div>
          </Item>
          <Item><Btn kind="ghost" icon="Plus" className="sm" style={{ marginTop: 14 }} onClick={() => push('mercadoBusca')}>Adicionar ativo</Btn></Item>
        </Stagger>
      </div>
    </>
  )
}
function FilterSheet({ close, sel, setSel }) {
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 650, marginBottom: 14 }}>Filtrar carteira</h3>
      <div className="list">
        {[{ k: 'Todos', i: null }, ...ALOC.map((a, i) => ({ k: a.k, i, cor: a.cor }))].map((o) => (
          <Li key={o.k} icon={o.i == null ? 'LayoutGrid' : 'Circle'} title={o.k} chevron={false} right={sel === o.i && <Icon n="Check" s={18} c="#0EDBB9" />} onClick={() => { setSel(o.i); close() }} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- RENDIMENTOS ---------------- */
function Rendimentos() {
  const { push, prefs } = useApp()
  const [r, setR] = useState('1M')
  const d = EARN[r]
  const [ind, setInd] = useState('CDI')
  const cmp = { CDI: [102, 'Rendash 112%'], Selic: [98, 'Rendash 109%'], IPCA: [64, 'Rendash 2,1x'] }
  return (
    <>
      <Header back={false} title="Rendimentos" sub="Sua performance consolidada" right={<CircBtn n="CalendarDays" onClick={() => push('extrato')} />} />
      <div className="scroll">
        <Seg items={RANGES} value={r} onChange={setR} />
        <div className="card hero" style={{ marginTop: 14 }}>
          <div className="between">
            <span className="ovl">Rendimento · {r === '1M' ? 'setembro' : r}</span>
            <motion.span key={r} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="badge">{pct(d.chg, 2)}</motion.span>
          </div>
          <div style={{ margin: '8px 0 12px' }}><Money v={d.total} size={30} k={r} hidden={prefs.hidden} duration={1} /></div>
          <Bars key={r} data={d.bars} labels={d.lbl} dkey={r} h={130} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Stat label="Acumulado" value={prefs.hidden ? '••••' : <Flow value={d.total} kind="brl0" />} />
          <Stat label="Yield médio" value="102% CDI" />
          <Stat label="Melhor dia" value="+R$ 180" cls="pos" />
        </div>
        <div className="sec"><h3>Comparação por indicador</h3></div>
        <div className="card">
          <Seg items={['CDI', 'Selic', 'IPCA']} value={ind} onChange={setInd} />
          <div style={{ marginTop: 16 }}>
            {[['Sua carteira', 100, '#0EDBB9'], [ind, cmp[ind][0], 'rgba(217,217,222,.6)']].map(([l, v, c]) => (
              <div key={l} style={{ marginBottom: 12 }}>
                <div className="between" style={{ fontSize: 12.5, marginBottom: 6 }}><span className="t2">{l}</span><b className="num">{l === 'Sua carteira' ? cmp[ind][1] : `${ind} ${v === 64 ? '4,1%' : '10,9%'}`}</b></div>
                <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,.06)' }}>
                  <motion.div key={ind + l} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ type: 'spring', stiffness: 70, damping: 14 }} style={{ height: '100%', borderRadius: 5, background: c }} />
                </div>
              </div>
            ))}
          </div>
          <Note icon="Info" style={{ margin: '4px 0 0' }}>Rentabilidade passada não garante resultados futuros.</Note>
        </div>
        <div className="sec"><h3>Histórico recente</h3><button onClick={() => push('extrato')}>Extrato</button></div>
        <div className="list">
          {EARN_HIST.map((h) => <Li key={h.t} logo={h.logo} title={h.t} sub={h.s} value={prefs.hidden ? '••••' : brl(h.v, { sign: true })} vcls="pos" chevron={false} onClick={() => push('ativo', { id: { tesouro: 'selic', petrobras: 'petr4', atlas: 'atlas', rendash: 'cdb' }[h.logo] })} />)}
        </div>
      </div>
    </>
  )
}

/* ---------------- MERCADO ---------------- */
export function useLivePrices(base) {
  const [p, setP] = useState(() => base.map((s) => ({ ...s, flash: 0 })))
  useEffect(() => {
    const t = setInterval(() => {
      setP((arr) => arr.map((s) => {
        if (Math.random() > 0.35) return { ...s, flash: 0 }
        const d = (Math.random() - 0.48) * 0.004
        return { ...s, p: s.p * (1 + d), c: s.c + d * 100, flash: d > 0 ? 1 : -1 }
      }))
    }, 1400)
    return () => clearInterval(t)
  }, [])
  return p
}
export function PriceRow({ s, onClick }) {
  return (
    <Li logo={s.logo} title={s.t} sub={s.n} onClick={onClick}
      right={
        <div style={{ textAlign: 'right' }}>
          <motion.div key={s.p.toFixed(2)} initial={{ color: s.flash > 0 ? '#0EDBB9' : s.flash < 0 ? '#FF6B6B' : '#fff', y: s.flash ? (s.flash > 0 ? 6 : -6) : 0 }} animate={{ color: '#fff', y: 0 }} transition={{ duration: 0.9 }} className="num" style={{ fontWeight: 600, fontSize: 14.5 }}>
            {s.p > 10000 ? brl(s.p, { cents: false }) : brl(s.p)}
          </motion.div>
          <span className={`badge ${s.c < 0 ? 'neg' : ''}`} style={{ marginTop: 3 }}>{pct(s.c, 2)}</span>
        </div>
      } />
  )
}
function Mercado() {
  const { push } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Ações')
  const live = useLivePrices(STOCKS)
  const list = live.filter((s) => (q ? (s.t + s.n).toLowerCase().includes(q.toLowerCase()) : s.cat === cat))
  const petr = live[0]
  return (
    <>
      <Header back={false} title="Mercado" sub="Cotações em tempo real" right={<CircBtn n="BellRing" onClick={() => push('notificacoes')} />} />
      <div className="scroll">
        <div className="inp" style={{ height: 46, borderRadius: 23, marginBottom: 12 }}>
          <Icon n="Search" s={18} c="rgba(255,255,255,.5)" />
          <input placeholder="Buscar ativo, empresa ou fundo" value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button onClick={() => setQ('')}><Icon n="CircleX" s={18} c="rgba(255,255,255,.4)" /></button>}
        </div>
        {!q && <Chips items={['Ações', 'FIIs', 'Cripto', 'Renda fixa']} value={cat} onChange={setCat} />}
        {!q && (
          <>
            <div className="chips" style={{ marginTop: 14, gap: 10 }}>
              {MARKET_IDX.map((m, i) => (
                <motion.div key={m.k} className="card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07, ...spring }} style={{ width: 132, flex: 'none', padding: 12 }}>
                  <div className="ovl" style={{ fontSize: 9.5 }}>{m.k}</div>
                  <div className="num" style={{ fontWeight: 650, fontSize: 15, margin: '4px 0' }}>{m.v}</div>
                  <div className="between"><span className={m.c < 0 ? 'neg' : 'pos'} style={{ fontSize: 11.5, fontWeight: 600 }}>{pct(m.c)}</span><Spark data={m.s} w={54} h={20} color={m.c < 0 ? '#FF6B6B' : '#0EDBB9'} delay={0.3 + i * 0.1} /></div>
                </motion.div>
              ))}
            </div>
            <Tap className="card hero" style={{ marginTop: 14, width: '100%', textAlign: 'left', display: 'block' }} onClick={() => push('ativo', { id: 'petr4' })} scale={0.98}>
              <div className="between">
                <div className="row"><Logo k="petrobras" s={38} /><div><div style={{ fontWeight: 650 }}>PETR4</div><div className="t2" style={{ fontSize: 12 }}>Petrobras PN · B3</div></div></div>
                <div style={{ textAlign: 'right' }}>
                  <motion.div key={petr.p.toFixed(2)} initial={{ color: petr.flash > 0 ? '#0EDBB9' : petr.flash < 0 ? '#FF6B6B' : '#fff' }} animate={{ color: '#fff' }} transition={{ duration: 1 }} className="num" style={{ fontWeight: 700, fontSize: 18 }}>{brl(petr.p)}</motion.div>
                  <span className={`badge ${petr.c < 0 ? 'neg' : ''}`}>{pct(petr.c, 2)}</span>
                </div>
              </div>
              <div style={{ marginTop: 14 }}><LineChart data={PAT_SERIES['3M'].map((v) => v / 3300)} h={84} color="#8E7CFF" fmt={(v) => brl(v)} /></div>
            </Tap>
          </>
        )}
        <div className="sec"><h3>{q ? `${list.length} resultado${list.length === 1 ? '' : 's'}` : 'Mais negociados · 24h'}</h3>{!q && <button onClick={() => push('mercadoBusca')}>Ver ranking</button>}</div>
        <motion.div layout className="list">
          {list.length ? list.map((s) => <PriceRow key={s.t} s={s} onClick={() => push('ativo', { id: s.id || s.t })} />) : <div className="t2" style={{ padding: 24, textAlign: 'center', fontSize: 14 }}>Nenhum ativo encontrado para “{q}”.</div>}
        </motion.div>
      </div>
    </>
  )
}

/* ---------------- PERFIL ---------------- */
function Perfil() {
  const { push, reset, prefs } = useApp()
  const g = GOALS.length
  return (
    <>
      <Header back={false} title="Perfil" sub="Sua conta Rendash" right={<CircBtn n="Settings" onClick={() => push('config')} />} />
      <div className="scroll">
        <Stagger>
          <Item>
            <Tap className="card hero row" style={{ width: '100%', textAlign: 'left', gap: 14 }} onClick={() => push('dados')} scale={0.98}>
              <Avatar src={USER.foto} s={62} />
              <div className="grow">
                <div className="row" style={{ gap: 6 }}><b style={{ fontSize: 17 }}>{USER.nome}</b><Icon n="BadgeCheck" s={17} c="#0EDBB9" /></div>
                <div className="t2" style={{ fontSize: 12.5, marginTop: 2 }}>{USER.conta} · {USER.plano}</div>
                <span className="badge" style={{ marginTop: 6, background: 'linear-gradient(90deg,rgba(247,201,72,.2),rgba(14,219,185,.2))', color: '#F7D57A' }}><Icon n="Crown" s={11} />Prime</span>
              </div>
              <Icon n="ChevronRight" s={18} c="rgba(255,255,255,.4)" />
            </Tap>
          </Item>
          <Item className="sec"><h3>Planejamento</h3></Item>
          <Item className="list">
            <Li icon="Target" title="Minhas metas" sub={`${g} objetivos em andamento`} onClick={() => push('metas')} />
            <Li icon="ReceiptText" title="Extrato" sub="Setembro de 2026" onClick={() => push('extrato')} />
            <Li icon="ChartPie" title="Categorias" sub="94% das transações classificadas" onClick={() => push('categorias')} />
            <Li icon="Gauge" title="Meu perfil de investidor" sub="Moderado" onClick={() => push('perfilInv')} />
          </Item>
          <Item className="sec"><h3>Conta</h3></Item>
          <Item className="list">
            <Li icon="UserRound" title="Dados pessoais" onClick={() => push('dados')} />
            <Li icon="ShieldCheck" title="Segurança e privacidade" onClick={() => push('config')} />
            <Li icon="CreditCard" title="Cartão Rendash" sub={`Platinum •• ${CARD.final}`} onClick={() => push('cartao')} />
            <Li icon="Landmark" title="Bancos conectados" sub="Open Finance" onClick={() => push('ofHub')} />
            <Li icon="Building2" title="Conta empresa" sub="Lumina Studio Ltda." onClick={() => push('empresa')} />
            <Li icon="LifeBuoy" title="Central de ajuda" onClick={() => push('ajuda')} />
          </Item>
          <Item className="sec"><h3>Projeto</h3></Item>
          <Item className="list">
            <Li avatar={<div className="row" style={{ gap: 0 }}><Avatar src="img/gui.jpg" s={30} ring={false} /><div style={{ marginLeft: -10 }}><Avatar src="img/julio.jpg" s={30} ring={false} /></div></div>} title="Sobre o Rendash" sub="Feito por Guilherme e Julio" onClick={() => push('sobre')} />
            <Li icon="Figma" title="Projeto no Figma" sub="Telas e design system" onClick={() => window.open(FIGMA_URL, '_blank')} right={<Icon n="ExternalLink" s={16} c="#0EDBB9" />} />
            <Li icon="Github" title="Código no GitHub" sub="Protótipo e documentação" onClick={() => window.open(GITHUB_URL, '_blank')} right={<Icon n="ExternalLink" s={16} c="#0EDBB9" />} />
          </Item>
          <Item><Btn kind="ghost" icon="LogOut" className="sm danger" style={{ marginTop: 16, color: '#FF6B6B' }} onClick={() => reset('biometria', {}, 'fade')}>Sair da conta</Btn></Item>
          <Item><div className="t3" style={{ textAlign: 'center', fontSize: 11.5, marginTop: 14 }}>Rendash para iOS · versão 1.0</div></Item>
        </Stagger>
      </div>
    </>
  )
}
