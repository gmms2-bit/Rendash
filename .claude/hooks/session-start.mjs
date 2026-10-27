#!/usr/bin/env node
// No começo da sessão: o estado que o modelo teria de descobrir com meia dúzia de comandos.
// AJUSTE: acrescente a linha de "comandos" do seu projeto.
import { execFileSync } from 'node:child_process';

const run = (command, args) => {
  try {
    return execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
};
const changed = run('git', ['status', '--short']).split('\n').filter(Boolean).length;
const failed = run('gh', [
  'run', 'list', '--status', 'failure', '--limit', '3',
  '--json', 'workflowName,headBranch', '-q', '.[] | "\\(.workflowName) em \\(.headBranch)"',
])
  .split('\n')
  .filter(Boolean);
const open = run('gh', ['pr', 'list', '--json', 'number,title', '-q', '.[] | "#\\(.number) \\(.title)"'])
  .split('\n')
  .filter(Boolean);
const lines = [
  `ramo: ${run('git', ['branch', '--show-current'])} (${changed} arquivos alterados)`,
  failed.length > 0 ? `CI vermelho: ${failed.join('; ')}` : '',
  open.length > 0 ? `PRs abertos: ${open.join('; ')}` : '',
  'comandos: pnpm dev (web+api) · pnpm dev:mobile (Expo) · pnpm check · pnpm db:migrate',
];
console.log(lines.filter(Boolean).join('\n'));
