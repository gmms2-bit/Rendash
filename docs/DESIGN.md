# Design system — Rendash (estilo iOS 27 / Liquid Glass)

Referência visual: as telas em `docs/telas/ref/`. iOS 27 é inspiração; **confira a documentação da Apple** (developer.apple.com, HIG "Materials"/Liquid Glass) antes de citar API. Em RN usamos aproximação: `expo-blur` + camadas de gradiente + borda de 1 px translúcida. Em iOS nativo recente, avaliar `@callstack/liquid-glass` ou `expo-glass-effect` (verificar se existem na versão do Expo do projeto).

## Princípios

1. **Escuro primeiro.** Fundo azul-noite com brilhos radiais sutis (roxo e verde-água); tema claro não existe na v1 (só sheets pontuais claros, ex.: "Escolher categoria").
2. **Vidro em camadas.** Cartões translúcidos (blur + brilho de borda superior), tab bar flutuante em pílula, sheets com grabber.
3. **Um acento.** Verde-água = ação primária, sucesso, valores positivos em destaque. Cinza/branco para o resto. Vermelho só para erro/negativo.
4. **Número é protagonista.** Valores grandes, tabulares, com decimais menores/mais claros.
5. **Densidade calma.** Muito espaço, rótulos em caixa-alta pequena (tracking aberto) acima dos números.

## Tokens (fonte: `packages/ui-tokens`; valores aproximados, extraídos do PDF; ajuste fino por inspeção)

| Token | Valor | Uso |
|---|---|---|
| `bg.base` | `#0A0E1B` | fundo |
| `bg.raised` | `#151125` | gradiente inferior / sheets escuros |
| `bg.glow.purple` | `#262335` (radial, 30–40%) | brilho de fundo |
| `bg.glow.teal` | `#0EDBB9` a 8–12% | brilho de fundo nas telas Open Finance/Cartão |
| `glass.fill` | branco 6–8% | cartão de vidro |
| `glass.fillStrong` | branco 12% | botão secundário, chip ativo |
| `glass.stroke` | branco 10–14%, 1 px (topo 20%) | borda |
| `accent` | `#0EDBB9` (pressed `#09C4AC`) | CTA, sucesso, toggle on, FAB |
| `accent.onAccent` | `#04130F` | texto sobre acento |
| `text.primary` | `#FFFFFF` | |
| `text.secondary` | branco 64% | |
| `text.tertiary` | branco 40% | rótulos caixa-alta |
| `chart.line` | `#D9D9DE` | linhas/barras neutras |
| `danger` | `#FF6B6B` | erro, valores negativos |
| `warning` | `#FFB84D` | alertas |
| `radius` | `sm 12 · md 16 · lg 24 · xl 32 · pill 999` | cartões 24, botões pill |
| `space` | `4 · 8 · 12 · 16 · 20 · 24 · 32` | margem de tela 20 |
| `blur` | `thin 20 · regular 40 · thick 60` | intensidade |
| `motion` | `spring(damping 18, stiffness 220)`; `fast 150ms`, `base 250ms` | toques e transições |

Tipografia: SF Pro no iOS (`System`), Inter no Android/web (fallback). Escalas: `largeTitle 34/41 bold`, `title 22/28 semibold`, `headline 17/22 semibold`, `body 15/20`, `caption 12/16`, `overline 11/14 caps +8% tracking`, `display 40/44 semibold tabular-nums` (patrimônio). Use `fontVariant: ['tabular-nums']`.

Haptics: `selection` em chip/tab, `impactLight` em CTA, `notificationSuccess/Error` em confirmação/erro.

## Componentes (nomes iguais em `ui-web` e `ui-native`)

**Fase 1 (base):** `Screen` (fundo gradiente + safe area + scroll), `GlassCard` (variants `default|strong|inset`), `GlassButton` (`primary|secondary|ghost|destructive`, tamanhos, loading), `IconButton` (círculo vidro 40, com badge/ponto), `TabBarFloating`, `NavHeader` (voltar, título + subtítulo, ação à direita), `AmountText` (BRL, oculto com `••••`, positivo/negativo), `ChangeChip` (± %), `OverlineLabel`.

**Fase 2 (formulário):** `TextField` (rótulo caixa-alta, erro, máscara CPF/telefone, limpar `x`), `MoneyInput`, `OtpInput` (6 caixas), `Stepper` ("Etapa 1 de 3"), `Checkbox`, `Toggle`, `Segmented` (7D…Tudo; Pessoal/Empresa), `ChipRow` (valores rápidos), `SearchField`, `Slider` (limite).

**Fase 3 (dados):** `ListRow` (ícone em vidro, título, subtítulo, valor, chevron), `SectionHeader` (título + "Ver todos"), `ProgressRing` (anel %, ex. 75%), `ProgressBar` (segmentada por instituição), `DonutChart`, `Sparkline`, `LineChart`, `BarChart` (cinza com última barra destacada), `StatTile` (rótulo + valor), `StatusBadge` (PAGO, EM PROCESSO, BLOQUEADO, CARREGANDO, VAZIO, ERRO), `CheckList` (passos com estado), `BankLogo` (inicial em círculo quando sem logo).

**Fase 4 (sobreposição):** `BottomSheet` (grabber, detents; fundo escuro ou claro), `Alert` (vidro, ações Default/Destructive/Cancel), `Toast`, `Skeleton`, `EmptyState`, `ErrorState`, `PaymentCard` (cartão VISA com brilho; frente/verso).

Cada componente: props tipadas, estados (default, pressed, disabled, loading, erro), `accessibilityLabel`, alvo ≥ 44 pt, suporte a Dynamic Type (`allowFontScaling` com limite) e a "Reduzir transparência" (cai para fundo sólido `#1A1D2E`). Storybook (web) e uma tela `/dev/galeria` no mobile mostram todos os estados.

## Padrões de tela

- Tab bar: 5 itens (Início, Carteira, Rendimentos, Mercado, Perfil), pílula flutuante 16 pt acima da base, item ativo com fundo de vidro forte.
- Cabeçalho de aba: título grande + subtítulo secundário + ícones à direita. Telas filhas: voltar à esquerda, `i`/ação à direita.
- CTA principal fixo no rodapé acima do home indicator; secundário abaixo.
- Cartão de confirmação "Pronto para confirmar" com escudo; sempre mostra valor e liquidação antes do CTA.
- Aviso legal de rentabilidade em `caption` sob projeções.
- Saldo oculto: `••••` mantendo a largura.

## Acessibilidade

Contraste AA sobre vidro (texto secundário nunca abaixo de 64% branco), foco visível no web, `accessibilityRole` correto, leitura de valores por extenso ("cento e vinte e quatro mil…" via `accessibilityLabel`), animações respeitam "Reduzir movimento".
