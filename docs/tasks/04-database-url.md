# Задача: DATABASE_URL

**Зачем:** Prisma/ready смогут проверять БД; без URL Nest сейчас стартует (PrismaModule выключен), но прод-ready без базы бессмысленен.

## Варианты

1. **DADA PostgreSQL** — рядом с приложением на DADA (предпочтительно для стенда в РФ).
2. **Neon** — удобно для локальной разработки (не РФ; без реальных ПДн).

## Что сделать

- [ ] Создать БД, скопировать connection string (`sslmode=require` если нужно)
- [ ] Прописать `DATABASE_URL` в env API на DADA (и локально в `.env` при необходимости)
- [ ] Позже: раскомментировать `PrismaModule` + `$connect` (см. `apps/api/README.md`)
