# SpexTaxi

Мобильный маркетплейс спецтехники. Один аккаунт — клиент и/или исполнитель. Вход по телефону, режим интерфейса (`current_mode`) выбирается при регистрации.

Продуктовые документы MVP — в [`docs/`](docs/). Скелет monorepo: `@spectaxi/api`, `@spectaxi/admin`, `@spectaxi/web`, `@spectaxi/mobile`, `@spectaxi/contracts`.

**Obsidian:** открыть **корень** репо как vault. Паттерны — [`.obsidianignore`](.obsidianignore). Чтобы не торчали пустые `node_modules` — плагин **Advanced Exclude** + **Hide empty folders** (см. [`docs/README.md`](docs/README.md)).

DX: `pnpm lint` · `pnpm format` · `pnpm syncpack:check` · husky + lint-staged на commit. Деплой hello: [`docs/DEPLOY_HELLO.md`](docs/DEPLOY_HELLO.md).

Клиент задаёт фильтр (тип, тариф, количество, срочный без даты или плановый с датой и временем начала, точка) — система считает цену. Календаря занятости нет: по срочным заказам исполнитель виден, пока у него включён флаг «принимаю срочные заказы». Ищет ближайшие машины, шлёт запрос одному. После «принять» открываются контакты, исполнитель за сутки подтверждает условия. Пока работа не началась, срыв матча возвращает заказ к поиску. Спор — одна сущность на заказ. Типы транспорта и типы лицензий ведёт админ.

## Требования

- Node.js ≥ 22
- [pnpm](https://pnpm.io) 12.x (в репозитории зафиксирован `packageManager`)

## Структура

```
apps/api       NestJS API          → apps/api/README.md
apps/admin     Next.js админка     → apps/admin/README.md
apps/web       Next.js публичный веб → apps/web/README.md
apps/mobile    Expo приложение     → apps/mobile/README.md
packages/contracts   общие zod-схемы и типы
docs/          продуктовые спецификации
```

## Установка

```bash
pnpm install
cp .env.example .env                           # Windows: copy .env.example .env
cp apps/api/.env.example apps/api/.env         # Windows: copy apps\api\.env.example apps\api\.env
```

Секреты и локальные `.env` в git не коммитить.

**База для разработки:** [Neon](https://neon.com) (облачный Postgres по `DATABASE_URL`). Локальный Postgres / Docker не обязательны. Подключение Prisma в API пока выключено — без URL ничего не падает. Как создать проект Neon и что будет на проде — [`docs/TECH_STACK.md`](docs/TECH_STACK.md) §2 и [`apps/api/README.md`](apps/api/README.md).

**Файлы (фото/документы):** порт `ObjectStorage` в API + S3-compatible адаптер. В `.env` — `S3_*` (сейчас Neon Object Storage; позже R2 / российский S3 без правок доменов).

**Порты внешних сервисов** (OTP, платежи, geo, push, scheduler…): правило и каталог в [`docs/TECH_STACK.md`](docs/TECH_STACK.md) § «Порты и адаптеры»; код адаптера — вместе с фичей, не заранее. Образец — storage. См. также [`docs/BACKEND_STRUCTURE.md`](docs/BACKEND_STRUCTURE.md), [`apps/api/README.md`](apps/api/README.md).

**Тема UI:** [`packages/theme`](packages/theme) (`@spectaxi/theme`) — общие токены для admin/web/mobile; из них собирается CSS (веб) или native theme (Expo). UI-kit в apps подключается отдельно. [`docs/FRONTEND_FSD.md`](docs/FRONTEND_FSD.md) § «Тема».

## Запуск (dev)

Из корня репозитория:

| Команда           | Что                   | URL                                                   |
| ----------------- | --------------------- | ----------------------------------------------------- |
| `pnpm dev:api`    | NestJS API            | http://localhost:3000/api/v1/health , `/api/v1/ready` |
| `pnpm dev:admin`  | Next.js админка       | http://localhost:3001                                 |
| `pnpm dev:web`    | Next.js публичный веб | http://localhost:3002                                 |
| `pnpm dev:mobile` | Expo                  | Metro / Expo Dev Tools                                |

Можно запускать несколько команд в разных терминалах.

Подробности по каждому приложению — в его `README.md` внутри `apps/`.

## Сборка

| Команда                | Что                                                         |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm build:contracts` | Сборка `@spectaxi/contracts`                                |
| `pnpm build:api`       | Nest → `apps/api/dist` (contracts собирается автоматически) |
| `pnpm build:admin`     | Next.js production build (админка)                          |
| `pnpm build:web`       | Next.js production build (публичный веб)                    |

У mobile отдельной `build:*` из корня нет: нативные/магазинные сборки — через EAS (`apps/mobile/eas.json`), см. [`apps/mobile/README.md`](apps/mobile/README.md).

Прод-запуск после сборки:

```bash
pnpm build:api && pnpm --filter @spectaxi/api start
pnpm build:admin && pnpm --filter @spectaxi/admin start
pnpm build:web && pnpm --filter @spectaxi/web start
```

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage   # отчёт coverage, без порога fail
```

Unit-тесты — Vitest; файлы рядом с кодом (`*.spec.ts` / `*.spec.tsx`). CI: `.github/workflows/ci.yml`.

## Документы

- [USER_SCENARIOS.md](docs/USER_SCENARIOS.md) — сценарии
- [PRODUCT_FOUNDATION.md](docs/PRODUCT_FOUNDATION.md) — границы MVP, подписка, сделка
- [SEARCH_ALGORITHM.md](docs/SEARCH_ALGORITHM.md) — фильтр и сортировка поиска
- [ORDER_STATE_MACHINE.md](docs/ORDER_STATE_MACHINE.md) — статусы и платежи
- [DOMAIN_MODEL_AND_ERD.md](docs/DOMAIN_MODEL_AND_ERD.md) — сущности и индексы
- [API_CONTRACT_MVP.md](docs/API_CONTRACT_MVP.md) — черновик API
- [TARIFF_TYPES.md](docs/TARIFF_TYPES.md) — тарифы по категориям
- [CANCELLATION_REASONS.md](docs/CANCELLATION_REASONS.md) — причины по стадиям
- [RATING_PLAN.md](docs/RATING_PLAN.md) — внутренний рейтинг
- [CANCELLED_ORDERS.md](docs/CANCELLED_ORDERS.md) — отмена и «такой же заказ»
- [SERVICE_RULES.md](docs/SERVICE_RULES.md) — правила сервиса и блокировка
- [TECH_STACK.md](docs/TECH_STACK.md) — стек, сервисы, цены и порядок запуска
- [FRONTEND_FSD.md](docs/FRONTEND_FSD.md) — Feature-Sliced Design на фронтенде + `@spectaxi/theme`
- [BACKEND_STRUCTURE.md](docs/BACKEND_STRUCTURE.md) — доменные Nest-модули API + порт `ObjectStorage`
- [NAMING.md](docs/NAMING.md) — имена файлов/папок/идентификаторов; комментарии и `describe`/`it` на русском
- [DEPLOY_HELLO.md](docs/DEPLOY_HELLO.md) — деплой hello: DADA (API) + Vercel (admin/web)
- [tasks/](docs/tasks/) — ручные задачи (DADA, Vercel, Sentry, Grafana, UptimeRobot)
