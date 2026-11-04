# Задача: локальный Docker (опционально)

**Зачем:** убедиться, что образ API собирается так же, как на DADA, до пуша в облако.

## Что уже в репо

- `apps/api/Dockerfile`
- `docker-compose.yml` (api + postgres)
- `.dockerignore`

## Что сделать

- [ ] Установить Docker Desktop (на Windows его может не быть в PATH)
- [ ] Из корня: `docker compose up --build`
- [ ] `http://localhost:3000/api/v1/health`
- [ ] Metrics: Bearer из compose (`METRICS_TOKEN=local-metrics-token`)
