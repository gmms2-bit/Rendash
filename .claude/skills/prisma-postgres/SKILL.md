---
name: prisma-postgres
description: Modela e migra o banco do Rendash com Prisma + Postgres hospedado na Vercel (Neon). Use ao mudar schema.prisma, criar migração, consulta pesada, seed ou configurar conexão.
---

# Prisma + Postgres (packages/db)

Modelos e índices em `docs/DADOS.md`.

- Datasource com `url = env("POSTGRES_PRISMA_URL")` (pooling) e `directUrl = env("POSTGRES_URL_NON_POOLING")`. Confira os nomes que a integração Vercel Postgres/Neon realmente cria.
- Client singleton (`globalThis`) em `packages/db/src/client.ts`. Considere o driver adapter do Neon para serverless se a documentação atual do Prisma recomendar.
- Migração: `pnpm db:migrate` (gera). Nunca edite SQL gerado de migração já aplicada; destrutiva (drop coluna, mudar tipo, NOT NULL sem default) só em ramo com PR e plano de volta. Produção: `prisma migrate deploy` no pipeline, antes da versão nova; a versão antiga tem de aguentar o schema novo.
- Dinheiro: `BigInt` em centavos; converter para string na borda da API. Sem `Float`/`Decimal` solto.
- Tenant/dono: todo modelo de negócio com `userId` (e `organizationId`); crie helper de consulta que exige o filtro. Considere RLS no Postgres como defesa extra.
- Razão (`LedgerEntry`): só `create`, nunca `update/delete`; saldo e lançamento na mesma `$transaction` com trava (`SELECT … FOR UPDATE` via `$queryRaw` ou nível `Serializable`) e teste concorrente.
- Segredos/CPF: cifrar a nível de aplicação (AES-GCM, chave em env/KMS) antes de gravar.
- Consultas: índice para cada filtro novo, paginação por cursor, sem N+1 (`include` consciente).
- Seed: dados fictícios das telas (Guilherme Matias, Itaú/Nubank, Tesouro Selic 2029…) só em dev/preview.
- Banco de preview separado do de produção. Nunca rode `migrate reset`/`db push` em ambiente com dados reais.

Acione `revisor-backend`; esquema do banco também aciona revisão do Claude no PR.
