import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../store'
import { Tap, Icon, Header, CircBtn, Avatar, Logo, Money, Count, Seg, Chips, Li, LineChart, Bars, Ring, ProgressBar, Stagger, Item, Stat, Note, Btn, Toggle, Confetti, SuccessMark, Spinner, spring , Flow } from '../ui'
import { useFaceID, Field } from './auth'
import { ASSETS, STOCKS, RANGES, TX, NOTIFS, GOALS, USER, EARN } from '../data'
import { brl, pct, num, series, vibrate, island } from '../format'
import { soundOn, setSound } from '../sound'
import { useLivePrices, PriceRow, TxRow } from './tabs'

export function getAsset(id) {
  const a = ASSETS.find((x) => x.id === id)
  if (a) return { ...a, own: true }
  const s = STOCKS.find((x) => x.t === id || x.id === id) || STOCKS[0]
  return { id: s.t, nome: `${s.t} · ${s.n}`, tipo: s.cat, sub: s.n, valor: 0, rent: s.c, logo: s.logo, cor: '#8E7CFF', liq: s.cat === 'Cripto' ? 'D+0' : 'D+2', venc: 'Sem vencimento', investido: 0, bruto: 0, cdi: 0, min: s.p > 1000 ? 10 : s.p, preco: s.p, own: false }
}
const seedOf = (id) => [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)

/* ---------------- money input ---------------- */
export function MoneyInput({ cents, setCents, err }) {
  const ref = useRef(null)
  const v = cents / 100
  const [i, d] = v.toFixed(2).split('.')
  const txt = Number(i).toLocaleString('pt-BR')
  const [focus, setFocus] = useState(false)
  return (
    <Tap as="div" scale={0.99} haptic={false} className={`card ${err ? '' : ''}`} onClick={() => ref.current && ref.current.focus()}
      style={{ position: 'relative', padding: '20px 16px', textAlign: 'center', cursor: 'text', borderColor: focus ? 'rgba(14,219,185,.6)' : err ? 'rgba(255,107,107,.7)' : undefined, boxShadow: focus ? '0 0 0 4px rgba(14,219,185,.1)' : undefined }}>
      <input ref={ref} inputMode="numeric" value={String(cents || '')} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={(e) => setCents(Math.min(99999999, Number(e.target.value.replace(/\D/g, '') || 0)))}
        style={{ position: 'absolute', inset: 0, opacity: 0, fontSize: 16 }} aria-label="Valor" />
      <motion.div animate={err ? { x: [0, -8, 8, -4, 4, 0] } : {}} className="num" style={{ display: 'inline-flex', alignItems: 'baseline', fontWeight: 650, fontSize: 40, letterSpacing: '-.035em', color: cents ? '#fff' : 'rgba(255,255,255,.35)' }}>
        <span style={{ fontSize: 20, marginRight: 6, opacity: 0.7 }}>R$</span>
        {txt.split('').map((ch, k) => (
          <motion.span key={`${txt.length}-${k}-${ch}`} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 30 }}>{ch}</motion.span>
        ))}
        <span style={{ fontSize: 24, opacity: 0.55 }}>,{d}</span>
        {focus && <motion.i animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.55, repeatType: 'reverse' }} style={{ width: 2, height: 34, background: '#0EDBB9', marginLeft: 3, alignSelf: 'center' }} />}
      </motion.div>
      <div className="t3" style={{ fontSize: 12, marginTop: 4 }}>{focus ? 'Digite o valor' : 'Toque para digitar'}</div>
    </Tap>
  )
}

function ConfirmSheet({ close, title, rows, cta, onConfirm }) {
  return (
    <div>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="ic" style={{ background: 'rgba(14,219,185,.15)' }}><Icon n="ShieldCheck" s={20} c="#0EDBB9" /></div>
        <div><div style={{ fontWeight: 650, fontSize: 17 }}>{title}</div><div className="t2" style={{ fontSize: 12.5 }}>Revise os dados antes de concluir</div></div>
      </div>
      <div className="list" style={{ marginBottom: 16 }}>
        {rows.map(([k, v, cls]) => <div key={k} className="li" style={{ padding: '12px 14px' }}><span className="t2 grow" style={{ fontSize: 13.5 }}>{k}</span><b className={`num ${cls || ''}`} style={{ fontSize: 14 }}>{v}</b></div>)}
      </div>
      <Btn icon="Check" onClick={() => { close(); onConfirm() }}>{cta}</Btn>
      <div style={{ height: 8 }} />
      <Btn kind="ghost" onClick={close}>Cancelar</Btn>
    </div>
  )
}

/* ---------------- investir ---------------- */
export function Investir({ id = 'selic' }) {
  const { push, openSheet, state, setState, reset } = useApp()
  const a = getAsset(id)
  const [cents, setCents] = useState(0)
  const [chip, setChip] = useState(null)
  const [ask, faceEl] = useFaceID()
  const [busy, setBusy] = useState(false)
  const v = cents / 100
  const min = a.min || 100
  const tooLow = v > 0 && v < min, tooHigh = v > state.saldo
  const ok = v >= min && !tooHigh
  const proj = v * 1.25498
  const pick = (c) => { setChip(c); setCents(Math.round((c === 'Máximo' ? state.saldo : Number(c.replace(/\D/g, ''))) * 100)) }
  const finish = () => {
    setBusy(true)
    setTimeout(() => {
      setState((s) => ({ ...s, saldo: s.saldo - v }))
      push('sucesso', { kind: 'investir', valor: v, asset: a.nome, logo: a.logo }, 'fade')
      setBusy(false)
    }, 900)
  }
  const confirm = () => openSheet({
    render: (c) => <ConfirmSheet close={c} title="Pronto para confirmar" cta="Confirmar investimento"
      rows={[['Ativo', a.nome], ['Valor a investir', brl(v)], ['Liquidação', 'Hoje, até 17h'], ['Estimativa no vencimento', brl(proj), 'pos']]}
      onConfirm={() => (v > 1000 ? ask(finish) : finish())} />,
  })
  return (
    <div className="layer">
      <Header title="Investir" sub={a.nome} right={<CircBtn n="Info" onClick={() => push('ativo', { id: a.id })} />} />
      <div className="scroll withcta">
        <div className="card between" style={{ padding: '14px 16px' }}><span className="t2" style={{ fontSize: 13.5 }}>Saldo disponível</span><b className="num">{brl(state.saldo)}</b></div>
        <div className="ovl" style={{ margin: '20px 4px 8px' }}>Quanto você quer investir?</div>
        <MoneyInput cents={cents} setCents={(c) => { setCents(c); setChip(null) }} err={tooHigh} />
        <div className={tooLow || tooHigh ? 'help err' : 'help'} style={{ margin: '8px 4px 12px' }}>{tooHigh ? 'Valor acima do saldo disponível.' : `Aplicação mínima: ${brl(min)}`}</div>
        <Chips items={['R$ 500', 'R$ 1.000', 'R$ 5.000', 'Máximo']} value={chip} onChange={pick} />
        <div className="card" style={{ marginTop: 16 }}>
          <div className="ovl">Projeção até {a.venc === 'Sem vencimento' ? '12 meses' : a.venc.slice(-4)}</div>
          <div className="row" style={{ marginTop: 10 }}>
            <div className="grow"><div className="t3" style={{ fontSize: 11 }}>Valor aplicado</div><div className="num" style={{ fontWeight: 650, fontSize: 17 }}>{brl(v)}</div></div>
            <div className="grow"><div className="t3" style={{ fontSize: 11 }}>Estimativa líquida</div><div className="num pos" style={{ fontWeight: 700, fontSize: 17 }}><Flow value={proj} /></div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 54, marginTop: 12 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div key={i} animate={{ height: `${v ? 15 + (i / 17) * 85 * Math.min(1, 0.4 + v / 8000) : 8}%` }} transition={{ type: 'spring', stiffness: 160, damping: 16, delay: i * 0.015 }}
                style={{ flex: 1, borderRadius: 4, background: i === 17 ? '#0EDBB9' : 'rgba(217,217,222,.35)' }} />
            ))}
          </div>
          <Note style={{ margin: '10px 0 0' }}>Estimativa baseada na taxa atual. Rentabilidade passada não garante resultados futuros.</Note>
        </div>
        <AnimatePresence>
          {ok && (
            <motion.div initial={{ opacity: 0, height: 0, y: 10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div className="card hero" style={{ marginTop: 14 }}>
                <div className="row"><Icon n="ShieldCheck" s={22} c="#0EDBB9" /><div><b style={{ fontSize: 14.5 }}>Pronto para confirmar</b><div className="t2" style={{ fontSize: 12 }}>{v > 1000 ? 'Acima de R$ 1.000 pedimos Face ID' : 'Revise os dados antes de concluir'}</div></div></div>
                <div className="between" style={{ marginTop: 12, fontSize: 13.5 }}><span className="t2">Valor a investir</span><b className="num">{brl(v)}</b></div>
                <div className="between" style={{ marginTop: 6, fontSize: 13.5 }}><span className="t2">Liquidação</span><b>Hoje, até 17h</b></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="cta"><Btn icon="Check" disabled={!ok} loading={busy} onClick={confirm}>Confirmar investimento</Btn></div>
      {faceEl}
    </div>
  )
}

/* ---------------- resgatar ---------------- */
export function Resgatar({ id = 'selic' }) {
  const { push, openSheet, setState } = useApp()
  const a = getAsset(id)
  const [cents, setCents] = useState(0)
  const [chip, setChip] = useState(null)
  const [ask, faceEl] = useFaceID()
  const [busy, setBusy] = useState(false)
  const v = cents / 100
  const ir = v * (a.bruto / (a.valor || 1)) * 0.15
  const liq = v - ir
  const ok = v > 0 && v <= a.valor
  const pick = (c) => { setChip(c); setCents(Math.round((c === 'Total' ? a.valor : Number(c.replace(/\D/g, ''))) * 100)) }
  const finish = () => { setBusy(true); setTimeout(() => { setState((s) => ({ ...s, saldo: s.saldo + liq })); push('sucesso', { kind: 'resgatar', valor: liq, asset: a.nome, logo: a.logo }, 'fade'); setBusy(false) }, 900) }
  return (
    <div className="layer">
      <Header title="Resgatar" sub={a.nome} right={<CircBtn n="Info" onClick={() => push('ativo', { id: a.id })} />} />
      <div className="scroll withcta">
        <div className="card">
          <div className="between"><span className="t2" style={{ fontSize: 13.5 }}>Saldo no ativo</span><b className="num">{brl(a.valor)}</b></div>
          <div className="between" style={{ marginTop: 6 }}><span className="t3" style={{ fontSize: 12.5 }}>Disponível para resgate</span><span className="t2" style={{ fontSize: 12.5 }}>100% · {a.liq}</span></div>
        </div>
        <div className="ovl" style={{ margin: '20px 4px 8px' }}>Quanto você quer resgatar?</div>
        <MoneyInput cents={cents} setCents={(c) => { setCents(c); setChip(null) }} err={v > a.valor} />
        <div className={v > a.valor ? 'help err' : 'help'} style={{ margin: '8px 4px 12px' }}>{v > a.valor ? 'Valor acima do saldo no ativo.' : `Saldo restante: ${brl(Math.max(0, a.valor - v))}`}</div>
        <Chips items={['R$ 500', 'R$ 1.000', 'R$ 2.500', 'Total']} value={chip} onChange={pick} />
        <div className="card" style={{ marginTop: 16 }}>
          <div className="ovl" style={{ marginBottom: 10 }}>Detalhamento</div>
          <div className="between" style={{ fontSize: 13.5 }}><span className="t2">Valor bruto</span><b className="num">{brl(v)}</b></div>
          <div className="between" style={{ fontSize: 13.5, marginTop: 8 }}><span className="t2">Imposto de renda (15% s/ lucro)</span><b className="num neg">− {brl(ir)}</b></div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '12px 0' }} />
          <div className="between"><span style={{ fontWeight: 600 }}>Valor líquido</span><b className="num pos" style={{ fontSize: 18 }}><Flow value={liq} /></b></div>
          <div className="between" style={{ fontSize: 12.5, marginTop: 8 }}><span className="t3">Liquidação</span><span className="t2">Hoje · {a.liq}</span></div>
        </div>
      </div>
      <div className="cta"><Btn icon="Check" disabled={!ok} loading={busy} onClick={() => openSheet({ render: (c) => <ConfirmSheet close={c} title="Confirmar resgate" cta="Confirmar resgate" rows={[['Ativo', a.nome], ['Valor bruto', brl(v)], ['IR', '− ' + brl(ir), 'neg'], ['Você recebe', brl(liq), 'pos'], ['Liquidação', 'Hoje · ' + a.liq]]} onConfirm={() => (v > 1000 ? ask(finish) : finish())} /> })}>Confirmar resgate</Btn></div>
      {faceEl}
    </div>
  )
}

/* ---------------- sucesso ---------------- */
export function Sucesso({ kind, valor, asset, logo, title, sub, to }) {
  const { reset, openSheet } = useApp()
  const T = title || { investir: 'Investimento confirmado!', resgatar: 'Resgate solicitado!', pix: 'Pix enviado!', fatura: 'Fatura paga!', meta: 'Aporte realizado!' }[kind]
  const S = sub || { investir: `Seu dinheiro já está rendendo em ${asset}.`, resgatar: `O valor cai na sua conta Rendash hoje.`, pix: `Para ${to}. Chegou na hora.`, fatura: 'Pagamento processado. Seu limite foi liberado.', meta: 'Você está mais perto do seu objetivo.' }[kind]
  useEffect(() => {
    vibrate([12, 40, 12])
    const t = setTimeout(() => island({ kind, title: { investir: 'Investido', resgatar: 'Resgate solicitado', pix: 'Pix enviado', fatura: 'Fatura paga', meta: 'Aporte feito' }[kind] || T.replace('!', ''), sub: kind === 'pix' ? `Para ${to}` : asset || 'Rendash', value: valor ? brl(valor, { cents: false }) : null }), 350)
    return () => clearTimeout(t)
  }, [])
  const now = new Date()
  const id = 'E' + Math.random().toString(36).slice(2, 12).toUpperCase()
  const receipt = () => openSheet({
    light: true, render: (c) => (
      <div>
        <div className="between" style={{ marginBottom: 14 }}><b style={{ fontSize: 18 }}>Comprovante</b><Logo k="rendash" s={34} /></div>
        <div style={{ textAlign: 'center', padding: '10px 0 16px', borderBottom: '1px dashed rgba(0,0,0,.15)' }}>
          <div className="t2" style={{ fontSize: 12 }}>{T.replace('!', '')}</div>
          <div className="num" style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>{brl(valor)}</div>
        </div>
        {[['Data', now.toLocaleDateString('pt-BR') + ' · ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })], [kind === 'pix' ? 'Para' : 'Ativo', to || asset || 'Cartão Rendash'], ['Origem', 'Rendash · Conta 45092-2'], ['Autenticação', id]].map(([k, v]) => (
          <div key={k} className="between" style={{ padding: '10px 0', fontSize: 13.5, borderBottom: '1px solid rgba(0,0,0,.06)' }}><span className="t2">{k}</span><b className="ell" style={{ maxWidth: 200 }}>{v}</b></div>
        ))}
        <button className="btn primary" style={{ marginTop: 16 }} onClick={c}><Icon n="Share" s={18} />Compartilhar</button>
      </div>
    ),
  })
  return (
    <div className="layer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'calc(var(--safe-top) + 70px) 24px 0', textAlign: 'center', overflow: 'hidden' }}>
      <Confetti />
      <SuccessMark />
      <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} style={{ fontSize: 26, fontWeight: 650, marginTop: 26, letterSpacing: '-.03em' }}>{T}</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="t2" style={{ marginTop: 8, fontSize: 14 }}>{S}</motion.p>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, ...spring }} className="card hero" style={{ width: '100%', marginTop: 26 }}>
        <div className="row" style={{ justifyContent: 'center' }}>{logo && <Logo k={logo} s={30} />}<span className="t2" style={{ fontSize: 13 }}>{asset || to || 'Cartão Rendash'}</span></div>
        <div className="num" style={{ fontWeight: 700, fontSize: 34, marginTop: 8, letterSpacing: '-.03em' }}><Count to={valor} delay={0.8} duration={1.2} /></div>
        <div className="t3" style={{ fontSize: 12, marginTop: 4 }}>{now.toLocaleDateString('pt-BR')} · autenticação {id.slice(0, 6)}</div>
      </motion.div>
      <div className="cta" style={{ background: 'none' }}>
        <Btn kind="ghost" icon="ReceiptText" onClick={receipt}>Ver comprovante</Btn>
        <Btn onClick={() => reset('tabs', {}, 'fade')}>Voltar ao início</Btn>
      </div>
    </div>
  )
}

/* ---------------- ativo ---------------- */
export function Ativo({ id = 'selic' }) {
  const { push, prefs } = useApp()
  const a = getAsset(id)
  const [r, setR] = useState('3M')
  const seed = seedOf(id) + RANGES.indexOf(r) * 13
  const s = useMemo(() => { const base = series(seed, 40, 100, (a.rent / 100) / 40 + 0.0005, 0.03); const f = (a.valor || a.preco || 100) / base[base.length - 1]; return base.map((x) => x * f) }, [seed])
  const ch = ((s[s.length - 1] - s[0]) / s[0]) * 100
  const ind = a.own
    ? [['Rentabilidade real', pct(a.rent), 'pos'], ['Desempenho CDI', `${a.cdi}% CDI`], ['Valor investido', brl(a.investido, { cents: false })], ['Rendimento bruto', brl(a.bruto, { cents: false }), 'pos'], ['Liquidez', a.liq], ['Vencimento', a.venc]]
    : [['Preço atual', brl(a.preco)], ['Variação 24h', pct(a.rent, 2), a.rent < 0 ? 'neg' : 'pos'], ['Mín. 52 sem.', brl(a.preco * 0.78)], ['Máx. 52 sem.', brl(a.preco * 1.21)], ['Liquidez', a.liq], ['Categoria', a.tipo]]
  return (
    <div className="layer">
      <Header title="Detalhes do ativo" sub={a.tipo} right={<CircBtn n="Star" onClick={() => {}} />} />
      <div className="scroll withcta">
        <Stagger>
          <Item style={{ textAlign: 'center' }}>
            <div className="row" style={{ justifyContent: 'center', gap: 8 }}><Logo k={a.logo} s={26} /><span className="t2" style={{ fontSize: 13.5 }}>{a.nome}</span></div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}><Money v={a.own ? a.valor : a.preco} size={34} hidden={prefs.hidden && a.own} /></div>
            <motion.div key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={ch < 0 ? 'neg' : 'pos'} style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{pct(ch)} em {r}</motion.div>
          </Item>
          <Item className="card hero" style={{ marginTop: 16 }}>
            <div className="between" style={{ marginBottom: 10 }}><span className="ovl">Evolução · {r}</span><span className={`badge ${ch < 0 ? 'neg' : ''}`}>{ch > 0 ? '+' : ''}{brl((s[s.length - 1] - s[0]), { cents: false })}</span></div>
            <LineChart data={s} h={130} dkey={r} color={a.cor} />
            <div style={{ marginTop: 12 }}><Seg items={RANGES} value={r} onChange={setR} /></div>
          </Item>
          <Item className="sec"><h3>Indicadores-chave</h3><button onClick={() => push('graficos', { id })}>Comparar</button></Item>
          <Item style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {ind.map(([k, v, c], i) => (
              <motion.div key={k} className="card flat" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }} style={{ padding: 12, borderRadius: 16 }}>
                <div className="ovl" style={{ fontSize: 9.5 }}>{k}</div><div className={`num ${c || ''}`} style={{ fontWeight: 650, marginTop: 4, fontSize: 14.5 }}>{v}</div>
              </motion.div>
            ))}
          </Item>
          {a.own && <Item><Note>Você tem {brl(a.valor)} neste ativo, {Math.round((a.valor / 124850) * 100)}% da carteira.</Note></Item>}
        </Stagger>
      </div>
      <div className="cta" style={{ flexDirection: 'row' }}>
        {a.own && <Btn kind="ghost" onClick={() => push('resgatar', { id })}>Resgatar</Btn>}
        <Btn onClick={() => push('investir', { id })}>{a.own ? 'Investir mais' : 'Comprar'}</Btn>
      </div>
    </div>
  )
}

export function Graficos({ id = 'selic' }) {
  const a = getAsset(id)
  const [p, setP] = useState('1M')
  const d = EARN[p] || EARN['1M']
  const s = useMemo(() => series(seedOf(id), 40, 100, 0.003, 0.02), [id])
  return (
    <div className="layer">
      <Header title="Gráficos" sub="Evolução e comparação" />
      <div className="scroll notab">
        <div className="card hero"><div className="ovl" style={{ marginBottom: 10 }}>Evolução · 3 meses</div><LineChart data={s} h={120} color={a.cor} fmt={(v) => num(v, 2)} labels={['Jul', 'Ago', 'Set']} /></div>
        <div className="card" style={{ marginTop: 14 }}>
          <div className="between" style={{ marginBottom: 10 }}><span className="ovl">Comparação</span><Seg items={['7D', '1M', '3M']} value={p} onChange={setP} style={{ width: 160 }} /></div>
          <Bars key={p} data={d.bars} labels={d.lbl} dkey={p} h={120} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><Stat label="Acumulado 1M" value={brl(d.total, { cents: false })} /><Stat label="Yield médio" value="102% CDI" /><Stat label="Melhor dia" value="+R$ 180" cls="pos" /></div>
        <div className="card" style={{ marginTop: 14 }}>
          <div className="ovl">Projeção</div>
          <div className="row" style={{ marginTop: 10 }}>
            <div className="grow"><div className="t3" style={{ fontSize: 11 }}>Valor aplicado</div><b className="num">R$ 5.000,00</b></div>
            <div className="grow"><div className="t3" style={{ fontSize: 11 }}>Estimativa líquida</div><b className="num pos"><Count to={6274.9} /></b></div>
          </div>
          <Note style={{ margin: '10px 0 0' }}>Estimativa baseada na taxa atual. Rentabilidade passada não garante resultados futuros.</Note>
        </div>
      </div>
    </div>
  )
}

/* ---------------- ranking ---------------- */
export function MercadoBusca() {
  const { push } = useApp()
  const [o, setO] = useState('Altas')
  const live = useLivePrices(STOCKS)
  const sorted = [...live].sort((a, b) => (o === 'Altas' ? b.c - a.c : o === 'Baixas' ? a.c - b.c : b.p - a.p))
  return (
    <div className="layer">
      <Header title="Ranking" sub="Mais negociados · 24h" />
      <div className="scroll notab">
        <Seg items={['Altas', 'Baixas', 'Volume']} value={o} onChange={setO} />
        <div className="list" style={{ marginTop: 14 }}>
          {sorted.map((s, i) => (
            <motion.div key={s.t} layout transition={spring} style={{ position: 'relative' }}>
              <span className="t3 num" style={{ position: 'absolute', left: 4, top: 26, fontSize: 10, zIndex: 2 }}>{i + 1}</span>
              <PriceRow s={s} onClick={() => push('ativo', { id: s.id || s.t })} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- metas ---------------- */
export function useGoals() {
  const { state, setState } = useApp()
  const goals = state.goals || GOALS
  return [goals, (g) => setState((s) => ({ ...s, goals: typeof g === 'function' ? g(s.goals || GOALS) : g }))]
}
export function Metas() {
  const { push } = useApp()
  const [goals] = useGoals()
  const tot = goals.reduce((a, b) => a + b.v, 0), alvo = goals.reduce((a, b) => a + b.alvo, 0)
  return (
    <div className="layer">
      <Header title="Minhas metas" sub={`${brl(tot, { cents: false })} guardados`} right={<CircBtn n="Plus" onClick={() => push('novaMeta', {}, 'modal')} />} />
      <div className="scroll notab">
        <div className="card hero">
          <div className="between"><span className="ovl">Progresso total</span><span className="badge mut">{goals.length} objetivos</span></div>
          <div style={{ margin: '8px 0 12px' }}><Money v={tot} size={30} /></div>
          <ProgressBar p={(tot / alvo) * 100 + 5} />
        </div>
        <Stagger delay={0.1}>
          {goals.map((g) => {
            const p = Math.round((g.v / g.alvo) * 100)
            return (
              <Item key={g.id}>
                <Tap className="card" style={{ marginTop: 12, width: '100%', textAlign: 'left', display: 'block' }} onClick={() => push('meta', { id: g.id })} scale={0.98}>
                  <div className="row">
                    <Ring p={p} s={58} sw={6} color={g.cor}><span className="num" style={{ fontSize: 13, fontWeight: 700 }}>{p}%</span></Ring>
                    <div className="grow"><div className="row" style={{ fontWeight: 650, gap: 6 }}><Icon n={g.ic || 'Target'} s={15} c={g.cor} />{g.n}</div><div className="num" style={{ fontSize: 13, marginTop: 2 }}>{brl(g.v, { cents: false })} <span className="t3">de {brl(g.alvo, { cents: false })} · {g.prazo}</span></div></div>
                    <Icon n="ChevronRight" s={18} c="rgba(255,255,255,.4)" />
                  </div>
                  <div className="row t2" style={{ fontSize: 12, marginTop: 10, gap: 6 }}><Icon n="Lightbulb" s={14} c="#FFB84D" />{g.dica}</div>
                </Tap>
              </Item>
            )
          })}
        </Stagger>
      </div>
    </div>
  )
}
export function Meta({ id }) {
  const { openSheet, push } = useApp()
  const [goals, setGoals] = useGoals()
  const g = goals.find((x) => x.id === id) || goals[0]
  const p = Math.min(100, Math.round((g.v / g.alvo) * 100))
  const [party, setParty] = useState(0)
  const aport = (val) => { setGoals((gs) => gs.map((x) => (x.id === g.id ? { ...x, v: x.v + val } : x))); setParty((n) => n + 1); vibrate([10, 30, 10]) }
  const hist = [['Aporte automático', '01 set', 500], ['Aporte', '18 ago', 1200], ['Rendimento', '31 ago', 92.4], ['Aporte automático', '01 ago', 500]]
  return (
    <div className="layer">
      <Header title={g.n} sub={`Prazo: ${g.prazo}`} right={<CircBtn n="Pencil" onClick={() => {}} />} />
      {party > 0 && <Confetti key={party} n={40} />}
      <div className="scroll withcta">
        <div data-confetti-anchor style={{ display: 'grid', placeItems: 'center', margin: '6px 0 18px', justifySelf: 'center', width: 200, marginLeft: 'auto', marginRight: 'auto' }}>
          <Ring p={p} s={200} sw={14} color={g.cor} delay={0.15}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'grid', placeItems: 'center', marginBottom: 4 }}><Icon n={g.ic || 'Target'} s={30} c={g.cor} /></div>
              <div className="num" style={{ fontSize: 30, fontWeight: 700 }}><Flow value={p} kind="int" suffix="%" /></div>
              <div className="t2" style={{ fontSize: 12 }}>concluído</div>
            </div>
          </Ring>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Stat label="Guardado" value={<Flow value={g.v} kind="brl0" />} />
          <Stat label="Falta" value={brl(Math.max(0, g.alvo - g.v), { cents: false })} />
          <Stat label="Por mês" value="R$ 500" cls="pos" />
        </div>
        <div className="card row" style={{ marginTop: 12, fontSize: 13 }}><Icon n="Lightbulb" s={18} c="#FFB84D" /><span className="t2">{g.dica}</span></div>
        <div className="sec"><h3>Histórico</h3></div>
        <div className="list">{hist.map(([t, d, v]) => <Li key={t + d} icon={t.includes('Rend') ? 'TrendingUp' : 'PiggyBank'} title={t} sub={d} value={brl(v, { sign: true })} vcls="pos" chevron={false} />)}</div>
      </div>
      <div className="cta"><Btn icon="Plus" onClick={() => openSheet({ render: (c) => <AporteSheet close={c} onOk={aport} /> })}>Fazer aporte</Btn></div>
    </div>
  )
}
function AporteSheet({ close, onOk }) {
  const [v, setV] = useState(500)
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 650 }}>Quanto quer guardar?</h3>
      <div className="num" style={{ fontSize: 40, fontWeight: 700, textAlign: 'center', margin: '18px 0' }}><Flow value={v} kind="brl0" /></div>
      <input type="range" min={50} max={5000} step={50} value={v} onChange={(e) => setV(+e.target.value)} data-nokb style={{ width: '100%', accentColor: '#0EDBB9' }} />
      <div className="chips" style={{ margin: '14px 0 18px' }}>{[100, 250, 500, 1000, 2500].map((x) => <Tap key={x} className={`chip ${v === x ? 'on' : ''}`} onClick={() => setV(x)}>{brl(x, { cents: false })}</Tap>)}</div>
      <Btn icon="Check" onClick={() => { close(); onOk(v) }}>Guardar {brl(v, { cents: false })}</Btn>
    </div>
  )
}
export function NovaMeta() {
  const { pop, toast } = useApp()
  const [, setGoals] = useGoals()
  const [n, setN] = useState('')
  const [e, setE] = useState('House')
  const [cents, setCents] = useState(0)
  const [prazo, setPrazo] = useState('1 ano')
  const ok = n.trim() && cents >= 10000
  return (
    <div className="layer">
      <Header title="Nova meta" sub="Defina seu objetivo" />
      <div className="scroll withcta">
        <div className="ovl" style={{ margin: '0 4px 8px' }}>Ícone</div>
        <div className="chips" style={{ marginBottom: 16 }}>
          {['House', 'Car', 'Plane', 'GraduationCap', 'Gem', 'Laptop', 'LifeBuoy', 'TreePalm'].map((x) => (
            <motion.button key={x} onClick={() => setE(x)} animate={{ scale: e === x ? 1.08 : 1, background: e === x ? 'rgba(14,219,185,.22)' : 'rgba(255,255,255,.06)' }} style={{ width: 50, height: 50, borderRadius: 16, flex: 'none', display: 'grid', placeItems: 'center', border: e === x ? '1.5px solid #0EDBB9' : '1px solid rgba(255,255,255,.1)' }}><Icon n={x} s={22} c={e === x ? '#0EDBB9' : 'rgba(255,255,255,.85)'} /></motion.button>
          ))}
        </div>
        <Field label="Nome da meta" icon="Target"><input placeholder="Ex.: Meu primeiro carro" value={n} onChange={(ev) => setN(ev.target.value)} /></Field>
        <div className="ovl" style={{ margin: '4px 4px 8px' }}>Valor do objetivo</div>
        <MoneyInput cents={cents} setCents={setCents} />
        <div className="ovl" style={{ margin: '18px 4px 8px' }}>Prazo</div>
        <Chips items={['6 meses', '1 ano', '2 anos', '5 anos']} value={prazo} onChange={setPrazo} />
        {cents > 0 && <Note icon="Calculator">Guardando {brl(cents / 100 / ({ '6 meses': 6, '1 ano': 12, '2 anos': 24, '5 anos': 60 }[prazo]), { cents: false })}/mês você chega lá.</Note>}
      </div>
      <div className="cta"><Btn disabled={!ok} onClick={() => { setGoals((g) => [...g, { id: 'g' + Date.now(), n, ic: e, v: 0, alvo: cents / 100, prazo, cor: '#5AA9FF', dica: 'Ative o aporte automático para não esquecer.' }]); toast('Meta criada'); pop() }}>Criar meta</Btn></div>
    </div>
  )
}

/* ---------------- extrato mensal ---------------- */
const MONTHS = ['Julho', 'Agosto', 'Setembro']
export function Extrato() {
  const { prefs } = useApp()
  const [m, setM] = useState(2)
  const [dir, setDir] = useState(1)
  const mult = [0.82, 0.91, 1][m]
  const ent = 5200 * mult, sai = 1850 * mult
  const go = (d) => { setDir(d); setM((x) => Math.max(0, Math.min(2, x + d))) }
  const groups = TX.reduce((acc, t) => { (acc[t.dia] = acc[t.dia] || []).push(t); return acc }, {})
  return (
    <div className="layer">
      <Header title="Extrato" sub="Todas as movimentações" />
      <div className="scroll notab">
        <div className="card hero">
          <div className="between">
            <CircBtn n="ChevronLeft" s={34} onClick={() => go(-1)} />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.b key={m} initial={{ x: 30 * dir, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30 * dir, opacity: 0 }} style={{ fontSize: 15 }}>{MONTHS[m]} 2026</motion.b>
            </AnimatePresence>
            <CircBtn n="ChevronRight" s={34} onClick={() => go(1)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Stat label="Entradas" value={prefs.hidden ? '••••' : <Flow value={ent} kind="brl0" />} cls="pos" />
            <Stat label="Saídas" value={prefs.hidden ? '••••' : <Flow value={sai} kind="brl0" />} />
            <Stat label="Saldo" value={prefs.hidden ? '••••' : <Flow value={ent - sai} kind="brl0" />} />
          </div>
        </div>
        <motion.div key={m} initial={{ opacity: 0, x: 30 * dir }} animate={{ opacity: 1, x: 0 }}>
          {Object.entries(groups).map(([d, ts]) => (
            <div key={d}>
              <div className="sec"><h3 style={{ fontSize: 13 }} className="t2">{d.toUpperCase()}</h3></div>
              <div className="list">{ts.map((t) => <TxRow key={t.id} t={t} hidden={prefs.hidden} />)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ---------------- notificações ---------------- */
export function Notificacoes() {
  const { prefs, setPref, push, toast } = useApp()
  const [f, setF] = useState('Todas')
  const [items, setItems] = useState(NOTIFS)
  const list = items.filter((n) => f === 'Todas' || n.cat === f)
  const unread = prefs.readAll ? 0 : items.filter((n) => n.unread).length
  const go = (n) => ({ up: () => push('ativo', { id: 'selic' }), alert: () => push('mercadoBusca'), target: () => push('meta', { id: 'reserva' }), coin: () => push('ativo', { id: 'petr4' }), shield: () => push('config'), card: () => push('fatura'), sync: () => push('ofContas') }[n.ic] || (() => {}))()
  return (
    <div className="layer">
      <Header title="Notificações" sub={unread ? `${unread} novas atualizações` : 'Tudo em dia'} right={<CircBtn n="CheckCheck" onClick={() => { setPref('readAll', true); toast('Todas marcadas como lidas') }} />} />
      <div className="scroll notab">
        <Seg items={['Todas', 'Rendimentos', 'Alertas', 'Sistema']} value={f} onChange={setF} />
        <div style={{ marginTop: 14 }}>
          <AnimatePresence initial={false}>
            {list.map((n) => (
              <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -300, height: 0, marginBottom: 0 }} style={{ position: 'relative', marginBottom: 10 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#FF453A', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 22 }}><Icon n="Trash2" s={20} /></div>
                <motion.div drag="x" dragConstraints={{ left: -90, right: 0 }} dragElastic={0.1} dragSnapToOrigin onDragEnd={(e, i) => { if (i.offset.x < -110) setItems((x) => x.filter((y) => y.id !== n.id)) }}
                  className="card row" style={{ alignItems: 'flex-start', background: '#161830', touchAction: 'pan-y', cursor: 'pointer', position: 'relative', zIndex: 1 }} onTap={() => go(n)}>
                  <div className="ic"><Icon n={n.ic} s={19} c={n.ic === 'alert' ? '#FFB84D' : '#0EDBB9'} /></div>
                  <div className="grow">
                    <div className="between"><b style={{ fontSize: 14 }}>{n.t}</b><span className="t3" style={{ fontSize: 11.5 }}>{n.q}</span></div>
                    <div className="t2" style={{ fontSize: 12.5, marginTop: 3 }}>{n.d}</div>
                  </div>
                  <AnimatePresence>{n.unread && !prefs.readAll && <motion.i exit={{ scale: 0 }} style={{ width: 8, height: 8, borderRadius: 4, background: '#0EDBB9', marginTop: 6, flex: 'none' }} />}</AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="t3" style={{ textAlign: 'center', fontSize: 12, marginTop: 8 }}>Arraste para a esquerda para apagar</div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- configurações ---------------- */
function SoundRow() {
  const [v, setV] = useState(soundOn())
  return <Li icon="Volume2" title="Sons do app" sub="Toques, Pix, investimentos e avisos" chevron={false} right={<Toggle on={v} onChange={(x) => { setSound(x); setV(x) }} />} />
}
function DeviceNotifRow() {
  const { toast } = useApp()
  const can = typeof Notification !== 'undefined' && 'serviceWorker' in navigator
  const [p, setP] = useState(can ? Notification.permission : 'unsupported')
  const sub = p === 'granted' ? 'Ativas: os avisos aparecem na tela do seu aparelho' : p === 'denied' ? 'Bloqueadas nos ajustes do aparelho' : can ? 'Receba os avisos do Rendash na tela do aparelho' : 'No iPhone: adicione o app à Tela de Início primeiro'
  const ask = async () => {
    if (!can) { toast('Toque em Compartilhar e em Adicionar à Tela de Início', 'Share'); return }
    const r = await Notification.requestPermission(); setP(r)
    if (r === 'granted') { const reg = await navigator.serviceWorker.ready; reg.showNotification('Rendash', { body: 'Pronto! Você vai receber seus avisos por aqui.', icon: 'img/icon-192.png', badge: 'img/icon-192.png', tag: 'rd-ok' }) }
  }
  return <Li icon="BellRing" title="Notificações no aparelho" sub={sub} chevron={p !== 'granted'} onClick={p === 'granted' ? undefined : ask} />
}
export function Config() {
  const { prefs, setPref, openSheet, toast } = useApp()
  const score = 60 + (prefs.bio ? 16 : 0) + (prefs.bioConf ? 16 : 0) + (prefs.hideOpen ? 8 : 0)
  const T = ({ k }) => <Toggle on={prefs[k]} onChange={(v) => setPref(k, v)} />
  return (
    <div className="layer">
      <Header title="Configurações" sub="Segurança e preferências" />
      <div className="scroll notab">
        <div className="card hero row">
          <Ring p={score} s={64} sw={6} color={score >= 90 ? '#0EDBB9' : score >= 75 ? '#FFB84D' : '#FF6B6B'}><span className="num" style={{ fontWeight: 700, fontSize: 14 }}><Flow value={score} kind="int" suffix="%" /></span></Ring>
          <div><b>{score >= 90 ? 'Conta muito segura' : score >= 75 ? 'Conta segura' : 'Atenção à segurança'}</b><div className="t2" style={{ fontSize: 12.5, marginTop: 2 }}>{score >= 100 ? 'Tudo protegido.' : 'Ative as opções abaixo para chegar a 100%.'}</div></div>
        </div>
        <div className="sec"><h3>Segurança</h3></div>
        <div className="list">
          <Li icon="ScanFace" title="Acesso por Face ID" sub="Face ID neste iPhone" chevron={false} right={<T k="bio" />} />
          <Li icon="Fingerprint" title="Confirmação biométrica" sub="Movimentações acima de R$ 1.000" chevron={false} right={<T k="bioConf" />} />
          <Li icon="KeyRound" title="Alterar senha do app" sub="Atualizada há 42 dias" onClick={() => openSheet({ render: (c) => <div><h3 style={{ fontSize: 18, fontWeight: 650, marginBottom: 14 }}>Alterar senha</h3><Field label="Senha atual" icon="LockKeyhole"><input type="password" placeholder="••••••••" /></Field><Field label="Nova senha" icon="LockKeyhole"><input type="password" placeholder="Nova senha" /></Field><Btn onClick={() => { c(); toast('Senha atualizada') }}>Salvar nova senha</Btn></div> })} />
          <Li icon="Smartphone" title="Dispositivos autorizados" sub="1 dispositivo conectado" onClick={() => openSheet({ render: (c) => <div><h3 style={{ fontSize: 18, fontWeight: 650, marginBottom: 14 }}>Dispositivos</h3><div className="list"><Li icon="Smartphone" title="iPhone de Guilherme" sub="Este aparelho · Garanhuns, PE" chevron={false} right={<span className="badge">Atual</span>} /><Li icon="Laptop" title="MacBook · Safari" sub="Último acesso há 3 dias" chevron={false} right={<button className="neg" style={{ fontSize: 13, fontWeight: 600 }} onClick={() => { c(); toast('Dispositivo removido') }}>Remover</button>} /></div></div> })} />
        </div>
        <div className="sec"><h3>Notificações e privacidade</h3></div>
        <div className="list">
          <Li icon="TrendingUp" title="Alertas de rendimentos" chevron={false} right={<T k="alRend" />} />
          <Li icon="Activity" title="Alertas de mercado" chevron={false} right={<T k="alMerc" />} />
          <Li icon="EyeOff" title="Ocultar saldo ao abrir" chevron={false} right={<T k="hideOpen" />} />
          <SoundRow />
          <DeviceNotifRow />
        </div>
        <Note icon="Lock" style={{ justifyContent: 'center' }}>Protegido com criptografia de ponta a ponta.</Note>
      </div>
    </div>
  )
}

/* ---------------- perfil investidor ---------------- */
const QS = [
  ['Por quanto tempo pretende deixar o dinheiro investido?', ['Menos de 1 ano', '1 a 5 anos', 'Mais de 5 anos']],
  ['Se seus investimentos caíssem 10% em um mês, você…', ['Resgataria tudo', 'Esperaria recuperar', 'Investiria mais']],
  ['Qual seu conhecimento sobre investimentos?', ['Iniciante', 'Intermediário', 'Avançado']],
]
export function PerfilInv() {
  const [ans, setAns] = useState(null)
  const [q, setQ] = useState([])
  const score = ans ? ans.reduce((a, b) => a + b, 0) : 3
  const prof = score <= 2 ? ['Conservador', 20, '#5AA9FF'] : score <= 4 ? ['Moderado', 50, '#FFB84D'] : ['Arrojado', 82, '#FF6B6B']
  const quiz = ans === null && q.length < 3 && q.started
  return (
    <div className="layer">
      <Header title="Perfil de investidor" sub="Suitability" />
      <div className="scroll notab">
        {q.length < 3 && q.started ? (
          <AnimatePresence mode="wait">
            <motion.div key={q.length} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}>
              <div className="ovl">Pergunta {q.length + 1} de 3</div>
              <div style={{ margin: '10px 0 18px' }}><ProgressBar p={((q.length + 1) / 3) * 100} delay={0} /></div>
              <h2 style={{ fontSize: 21, fontWeight: 650, letterSpacing: '-.02em', marginBottom: 18 }}>{QS[q.length][0]}</h2>
              <div className="list">
                {QS[q.length][1].map((o, i) => <Li key={o} title={o} onClick={() => { const nq = Object.assign([...q, i], { started: true }); if (nq.length === 3) setAns(nq); setQ(nq) }} />)}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div className="card hero" style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 200 110" width="100%" height="140">
                <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="14" strokeLinecap="round" />
                <defs><linearGradient id="gg"><stop offset="0" stopColor="#5AA9FF" /><stop offset=".5" stopColor="#FFB84D" /><stop offset="1" stopColor="#FF6B6B" /></linearGradient></defs>
                <motion.path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#gg)" strokeWidth="14" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                <motion.g initial={{ rotate: -90 }} animate={{ rotate: -90 + prof[1] * 1.8 }} transition={{ type: 'spring', stiffness: 60, damping: 9, delay: 0.4 }} style={{ originX: '100px', originY: '100px' }}>
                  <line x1="100" y1="100" x2="100" y2="34" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                </motion.g>
                <circle cx="100" cy="100" r="8" fill="#fff" />
              </svg>
              <div className="ovl">Seu perfil</div>
              <motion.div key={prof[0]} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: 26, fontWeight: 700, color: prof[2], marginTop: 4 }}>{prof[0]}</motion.div>
              <p className="t2" style={{ fontSize: 13, marginTop: 6 }}>Aceita alguma oscilação em troca de mais rentabilidade no médio prazo.</p>
            </div>
            <div className="sec"><h3>Alocação sugerida</h3></div>
            <div className="card">{[['Renda fixa', 50, '#0EDBB9'], ['Ações', 25, '#8E7CFF'], ['Fundos', 15, '#5AA9FF'], ['Cripto', 10, '#F7931A']].map(([k, v, c], i) => <div key={k} style={{ marginBottom: 10 }}><div className="between" style={{ fontSize: 13, marginBottom: 5 }}><span>{k}</span><b className="num">{v}%</b></div><ProgressBar p={v * 1.6} color={c} delay={0.2 + i * 0.1} /></div>)}</div>
            <Btn kind="ghost" icon="RotateCcw" className="sm" style={{ marginTop: 16 }} onClick={() => { setAns(null); setQ(Object.assign([], { started: true })) }}>Refazer questionário</Btn>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------------- dados pessoais ---------------- */
export function Dados() {
  const { openSheet, toast } = useApp()
  const [d, setD] = useState({ Nome: USER.nome, 'E-mail': USER.email, Celular: '(87) 99812-4821', CPF: USER.cpf, Endereço: 'Garanhuns, PE' })
  const edit = (k) => openSheet({
    render: (c) => <EditSheet k={k} v={d[k]} onSave={(v) => { setD((x) => ({ ...x, [k]: v })); c(); toast(`${k} atualizado`) }} />,
  })
  return (
    <div className="layer">
      <Header title="Dados pessoais" />
      <div className="scroll notab">
        <div style={{ display: 'grid', placeItems: 'center', margin: '4px 0 22px' }}>
          <div style={{ position: 'relative' }}><Avatar src={USER.foto} s={96} /><Tap className="circ" style={{ position: 'absolute', right: -4, bottom: -4, width: 34, height: 34, background: '#0EDBB9', color: '#04130F' }}><Icon n="Camera" s={16} /></Tap></div>
          <b style={{ marginTop: 12, fontSize: 18 }}>{d.Nome}</b><span className="badge" style={{ marginTop: 6 }}><Icon n="BadgeCheck" s={12} />Identidade verificada</span>
        </div>
        <div className="list">{Object.entries(d).map(([k, v]) => <Li key={k} title={k} sub={v} onClick={k === 'CPF' ? undefined : () => edit(k)} right={k === 'CPF' && <Icon n="Lock" s={15} c="rgba(255,255,255,.35)" />} chevron={k !== 'CPF'} />)}</div>
      </div>
    </div>
  )
}
function EditSheet({ k, v, onSave }) {
  const [x, setX] = useState(v)
  return <div><h3 style={{ fontSize: 18, fontWeight: 650, marginBottom: 14 }}>Editar {k.toLowerCase()}</h3><Field label={k}><input value={x} onChange={(e) => setX(e.target.value)} autoFocus /></Field><Btn onClick={() => onSave(x)}>Salvar</Btn></div>
}

/* ---------------- ajuda ---------------- */
const FAQ = [
  ['Como conectar meu banco?', 'Vá em Início › Bancos › Conectar. A conexão usa o Open Finance oficial do Banco Central e é somente leitura.'],
  ['O Rendash pode movimentar meu dinheiro em outros bancos?', 'Não. O consentimento do Open Finance é só de leitura. Investir e resgatar só acontece na conta Rendash.'],
  ['Como funciona o imposto no resgate?', 'O IR é calculado sobre o lucro, conforme a tabela regressiva, e já aparece descontado antes de você confirmar.'],
  ['Esqueci minha senha', 'Na tela de login, toque em “Esqueceu a senha?” e siga o link seguro enviado por e-mail.'],
]
export function Ajuda() {
  const { toast } = useApp()
  const [o, setO] = useState(0)
  const [q, setQ] = useState('')
  const list = FAQ.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="layer">
      <Header title="Central de ajuda" />
      <div className="scroll notab">
        <div className="inp" style={{ height: 46, borderRadius: 23, marginBottom: 14 }}><Icon n="Search" s={18} c="rgba(255,255,255,.5)" /><input placeholder="Como podemos ajudar?" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {list.map(([t, d], i) => (
          <motion.div key={t} layout className="card" style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => setO(o === i ? -1 : i)}>
            <div className="between"><b style={{ fontSize: 14 }}>{t}</b><motion.span animate={{ rotate: o === i ? 180 : 0 }}><Icon n="ChevronDown" s={18} /></motion.span></div>
            <AnimatePresence initial={false}>{o === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="t2" style={{ fontSize: 13, overflow: 'hidden' }}><span style={{ display: 'block', paddingTop: 8 }}>{d}</span></motion.p>}</AnimatePresence>
          </motion.div>
        ))}
        <Btn icon="MessageCircle" style={{ marginTop: 10 }} onClick={() => toast('Atendente conectado', 'MessageCircle')}>Falar com atendente</Btn>
      </div>
    </div>
  )
}

/* ---------------- tx detalhe ---------------- */
export function TxDetalhe({ t }) {
  const { push } = useApp()
  return (
    <div className="layer">
      <Header title="Detalhe" sub={t.cat} />
      <div className="scroll notab">
        <div style={{ textAlign: 'center', margin: '6px 0 20px' }}>
          <div style={{ display: 'grid', placeItems: 'center' }}>{t.logo ? <Logo k={t.logo} s={64} /> : <div className="ic" style={{ width: 64, height: 64, borderRadius: 22 }}><Icon n={t.ic} s={28} /></div>}</div>
          <div className="t2" style={{ marginTop: 12, fontSize: 13 }}>{t.t}</div>
          <div className={`num ${t.v > 0 ? 'pos' : ''}`} style={{ fontSize: 34, fontWeight: 700, marginTop: 4 }}><Count to={t.v} fmt={(v) => brl(v, { sign: true })} /></div>
        </div>
        <div className="list">
          {[['Data', t.dia + ' · ' + (t.s.split('·').pop() || '').trim()], ['Conta', { rendash: 'Rendash ••2891', itau: 'Itaú ••0428', nubank: 'Nubank ••0901' }[t.banco]], ['Categoria', t.cat]].map(([k, v]) => <div key={k} className="li"><span className="t2 grow" style={{ fontSize: 13.5 }}>{k}</span><b style={{ fontSize: 14 }}>{v}</b></div>)}
        </div>
        <div className="sec"><h3>Classificação</h3><button onClick={() => push('classificar', { t })}>Editar</button></div>
        <div className="list"><Li icon="Tag" title={t.cat} sub="Categoria" onClick={() => push('classificar', { t })} /></div>
      </div>
    </div>
  )
}
