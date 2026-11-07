# Задачи (ручные / внешние сервисы)

Чеклист того, что **не делается одним коммитом** — аккаунты, деплой, мониторинг.  
Обзор деплоя hello: [`../DEPLOY_HELLO.md`](../DEPLOY_HELLO.md). Стек и цены: [`../TECH_STACK.md`](../TECH_STACK.md).

| Файл                                                             | Зачем                                              | Статус                                                                |
| ---------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| [01-dada-api.md](./01-dada-api.md)                               | Выкатить API на DADA Cloud                         | не начато                                                             |
| [02-vercel-admin.md](./02-vercel-admin.md)                       | Админка на Vercel                                  | не начато                                                             |
| [03-vercel-web.md](./03-vercel-web.md)                           | Публичный веб на Vercel                            | не начато                                                             |
| [04-database-url.md](./04-database-url.md)                       | `DATABASE_URL` (DADA Postgres или Neon)            | **частично:** Neon + локальный `.env` ✓                               |
| [05-metrics-grafana.md](./05-metrics-grafana.md)                 | Чтобы `/metrics` реально собирался (Grafana Cloud) | код в репо; облако/стенд не настроены                                 |
| [06-sentry.md](./06-sentry.md)                                   | Чтобы ошибки API попадали в Sentry                 | код в репо; DSN/аккаунт не настроены                                  |
| [07-uptime-robot.md](./07-uptime-robot.md)                       | Пинг `/ready` снаружи                              | не начато (нужен публичный host)                                      |
| [08-local-docker.md](./08-local-docker.md)                       | Локальная проверка образа API                      | не подтверждено                                                       |
| [09-cors.md](./09-cors.md)                                       | CORS: Vercel origins → API                         | localhost-дефолты в коде; Vercel — после 02/03                        |
| [10-ci-docker.md](./10-ci-docker.md)                             | CI job собирает Docker API                         | job в репо; зелёный прогон — проверить в Actions                      |
| [11-migrations-deploy.md](./11-migrations-deploy.md)             | `prisma migrate deploy` на стенде + Prisma on      | **частично:** локальный URL ✓; migrate/Prisma off                     |
| [12-sentry-frontends.md](./12-sentry-frontends.md)               | Sentry admin/web/mobile                            | init-заготовки в репо; DSN не настроены                               |
| [13-tamagui-ui.md](./13-tamagui-ui.md)                           | Tamagui в `packages/ui` (вместо gluestack)         | каркас ✓; compiler/apps — открыто                                     |
| [14-frontend-share-strategy.md](./14-frontend-share-strategy.md) | **Важно:** выбрать шаринг web↔mobile               | открыто → [`FRONTEND_SHARE_OPTIONS.md`](../FRONTEND_SHARE_OPTIONS.md) |

Статус: отмечайте галочки в самих файлах по мере выполнения.

**Вне этого списка (уже в коде, отдельной task-карточки нет):** `@spectaxi/theme` (light/dark), порт `ObjectStorage` + `S3_*` в локальном `.env` (Neon Object Storage).
