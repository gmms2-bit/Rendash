---
name: telas-rendash
description: Implementa ou altera uma das 46 telas do PDF do Rendash seguindo o catálogo. Use ao construir qualquer tela, fluxo ou estado visual.
---

# Telas do Rendash

1. Abra `docs/TELAS.md`, ache a tela (página do PDF) e abra a imagem `docs/telas/ref/tela-NN.png`. Em dúvida visual, a imagem vence.
2. Confirme que os componentes de `docs/DESIGN.md` que a tela usa já existem; se não, crie-os primeiro (skill `design-system-ios`).
3. Contrato: endpoint e schema zod em `packages/api-contract` antes da tela; regra de negócio em `packages/core`; a tela só formata e dispara ações.
4. Implemente os estados: carregando (skeleton), vazio, erro (com "Tentar novamente"), sucesso, e as variantes listadas (ex.: pág 15 é estado da 14; 27/30 são estados do fluxo Open Finance).
5. Texto em pt-BR, curto; nunca afirme o que o servidor não confirmou (ex.: "Pago" só após resposta). Dados do PDF são fictícios: use fixtures em `packages/db/seed` e MSW/mocks nos testes.
6. Ações sensíveis: biometria + revalidação no servidor (ver `dinheiro-brl`).
7. Teste: componente (valores e estados) e E2E do fluxo (Maestro no mobile, Playwright no web). A mensagem inteira que o usuário vê é conferida.
8. Marque a tela em `docs/STATUS.md` só depois de conferir no código e rodar `pnpm check`.

Telas de especificação (págs 10, 13, 45) são placas de componentes, não rotas.
