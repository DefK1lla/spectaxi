# Именование (SpexTaxi)

Единый стиль для monorepo. Reserved-имена фреймворков не переименовывать.

## Язык в коде

| Что                                                                    | Язык                           |
| ---------------------------------------------------------------------- | ------------------------------ |
| Идентификаторы (типы, функции, переменные, файлы, папки, `error.code`) | **English** — см. таблицы ниже |
| Комментарии (`//`, `/* */`, JSDoc)                                     | **Русский**                    |
| Строки `describe` / `it` / `test` в Vitest                             | **Русский**                    |

Исключения (можно English): цитаты из сторонних API/SDK; имена брендов и продуктов как принято (`SpexTaxi`, `Neon`, `ЮKassa`); TODO с тикетом/ссылкой без перевода смысла.

| Что                                                                                                   | Язык                                                          |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **UI-копирайт** в admin / web / mobile (кнопки, заголовки, ошибки пользователю, empty states, лейблы) | **Только русский** (пока; i18n позже по отдельному решению)   |
| `docs/`, commit messages                                                                              | не смешивать с правилами идентификаторов; docs — по контексту |

Не хардкодить английские строки в интерфейсе «на будущее».

## Идентификаторы (TypeScript / JS)

| Что                                                   | Стиль         | Пример                                     |
| ----------------------------------------------------- | ------------- | ------------------------------------------ |
| переменные, функции, методы, хуки                     | `camelCase`   | `createOrder`, `useAuthSession`            |
| React-компоненты, классы Nest, типы, интерфейсы, enum | `PascalCase`  | `HomePage`, `OrdersService`, `OrderStatus` |
| Константы-конфиги / «настоящие» константы             | `UPPER_SNAKE` | `APP_BRAND`, `API_PREFIX`                  |

Не использовать `kebab-case` и `snake_case` в именах идентификаторов.

## Файлы и папки

| Что                                              | Стиль                       | Пример                                                        |
| ------------------------------------------------ | --------------------------- | ------------------------------------------------------------- |
| Папки (юниты, слайсы, сегменты)                  | `kebab-case`                | `home-page/`, `orders-service/`, `admin-auth/`                |
| Утилиты, модели, хуки, dto, тесты без компонента | `kebab-case`                | `brand.ts`, `brand.spec.ts`, `create-order.dto.ts`            |
| **Файлы React-компонентов**                      | `PascalCase` = имя экспорта | `HomePage.tsx`, `HomePage.spec.tsx`                           |
| Nest controller / service / module / guard       | `name.role.ts`              | `orders.controller.ts`, `auth.service.ts`, `health.module.ts` |
| Re-export юнита / слайса                         | `index.ts`                  | всегда                                                        |

Рядом с компонентом: `HomePage.tsx` + `HomePage.spec.tsx` + `index.ts` (реэкспорт) в папке `home-page/`.

## Не трогать (имена задаёт фреймворк)

- **Next.js App Router:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, `default.tsx`, …
- **Expo Router:** `_layout.tsx`, `index.tsx`, `[param].tsx`, группы `(auth)/`
- **Vitest setup / конфиги пакета:** как принято в пакете (`vitest.config.ts`, `setup.ts`)

## Cursor

- `.cursor/rules/naming.mdc`
- Фронт: `FRONTEND_FSD.md`, `.cursor/rules/frontend-fsd.mdc`
- API: `BACKEND_STRUCTURE.md`, `.cursor/rules/backend-nest-modules.mdc`
