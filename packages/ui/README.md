# `@spectaxi/ui`

Клиентский UI-слой SpexTaxi на **Tamagui** (актуальная линейка, Next + Expo) + токены `@spectaxi/theme`.  
**Не** для `apps/admin` — там Mantine.

Клиент пока в `apps/mobile`; шаринг с web — `docs/FRONTEND_SHARE_OPTIONS.md`.

**Почему не gluestack:** v5 dropped Next.js; v4 — legacy/alpha. См. `docs/tasks/13-tamagui-ui.md`.

## Что экспортирует пакет

- `SpectaxiUiProvider` / `useSpectaxiUi` / `tamaguiConfig`
- **Свои** обёртки поверх Tamagui — когда появятся

**Не** re-export’им сырые компоненты Tamagui (`Button`, `YStack`, …) без своей обёртки — в apps импортируйте их из `tamagui`. Токены — из `@spectaxi/theme`.

## Использование

```ts
import { SpectaxiUiProvider } from "@spectaxi/ui";
import { Button, Text, YStack } from "tamagui";
import { lightTheme } from "@spectaxi/theme";
import "@spectaxi/ui/styles.css"; // CSS vars из @spectaxi/theme (web)
```

```bash
pnpm --filter @spectaxi/theme build
pnpm --filter @spectaxi/ui generate:css
```

Дальше: compiler (`@tamagui/cli` / metro plugin) в apps — по task 13.
