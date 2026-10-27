---
name: rota
description: Escolhe executor (Claude ou Codex), modelo e esforço de cada tarefa conforme a cota restante. Use antes de começar qualquer tarefa e no meio de tarefas longas.
---

# Rota

`node scripts/rota.mjs "<descrição da tarefa>"` lê o uso (`~/.local/share/rota-uso/uso.json`),
calcula o orçamento do dia (cota semanal restante ÷ dias até o reset, com folga de 15%) e devolve
executor, modelo, esforço, conta do Codex e se deve esperar o reset.

## Quando rodar

- **Antes de começar** toda tarefa, na primeira ação, com a descrição do pedido.
- **No meio** de tarefa longa (mais de ~1h), com `--meio`.
- Quando a tarefa mudar de natureza (de leitura para dinheiro, por exemplo): rode de novo.

## Como usar a resposta

1. **Executor Codex**: repasse ao Codex (`codex exec` ou `/codex:rescue`) com o modelo e o esforço
   indicados; não faça você mesmo.
2. **Executor Claude**: use o modelo indicado; não suba de modelo por conta própria.
3. **Esperar = sim**: não comece nem gaste cota; agende a volta para o horário do reset e diga isso
   ao dono em uma linha.
4. Se a classificação automática errar, force com `--dinheiro`, `--seguranca`, `--producao`, `--ui`,
   `--arquitetura`, `--mecanica` e `--tamanho p|m|g`.
5. **Revisão do Claude: sim**: depois que o Codex entregar, rode o revisor indicado antes de
   mesclar.

## Regras fixas (o script já aplica; não contorne)

- Codex primeiro: quanto maior o gasto do Claude no dia ou na semana, mais o Codex assume.
- Dinheiro e segurança: o Codex implementa, a revisão do Claude é obrigatória.
- Produção (deploy, servidor, banco, `main`) nunca vai ao Codex.
- Opus só em arquitetura difícil e auditoria, com a semana folgada; Haiku só em tarefa pequena.

## Dados de uso

O script precisa de um `uso.json` (formato em `scripts/rota.mjs`, funções `rotear` e `executar`:
`claude.{pctSemana,pct5h,reset5h,resetSemana}` e `codex[]` com `{conta,pct5h,pctSemana,reset5h,
resetSemana,bloqueada}`), mantido por um coletor seu, fora do repo. Sem o arquivo, o script avisa e
estima sem histórico. Config opcional em `~/.config/rota.json`: `capSemanaUsd`, `cap5hUsd`,
`resetSemanaClaude`, `modeloCodex`.
