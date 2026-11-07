# Задача: Sentry на admin / web / mobile

**Зачем:** ошибки UI, не только API.

## Что уже в репо

| App         | Статус                                                                    |
| ----------- | ------------------------------------------------------------------------- |
| API         | `SENTRY_DSN` + Nest filter — [06-sentry.md](./06-sentry.md)               |
| admin / web | `@sentry/react`, init в `Providers` при `NEXT_PUBLIC_SENTRY_DSN`          |
| mobile      | заготовка `initNativeSentry` + лог; **без** `@sentry/react-native` до EAS |

## Admin / Web (Vercel)

### Код

- [x] `@sentry/react` + init при `NEXT_PUBLIC_SENTRY_DSN` (admin/web)

### Аккаунт / стенд

- [ ] В Sentry — проекты (или один browser project)
- [ ] Env на Vercel:
  ```env
  NEXT_PUBLIC_SENTRY_DSN=https://...@....ingest.sentry.io/...
  NEXT_PUBLIC_SENTRY_ENVIRONMENT=staging
  ```
- [ ] Redeploy
- [ ] Проверить событие (временный `throw` в клиенте / SpexTaxi Issues)

## Mobile (позже)

### Код

- [x] Заготовка `initNativeSentry` (no-op до native dep)

### Подключение native

- [ ] `npx expo install @sentry/react-native` + config plugin в `app.json`
- [ ] `EXPO_PUBLIC_SENTRY_DSN=...`
- [ ] Дописать init в `apps/mobile/src/_app/sentry/init-native-sentry`
- [ ] Development / preview build (не Expo Go для полного native)
