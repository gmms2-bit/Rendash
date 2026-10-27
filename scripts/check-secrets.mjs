#!/usr/bin/env node
// Barra o commit de segredo: chave privada, certificado e arquivo de variáveis com valor sem cifrar.
// Recebe os arquivos preparados para o commit (lefthook) ou, sem argumentos, confere os versionados.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';

const files =
  process.argv.length > 2
    ? process.argv.slice(2)
    : execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);

/** Arquivos de variáveis que podem entrar em texto puro: modelo e dados fictícios. */
const PLAIN_OK = new Set(['.env.example', '.env.development']);
const FORBIDDEN = /(^|\/)(\.env\.keys|\.env|\.env\.local|\.env\..+\.local)$|\.(p12|pem|key)$/;
const PRIVATE_KEY =
  /-----BEGIN [A-Z ]*PRIVATE KEY-----|DOTENV_PRIVATE_KEY[A-Z_]*\s*=\s*"?[0-9a-f]{32,}/;

const problems = [];
for (const file of files) {
  // Link para pasta (como `.agents/skills`) não tem conteúdo próprio.
  if (!existsSync(file) || !statSync(file).isFile()) continue;
  const name = basename(file);
  if (FORBIDDEN.test(file)) {
    problems.push(`${file}: este arquivo nunca entra no git`);
    continue;
  }
  if (/\.(png|jpg|jpeg|webp|gif|ico|woff2?|ttf|otf|pdf|zip)$/i.test(name)) continue;
  const text = readFileSync(file, 'utf8');
  if (name !== 'check-secrets.mjs' && PRIVATE_KEY.test(text)) {
    problems.push(`${file}: contém uma chave privada`);
  }
  if (/^\.env\./.test(name) && !PLAIN_OK.has(name)) {
    const plain = text
      .split('\n')
      .map((line) => /^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/.exec(line))
      .filter(
        (match) =>
          match &&
          match[2] !== '' &&
          !match[1].startsWith('DOTENV_PUBLIC_KEY') &&
          !match[2].startsWith('encrypted:'),
      )
      .map((match) => match[1]);
    if (plain.length > 0)
      problems.push(`${file}: sem cifrar: ${plain.join(', ')} (use o gerenciador de segredos do projeto)`);
  }
}

if (problems.length > 0) {
  console.error(`segredo no commit:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
