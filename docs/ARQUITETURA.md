# Arquitetura — Rendash

## Fase atual: mockup front-end animado

Decisão do dono em 27/10/2026: todos os dados são fictícios e locais. Construir web e mobile com fluxos interativos, cobrindo as 46 páginas/variantes do PDF e experiências adicionais. As seções abaixo definem o alvo de implementação; `STATUS.md` registra o que existe e foi executado.

Não implementar Prisma, Postgres, API real, autenticação real, provedores financeiros, SMS, e-mail ou push nesta fase. Os contratos de API continuam documentados em `DADOS.md` como alvo futuro. A decisão prevalece sobre referências anteriores a backend em SPEC, TELAS e skills.

## Monorepo (Turborepo + pnpm)

```text
rendash/
├─ apps/
│  ├─ web/            Next.js App Router, Tailwind, Framer Motion; alvo Vercel
│  └─ mobile/         Expo, React Native, Expo Router, NativeWind; iOS e Android
├─ packages/
│  ├─ core/           Tipos, seletores, dinheiro, validações e transições simuladas
│  ├─ fixtures/       Dados fictícios tipados e cenários determinísticos
│  ├─ ui-tokens/      Cores, raios, espaço, tipografia, motion e preset Tailwind
│  ├─ ui-web/         Componentes React de vidro e motion
│  ├─ ui-native/      Componentes RN equivalentes, com fallback sólido
│  └─ config/         Configurações compartilhadas de tipos e ferramentas
├─ docs/  .claude/  .codex/  scripts/  AGENTS.md  CLAUDE.md
├─ turbo.json  pnpm-workspace.yaml  package.json
```

Dependências: `core` é independente de frameworks e fixtures; `fixtures` depende somente dos tipos de `core`. Componentes dependem dos tokens e helpers de apresentação. Apps compõem fixtures, core e componentes. Nenhum pacote acessa banco ou provedor externo. `packages/db` e `packages/api-contract` ficam para a fase futura.

## Dados e estado

Fixtures tipadas cobrem todos os módulos e estados carregando, vazio, erro recuperável e sucesso. Os apps carregam um cenário inicial determinístico e mantêm o estado da demonstração em memória, com ação para reiniciar. Nenhum dado financeiro ou pessoal real é persistido.

A interface envia intenções ao core; cálculos monetários, filtros por dono/contexto, validação de valores, idempotência e lançamentos locais ficam no core. Centavos inteiros em todo o domínio, formatação BRL somente na apresentação. Simulação de investimento, resgate e pagamento deve atualizar os resumos relacionados de forma consistente e permitir reinício.

Login, OTP, biometria, consentimento e conexão bancária são fluxos fictícios, identificados como demonstração. O app não deve pedir credenciais reais nem apresentar um pagamento ou uma conexão como reais. Mensagens de sucesso indicam explicitamente a simulação.

## Design e motion

Tokens únicos em `packages/ui-tokens`, compartilhados por Tailwind web e NativeWind. Estética dark, Liquid Glass e verde-água de `DESIGN.md`, com as imagens locais como referência principal. “iOS 27” é inspiração visual, não garantia de API nativa.

Framer Motion no web; Reanimated e Moti no mobile. Projetar transições de navegação e elementos compartilhados, springs em botões/cards, gestos de swipe e arrastar para confirmar, pull-to-refresh simulado, números animados, skeletons, vazios animados, sheets com detentes, indicador animado nas abas e haptics quando suportados. Respeitar `prefers-reduced-motion`/Reduzir movimento, foco, alvos de toque e alternativa acessível para gestos. Vidro usa fallback sólido no Android e ao reduzir transparência.

Consultar Mobbin e Refero quando os MCPs estiverem disponíveis e autenticados. Ausência é registrada em STATUS sem bloquear a implementação. Inspirações de Uiverse, Aceternity e Magic UI exigem conferir a licença antes de copiar código; ideias podem ser recriadas. Tokens de acesso ficam somente em configuração local.

## Execução e validação planejadas

Confirmar versões na documentação oficial e nos pacotes; dependências Expo via `npx expo install`. Scripts alvo: `pnpm dev`, `pnpm dev:mobile`, `pnpm build`, `pnpm check` (lint, tipos e testes). Testes de core cobrem centavos, limites, isolamento, repetição/concorrência simulada e consistência do estado; testes de interface cobrem mensagens inteiras, navegação, estados e redução de movimento. Comparar telas com referências em 390×844 e validar layout web responsivo.

Vercel é o destino futuro do web; EAS é o destino de builds mobile. Não fazer deploy, publicar build nem alterar produção nesta tarefa. Commits pequenos por etapa e um PR com base `dev`, após check e testes específicos, sem esperar CI.

## Backend futuro (não implementado)

Após nova decisão do dono: API Next.js com validação, autenticação e autorização; contratos zod compartilhados; Prisma/Postgres com isolamento por usuário/contexto, pooling e client singleton. Valores revalidados no servidor, razão imutável e idempotência na mesma transação. Biometria real e prova revalidada no servidor para ações sensíveis; segredos cifrados e fora de logs/respostas. Provedores financeiros, filas, webhooks e consentimentos reais serão avaliados nessa fase. Ver invariantes em AGENTS e contratos em DADOS.

## Etapas

(a) Documentação da fase mockada · (b) Scaffold Turborepo com web, mobile, core, fixtures e tokens · (c) Design system base e motion · (d) Telas e fluxos web · (e) Telas e fluxos mobile · (f) Testes, check e revisão. Cada etapa só é concluída após conferir o que foi implementado; o estado fica exclusivamente em STATUS.
