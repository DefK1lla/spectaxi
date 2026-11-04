# Деплой «hello» (фаза 0 / TECH_STACK §1c)

Что нужно сделать руками — агент не логинится в DADA/Vercel/Sentry/Grafana за вас.

Пошаговые задачи с галочками: [`docs/tasks/`](./tasks/README.md).

## Важно: Sentry и Prometheus после деплоя

**Сами по себе не заработают.** В репо заготовки:

| Что                   | Без настройки                | После настройки                                                       |
| --------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `GET /api/v1/metrics` | **503** без `METRICS_TOKEN`  | Prometheus-text (`prom-client`); сбор — Grafana Cloud scrape + Bearer |
| Sentry API            | Нет `SENTRY_DSN` → init off  | Init + Nest `SentryGlobalFilter`                                      |
| Sentry admin/web      | Нет `NEXT_PUBLIC_SENTRY_DSN` | `@sentry/react` в Providers                                           |
| CORS                  | localhost admin/web          | `CORS_ORIGINS` с URL Vercel ([tasks/09-cors.md](./tasks/09-cors.md))  |

## 1) API → [DADA Cloud](https://cloud.dada-tuda.ru)

1. Аккаунт + GitHub repo ([tasks/01-dada-api.md](./tasks/01-dada-api.md)).
2. Dockerfile `apps/api/Dockerfile`, context — **корень**.
3. `DATABASE_URL` ([tasks/04-database-url.md](./tasks/04-database-url.md)).
4. Env минимум:
   - `METRICS_TOKEN` (иначе `/metrics` = 503)
   - `CORS_ORIGINS=https://<admin>,https://<web>` после Vercel
   - `SENTRY_DSN` (+ опционально `SENTRY_ENVIRONMENT`)
5. Проверки: `/health`, `/ready`, `/metrics` с Bearer.
6. Grafana scrape ([tasks/05-metrics-grafana.md](./tasks/05-metrics-grafana.md)).
7. UptimeRobot на `/ready` ([tasks/07-uptime-robot.md](./tasks/07-uptime-robot.md)).
8. Миграции — когда включите Prisma ([tasks/11-migrations-deploy.md](./tasks/11-migrations-deploy.md)).

CI уже собирает образ: [tasks/10-ci-docker.md](./tasks/10-ci-docker.md).

## 2) Admin → Vercel

[tasks/02-vercel-admin.md](./tasks/02-vercel-admin.md) + при желании [tasks/12-sentry-frontends.md](./tasks/12-sentry-frontends.md).

## 3) Web → Vercel

[tasks/03-vercel-web.md](./tasks/03-vercel-web.md) + Sentry frontends.

## 4) Mobile

Сторы не нужны на фазе 0. Sentry native — позже ([tasks/12-sentry-frontends.md](./tasks/12-sentry-frontends.md)).

## Чеклист «hello на стенде»

- [ ] CI зелёный: `check` + `docker-api`
- [ ] DADA: health/ready 200
- [ ] DADA: `/metrics` 200 с Bearer
- [ ] Grafana скрейпит `/metrics`
- [ ] Sentry API: DSN + событие в Issues
- [ ] `CORS_ORIGINS` под Vercel
- [ ] Vercel admin + web открываются
- [ ] (опц.) Sentry admin/web DSN
- [ ] UptimeRobot на `/ready`
