# Задача: миграции Prisma на стенде

**Зачем:** схема БД на DADA/Neon совпадает с `prisma/schema.prisma`. Без migrate `/ready` с проверкой БД и реальные модели не поедут.

## Что уже в репо

- Prisma 7.10 в `apps/api` (**включена**: `PrismaModule`, `$connect`, `/ready` → `SELECT 1`)
- Локальная миграция-заглушка `skeleton_meta` применена к Neon
- Скрипты в monorepo (нужен пакет `prisma` из **devDependencies**):
  - `pnpm --filter @spectaxi/api prisma:migrate` — dev (`prisma migrate dev`)
  - `pnpm --filter @spectaxi/api prisma:migrate:deploy` — стенд (`prisma migrate deploy`)
- Docker-образ API (`apps/api/Dockerfile`) — **runtime без CLI**: `pnpm deploy --prod` не кладёт `prisma`, только сгенерированный `@prisma/client`. Поэтому `migrate deploy` **нельзя** запускать из контейнера приложения (`node dist/main.js` / `/out`).
- Локальный `DATABASE_URL` (Neon) — [04-database-url.md](./04-database-url.md) ✓

## Что сделать на стенде

- [x] Задать `DATABASE_URL` локально (Neon) — [04-database-url.md](./04-database-url.md)
- [x] Включить Prisma в Nest + `/ready`
- [x] Первая миграция локально (`skeleton_meta`)
- [ ] Задать `DATABASE_URL` на DADA / стенде (когда будет деплой)
- [ ] Накатить миграции на стенд **из CI или с машины разработчика** (не из prod-образа):
  ```bash
  # из корня monorepo, с DATABASE_URL стенда
  export DATABASE_URL="postgresql://…neon…"
  pnpm --filter @spectaxi/api prisma:migrate:deploy
  ```
  Альтернатива one-off: временный контейнер/job с Node + `pnpm install` (с devDeps) и той же командой — либо отдельный migrate-образ, если позже понадобится в DADA release hook. Главное: в job должен быть CLI `prisma` и папка `apps/api/prisma`.
- [ ] UptimeRobot начнёт ловить падение БД через `/ready`
