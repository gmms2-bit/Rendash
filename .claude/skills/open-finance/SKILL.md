---
name: open-finance
description: Implementa conexão de bancos via Open Finance, consentimento, sincronização, extrato unificado, Pix e classificação. Use em bancos/contas, permissões, sync, transações e categorias.
---

# Open Finance e extrato unificado

Telas 23–31 e 34–38 em `docs/TELAS.md`; modelos em `docs/DADOS.md`.

- **Provedor atrás de interface** (`OpenFinanceProvider` em `packages/core/providers`): implementações `simulated` (padrão em dev/teste, usa fixtures das telas) e a real (Pluggy/Belvo/outro; a escolha é decisão do dono, ver `STATUS.md`). Confira a API do provedor na documentação oficial na hora.
- **Consentimento:** somente leitura, escopos = os 4 toggles da tela 25, validade 12 meses (renovação avisada por notificação), revogável a qualquer momento (`Connection.status=REVOKED`, apaga token). Nunca opere (mover dinheiro) via Open Finance.
- **Token do banco:** cifrado no banco, fora de log/resposta.
- **Sync assíncrono:** `POST /connections` cria `SyncJob`; trabalho por cron/fila; app consulta `GET /syncs/:id` (progresso, passo, contagem). Etapas: autorização → contas → transações (12 meses) → cartões/investimentos. Idempotente (`externalId` único por conta); reexecutar é seguro. Re-sync automático a cada 6 h.
- **Erros:** mapear falhas do provedor para códigos estáveis (`OF-408` timeout, etc.); a tela mostra mensagem curta e "Tentar novamente"; nenhuma permissão muda em erro.
- **Webhooks:** verificar assinatura, idempotência por `eventId`.
- **Classificação:** `CategoryRule` automática por contato/texto; "94% classificadas" = `classificadas/total`; regra criada na tela 36 vale para os próximos.
- **Privacidade:** CPF de terceiros mascarado (`•••.312.780-••`); LGPD (exportar/excluir).
- **Pix:** v1 mostra comprovante (leitura); enviar Pix está fora do escopo.

Acione `auditor-seguranca` e `revisor-backend`.
