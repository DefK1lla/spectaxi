# `@spectaxi/admin`

Next.js админка SpexTaxi (App Router).

Сейчас скелет: одна страница «SpexTaxi Admin». Экраны лицензий, типов транспорта, споров — позже.

Структура UI — **FSD v2.1**: роутинг Next в `app/`, слои в `src/_app`, `src/_pages` (см. [`docs/FRONTEND_FSD.md`](../../docs/FRONTEND_FSD.md)).

## Запуск

Из корня репозитория (предпочтительно):

```bash
pnpm install
pnpm dev:admin
```

Или из этой папки:

```bash
pnpm dev
```

Dev-сервер: http://localhost:3001

## Сборка и прод-старт

```bash
pnpm build:admin        # из корня
# или: pnpm build       # из apps/admin

pnpm --filter @spectaxi/admin start
# или: pnpm start       # порт 3001
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

- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md) — раздел админки
- [TECH_STACK.md](../../docs/TECH_STACK.md)
- [SERVICE_RULES.md](../../docs/SERVICE_RULES.md)
