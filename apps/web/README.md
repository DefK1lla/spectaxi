# `@spectaxi/web`

Публичный веб SpexTaxi на Next.js (App Router).

Скелет: одна страница «SpexTaxi». Клиентские сценарии (поиск, заказы) в MVP — в **`apps/mobile`**; этот пакет — лендинг / веб-клиент позже. **Не** Expo Web.

Когда появится веб-клиент: на телефоне — паритет layout с mobile, web — mobile first + адаптив ([`docs/FRONTEND_FSD.md`](../../docs/FRONTEND_FSD.md)). Как шарить код — TBD ([`docs/FRONTEND_SHARE_OPTIONS.md`](../../docs/FRONTEND_SHARE_OPTIONS.md), task 14).

Структура UI — **FSD v2.1**: роутинг Next в `app/`, слои в `src/_app`, `src/_pages`.

## Запуск

Из корня репозитория (предпочтительно):

```bash
pnpm install
pnpm dev:web
```

Или из этой папки:

```bash
pnpm dev
```

Dev-сервер: http://localhost:3002

## Сборка и прод-старт

```bash
pnpm build:web          # из корня
# или: pnpm build       # из apps/web

pnpm --filter @spectaxi/web start
# или: pnpm start       # порт 3002
```

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
```

Unit-тесты: Vitest + Testing Library (`*.spec.tsx` рядом с компонентами).

## Документы

- [TECH_STACK.md](../../docs/TECH_STACK.md)
- [USER_SCENARIOS.md](../../docs/USER_SCENARIOS.md)
- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md)
