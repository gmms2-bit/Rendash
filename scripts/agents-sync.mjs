#!/usr/bin/env node
// Gera os agentes do Codex (`.codex/agents/*.toml`) a partir dos do Claude (`.claude/agents/*.md`),
// para os dois lerem as mesmas instruções. A fonte é sempre o `.md`; o `.toml` não se edita.
// `--check` só confere e sai com 1 se algum estiver diferente (CI e teste).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, '.claude/agents');
const TARGET = join(ROOT, '.codex/agents');

// Modelo do Claude → modelo e esforço no Codex. AJUSTE: troque MODELO_CODEX* pelos modelos da sua conta.
const MODELS = {
  opus: { model: 'MODELO_CODEX', effort: 'high' },
  sonnet: { model: 'MODELO_CODEX', effort: 'medium' },
  haiku: { model: 'MODELO_CODEX_LEVE', effort: 'medium' },
};

/** Lê o frontmatter simples (`chave: valor`, uma linha cada) e o corpo de um agente do Claude. */
export function parseAgent(text, file = 'agente') {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${file}: sem frontmatter`);
  const meta = {};
  for (const line of match[1].split('\n')) {
    const at = line.indexOf(':');
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  for (const key of ['name', 'description']) {
    if (!meta[key]) throw new Error(`${file}: falta \`${key}\``);
  }
  return { meta, body: match[2].trim() };
}

/** Monta o TOML do Codex. Strings literais (''') para o texto passar sem escape. */
export function toCodex({ meta, body }, sourceName) {
  const mapped = MODELS[meta.model] ?? MODELS.sonnet;
  const skills = (meta.skills ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const intro = skills.length
    ? `Antes, leia ${skills.map((s) => `\`.claude/skills/${s}/SKILL.md\``).join(' e ')}.\n\n`
    : '';
  const instructions = intro + body;
  for (const text of [meta.description, instructions]) {
    if (text.includes("'''")) throw new Error(`${sourceName}: o texto não pode ter '''`);
  }
  return [
    `# Gerado por scripts/agents-sync.mjs a partir de .claude/agents/${sourceName}. Não edite.`,
    `name = "${meta.name.replaceAll('-', '_')}"`,
    `description = '''${meta.description}'''`,
    `model = "${mapped.model}"`,
    `model_reasoning_effort = "${mapped.effort}"`,
    `developer_instructions = '''\n${instructions}\n'''`,
    '',
  ].join('\n');
}

/** O que deveria existir em `.codex/agents`: { arquivo: conteúdo }. */
export function expected() {
  const out = {};
  for (const file of readdirSync(SOURCE)
    .filter((f) => f.endsWith('.md'))
    .sort()) {
    const agent = parseAgent(readFileSync(join(SOURCE, file), 'utf8'), file);
    out[file.replace(/\.md$/, '.toml')] = toCodex(agent, file);
  }
  return out;
}

/** Arquivos diferentes, faltando ou sobrando. */
export function drift() {
  const want = expected();
  const have = existsSync(TARGET) ? readdirSync(TARGET).filter((f) => f.endsWith('.toml')) : [];
  const wrong = Object.keys(want).filter(
    (f) => !existsSync(join(TARGET, f)) || readFileSync(join(TARGET, f), 'utf8') !== want[f],
  );
  const extra = have.filter((f) => !(f in want));
  return { want, wrong, extra };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { want, wrong, extra } = drift();
  if (process.argv.includes('--check')) {
    if (wrong.length || extra.length) {
      console.error(
        `.codex/agents fora de sincronia: ${[...wrong, ...extra].join(', ')}. Rode node scripts/agents-sync.mjs`,
      );
      process.exit(1);
    }
  } else {
    mkdirSync(TARGET, { recursive: true });
    for (const f of wrong) writeFileSync(join(TARGET, f), want[f]);
    for (const f of extra) rmSync(join(TARGET, f));
    if (wrong.length || extra.length)
      console.log(`.codex/agents: ${[...wrong, ...extra].join(', ')}`);
  }
}
