# Arquitetura — Rendash

## Monorepo (Turborepo + pnpm)

```
rendash/
├─ apps/
│  ├─ web/            Next.js (App Router): site, painel web e API (route handlers, serverless na Vercel)
│  └─ mobile/         Expo (React Native, Expo Router), Android e iOS, NativeWind
├─ packages/
│  ├─ db/             Prisma schema, migrações, client singleton, seed
│  ├─ core/           Regras de negócio puras: dinheiro, projeções, IR, carteira, razão, classificação
│  ├─ api-contract/   Schemas zod + tipos dos endpoints (compartilhados web/mobile/servidor)
│  ├─ ui-tokens/      Tokens de design (cores, raios, espaçamento, tipografia, motion) + preset Tailwind
│  ├─ ui-web/         Componentes React (Tailwind) estilo iOS/Liquid Glass
│  ├─ ui-native/      Componentes RN (NativeWind) com a mesma API
│  └─ config/         tsconfig, biome, tailwind preset
├─ docs/  .claude/  .codex/  scripts/  AGENTS.md  CLAUDE.md
├─ turbo.json  pnpm-workspace.yaml  package.json
```

Regra de dependência: `apps/*` → `ui-*`, `api-contract`, `core`, `db` (só web). `core` não importa framework. Mobile nunca importa `db`; fala só com a API HTTP. `api-contract` é a única fonte dos tipos entre cliente e servidor.

## Stack e decisões

| Camada | Escolha | Por quê |
|---|---|---|
| Monorepo | Turborepo + pnpm | pedido do dono; cache de build e `turbo run` por pacote |
| Web/API | Next.js App Router na Vercel | pedido; route handlers viram funções serverless; mesmo repositório do painel web |
| Mobile | Expo + Expo Router + EAS Build/Submit/Update | pedido; Android/iOS, OTA para JS |
| Estilo | Tailwind (web) + NativeWind (mobile) sobre tokens comuns | pedido; uma fonte de tokens |
| Banco | Postgres (Vercel Postgres/Neon) + Prisma | pedido; migrações geradas |
| Validação | zod em todas as bordas | invariante de segurança |
| Estado/dados mobile | TanStack Query + Zustand (UI local) | cache e revalidação de saldos |
| Gráficos | `react-native-skia` + `victory-native` (mobile), `recharts` ou SVG próprio (web) | linhas e barras das telas |
| Auth | e-mail+senha (argon2id) + sessão por token de acesso curto e refresh rotativo; biometria local via `expo-local-authentication` destrava o refresh guardado em `expo-secure-store` | telas 2, 3, 22 |
| Testes | Vitest (core, api), Playwright (web), Maestro (mobile E2E) | |
| Observabilidade | logs estruturados sem PII; Sentry opcional | invariante 4 |

Confirmar versões na hora (`npx expo install`, `pnpm view`): não fixe número deste documento.

## Camadas da API (apps/web/src)

`app/api/**/route.ts` (valida zod, autentica, checa dono) → `server/services/*` (orquestra, transação) → `packages/core` (regra pura) + `packages/db` (Prisma). Erros de domínio: `{ code, message }` com códigos estáveis (ex.: `INSUFFICIENT_FUNDS`, `OF_PROVIDER_TIMEOUT`= OF-408). Paginação por cursor. Valores monetários na API como string de centavos (`"350000"`), moeda sempre BRL.

## Vercel serverless

- Funções stateless; conexão com pooling (`POSTGRES_PRISMA_URL`), `PrismaClient` singleton; `DIRECT_URL` só para migração.
- Tarefas longas (sincronizar banco, importar 2.847 transações): **Vercel Cron + fila** (Upstash QStash ou Vercel Queues); a API devolve `syncId` e o app consulta progresso (tela 26). Nunca segure a requisição.
- Webhooks do provedor Open Finance: verificar assinatura, idempotência por `eventId`.
- Preview por PR, produção só pela `main`. Banco de preview separado (branch do Neon).

## Mobile (Expo)

Expo Router com grupos `(auth)`, `(onboarding)`, `(tabs)` [Início, Carteira, Rendimentos, Mercado, Perfil], e pilhas por módulo. Bottom tab flutuante em vidro (ver `DESIGN.md`). Deep links `rendash://`. Biometria, `expo-secure-store`, `expo-blur`, `expo-haptics`, notificações push via Expo Notifications. Dev client (EAS) porque há módulos nativos (Skia, blur). Perfis EAS: `development`, `preview`, `production`.

## Segurança

Ver invariantes. Além: TLS only, CSP no web, rate limit (Upstash) em login/OTP/investir, OTP SMS com 6 dígitos e expiração 5 min, bloqueio progressivo, consentimento Open Finance com validade (12 meses) e revogação, trilha de auditoria (`AuditLog`) para toda operação sensível, mascaramento de CPF/PAN, exclusão/exportação de dados (LGPD).

## Sequência de construção sugerida

1. Scaffold monorepo + CI + `ui-tokens` · 2. `packages/db` + auth · 3. Design system (componentes da Fase 1 em `DESIGN.md`) · 4. Onboarding/Auth (telas 1–6) · 5. Início/Carteira/Rendimentos (7–13) · 6. Investir/Resgatar (14–16) · 7. Mercado/Metas/Extrato/Notificações/Perfil (17–22) · 8. Open Finance (23–31) · 9. Extrato unificado, Pix, categorias (34–38) · 10. Empresa (32–33) · 11. Cartão (39–46).
