# STATUS — Rendash

Atualizado em 27/10/2026. Fase: **documentação e base de agentes concluídas; nenhum código de app existe ainda.**

## Existe (conferido nos arquivos)

- Kit de agentes adaptado: `AGENTS.md` global, `CLAUDE.md`, `SECURITY.md`, `.claude/` (settings, hooks, 8 agentes, skills), `.codex/` (config, regras, agentes gerados), lefthook, workflows de PR, `scripts/`.
- Skills do projeto: `monorepo-turbo`, `design-system-ios`, `telas-rendash`, `expo-mobile`, `nextjs-api`, `prisma-postgres`, `dinheiro-brl`, `open-finance` (+ `rota`, `auditoria` do kit).
- Documentação: `SPEC`, `ARQUITETURA`, `TELAS` (46 páginas), `DESIGN`, `DADOS`; imagens de referência em `docs/telas/ref/`.

## Falta (próximos passos, na ordem de `ARQUITETURA.md`)

1. Criar o repositório no GitHub (ex.: `rendash`), copiar esta pasta, `bash scripts/setup.sh`, criar branch `dev`.
2. Scaffold do monorepo (skill `monorepo-turbo`), CI, `ui-tokens`.
3. `packages/db` + auth; design system fase 1–4; telas por módulo.
4. Trocar `MODELO_CODEX`/`MODELO_CODEX_LEVE` em `scripts/agents-sync.mjs` e `modeloCodex` em `~/.config/rota.json` pelos modelos da conta Codex; rodar `node scripts/agents-sync.mjs`.
5. Ligar o app do Codex no repositório e criar o segredo `CLAUDE_CODE_OAUTH_TOKEN`.

## Perguntas em aberto (decisão provisória entre parênteses)

- Provedor de Open Finance (simulado até decidir).
- Provedor de cotações e de SMS/e-mail (simulados).
- Conta e cartão Rendash: parceiro BaaS real ou apenas simulação na v1 (simulação).
- Etapa 3 do cadastro, ausente no PDF (criar senha + biometria).
- Enviar Pix: fora da v1 (só comprovante).
- Nome do repositório e da organização Vercel/Expo.
