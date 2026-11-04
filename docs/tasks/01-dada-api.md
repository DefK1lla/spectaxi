# Задача: API на DADA Cloud

**Зачем:** публичный URL API в РФ (фаза 0 TECH_STACK), health/ready/metrics с интернета.

## Что уже в репо

- `apps/api/Dockerfile` (context = **корень** monorepo)
- маршруты `/api/v1/health`, `/ready`, `/admin/health`, `/metrics`

## Что сделать

- [ ] Аккаунт [DADA Cloud](https://cloud.dada-tuda.ru) Free
- [ ] Подключить GitHub-репозиторий
- [ ] Создать приложение: Dockerfile `apps/api/Dockerfile`, build context — корень
- [ ] Задать env (см. `04-database-url.md`, `05-metrics-grafana.md`, `06-sentry.md`)
- [ ] Задеплоить и проверить `GET https://<host>/api/v1/health` → `{ "status": "ok" }`
- [ ] Проверить `GET https://<host>/api/v1/ready`
