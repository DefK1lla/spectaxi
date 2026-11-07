# Задача: DATABASE_URL

**Зачем:** Prisma/ready смогут проверять БД; без URL Nest сейчас стартует (PrismaModule выключен), но прод-ready без базы бессмысленен.

## Варианты

1. **DADA PostgreSQL** — рядом с приложением на DADA (предпочтительно для стенда в РФ).
2. **Neon** — удобно для локальной разработки (не РФ; без реальных ПДн).

## Что сделать

### Локальная разработка (Neon)

- [x] Создать project на [Neon](https://neon.tech), скопировать connection string (`sslmode=require`)
- [x] Прописать `DATABASE_URL` в корневой `.env` и `apps/api/.env` (gitignored)

### Стенд / Prisma

- [ ] Прописать `DATABASE_URL` в env API на DADA (когда будет деплой)
- [ ] Раскомментировать `PrismaModule` + `$connect` + проверку в `/ready` (см. `apps/api/README.md`)

Пока Prisma выключена — Nest стартует и без URL; для migrate/studio URL уже нужен.
