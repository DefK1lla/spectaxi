# Задача: миграции Prisma на стенде

**Зачем:** схема БД на DADA/Neon совпадает с `prisma/schema.prisma`. Без migrate `/ready` с проверкой БД и реальные модели не поедут.

## Что уже в репо

- Prisma 7.10 в `apps/api` (модуль Nest пока **выключен**)
- Скрипты в monorepo (нужен пакет `prisma` из **devDependencies**):
  - `pnpm --filter @spectaxi/api prisma:migrate` — dev (`prisma migrate dev`)
  - `pnpm --filter @spectaxi/api prisma:migrate:deploy` — стенд (`prisma migrate deploy`)
- Docker-образ API (`apps/api/Dockerfile`) — **runtime без CLI**: `pnpm deploy --prod` не кладёт `prisma`, только сгенерированный `@prisma/client`. Поэтому `migrate deploy` **нельзя** запускать из контейнера приложения (`node dist/main.js` / `/out`).
- Локальный `DATABASE_URL` (Neon) — [04-database-url.md](./04-database-url.md) ✓

## Что сделать на стенде

- [x] Задать `DATABASE_URL` локально (Neon) — [04-database-url.md](./04-database-url.md)
- [ ] Задать `DATABASE_URL` на DADA / стенде (когда будет деплой)
- [ ] Один раз создать миграцию локально (когда появятся модели):
  ```bash
  pnpm --filter @spectaxi/api prisma:migrate
  ```
- [ ] Накатить миграции на Neon/стенд **из CI или с машины разработчика** (не из prod-образа):
  ```bash
  # из корня monorepo, с DATABASE_URL стенда
  export DATABASE_URL="postgresql://…neon…"
  pnpm --filter @spectaxi/api prisma:migrate:deploy
  ```
  Альтернатива one-off: временный контейнер/job с Node + `pnpm install` (с devDeps) и той же командой — либо отдельный migrate-образ, если позже понадобится в DADA release hook. Главное: в job должен быть CLI `prisma` и папка `apps/api/prisma`.
- [ ] Раскомментировать `PrismaModule` + `$connect` + проверку в `/ready` (см. `apps/api/README.md`)
- [ ] UptimeRobot начнёт ловить падение БД через `/ready`

Пока Prisma выключена — migrate/модуль можно отложить до первой реальной модели; локальный `DATABASE_URL` уже есть.
