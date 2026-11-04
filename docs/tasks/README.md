# Задачи (ручные / внешние сервисы)

Чеклист того, что **не делается одним коммитом** — аккаунты, деплой, мониторинг.  
Обзор деплоя hello: [`../DEPLOY_HELLO.md`](../DEPLOY_HELLO.md). Стек и цены: [`../TECH_STACK.md`](../TECH_STACK.md).

| Файл                                                 | Зачем                                              |
| ---------------------------------------------------- | -------------------------------------------------- |
| [01-dada-api.md](./01-dada-api.md)                   | Выкатить API на DADA Cloud                         |
| [02-vercel-admin.md](./02-vercel-admin.md)           | Админка на Vercel                                  |
| [03-vercel-web.md](./03-vercel-web.md)               | Публичный веб на Vercel                            |
| [04-database-url.md](./04-database-url.md)           | `DATABASE_URL` (DADA Postgres или Neon)            |
| [05-metrics-grafana.md](./05-metrics-grafana.md)     | Чтобы `/metrics` реально собирался (Grafana Cloud) |
| [06-sentry.md](./06-sentry.md)                       | Чтобы ошибки API попадали в Sentry                 |
| [07-uptime-robot.md](./07-uptime-robot.md)           | Пинг `/ready` снаружи                              |
| [08-local-docker.md](./08-local-docker.md)           | Локальная проверка образа API                      |
| [09-cors.md](./09-cors.md)                           | CORS: Vercel origins → API                         |
| [10-ci-docker.md](./10-ci-docker.md)                 | CI job собирает Docker API                         |
| [11-migrations-deploy.md](./11-migrations-deploy.md) | `prisma migrate deploy` на стенде + Prisma on      |
| [12-sentry-frontends.md](./12-sentry-frontends.md)   | Sentry admin/web/mobile                            |

Статус: отмечайте галочки в самих файлах по мере выполнения.
