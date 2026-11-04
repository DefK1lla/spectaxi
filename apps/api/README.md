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
- Admin stub: http://localhost:3000/api/v1/admin/health
- Metrics: http://localhost:3000/api/v1/metrics (`Authorization: Bearer $METRICS_TOKEN`)
- OpenAPI (если `ENABLE_OPENAPI=true`): http://localhost:3000/api/docs

Структура модулей: [BACKEND_STRUCTURE.md](../../docs/BACKEND_STRUCTURE.md)  
(логика в домене; `/admin/*` — только HTTP-поверхность, не склад бизнес-правил).

Docker: `docker compose up --build` из корня (API + Postgres). Деплой DADA/Vercel: [DEPLOY_HELLO.md](../../docs/DEPLOY_HELLO.md).

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
3. Раскомментируй проверку в `GET /ready` (`src/modules/health/api/health-controller/health.controller.ts`).
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
pnpm test
pnpm test:coverage
```

Unit-тесты: Vitest + `@nestjs/testing`. Мок Prisma — `src/prisma/prisma.mock.ts`.

## Документы

- [BACKEND_STRUCTURE.md](../../docs/BACKEND_STRUCTURE.md) — доменные Nest-модули
- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md)
- [TECH_STACK.md](../../docs/TECH_STACK.md) — Neon, прод-БД
- [DOMAIN_MODEL_AND_ERD.md](../../docs/DOMAIN_MODEL_AND_ERD.md)
