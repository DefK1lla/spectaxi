# `@spectaxi/api`

NestJS API SpexTaxi. Префикс маршрутов: `/api/v1`.

Сейчас скелет без бизнес-логики. **Prisma ORM 7.10** подготовлена под Neon/PostgreSQL (`prisma.config.ts`, `@prisma/adapter-pg`), но **подключение к БД выключено** (модуль и `$connect` закомментированы) — `pnpm dev:api` стартует без `DATABASE_URL`.

## Запуск

Из корня репозитория (предпочтительно):

```bash
pnpm install
pnpm dev:api
```

Или из этой папки:

```bash
pnpm dev
```

Перед `dev` / `build` собираются `@spectaxi/contracts` и Prisma Client.

По умолчанию порт `3000` (`PORT` в `.env`).

- Liveness: http://localhost:3000/api/v1/health
- Readiness: http://localhost:3000/api/v1/ready  
  (проверка БД — после включения Prisma)

## База данных (Neon)

Локальный Postgres на машине не нужен. Для разработки:

1. Зарегистрируйся на [neon.tech](https://neon.com), создай project.
2. Скопируй Connection string (`sslmode=require`).
3. Пропиши в `apps/api/.env` (и при желании в корневом `.env`):

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

Примеры переменных: `.env.example` в корне и `apps/api/.env.example`.

Когда будешь готов подключить Nest к БД:

1. Раскомментируй `PrismaModule` в `src/app.module.ts`.
2. Раскомментируй `$connect` / `$disconnect` в `src/prisma/prisma.service.ts`.
3. Раскомментируй проверку в `GET /ready` (`src/health.controller.ts`).
4. Примени схему:

```bash
pnpm prisma:migrate
```

Пока в `prisma/schema.prisma` только заглушка `SkeletonMeta`. Модели из `docs/DOMAIN_MODEL_AND_ERD.md` — следующим шагом.

Neon Free засыпает после простоя; серверы не в РФ — без реальных персональных данных. На проде будет другой Postgres (см. `docs/TECH_STACK.md`, §2).

## Prisma-команды

URL для CLI — в `prisma.config.ts` (`env("DATABASE_URL")`), не в `schema.prisma`.

```bash
pnpm prisma:generate   # клиент (БД не нужна; dummy URL подставляется скриптом)
pnpm prisma:migrate    # нужен реальный DATABASE_URL в apps/api/.env
pnpm prisma:studio     # UI таблиц (нужен DATABASE_URL)
```

## Сборка и прод-старт

```bash
pnpm build:api          # из корня
# или: pnpm build       # из apps/api

pnpm --filter @spectaxi/api start
# или: pnpm start       # нужен собранный dist/
```

## Проверки

```bash
pnpm lint
pnpm typecheck
```

## Документы

- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md)
- [TECH_STACK.md](../../docs/TECH_STACK.md) — Neon, прод-БД
- [DOMAIN_MODEL_AND_ERD.md](../../docs/DOMAIN_MODEL_AND_ERD.md)
