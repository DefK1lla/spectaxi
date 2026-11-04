# Задача: миграции Prisma на стенде

**Зачем:** схема БД на DADA/Neon совпадает с `prisma/schema.prisma`. Без migrate `/ready` с проверкой БД и реальные модели не поедут.

## Что уже в репо

- Prisma 7.10 в `apps/api` (модуль Nest пока **выключен**)
- Скрипты:
  - `pnpm --filter @spectaxi/api prisma:migrate` — dev
  - `pnpm --filter @spectaxi/api prisma:migrate:deploy` — prod/стенд (`prisma migrate deploy`)
- Пока схема-заглушка `SkeletonMeta` — полноценный ERD ещё не перенесён

## Что сделать на стенде

- [ ] Задать `DATABASE_URL` ([04-database-url.md](./04-database-url.md))
- [ ] Один раз создать миграцию локально (когда появятся модели): `prisma:migrate`
- [ ] На DADA: release / one-off команда из корня образа/CI:
  ```bash
  pnpm --filter @spectaxi/api prisma:migrate:deploy
  ```
  (точный синтаксис зависит от того, как DADA запускает команды — иногда `npx prisma migrate deploy` из `apps/api` с `DATABASE_URL`)
- [ ] Раскомментировать `PrismaModule` + `$connect` + проверку в `/ready` (см. `apps/api/README.md`)
- [ ] UptimeRobot начнёт ловить падение БД через `/ready`

Пока Prisma выключена — этот пункт можно отложить до первой реальной модели, но env `DATABASE_URL` лучше завести сразу.
