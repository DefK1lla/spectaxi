# `@spectaxi/theme`

Общие дизайн-токены SpexTaxi. **Не** UI-kit: примитивы, light/dark темы и адаптеры под веб / React Native.

## Направление

- Brand: зелёная шкала `brandColor` (primary light `#22C76E`, dark CTA `#34E089`; полная 50…900 — в `src/primitive-tokens.ts`)
- Нейтрали: тёплый stone, не холодный slate
- Радиусы soft (8–20), типографика airy
- Поверхности light: серый canvas + белые cards; dark: тёплый уголь

## Использование

```ts
import {
  lightTheme,
  darkTheme,
  themes,
  themesToCssDocument,
  themeToNative,
  brandColor,
} from "@spectaxi/theme";

// Web: оба режима сразу
themesToCssDocument(); // :root + [data-theme="dark"]

// Native
themeToNative(themes.dark);
```

Subpaths: `@spectaxi/theme/css`, `@spectaxi/theme/native`.

Стилистика SpexTaxi (brand/stone) — источник правды здесь.  
Клиентский UI-kit — Tamagui в [`@spectaxi/ui`](../ui); админка — Mantine из этих токенов.  
Docs: [`FRONTEND_FSD.md`](../../docs/FRONTEND_FSD.md) § «Тема и бренд».
