# Задача: DATABASE_URL

**Зачем:** Prisma/ready проверяют БД; без URL Nest не сможет `$connect`.

## Варианты

1. **DADA PostgreSQL** — рядом с приложением на DADA (предпочтительно для стенда в РФ).
2. **Neon** — удобно для локальной разработки (не РФ; без реальных ПДн).

## Что сделать

### Локальная разработка (Neon)

- [x] Создать project на [Neon](https://neon.tech), скопировать connection string (`sslmode=require`)
- [x] Прописать `DATABASE_URL` в корневой `.env` и `apps/api/.env` (gitignored)
- [x] Включить `PrismaModule` + `$connect` + проверку в `/ready`

### Стенд

- [ ] Прописать `DATABASE_URL` в env API на DADA (когда будет деплой)
