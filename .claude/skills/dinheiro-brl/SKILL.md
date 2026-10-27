---
name: dinheiro-brl
description: Regras para valores em reais, investir, resgatar, imposto, projeção, fatura, limite e razão no Rendash. Use em qualquer código que calcule, mova ou exiba dinheiro.
---

# Dinheiro (BRL)

1. **Centavos inteiros** em todo lugar (`BigInt` no banco e no `core`, string na API). Proibido `number` com decimais e `float`. Formatar só na borda de exibição com `packages/core/money` (`formatBRL`, `parseBRL`, partes inteira/decimal para o estilo de `AmountText`).
2. **O servidor decide.** Cliente envia intenção (`assetId`, `amountCents`, `Idempotency-Key`); o servidor revalida saldo, mínimo (R$ 100), máximo (saldo), disponibilidade (D+0/D+1), horário de corte ("Hoje, até 17h"), limite do cartão e calcula IR/projeção.
3. **Transação única:** ler saldo com trava → validar → criar `Order` → criar `LedgerEntry` (imutável) → atualizar `Position`/saldo. Chamada a provedor fora da transação; estado gravado antes (`PENDING`), conciliado depois; falha após débito gera estorno com lançamento.
4. **Idempotência:** `(userId, idempotencyKey)` único; repetir devolve o resultado anterior, nunca duplica.
5. **Sensível:** valor acima do limiar do usuário (padrão R$ 1.000) exige confirmação biométrica no app e prova (token curto) validada no servidor.
6. **IR de renda fixa** (tabela regressiva por prazo, IOF até 30 dias) e projeção ficam em `packages/core`, com testes por faixa; estimativa sempre acompanhada do aviso "Rentabilidade passada não garante resultados futuros". Confira a regra tributária vigente em fonte oficial antes de implementar; não invente alíquotas.
7. **Texto honesto:** "Confirmado/Pago" só depois do servidor confirmar; antes use "Em processo".
8. **Testes obrigatórios:** concorrência (duas ordens ao mesmo tempo sem saldo para ambas), repetição (mesma chave), arredondamento, limites, estorno.

Acione `auditor-dinheiro` em toda mudança aqui.
