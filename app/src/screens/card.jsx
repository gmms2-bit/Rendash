import React, { useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useApp } from '../store'
import { Tap, Icon, Header, CircBtn, Avatar, Logo, Money, Count, Seg, Chips, Li, LineChart, Bars, Ring, Donut, ProgressBar, Stagger, Item, Stat, Note, Btn, Toggle, spring , Flow } from '../ui'
import { CARD, FATURA, EMPRESA, TEAM, USER } from '../data'
import { brl, pct, num, vibrate } from '../format'
import { useFaceID } from './auth'
import { MiniCard } from './tabs'

export function CardVisual({ flipped, onFlip, locked, small }) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 18 }), sry = useSpring(ry, { stiffness: 200, damping: 18 })
  const shine = useTransform(sry, [-15, 15], ['0%', '100%'])
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * 22); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18) }
  const leave = () => { rx.set(0); ry.set(0) }
  return (
    <div style={{ perspective: 1000 }} onPointerMove={move} onPointerLeave={leave}>
      <motion.div onClick={onFlip} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} style={{ rotateX: srx, rotateY: undefined, transformStyle: 'preserve-3d', position: 'relative', aspectRatio: '1.586', cursor: 'pointer' }}>
        <motion.div style={{ rotateY: sry, transformStyle: 'preserve-3d', position: 'absolute', inset: 0 }}>
          {/* front */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: 22, overflow: 'hidden', padding: 20, background: 'radial-gradient(120% 120% at 100% 0%, rgba(14,219,185,.45), transparent 50%), radial-gradient(80% 80% at 0% 100%, rgba(120,90,255,.5), transparent 60%), linear-gradient(135deg,#1A2140,#0B0F1E)', border: '1px solid rgba(255,255,255,.18)', boxShadow: '0 24px 50px -12px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', filter: locked ? 'grayscale(.8) brightness(.7)' : 'none', transition: 'filter .4s' }}>
            <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,.18) 45%, transparent 60%)', backgroundSize: '250% 100%', backgroundPositionX: shine, pointerEvents: 'none' }} />
            <div className="between"><img src="img/wordmark.png" alt="Rendash" style={{ height: 20 }} /><span className="ovl" style={{ color: 'rgba(255,255,255,.75)', fontSize: 10 }}>Platinum</span></div>
            <div className="row" style={{ gap: 10 }}>
              <div style={{ width: 40, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#f3dc8c,#b8933a)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)' }} />
              <Icon n="Nfc" s={22} c="rgba(255,255,255,.7)" />
            </div>
            <div>
              <div className="num" style={{ fontSize: small ? 15 : 19, letterSpacing: '.14em', fontWeight: 500 }}>•••• •••• •••• {CARD.final}</div>
              <div className="between" style={{ marginTop: 10, alignItems: 'flex-end' }}>
                <div style={{ fontSize: 10.5 }}><div className="t3" style={{ fontSize: 8.5 }}>TITULAR</div>{CARD.titular}</div>
                <div style={{ fontSize: 10.5 }}><div className="t3" style={{ fontSize: 8.5 }}>VALIDADE</div>{CARD.validade}</div>
                <div style={{ width: 54, height: 22 }}><svg viewBox="0 0 24 24" width="54" height="22" fill="#fff"><path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" /></svg></div>
              </div>
            </div>
            <AnimatePresence>{locked && <motion.div initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.35)' }}><div className="glass" style={{ width: 64, height: 64, borderRadius: 32, display: 'grid', placeItems: 'center' }}><Icon n="Lock" s={28} /></div></motion.div>}</AnimatePresence>
          </div>
          {/* back */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(135deg,#141a33,#0B0F1E)', border: '1px solid rgba(255,255,255,.18)' }}>
            <div style={{ height: 42, background: '#000', marginTop: 24 }} />
            <div className="row" style={{ padding: '16px 20px', gap: 10 }}>
              <div style={{ flex: 1, height: 34, borderRadius: 6, background: 'repeating-linear-gradient(90deg,#e8e8e8 0 6px,#d6d6d6 6px 12px)' }} />
              <div style={{ background: '#fff', color: '#000', borderRadius: 6, padding: '6px 10px', fontWeight: 700, letterSpacing: '.1em' }} className="num">{flipped ? '482' : '•••'}</div>
            </div>
            <div className="t3" style={{ fontSize: 10.5, padding: '0 20px' }}>CVV dinâmico · muda a cada compra online. Toque para virar.</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function Cartao() {
  const { push, prefs, setPref, openSheet, toast } = useApp()
  const [flip, setFlip] = useState(false)
  const [ask, faceEl] = useFaceID()
  const locked = prefs.cardLocked
  const acts = [
    [locked ? 'LockOpen' : 'Snowflake', locked ? 'Desbloquear' : 'Bloquear', () => ask(() => { setPref('cardLocked', !locked); vibrate([10, 30, 10]); toast(locked ? 'Cartão desbloqueado' : 'Cartão bloqueado', locked ? 'LockOpen' : 'Lock') })],
    ['Asterisk', 'Senha', () => openSheet({ render: (c) => <div style={{ textAlign: 'center' }}><Icon n="Asterisk" s={28} c="#0EDBB9" /><h3 style={{ fontSize: 18, fontWeight: 650, margin: '8px 0 6px' }}>Senha do cartão</h3><p className="t2" style={{ fontSize: 13.5, marginBottom: 16 }}>Por segurança, a senha aparece por 10 segundos após o Face ID.</p><Btn icon="ScanFace" onClick={() => { c(); ask(() => toast('Senha: 4 8 2 1', 'Eye')) }}>Mostrar senha</Btn></div> })],
    ['Smartphone', 'Virtual', () => { setFlip((f) => !f) }],
    ['SlidersHorizontal', 'Controles', () => push('controles')],
  ]
  return (
    <div className="layer">
      <Header title="Cartão Rendash" sub={`Platinum · final ${CARD.final}`} right={<CircBtn n="Ellipsis" onClick={() => push('cartaoEstados')} />} />
      <div className="scroll notab">
        <motion.div initial={{ y: 40, opacity: 0, rotateX: 30 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <CardVisual flipped={flip} onFlip={() => { vibrate(6); setFlip(!flip) }} locked={locked} />
        </motion.div>
        <div className="t3" style={{ textAlign: 'center', fontSize: 11.5, marginTop: 10 }}>Toque no cartão para ver o verso · incline para ver o brilho</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
          {acts.map(([i, l, f], k) => (
            <Tap key={l} className="card col" onClick={f} style={{ alignItems: 'center', gap: 6, padding: '12px 2px', fontSize: 11.5, fontWeight: 550, borderColor: (k === 0 && locked) || (k === 2 && flip) ? 'rgba(14,219,185,.6)' : undefined }} scale={0.92}>
              <motion.span key={i} initial={{ rotate: -90, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }}><Icon n={i} s={20} c={(k === 0 && locked) ? '#0EDBB9' : undefined} /></motion.span>{l}
            </Tap>
          ))}
        </div>
        <Tap className="card hero" style={{ marginTop: 14, width: '100%', textAlign: 'left', display: 'block' }} onClick={() => push('fatura')} scale={0.98}>
          <div className="between"><span style={{ fontWeight: 600, fontSize: 14 }}>Fatura de setembro</span><span className="badge warn">Fecha em 3 dias</span></div>
          <div style={{ margin: '8px 0 12px' }}><Money v={CARD.fatura} size={30} hidden={prefs.hidden} /></div>
          <div className="between" style={{ fontSize: 12, marginBottom: 6 }}><span className="t2">Limite utilizado</span><b>43%</b></div>
          <ProgressBar p={43} />
          <div className="t3" style={{ fontSize: 11.5, marginTop: 6 }}>{brl(CARD.limite - CARD.usado)} disponíveis de {brl(CARD.limite)}</div>
        </Tap>
        <Btn icon="ReceiptText" style={{ marginTop: 14 }} onClick={() => push('fatura')}>Ver fatura</Btn>
        <div className="card row" style={{ marginTop: 14 }}><Icon n="Sparkles" s={20} c="#F7C948" /><div className="grow" style={{ fontSize: 13 }}><b><Count to={CARD.pontos} fmt={(v) => num(v)} /> pontos Rendash</b><div className="t2" style={{ fontSize: 12 }}>2 acessos a lounge disponíveis</div></div><Icon n="ChevronRight" s={18} c="rgba(255,255,255,.4)" /></div>
      </div>
      {faceEl}
    </div>
  )
}

export function Fatura() {
  const { push, openSheet, prefs } = useApp()
  const [tab, setTab] = useState('Lançamentos · 7')
  const [f, setF] = useState('Todos')
  const [ask, faceEl] = useFaceID()
  const groups = FATURA.reduce((a, t) => { (a[t.dia] = a[t.dia] || []).push(t); return a }, {})
  const resumo = [{ k: 'Viagens', p: 36, cor: '#5AA9FF' }, { k: 'Compras', p: 28, cor: '#8E7CFF' }, { k: 'Alimentação', p: 22, cor: '#FF8A65' }, { k: 'Assinaturas', p: 14, cor: '#F7C948' }]
  const pay = () => openSheet({
    render: (c) => <PaySheet close={c} onPay={(v) => ask(() => push('sucesso', { kind: 'fatura', valor: v, asset: `Fatura de setembro · •• ${CARD.final}`, logo: 'visa' }, 'fade'))} />,
  })
  const detail = (t) => openSheet({
    render: (c) => (
      <div>
        <div className="between"><b style={{ fontSize: 18 }}>Detalhe da compra</b><span className={`badge ${t.status === 'PAGO' ? '' : 'warn'}`}>{t.status}</span></div>
        <div className="t2" style={{ fontSize: 12.5, marginTop: 2 }}>{t.t} · {t.dia}</div>
        <div className="row" style={{ margin: '16px 0' }}>{t.logo ? <Logo k={t.logo} s={48} /> : <div className="ic" style={{ width: 48, height: 48 }}><Icon n={t.ic} s={22} /></div>}<div className="num" style={{ fontSize: 30, fontWeight: 700 }}>{brl(t.v)}</div></div>
        <div className="list" style={{ marginBottom: 14 }}>{[['Categoria', t.cat], ['Cartão', `Platinum · final ${CARD.final}`], ['Local', t.local], ['Parcelamento', t.parc]].map(([k, v]) => <div key={k} className="li" style={{ padding: '11px 14px' }}><span className="t2 grow" style={{ fontSize: 13 }}>{k}</span><b style={{ fontSize: 13.5 }}>{v}</b></div>)}</div>
        <Btn icon="ReceiptText" onClick={c}>Ver comprovante</Btn><div style={{ height: 8 }} />
        <Btn kind="ghost" icon="MessageSquareWarning" onClick={c}>Contestar compra</Btn>
      </div>
    ),
  })
  return (
    <div className="layer">
      <Header title="Fatura" sub={`Setembro · final ${CARD.final}`} right={<CircBtn n="Download" />} />
      <div className="scroll notab">
        <div className="card hero">
          <div className="between"><span className="ovl">Fatura atual</span><span className="badge warn">ABERTA</span></div>
          <div style={{ margin: '8px 0 12px' }}><Money v={CARD.fatura} size={32} hidden={prefs.hidden} /></div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}><Stat label="Fechamento" value={CARD.fecha} /><Stat label="Vencimento" value={CARD.vence} /></div>
          <Btn icon="ScanBarcode" onClick={pay}>Pagar fatura</Btn>
        </div>
        <div style={{ marginTop: 14 }}><Seg items={['Lançamentos · 7', 'Resumo']} value={tab} onChange={setTab} /></div>
        <AnimatePresence mode="wait">
          {tab === 'Resumo' ? (
            <motion.div key="r" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card" style={{ marginTop: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Donut parts={resumo} s={130} sw={14}><div><div className="ovl" style={{ fontSize: 9 }}>Total</div><b className="num" style={{ fontSize: 13 }}>{brl(CARD.fatura, { cents: false })}</b></div></Donut>
              <div className="grow">{resumo.map((r) => <div key={r.k} className="between" style={{ fontSize: 13, padding: '4px 0' }}><span className="row" style={{ gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: r.cor }} />{r.k}</span><b className="num">{r.p}%</b></div>)}</div>
            </motion.div>
          ) : (
            <motion.div key="l" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <div style={{ marginTop: 12 }}><Chips items={['Todos', 'Guilherme', 'Virtual']} value={f} onChange={setF} /></div>
              {Object.entries(groups).map(([d, ts]) => (
                <div key={d}>
                  <div className="sec"><h3 className="t2" style={{ fontSize: 12.5 }}>{d.toUpperCase()}</h3><span className="t3 num" style={{ fontSize: 12 }}>{brl(ts.reduce((a, b) => a + b.v, 0))}</span></div>
                  <div className="list">{ts.filter((t, i) => f !== 'Virtual' || i % 2 === 0).map((t) => <Li key={t.id} logo={t.logo} icon={t.ic} title={t.t} sub={t.s} value={brl(t.v)} chevron={false} onClick={() => detail(t)} />)}</div>
                </div>
              ))}
              <div className="between t2" style={{ fontSize: 13, margin: '14px 4px' }}><span>Compras exibidas</span><b className="num">{brl(FATURA.reduce((a, b) => a + b.v, 0))}</b></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {faceEl}
    </div>
  )
}
function PaySheet({ close, onPay }) {
  const [o, setO] = useState('Total')
  const v = { Total: CARD.fatura, Mínimo: CARD.fatura * 0.15, Parcelar: CARD.fatura / 3 }[o]
  return (
    <div>
      <b style={{ fontSize: 18 }}>Pagar fatura</b>
      <div className="list" style={{ margin: '14px 0' }}>
        {[['Total', 'Sem juros', CARD.fatura], ['Mínimo', 'Juros de 9,9% a.m. sobre o restante', CARD.fatura * 0.15], ['Parcelar', '3x com juros de 4,2% a.m.', CARD.fatura / 3]].map(([k, s, val]) => (
          <Li key={k} title={k} sub={s} value={brl(val)} chevron={false} onClick={() => setO(k)} right={<motion.span animate={{ scale: o === k ? 1 : 0 }} style={{ display: 'inline-flex' }}><Icon n="CircleCheck" s={20} c="#0EDBB9" /></motion.span>} />
        ))}
      </div>
      <div className="between" style={{ fontSize: 13, margin: '0 4px 14px' }}><span className="t2">Pagar com</span><span className="row" style={{ gap: 6 }}><img src="img/appicon.png" style={{ width: 18, borderRadius: 5 }} />Saldo Rendash</span></div>
      <Btn icon="ScanFace" onClick={() => { close(); onPay(v) }}>Pagar {brl(v)}</Btn>
    </div>
  )
}

/* ---------------- controles ---------------- */
function Slider({ value, min, max, onChange }) {
  const ref = useRef(null)
  const p = (value - min) / (max - min)
  const set = (e) => { const r = ref.current.getBoundingClientRect(); const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); const v = Math.round((min + x * (max - min)) / 100) * 100; if (v !== value) { vibrate(3); onChange(v) } }
  return (
    <div ref={ref} style={{ position: 'relative', height: 34, touchAction: 'none', cursor: 'pointer' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); set(e) }} onPointerMove={(e) => e.buttons && set(e)}>
      <div style={{ position: 'absolute', top: 14, left: 0, right: 0, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.12)' }} />
      <motion.div animate={{ width: `${p * 100}%` }} transition={{ type: 'spring', stiffness: 500, damping: 40 }} style={{ position: 'absolute', top: 14, left: 0, height: 6, borderRadius: 3, background: '#0EDBB9', boxShadow: '0 0 12px #0EDBB9' }} />
      <motion.div animate={{ left: `${p * 100}%` }} whileTap={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 500, damping: 40 }} style={{ position: 'absolute', top: 3, width: 28, height: 28, marginLeft: -14, borderRadius: 14, background: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,.35)' }} />
    </div>
  )
}
export function Controles() {
  const { prefs, setPref, toast, openSheet } = useApp()
  const [ask, faceEl] = useFaceID()
  const T = ({ k }) => <Toggle on={prefs[k]} onChange={(v) => ask(() => setPref(k, v))} />
  return (
    <div className="layer">
      <Header title="Controles do cartão" sub={`Rendash Platinum · ${CARD.final}`} />
      <div className="scroll notab">
        <div className="card row">
          <div style={{ filter: prefs.cardLocked ? 'grayscale(1)' : 'none' }}><MiniCard /></div>
          <div className="grow"><b style={{ fontSize: 14.5 }}>{prefs.cardLocked ? 'Cartão bloqueado' : 'Cartão desbloqueado'}</b><div className="t2" style={{ fontSize: 12 }}>{prefs.cardLocked ? 'Nenhuma compra será aprovada' : 'Pronto para uso'}</div></div>
          <Toggle on={!prefs.cardLocked} onChange={(v) => ask(() => setPref('cardLocked', !v))} />
        </div>
        <div className="card" style={{ marginTop: 14 }}>
          <div className="between"><div><b style={{ fontSize: 14.5 }}>Limite de crédito</b><div className="t2" style={{ fontSize: 12 }}>Ajuste disponível imediatamente</div></div><b style={{ fontSize: 17 }}><Flow value={prefs.limite} kind="brl0" /></b></div>
          <div style={{ margin: '12px 0 4px' }}><Slider value={prefs.limite} min={500} max={10000} onChange={(v) => setPref('limite', v)} /></div>
          <div className="between t3" style={{ fontSize: 11 }}><span>R$ 500</span><span>R$ 10.000</span></div>
        </div>
        <div className="list" style={{ marginTop: 14 }}><Li icon="Smartphone" title="Cartão virtual" sub="Final 9018 · CVV dinâmico" chevron={false} right={<button className="pos" style={{ fontSize: 13, fontWeight: 600 }} onClick={() => ask(() => openSheet({ render: () => <div><b style={{ fontSize: 18 }}>Cartão virtual</b><div className="list" style={{ marginTop: 14 }}>{[['Número', '4821 7730 1145 9018'], ['Validade', '09/31'], ['CVV', '317 · muda em 4 min']].map(([k, v]) => <div key={k} className="li"><span className="t2 grow">{k}</span><b className="num">{v}</b></div>)}</div></div> }))}>Ver dados</button>} /></div>
        <div className="list" style={{ marginTop: 14 }}>
          <Li icon="Nfc" title="Compras por aproximação" sub="Até R$ 200 sem senha" chevron={false} right={<T k="aprox" />} />
          <Li icon="Globe" title="Compras internacionais" sub="Disponível em 42 países" chevron={false} right={<T k="intl" />} />
          <Li icon="ShieldCheck" title="Proteção para compras online" sub="Confirmação biométrica" chevron={false} right={<T k="online" />} />
        </div>
        <div className="card row" style={{ marginTop: 14 }}><Icon n="ScanFace" s={20} c="#0EDBB9" /><div className="grow" style={{ fontSize: 13 }}><b>Alteração autenticada</b><div className="t2" style={{ fontSize: 12 }}>Face ID confirma mudanças sensíveis e dados do cartão.</div></div></div>
        <div className="list" style={{ marginTop: 14 }}><Li icon="MessageSquareWarning" title="Contestar compra ou informar perda" onClick={() => toast('Atendimento iniciado', 'MessageCircle')} /></div>
      </div>
      {faceEl}
    </div>
  )
}

export function CartaoEstados() {
  const st = [['PAGO', 'Compra processada com sucesso.', ''], ['EM PROCESSO', 'Pagamento sendo confirmado.', 'warn'], ['BLOQUEADO', 'Cartão bloqueado temporariamente.', 'neg'], ['CARREGANDO', 'Consulta em andamento.', 'mut'], ['VAZIO', 'Sem lançamentos para exibir.', 'mut'], ['ERRO', 'Falha ao processar o pagamento.', 'neg']]
  return (
    <div className="layer">
      <Header title="Pagamento" sub="Estados visuais" />
      <div className="scroll notab">
        <div className="list">{st.map(([k, d, c], i) => <motion.div key={k} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="li"><span className={`badge ${c}`} style={{ minWidth: 98, justifyContent: 'center' }}>{k === 'CARREGANDO' && <motion.i animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} style={{ width: 9, height: 9, border: '1.5px solid', borderTopColor: 'transparent', borderRadius: 5 }} />}{k}</span><span className="t2" style={{ fontSize: 13 }}>{d}</span></motion.div>)}</div>
      </div>
    </div>
  )
}

/* ---------------- empresa ---------------- */
export function Empresa() {
  const { push, pop, prefs, openSheet } = useApp()
  const [mode, setMode] = useState('Empresa')
  return (
    <div className="layer">
      <Header title="Visão financeira" sub="Contextos separados, controle total" right={<CircBtn n="Bell" dot onClick={() => push('notificacoes')} />} />
      <div className="scroll notab">
        <Seg items={['Pessoal', 'Empresa']} value={mode} onChange={(m) => { setMode(m); if (m === 'Pessoal') setTimeout(pop, 250) }} />
        <Tap className="card row" style={{ marginTop: 14, width: '100%', textAlign: 'left' }} onClick={() => openSheet({ render: (c) => <div><b style={{ fontSize: 18 }}>Suas empresas</b><div className="list" style={{ marginTop: 14 }}><Li icon="Building2" title={EMPRESA.nome} sub={`CNPJ ${EMPRESA.cnpj}`} chevron={false} right={<Icon n="Check" s={18} c="#0EDBB9" />} onClick={c} /><Li icon="Plus" title="Adicionar empresa" chevron={false} onClick={c} /></div></div> })} scale={0.98}>
          <div className="ic"><Icon n="Building2" s={20} /></div>
          <div className="grow"><b style={{ fontSize: 14.5 }}>{EMPRESA.nome}</b><div className="t2" style={{ fontSize: 12 }}>CNPJ {EMPRESA.cnpj}</div></div>
          <Icon n="ChevronDown" s={18} />
        </Tap>
        <div className="card hero" style={{ marginTop: 14 }}>
          <span className="ovl">Saldo empresarial</span>
          <div style={{ margin: '8px 0 14px' }}><Money v={EMPRESA.saldo} size={32} hidden={prefs.hidden} /></div>
          <div style={{ display: 'flex', gap: 8 }}><Stat label="A receber" value={<Count to={48.2} fmt={(v) => `R$ ${num(v, 1)} mil`} />} cls="pos" sub="8 cobranças em aberto" /><Stat label="A pagar" value={<Count to={31.8} fmt={(v) => `R$ ${num(v, 1)} mil`} />} sub="12 vencimentos" /></div>
        </div>
        <div className="list" style={{ marginTop: 14 }}>
          <Li icon="LayoutDashboard" title="Dashboard empresarial" sub="Fluxo de caixa e rendimentos" onClick={() => push('dashboard')} />
          <Li icon="FileText" title="Cobranças e recebíveis" sub="8 cobranças em aberto" onClick={() => push('cobrancas')} />
          <Li icon="Users" title="Sócios e acessos" sub="2 sócios · 3 perfis autorizados" onClick={() => push('socios')} />
          <Li icon="Landmark" title="Contas conectadas" sub="Rendash PJ + Itaú Empresas" onClick={() => push('ofContas')} />
        </div>
        <Note icon="Info">Você está visualizando apenas dados da empresa.</Note>
      </div>
    </div>
  )
}
export function Dashboard() {
  const { toast, push } = useApp()
  const [p, setP] = useState('30 dias')
  return (
    <div className="layer">
      <Header title="Lumina Studio" sub="Visão empresarial · setembro" right={<CircBtn n="Bell" onClick={() => push('notificacoes')} />} />
      <div className="scroll notab">
        <Chips items={['7 dias', '30 dias', '90 dias']} value={p} onChange={setP} />
        <div className="card hero" style={{ marginTop: 14 }}>
          <div className="between"><span className="ovl">Fluxo de caixa projetado</span><span className="badge">+18,4%</span></div>
          <div className="num" style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 10px' }}><Flow value={{ '7 dias': 12840.2, '30 dias': 54820.4, '90 dias': 148310.9 }[p]} /></div>
          <LineChart key={p} data={EMPRESA.fluxo.slice(0, p === '7 dias' ? 10 : p === '30 dias' ? 30 : 30)} h={110} labels={['Set', 'Out', 'Nov']} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><Stat label="Entradas" value="R$ 128,4 mil" cls="pos" /><Stat label="Saídas" value="R$ 73,6 mil" /><Stat label="Rendimentos" value="R$ 2.984" cls="pos" /></div>
        <div className="sec"><h3>Ações rápidas</h3><span className="t3" style={{ fontSize: 12 }}>Cobrar, pagar ou exportar</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[['HandCoins', 'Cobrar', () => push('cobrancas')], ['Banknote', 'Pagar', () => push('pixEnviar')], ['FileDown', 'Exportar', () => toast('Relatório exportado em PDF', 'FileDown')]].map(([i, l, f]) => <Tap key={l} className="card col" style={{ alignItems: 'center', gap: 6, padding: '14px 0', fontSize: 12.5, fontWeight: 550 }} onClick={f} scale={0.93}><Icon n={i} s={21} c="#0EDBB9" />{l}</Tap>)}
        </div>
        <div className="sec"><h3>Próximos lançamentos</h3></div>
        <div className="list">{EMPRESA.prox.map((x) => <Li key={x.t} icon={x.v > 0 ? 'ArrowDownLeft' : 'ArrowUpRight'} title={x.t} sub={x.s} value={brl(x.v, { sign: true })} vcls={x.v > 0 ? 'pos' : ''} chevron={false} />)}</div>
      </div>
    </div>
  )
}
export function Cobrancas() {
  const { toast } = useApp()
  const [f, setF] = useState('Abertas')
  const all = [['Amora Tech', 'NF 2026-184 · vence amanhã', 18400, 'Abertas'], ['Café Serra', 'NF 2026-179 · vence 08 out', 6200, 'Abertas'], ['Ateliê Mar', 'NF 2026-182 · vence 10 out', 3450, 'Abertas'], ['Nexo Saúde', 'NF 2026-183 · vence 12 out', 7400, 'Abertas'], ['Pão de Ló', 'NF 2026-176 · vence 15 out', 1250, 'Abertas'], ['Lumen Edu', 'NF 2026-180 · vence 18 out', 5600, 'Abertas'], ['Orla Turismo', 'NF 2026-181 · vence 20 out', 3000, 'Abertas'], ['Brisa Móveis', 'NF 2026-185 · vence 25 out', 2900, 'Abertas'], ['Studio Nove', 'NF 2026-171 · atrasada 2 dias', 4800, 'Atrasadas'], ['Grupo Vila', 'NF 2026-165 · paga 22 set', 12300, 'Pagas']]
  return (
    <div className="layer">
      <Header title="Cobranças" sub="Recebíveis da empresa" right={<CircBtn n="Plus" onClick={() => toast('Cobrança criada e enviada')} />} />
      <div className="scroll notab">
        <Seg items={['Abertas', 'Atrasadas', 'Pagas']} value={f} onChange={setF} />
        <motion.div key={f} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="list" style={{ marginTop: 14 }}>
          {all.filter((x) => x[3] === f).map(([n, s, v, st]) => <Li key={n} icon="FileText" title={n} sub={s} value={brl(v)} vsub={<span className={`badge ${st === 'Atrasadas' ? 'neg' : st === 'Pagas' ? '' : 'warn'}`}>{st.slice(0, -1)}</span>} chevron={false} onClick={() => toast(st === 'Pagas' ? 'Comprovante aberto' : `Lembrete enviado para ${n}`, 'Send')} />)}
        </motion.div>
      </div>
    </div>
  )
}
export function Socios() {
  return (
    <div className="layer">
      <Header title="Sócios e acessos" sub={EMPRESA.nome} />
      <div className="scroll notab">
        <div className="ovl" style={{ margin: '0 4px 8px' }}>Sócios</div>
        <div className="list">{TEAM.map((m, i) => <Li key={m.nome} avatar={<Avatar src={m.foto} s={44} />} title={m.curto} sub={`${m.papel} · ${i === 0 ? '50%' : '50%'}`} chevron={false} right={<span className="badge">{i === 0 ? 'Admin' : 'Admin'}</span>} />)}</div>
        <div className="ovl" style={{ margin: '18px 4px 8px' }}>Perfis autorizados</div>
        <div className="list">{[['Contador', 'Somente leitura'], ['Financeiro', 'Pagar até R$ 5.000'], ['Assistente', 'Emitir cobranças']].map(([n, s]) => <Li key={n} avatar={<Avatar ini={n.slice(0, 2).toUpperCase()} s={44} />} title={n} sub={s} chevron={false} right={<Icon n="Settings2" s={18} c="rgba(255,255,255,.5)" />} />)}</div>
      </div>
    </div>
  )
}
