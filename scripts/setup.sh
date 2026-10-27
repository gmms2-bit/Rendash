#!/usr/bin/env bash
# Cria o link que o Codex usa para ler as mesmas skills do Claude.
set -e
cd "$(dirname "$0")/.."
mkdir -p .agents
ln -sfn ../.claude/skills .agents/skills
echo "ok: .agents/skills -> .claude/skills"
