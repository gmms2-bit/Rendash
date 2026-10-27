---
name: nextjs-api
description: Escreve rotas de API e telas web em Next.js (App Router) na Vercel serverless, com zod, auth e erros de domínio. Use ao criar ou alterar apps/web, rota /api, serviço ou middleware.
---

# Next.js + API serverless (apps/web)

Camadas e erros: `docs/ARQUITETURA.md`; endpoints: `docs/DADOS.md`.

1. `route.ts`: parse com zod de `packages/api-contract` → autentica → checa dono/permissão → chama `server/services/*` → devolve `{data}` ou `{error:{code,message}}`.
2. Serviço orquestra e abre transação Prisma; regra pura vem de `packages/core`. Sem regra em `route.ts` nem em componente.
3. Serverless: sem estado em memória entre requisições; `PrismaClient` singleton; sem chamada externa dentro de transação longa; timeout da função respeitado (tarefa longa → cron/fila).
4. Rate limit (Upstash) em login, OTP, investir, resgatar, pagar fatura. Idempotência por `Idempotency-Key` guardada com o resultado.
5. Cookies/headers: CSP, `frame-ancestors`, HSTS; CORS só para as origens do app.
6. Logs estruturados sem PII; nunca logue corpo de requisição financeira.
7. Teste: Vitest na rota/serviço com banco de teste; concorrência em dinheiro.
8. Conferir na documentação oficial (nextjs.org, vercel.com/docs) o que for específico de versão (runtime, `maxDuration`, cron).

Acione `revisor-backend`; auth/segredo → `auditor-seguranca`; dinheiro → `auditor-dinheiro`.
