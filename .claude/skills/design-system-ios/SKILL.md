---
name: design-system-ios
description: Cria e usa componentes visuais do Rendash no estilo iOS 27 / Liquid Glass (tokens, vidro, tab bar flutuante, tipografia, motion) em web (Tailwind) e mobile (NativeWind). Use ao criar ou alterar componente, tela ou estilo.
---

# Design system iOS (Liquid Glass)

Fonte de verdade: `docs/DESIGN.md` (tokens, lista de componentes, padrões) + imagens em `docs/telas/ref/`.

## Como

1. Tokens vivem só em `packages/ui-tokens` (TS) e viram o preset do Tailwind (`tailwind.config`) usado por web e NativeWind. **Nunca** escreva hex, raio ou espaçamento solto em componente/tela.
2. Componente novo: mesmo nome e props em `packages/ui-web` e `packages/ui-native`; props tipadas; estados default/pressed/disabled/loading/erro; `accessibilityLabel`; alvo ≥ 44.
3. Vidro no mobile: `expo-blur` `BlurView` + `LinearGradient` + borda 1 px `glass.stroke`; no Android, `experimentalBlurMethod` pode custar caro: use fallback sólido (`#1A1D2E` a 90%) por `Platform`/dispositivo fraco e quando "reduzir transparência" estiver ligado.
4. Vidro no web: `backdrop-filter: blur()` com `@supports` e fallback sólido.
5. Se a documentação atual da Apple/Expo oferecer API nativa de Liquid Glass (ex.: pacote de glass effect para Expo/RN), prefira-a no iOS e mantenha a aproximação como fallback. Confira a existência e a versão antes de usar.
6. Motion com Reanimated (spring de `docs/DESIGN.md`); respeite "Reduzir movimento". Haptics conforme a tabela.
7. Valores: sempre `AmountText` (BRL de `packages/core/money`), nunca `toFixed`.
8. Cada componente entra na galeria (`/dev/galeria` no mobile, Storybook no web) com todos os estados.

## Fim da tarefa

Compare com a imagem de referência da tela (lado a lado, em 390×844) e acione `auditor-ui`.
