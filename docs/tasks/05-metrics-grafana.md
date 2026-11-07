# Задача: Prometheus-метрики → Grafana Cloud

**Зачем:** видеть, что API жив (`spectaxi_api_up`), позже — latency/5xx. На DADA Free второй агент не поставить — облако само скрейпит URL.

## Сейчас после «голого» деплоя

**Не заработают «из коробки».**

В коде есть stub `GET /api/v1/metrics`:

- без `METRICS_TOKEN` в env → **503**
- с токеном, но без Grafana → эндпоинт отвечает на curl, **никто не собирает** метрики

Это не полноценный `prom-client` (гистограммы и т.д.) — пока gauge `spectaxi_api_up 1`.

## Что сделать

### Код / локально

- [x] Эндпоинт `/api/v1/metrics` + `prom-client` / `spectaxi_api_up` в репо
- [x] `METRICS_TOKEN` в локальном `.env` / `.env.example` (для curl на `localhost`)

### Стенд + Grafana Cloud

- [ ] Сгенерировать длинный случайный `METRICS_TOKEN`, положить в env API на DADA
- [ ] Проверить вручную:
  ```bash
  curl -sS -H "Authorization: Bearer <METRICS_TOKEN>" https://<host>/api/v1/metrics
  ```
  Ожидание: текст с `spectaxi_api_up 1`
- [ ] Аккаунт [Grafana Cloud](https://grafana.com) Free (убедиться, что регистрация доступна)
- [ ] Integrations → **Metrics Endpoint** (или аналог «scrape URL»):
  - URL: `https://<host>/api/v1/metrics`
  - Auth: Bearer / header `Authorization: Bearer <METRICS_TOKEN>`
  - Interval: например 60s
- [ ] В Explore/дашборде убедиться, что появляется серия `spectaxi_api_up`

Подробности стека: `TECH_STACK.md` § «Метрики».
