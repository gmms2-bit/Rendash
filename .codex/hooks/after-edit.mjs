#!/usr/bin/env node
// Depois de cada apply_patch do Codex: formata os arquivos tocados com o Biome e devolve só o erro
// que sobrar. Equivale a `.claude/hooks/after-edit.mjs` (o Claude edita com Edit/Write; o Codex,
// com apply_patch, cujo texto traz "*** Update File: <caminho>" por arquivo).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const { tool_input: tool, cwd } = JSON.parse(input || '{}');
const base = cwd ?? process.cwd();

// O texto do patch pode vir em qualquer campo de string de `tool_input`.
const text = typeof tool === 'string' ? tool : Object.values(tool ?? {}).filter((v) => typeof v === 'string').join('\n');
const files = [...text.matchAll(/^\*\*\* (?:Add|Update) File: (.+)(?:\r?\n\*\*\* Move to: (.+))?$/gm)]
  .map((m) => resolve(base, (m[2] ?? m[1]).trim()))
  .filter((f) => existsSync(f) && /\.(ts|tsx|js|mjs|cjs|json|jsonc|css)$/.test(f))
  .filter((f) => !/\/(node_modules|\.next[^/]*|dist)\//.test(f));
if (files.length === 0) process.exit(0);

try {
  execFileSync(
    'pnpm',
    ['exec', 'biome', 'check', '--write', '--no-errors-on-unmatched', '--diagnostic-level=error', ...files],
    { cwd: base, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  // Biome fora do ar (sem node_modules, por exemplo) não é problema do arquivo.
  if (!output.includes('━')) process.exit(0);
  console.error(`biome: erro em ${files.join(', ')}\n${output.slice(0, 3000)}`);
  process.exit(2);
}
