# Задача: Sentry для API

**Зачем:** ловить необработанные ошибки процесса на стенде/проде.

## Сейчас после «голого» деплоя

**Не заработают без ручной настройки.**

В коде (`apps/api/src/sentry/sentry.init.ts`):

- нет `SENTRY_DSN` → Sentry **не инициализируется** (это нормально, API не падает)
- есть DSN → вызывается `Sentry.init` из `@sentry/nestjs`

В коде: `Sentry.init` + Nest `SentryGlobalFilter` при наличии DSN.

Админка / web / mobile: [12-sentry-frontends.md](./12-sentry-frontends.md).

## Что сделать

### Код

- [x] `initSentry` + Nest `SentryGlobalFilter` при наличии `SENTRY_DSN` (в репо)

### Аккаунт / стенд

- [ ] Аккаунт [Sentry](https://sentry.io) (Developer / Free)
- [ ] Create project → **Node.js / NestJS** (или Node)
- [ ] Скопировать **DSN**
- [ ] Env на DADA:
  - `SENTRY_DSN=https://...@....ingest.sentry.io/...`
  - опционально `SENTRY_ENVIRONMENT=staging` (или `production`)
  - опционально `SENTRY_TRACES_SAMPLE_RATE=0.1`
- [ ] Redeploy API
- [ ] Проверка: временно кинуть тестовую ошибку / `Sentry.captureMessage` или дождаться реального 500 — событие в Issues
- [ ] Убрать тестовый шум

Подробности: `TECH_STACK.md` § «Ошибки».
