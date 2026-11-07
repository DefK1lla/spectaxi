# SpexTaxi docs

Продуктовые и технические спецификации MVP.

Корневой обзор: [README.md](../README.md) (тот же vault — корень репо).

Внешние зависимости API — порты + адаптеры (не вендор в домене): [TECH_STACK.md](./TECH_STACK.md) § «Порты и адаптеры», [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) § «Порты». Образец в коде: `ObjectStorage` / S3 (`S3_*`).

Дизайн-токены: [`@spectaxi/theme`](../packages/theme). Клиентский UI-kit: **Tamagui** в [`@spectaxi/ui`](../packages/ui); админка: **Mantine** — [FRONTEND_FSD.md](./FRONTEND_FSD.md) § «UI-kit»; Tamagui setup [tasks/13-tamagui-ui.md](./tasks/13-tamagui-ui.md).

Язык: идентификаторы — English; комментарии / Vitest / **UI-копирайт apps** — русский: [NAMING.md](./NAMING.md) § «Язык в коде». UI / FSD: [FRONTEND_FSD.md](./FRONTEND_FSD.md). Шаринг web↔mobile (TBD): [FRONTEND_SHARE_OPTIONS.md](./FRONTEND_SHARE_OPTIONS.md), задача [tasks/14-frontend-share-strategy.md](./tasks/14-frontend-share-strategy.md).

## Obsidian vault

1. Открыть **корень** `spectaxi` как vault (не `docs/`).
2. **Settings → Files and links → Detect all file extensions** — выключить.

### Скрыть код в проводнике

Плагин **Ignore** прячет файлы, но часто оставляет **пустые папки** (`node_modules` без содержимого). Для monorepo нужен:

1. Community plugins → **Advanced Exclude** (Michael Naoumov) → Install → Enable.  
   Плагин **Ignore** можно выключить, чтобы не дублировать правила.
2. Settings → Advanced Exclude:
   - источник паттернов — файл [`.obsidianignore`](../.obsidianignore) в корне (уже в репо);
   - mode **Full** (или как минимум скрытие Files pane);
   - включить **Hide empty folders** — иначе пустые `node_modules` / `apps` останутся в дереве.
3. Reload vault (или Disable/Enable плагина).

Личный `workspace.json` и установленные плагины в git не коммитим.
