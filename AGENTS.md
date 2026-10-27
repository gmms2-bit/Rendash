# Rendash

App de finanças pessoais e empresariais em português do Brasil: consolida investimentos, bancos (Open Finance), Pix, extrato, metas e cartão de crédito. Usado por pessoas físicas e pequenas empresas; operado pelo dono do projeto.

Este arquivo vale para o Claude Code, o Codex e qualquer outro LLM (o `CLAUDE.md` só o importa). Pastas com regra própria têm um `AGENTS.md` curto com o que vale só ali.

**Fase atual: mockup front-end animado, com dados 100% fictícios.** Leia `docs/STATUS.md` antes de qualquer coisa.

## Escopo atual (decisão do dono, 27/10/2026)

- Construir web (Next.js) e mobile (Expo, iOS/Android) em Turborepo, com as 46 páginas/variantes do PDF cobertas e fluxos adicionais.
- Todos os dados vêm de `packages/fixtures`, com tipos compartilhados e cenários determinísticos de carregamento, vazio, erro e sucesso. Nenhum Prisma, Postgres, API real ou provedor externo nesta fase.
- `packages/core` concentra cálculos, validações e transições da simulação; interfaces só apresentam dados e disparam intenções. Estado local reiniciável, sem dinheiro real.
- Login, OTP, biometria, conexão bancária e pagamentos são demonstrações identificadas como simulação. Não coletar credenciais nem dados pessoais reais; não afirmar autenticação, conexão ou pagamento real.
- Contratos HTTP e persistência em `docs/DADOS.md` são alvo futuro. Instruções antigas em SPEC, TELAS e skills sobre API, banco e seed devem ser lidas nesse contexto; esta decisão prevalece.
- Motion: Framer Motion no web; Reanimated e Moti no mobile, com gestos, sheets, microinterações, haptics e redução de movimento. Tokens únicos em `packages/ui-tokens`.
- Referências: imagens locais, Mobbin e Refero. Se os MCPs não estiverem disponíveis/autenticados, registrar a ausência em STATUS e prosseguir; tokens somente na configuração local.

## Invariantes

Uma mudança que quebre um destes está errada, mesmo com os testes passando.

1. Nesta fase, `packages/core` calcula e valida valores da simulação. Na integração real, o servidor deve recalcular e validar todo valor; valor vindo do cliente nunca é confiado.
2. Dinheiro é inteiro em centavos (`bigint` ou inteiro seguro nas fixtures/core, string de centavos nos contratos futuros). Nunca `float`. Formatação em BRL só na interface.
3. Toda linha de negócio pertence a um usuário (`userId`) e, quando for o caso, a um contexto (`PERSONAL` ou `BUSINESS` com `organizationId`). Consulta sem esse filtro é falha.
4. Fixtures contêm apenas identidades fictícias e CPF/PAN mascarados; nenhum segredo real. No backend futuro, segredos devem ser cifrados e ficar fora de logs e respostas.
5. Interface (web e mobile) não tem regra de negócio: só apresenta o que fixtures/core entregam (API no futuro). Regras vivem em `packages/core`.
6. Operação sensível (investir/resgatar acima de R$ 1.000, alterar limite, ver dados do cartão virtual, desbloquear) exige confirmação explicitamente simulada no mockup. Na integração real, exige biometria no app e revalidação no servidor.
7. A simulação de operação financeira é idempotente e gera lançamento imutável no estado local pelo core. Na integração real: `Idempotency-Key` e razão na mesma transação do banco.
8. Design: segue `docs/DESIGN.md` (dark, Liquid Glass, verde-água como acento). Nenhum valor de cor, raio ou espaçamento solto: só tokens de `packages/ui-tokens`.

## Documentos

| Arquivo | Contém |
|---|---|
| `docs/SPEC.md` | o que o dono pediu, requisitos por módulo, vocabulário; a última decisão vale |
| `docs/ARQUITETURA.md` | monorepo, stack, camadas, deploy (Vercel/EAS), segurança, onde está cada coisa |
| `docs/TELAS.md` | catálogo das 46 telas do PDF: rota, componentes, dados, estados, fluxos |
| `docs/DESIGN.md` | design system estilo iOS (Liquid Glass): tokens, componentes, motion, acessibilidade |
| `docs/DADOS.md` | fixtures tipadas; modelo e contratos de API futuros |
| `docs/STATUS.md` | o único lugar com estado: o que existe, o que falta, próximos passos, perguntas |
| `docs/telas/ref/` | imagens de referência (uma por página do PDF original) |
| `SECURITY.md` | diretrizes de segurança para revisão de PR |

Não crie outros documentos. Requisito novo entra no `SPEC`; decisão técnica na `ARQUITETURA`; andamento no `STATUS`, substituindo o que mudou em vez de acrescentar diário. Só registre o que conferiu no código.

## Rodar (alvo, após o scaffold)

```bash
pnpm install          # dependências e ganchos do git
pnpm dev              # apps/web (Next.js com fixtures) via Turborepo
pnpm dev:mobile       # apps/mobile (Expo)
pnpm check            # lint + tipos + testes (turbo run lint typecheck test)
```

O mockup deve funcionar sem variáveis secretas. Na integração futura, valores reais ficam na Vercel/EAS e em configuração local, nunca no git. Nunca leia nem exiba `.env*`.

## Fluxo de trabalho

- Ramos: `main` (publicado) e `dev` (onde se trabalha). **PRs vão para a `dev`.** A `main` só recebe o PR de promoção da `dev`. Nunca envie direto para a `main` nem reescreva histórico publicado.
- Commits pequenos por etapa; um envio por tarefa. Antes de enviar, rode `pnpm check` e o teste específico do que mudou. Sem deploy e sem esperar CI.
- Não espere CI nem deploy. No fim, confira `gh run list --status failure --limit 5`.
- Formatação, lint, segredo e tipos são dos ganchos (lefthook). Leia o erro que eles devolvem.
- Armadilhas do stack:
  - Expo: versões vêm de `npx expo install`, nunca à mão. Módulo nativo novo exige novo build EAS (dev client), não só OTA.
  - NativeWind e Tailwind web compartilham tokens de `packages/ui-tokens`; não duplique o `tailwind.config`.
  - Fonte, `BlurView` e efeitos de vidro são caros no Android: tenha fallback sólido (ver skill `design-system-ios`).
  - Número monetário: `Intl.NumberFormat('pt-BR')` não existe completo no Hermes antigo; use o helper de `packages/core/money`.

## Revisão de PR

Revisão com a cota dos planos, nunca com API paga. Todo PR (para a `dev`) é revisado pelo **Codex**; o **Claude** só entra onde errar custa caro (dinheiro, segurança, auth, segredos, esquema do banco, workflows) ou com o rótulo `claude-review`. Para rever, comente `@codex review`.

### Review guidelines

- Quebra de qualquer invariante acima é P0, mesmo com testes passando.
- Dinheiro: valor vindo de fora, float, operação repetível, falta de teste concorrente, saldo lido e escrito fora de transação.
- Segurança: dado sem dono, segredo/CPF/PAN em log ou resposta, entrada sem validação (zod), rota sem checagem de permissão, consentimento Open Finance ignorado.
- Texto ao usuário que afirma operação real no mockup. Estados como "Pago" ou "Conectado" precisam estar identificados como simulação; na integração futura, dependem da confirmação do servidor.
- Tela sem estados (vazio, carregando, erro) ou com cor/raio solto fora dos tokens.
- Não aponte estilo nem formatação.

## Como trabalhar

- **Fato vem da fonte.** API de SDK, campo do Prisma, limite da Vercel/Expo/EAS: confira no pacote instalado ou na documentação oficial, na hora. O iOS 27 / Liquid Glass é referência visual: confira a documentação da Apple antes de afirmar uma API.
- **Teste primeiro**, e teste o que quebra: dinheiro com o caso concorrente; tela com a mensagem inteira.
- **Nunca afirme o que não aconteceu**, ao usuário nem nos documentos.
- **Siga sem perguntar** quando o passo pode ser desfeito. Pergunte ao dono só quando a resposta muda o que se constrói, ou antes de algo irreversível (produção, apagar dados, mensagem para fora).
- Texto que o usuário lê é curto e direto, em português do Brasil.
- Construa tela a tela a partir de `docs/TELAS.md` + imagem em `docs/telas/ref/`. Em dúvida visual, a imagem vence a descrição.

## Cota e roteamento

Antes de começar uma tarefa (e no meio das longas), rode `node scripts/rota.mjs "<tarefa>"` e siga o executor, o modelo, o "esperar" e a "revisão do Claude" (skill `rota`). Padrão: Codex primeiro; o Claude escreve direto só UI/UX, arquitetura e decisão difícil com a cota folgada, e revisa o que o Codex fizer em dinheiro, segurança e tarefa grande. Produção (deploy, servidor, banco, `main`) nunca vai ao Codex.

## Skills

Ficam em `.claude/skills/`; `.agents/skills` é link para a mesma pasta (crie com `bash scripts/setup.sh`). Leia o `SKILL.md` antes do trabalho que ele cobre. Instrução do dono vence a skill.

| Situação | Skill |
|---|---|
| começar qualquer tarefa, ou no meio de uma longa | `rota` |
| auditoria completa, "revise tudo desde X" | `auditoria` |
| criar o monorepo, pacotes, pipelines, deploy Vercel | `monorepo-turbo` |
| componente, tela ou estilo (web e mobile), Liquid Glass | `design-system-ios` |
| implementar/alterar uma tela do PDF | `telas-rendash` |
| app React Native, Expo, EAS, NativeWind, biometria | `expo-mobile` |
| rotas de API, Next.js, Vercel serverless, auth, zod | `nextjs-api` |
| schema, migração, consulta, seed (Prisma + Postgres) | `prisma-postgres` |
| valor em BRL, investir, resgatar, fatura, razão | `dinheiro-brl` |
| bancos, consentimento, sincronização, Pix, extrato unificado | `open-finance` |

## Agentes revisores

Só leem e relatam. Fonte: `.claude/agents/*.md`; `.codex/agents/*.toml` é gerado por `node scripts/agents-sync.mjs`. Edite só o `.md`. Segurança e dinheiro rodam em Opus; os demais em Sonnet.

| Mexeu em | Revisor |
|---|---|
| investir, resgatar, fatura, limite, razão, saldos | `auditor-dinheiro` |
| login, sessão, biometria, token Open Finance, segredo, entrada, dependência | `auditor-seguranca` |
| API, `packages/core`, banco, Prisma | `revisor-backend` |
| tela web ou mobile, tokens, componentes | `auditor-ui` |
| app Expo, EAS, permissões nativas, performance RN | `revisor-mobile` |
| `.github`, `vercel.json`, `eas.json`, `scripts/`, `.claude/settings.json`, `.codex/` | `auditor-infra` |
| fim de tarefa grande | `revisor-testes` e `revisor-docs` |

Mudança em várias áreas: um revisor por área, ao mesmo tempo. Confira no código a evidência de cada achado.

## Ferramentas

- MCPs: os mesmos em `.mcp.json` e `.codex/config.toml`; mudou um, mude o outro.
- Permissões: `.claude/settings.json` e `.codex/rules/seguranca.rules`; mudou uma, confira a outra.
