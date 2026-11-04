# Фронтенд: Feature-Sliced Design (FSD)

Все фронтенд-приложения SpexTaxi (`apps/admin`, `apps/web`, `apps/mobile`) следуют **FSD v2.1**. Скилл агента: `.agents/skills/feature-sliced-design`.

## Принципы

- Код сначала в **pages**; `features` / `entities` — только при реальном переиспользовании (правило extraction).
- Слой `widgets` **не используем** без явной причины.
- Импорт только с нижних слоёв. Публичный API слайса — через `index.ts`.
- Пустые слои «на вырост» не создаём.

## Слои в репозитории

Конфликт имён с Next.js App Router / Expo Router: FSD-слои `app` и `pages` называются **`_app`** и **`_pages`**.

### Next.js (`admin`, `web`)

```text
apps/admin|web/
  app/                 ← только роутинг Next (тонкие re-export)
  src/
    _app/              ← FSD app: providers, styles
    _pages/            ← FSD pages: слайсы экранов
    shared/            ← появится по мере нужды (ui, api, lib, config)
    features/          ← по мере extraction
    entities/          ← по мере extraction
    test/              ← setup Vitest (не слой FSD)
```

Пример: `app/page.tsx` → `export { HomePage as default } from "@/_pages/home"`.

### Expo (`mobile`)

```text
apps/mobile/src/
  app/                 ← только Expo Router (тонкие re-export)
  _app/                ← FSD app: providers
  _pages/              ← FSD pages
  shared/ | features/ | entities/  ← по мере нужды
```

Alias `@/*` → `src/*` во всех трёх приложениях.

## Именование

См. единый стиль: [`NAMING.md`](./NAMING.md). Для React-компонентов файл = `PascalCase` (`HomePage.tsx`).

## Colocation юнитов (обязательно)

Один компонент / функция / хук / модель = **одна папка** с логичным kebab-case именем.

Внутри папки:

| Файл                                                 | Назначение                |
| ---------------------------------------------------- | ------------------------- |
| `ComponentName.tsx` (PascalCase) / `name.ts` (kebab) | сам элемент               |
| `ComponentName.spec.tsx` / `name.spec.ts`            | тесты рядом               |
| `index.ts`                                           | публичный re-export юнита |

Сегменты слайса (`ui/`, `model/`, `api/`, …) содержат такие папки-юниты, а не «голые» файлы вперемешку.

```text
_pages/home/
  index.ts                          ← публичный API слайса
  ui/
    home-page/
      HomePage.tsx
      HomePage.spec.tsx
      index.ts                      ← export { HomePage } from "./HomePage"
  model/
    brand/
      brand.ts
      brand.spec.ts
      index.ts

_app/providers/
  index.ts                          ← export { Providers } from "./app-providers"
  app-providers/
    Providers.tsx
    index.ts
```

Импорты снаружи юнита — только через его `index.ts` (или через `index.ts` слайса), не в глубокий файл мимо public API, если юнит уже выделен.

Исключение: крошечный одноразовый файл без теста можно не выделять в папку, пока не появятся тест или соседние файлы — при росте сразу в юнит-папку.

## Где что класть (кратко)

| Что                                            | Куда                |
| ---------------------------------------------- | ------------------- |
| Экран / логика одного маршрута                 | `_pages/<slice>/`   |
| Переиспользуемое действие пользователя         | `features/<slice>/` |
| Доменная модель с UI/api нескольких экранов    | `entities/<slice>/` |
| UI-kit, http-клиент, утилиты без бизнес-правил | `shared/...`        |
| Провайдеры, тема, глобальные стили             | `_app/`             |

Подробности и деревья решений — в скилле `feature-sliced-design` и на [fsd.how](https://fsd.how).

Cursor rules: `.cursor/rules/frontend-fsd.mdc`, `.cursor/rules/naming.mdc`.
