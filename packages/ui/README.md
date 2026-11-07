# `@spectaxi/ui`

Клиентский UI-слой SpexTaxi на **Tamagui** (актуальная линейка, Next + Expo) + токены `@spectaxi/theme`.  
**Не** для `apps/admin` — там Mantine.

Клиент пока в `apps/mobile`; шаринг с web — `docs/FRONTEND_SHARE_OPTIONS.md`.

**Почему не gluestack:** v5 dropped Next.js; v4 — legacy/alpha. См. `docs/tasks/13-tamagui-ui.md`.

## Использование

```ts
import { SpectaxiUiProvider, Button, Text, YStack } from "@spectaxi/ui";
import "@spectaxi/ui/styles.css"; // CSS vars из @spectaxi/theme (web)
```

```bash
pnpm --filter @spectaxi/theme build
pnpm --filter @spectaxi/ui generate:css
```

Дальше: compiler (`@tamagui/cli` / metro plugin) в apps — по task 13.
