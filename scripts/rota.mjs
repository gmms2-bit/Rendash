#!/usr/bin/env node
// Roteamento local por cota. Os valores em dólares são estimativas de API, não a mensalidade Pro.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HORA = 3_600_000;
const DIA = 24 * HORA;
const normalizar = (s) => String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const numero = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;
const data = (s) =>
  typeof s === 'string' && Number.isFinite(Date.parse(s)) ? Date.parse(s) : null;

/** Flags positivas prevalecem na sua categoria; criticidade sempre tem prioridade. */
export function classificar(tarefa) {
  const t = typeof tarefa === 'string' ? { descricao: tarefa } : tarefa;
  const texto = normalizar(t.descricao ?? '');
  const tem = (regex) => regex.test(texto);
  const dinheiro =
    !!t.dinheiro ||
    tem(/\b(pix|saldo|repasse|saque|carteira|pedido|estorno|pagamento|cobranca|payment|billing|wallet|refund|money)\b/);
  const seguranca =
    !!t.seguranca || tem(/\b(token|segredo|auth\w*|permiss\w*|seguranca|security|secret\w*)\b/);
  const producao =
    !!t.producao || tem(/\b(deploy|servidor|main|producao|production|migracao|banco|database)\b/);
  const forcarTipo = t.ui || t.arquitetura || t.mecanica;
  const ui =
    !!t.ui ||
    (!forcarTipo && tem(/\b(tela|layout|design|ux|ui|dashboard|componente visual|screen)\b/));
  const arquitetura =
    !!t.arquitetura || (!forcarTipo && tem(/\b(arquitetura|architecture|desenho|trade-off)\b/));
  const dificil =
    !t.mecanica && tem(/\b(dificil|complex\w*|hard|difficult|decisao|decision|trade-off)\b/);
  const auditoria = tem(/\b(auditoria|audit)\b/);
  const mecanica =
    !!t.mecanica ||
    (!forcarTipo &&
      tem(
        /\b(teste\w*|test\w*|refactor\w*|renomear|rename|doc\w*|readme|lint|typo|formatar|script simples)\b/,
      ));
  const arquivos = Number(/\b(\d+)\s+(?:arquivos?|files?)\b/.exec(texto)?.[1] ?? 0);
  const tamanho =
    t.tamanho ??
    (arquivos >= 6 || tem(/\b(varios|todas|todos|auditoria|audit|migrar|migration)\b/)
      ? 'g'
      : arquivos === 1 || tem(/\b(pequena|pequeno|simples|small|tiny)\b/)
        ? 'p'
        : 'm');
  if (!['p', 'm', 'g'].includes(tamanho)) throw new Error('Tamanho deve ser p, m ou g.');
  return { dinheiro, seguranca, producao, ui, arquitetura, dificil, auditoria, mecanica, tamanho };
}

/** Função pura: não lê arquivos, ambiente nem relógio; tarefa pode ser texto ou objeto de flags. */
export function rotear(tarefa, uso = {}, config = {}, agora) {
  const instante = new Date(agora).getTime();
  if (!Number.isFinite(instante)) throw new Error('Informe uma data válida em agora.');
  const t = typeof tarefa === 'string' ? { descricao: tarefa } : tarefa;
  const c = classificar(t);
  const avisos = [];
  const motivos = [];
  const claude = uso.claude ?? {};
  const contas = Array.isArray(uso.codex) ? uso.codex : [];
  const dias = Array.isArray(claude.ultimos7dias) ? claude.ultimos7dias.slice(-7) : [];
  const capSemana =
    numero(config.capSemanaUsd) && config.capSemanaUsd > 0 ? config.capSemanaUsd : 120;
  const cap5h = numero(config.cap5hUsd) && config.cap5hUsd > 0 ? config.cap5hUsd : 20;
  const estimadoSemana = !numero(claude.pctSemana);
  const estimado5h = !numero(claude.pct5h);
  const semana = estimadoSemana
    ? (dias.reduce((s, d) => s + (numero(d.usdEstimado) ? d.usdEstimado : 0), 0) / capSemana) * 100
    : claude.pctSemana;
  const janela = claude.janela5h;
  const reset5h = data(claude.reset5h) ?? data(janela?.fim);
  const janelaExpirada = reset5h !== null && reset5h <= instante;
  const pct5h = janelaExpirada
    ? 0
    : estimado5h
      ? ((numero(janela?.usdEstimado) ? janela.usdEstimado : 0) / cap5h) * 100
      : claude.pct5h;
  let resetSemana = data(config.resetSemanaClaude) ?? data(claude.resetSemana);
  if (resetSemana === null) {
    resetSemana = data(contas[0]?.resetSemana);
    avisos.push('Reset semanal do Claude aproximado pela conta principal do Codex.');
  }
  if (resetSemana === null || resetSemana <= instante)
    avisos.push('Reset semanal ausente ou vencido; atualize os dados de uso.');
  const diasAteReset = Math.max(1, resetSemana === null ? 1 : (resetSemana - instante) / DIA);
  const restante = Math.max(0, 100 - semana);
  const orcamentoDia = (restante / diasAteReset) * 0.85;
  const hoje = new Date(instante).toISOString().slice(0, 10);
  const usoHoje =
    (dias.reduce(
      (s, d, i) =>
        s +
        ((d.dia?.slice(0, 10) === hoje || (!d.dia && i === dias.length - 1)) &&
        numero(d.usdEstimado)
          ? d.usdEstimado
          : 0),
      0,
    ) /
      capSemana) *
    100;
  const ritmo =
    usoHoje > orcamentoDia ? 'acima' : usoHoje > orcamentoDia * 0.8 ? 'no limite' : 'dentro';
  const atualizado = data(uso.atualizadoEm);
  if (atualizado === null) avisos.push('Data de atualização do uso ausente ou inválida.');
  else if (instante - atualizado > 2 * HORA) avisos.push('Uso desatualizado há mais de 2h.');
  if (estimadoSemana || estimado5h)
    avisos.push('Uso do Claude estimado, calibre com /usage (Pro US$ 20; dólares de API).');
  if (!uso.claude) avisos.push('Uso do Claude indisponível; estimativa sem histórico.');
  const pctConta = (conta, periodo) => {
    const reset = data(conta[periodo === 'pct5h' ? 'reset5h' : 'resetSemana']);
    return reset !== null && reset <= instante ? 0 : numero(conta[periodo]) ? conta[periodo] : 100;
  };
  const disponiveis = contas
    .filter((a) => !a.bloqueada && pctConta(a, 'pct5h') < 90 && pctConta(a, 'pctSemana') < 100)
    .sort(
      (a, b) =>
        pctConta(a, 'pct5h') +
        pctConta(a, 'pctSemana') -
        (pctConta(b, 'pct5h') + pctConta(b, 'pctSemana')),
    );
  const critico = c.dinheiro || c.seguranca || c.producao;
  const forte = c.ui || c.arquitetura || c.dificil;
  const semClaude = pct5h >= 90 || semana >= 95;
  const resultado = {
    executor: 'Claude',
    modelo: 'Sonnet',
    esforco: { p: 'baixo', m: 'médio', g: 'alto' }[c.tamanho],
    contaCodex: null,
    esperar: false,
    ate: null,
    minutos: null,
    motivos,
    orcamento: {
      semanaRestantePct: restante,
      diasAteReset,
      orcamentoDiaPct: orcamentoDia,
      usoHojePct: usoHoje,
      ritmo,
      janela5hPct: pct5h,
      semanaPct: semana,
      estimadoSemana,
      estimado5h,
    },
    avisos,
  };
  const esperar = (resets) => {
    resultado.esperar = true;
    const futuros = resets.filter((r) => r !== null && r > instante);
    if (futuros.length) {
      const reset = Math.min(...futuros);
      resultado.ate = new Date(reset).toISOString();
      resultado.minutos = Math.ceil((reset - instante) / 60_000);
    } else avisos.push('Sem horário de reset futuro conhecido; atualize o uso antes de continuar.');
  };
  const aperto = ritmo !== 'dentro' || semana >= 60 || pct5h >= 60;
  const claudeDireto = !semClaude && !aperto;
  resultado.revisao = { claude: false, modelo: null, apos: null };
  /** Revisão do Claude sobre o que o Codex fez; adiada para depois do reset se ele estiver sem cota. */
  const revisar = (modelo, motivo) => {
    resultado.revisao = { claude: true, modelo, apos: null };
    motivos.push(motivo);
    if (semClaude) {
      const resets = [];
      if (pct5h >= 90) resets.push(reset5h);
      if (semana >= 95) resets.push(resetSemana);
      const futuro = resets.includes(null) ? null : Math.max(...resets);
      if (futuro > instante) resultado.revisao.apos = new Date(futuro).toISOString();
      motivos.push('Claude sem cota: a revisão fica para depois do reset.');
    }
  };
  const codex = () => {
    resultado.executor = 'Codex';
    resultado.modelo = config.modeloCodex ?? 'MODELO_CODEX';
    if (disponiveis.length) resultado.contaCodex = disponiveis[0].conta;
    else if (claudeDireto && c.tamanho === 'p') {
      resultado.executor = 'Claude';
      resultado.modelo = 'Haiku';
      motivos.push('Contas Codex indisponíveis; tarefa pequena cabe na folga do Claude.');
    } else {
      motivos.push('Todas as contas Codex estão indisponíveis.');
      esperar(
        contas.flatMap((a) => {
          if (a.bloqueada) return [data(a.reset5h), data(a.resetSemana)];
          const resets = [];
          if (pct5h >= 90 || pctConta(a, 'pct5h') >= 90) resets.push(data(a.reset5h));
          if (pctConta(a, 'pctSemana') >= 100) resets.push(data(a.resetSemana));
          return resets.includes(null) ? [] : [Math.max(...resets)];
        }),
      );
    }
  };
  const claudeEscreve = () => {
    if (semClaude) {
      motivos.push('Claude sem cota; aguarde a reposição dos limites atingidos.');
      const resets = [];
      if (pct5h >= 90) resets.push(reset5h);
      if (semana >= 95) resets.push(resetSemana);
      esperar(resets.includes(null) ? [] : [Math.max(...resets)]);
    }
  };
  const opus = () =>
    (c.auditoria || (c.arquitetura && c.dificil)) && semana < 50 && ritmo === 'dentro';
  motivos.push('Padrão: Codex primeiro; o Claude escreve só o que faz claramente melhor.');
  if (c.producao) {
    motivos.push('Produção (deploy, servidor, main, banco) exige Claude; nunca Codex.');
    if (opus()) resultado.modelo = 'Opus';
    claudeEscreve();
  } else if (c.dinheiro || c.seguranca) {
    if (disponiveis.length && !(claudeDireto && semana < 30 && (forte || c.auditoria))) {
      motivos.push('Dinheiro/segurança: Codex implementa, revisão do Claude obrigatória.');
      codex();
      resultado.esforco = 'alto';
      revisar(opus() ? 'Opus' : 'Sonnet', 'Revisão obrigatória do Claude em dinheiro/segurança.');
    } else {
      motivos.push(
        disponiveis.length
          ? 'Dinheiro/segurança difícil com Claude folgado: Claude escreve.'
          : 'Dinheiro/segurança sem conta Codex: Claude escreve.',
      );
      if (opus()) resultado.modelo = 'Opus';
      claudeEscreve();
    }
  } else if (forte) {
    if (pct5h >= 80 && reset5h !== null && reset5h > instante && reset5h - instante <= HORA) {
      motivos.push('Tarefa forte: janela de 5h quase cheia e reset em até 60 minutos.');
      esperar([reset5h]);
    } else if (claudeDireto) {
      motivos.push('UI/UX, arquitetura ou decisão difícil com cota folgada: Claude escreve.');
      if (c.arquitetura && c.dificil && semana < 40) resultado.modelo = 'Opus';
    } else if (disponiveis.length) {
      motivos.push('Tarefa forte, mas o ritmo do Claude pede economia: Codex com esforço alto.');
      codex();
      resultado.esforco = 'alto';
      revisar('Sonnet', 'Revisão do Claude no que exige julgamento (UI/UX, arquitetura).');
    } else if (!semClaude) {
      motivos.push('Sem conta Codex: Claude escreve apesar do ritmo.');
    } else codex();
  } else {
    motivos.push(
      c.mecanica
        ? 'Tarefa mecânica, teste, refactor ou documentação favorece Codex.'
        : 'Preservar a cota do Claude: Codex primeiro.',
    );
    codex();
    if (resultado.executor === 'Codex' && c.tamanho === 'g')
      revisar(c.mecanica ? 'Haiku' : 'Sonnet', 'Tarefa grande: revisão rápida do Claude no fim.');
  }
  if (ritmo === 'no limite' && resultado.executor === 'Claude') {
    if (resultado.modelo === 'Opus') resultado.modelo = 'Sonnet';
    else if (!critico && c.tamanho === 'p') resultado.modelo = 'Haiku';
    motivos.push('Ritmo no limite: reduzir o modelo quando permitido.');
  }
  if (t.meio) {
    resultado.acao = resultado.esperar
      ? 'pausar'
      : t.executorAtual && normalizar(t.executorAtual) !== normalizar(resultado.executor)
        ? 'trocar'
        : 'continuar';
    motivos.push(
      resultado.esperar
        ? 'No meio da tarefa: pause até haver cota.'
        : `No meio da tarefa: siga com ${resultado.executor}; troque se o executor atual for diferente.`,
    );
  }
  return resultado;
}

function lerJson(arquivo, avisos, opcional = false) {
  try {
    const valor = JSON.parse(readFileSync(arquivo, 'utf8'));
    if (!valor || typeof valor !== 'object' || Array.isArray(valor))
      throw new Error('objeto JSON esperado');
    return valor;
  } catch (erro) {
    if (!opcional || erro.code !== 'ENOENT')
      avisos.push(`Não foi possível ler ${arquivo}: ${erro.code ?? erro.message}`);
    return {};
  }
}

/** Limites reais do Claude (% e reset) gravados pela status line `statusline` do Claude; valem por 6h. */
export function mesclarLimitesReais(uso, arquivo, agora) {
  try {
    const real = JSON.parse(readFileSync(arquivo, 'utf8'));
    const idade = Date.parse(agora) - Date.parse(real.atualizadoEm);
    if (!(idade >= 0 && idade <= 6 * HORA)) return;
    const iso = (v) => (typeof v === 'number' ? new Date(v * 1000).toISOString() : v);
    const { five_hour: h5, seven_day: d7 } = real.rate_limits ?? {};
    uso.claude ??= {};
    if (numero(h5?.used_percentage)) uso.claude.pct5h = h5.used_percentage;
    if (h5?.resets_at) uso.claude.reset5h = iso(h5.resets_at);
    if (numero(d7?.used_percentage)) uso.claude.pctSemana = d7.used_percentage;
    if (d7?.resets_at) uso.claude.resetSemana = iso(d7.resets_at);
  } catch {}
}

export function executar(args) {
  const tarefa = {};
  let arquivoUso = join(homedir(), '.local/share/rota-uso/uso.json');
  let agora = new Date().toISOString();
  let json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') json = true;
    else if (['--uso', '--agora', '--tamanho'].includes(arg)) {
      const valor = args[++i];
      if (!valor || valor.startsWith('--')) throw new Error(`Falta valor para ${arg}.`);
      if (arg === '--uso') arquivoUso = valor;
      else if (arg === '--agora') agora = valor;
      else tarefa.tamanho = valor;
    } else if (
      [
        '--dinheiro',
        '--seguranca',
        '--producao',
        '--ui',
        '--arquitetura',
        '--mecanica',
        '--meio',
      ].includes(arg)
    )
      tarefa[arg.slice(2)] = true;
    else if (arg.startsWith('-') || tarefa.descricao !== undefined)
      throw new Error(`Argumento inválido: ${arg}`);
    else tarefa.descricao = arg;
  }
  if (!tarefa.descricao?.trim())
    throw new Error('Uso: rota "<descrição>" [--json] [--uso arquivo] [--agora ISO] [flags]');
  const avisos = [];
  const uso = lerJson(arquivoUso, avisos);
  const config = lerJson(join(homedir(), '.config/rota.json'), avisos, true);
  mesclarLimitesReais(uso, join(dirname(arquivoUso), 'claude-limites.json'), agora);
  const resultado = rotear(tarefa, uso, config, agora);
  resultado.avisos.push(...avisos);
  if (json) return JSON.stringify(resultado, null, 2);
  const o = resultado.orcamento;
  return [
    `Executor: ${resultado.executor}`,
    `Modelo: ${resultado.modelo}`,
    `Esforço: ${resultado.esforco}`,
    `Conta Codex: ${resultado.contaCodex ?? '—'}`,
    `Revisão do Claude: ${resultado.revisao.claude ? `sim — ${resultado.revisao.modelo}${resultado.revisao.apos ? ` (depois de ${resultado.revisao.apos})` : ''}` : 'não'}`,
    `Esperar: ${resultado.esperar ? `sim — ${resultado.ate ?? 'reset desconhecido'} (${resultado.minutos ?? '?'} min)` : 'não'}`,
    ...(resultado.acao ? [`Ação: ${resultado.acao}`] : []),
    'Motivos:',
    ...resultado.motivos.map((m) => `- ${m}`),
    `Orçamento: semana restante ${o.semanaRestantePct.toFixed(1)}%${o.estimadoSemana ? ' (estimado, calibre com /usage)' : ''}; ${o.diasAteReset.toFixed(2)} dias; dia ${o.orcamentoDiaPct.toFixed(1)}%; ritmo ${o.ritmo}; janela 5h ${o.janela5hPct.toFixed(1)}%${o.estimado5h ? ' (estimado, calibre com /usage)' : ''}.`,
    'Avisos:',
    ...resultado.avisos.map((a) => `- ${a}`),
  ].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    console.log(executar(process.argv.slice(2)));
  } catch (erro) {
    console.error(erro.message);
    process.exitCode = 1;
  }
}
