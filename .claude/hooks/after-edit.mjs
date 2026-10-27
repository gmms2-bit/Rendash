#!/usr/bin/env node
// Depois de cada Edit/Write: formata o arquivo com o Biome e devolve ao modelo só o erro que sobrar.
// Assim formatação e lint nunca dependem de alguém lembrar de rodar.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const { tool_input: tool, cwd } = JSON.parse(input || '{}');
const file = tool?.file_path;
if (!file || !existsSync(file) || !/\.(ts|tsx|js|mjs|cjs|json|jsonc|css)$/.test(file))
  process.exit(0);
if (/\/(node_modules|\.next[^/]*|dist)\//.test(file)) process.exit(0);

try {
  execFileSync(
    'pnpm',
    [
      'exec',
      'biome',
      'check',
      '--write',
      '--no-errors-on-unmatched',
      '--diagnostic-level=error',
      file,
    ],
    { cwd: cwd ?? process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  // Biome fora do ar (sem node_modules, por exemplo) não é problema do arquivo.
  if (!output.includes('━')) process.exit(0);
  console.error(`biome: erro em ${file}\n${output.slice(0, 3000)}`);
  process.exit(2);
}
