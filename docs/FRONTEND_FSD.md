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

**Сейчас** клиентский продукт (экраны/фичи MVP) пишем здесь. Вынос в shared packages кроме `contracts` / `theme` / `ui` — после выбора стратегии ([`FRONTEND_SHARE_OPTIONS.md`](./FRONTEND_SHARE_OPTIONS.md), task 14).

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

| Что                                            | Куда                                  |
| ---------------------------------------------- | ------------------------------------- |
| Экран / логика одного маршрута                 | `_pages/<slice>/`                     |
| Переиспользуемое действие пользователя         | `features/<slice>/`                   |
| Доменная модель с UI/api нескольких экранов    | `entities/<slice>/`                   |
| UI-kit, http-клиент, утилиты без бизнес-правил | app `shared/...` и/или `@spectaxi/ui` |
| Провайдеры, тема, глобальные стили             | `_app/`                               |
| Дизайн-токены (все фронты)                     | `@spectaxi/theme`                     |
| UI-примитивы клиента (Tamagui)                 | `@spectaxi/ui`                        |
| UI админки (Mantine)                           | только `apps/admin`                   |

Подробности и деревья решений — в скилле `feature-sliced-design` и на [fsd.how](https://fsd.how).

## UI-kit

Цель: стилистика SpexTaxi (зелёный brand, тёплый stone, soft radius). Клиент — **паритет `web` ↔ `mobile` на телефоне**; админка — отдельный desktop-kit.

### Клиент: Tamagui (`web` + `mobile`)

| Решение    | Деталь                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Библиотека | **Tamagui** в `apps/web` и `apps/mobile` (актуальная линейка, Next + Expo)                       |
| Токены     | `@spectaxi/theme` → Tamagui config / CSS vars                                                    |
| Пакет      | `packages/ui` (`@spectaxi/ui`) — `SpectaxiUiProvider` (`TamaguiProvider`) + re-export primitives |
| Не берём   | **gluestack-ui**: v5 dropped Next; v4 — legacy/alpha; **Mantine** на клиенте                     |

#### Паритет web ↔ mobile (телефон)

На ширине телефона `apps/web` и `apps/mobile` должны выглядеть **одинаково**: те же элементы, на тех же местах, та же иерархия. Не «похожий бренд», а совпадение layout’а клиентских экранов.

- **`apps/web` — mobile first + адаптив.** Телефонная версия — **важнее и эталонна** (паритет с `mobile`). На десктопе/планшете layout **расширяется** и должен выглядеть нормально (не «узкая колонка как на телефоне» и не отдельный продукт с другой IA) — progressive enhancement от phone-layout.
- **`apps/mobile` — эталон композиции** для клиентских сценариев на phone viewport; web на этой ширине не меняет порядок/набор блоков относительно mobile.
- Общий kit (Tamagui в `@spectaxi/ui`) + одни токены — обязательны, чтобы паритет не разъезжался.

### Админка: Mantine (`apps/admin`)

Админка — **desktop-first рабочий инструмент**. Адаптивом под телефон / «красивым mobile UX» **не занимаемся**: фиксированная/широкая раскладка под монитор нормальна. Достаточно, чтобы не ломалась совсем узкая ширина (горизонтальный скролл / читаемость ок); отдельные mobile breakpoints и перестройки layout — не цель.

| Решение    | Деталь                                                                     |
| ---------- | -------------------------------------------------------------------------- |
| Библиотека | **Mantine** (`@mantine/core` + hooks) — таблицы, формы, плотный desktop UI |
| Токены     | `@spectaxi/theme` → `createTheme` Mantine (`mantineTheme` в `_app`)        |
| Не берём   | Tamagui / `@spectaxi/ui` в admin — лишний universal stack                  |

### Общие правила UI

1. **Клиент** (`web` / `mobile`): экраны из `@spectaxi/ui` (Tamagui), не из случайных npm UI-kit.
2. **Admin**: экраны из Mantine; локальный `shared/ui` — обёртки или одноразовые куски.
3. Не хардкодить hex — семантика из `@spectaxi/theme` (и map в Tamagui / Mantine theme).
4. Не тащить Mantine на web/mobile и не тащить Tamagui в admin.
5. Клиентские экраны web/mobile: паритет на phone viewport; admin — не требовать mobile layout.
6. **UI-копирайт — только русский** (см. [`NAMING.md`](./NAMING.md)).
7. MVP: заказы — в **`mobile`**; `web` — лендинг / веб-клиент позже, **не** Expo Web.

## Тема и бренд (`@spectaxi/theme`)

Общий пакет токенов для **admin, web и mobile**. Не содержит React-компонентов и не зависит от конкретной UI-библиотеки.

```text
packages/theme/
  brandColor + primitiveColor   ← green brand scale, тёплые stone, status
  themes/light | themes/dark    ← семантические роли
  themesToCssDocument           ← веб light+dark (`data-theme`) — клиентский web
  themeToNative / nativeThemes  ← Expo / RN
```

**Бренд (не проебать):** тёплый рабочий UI, soft radius, airy type; light = серый canvas + белые поверхности; brand green CTA `#22C76E` (dark CTA `#34E089`). Не уезжать в «дефолтный AI-UI» (фиолетовые градиенты, холодный slate-only, резкие карточные дашборды) без продуктового решения. Hex-шкалы — только в коде [`packages/theme/src/primitive-tokens.ts`](../packages/theme/src/primitive-tokens.ts); в markdown не дублировать полную палитру.

Правила:

1. **Источник правды** — `@spectaxi/theme`. Цвета/отступы в apps не хардкодить мимо семантических ролей.
2. **Клиентский web** (`apps/web`): CSS из `@spectaxi/ui/styles.css` (`themesToCssDocument`); переключение `document.documentElement.dataset.theme = "dark" | "light"`.
3. **Admin**: токены → Mantine `createTheme` (`src/shared/theme/mantine-theme`); без `@spectaxi/ui`.
4. **Mobile**: `nativeThemes.light | .dark` / `themeToNative` → StyleSheet / Tamagui themes (маппинг токенов — task 13).
5. Клиентские UI-компоненты — через `@spectaxi/ui` (Tamagui); admin — через Mantine.
6. Доводка Tamagui compiler/Metro/Next — [`tasks/13-tamagui-ui.md`](./tasks/13-tamagui-ui.md).

## Общий код web ↔ mobile

**Сейчас:** клиентский продукт пишем в **`apps/mobile`**. Стратегия шаринга с `web` (Solito `packages/app`, отдельный `client`, только logic-only и т.д.) — **открытый вопрос**.

Варианты структур и ссылки на стартеры: [`FRONTEND_SHARE_OPTIONS.md`](./FRONTEND_SHARE_OPTIONS.md). Когда решение принято — зафиксировать здесь и пометить тот файл «решено».

Уже общие (не отменять): `@spectaxi/contracts`, `@spectaxi/theme`; клиентский UI — `@spectaxi/ui` (Tamagui). Admin UI — Mantine в `apps/admin`, не через `@spectaxi/ui`. API-zod — только в `contracts`. Не плодить микропакеты на каждый хелпер. Публичный веб — Next (`apps/web`), не Expo Web. Admin — отдельно, desktop-first.

Паритет на телефоне и mobile-first web — см. § «UI-kit»; к выносу экранов/фич в packages не обязывает, пока шаринг не выбран.

Cursor rules: `.cursor/rules/frontend-fsd.mdc`, `.cursor/rules/naming.mdc`.
