# Backend: структура NestJS API

Приложение `@spectaxi/api` организовано **по доменным Nest-модулям**.

Админские HTTP-ручки живут в **том же процессе** (`/api/v1/admin/*`). Отдельное приложение админ-API не планируем, пока не упрёмся в изоляцию/деплой.

## Дерево

```text
apps/api/src/
  main.ts
  app.module.ts
  prisma/                 ← инфраструктура БД (не домен)
  common/                 ← guards, pipes, filters, decorators (по мере нужды)
  modules/
    health/
      health.module.ts
      api/
        health-controller/
          health.controller.ts
          health.controller.spec.ts
    admin/                ← только каркас админ-поверхности, не склад доменов
      admin.module.ts
      api/
        admin-controller/
          …
    auth/ | users/ | orders/ | …   ← по мере появления
```

Пустые доменные модули «на вырост» не создаём.

Пример разросшегося домена (`orders`):

```text
modules/orders/
  orders.module.ts
  api/
    orders-controller/              ← приложение
      orders.controller.ts
      orders.controller.spec.ts
    orders-admin-controller/        ← админка (поверхность)
      orders.admin.controller.ts
      orders.admin.controller.spec.ts
  services/
    orders-service/
      orders.service.ts
      orders.service.spec.ts
    order-lifecycle-service/
      …
  dto/
    create-order.dto.ts
    …
```

## Именование

См. единый стиль: [`NAMING.md`](./NAMING.md). Nest-файлы: `name.role.ts` (`orders.controller.ts`); папки юнитов — `kebab-case`.

## Правила

1. **Один домен ≈ один Nest Module** под `modules/<name>/`. В корне домена — только `*.module.ts` (и при необходимости `index` re-export не обязателен).
2. **Colocation юнитов** (обязательно):
   - Один контроллер / сервис / provider = **одна папка** с логичным именем (`<role>-controller`, `<role>-service`, …).
   - Внутри папки: исходник + его `*.spec.ts` (не размазывать тесты по корню модуля).
   - Группы: `api/` — HTTP; `services/` — логика; `dto/` — DTO; `providers/` — адаптеры (SMS и т.п.).
   - Исключение: крошечный домен с одним файлом можно держать плоско, пока не появится второй юнит — при росте сразу в папки.
3. **Импорты между доменами** — через публичные сервисы модуля (`exports`), не через внутренние файлы чужого модуля.
4. **Prisma** — общий `PrismaModule` / `PrismaService`; запросы живут в доменных `services/`.
5. **`common/`** — только кросс-доменный каркас, без бизнес-правил заказа/оплаты.
6. **Контракты** — по возможности `@spectaxi/contracts`.
7. **Логика в домен, админка — поверхность API** (обязательно):
   - Бизнес-логика только в доменном модуле.
   - `AdminModule` — не склад логики споров/лицензий/заказов.
   - Админ-HTTP: `*-admin-controller/` внутри домена (предпочтительно) или тонкий controller в `AdminModule`, вызывающий exported service.
   - UI админки — `apps/admin` (FSD).

## Текущие маршруты скелета

| Метод | Путь                   | Модуль                                 |
| ----- | ---------------------- | -------------------------------------- |
| GET   | `/api/v1/health`       | HealthModule                           |
| GET   | `/api/v1/ready`        | HealthModule                           |
| GET   | `/api/v1/admin/health` | AdminModule (stub поверхности)         |
| GET   | `/api/v1/metrics`      | MetricsModule (Bearer `METRICS_TOKEN`) |

OpenAPI UI (опционально): `ENABLE_OPENAPI=true` → `/api/docs` (см. `src/openapi/setup-openapi.ts`).
Sentry: `SENTRY_DSN` optional (`src/sentry/sentry.init.ts`).

## Связь с документами

- Контракт API: `API_CONTRACT_MVP.md`
- Стек и деплой: `TECH_STACK.md`
- Фронт (FSD): `FRONTEND_FSD.md`
- Cursor rules: `.cursor/rules/backend-nest-modules.mdc`, `.cursor/rules/naming.mdc`
