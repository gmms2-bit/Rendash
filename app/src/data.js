import { series } from './format'

export const GITHUB_URL = 'https://github.com/gmms2-bit/Rendash'
export const FIGMA_URL = 'https://www.figma.com/design/1OCAwOXQ9xi7FRvUYwDWGv/Rendash---Prot%C3%B3tipo-interativo?node-id=228-243&p=f'
export const LOGIN = { email: 'guilherme@rendash.app', senha: 'rendash' }

export const USER = { nome: 'Guilherme Matias', primeiro: 'Guilherme', conta: 'Conta 45092-2', plano: 'Rendash Prime', foto: 'img/gui.jpg', cpf: '•••.482.317-••', email: 'guilherme@rendash.app', cel: '(87) 9 ••••-4821' }
export const TEAM = [
  { nome: 'Guilherme Matias de Melo Soares', curto: 'Guilherme Matias', papel: 'Sócio-fundador', area: 'Desenvolvedor full stack e cibersegurança', faz: 'Telas, código e arquitetura', foto: 'img/gui.jpg' },
  { nome: 'Julio Mendes de Lira Alves', curto: 'Julio Mendes', papel: 'Sócio-fundador', area: 'Economia e negócios', faz: 'Finanças, mercado e estratégia', foto: 'img/julio.jpg' },
]

export const PATRIMONIO = 124850.32
export const HOJE = 2930.12
export const RANGES = ['7D', '1M', '3M', '6M', '1A', 'Tudo']
export const PAT_SERIES = {
  '7D': series(7, 7, 121900, 0.0035, 0.012),
  '1M': series(11, 30, 116200, 0.0025, 0.016),
  '3M': series(23, 40, 104800, 0.004, 0.022),
  '6M': series(31, 40, 92100, 0.0075, 0.025),
  '1A': series(41, 40, 78400, 0.012, 0.03),
  Tudo: series(53, 40, 38000, 0.03, 0.04),
}
Object.values(PAT_SERIES).forEach((s) => { const f = PATRIMONIO / s[s.length - 1]; for (let i = 0; i < s.length; i++) s[i] *= f })

export const ASSETS = [
  { id: 'selic', nome: 'Tesouro Selic 2029', tipo: 'Renda fixa', sub: 'Renda fixa · 112% CDI', valor: 35200, rent: 8.2, logo: 'tesouro', cor: '#0EDBB9', liq: 'D+0', venc: '01 mar 2029', investido: 32500, bruto: 2700, cdi: 112, min: 100 },
  { id: 'petr4', nome: 'PETR4 · Petrobras', tipo: 'Ações', sub: '42 ações · +6,4%', valor: 18450, rent: 6.4, logo: 'petrobras', cor: '#8E7CFF', liq: 'D+2', venc: 'Sem vencimento', investido: 17340, bruto: 1110, cdi: 84, min: 38.12, ticker: 'PETR4', preco: 38.42, var: 2.41 },
  { id: 'btc', nome: 'Bitcoin', tipo: 'Cripto', sub: '0,043 BTC · +18,2%', valor: 12500, rent: 18.2, logo: 'bitcoin', cor: '#F7931A', liq: 'D+0', venc: 'Sem vencimento', investido: 10575, bruto: 1925, cdi: 210, min: 10 },
  { id: 'atlas', nome: 'Fundo Atlas Macro', tipo: 'Fundos', sub: 'Cota D+1 · +8,1%', valor: 28770, rent: 8.1, logo: 'atlas', cor: '#5AA9FF', liq: 'D+1', venc: 'Sem vencimento', investido: 26610, bruto: 2160, cdi: 108, min: 500 },
  { id: 'cdb', nome: 'CDB Rendash 120% CDI', tipo: 'Renda fixa', sub: 'Liquidez diária', valor: 21420, rent: 9.6, logo: 'rendash', cor: '#0EDBB9', liq: 'D+0', venc: '12 jan 2028', investido: 19540, bruto: 1880, cdi: 120, min: 100 },
  { id: 'eth', nome: 'Ethereum', tipo: 'Cripto', sub: '0,92 ETH · +11,4%', valor: 8510.32, rent: 11.4, logo: 'ethereum', cor: '#627EEA', liq: 'D+0', venc: 'Sem vencimento', investido: 7640, bruto: 870, cdi: 150, min: 10 },
]
export const ALOC = [
  { k: 'Renda fixa', p: 45, cor: '#0EDBB9' },
  { k: 'Ações', p: 30, cor: '#8E7CFF' },
  { k: 'Fundos', p: 15, cor: '#5AA9FF' },
  { k: 'Cripto', p: 10, cor: '#F7931A' },
]

export const EARN = {
  '7D': { total: 612.4, chg: 0.48, bars: [62, 88, 71, 95, 84, 102, 110], lbl: ['Qui', 'Sex', 'Sáb', 'Dom', 'Seg', 'Ter', 'Qua'] },
  '1M': { total: 2340.5, chg: 1.92, bars: [48, 61, 55, 72, 66, 80, 74, 88, 84, 96, 92, 108], lbl: ['1', '', '', '', '', '15', '', '', '', '', '', '30'] },
  '3M': { total: 6812.9, chg: 5.8, bars: [1880, 2120, 2340], lbl: ['Jul', 'Ago', 'Set'] },
  '6M': { total: 12240.2, chg: 10.9, bars: [1640, 1790, 1880, 2050, 2120, 2340], lbl: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'] },
  '1A': { total: 21580.7, chg: 19.4, bars: [1290, 1340, 1420, 1510, 1580, 1640, 1720, 1790, 1880, 2050, 2120, 2340], lbl: ['O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S'] },
  Tudo: { total: 38920.1, chg: 46.2, bars: [3200, 5800, 9400, 13300, 21580], lbl: ['2022', '2023', '2024', '2025', '2026'] },
}
export const EARN_HIST = [
  { t: 'Tesouro Selic 2029', s: 'Hoje, 09:12', v: 45.2, logo: 'tesouro' },
  { t: 'Dividendos PETR4', s: '02 set, 14:30', v: 145.2, logo: 'petrobras' },
  { t: 'Fundo Atlas Macro', s: '01 set, 18:00', v: 92.8, logo: 'atlas' },
  { t: 'CDB Rendash 120%', s: '31 ago, 08:00', v: 61.4, logo: 'rendash' },
]

export const MARKET_IDX = [
  { k: 'IBOVESPA', v: '128.450', c: 0.82, s: series(3, 24, 126000, 0.0008, 0.01) },
  { k: 'IFIX', v: '3.245', c: 0.31, s: series(5, 24, 3200, 0.0005, 0.006) },
  { k: 'Bitcoin', v: 'R$ 320 mil', c: -1.2, s: series(9, 24, 330000, -0.0006, 0.02), logo: 'bitcoin' },
  { k: 'Dólar', v: 'R$ 5,42', c: -0.4, s: series(13, 24, 5.5, -0.0002, 0.006) },
]
export const STOCKS = [
  { t: 'PETR4', n: 'Petrobras PN', p: 38.42, c: 2.41, logo: 'petrobras', cat: 'Ações', id: 'petr4' },
  { t: 'VALE3', n: 'Vale ON', p: 62.1, c: 3.18, logo: 'vale', cat: 'Ações' },
  { t: 'ITUB4', n: 'Itaú Unibanco PN', p: 34.8, c: 1.42, logo: 'itau', cat: 'Ações' },
  { t: 'BBAS3', n: 'Banco do Brasil ON', p: 28.15, c: -0.62, logo: 'bb', cat: 'Ações' },
  { t: 'MGLU3', n: 'Magazine Luiza ON', p: 9.14, c: -2.35, logo: 'magalu', cat: 'Ações' },
  { t: 'BBDC4', n: 'Bradesco PN', p: 14.22, c: 0.85, logo: 'bradesco', cat: 'Ações' },
  { t: 'BTC', n: 'Bitcoin', p: 320410, c: -1.2, logo: 'bitcoin', cat: 'Cripto', id: 'btc' },
  { t: 'ETH', n: 'Ethereum', p: 9250, c: 2.9, logo: 'ethereum', cat: 'Cripto', id: 'eth' },
  { t: 'SOL', n: 'Solana', p: 812.4, c: 4.1, logo: 'solana', cat: 'Cripto' },
  { t: 'HGLG11', n: 'CSHG Logística', p: 158.9, c: 0.42, logo: 'fii', cat: 'FIIs' },
  { t: 'MXRF11', n: 'Maxi Renda', p: 9.88, c: 0.1, logo: 'fii', cat: 'FIIs' },
  { t: 'SELIC29', n: 'Tesouro Selic 2029', p: 15320, c: 0.04, logo: 'tesouro', cat: 'Renda fixa', id: 'selic' },
  { t: 'CDB120', n: 'CDB Rendash 120% CDI', p: 100, c: 0.05, logo: 'rendash', cat: 'Renda fixa', id: 'cdb' },
]

export const ACCOUNTS = [
  { id: 'rendash', banco: 'Rendash', logo: 'rendash', tipo: 'Conta principal', fim: '2891', saldo: 84230.5, mes: 2840, quando: 'Ao vivo' },
  { id: 'itau', banco: 'Itaú', logo: 'itau', tipo: 'Conta corrente', fim: '0428', saldo: 42910.2, mes: 1340, quando: '2 min' },
  { id: 'itaup', banco: 'Itaú', logo: 'itau', tipo: 'Poupança', fim: '1184', saldo: 13830, mes: 81, quando: '2 min' },
  { id: 'nubank', banco: 'Nubank', logo: 'nubank', tipo: 'Conta de pagamento', fim: '0901', saldo: 45450.2, mes: -480, quando: '5 min' },
]
export const BANKS = [
  { k: 'nubank', n: 'Nubank', s: 'Nu Pagamentos · 260' }, { k: 'itau', n: 'Itaú Unibanco', s: 'Banco · 341' }, { k: 'bb', n: 'Banco do Brasil', s: 'Banco · 001' },
  { k: 'c6', n: 'C6 Bank', s: 'Banco · 336' }, { k: 'inter', n: 'Inter', s: 'Banco múltiplo · 077' }, { k: 'santander', n: 'Santander', s: 'Banco · 033' },
  { k: 'bradesco', n: 'Bradesco', s: 'Banco · 237' }, { k: 'caixa', n: 'Caixa', s: 'Banco · 104' }, { k: 'btg', n: 'BTG Pactual', s: 'Banco · 208' },
  { k: 'xp', n: 'XP Investimentos', s: 'Corretora · 102' }, { k: 'picpay', n: 'PicPay', s: 'Conta de pagamento · 380' }, { k: 'mercadopago', n: 'Mercado Pago', s: 'Conta de pagamento · 323' },
]

export const TX = [
  { id: 'pix1', dia: 'Hoje, 30 set', t: 'Pix recebido · Marina Costa', s: 'Rendash · 14:32', cat: 'Serviços', v: 3200, logo: 'pix', banco: 'rendash' },
  { id: 't2', dia: 'Hoje, 30 set', t: 'Casa Manioca', s: 'Nubank · Alimentação · 12:08', cat: 'Alimentação', v: -186.4, ic: 'food', banco: 'nubank' },
  { id: 't3', dia: 'Hoje, 30 set', t: 'Assinatura Figma', s: 'Itaú · Software · 09:40', cat: 'Assinaturas', v: -86, ic: 'sub', banco: 'itau' },
  { id: 't4', dia: 'Ontem, 29 set', t: 'Rendimento Rendash', s: 'Rendash · Investimentos · 18:31', cat: 'Investimentos', v: 1240.8, logo: 'rendash', banco: 'rendash' },
  { id: 't5', dia: 'Ontem, 29 set', t: 'Uber', s: 'Nubank · Mobilidade · 17:26', cat: 'Mobilidade', v: -42.6, ic: 'car', banco: 'nubank' },
  { id: 't6', dia: 'Ontem, 29 set', t: 'Supermercado Zona Sul', s: 'Itaú · Alimentação · 11:02', cat: 'Alimentação', v: -320.5, ic: 'cart', banco: 'itau' },
  { id: 'pix2', dia: '28 set', t: 'Pix enviado · Julio Mendes', s: 'Rendash · Transferência · 20:14', cat: 'Transferências', v: -150, logo: 'pix', banco: 'rendash' },
  { id: 't8', dia: '28 set', t: 'Salário · Lumina Studio', s: 'Itaú · Renda · 08:00', cat: 'Renda', v: 7800, ic: 'work', banco: 'itau' },
  { id: 't9', dia: '27 set', t: 'Netflix', s: 'Nubank · Assinaturas · 07:00', cat: 'Assinaturas', v: -55.9, ic: 'sub', banco: 'nubank' },
  { id: 't10', dia: '27 set', t: 'Dividendos PETR4', s: 'Rendash · Proventos · 14:30', cat: 'Investimentos', v: 145.2, logo: 'petrobras', banco: 'rendash' },
]

export const NOTIFS = [
  { id: 1, cat: 'Rendimentos', t: 'Rendimento creditado', d: 'Tesouro Selic rendeu R$ 45,20 hoje.', q: 'há 2h', ic: 'up', unread: true },
  { id: 2, cat: 'Alertas', t: 'Alerta de mercado', d: 'IBOVESPA caiu 2% com o cenário externo.', q: 'há 5h', ic: 'alert', unread: true },
  { id: 3, cat: 'Rendimentos', t: 'Meta atingida', d: 'Você alcançou 80% da sua Reserva.', q: 'ontem', ic: 'target' },
  { id: 4, cat: 'Rendimentos', t: 'Dividendo recebido', d: 'PETR4 pagou R$ 0,85 por ação hoje.', q: '2 dias', ic: 'coin' },
  { id: 5, cat: 'Sistema', t: 'Acesso seguro', d: 'Novo acesso reconhecido neste iPhone.', q: '3 dias', ic: 'shield' },
  { id: 6, cat: 'Alertas', t: 'Fatura fecha em 3 dias', d: 'Fatura de setembro: R$ 4.286,90.', q: '3 dias', ic: 'card' },
  { id: 7, cat: 'Sistema', t: 'Itaú sincronizado', d: '2.847 movimentações importadas via Open Finance.', q: '4 dias', ic: 'sync' },
]

export const GOALS = [
  { id: 'reserva', n: 'Reserva de emergência', v: 15000, alvo: 20000, prazo: 'Dez 2026', dica: 'Aporte R$ 500/mês para atingir no prazo.', cor: '#0EDBB9', ic: 'LifeBuoy' },
  { id: 'europa', n: 'Viagem para a Europa', v: 8200, alvo: 25000, prazo: 'Jul 2027', dica: 'Economize R$ 200 extras em jantares.', cor: '#8E7CFF', ic: 'Plane' },
  { id: 'apos', n: 'Aposentadoria', v: 45000, alvo: 500000, prazo: 'Mai 2045', dica: 'Aumente os aportes em 2% ao ano para acelerar.', cor: '#F7931A', ic: 'TreePalm' },
]

export const CATS = [
  { k: 'Alimentação', v: 3842, p: 31, ic: 'food', cor: '#FF8A65' },
  { k: 'Moradia', v: 3180, p: 25, ic: 'home', cor: '#5AA9FF' },
  { k: 'Mobilidade', v: 1986, p: 16, ic: 'car', cor: '#8E7CFF' },
  { k: 'Saúde', v: 1210, p: 10, ic: 'heart', cor: '#FF6B9A' },
  { k: 'Assinaturas', v: 980, p: 8, ic: 'sub', cor: '#F7C948' },
  { k: 'Lazer', v: 1486.2, p: 10, ic: 'party', cor: '#0EDBB9' },
]
export const CATS_REC = [
  { k: 'Renda', v: 7800, p: 62, ic: 'work', cor: '#0EDBB9' },
  { k: 'Serviços', v: 3200, p: 25, ic: 'brief', cor: '#5AA9FF' },
  { k: 'Investimentos', v: 1386, p: 11, ic: 'up', cor: '#8E7CFF' },
  { k: 'Outros', v: 260, p: 2, ic: 'dots', cor: '#999' },
]

export const CARD = { final: '4821', titular: 'GUILHERME M SOARES', validade: '09/31', limite: 10000, usado: 4286.9, fatura: 4286.9, fecha: '03 out', vence: '10 out', pontos: 1842 }
export const FATURA = [
  { id: 'c1', dia: 'Hoje, 30 set', t: 'Azul Linhas Aéreas', s: '2/6 · Viagens · 10:24', v: 389.9, ic: 'plane', cat: 'Viagens', local: 'Online · São Paulo', parc: '6x de R$ 389,90', status: 'PAGO' },
  { id: 'c2', dia: 'Hoje, 30 set', t: 'Coffee Lab', s: 'Alimentação · 08:14', v: 72.9, ic: 'coffee', cat: 'Alimentação', local: 'Garanhuns · PE', parc: 'À vista', status: 'PAGO' },
  { id: 'c3', dia: 'Ontem, 29 set', t: 'Mercado Livre', s: '1/3 · Compras · 17:42', v: 428.7, logo: 'mercadopago', cat: 'Compras', local: 'Online', parc: '3x de R$ 428,70', status: 'EM PROCESSO' },
  { id: 'c4', dia: 'Ontem, 29 set', t: 'Mani', s: 'Alimentação · 13:10', v: 219.9, ic: 'food', cat: 'Alimentação', local: 'Recife · PE', parc: 'À vista', status: 'PAGO' },
  { id: 'c5', dia: 'Ontem, 29 set', t: 'Adobe Creative Cloud', s: 'Assinaturas · 09:02', v: 95, ic: 'sub', cat: 'Assinaturas', local: 'Online', parc: 'À vista', status: 'PAGO' },
  { id: 'c6', dia: '27 set', t: 'Amazon', s: 'Compras · 21:40', v: 312.4, logo: 'amazon', cat: 'Compras', local: 'Online', parc: '2x de R$ 156,20', status: 'PAGO' },
  { id: 'c7', dia: '26 set', t: 'Apple.com', s: 'Assinaturas · 03:00', v: 49.9, logo: 'apple', cat: 'Assinaturas', local: 'Online', parc: 'À vista', status: 'PAGO' },
]

export const EMPRESA = {
  nome: 'Lumina Studio Ltda.', cnpj: '48.290.118/0001-72', saldo: 286310.8, receber: 48200, pagar: 31800,
  fluxo: series(77, 30, 41000, 0.01, 0.05), entradas: 128400, saidas: 73600, rend: 2984,
  prox: [{ t: 'NF 2026-184 · Amora Tech', s: 'Recebimento · amanhã', v: 18400 }, { t: 'Folha de pagamento', s: '12 colaboradores · 05 out', v: -42680 }, { t: 'Aluguel do escritório', s: 'Boleto · 10 out', v: -6800 }],
}
export const CONTACTS = [
  { n: 'Julio Mendes', k: 'julio@rendash.app', foto: 'img/julio.jpg', banco: 'Rendash' },
  { n: 'Marina Costa', k: '(81) 9 ••••-1180', banco: 'Banco do Brasil', ini: 'MC' },
  { n: 'Lumina Studio', k: '48.290.118/0001-72', banco: 'Itaú', ini: 'LS' },
  { n: 'Ana Beatriz', k: 'ana.b@email.com', banco: 'Nubank', ini: 'AB' },
]
