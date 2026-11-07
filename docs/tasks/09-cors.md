# Задача: CORS (Vercel → API)

**Зачем:** браузер с admin/web на Vercel не сможет звать API без разрешённого Origin.

## Что уже в репо

- `apps/api/src/common/cors/enable-cors.ts`
- По умолчанию разрешены `http://localhost:3001` и `:3002`
- Env: `CORS_ORIGINS` — список через запятую, или `*` (только для отладки)

## Локально

- [x] Дефолты в коде: `localhost:3001` / `:3002` (и `127.0.0.1`) — для `pnpm dev:*` ничего менять не нужно

## Что сделать после деплоя admin/web

- [ ] Взять URL Vercel-проектов (например `https://spectaxi-admin.vercel.app`)
- [ ] На DADA в env API:
  ```env
  CORS_ORIGINS=https://<admin-host>,https://<web-host>
  ```
- [ ] Redeploy API
- [ ] Из DevTools на админке: fetch на API без CORS-ошибки
