---
name: auditoria
description: Auditoria completa com um agente por área em paralelo. Use quando pedirem auditoria completa, revisão geral ou "revise tudo que mudou desde X".
---

# Auditoria

O escopo é um diff (`git diff <base>...HEAD`, padrão: desde a última promoção para a `main`) ou uma
área que o pedido nomeia. Confirme o escopo com `git log --oneline` antes de abrir os agentes.

Abra um subagente por área que o escopo toca, todos ao mesmo tempo, cada um com o escopo e os
caminhos dele. No Claude são os de `.claude/agents/`; no Codex, os de `.codex/agents/` (mesmo nome
com `_`). A tabela "Agentes revisores" do `AGENTS.md` diz qual agente cobre cada área.

Auditoria completa sem diff: todos, um por área, cada um varrendo a pasta dele.

Quando todos voltarem, confira a evidência de cada achado no código antes de aceitá-lo (o agente
pode ter seguido o caminho errado), junte os repetidos e entregue uma lista única por gravidade:
quebra ou vaza em produção, risco com condição, melhoria. Cada item com `arquivo:linha`, o agente
que achou e a correção em uma frase. Não corrija nada durante a auditoria; a correção é outra
tarefa, depois do dono ver a lista.
