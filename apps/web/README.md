# `@spectaxi/web`

Публичный веб SpexTaxi на Next.js (App Router).

Скелет: одна страница «SpexTaxi». Клиентские сценарии (поиск, заказы) в MVP — в мобильном приложении; этот пакет — задел под лендинг / веб-клиент позже. **Не** Expo Web: карта, пуши и платежи на нативе проще держать в `apps/mobile`.

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
```

## Документы

- [TECH_STACK.md](../../docs/TECH_STACK.md)
- [USER_SCENARIOS.md](../../docs/USER_SCENARIOS.md)
- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md)
