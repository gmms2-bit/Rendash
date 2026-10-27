@AGENTS.md

## Só no Claude Code

- Os ganchos de `.claude/settings.json` formatam cada arquivo editado (devolvem só o erro que
  sobrar) e mostram, no começo da sessão, ramo, CI vermelho e PRs abertos.
- Os revisores da tabela do `AGENTS.md` estão em `.claude/agents/` e são chamados pelo nome.
- Regras novas vão no `AGENTS.md`, que o Codex também lê. Aqui fica só o que o Codex não tem.

## Delegar ao Codex

O plugin `codex` (openai/codex-plugin-cc) chama o Codex logado na máquina; o uso sai da cota do
ChatGPT, não da do Claude. Só funciona em sessão na máquina com o Codex; uma sessão na nuvem pede a
uma sessão local.

- **Vai para o Codex:** revisão antes de abrir PR (`/codex:review`; em dinheiro e segurança,
  `/codex:adversarial-review`), testes, refatoração mecânica, bug com reprodução e auditoria longa
  (`/codex:rescue --background`, depois `/codex:status` e `/codex:result`). Esforço `--effort low`
  no mecânico, `medium` no resto, `high` só em auditoria.
- **Fica com o Claude:** coordenar o trabalho, UI/UX, decisão de arquitetura e conduzir o PR.
  Confira no código o que o Codex devolver antes de aceitar.
- Não ligue o review gate (`/codex:setup --enable-review-gate`): o vai e volta esgota a cota.
- Mais de uma conta do Codex: use um script de troca por limite (opcional, fora do repo).
