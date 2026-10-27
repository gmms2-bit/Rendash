# Dados e contratos — Rendash

Valores em centavos (`BigInt` no Prisma; string na API). Datas ISO UTC; exibir em `America/Sao_Paulo`. Tabelas com `userId` (e `organizationId` quando PJ). Toda mudança de saldo gera `LedgerEntry` imutável na mesma transação. Migrações sempre geradas (`prisma migrate dev`).

## Modelos (rascunho do `schema.prisma`)

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

## Endpoints (prefixo `/api/v1`, JSON, auth Bearer, zod em `packages/api-contract`)

Auth: `POST /auth/register/start|complete`, `/auth/otp/send|verify`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/recover`, `/auth/reset`. Perfil/config: `GET /me`, `GET|PATCH /settings`, `GET|DELETE /devices`. Início/carteira: `GET /home`, `/portfolio`, `/earnings`, `/assets/:id`, `/assets/:id/series`. Mercado: `/market/overview`, `/market/search`. Ordens: `POST /investments`, `POST /redemptions` (header `Idempotency-Key` obrigatório; resposta com `orderId`, `status`, `settlesAt`). Metas: `/goals`. Extrato: `/statement`, `/transactions`, `/transactions/:id`, `PATCH /transactions/:id`, `/categories/summary`. Notificações: `/notifications`. Open Finance: `/institutions`, `/connections`, `/connections/:id/consent-url`, `/syncs/:id`, `/syncs/:id/retry`, `/accounts`, webhook `POST /webhooks/open-finance`. Empresa: `/orgs/:id/overview|cashflow`. Cartão: `/card`, `/card/invoices/:id`, `/card/invoices/:id/pay`, `/card/purchases/:id`, `PATCH /card/controls`, `POST /card/block|unblock`, `POST /card/virtual/reveal` (biometria + token de curta duração).

Erros: `{ "error": { "code": "INSUFFICIENT_FUNDS", "message": "..." } }`; HTTP 4xx de domínio com código estável; 5xx nunca vaza detalhe.

## Provedores externos (adaptadores em `packages/core/providers`, com versão simulada para dev/testes)

`OpenFinanceProvider` (Pluggy/Belvo/outro), `MarketDataProvider` (brapi/B3/CoinGecko), `BankingProvider` (BaaS para conta/cartão/Pix), `SmsProvider` (Twilio/Zenvia), `EmailProvider` (Resend). Escolha final em aberto (`STATUS.md`).
