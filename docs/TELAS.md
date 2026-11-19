# Catálogo de telas — Rendash (46 páginas do PDF)

Imagem de cada tela: `docs/telas/ref/tela-NN.png` (NN = página do PDF). Rotas Expo Router em `apps/mobile/app/`. "API" = endpoint em `apps/web/src/app/api/` (contrato em `DADOS.md`). Estados obrigatórios em toda tela de dados: carregando (skeleton), vazio, erro com "Tentar novamente", sucesso.

Legenda de componentes: ver `DESIGN.md` (GlassCard, GlassButton, TabBarFloating, ListRow, AmountText, Chip/Segmented, ProgressRing, etc.).

## A. Onboarding e acesso

| Pág | Tela | Rota | Conteúdo e componentes | API / regras |
|---|---|---|---|---|
| 01 | Intro | `(auth)/index` | Logo, selo "RENTABILIDADE +12,8% a.a." sobre ilustração (círculos de vidro + gráfico), título "Invista com clareza. Cresça com confiança.", subtítulo, paginação de pontos (carrossel), CTA **Começar** | estática; carrossel de 2+ slides |
| 02 | Login | `(auth)/login` | Campos E-mail e Senha (com ocultar), "Esqueceu a senha?", **Entrar**, **Criar minha conta**, aviso de Termos/Privacidade | `POST /auth/login`; erro de credencial inline |
| 03 | Login biométrico | `(auth)/biometria` | Avatar iniciais "GM", "Olá, Guilherme", ícone de digital grande, **Entrar com biometria**, **Usar minha senha**, "Não é X? Trocar de conta" | biometria local libera refresh token (`secure-store`); Face ID/Touch ID conforme aparelho |
| 04 | Criar conta · etapa 1/3 | `(onboarding)/dados` | Nome completo, CPF (máscara, ajuda "Usamos o CPF para validar"), E-mail, Celular (máscara), checkbox Termos, **Continuar**; stepper "Etapa 1 de 3" | validação CPF no `core`; `POST /auth/register/start` |
| 05 | Verificar celular · etapa 2/3 | `(onboarding)/otp` | 6 caixas de código, "Reenviar código em 00:42" (timer), "Receber por ligação", **Verificar código**, aviso anti-golpe | `POST /auth/otp/verify`; rate limit; expira 5 min |
| (—) | Etapa 3/3 (ausente no PDF) | `(onboarding)/senha` | Assumida: criar senha + ativar biometria (ver SPEC) | `POST /auth/register/complete` |
| 06 | Recuperar acesso | `(auth)/recuperar` | Ícone de chave, e-mail cadastrado, feedback "E-mail encontrado", checklist 3 passos (link por e-mail → biometria → nova senha), **Enviar link seguro**, **Voltar ao login** | `POST /auth/recover`; resposta neutra (não revelar se existe) |

## B. Abas principais (TabBarFloating: Início, Carteira, Rendimentos, Mercado, Perfil)

| Pág | Tela | Rota | Conteúdo | API |
|---|---|---|---|---|
| 07 | Início | `(tabs)/index` | Saudação por horário ("Boa tarde, Nome"), sino com ponto de não lidas, avatar; card **Patrimônio total** (valor, olho para ocultar, chip variação %, "+ R$ X hoje", sparkline); 4 ações (Investir, Resgatar, Pix[desabilitado v1], Transferir); anel **Reserva 75%**; card **No mês** (+R$ e % do CDI); **Ações rápidas** (Extrato, Bancos, Investimentos, Cartão) | `GET /home` |
| 08 | Carteira | `(tabs)/carteira` | Donut de alocação (renda fixa 45%, ações 30%, fundos 15%, cripto 10%) com legenda, "Valor investido", lista **Ativos na carteira** (Ver todos), dica de diversificação/risco, botão filtro | `GET /portfolio` |
| 09 | Rendimentos | `(tabs)/rendimentos` | Segmented 7D/1M/3M/6M/1A/Tudo, card do mês com chip %, gráfico de barras, 3 métricas (Acumulado, Yield médio, Melhor dia), **Histórico recente** (link Extrato) | `GET /earnings?range=` |
| 17 | Mercado | `(tabs)/mercado` | Busca, filtros (Ações, FIIs, Cripto, Renda fixa), cards índices (IBOVESPA, IFIX, Bitcoin), cotação em destaque com gráfico (PETR4), **Mais negociados · 24h** (Ver ranking) | `GET /market/overview`, `GET /market/search` |
| 21 | Perfil | `(tabs)/perfil` | Cartão do usuário (nome, conta, plano "Rendash Prime", selo verificado), seções Planejamento (Metas, Extrato, Perfil de investidor), Conta (Dados pessoais, Segurança e privacidade, Central de ajuda), versão do app | `GET /me` |

## C. Ativo, gráficos, investir e resgatar

| Pág | Tela | Rota | Conteúdo | API / regras |
|---|---|---|---|---|
| 11 | Detalhes do ativo | `ativo/[id]` | Nome, valor, % acumulado, gráfico "Evolução · 3 meses", **Indicadores-chave** (rentabilidade real, desempenho CDI, valor investido, rendimento bruto, liquidez, vencimento), CTAs **Resgatar** / **Investir mais** | `GET /assets/:id` |
| 12 | Gráficos | `ativo/[id]/graficos` | Evolução + **Comparação 1M** (barras) + métricas + histórico recente | `GET /assets/:id/series` |
| 13 | Spec: Comparações | componente | Placa de especificação (fundo claro): comparação por período (7D/1M/3M), por indicador (CDI/Selic/IPCA), **Projeção** com aviso legal "Rentabilidade passada não garante…" | usar como `ComparisonCard` |
| 10 | Spec: Ações secundárias | componente | Placa de especificação: Investir/Resgatar como ações compactas + "Resumo rápido" | usar como `QuickSummary` |
| 14 | Investir | `investir/[assetId]` | Saldo disponível, campo "Quanto você quer investir?", mínimo R$ 100, chips (R$ 500, 1.000, 5.000, Máximo), **Projeção até o vencimento** (aplicado × estimativa líquida), card "Pronto para confirmar" (valor, liquidação "Hoje, até 17h"), **Confirmar investimento** | `POST /investments` (idempotente); biometria acima de R$ 1.000 |
| 15 | Investir (variante) | idem | Mesma tela com chip R$ 5.000 selecionado; tratar como estado | — |
| 16 | Resgatar | `resgatar/[assetId]` | Saldo no ativo, disponível para resgate (100% · D+0), valor, saldo restante, chips (500, 1.000, 2.500, Total), **Detalhamento** (bruto, IR, líquido), "Liquidação Hoje · D+0", **Confirmar resgate** | `POST /redemptions`; IR calculado no `core` |

## D. Metas, extrato, notificações, configurações

| Pág | Tela | Rota | Conteúdo | API |
|---|---|---|---|---|
| 18 | Minhas metas | `metas` | Total guardado, progresso geral, "3 objetivos", cards com anel %, valor, alvo e prazo, dica de aporte; botão **+** | `GET/POST /goals` |
| 19 | Extrato (mensal) | `extrato` | Seletor de mês, Entradas/Saídas/Saldo líquido, agrupado por dia: ícone, título, categoria, valor ± | `GET /statement?month=` |
| 20 | Notificações | `notificacoes` | Segmented Todas/Rendimentos/Alertas/Sistema, itens com ícone, título, texto, tempo relativo, marcar todas como lidas | `GET /notifications`, `POST /notifications/read` |
| 22 | Configurações | `configuracoes` | Anel de segurança 92%, toggles: Acesso por biometria, Confirmação biométrica (> R$ 1.000); links: Alterar senha, Dispositivos autorizados; alertas de rendimentos/mercado; Ocultar saldo ao abrir; rodapé de criptografia | `GET/PATCH /settings`, `GET/DELETE /devices` |

## E. Open Finance

Fluxo: 23 (hub) → 24 (escolher banco) → 25 (permissões) → 26 (sincronizando) → 28/29 (sucesso) ou 27/30 (erro) → 31 (contas).

| Pág | Tela | Rota | Conteúdo | API / estados |
|---|---|---|---|---|
| 23 | Open Finance (hub) | `bancos` | Saldo consolidado + variação, ações (Conectar, Sincronizar, Gerenciar), instituições (saldo, tipo de conta, final, "Ao vivo / 2 min") | `GET /connections` |
| 24 | Conectar instituição | `bancos/conectar` | Busca, contagem de resultados, "Limpar", populares (Nubank, Itaú, BB, C6), lista de resultados com **Selecionar**, nota "Conexão oficial via Open Finance" | `GET /institutions?q=` |
| 25 | Permissões | `bancos/permissoes` | Banco + selo SEGURO, 4 permissões com toggle (Contas e saldos, Extratos, Cartões e faturas, Investimentos — sem poder de resgate), validade 12 meses (picker), **Continuar no Itaú** (abre o fluxo de consentimento do banco) | `POST /connections` → URL de consentimento; consentimento somente leitura |
| 26 | Sincronizando | `bancos/sync/[id]` | Anel de progresso 80%, checklist: autorização, contas, transações (contador), cartões/investimentos; **Continuar em segundo plano** | polling `GET /syncs/:id` |
| 27 | Conexão interrompida | idem (estado erro) | Erro temporário do banco, checklist com "Falha ao importar", **Tentar novamente** | `POST /syncs/:id/retry` |
| 28 | Conectado | idem (sucesso 1) | Ícone check, saldo consolidado, **Continuar no Itaú** | — |
| 29 | Tudo pronto | `bancos/sucesso` | "Banco conectado!", resumo (contas, transações, saldo), "Sincronização automática em 6 h", **Ver contas consolidadas**, **Conectar outro banco** | — |
| 30 | Falha de conexão (alerta) | modal | Alerta "Não foi possível conectar", código **OF-408 · Central de ajuda**, **Tentar novamente**, **Voltar às instituições**. Contém trecho de template de alerta (ignorar "A Short Title Is Best") | — |
| 31 | Minhas contas | `bancos/contas` | Saldo disponível, barra de participação por instituição (62/27/11%), ações (Pix, Transferir, Extrato, Atualizar), lista com saldo e variação do mês, "Sincronizar tudo" | `GET /accounts` |

## F. Empresa (PJ)

| Pág | Tela | Rota | Conteúdo | API |
|---|---|---|---|---|
| 32 | Visão financeira | `empresa` | Segmented Pessoal/Empresa, seletor da empresa (razão social, CNPJ), saldo empresarial, A receber / A pagar, atalhos (Dashboard, Cobranças e recebíveis, Sócios e acessos, Contas conectadas), nota de contexto | `GET /orgs/:id/overview` |
| 33 | Dashboard empresarial | `empresa/dashboard` | Seletor período (30 dias), **Fluxo de caixa projetado** (linha), Entradas/Saídas/Rendimentos, ações (Cobrar, Pagar, Exportar), próximos lançamentos (NF, folha) | `GET /orgs/:id/cashflow` |

## G. Extrato unificado, Pix, categorias

| Pág | Tela | Rota | Conteúdo | API |
|---|---|---|---|---|
| 34 | Extrato unificado | `extrato/unificado` | Saldo no período, mês, filtros (Todos, Contas, Categorias, Pix), contagem "2.847 movimentações · 3 bancos", Entradas/Saídas, lista por dia com banco, categoria e hora; busca | `GET /transactions?cursor&filters` |
| 35, 37 | Detalhe do Pix | `transacao/[id]` | Avatar, "PIX RECEBIDO", valor, de quem, data/hora, instituição, destino, ID da transação (copiar), descrição, **Classificação** (contato, categoria), ações Compartilhar/Copiar ID/Mensagem. 37 é repetição | `GET /transactions/:id` |
| 36 | Editar classificação | `transacao/[id]/classificar` | Contato, categoria da receita, toggle "Aplicar automaticamente aos próximos Pix de…", sheet **Escolher categoria** (busca, lista, Concluir) — fundo claro no sheet | `PATCH /transactions/:id`, cria `CategoryRule` |
| 38 | Categorias | `categorias` | Gastos do mês vs mês anterior, segmented Gastos/Receitas, lista com valor, % e barra, "18 regras automáticas" (Gerenciar), "94% classificadas", **Nova categoria** (FAB) | `GET /categories/summary` |

## H. Cartão

| Pág | Tela | Rota | Conteúdo | API / regras |
|---|---|---|---|---|
| 39, 42 | Cartão Rendash | `cartao` | Cartão visual (Platinum, •••• 4821, titular, validade, VISA), ações (Bloquear, Senha, Virtual, Controles), resumo da fatura (fecha em 3 dias, valor, limite utilizado 43%, disponível), **Ver fatura**, pontos e lounge. 42 repete | `GET /card` |
| 40, 43 | Fatura | `cartao/fatura` | Valor atual, status ABERTA, fechamento/vencimento, **Pagar fatura**, abas Lançamentos · 28 / Resumo, filtros (Todos, titular, Virtual), lançamentos por dia, total exibido. 43 repete | `GET /card/invoices/:id`; pagar = `POST /card/invoices/:id/pay` (dinheiro, idempotente) |
| 44 | Compra selecionada | bottom sheet sobre fatura | "Detalhe da compra" (PAGO), valor total, categoria, cartão, local, resumo do pagamento (status, forma, parcelamento), **Ver comprovante** | `GET /card/purchases/:id` |
| 45 | Pagamento — estados | spec | Lista de selos de estado: PAGO, EM PROCESSO, BLOQUEADO, CARREGANDO, VAZIO, ERRO → componente `StatusBadge` | — |
| 41, 46 | Controles do cartão | `cartao/controles` | Estado desbloqueado (toggle), slider de limite (R$ 500–10.000, atual 8.500), cartão virtual (Ver dados, CVV dinâmico), toggles (aproximação até R$ 200 sem senha, internacionais, compras online com biometria), aviso "Face ID confirma mudanças sensíveis", link **Contestar compra ou informar perda**. 46 repete | `PATCH /card/controls`; biometria obrigatória; limite validado no servidor |

## Fluxos principais

1. Primeiro acesso: 01 → 04 → 05 → (etapa 3) → 07.
2. Retorno: 03 (biometria) → 07; falha → 02.
3. Investir: 07/08/11 → 14 → biometria (> R$ 1.000) → confirmação → 07 atualizado.
4. Conectar banco: 23 → 24 → 25 → 26 → 29 (ou 27/30) → 31.
5. Classificar Pix: 34 → 35 → 36 → 38.
6. Pagar fatura: 39 → 40 → 44 (detalhe) / Pagar fatura → 45 (estados).

## Elementos de "spec" (não são telas de produto)

Págs 10, 13, 45 são placas de componentes; pág 30 é um alerta com texto de template do Figma ("A Short Title Is Best", "Value", "Default/Destructive/Cancel" são rótulos de exemplo: não implementar literalmente).
