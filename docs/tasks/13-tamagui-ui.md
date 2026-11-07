# 13 — Tamagui в `packages/ui` (вместо gluestack)

## Зачем

Нужен **актуальный** universal UI для Next (`admin`/`web`) + Expo (`mobile`).  
**gluestack-ui v5** официально **убрал Next.js**; v4 — legacy/alpha. Выбран **Tamagui** (latest).

## Статус

- [x] Решение: Tamagui вместо gluestack (docs / rules)
- [x] Удалён gluestack CLI-артефакт (`button/`, `gluestack-ui-provider`, `gluestack-ui.config.json`)
- [x] `@spectaxi/ui`: `tamagui` + `@tamagui/config` **3.2.4**, `SpectaxiUiProvider`, токены brand в config
- [x] CSS vars SpexTaxi (`styles.css` из `@spectaxi/theme`) — для web globals
- [ ] Compiler / Metro (`withTamagui`) в `apps/mobile`
- [ ] Next optimize (`@tamagui/next-plugin` или CLI) в admin/web
- [ ] Кастомные компоненты поверх Tamagui по мере экранов
- [ ] Полная карта `@spectaxi/theme` → Tamagui tokens/themes (сейчас brand + surface seed)

## Команды

```bash
pnpm --filter @spectaxi/theme build
pnpm --filter @spectaxi/ui generate:css
pnpm --filter @spectaxi/ui typecheck
```

Стартеры для справки: https://tamagui.dev/docs/guides/create-tamagui-app · https://github.com/tamagui/starter-free
