import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../store'
import { Tap, Icon, Header, CircBtn, Avatar, Logo, Money, Count, Seg, Chips, Li, Ring, ProgressBar, Stagger, Item, Stat, Note, Btn, Toggle, Spinner, SuccessMark, Confetti, spring , Flow } from '../ui'
import { ACCOUNTS, BANKS, TX, CATS, CATS_REC, CONTACTS, USER } from '../data'
import { brl, pct, num, vibrate, island } from '../format'
import { TxRow, PixGlyph } from './tabs'
import { MoneyInput } from './money'
import { useFaceID } from './auth'

const bankName = (k) => (BANKS.find((b) => b.k === k) || { n: 'Rendash' }).n

/* ---------------- hub ---------------- */
export function OfHub() {
  const { push, prefs, toast } = useApp()
  const [syncing, setSyncing] = useState(false)
  const tot = 186420.9
  const sync = () => { setSyncing(true); setTimeout(() => { setSyncing(false); toast('Contas sincronizadas', 'RefreshCw') }, 1800) }
  return (
    <div className="layer">
      <Header title="Open Finance" sub="Todos os bancos, uma visão" right={<CircBtn n="ShieldCheck" onClick={() => push('ofPermissoes', { bank: 'itau', edit: true })} />} />
      <div className="scroll notab">
        <Stagger>
          <Item className="card hero" style={{ background: 'radial-gradient(120% 90% at 100% 0%, rgba(14,219,185,.2), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.085), rgba(255,255,255,.035))' }}>
            <div className="between"><span className="ovl">Saldo consolidado</span><span className="badge"><motion.i animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ width: 6, height: 6, borderRadius: 3, background: '#0EDBB9' }} />agora</span></div>
            <div style={{ margin: '8px 0' }}><Money v={tot} size={32} hidden={prefs.hidden} /></div>
            <div className="row" style={{ gap: 8 }}><span className="badge">+3,8%</span><span className="t2" style={{ fontSize: 12.5 }}>+ R$ 6.812,40 neste mês</span></div>
          </Item>
          <Item style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 }}>
            {[['Plus', 'Conectar', () => push('ofConectar')], ['RefreshCw', 'Sincronizar', sync], ['Settings2', 'Gerenciar', () => push('ofContas')]].map(([i, l, f], k) => (
              <Tap key={l} className={`card col ${k === 0 ? '' : ''}`} onClick={f} style={{ alignItems: 'center', gap: 6, padding: '14px 4px', fontSize: 12.5, fontWeight: 550, background: k === 0 ? 'linear-gradient(180deg,#34ECD0,#0BC1A4)' : undefined, color: k === 0 ? '#04130F' : undefined }} scale={0.94}>
                <motion.span animate={i === 'RefreshCw' && syncing ? { rotate: 360 } : { rotate: 0 }} transition={i === 'RefreshCw' && syncing ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : {}}><Icon n={i} s={20} /></motion.span>{l}
              </Tap>
            ))}
          </Item>
          <Item className="sec"><h3>Instituições conectadas</h3><span className="t3" style={{ fontSize: 12 }}>3 contas</span></Item>
          <Item className="list">
            {ACCOUNTS.filter((a) => a.id !== 'itaup').map((a) => (
              <Li key={a.id} logo={a.logo} title={a.banco} sub={`${a.tipo} · •• ${a.fim}`} value={prefs.hidden ? '••••' : brl(a.saldo)} vsub={syncing ? 'sincronizando…' : a.quando} onClick={() => push('ofContas')} />
            ))}
          </Item>
          <Item><Note icon="Lock">Seus dados são criptografados e você controla cada permissão. Conexão somente leitura.</Note></Item>
        </Stagger>
      </div>
    </div>
  )
}

export function OfConectar() {
  const { push } = useApp()
  const [q, setQ] = useState('')
  const res = BANKS.filter((b) => (b.n + b.s).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="layer">
      <Header title="Conectar instituição" sub="Open Finance Brasil" />
      <div className="scroll notab">
        <h2 style={{ fontSize: 23, fontWeight: 650, letterSpacing: '-.02em' }}>Qual banco você usa?</h2>
        <p className="t2" style={{ fontSize: 13.5, margin: '6px 0 16px' }}>Busque uma instituição autorizada pelo Banco Central para trazer saldos e movimentações.</p>
        <div className="inp" style={{ height: 48, borderRadius: 24 }}>
          <Icon n="Search" s={18} c="rgba(255,255,255,.5)" /><input placeholder="Buscar banco" value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button onClick={() => setQ('')} className="pos" style={{ fontSize: 13, fontWeight: 600 }}>Limpar</button>}
        </div>
        <div className="t3" style={{ fontSize: 12, margin: '10px 4px 14px' }}>{res.length} instituições encontradas</div>
        {!q && (
          <>
            <div className="ovl" style={{ margin: '0 4px 10px' }}>Populares</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
              {['nubank', 'itau', 'bb', 'c6'].map((k, i) => (
                <Tap key={k} className="card col" onClick={() => push('ofPermissoes', { bank: k })} style={{ alignItems: 'center', gap: 8, padding: '12px 4px', fontSize: 11.5 }} scale={0.92}>
                  <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring, delay: i * 0.06 }}><Logo k={k} s={42} r={0.5} /></motion.div>{{ bb: 'BB', itau: 'Itaú' }[k] || bankName(k).split(' ')[0]}
                </Tap>
              ))}
            </div>
          </>
        )}
        <div className="ovl" style={{ margin: '0 4px 10px' }}>Resultados</div>
        <motion.div layout className="list">
          <AnimatePresence initial={false}>
            {res.map((b) => (
              <motion.div key={b.k} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                <Li logo={b.k} title={b.n} sub={b.s} chevron={false} right={<span className="chip" style={{ padding: '5px 10px', fontSize: 12 }}>Selecionar</span>} onClick={() => push('ofPermissoes', { bank: b.k })} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <Note icon="BadgeCheck">Conexão oficial via ecossistema Open Finance Brasil.</Note>
      </div>
    </div>
  )
}

export function OfPermissoes({ bank = 'itau', edit }) {
  const { push, pop, toast } = useApp()
  const [p, setP] = useState({ c: true, e: true, k: true, i: false })
  const [val, setVal] = useState('12 meses')
  const n = bankName(bank)
  const perms = [['c', 'Wallet', 'Contas e saldos', 'Tipo, agência, conta e saldo disponível'], ['e', 'ListOrdered', 'Extratos e transações', 'Movimentações dos últimos 12 meses'], ['k', 'CreditCard', 'Cartões e faturas', 'Limites, lançamentos e vencimentos'], ['i', 'ChartLine', 'Investimentos', 'Posição e rendimentos, sem poder de resgate']]
  return (
    <div className="layer">
      <Header title="Permissões" sub={n} />
      <div className="scroll withcta">
        <div className="card row"><Logo k={bank} s={44} r={0.5} /><div className="grow"><b>{n}</b><div className="t2" style={{ fontSize: 12 }}>Compartilhar com Rendash</div></div><span className="badge"><Icon n="ShieldCheck" s={11} />SEGURO</span></div>
        <h2 style={{ fontSize: 22, fontWeight: 650, margin: '20px 0 6px', letterSpacing: '-.02em' }}>Você está no controle</h2>
        <p className="t2" style={{ fontSize: 13.5, marginBottom: 16 }}>Escolha os dados que a Rendash poderá consultar. Nenhuma movimentação será feita.</p>
        <div className="list">{perms.map(([k, i, t, s]) => <Li key={k} icon={i} title={t} sub={s} chevron={false} right={<Toggle on={p[k]} onChange={(v) => setP((x) => ({ ...x, [k]: v }))} />} />)}</div>
        <div className="ovl" style={{ margin: '18px 4px 8px' }}>Validade do consentimento</div>
        <Chips items={['3 meses', '6 meses', '12 meses']} value={val} onChange={setVal} />
      </div>
      <div className="cta">
        <Btn icon="ExternalLink" disabled={!Object.values(p).some(Boolean)} onClick={() => (edit ? (toast('Permissões atualizadas'), pop()) : push('ofSync', { bank }, 'fade'))}>{edit ? 'Salvar permissões' : `Continuar no ${n.split(' ')[0]}`}</Btn>
        <div className="t3" style={{ fontSize: 11, textAlign: 'center' }}>Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.</div>
      </div>
    </div>
  )
}

export function OfSync({ bank = 'itau', fail }) {
  const { replace, push, pop } = useApp()
  const [p, setP] = useState(0)
  const [tx, setTx] = useState(0)
  const n = bankName(bank)
  useEffect(() => {
    let v = 0
    const t = setInterval(() => {
      v = Math.min(100, v + 2 + Math.random() * 3); setP(v); setTx(Math.round((v / 100) * 2847))
      if (fail && v > 62) { clearInterval(t); setTimeout(() => replace('ofErro', { bank }, 'fade'), 400) }
      if (v >= 100) { clearInterval(t); vibrate([10, 30, 10]); setTimeout(() => replace('ofPronto', { bank }, 'fade'), 500) }
    }, 110)
    return () => clearInterval(t)
  }, [])
  const steps = [['Autorização confirmada', 'Concluído', 10], ['Contas e saldos', '3 contas encontradas', 35], ['Transações', `Importando ${num(tx)} itens`, 70], ['Cartões e investimentos', 'Na sequência', 100]]
  return (
    <div className="layer">
      <Header title="Sincronizando" sub={n} right={<CircBtn n="X" onClick={() => pop()} />} />
      <div className="scroll withcta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', margin: '10px 0 20px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} style={{ position: 'absolute', inset: -14, borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent, rgba(14,219,185,.4), transparent 40%)', filter: 'blur(6px)' }} />
          <Ring p={p} s={150} sw={10} delay={0}><div style={{ textAlign: 'center' }}><div className="num" style={{ fontSize: 34, fontWeight: 700 }}>{Math.round(p)}%</div><div className="t3" style={{ fontSize: 11 }}>sincronizado</div></div></Ring>
        </div>
        <div className="row" style={{ gap: 10 }}><Logo k={bank} s={30} r={0.5} /><Icon n="ArrowLeftRight" s={16} c="rgba(255,255,255,.4)" /><Logo k="rendash" s={30} /></div>
        <h2 style={{ fontSize: 22, fontWeight: 650, marginTop: 16, textAlign: 'center' }}>Trazendo sua vida financeira</h2>
        <p className="t2" style={{ fontSize: 13.5, textAlign: 'center', marginTop: 6 }}>Isso costuma levar menos de um minuto. Você pode deixar esta tela aberta.</p>
        <div className="list" style={{ width: '100%', marginTop: 20 }}>
          {steps.map(([t, s, at], i) => {
            const done = p >= at, cur = !done && (i === 0 || p >= steps[i - 1][2])
            return (
              <div key={t} className="li">
                <div style={{ width: 26, height: 26, display: 'grid', placeItems: 'center' }}>
                  {done ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 24, height: 24, borderRadius: 12, background: '#0EDBB9', display: 'grid', placeItems: 'center' }}><Icon n="Check" s={14} c="#04130F" w={3} /></motion.div> : cur ? <Spinner s={18} c="#0EDBB9" /> : <i style={{ width: 10, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.2)' }} />}
                </div>
                <div className="grow"><div className="ti" style={{ fontSize: 14 }}>{t}</div><div className="su num">{done ? (i === 2 ? '2.847 importadas' : s.replace('Na sequência', 'Concluído')) : s}</div></div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="cta">
        <Btn kind="ghost" onClick={() => pop()}>Continuar em segundo plano</Btn>
        <button className="t3" style={{ fontSize: 12 }} onClick={() => replace('ofSync', { bank, fail: true }, 'fade')}>Simular falha de conexão</button>
      </div>
    </div>
  )
}

export function OfErro({ bank = 'itau' }) {
  const { replace, pop, openSheet, closeSheet } = useApp()
  const n = bankName(bank)
  useEffect(() => { vibrate(80) }, [])
  const alertBox = () => openSheet({
    render: (c) => (
      <div style={{ textAlign: 'center' }}>
        <motion.div initial={{ rotate: -20, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={spring} className="ic" style={{ width: 60, height: 60, borderRadius: 30, margin: '4px auto 12px', background: 'rgba(255,107,107,.15)' }}><Icon n="WifiOff" s={26} c="#FF6B6B" /></motion.div>
        <b style={{ fontSize: 18 }}>Não foi possível conectar</b>
        <p className="t2" style={{ fontSize: 13.5, margin: '8px 0 18px' }}>O {n.split(' ')[0]} não respondeu a tempo. Seus dados continuam seguros e nenhuma permissão foi alterada.</p>
        <Btn onClick={() => { c(); replace('ofSync', { bank }, 'fade') }}>Tentar novamente</Btn><div style={{ height: 8 }} />
        <Btn kind="ghost" onClick={() => { c(); pop() }}>Voltar às instituições</Btn>
        <div className="t3" style={{ fontSize: 12, marginTop: 12 }}>Código OF-408 · Central de ajuda</div>
      </div>
    ),
  })
  return (
    <div className="layer">
      <Header title="Conexão interrompida" sub={n} />
      <div className="scroll withcta" style={{ textAlign: 'center' }}>
        <motion.div animate={{ x: [0, -10, 10, -6, 6, 0] }} transition={{ duration: 0.5, delay: 0.2 }} className="glass" style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', margin: '20px auto 18px' }}><Icon n="CloudAlert" s={36} c="#FF6B6B" /></motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 650 }}>Não conseguimos sincronizar</h2>
        <p className="t2" style={{ fontSize: 13.5, marginTop: 6 }}>O {n} retornou um erro temporário. Tente novamente em alguns segundos.</p>
        <div className="list" style={{ marginTop: 20, textAlign: 'left' }}>
          {[['Autorização confirmada', 'Concluído', 'ok'], ['Contas e saldos', '3 contas encontradas', 'ok'], ['Transações', 'Falha ao importar', 'err'], ['Cartões e investimentos', 'Pendente', 'pend']].map(([t, s, st]) => (
            <div key={t} className="li"><Icon n={st === 'ok' ? 'CircleCheck' : st === 'err' ? 'CircleX' : 'CircleDashed'} s={22} c={st === 'ok' ? '#0EDBB9' : st === 'err' ? '#FF6B6B' : 'rgba(255,255,255,.3)'} /><div className="grow"><div className="ti" style={{ fontSize: 14 }}>{t}</div><div className={`su ${st === 'err' ? 'neg' : ''}`}>{s}</div></div></div>
          ))}
        </div>
      </div>
      <div className="cta">
        <Btn icon="RotateCcw" onClick={() => replace('ofSync', { bank }, 'fade')}>Tentar novamente</Btn>
        <Btn kind="ghost" onClick={alertBox}>Mais detalhes</Btn>
      </div>
    </div>
  )
}

export function OfPronto({ bank = 'itau' }) {
  const { reset, push, replace } = useApp()
  const n = bankName(bank)
  useEffect(() => { const t = setTimeout(() => island({ kind: 'banco', title: `${n} conectado`, sub: 'Open Finance · 2.847 transações' }), 400); return () => clearTimeout(t) }, [])
  return (
    <div className="layer">
      <Confetti n={50} />
      <div className="scroll withcta nohead" style={{ textAlign: 'center', paddingTop: 'calc(var(--safe-top) + 50px)' }}>
        <div style={{ position: 'relative', width: 110, margin: '0 auto' }}>
          <SuccessMark s={100} />
          <motion.div initial={{ scale: 0, x: 0 }} animate={{ scale: 1, x: 0 }} transition={{ delay: 0.6, ...spring }} style={{ position: 'absolute', right: -14, bottom: -6 }}><Logo k={bank} s={40} r={0.5} ring /></motion.div>
        </div>
        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: 26, fontWeight: 650, marginTop: 24 }}>Banco conectado!</motion.h2>
        <p className="t2" style={{ fontSize: 13.5, marginTop: 6 }}>Seus dados do {n} já fazem parte da sua visão consolidada na Rendash.</p>
        <motion.div className="card hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ marginTop: 22, textAlign: 'left' }}>
          <div className="between"><span className="ovl">Importado agora</span><span className="badge">Atualizado</span></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Stat label="Contas" value={<Count to={2} fmt={(v) => Math.round(v)} />} sub="Corrente + poupança" />
            <Stat label="Transações" value={<Count to={2847} fmt={(v) => num(v)} />} sub="12 meses" />
            <Stat label="Saldo" value={<Count to={56.7} fmt={(v) => `R$ ${num(v, 1)} mil`} />} sub="Disponível" />
          </div>
          <div className="row t2" style={{ fontSize: 12, marginTop: 12 }}><Icon n="RefreshCw" s={14} />Sincronização automática a cada 6 h</div>
        </motion.div>
      </div>
      <div className="cta">
        <Btn icon="LayoutGrid" onClick={() => { reset('tabs', {}, 'fade'); setTimeout(() => push('ofContas'), 50) }}>Ver contas consolidadas</Btn>
        <Btn kind="ghost" icon="Plus" onClick={() => replace('ofConectar', {}, 'fade')}>Conectar outro banco</Btn>
      </div>
    </div>
  )
}

export function OfContas() {
  const { push, prefs, toast } = useApp()
  const tot = ACCOUNTS.reduce((a, b) => a + b.saldo, 0)
  const share = [['Rendash', 46, '#0EDBB9'], ['Itaú', 31, '#EC7000'], ['Nubank', 23, '#8A05BE']]
  return (
    <div className="layer">
      <Header title="Minhas contas" sub="4 contas em 3 instituições" right={<CircBtn n="Plus" onClick={() => push('ofConectar')} />} />
      <div className="scroll notab">
        <div className="card hero">
          <span className="ovl">Saldo disponível</span>
          <div style={{ margin: '8px 0 14px' }}><Money v={tot} size={32} hidden={prefs.hidden} /></div>
          <div style={{ display: 'flex', gap: 4, height: 10 }}>
            {share.map(([k, p, c], i) => <motion.div key={k} initial={{ flexGrow: 0.001 }} animate={{ flexGrow: p }} transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 80, damping: 15 }} style={{ borderRadius: 5, background: c, flexBasis: 0 }} />)}
          </div>
          <div className="between t3" style={{ fontSize: 11, marginTop: 8 }}>{share.map(([k, p]) => <span key={k}>{k} {p}%</span>)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
          {[['pix', 'Pix', () => push('pix')], ['Send', 'Transferir', () => push('pixEnviar')], ['ReceiptText', 'Extrato', () => push('extratoUni')], ['RefreshCw', 'Atualizar', () => toast('Saldos atualizados', 'RefreshCw')]].map(([i, l, f]) => (
            <Tap key={l} className="card col" onClick={f} style={{ alignItems: 'center', gap: 6, padding: '12px 2px', fontSize: 11.5, fontWeight: 550 }} scale={0.92}>{i === 'pix' ? <div style={{ width: 20, height: 20 }}><PixGlyph /></div> : <Icon n={i} s={20} />}{l}</Tap>
          ))}
        </div>
        <div className="sec"><h3>Contas e saldos</h3><span className="t3" style={{ fontSize: 12 }}>Ordenar</span></div>
        <div className="list">{ACCOUNTS.map((a) => <Li key={a.id} logo={a.logo} title={a.banco} sub={`${a.tipo} · •• ${a.fim}`} value={prefs.hidden ? '••••' : brl(a.saldo)} vsub={<span className={a.mes < 0 ? 'neg' : 'pos'}>{brl(a.mes, { sign: true, cents: false })} no mês</span>} onClick={() => push('extratoUni', { banco: a.logo })} />)}</div>
        <div className="between t3" style={{ fontSize: 12, margin: '12px 4px' }}><span>Atualizado há 2 min</span><button className="pos" onClick={() => toast('Sincronizando tudo', 'RefreshCw')}>Sincronizar tudo</button></div>
      </div>
    </div>
  )
}

/* ---------------- extrato unificado ---------------- */
export function ExtratoUni({ banco }) {
  const { prefs } = useApp()
  const [f, setF] = useState(banco ? 'Contas' : 'Todos')
  const [q, setQ] = useState('')
  const [srch, setSrch] = useState(false)
  let list = TX
  if (f === 'Pix') list = list.filter((t) => t.logo === 'pix')
  if (f === 'Contas' && banco) list = list.filter((t) => t.banco === banco)
  if (f === 'Entradas') list = list.filter((t) => t.v > 0)
  if (f === 'Saídas') list = list.filter((t) => t.v < 0)
  if (q) list = list.filter((t) => (t.t + t.s).toLowerCase().includes(q.toLowerCase()))
  const groups = list.reduce((acc, t) => { (acc[t.dia] = acc[t.dia] || []).push(t); return acc }, {})
  const ent = list.filter((t) => t.v > 0).reduce((a, b) => a + b.v, 0), sai = list.filter((t) => t.v < 0).reduce((a, b) => a - b.v, 0)
  return (
    <div className="layer">
      <Header title="Extrato unificado" sub={banco ? bankName(banco) : 'Todas as contas'} right={<CircBtn n={srch ? 'X' : 'Search'} onClick={() => { setSrch(!srch); setQ('') }} />} />
      <div className="scroll notab">
        <AnimatePresence>{srch && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}><div className="inp" style={{ height: 46, borderRadius: 23, marginBottom: 12 }}><Icon n="Search" s={18} c="rgba(255,255,255,.5)" /><input autoFocus placeholder="Buscar movimentação" value={q} onChange={(e) => setQ(e.target.value)} /></div></motion.div>}</AnimatePresence>
        <div className="card hero">
          <div className="between"><span className="ovl">Saldo no período</span><span className="chip" style={{ padding: '4px 10px', fontSize: 12 }}><Icon n="CalendarDays" s={13} />Setembro</span></div>
          <div className="num pos" style={{ fontWeight: 700, fontSize: 28, margin: '6px 0 12px' }}>{prefs.hidden ? '••••' : <Flow value={ent - sai} kind="brlSign" />}</div>
          <div style={{ display: 'flex', gap: 8 }}><Stat label="Entradas" value={prefs.hidden ? '••••' : brl(ent, { cents: false })} cls="pos" sub={`${list.filter((t) => t.v > 0).length} itens`} /><Stat label="Saídas" value={prefs.hidden ? '••••' : brl(sai, { cents: false })} sub={`${list.filter((t) => t.v < 0).length} itens`} /></div>
        </div>
        <div style={{ marginTop: 14 }}><Chips items={['Todos', 'Entradas', 'Saídas', 'Pix', 'Contas']} value={f} onChange={setF} /></div>
        <div className="row t3" style={{ fontSize: 12, margin: '10px 4px 0' }}><Icon n="Layers" s={13} />2.847 movimentações · 3 bancos</div>
        {Object.entries(groups).map(([d, ts]) => (
          <motion.div key={d + f} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="sec"><h3 className="t2" style={{ fontSize: 12.5 }}>{d.toUpperCase()}</h3><span className="t3 num" style={{ fontSize: 12 }}>{brl(ts.reduce((a, b) => a + b.v, 0), { sign: true })}</span></div>
            <div className="list">{ts.map((t) => <TxRow key={t.id} t={t} hidden={prefs.hidden} />)}</div>
          </motion.div>
        ))}
        {!list.length && <div className="t2" style={{ textAlign: 'center', padding: 30 }}>Nada encontrado.</div>}
      </div>
    </div>
  )
}

/* ---------------- pix detalhe ---------------- */
export function PixDetalhe({ id = 'pix1' }) {
  const { push, toast, state } = useApp()
  const t = TX.find((x) => x.id === id) || TX[0]
  const recv = t.v > 0
  const who = recv ? 'Marina Costa' : 'Julio Mendes'
  const cat = (state.cls && state.cls[id]) || { contato: `${who} · Cliente`, cat: recv ? 'Receita · Serviços' : 'Transferências' }
  return (
    <div className="layer">
      <Header title="Detalhe do Pix" sub="Comprovante e classificação" right={<CircBtn n="Ellipsis" />} />
      <div className="scroll withcta">
        <div style={{ textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring} style={{ display: 'inline-block', position: 'relative' }}>
            {recv ? <Avatar ini="MC" s={68} /> : <Avatar src="img/julio.jpg" s={68} />}
            <div style={{ position: 'absolute', right: -4, bottom: -4 }}><Logo k="pix" s={26} r={0.5} /></div>
          </motion.div>
          <div className="ovl" style={{ marginTop: 12 }}>{recv ? 'Pix recebido' : 'Pix enviado'}</div>
          <div className={`num ${recv ? 'pos' : ''}`} style={{ fontSize: 34, fontWeight: 700, marginTop: 2 }}><Count to={Math.abs(t.v)} fmt={(v) => brl(v)} /></div>
          <div className="t2" style={{ fontSize: 13.5 }}>{recv ? 'de' : 'para'} {who}</div>
        </div>
        <div className="list" style={{ marginTop: 20 }}>
          {[['Data e hora', '30 set 2026 · 14:32'], ['Instituição', recv ? 'Banco do Brasil' : 'Rendash'], ['Destino', 'Rendash •• 2891'], ['ID da transação', 'E00000000202609301432A9F']].map(([k, v]) => <div key={k} className="li" style={{ padding: '12px 14px' }}><span className="t2 grow" style={{ fontSize: 13 }}>{k}</span><b className="num ell" style={{ fontSize: 13, maxWidth: 190 }}>{v}</b></div>)}
          <div className="li" style={{ padding: '12px 14px', display: 'block' }}><div className="t3" style={{ fontSize: 11 }}>DESCRIÇÃO</div><div style={{ fontSize: 13.5, marginTop: 3 }}>Projeto identidade visual · parcela 2/2</div></div>
        </div>
        <div className="sec"><h3>Classificação</h3><button onClick={() => push('classificar', { t, id })}>Editar</button></div>
        <div className="list">
          <Li icon="UserRound" title={cat.contato} sub="Contato / pessoa" onClick={() => push('classificar', { t, id })} />
          <Li icon="Tag" title={cat.cat} sub="Categoria" onClick={() => push('classificar', { t, id })} />
        </div>
      </div>
      <div className="cta" style={{ flexDirection: 'row' }}>
        {[['Share', 'Compartilhar'], ['Copy', 'Copiar ID'], ['MessageCircle', 'Mensagem']].map(([i, l]) => (
          <Tap key={l} className="card col glass" style={{ flex: 1, alignItems: 'center', gap: 5, padding: '10px 0', fontSize: 11.5, fontWeight: 550, borderRadius: 18 }} onClick={() => { if (l === 'Copiar ID') { try { navigator.clipboard.writeText('E00000000202609301432A9F') } catch (e) {} } toast(l === 'Copiar ID' ? 'ID copiado' : l === 'Compartilhar' ? 'Comprovante pronto para enviar' : 'Mensagem enviada', l === 'Copiar ID' ? 'Copy' : 'CircleCheck') }} scale={0.92}><Icon n={i} s={19} />{l}</Tap>
        ))}
      </div>
    </div>
  )
}

const ALLCATS = [['Serviços', 'Receitas profissionais', 'brief'], ['Produtos e mercadorias', 'Vendas', 'cart'], ['Entre suas contas', 'Transferências próprias', 'ArrowLeftRight'], ['Renda', 'Salário e pró-labore', 'work'], ['Investimentos', 'Proventos e rendimentos', 'up'], ['Reembolso', 'Valores devolvidos', 'RotateCcw'], ['Outros', 'Sem categoria', 'dots']]
export function Classificar({ t, id }) {
  const { pop, openSheet, toast, setState } = useApp()
  const [cat, setCat] = useState(t && t.cat === 'Serviços' ? 'Serviços' : (t && t.cat) || 'Serviços')
  const [auto, setAuto] = useState(true)
  const pick = () => openSheet({ light: true, render: (c) => <CatSheet close={c} value={cat} onPick={setCat} /> })
  return (
    <div className="layer">
      <Header title="Editar classificação" sub={t ? `${t.t.split('·')[0].trim()} · ${brl(Math.abs(t.v))}` : ''} />
      <div className="scroll withcta">
        <div className="ovl" style={{ margin: '0 4px 8px' }}>Contato ou pessoa</div>
        <div className="list"><Li avatar={<Avatar ini="MC" s={40} />} title="Marina Costa" sub="Cliente · CPF ••• 312.780-••" right={<Icon n="Pencil" s={16} c="rgba(255,255,255,.5)" />} chevron={false} onClick={() => {}} /></div>
        <div className="ovl" style={{ margin: '18px 4px 8px' }}>Categoria da receita</div>
        <div className="list"><Li icon={(ALLCATS.find((c) => c[0] === cat) || ALLCATS[0])[2]} title={cat} sub={(ALLCATS.find((c) => c[0] === cat) || ALLCATS[0])[1]} right={<Icon n="ChevronDown" s={18} />} chevron={false} onClick={pick} /></div>
        <div className="card row" style={{ marginTop: 14 }}>
          <Icon n="WandSparkles" s={20} c="#0EDBB9" />
          <div className="grow" style={{ fontSize: 13 }}>Aplicar “{cat}” automaticamente aos próximos Pix de Marina Costa</div>
          <Toggle on={auto} onChange={setAuto} />
        </div>
      </div>
      <div className="cta"><Btn onClick={() => { setState((s) => ({ ...s, cls: { ...(s.cls || {}), [id || 'x']: { contato: 'Marina Costa · Cliente', cat: `Receita · ${cat}` } } })); toast(auto ? 'Classificação salva · regra criada' : 'Classificação salva'); pop() }}>Salvar classificação</Btn></div>
    </div>
  )
}
function CatSheet({ close, value, onPick }) {
  const [q, setQ] = useState('')
  const [v, setV] = useState(value)
  const list = ALLCATS.filter((c) => c[0].toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <div className="between" style={{ marginBottom: 12 }}><b style={{ fontSize: 18 }}>Escolher categoria</b><button style={{ color: '#0A84FF', fontWeight: 600 }} onClick={() => { onPick(v); close() }}>Concluir</button></div>
      <div className="row" style={{ background: 'rgba(0,0,0,.06)', borderRadius: 12, height: 40, padding: '0 12px', marginBottom: 12 }}><Icon n="Search" s={16} c="rgba(0,0,0,.4)" /><input placeholder="Buscar categoria" value={q} onChange={(e) => setQ(e.target.value)} style={{ color: '#111', flex: 1 }} /></div>
      {list.map(([n, s, i]) => (
        <motion.button key={n} onClick={() => setV(n)} animate={{ background: v === n ? 'rgba(14,219,185,.14)' : 'rgba(0,0,0,0)' }} className="row" style={{ width: '100%', padding: '11px 10px', borderRadius: 14, textAlign: 'left' }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(0,0,0,.06)', display: 'grid', placeItems: 'center' }}><Icon n={i} s={18} c="#333" /></div>
          <div className="grow"><div style={{ fontWeight: 600, fontSize: 14.5 }}>{n}</div><div className="t2" style={{ fontSize: 12 }}>{s}</div></div>
          {v === n && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon n="CircleCheck" s={20} c="#0BAF95" /></motion.span>}
        </motion.button>
      ))}
    </div>
  )
}

/* ---------------- categorias ---------------- */
export function Categorias() {
  const { push, toast } = useApp()
  const [m, setM] = useState('Gastos')
  const data = m === 'Gastos' ? CATS : CATS_REC
  const tot = data.reduce((a, b) => a + b.v, 0)
  return (
    <div className="layer">
      <Header title="Categorias" sub="Regras e orçamento" right={<CircBtn n="Plus" onClick={() => toast('Nova categoria criada')} />} />
      <div className="scroll notab">
        <div className="card hero">
          <div className="between"><span className="ovl">{m} em setembro</span><span className="t3" style={{ fontSize: 12 }}>vs agosto</span></div>
          <div className="num" style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 4px' }}><Flow value={tot} /></div>
          <span className={`badge ${m === 'Gastos' ? 'neg' : ''}`}>{m === 'Gastos' ? '+6,2% vs ago' : '+11,4% vs ago'}</span>
          <div style={{ display: 'flex', gap: 3, height: 10, marginTop: 14 }}>
            {data.map((c, i) => <motion.div key={m + c.k} initial={{ flexGrow: 0.001 }} animate={{ flexGrow: c.p }} transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 90, damping: 16 }} style={{ flexBasis: 0, borderRadius: 4, background: c.cor }} />)}
          </div>
        </div>
        <div style={{ marginTop: 14 }}><Seg items={['Gastos', 'Receitas']} value={m} onChange={setM} /></div>
        <div className="list" style={{ marginTop: 14 }}>
          {data.map((c, i) => (
            <Tap key={m + c.k} as="div" className="li" scale={0.985} onClick={() => push('extratoUni')} style={{ cursor: 'pointer', display: 'block' }}>
              <div className="row">
                <div className="ic" style={{ color: c.cor }}><Icon n={c.ic} s={19} /></div>
                <div className="grow"><div className="ti">{c.k}</div><div className="su">{c.p}% {m === 'Gastos' ? 'dos gastos' : 'das receitas'}</div></div>
                <b className="num" style={{ fontSize: 14.5 }}>{brl(c.v, { cents: false })}</b>
              </div>
              <div style={{ marginLeft: 52, marginTop: 8 }}><ProgressBar p={c.p * 2.4} color={c.cor} h={5} delay={0.2 + i * 0.06} /></div>
            </Tap>
          ))}
        </div>
        <div className="card row" style={{ marginTop: 14 }}><Icon n="WandSparkles" s={20} c="#0EDBB9" /><div className="grow"><b style={{ fontSize: 14 }}>18 regras automáticas</b><div className="t2" style={{ fontSize: 12 }}>94% das transações classificadas</div></div><button className="pos" style={{ fontSize: 13, fontWeight: 600 }}>Gerenciar</button></div>
      </div>
    </div>
  )
}

/* ---------------- pix ---------------- */
export function Pix() {
  const { push, toast } = useApp()
  return (
    <div className="layer">
      <Header title="Área Pix" sub="Envie e receba na hora" right={<CircBtn n="QrCode" onClick={() => push('pixCobrar')} />} />
      <div className="scroll notab">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[['Send', 'Pagar ou transferir', () => push('pixEnviar')], ['QrCode', 'Cobrar com QR', () => push('pixCobrar')], ['ScanLine', 'Ler QR Code', () => toast('Câmera aberta', 'ScanLine')], ['Copy', 'Pix copia e cola', () => push('pixEnviar')], ['KeyRound', 'Minhas chaves', () => push('pixChaves')], ['CalendarClock', 'Agendados', () => toast('Nenhum Pix agendado', 'CalendarClock')]].map(([i, l, f], k) => (
            <Tap key={l} className="card col" onClick={f} style={{ alignItems: 'center', gap: 8, padding: '16px 6px', fontSize: 12, fontWeight: 550, textAlign: 'center' }} scale={0.93}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring, delay: k * 0.04 }}><Icon n={i} s={22} c="#0EDBB9" /></motion.div>{l}
            </Tap>
          ))}
        </div>
        <div className="sec"><h3>Contatos recentes</h3></div>
        <div className="chips" style={{ gap: 14 }}>
          {CONTACTS.map((c) => (
            <Tap key={c.n} className="col" onClick={() => push('pixValor', { to: c })} style={{ alignItems: 'center', gap: 6, width: 66, flex: 'none', fontSize: 11.5 }} scale={0.9}>
              {c.foto ? <Avatar src={c.foto} s={54} /> : <Avatar ini={c.ini} s={54} />}<span className="ell" style={{ maxWidth: 66 }}>{c.n.split(' ')[0]}</span>
            </Tap>
          ))}
        </div>
        <div className="sec"><h3>Últimos Pix</h3></div>
        <div className="list">{TX.filter((t) => t.logo === 'pix').map((t) => <TxRow key={t.id} t={t} />)}</div>
        <Note icon="ShieldCheck">Pix acima de R$ 1.000 pede Face ID. Limite noturno: R$ 1.000.</Note>
      </div>
    </div>
  )
}
export function PixChaves() {
  const { toast } = useApp()
  return (
    <div className="layer">
      <Header title="Minhas chaves" sub="3 de 5 chaves cadastradas" />
      <div className="scroll notab">
        <div className="list">
          {[['Mail', 'E-mail', USER.email], ['Smartphone', 'Celular', '(87) 9 ••••-4821'], ['Shuffle', 'Chave aleatória', '7b2e…9f41']].map(([i, k, v]) => <Li key={k} icon={i} title={k} sub={v} chevron={false} right={<button onClick={() => toast('Chave copiada', 'Copy')}><Icon n="Copy" s={18} c="#0EDBB9" /></button>} />)}
        </div>
        <Btn kind="ghost" icon="Plus" className="sm" style={{ marginTop: 14 }} onClick={() => toast('Chave CPF cadastrada')}>Cadastrar nova chave</Btn>
      </div>
    </div>
  )
}
export function PixCobrar() {
  const { toast } = useApp()
  const [cents, setCents] = useState(0)
  const cells = useMemo(() => Array.from({ length: 25 * 25 }, (_, i) => { const x = i % 25, y = Math.floor(i / 25); const f = (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17); if (f) return (x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && ((y > 1 && y < 5) || (y > 19 && y < 23)))) || (x > 19 && x < 23 && y > 1 && y < 5) || (x === 18 || x === 24) && y < 7 || (y === 18 || y === 24) && x < 7; return ((x * 7 + y * 13 + x * y) % 5) < 2 }), [])
  return (
    <div className="layer">
      <Header title="Cobrar com QR" sub="Receba via Pix" />
      <div className="scroll notab">
        <MoneyInput cents={cents} setCents={setCents} />
        <motion.div className="card" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }} style={{ background: '#fff', margin: '16px auto 0', width: 230, padding: 14, borderRadius: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(25,1fr)', aspectRatio: 1 }}>
            {cells.map((on, i) => <i key={i} style={{ background: on ? '#0A0E1B' : '#fff' }} />)}
          </div>
        </motion.div>
        <div className="t2" style={{ textAlign: 'center', fontSize: 13, marginTop: 12 }}>{cents ? `Cobrança de ${brl(cents / 100)}` : 'Qualquer valor'} · Guilherme Matias</div>
        <Btn icon="Share" style={{ marginTop: 18 }} onClick={() => toast('Link de cobrança copiado', 'Copy')}>Compartilhar cobrança</Btn>
      </div>
    </div>
  )
}
export function PixEnviar() {
  const { push } = useApp()
  const [k, setK] = useState('')
  return (
    <div className="layer">
      <Header title="Pagar ou transferir" sub="Pix" />
      <div className="scroll notab">
        <div className="field"><span className="lb">Chave Pix ou copia e cola</span><div className="inp"><Icon n="KeyRound" s={18} c="rgba(255,255,255,.5)" /><input placeholder="CPF, celular, e-mail ou chave" value={k} onChange={(e) => setK(e.target.value)} /></div></div>
        <Btn disabled={k.length < 5} icon="ArrowRight" onClick={() => push('pixValor', { to: { n: 'Ana Beatriz', k, banco: 'Nubank', ini: 'AB' } })}>Continuar</Btn>
        <div className="sec"><h3>Contatos</h3></div>
        <div className="list">{CONTACTS.map((c) => <Li key={c.n} avatar={c.foto ? <Avatar src={c.foto} s={40} ring={false} /> : <Avatar ini={c.ini} s={40} />} title={c.n} sub={`${c.k} · ${c.banco}`} onClick={() => push('pixValor', { to: c })} />)}</div>
      </div>
    </div>
  )
}
export function PixValor({ to }) {
  const { push, openSheet, state, setState } = useApp()
  const [cents, setCents] = useState(0)
  const [msg, setMsg] = useState('')
  const [ask, faceEl] = useFaceID()
  const v = cents / 100
  const ok = v > 0 && v <= state.saldo
  const send = () => { setState((s) => ({ ...s, saldo: s.saldo - v })); push('sucesso', { kind: 'pix', valor: v, to: to.n, logo: 'pix' }, 'fade') }
  return (
    <div className="layer">
      <Header title="Quanto enviar?" sub={`Para ${to.n}`} />
      <div className="scroll withcta">
        <div className="card row">{to.foto ? <Avatar src={to.foto} s={46} /> : <Avatar ini={to.ini} s={46} />}<div className="grow"><b>{to.n}</b><div className="t2" style={{ fontSize: 12.5 }}>{to.k} · {to.banco}</div></div></div>
        <div style={{ marginTop: 16 }}><MoneyInput cents={cents} setCents={setCents} err={v > state.saldo} /></div>
        <div className="help" style={{ margin: '8px 4px 14px' }}>Saldo disponível: {brl(state.saldo)}</div>
        <Chips items={['R$ 20', 'R$ 50', 'R$ 100', 'R$ 500']} value={null} onChange={(c) => setCents(Number(c.replace(/\D/g, '')) * 100)} />
        <div className="field" style={{ marginTop: 16 }}><span className="lb">Mensagem (opcional)</span><div className="inp"><Icon n="MessageSquare" s={18} c="rgba(255,255,255,.5)" /><input placeholder="Ex.: Almoço de sexta" value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={60} /></div></div>
      </div>
      <div className="cta"><Btn icon="Send" disabled={!ok} onClick={() => openSheet({ render: (c) => (
        <div>
          <div style={{ textAlign: 'center' }}>{to.foto ? <Avatar src={to.foto} s={56} /> : <Avatar ini={to.ini} s={56} />}<div className="t2" style={{ marginTop: 10, fontSize: 13 }}>Enviar Pix para {to.n}</div><div className="num" style={{ fontSize: 32, fontWeight: 700, margin: '4px 0 16px' }}>{brl(v)}</div></div>
          <div className="list" style={{ marginBottom: 16 }}>{[['Instituição', to.banco], ['Chave', to.k], ['Quando', 'Agora'], ['Mensagem', msg || '—']].map(([k, x]) => <div key={k} className="li" style={{ padding: '11px 14px' }}><span className="t2 grow" style={{ fontSize: 13 }}>{k}</span><b className="ell" style={{ fontSize: 13.5, maxWidth: 180 }}>{x}</b></div>)}</div>
          <Btn icon="Check" onClick={() => { c(); v > 1000 ? ask(send) : send() }}>Confirmar Pix</Btn>
        </div>) })}>Revisar Pix</Btn></div>
      {faceEl}
    </div>
  )
}
