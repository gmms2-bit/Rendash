import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion'
import { useApp } from '../store'
import { Li, Btn, Tap, Icon, Header, Wordmark, Avatar, Logo, FaceID, Confetti, SuccessMark, Spinner, Toggle, Note, spring, Money, Count, LineChart } from '../ui'
import { LOGIN, USER, TEAM, FIGMA_URL, GITHUB_URL } from '../data'
import { CardVisual } from './card'
import { maskCPF, maskPhone, vibrate } from '../format'
import { sfx } from '../sound'

/* ---------------- splash (continua o ícone) ---------------- */
export function Splash({ next = 'intro', from }) {
  const { reset, W, H } = useApp()
  const [out, setOut] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setOut(true), 2350)
    const b = setTimeout(() => reset(next, {}, 'fade'), 2650)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  const w = W.current || 393, h = H.current || 852, S = 96
  // o logo sai exatamente de onde estava o ícone e vai para o centro
  const init = from ? { x: from.x - w / 2, y: from.y - h / 2 + 91, scale: from.w / S, borderRadius: 14 * (S / from.w) } : { x: 0, y: 34, scale: 0.7, opacity: 0 }
  const letters = 'Rendash'.split('')
  return (
    <div className="layer" style={{ display: 'grid', placeItems: 'center', background: '#0A0E1B', overflow: 'hidden' }}>
      <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: out ? 0 : 1, scale: out ? 1.6 : 1 }} transition={{ duration: out ? 0.35 : 1.2, ease: [0.16, 1, 0.3, 1], delay: out ? 0 : 0.15 }}
        style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,219,185,.22), rgba(120,90,255,.10) 45%, transparent 70%)', left: '50%', top: '50%', marginLeft: -260, marginTop: -290 }} />
      <motion.div animate={out ? { scale: 1.12, opacity: 0, filter: 'blur(10px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.32, ease: [0.4, 0, 1, 1] }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -40 }}>
        <motion.div initial={init} animate={{ x: 0, y: 0, scale: 1, opacity: 1, borderRadius: 24 }}
          transition={{ type: 'spring', stiffness: 170, damping: 22, mass: 0.9 }}
          style={{ width: S, height: S, overflow: 'hidden', boxShadow: '0 20px 60px rgba(14,219,185,.25), inset 0 0 0 1px rgba(255,255,255,.08)' }}>
          <img src="img/appicon.png" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
          <motion.i initial={{ x: '-120%' }} animate={{ x: '120%' }} transition={{ delay: 0.75, duration: 0.9, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,.35) 50%, transparent 65%)' }} />
        </motion.div>
        <div style={{ marginTop: 26, height: 46, position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 14, filter: 'blur(8px)', letterSpacing: '.18em' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0em' }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <Wordmark h={44} />
          </motion.div>
        </div>
        <div className="ovl" style={{ marginTop: 16, letterSpacing: '.24em', display: 'flex' }}>
          {'SEU PATRIMÔNIO, EM MOVIMENTO'.split('').map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 + i * 0.018, duration: 0.3 }} style={{ whiteSpace: 'pre' }}>{c}</motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ---------------- intro ---------------- */
const glassCard = { background: 'linear-gradient(160deg, rgba(36,40,66,.92), rgba(18,20,36,.92))', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 30px 60px -20px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)', borderRadius: 24 }
const Float = ({ children, d = 0, amp = 6, dur = 4, style }) => (
  <motion.div animate={{ y: [0, -amp, 0] }} transition={{ repeat: Infinity, duration: dur, delay: d, ease: 'easeInOut' }} style={style}>{children}</motion.div>
)
const SERIE = [62, 64, 63, 67, 66, 70, 69, 73, 72, 76, 79, 78, 83, 86, 85, 90, 94, 97, 101, 104]
function IlloPatrimonio() {
  return (
    <div style={{ position: 'relative', width: 330, height: 300 }}>
      <motion.div initial={{ opacity: 0, y: 30, rotateX: 25 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        style={{ ...glassCard, position: 'absolute', left: 14, right: 14, top: 40, padding: 18, transformPerspective: 800 }}>
        <div className="between"><span className="ovl" style={{ fontSize: 10 }}>Patrimônio total</span><span className="badge">+7,19%</span></div>
        <div style={{ margin: '8px 0 4px' }}><Money v={124850.32} size={30} delay={0.35} duration={1.8} /></div>
        <LineChart data={SERIE} h={92} interactive={false} delay={0.5} />
      </motion.div>
      <Float d={0.2} style={{ position: 'absolute', left: -2, top: 0 }}>
        <motion.div initial={{ opacity: 0, scale: 0.6, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.9 }}
          className="glass row" style={{ gap: 8, padding: '8px 12px 8px 8px', borderRadius: 16 }}>
          <Logo k="petrobras" s={28} r={0.3} /><div><div style={{ fontSize: 12, fontWeight: 650 }}>PETR4</div><div className="num pos" style={{ fontSize: 11 }}>+2,41%</div></div>
        </motion.div>
      </Float>
      <Float d={0.8} dur={5} style={{ position: 'absolute', right: -4, top: 6 }}>
        <motion.div initial={{ opacity: 0, scale: 0.6, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.1 }}
          className="glass row" style={{ gap: 8, padding: '8px 12px 8px 8px', borderRadius: 16 }}>
          <Logo k="bitcoin" s={28} r={0.5} /><div><div style={{ fontSize: 12, fontWeight: 650 }}>Bitcoin</div><div className="num pos" style={{ fontSize: 11 }}>+18,2%</div></div>
        </motion.div>
      </Float>
      <Float d={0.4} dur={4.6} style={{ position: 'absolute', right: 26, bottom: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 1.35 }}
          className="glass row" style={{ gap: 8, padding: '9px 13px', borderRadius: 16, background: 'rgba(14,219,185,.16)', borderColor: 'rgba(14,219,185,.35)' }}>
          <Icon n="TrendingUp" s={16} c="#0EDBB9" /><span className="num" style={{ fontSize: 13, fontWeight: 650 }}>112% do CDI</span>
        </motion.div>
      </Float>
    </div>
  )
}
function IlloBancos() {
  const ks = [['nubank', -122, -40], ['itau', 122, -40], ['bb', -112, 62], ['inter', 112, 62], ['santander', -56, -122], ['bradesco', 56, -122]]
  return (
    <div style={{ position: 'relative', width: 330, height: 300, display: 'grid', placeItems: 'center' }}>
      <svg width="330" height="300" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {ks.map(([k, x, y], i) => (
          <g key={k}>
            <motion.line x1={165} y1={150} x2={165 + x} y2={150 + y} stroke="rgba(255,255,255,.12)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }} />
            <motion.circle r="3" fill="#0EDBB9" initial={{ cx: 165 + x, cy: 150 + y, opacity: 0 }} animate={{ cx: [165 + x, 165], cy: [150 + y, 150], opacity: [0, 1, 0] }} transition={{ delay: 1 + i * 0.25, duration: 1.2, repeat: Infinity, repeatDelay: 1.3, ease: 'easeIn' }} />
          </g>
        ))}
      </svg>
      {ks.map(([k, x, y], i) => (
        <motion.div key={k} initial={{ x: 0, y: 0, scale: 0, opacity: 0 }} animate={{ x, y, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.15 + i * 0.08 }} style={{ position: 'absolute' }}>
          <Float d={i * 0.3} amp={4} dur={3.5 + (i % 3)}><Logo k={k} s={46} r={0.5} ring /></Float>
        </motion.div>
      ))}
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.15, 0.6] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,219,185,.4), transparent 70%)' }} />
      <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}><Logo k="rendash" s={82} r={0.26} /></motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 1.2 }}
        style={{ ...glassCard, position: 'absolute', bottom: -6, padding: '10px 16px', borderRadius: 18, textAlign: 'center' }}>
        <div className="ovl" style={{ fontSize: 9.5 }}>Saldo consolidado</div>
        <Count to={186420.9} delay={1.3} duration={1.6} style={{ fontSize: 19, fontWeight: 700 }} />
      </motion.div>
    </div>
  )
}
function IlloCartao() {
  return (
    <div style={{ position: 'relative', width: 330, height: 300, display: 'grid', placeItems: 'center' }}>
      <motion.div initial={{ rotateY: -70, rotateX: 20, y: 40, opacity: 0 }} animate={{ rotateY: [-70, 8, -6, 0], rotateX: [20, -4, 2, 0], y: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 290, transformPerspective: 900 }}>
        <Float amp={5} dur={5}><CardVisual small /></Float>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        className="glass row" style={{ position: 'absolute', top: 0, left: 8, right: 8, gap: 10, padding: '10px 12px', borderRadius: 18, background: 'rgba(30,32,52,.75)' }}>
        <Logo k="pix" s={32} r={0.3} />
        <div className="grow" style={{ minWidth: 0 }}><div className="between"><b style={{ fontSize: 13 }}>Pix recebido</b><span style={{ fontSize: 11, opacity: 0.6 }}>agora</span></div><div style={{ fontSize: 12.5, opacity: 0.85 }}>Marina Costa · <span className="num pos" style={{ fontWeight: 650 }}>+ R$ 3.200,00</span></div></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 1.5 }}
        className="glass row" style={{ position: 'absolute', bottom: 2, left: 24, gap: 7, padding: '8px 12px', borderRadius: 14, fontSize: 12.5, fontWeight: 600 }}>
        <Icon n="ScanFace" s={16} c="#0EDBB9" />Face ID
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 1.7 }}
        className="glass row" style={{ position: 'absolute', bottom: 2, right: 24, gap: 7, padding: '8px 12px', borderRadius: 14, fontSize: 12.5, fontWeight: 600 }}>
        <Icon n="LockKeyhole" s={16} c="#0EDBB9" />Cartão virtual
      </motion.div>
    </div>
  )
}
const SLIDES = [
  { I: IlloPatrimonio, glow: 'rgba(14,219,185,.20)', t: 'Seu patrimônio,\nem movimento.', d: 'Veja tudo o que você tem crescer em tempo real, com rentabilidade clara e sem planilha.' },
  { I: IlloBancos, glow: 'rgba(120,90,255,.24)', t: 'Todos os seus bancos\nem uma só tela.', d: 'Conecte Nubank, Itaú, BB e outros pelo Open Finance oficial do Banco Central.' },
  { I: IlloCartao, glow: 'rgba(90,169,255,.22)', t: 'Pix, cartão e segurança\nde banco de verdade.', d: 'Pague, receba e controle seu cartão com Face ID em cada movimentação.' },
]
const DUR = 5.5
export function Intro() {
  const { push, W } = useApp()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const x = useMotionValue(0)
  useEffect(() => { animate(x, -i * W.current, { type: 'spring', stiffness: 260, damping: 32 }) }, [i])
  useEffect(() => { if (paused) return; const t = setTimeout(() => setI((v) => (v + 1) % 3), DUR * 1000); return () => clearTimeout(t) }, [i, paused])
  const go = (n) => { setI(n); vibrate(6) }
  return (
    <div className="layer" style={{ overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0, background: `radial-gradient(70% 45% at 50% 32%, ${SLIDES[i].glow}, transparent 70%)`, pointerEvents: 'none' }} />
      </AnimatePresence>
      <div className="header" style={{ justifyContent: 'space-between', zIndex: 3 }}>
        <Wordmark h={24} />
        <Tap className="chip" onClick={() => push('login')}>Pular</Tap>
      </div>
      <div style={{ position: 'absolute', top: 'calc(var(--safe-top) + 64px)', left: 20, right: 20, display: 'flex', gap: 6, zIndex: 3 }}>
        {SLIDES.map((_, k) => (
          <button key={k} onClick={() => go(k)} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.18)', overflow: 'hidden', padding: 0 }}>
            <motion.i key={k + '-' + i} initial={{ width: k < i ? '100%' : '0%' }} animate={{ width: k < i ? '100%' : k === i ? '100%' : '0%' }} transition={{ duration: k === i && !paused ? DUR : 0, ease: 'linear' }}
              style={{ display: 'block', height: '100%', background: '#fff' }} />
          </button>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 'calc(var(--safe-top) + 84px)', left: 0, right: 0, bottom: 'calc(var(--safe-bot) + 150px)', overflow: 'hidden' }}
        onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} onPointerCancel={() => setPaused(false)}>
        <motion.div drag="x" style={{ x, display: 'flex', height: '100%', width: `${SLIDES.length * 100}%`, touchAction: 'pan-y' }}
          dragConstraints={{ left: -(SLIDES.length - 1) * W.current, right: 0 }} dragElastic={0.12}
          onDragEnd={(e, info) => { const d = info.offset.x < -50 || info.velocity.x < -400 ? 1 : info.offset.x > 50 || info.velocity.x > 400 ? -1 : 0; const n = Math.max(0, Math.min(2, i + d)); if (n === i) animate(x, -i * W.current, spring); else go(n) }}>
          {SLIDES.map((s, k) => (
            <div key={k} style={{ width: `${100 / SLIDES.length}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 26px' }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', width: '100%' }}>{k === i ? <s.I key={'i' + i} /> : <div style={{ width: 330, height: 300 }} />}</div>
              <div style={{ textAlign: 'center', minHeight: 132 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.15 }}>
                  {s.t.split('\n').map((ln, li) => (
                    <span key={li} style={{ display: 'block', overflow: 'hidden' }}>
                      <motion.span key={'t' + i} style={{ display: 'block' }} initial={{ y: '100%', opacity: 0 }} animate={k === i ? { y: '0%', opacity: 1 } : {}} transition={{ delay: 0.15 + li * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>{ln}</motion.span>
                    </span>
                  ))}
                </h2>
                <motion.p key={'d' + i} initial={{ opacity: 0, y: 10 }} animate={k === i ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.5 }} className="t2" style={{ fontSize: 14.5, marginTop: 12, lineHeight: 1.45 }}>{s.d}</motion.p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="cta" style={{ background: 'none' }}>
        <Btn icon="ArrowRight" onClick={() => (i < 2 ? go(i + 1) : push('cadastro'))}>{i < 2 ? 'Continuar' : 'Criar minha conta'}</Btn>
        <Btn kind="ghost" onClick={() => push('login')}>Já tenho conta</Btn>
      </div>
    </div>
  )
}

/* ---------------- login ---------------- */
export function Field({ label, help, err, children, right, icon }) {
  return (
    <label className="field">
      {label && <span className="lb">{label}</span>}
      <motion.div className={`inp ${err ? 'err' : ''}`} animate={err ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
        {icon && <Icon n={icon} s={18} c="rgba(255,255,255,.5)" />}{children}{right}
      </motion.div>
      <AnimatePresence>{(err || help) && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`help ${err ? 'err' : ''}`}>{err || help}</motion.div>}</AnimatePresence>
    </label>
  )
}
export function Login() {
  const { push, reset } = useApp()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tries, setTries] = useState(0)
  const submit = (e) => {
    e && e.preventDefault()
    if (!email || !senha) { setErr('Preencha e-mail e senha.'); setTries((t) => t + 1); return }
    setLoading(true); setErr(null)
    setTimeout(() => {
      setLoading(false)
      if (email.trim().toLowerCase() === LOGIN.email && senha === LOGIN.senha) { vibrate([10, 40, 10]); reset('tabs', { welcome: true }, 'fade') }
      else { vibrate(60); setErr('E-mail ou senha incorretos. Tente de novo.'); setTries((t) => t + 1) }
    }, 1100)
  }
  return (
    <div className="layer">
      <div className="header"><CircBack /></div>
      <form className="scroll notab" onSubmit={submit} style={{ paddingTop: 'calc(var(--safe-top) + 64px)' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 34px' }}><Wordmark h={40} /></motion.div>
        <h2 style={{ fontSize: 26, fontWeight: 650, letterSpacing: '-.03em' }}>Bem-vindo de volta</h2>
        <p className="t2" style={{ fontSize: 14, margin: '6px 0 26px' }}>Entre para acompanhar seus investimentos.</p>
        <Field label="E-mail" icon="Mail" err={err && !email ? ' ' : null}>
          <input key={'e' + tries} type="email" inputMode="email" autoComplete="username" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr(null) }} />
          {email && <button type="button" onClick={() => setEmail('')}><Icon n="CircleX" s={18} c="rgba(255,255,255,.4)" /></button>}
        </Field>
        <Field label="Senha" icon="LockKeyhole" err={err} right={<button type="button" onClick={() => setShow((s) => !s)}><Icon n={show ? 'EyeOff' : 'Eye'} s={19} c="rgba(255,255,255,.6)" /></button>}>
          <input type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" value={senha} onChange={(e) => { setSenha(e.target.value); setErr(null) }} />
        </Field>
        <div className="between" style={{ margin: '-2px 2px 22px' }}>
          <Tap type="button" className="chip" style={{ fontSize: 12 }} onClick={() => { setEmail(LOGIN.email); setSenha(LOGIN.senha); setErr(null) }}><Icon n="Sparkles" s={13} c="#0EDBB9" />Preencher demo</Tap>
          <button type="button" onClick={() => push('recuperar')} style={{ fontSize: 13.5, color: 'var(--teal)', fontWeight: 550 }}>Esqueceu a senha?</button>
        </div>
        <button type="submit" hidden />
        <Btn loading={loading} onClick={submit}>Entrar</Btn>
        <div style={{ height: 10 }} />
        <Btn kind="ghost" onClick={() => push('cadastro')}>Criar minha conta</Btn>
        <div style={{ height: 10 }} />
        <Btn kind="ghost" icon="ScanFace" onClick={() => push('biometria')} className="sm" style={{ background: 'none', border: 0, boxShadow: 'none' }}>Entrar com Face ID</Btn>
        <p className="t3" style={{ fontSize: 11.5, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          Demo: <b className="t2">{LOGIN.email}</b> · senha <b className="t2">{LOGIN.senha}</b><br />Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
        </p>
        <Tap type="button" className="chip" style={{ margin: '16px auto 0', display: 'flex', width: 'fit-content' }} onClick={() => push('sobre')}>
          <Avatar src={TEAM[0].foto} s={18} ring={false} /><Avatar src={TEAM[1].foto} s={18} ring={false} />Feito por Guilherme e Julio
        </Tap>
      </form>
    </div>
  )
}
function CircBack() {
  const { pop, stack } = useApp()
  if (stack.length <= 1) return null
  return <Tap className="circ glass" onClick={pop} aria-label="Voltar"><Icon n="ChevronLeft" s={18} /></Tap>
}

/* ---------------- face id overlay ---------------- */
export function FaceSheet({ onDone, onFail, label = 'Confirme com Face ID' }) {
  const [st, setSt] = useState('scan')
  useEffect(() => {
    const a = setTimeout(() => { setSt('ok'); try { navigator.vibrate && navigator.vibrate([10, 30, 10]) } catch (e) {} sfx('faceid') }, 1300)
    const b = setTimeout(() => onDone && onDone(), 1950)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, zIndex: 85, background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center' }}>
      <motion.div className="glass" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={spring}
        style={{ width: 168, height: 168, borderRadius: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'rgba(30,30,40,.75)' }}>
        <FaceID state={st} s={74} />
        <div style={{ fontSize: 13, fontWeight: 600 }}>{st === 'ok' ? 'Pronto' : 'Face ID'}</div>
      </motion.div>
    </motion.div>
  )
}
export function useFaceID() {
  const [on, setOn] = useState(null)
  const el = <AnimatePresence>{on && <FaceSheet key="f" onDone={() => { const f = on; setOn(null); f() }} />}</AnimatePresence>
  return [(cb) => setOn(() => cb), el]
}

/* ---------------- biometria ---------------- */
export function Biometria() {
  const { push, reset } = useApp()
  const [ask, el] = useFaceID()
  useEffect(() => { const t = setTimeout(() => ask(() => reset('tabs', { welcome: true }, 'fade')), 900); return () => clearTimeout(t) }, [])
  return (
    <div className="layer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'calc(var(--safe-top) + 34px) 24px 0' }}>
      <Wordmark h={36} />
      <div className="ovl" style={{ marginTop: 10, letterSpacing: '.2em', fontSize: 10 }}>Seu patrimônio, em movimento</div>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} style={{ marginTop: 48 }}><Avatar src={USER.foto} s={86} /></motion.div>
      <h2 style={{ fontSize: 24, fontWeight: 650, marginTop: 16, letterSpacing: '-.02em' }}>Olá, {USER.primeiro}</h2>
      <p className="t2" style={{ fontSize: 14, marginTop: 4 }}>Use o Face ID para acessar sua conta</p>
      <Tap onClick={() => ask(() => reset('tabs', { welcome: true }, 'fade'))} style={{ marginTop: 50, position: 'relative', display: 'grid', placeItems: 'center' }}>
        {[0, 1].map((i) => <motion.div key={i} animate={{ scale: [1, 1.5], opacity: [0.35, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: i * 1.1 }} style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '1.5px solid #0EDBB9' }} />)}
        <div className="glass" style={{ width: 120, height: 120, borderRadius: '50%', display: 'grid', placeItems: 'center' }}><FaceID state="idle" s={58} /></div>
      </Tap>
      <div className="cta" style={{ background: 'none' }}>
        <Btn icon="ScanFace" onClick={() => ask(() => reset('tabs', { welcome: true }, 'fade'))}>Entrar com Face ID</Btn>
        <Btn kind="ghost" icon="KeyRound" onClick={() => push('login')}>Usar minha senha</Btn>
        <button className="t2" style={{ fontSize: 13, marginTop: 4 }} onClick={() => push('login')}>Não é {USER.primeiro}? <span className="pos">Trocar de conta</span></button>
      </div>
      {el}
    </div>
  )
}

/* ---------------- recuperar ---------------- */
export function Recuperar() {
  const { pop, toast } = useApp()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(-1)
  const ok = /^\S+@\S+\.\S+$/.test(email)
  const steps = ['Confirme o link enviado por e-mail', 'Valide sua identidade com biometria', 'Crie uma nova senha de acesso']
  const send = () => { setStep(0); [1, 2, 3].forEach((s) => setTimeout(() => setStep(s), s * 650)); setTimeout(() => { toast('Link seguro enviado'); pop() }, 2600) }
  return (
    <div className="layer">
      <Header title="Recuperar acesso" />
      <div className="scroll notab">
        <motion.div className="glass" initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={spring} style={{ width: 64, height: 64, borderRadius: 22, display: 'grid', placeItems: 'center', marginBottom: 18 }}><Icon n="KeyRound" s={28} c="#0EDBB9" /></motion.div>
        <h2 style={{ fontSize: 26, fontWeight: 650, letterSpacing: '-.03em', lineHeight: 1.2 }}>Vamos ajudar você a voltar</h2>
        <p className="t2" style={{ fontSize: 14, margin: '8px 0 22px' }}>Informe o e-mail cadastrado. Enviaremos um link seguro para redefinir sua senha.</p>
        <Field label="E-mail cadastrado" icon="Mail" help={ok ? '✓ E-mail encontrado' : null}>
          <input type="email" inputMode="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <div className="list">
          {steps.map((s, i) => (
            <div key={i} className="li">
              <motion.div animate={{ background: step > i ? '#0EDBB9' : 'rgba(255,255,255,.08)', scale: step === i + 1 ? [1, 1.25, 1] : 1 }} style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', color: step > i ? '#04130F' : '#fff', fontSize: 12, fontWeight: 700, flex: 'none' }}>
                {step > i ? <Icon n="Check" s={15} w={3} /> : i + 1}
              </motion.div>
              <div className="ti" style={{ fontSize: 13.5 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="cta">
        <Btn icon="Send" disabled={!ok} loading={step >= 0} onClick={send}>Enviar link seguro</Btn>
        <Btn kind="ghost" onClick={pop}>Voltar ao login</Btn>
      </div>
    </div>
  )
}

/* ---------------- cadastro ---------------- */
function Stepper({ n }) {
  return (
    <div style={{ display: 'flex', gap: 6, margin: '0 0 22px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
          <motion.div initial={{ width: i < n ? '100%' : 0 }} animate={{ width: i <= n ? '100%' : 0 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ height: '100%', background: '#0EDBB9' }} />
        </div>
      ))}
    </div>
  )
}
export function Cadastro() {
  const { push } = useApp()
  const [f, setF] = useState({ nome: '', cpf: '', email: '', cel: '' })
  const [ok, setOk] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: k === 'cpf' ? maskCPF(e.target.value) : k === 'cel' ? maskPhone(e.target.value) : e.target.value }))
  const cpfOk = f.cpf.replace(/\D/g, '').length === 11
  const valid = f.nome.trim().split(' ').length > 1 && cpfOk && /^\S+@\S+\.\S+$/.test(f.email) && f.cel.replace(/\D/g, '').length >= 10 && ok
  return (
    <div className="layer">
      <Header title="Criar conta" sub="Etapa 1 de 3" />
      <div className="scroll withcta">
        <Stepper n={1} />
        <h2 style={{ fontSize: 24, fontWeight: 650, letterSpacing: '-.03em' }}>Vamos começar pelos seus dados</h2>
        <p className="t2" style={{ fontSize: 13.5, margin: '6px 0 20px' }}>Leva menos de 3 minutos. Seus dados são protegidos de ponta a ponta.</p>
        <Field label="Nome completo" icon="User"><input placeholder="Seu nome e sobrenome" value={f.nome} onChange={set('nome')} autoComplete="name" /></Field>
        <Field label="CPF" icon="IdCard" help="Usamos o CPF para validar sua identidade" right={cpfOk && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon n="CircleCheck" s={18} c="#0EDBB9" /></motion.span>}>
          <input inputMode="numeric" placeholder="000.000.000-00" value={f.cpf} onChange={set('cpf')} maxLength={14} />
        </Field>
        <Field label="E-mail" icon="Mail"><input type="email" inputMode="email" placeholder="seuemail@exemplo.com" value={f.email} onChange={set('email')} /></Field>
        <Field label="Celular" icon="Smartphone"><input inputMode="numeric" placeholder="(00) 00000-0000" value={f.cel} onChange={set('cel')} maxLength={15} /></Field>
        <button className="row" style={{ gap: 10, fontSize: 13, textAlign: 'left', marginTop: 4 }} onClick={() => { vibrate(5); setOk(!ok) }}>
          <motion.span animate={{ background: ok ? '#0EDBB9' : 'rgba(255,255,255,.06)', borderColor: ok ? '#0EDBB9' : 'rgba(255,255,255,.25)' }} style={{ width: 22, height: 22, borderRadius: 7, border: '1.5px solid', display: 'grid', placeItems: 'center', flex: 'none' }}>
            {ok && <Icon n="Check" s={14} c="#04130F" w={3} />}
          </motion.span>
          <span className="t2">Li e aceito os <span className="pos">Termos de Uso</span> e a <span className="pos">Política de Privacidade</span>.</span>
        </button>
        <Tap className="chip" style={{ marginTop: 16, fontSize: 12 }} onClick={() => { setF({ nome: 'Guilherme Matias', cpf: '482.317.290-15', email: 'guilherme@rendash.app', cel: '(87) 99812-4821' }); setOk(true) }}><Icon n="Sparkles" s={13} c="#0EDBB9" />Preencher com dados de exemplo</Tap>
      </div>
      <div className="cta"><Btn icon="ArrowRight" disabled={!valid} onClick={() => push('otp', { cel: f.cel })}>Continuar</Btn></div>
    </div>
  )
}

export function OTP({ cel = '(87) 99812-4821' }) {
  const { push } = useApp()
  const [code, setCode] = useState('')
  const [st, setSt] = useState('idle') // idle | checking | err | ok
  const [t, setT] = useState(42)
  const ref = useRef(null)
  useEffect(() => { const i = setInterval(() => setT((v) => Math.max(0, v - 1)), 1000); return () => clearInterval(i) }, [])
  useEffect(() => { const x = setTimeout(() => ref.current && ref.current.focus(), 450); return () => clearTimeout(x) }, [])
  useEffect(() => {
    if (code.length === 6) {
      setSt('checking')
      setTimeout(() => {
        if (code === '000000') { setSt('err'); vibrate(80); setTimeout(() => { setCode(''); setSt('idle') }, 900) }
        else { setSt('ok'); try { navigator.vibrate && navigator.vibrate([10, 30, 10]) } catch (e) {} sfx('faceid'); setTimeout(() => push('senha'), 700) }
      }, 900)
    }
  }, [code])
  const last4 = cel.replace(/\D/g, '').slice(-4)
  return (
    <div className="layer">
      <Header title="Verificar celular" sub="Etapa 2 de 3" />
      <div className="scroll withcta" onClick={() => ref.current && ref.current.focus()}>
        <Stepper n={2} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <motion.div className="glass" animate={{ rotate: [0, -8, 8, -4, 0] }} transition={{ delay: 0.6, duration: 0.6 }} style={{ width: 64, height: 64, borderRadius: 22, display: 'grid', placeItems: 'center', marginTop: 10 }}><Icon n="MessageSquareCode" s={28} c="#0EDBB9" /></motion.div>
          <h2 style={{ fontSize: 24, fontWeight: 650, marginTop: 18, letterSpacing: '-.02em' }}>Digite o código</h2>
          <p className="t2" style={{ fontSize: 13.5, marginTop: 6 }}>Enviamos um código de 6 dígitos por SMS para<br />+55 •• •••••-{last4 || '4821'}</p>
        </div>
        <motion.div animate={st === 'err' ? { x: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.45 }} style={{ position: 'relative', display: 'flex', gap: 8, justifyContent: 'center', margin: '28px 0 18px' }}>
          <input ref={ref} data-otp value={code} inputMode="numeric" autoComplete="one-time-code" maxLength={6}
            onChange={(e) => st === 'idle' && setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{ position: 'absolute', inset: 0, opacity: 0, fontSize: 16, zIndex: 2 }} aria-label="Código de 6 dígitos" />
          {Array.from({ length: 6 }).map((_, i) => {
            const ch = code[i], active = i === code.length && st === 'idle'
            const col = st === 'err' ? '#FF6B6B' : st === 'ok' ? '#0EDBB9' : active ? '#0EDBB9' : 'rgba(255,255,255,.12)'
            return (
              <motion.div key={i} animate={{ borderColor: col, scale: st === 'ok' ? [1, 1.08, 1] : 1, background: ch ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.04)' }} transition={{ delay: st === 'ok' ? i * 0.05 : 0 }}
                style={{ width: 48, height: 58, borderRadius: 14, border: '1.5px solid', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 650, position: 'relative', boxShadow: active ? '0 0 0 4px rgba(14,219,185,.12)' : 'none' }}>
                <AnimatePresence>{ch && <motion.span key={ch + i} initial={{ y: 12, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} className="num">{ch}</motion.span>}</AnimatePresence>
                {active && <motion.i animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.55, repeatType: 'reverse' }} style={{ position: 'absolute', width: 2, height: 24, background: '#0EDBB9', borderRadius: 1 }} />}
              </motion.div>
            )
          })}
        </motion.div>
        <div style={{ textAlign: 'center', fontSize: 13, minHeight: 22 }}>
          {st === 'checking' ? <span className="row t2" style={{ justifyContent: 'center' }}><Spinner s={14} />Verificando…</span>
            : st === 'err' ? <span className="neg">Código inválido. Tente de novo.</span>
              : st === 'ok' ? <span className="pos">✓ Celular verificado</span>
                : t > 0 ? <span className="t2">Reenviar código em <b className="num">00:{String(t).padStart(2, '0')}</b></span>
                  : <button className="pos" style={{ fontWeight: 600 }} onClick={() => setT(42)}>Reenviar código</button>}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}><button className="t2" style={{ fontSize: 13 }}>Receber por ligação</button></div>
        <div className="card flat row" style={{ marginTop: 26, fontSize: 12.5, alignItems: 'flex-start' }}><Icon n="ShieldAlert" s={18} c="#FFB84D" style={{ flex: 'none' }} /><span className="t2">Nunca compartilhe este código. A Rendash não solicita sua senha por telefone. Dica: qualquer código funciona, <b>000000</b> simula erro.</span></div>
      </div>
      <div className="cta"><Btn disabled={code.length < 6} loading={st === 'checking'} onClick={() => {}}>Verificar código</Btn></div>
    </div>
  )
}

export function Senha() {
  const { push } = useApp()
  const [s1, setS1] = useState(''); const [s2, setS2] = useState(''); const [show, setShow] = useState(false); const [bio, setBio] = useState(true)
  const score = [s1.length >= 8, /[A-Z]/.test(s1), /\d/.test(s1), /[^A-Za-z0-9]/.test(s1)].filter(Boolean).length
  const lbl = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'][score]
  const col = ['#FF6B6B', '#FF6B6B', '#FFB84D', '#5AA9FF', '#0EDBB9'][score]
  const valid = score >= 3 && s1 === s2
  return (
    <div className="layer">
      <Header title="Proteja sua conta" sub="Etapa 3 de 3" />
      <div className="scroll withcta">
        <Stepper n={3} />
        <h2 style={{ fontSize: 24, fontWeight: 650, letterSpacing: '-.03em' }}>Crie sua senha</h2>
        <p className="t2" style={{ fontSize: 13.5, margin: '6px 0 20px' }}>Use 8 caracteres ou mais, com letra maiúscula, número e símbolo.</p>
        <Field label="Senha" icon="LockKeyhole" right={<button onClick={() => setShow(!show)}><Icon n={show ? 'EyeOff' : 'Eye'} s={19} c="rgba(255,255,255,.6)" /></button>}>
          <input type={show ? 'text' : 'password'} placeholder="Nova senha" value={s1} onChange={(e) => setS1(e.target.value)} />
        </Field>
        <div style={{ display: 'flex', gap: 5, margin: '-4px 4px 6px' }}>
          {[0, 1, 2, 3].map((i) => <motion.div key={i} animate={{ background: i < score ? col : 'rgba(255,255,255,.1)' }} style={{ flex: 1, height: 4, borderRadius: 2 }} />)}
        </div>
        <div style={{ fontSize: 12, margin: '0 4px 16px', color: s1 ? col : 'var(--t3)' }}>{s1 ? `Força: ${lbl}` : 'Força da senha'}</div>
        <Field label="Confirmar senha" icon="LockKeyhole" err={s2 && s1 !== s2 ? 'As senhas não conferem.' : null}>
          <input type={show ? 'text' : 'password'} placeholder="Repita a senha" value={s2} onChange={(e) => setS2(e.target.value)} />
        </Field>
        <div className="card row" style={{ marginTop: 8 }}>
          <div className="ic"><Icon n="ScanFace" s={20} c="#0EDBB9" /></div>
          <div className="grow"><div style={{ fontWeight: 600, fontSize: 14.5 }}>Ativar Face ID</div><div className="t2" style={{ fontSize: 12.5 }}>Entre e confirme movimentações com o rosto</div></div>
          <Toggle on={bio} onChange={setBio} />
        </div>
        <Tap className="chip" style={{ marginTop: 16, fontSize: 12 }} onClick={() => { setS1('Rendash#2026'); setS2('Rendash#2026') }}><Icon n="Sparkles" s={13} c="#0EDBB9" />Usar senha de exemplo</Tap>
      </div>
      <div className="cta"><Btn disabled={!valid} onClick={() => push('contaCriada', {}, 'fade')}>Criar minha conta</Btn></div>
    </div>
  )
}

export function ContaCriada() {
  const { reset } = useApp()
  useEffect(() => { vibrate([10, 40, 10, 40, 20]) }, [])
  return (
    <div className="layer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 28px' }}>
      <Confetti />
      <SuccessMark />
      <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ fontSize: 28, fontWeight: 650, marginTop: 28, letterSpacing: '-.03em' }}>Conta criada!</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="t2" style={{ marginTop: 10, fontSize: 14.5 }}>Bem-vindo ao Rendash, {USER.primeiro}. Agora conecte seu primeiro banco e veja tudo em um só lugar.</motion.p>
      <div className="cta" style={{ background: 'none' }}>
        <Btn icon="Landmark" onClick={() => reset('tabs', { welcome: true, then: 'ofConectar' }, 'fade')}>Conectar meu banco</Btn>
        <Btn kind="ghost" onClick={() => reset('tabs', { welcome: true }, 'fade')}>Ir para o início</Btn>
      </div>
    </div>
  )
}

/* ---------------- sobre / créditos ---------------- */
export function Sobre() {
  return (
    <div className="layer">
      <Header title="Sobre o Rendash" sub="Créditos do projeto" />
      <div className="scroll notab">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '6px 0 22px' }}>
          <motion.div initial={{ rotateY: 180, scale: 0.6 }} animate={{ rotateY: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}><Logo k="rendash" s={78} r={0.24} /></motion.div>
          <Wordmark h={32} style={{ marginTop: 16 }} />
          <div className="t2" style={{ fontSize: 13, marginTop: 8 }}>Super-app financeiro · versão 1.0</div>
        </div>
        {TEAM.map((m, i) => (
          <motion.div key={m.nome} className="card hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12, ...spring }} style={{ marginBottom: 12 }}>
            <div className="row" style={{ gap: 14 }}>
              <Avatar src={m.foto} s={64} />
              <div className="grow">
                <div style={{ fontWeight: 650, fontSize: 16 }}>{m.nome}</div>
                <div className="badge" style={{ marginTop: 6 }}>{m.papel}</div>
                <div className="t2" style={{ fontSize: 12.5, marginTop: 6 }}>{m.area}</div>
                <div className="t3" style={{ fontSize: 12 }}>{m.faz}</div>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="list" style={{ marginTop: 6 }}>
          <Li icon="GraduationCap" title="IFPE Campus Garanhuns" sub="4º TI Tarde · Plano de Negócio" chevron={false} />
          <Li icon="UserRound" title="Professor" sub="Jair Galvão de Araújo" chevron={false} />
          <Li icon="UserRound" title="Professor" sub="Heverton Rodrigo Gonçalves de Souza" chevron={false} />
          <Li icon="Figma" title="Projeto no Figma" sub="Abrir as telas e o design system" onClick={() => window.open(FIGMA_URL, '_blank')} right={<Icon n="ExternalLink" s={16} c="#0EDBB9" />} />
          <Li icon="Github" title="Código no GitHub" sub="Protótipo e documentação" onClick={() => window.open(GITHUB_URL, '_blank')} right={<Icon n="ExternalLink" s={16} c="#0EDBB9" />} />
        </div>
        <Note icon="Info">Projeto acadêmico do IFPE Garanhuns. Logos de bancos e empresas pertencem às suas marcas.</Note>
      </div>
    </div>
  )
}
