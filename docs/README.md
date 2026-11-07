# SpexTaxi docs

Продуктовые и технические спецификации MVP.

Корневой обзор: [README.md](../README.md) (тот же vault — корень репо).

## Obsidian vault

1. Открыть **корень** `spectaxi` как vault (не папку `docs/`).
2. Полностью закрыть Obsidian и открыть снова после смены конфига.
3. **Settings → Files and links:**
   - **Detect all file extensions** — выключить (у нас `showUnsupportedFiles: false`).
   - **Excluded files** — должны быть regex из `.obsidian/app.json`. Если список пустой — Obsidian сбросил конфиг: вставь фильтры из `app.json` → `userIgnoreFilters` вручную или поставь плагин ниже.
4. Нативный exclude часто **всё равно оставляет папки** (`apps/`, …) в проводнике. Чтобы скрыть код надёжно:

   **Community plugins → включить → Browse → плагин `Ignore` (devxoul) → Install → Enable.**  
   В корне уже есть [`.obsidianignore`](../.obsidianignore): скрыто всё, кроме `README.md` и `docs/`.

Личный `workspace.json` не коммитим.
