# `@spectaxi/admin`

Next.js админка SpexTaxi (App Router).

Сейчас скелет: одна страница «SpexTaxi Admin». Экраны лицензий, типов транспорта, споров — позже.

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
```

## Документы

- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md) — раздел админки
- [TECH_STACK.md](../../docs/TECH_STACK.md)
- [SERVICE_RULES.md](../../docs/SERVICE_RULES.md)
