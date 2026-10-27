---
name: expo-mobile
description: Constrói e configura o app React Native com Expo (Expo Router, NativeWind, EAS, biometria, secure-store, push). Use ao mexer em apps/mobile, eas.json, app.config ou módulo nativo.
---

# Expo (apps/mobile)

Antes de afirmar versão/API, consulte docs.expo.dev e rode `npx expo install` (nunca fixe versões à mão). Estrutura de rotas em `docs/ARQUITETURA.md` e `docs/TELAS.md`.

- **Rotas:** Expo Router; grupos `(auth)`, `(onboarding)`, `(tabs)`. Proteção por layout que checa sessão.
- **Estilo:** NativeWind com o preset de `packages/ui-tokens`; componentes de `packages/ui-native`.
- **Sessão:** access token em memória; refresh token só em `expo-secure-store` (`requireAuthentication` quando suportado). Biometria: `expo-local-authentication`; falha de biometria cai para senha. Nunca guarde CPF, saldo ou PAN em `AsyncStorage`.
- **Dados:** TanStack Query; cliente HTTP tipado com `packages/api-contract`; `Idempotency-Key` (uuid) em investir/resgatar/pagar, gerado ao abrir a confirmação.
- **Gráficos:** Skia/Victory; teste de performance em Android intermediário.
- **Nativo:** Skia/blur/haptics exigem dev client (`eas build --profile development`). Mudou módulo nativo → novo build; só JS → `eas update`.
- **eas.json:** perfis `development`, `preview`, `production`; segredos no EAS, nunca no repositório. Publicar é irreversível: peça ao dono.
- **Deep links:** esquema `rendash://`; retorno do consentimento Open Finance por universal link.
- **Permissões/privacidade:** textos de `NSFaceIDUsageDescription` etc. em pt-BR; tela de captura bloqueada em dados do cartão (`expo-screen-capture`).
- **Testes:** Jest/`jest-expo` para componente, Maestro para fluxos.

Mexeu aqui: acione `revisor-mobile` e, se tocar segurança, `auditor-seguranca`.
