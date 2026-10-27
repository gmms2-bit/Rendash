# Dados e contratos — Rendash

## Dados atuais: 100% mockados

Decisão do dono em 27/10/2026: `packages/fixtures` será a fonte de dados tipados para web e mobile. Esta seção define o contrato a construir; a existência de código e a validação ficam em `STATUS.md`.

- Fixtures determinísticas por módulo: usuário fictício, patrimônio, ativos, rendimentos, metas, bancos/contas, extrato/Pix, categorias, empresa, notificações e cartão/fatura.
- Tipos de domínio compartilhados com `packages/core`; nenhuma dependência de React, Prisma, Postgres, rede ou credencial.
- Dinheiro como centavos inteiros (`bigint` ou `number` validado com `Number.isSafeInteger`); nunca valor decimal em reais. Strings de centavos no futuro transporte JSON. Formatação BRL apenas na apresentação.
- Datas ISO UTC e relógio de referência fixo para cenários reproduzíveis; apresentação em `America/Sao_Paulo`.
- Dados de negócio carregam `userId`, contexto `PERSONAL`/`BUSINESS` e `organizationId` quando empresarial; seletores do core filtram por esse escopo.
- Apenas nomes fictícios e CPF/PAN mascarados. Não criar senhas, tokens bancários, CVV ou autenticação real.
- Cada fluxo oferece cenários de carregamento, vazio, erro recuperável e sucesso. Variantes das páginas 15, 27–30, 37, 42–46 continuam cobertas.
- Mutações são locais e reiniciáveis. O core valida intenção, saldo/limites e chave idempotente, devolvendo novo estado e lançamentos imutáveis simulados. Nenhuma operação movimenta dinheiro ou conecta instituições.
- Projeções e impostos exibidos são exemplos fictícios identificados; não representam cotação atual nem aconselhamento financeiro.

## Persistência futura (não implementada)

Não criar `packages/db`, schema Prisma, migrações, seed ou conexões nesta fase. O inventário abaixo preserva o alvo futuro: valores `BigInt`/`Int`, isolamento por dono/contexto e razão transacional imutável. Campos como hashes e tokens cifrados pertencem exclusivamente ao backend futuro e não entram nas fixtures.

### Modelos futuros (referência, sem schema implementado)

| Modelo | Campos principais | Telas |
|---|---|---|
| `User` | id, name, email(unique), cpfEnc, cpfLast3, phone, passwordHash, status, investorProfile(CONSERVATIVE/MODERATE/AGGRESSIVE), plan(`PRIME`…), createdAt | 2–6, 21 |
| `Session`/`Device` | userId, refreshHash, deviceName, platform, biometricEnabled, lastSeenAt, revokedAt | 3, 22 |
| `OtpChallenge` | userId?, phone, codeHash, expiresAt, attempts | 5 |
| `Organization` / `Membership` | legalName, cnpj, role(OWNER/PARTNER/…) | 32 |
| `Account` | userId/orgId, institutionId, type(CHECKING/SAVINGS/PAYMENT), mask, balanceCents, externalId, syncedAt | 23, 31 |
| `Institution` | code, name, kind, logoKey, isPopular | 24 |
| `Connection` | userId, institutionId, status(PENDING/ACTIVE/ERROR/REVOKED), consentId, scopes[], expiresAt, tokenEnc, lastSyncAt | 25–30 |
| `SyncJob` | connectionId, status, progress, step, error code (ex. `OF-408`), counts | 26–27 |
| `Transaction` | accountId, amountCents(±), direction, postedAt, description, counterparty, categoryId, source(PIX/CARD/…), externalId(unique por conta) | 19, 34, 35 |
| `PixDetail` | transactionId, e2eId, payerName, payerBank, message | 35 |
| `Category` / `CategoryRule` | name, kind(EXPENSE/INCOME), parentId, budgetCents; rule: match(contact/text), categoryId, auto | 36, 38 |
| `Contact` | name, cpfMasked, label | 35, 36 |
| `Asset` | kind(FIXED_INCOME/STOCK/FUND/CRYPTO/FII), ticker, name, indexer(CDI/SELIC/IPCA), ratePct, maturity, liquidity(D0/D1), minAmountCents | 8, 11, 17 |
| `Position` | userId, assetId, investedCents, currentCents, quantity | 8, 11 |
| `Order` | userId, assetId, type(INVEST/REDEEM), grossCents, taxCents, netCents, status, settlesAt, idempotencyKey(unique) | 14–16 |
| `LedgerEntry` | userId, accountId, orderId?, amountCents, balanceAfter, reason, createdAt (imutável) | todas de dinheiro |
| `Quote` / `PriceSeries` | ticker, price, changePct, at; séries diárias | 11, 12, 17 |
| `Goal` | userId, name, targetCents, savedCents, dueDate, hint | 18 |
| `Notification` | userId, kind(EARNING/ALERT/GOAL/DIVIDEND/SECURITY), title, body, readAt | 20 |
| `Setting` | userId, hideBalance, alertEarnings, alertMarket, biometricConfirmThresholdCents (padrão 100000) | 22 |
| `Card` | userId, last4, brand, tier, status(ACTIVE/BLOCKED), limitCents, panTokenRef (nunca o PAN) | 39–46 |
| `Invoice` / `CardPurchase` | cardId, month, closesAt, dueAt, totalCents, status(OPEN/CLOSED/PAID); purchase: merchant, cents, installments, category, holder, virtual, status | 40–45 |
| `CardControls` | contactless, contactlessLimitCents, international, onlineProtection | 41, 46 |
| `AuditLog` | userId, action, ip, deviceId, meta (sem PII) | sensíveis |

Índices: `(userId, postedAt desc)` em `Transaction`; `(accountId, externalId)` unique; `(userId, idempotencyKey)` unique em `Order`.

## Contratos de API futuros (não implementados)

Alvo: prefixo `/api/v1`, JSON, auth Bearer, zod em `packages/api-contract`. Não criar route handlers nem fazer requisições HTTP para simular esses contratos; web e mobile usam fixtures/core diretamente.

Auth: `POST /auth/register/start|complete`, `/auth/otp/send|verify`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/recover`, `/auth/reset`. Perfil/config: `GET /me`, `GET|PATCH /settings`, `GET|DELETE /devices`. Início/carteira: `GET /home`, `/portfolio`, `/earnings`, `/assets/:id`, `/assets/:id/series`. Mercado: `/market/overview`, `/market/search`. Ordens: `POST /investments`, `POST /redemptions` (header `Idempotency-Key` obrigatório; resposta com `orderId`, `status`, `settlesAt`). Metas: `/goals`. Extrato: `/statement`, `/transactions`, `/transactions/:id`, `PATCH /transactions/:id`, `/categories/summary`. Notificações: `/notifications`. Open Finance: `/institutions`, `/connections`, `/connections/:id/consent-url`, `/syncs/:id`, `/syncs/:id/retry`, `/accounts`, webhook `POST /webhooks/open-finance`. Empresa: `/orgs/:id/overview|cashflow`. Cartão: `/card`, `/card/invoices/:id`, `/card/invoices/:id/pay`, `/card/purchases/:id`, `PATCH /card/controls`, `POST /card/block|unblock`, `POST /card/virtual/reveal` (biometria + token de curta duração).

Erros: `{ "error": { "code": "INSUFFICIENT_FUNDS", "message": "..." } }`; HTTP 4xx de domínio com código estável; 5xx nunca vaza detalhe.

## Provedores externos futuros (não implementados)

`OpenFinanceProvider` (Pluggy/Belvo/outro), `MarketDataProvider` (brapi/B3/CoinGecko), `BankingProvider` (BaaS para conta/cartão/Pix), `SmsProvider` (Twilio/Zenvia), `EmailProvider` (Resend). Integração adiada; o mockup usa exclusivamente fixtures locais.
