---
name: monorepo-turbo
description: Cria e mantém o monorepo Turborepo + pnpm do Rendash (apps/web, apps/mobile, packages/*), pipelines, CI e deploy Vercel. Use ao criar pacote, mexer em turbo.json, workspaces, vercel.json ou CI.
---

# Monorepo (Turborepo + pnpm)

Leia `docs/ARQUITETURA.md` (estrutura e regra de dependência) antes.

## Criar o scaffold (primeira vez)

1. `pnpm dlx create-turbo@latest` (ou crie à mão) e ajuste para a árvore da ARQUITETURA. Confira a versão atual na documentação (turbo.build).
2. `pnpm-workspace.yaml`: `apps/*`, `packages/*`. `.npmrc` com `node-linker=hoisted` **só no mobile se o Metro exigir** (Expo SDK recente já suporta monorepo; confira em docs.expo.dev/guides/monorepos).
3. Pacotes internos com nome `@rendash/<nome>`, `"exports"` apontando para `src` (TS direto) e `transpilePackages` no Next; no Metro, `watchFolders` + `nodeModulesPaths`.
4. Scripts raiz: `dev`, `dev:mobile`, `build`, `lint`, `typecheck`, `test`, `check` (= lint+typecheck+test), `db:migrate`, `db:generate`, `prepare` (`lefthook install`).
5. `turbo.json`: tarefas `build` (dependsOn `^build`, outputs `.next/**`), `lint`, `typecheck`, `test`; `dev` persistente sem cache; declare `env`/`globalEnv` para as variáveis usadas (senão o cache engana).
6. Biome para lint/format (o `lefthook.yml` e o hook já usam). tsconfig base em `packages/config`.
7. Vercel: projeto aponta para `apps/web`, "Root Directory" `apps/web`, build com `turbo`; variáveis no painel. Ignorar build quando só `apps/mobile` muda (`ignoreCommand` com `turbo-ignore`).
8. CI (GitHub Actions): `pnpm install --frozen-lockfile`, `pnpm check`, cache do Turbo. Permissões mínimas por job.

## Regras

- Dependência só na direção da ARQUITETURA; `core` sem framework; mobile nunca importa `db`.
- Versão de dependência nova: `pnpm add` + lockfile versionado; Expo: `npx expo install`.
- Mexeu em CI/Vercel/EAS: acione `auditor-infra`.
