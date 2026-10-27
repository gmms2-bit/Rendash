# STATUS — Rendash

Atualizado em 27/10/2026. Fase: **mockup front-end animado com dados 100% fictícios; nenhum código de app existe ainda.**

## Existe (conferido nos arquivos)

- Kit de agentes: AGENTS, CLAUDE, SECURITY, skills, revisores, hooks, workflows e scripts.
- Documentos SPEC, ARQUITETURA, TELAS (46 páginas), DESIGN, DADOS e referências em `docs/telas/ref/`.
- Etapa (a): AGENTS, ARQUITETURA e DADOS descrevem fixtures tipadas, regras simuladas no core e contratos/backend exclusivamente futuros. Não há Prisma, Postgres ou API implementados.
- Worktree na branch `feat/mockup-frontend`.

## Falta (etapas do brief)

1. (b) Scaffold Turborepo: Next.js web, Expo mobile, ui-tokens, core e fixtures.
2. (c) Design system compartilhando tokens, componentes e motion acessível.
3. (d) Web: todas as 46 páginas/variantes, fluxos completos com estado local e experiências adicionais.
4. (e) Mobile: mesma cobertura em iOS/Android, gestos, haptics e redução de movimento.
5. (f) Testes de core e interfaces, `pnpm check`, comparação visual e revisões. Nenhuma tela foi validada rodando.
6. Commits por etapa, envio único e PR com base `dev`. Sem deploy e sem esperar CI.

## Limitações verificadas nesta sessão

- `scripts/rota.mjs` roda, mas não encontra `~/.local/share/rota-uso/uso.json`: recomenda esperar com reset desconhecido e modelo placeholder `MODELO_CODEX`. Nenhuma cota real foi confirmada. O dono pediu explicitamente retomar e executar a etapa (a).
- Mobbin foi consultado: o MCP recusou a pesquisa por exigir plano pago. Refero não está exposto nas ferramentas desta sessão. Referências externas pendentes; nenhum token foi lido ou gravado.
- Escrita dos quatro documentos e `git diff --check` funcionaram. O commit falhou ao criar `/home/guicker/projects/Rendash/.git/worktrees/Rendash-mockup/index.lock`: metadados do worktree fora das raízes com escrita. Nenhum commit ou PR foi criado.
- Roteamento da etapa (b), scaffold: executor Claude/Sonnet, sem espera. Não há executor Claude disponível nesta sessão; scaffold não iniciado.
- O registro de andamento pelo `work_state_write` foi rejeitado por exigir aprovação numa sessão com política `never`.

## Perguntas em aberto

- Etapa 3 do cadastro, ausente no PDF: manter proposta de senha + biometria simuladas.
- Definir quais fluxos extras entram além da cobertura das 46 páginas; priorizar navegação e ações já previstas no catálogo.
- Organizações/projetos Vercel e Expo ficam para a publicação futura. Provedores reais e persistência ficam adiados; não bloqueiam o mockup.
