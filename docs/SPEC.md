# SPEC — Rendash

Pedido do dono (27/10/2026): analisar as 46 telas do PDF "Telas Rendash" e documentar tudo para construir depois. Stack pedida: Next.js + Turborepo + Vercel (serverless), React Native + Expo (Android e iOS), Tailwind (NativeWind no mobile), Prisma + Postgres hospedado na Vercel. Muitos componentes no estilo iOS 27 (Liquid Glass) como referência. Instruções de agentes em `AGENTS.md` global, `.agents`, skills.

## Produto

Super-app financeiro em pt-BR: patrimônio e investimentos, rendimentos, mercado, metas, Open Finance (agrega bancos), extrato unificado com Pix e classificação, visão empresarial (PJ) e cartão de crédito Rendash. Tagline: "Seu patrimônio, em movimento" / "Invista com clareza. Cresça com confiança."

## Vocabulário

CDI, Selic, IPCA (indicadores); D+0/D+1 (liquidação); aporte; resgate; proventos; Open Finance Brasil (consentimento 12 meses, somente leitura); Pix; fatura; limite; PF/PJ (contexto Pessoal/Empresa); razão (livro de lançamentos).

## Módulos e requisitos (resumo; detalhe por tela em `TELAS.md`)

| Módulo | Telas | Requisitos-chave |
|---|---|---|
| Onboarding e acesso | 1–6 | Intro, login e-mail/senha, biometria (Touch/Face ID), cadastro em 3 etapas (dados+CPF → SMS 6 dígitos → ?), recuperação de senha por link + biometria |
| Início | 7 | Patrimônio total com gráfico, variação do dia, ações (Investir, Resgatar, Pix, Transferir), reserva (%), rendimento do mês vs CDI, atalhos (Extrato, Bancos, Investimentos, Cartão), ocultar saldo |
| Carteira | 8, 11, 12, 13 | Alocação por classe (renda fixa, ações, fundos, cripto), lista de ativos, detalhe do ativo (evolução 3M, indicadores, liquidez, vencimento), gráficos e comparações (período, indicador, projeção) |
| Rendimentos | 9 | Filtros 7D–Tudo, rendimento do mês, acumulado/yield/melhor dia, histórico |
| Investir / Resgatar | 10, 14–16 | Valor, atalhos de valor, saldo, mínimo R$ 100, projeção líquida com aviso legal, IR no resgate, resumo "pronto para confirmar" e liquidação |
| Mercado | 17 | Busca, abas (Ações, FIIs, Cripto, Renda fixa), índices, cotação em destaque, mais negociados 24h |
| Metas | 18 | Metas com progresso, prazo, dica de aporte |
| Extrato | 19, 34 | Extrato por mês com entradas/saídas/líquido; unificado (todas as contas) com filtros e busca |
| Notificações | 20 | Filtros Todas/Rendimentos/Alertas/Sistema |
| Perfil e configurações | 21, 22 | Dados, segurança (92%), biometria, confirmação acima de R$ 1.000, senha, dispositivos, alertas, ocultar saldo |
| Open Finance | 23–31 | Saldo consolidado, instituições conectadas, busca de banco, permissões granulares, sincronização com progresso, estados de erro (OF-408), conexão concluída, minhas contas |
| Visão empresarial | 32, 33 | Alternar Pessoal/Empresa, saldo PJ, a receber/pagar, fluxo de caixa projetado, cobranças, sócios |
| Pix e categorias | 35–38 | Comprovante, classificação por contato/categoria com regra automática, categorias e orçamento |
| Cartão | 39–46 | Cartão, fatura, lançamentos, detalhe da compra, controles (limite, virtual, aproximação, internacional), estados de pagamento |

## Pontos ambíguos no PDF (decisão provisória; o dono confirma)

- Etapa 3 do cadastro não está no PDF: assumida como **criar senha + biometria**.
- Telas 15, 37, 42, 43, 46 são repetições/variantes (ver `TELAS.md`), tratadas como estados da mesma tela.
- Tela 3 diz "Olá, Guilherme" mas "Não é Lucas?"; o login mostra lucas.mendes: dados fictícios de exemplo.
- Pix aparece como ação mas a tela de enviar Pix não existe no PDF: **fora do escopo da v1** (só leitura/comprovante).
- Investir/resgatar ativos de renda variável e cripto: v1 só renda fixa (Tesouro Selic, CDB) e fundos; mercado é cotação somente leitura.
- Dados de mercado e Open Finance exigem provedor externo (ex.: Pluggy/Belvo para Open Finance, brapi/B3 para cotações); escolha em aberto (`STATUS.md`).
- Cartão Rendash e conta Rendash exigem parceiro regulado (BaaS); na v1 usar adaptador simulado (`packages/core/providers`).
