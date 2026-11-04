# Задача: Sentry на admin / web / mobile

**Зачем:** ошибки UI, не только API.

## Что уже в репо

| App         | Статус                                                                    |
| ----------- | ------------------------------------------------------------------------- |
| API         | `SENTRY_DSN` + Nest filter — [06-sentry.md](./06-sentry.md)               |
| admin / web | `@sentry/react`, init в `Providers` при `NEXT_PUBLIC_SENTRY_DSN`          |
| mobile      | заготовка `initNativeSentry` + лог; **без** `@sentry/react-native` до EAS |

## Admin / Web (Vercel)

- [ ] В Sentry — проекты (или один browser project)
- [ ] Env на Vercel:
  ```env
  NEXT_PUBLIC_SENTRY_DSN=https://...@....ingest.sentry.io/...
  NEXT_PUBLIC_SENTRY_ENVIRONMENT=staging
  ```
- [ ] Redeploy
- [ ] Проверить событие (временный `throw` в клиенте / SpexTaxi Issues)

## Mobile (позже)

- [ ] `npx expo install @sentry/react-native` + config plugin в `app.json`
- [ ] `EXPO_PUBLIC_SENTRY_DSN=...`
- [ ] Дописать init в `apps/mobile/src/_app/sentry/init-native-sentry`
- [ ] Development / preview build (не Expo Go для полного native)
