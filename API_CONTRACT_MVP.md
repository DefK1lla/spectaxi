# API-контракт MVP (черновик)

## 1) Общие принципы API

- Базовый префикс: `/api/v1`.
- Формат: `application/json`.
- Аутентификация: `Bearer JWT`.
- Время в формате ISO-8601 UTC.
- Все операции изменения заказа должны быть идемпотентны там, где возможны повторы (`Idempotency-Key`).

Пример единого формата ошибки:

```json
{
  "error": {
    "code": "ORDER_ALREADY_ASSIGNED",
    "message": "Заказ уже назначен другому исполнителю",
    "details": {}
  }
}
```

## 2) Авторизация и профиль

### `POST /auth/request-code`

Запрос кода подтверждения по номеру телефона.

Запрос:
```json
{
  "phone": "+79991234567"
}
```

Ответ `200`:
```json
{
  "status": "code_sent"
}
```

### `POST /auth/verify-code`

Подтверждение кода и выдача токенов.

Запрос:
```json
{
  "phone": "+79991234567",
  "code": "1234"
}
```

Ответ `200`:
```json
{
  "access_token": "jwt...",
  "refresh_token": "jwt...",
  "user": {
    "id": "uuid",
    "phone": "+79991234567",
    "full_name": "Иван Петров",
    "is_client_enabled": true,
    "is_executor_enabled": false
  }
}
```

### `GET /users/me`

Текущий профиль пользователя.

### `PATCH /users/me`

Обновление профиля.

## 3) Категории и техника исполнителя

### `GET /categories`

Список категорий спецтехники.

Ответ `200`:
```json
{
  "items": [
    { "id": "uuid", "code": "tow_truck", "name": "Эвакуатор" },
    { "id": "uuid", "code": "crane", "name": "Кран" }
  ]
}
```

### `POST /executor/profile`

Создание/обновление профиля исполнителя.

### `POST /executor/machinery`

Добавление единицы техники.

### `PATCH /executor/machinery/{machineryId}/status`

Изменение статуса техники (`available`, `busy`, `offline`).

## 4) Поиск исполнителей

### `GET /search/executors`

Параметры:
- `category_id` (обязательный);
- `lat`, `lng` (обязательные);
- `search_mode` (`urgent` | `planned`);
- `planned_start_at` (для `planned`);
- `duration_minutes` (опционально);
- `radius_km` (опционально).

Ответ `200`:
```json
{
  "items": [
    {
      "executor_user_id": "uuid",
      "machinery_unit_id": "uuid",
      "distance_km": 3.2,
      "machinery_status": "available",
      "pricing_preview": {
        "pricing_type": "hour",
        "from_amount": 3500,
        "currency": "RUB"
      }
    }
  ]
}
```

## 5) Заказы клиента

### `POST /orders`

Создание заказа.

Запрос:
```json
{
  "category_id": "uuid",
  "search_mode": "urgent",
  "settlement_mode": "direct_payment",
  "address_text": "Москва, Ленинский проспект, 10",
  "location_lat": 55.6761,
  "location_lng": 37.5667,
  "planned_start_at": null,
  "planned_duration_minutes": null,
  "description": "Нужен эвакуатор для легкового авто",
  "pricing": {
    "pricing_type": "trip",
    "calc_params": {
      "distance_km": 12
    }
  }
}
```

Ответ `201`:
```json
{
  "id": "uuid",
  "status": "draft"
}
```

### `POST /orders/{orderId}/publish`

Публикация заказа и запуск матчинга.

Запрос:
```json
{
  "candidate_limit": 10
}
```

Ответ `200`:
```json
{
  "id": "uuid",
  "status": "published",
  "notified_candidates": 7
}
```

### `GET /orders/{orderId}`

Карточка заказа со статусами и назначением.

### `GET /orders`

Список заказов текущего пользователя (как клиента или исполнителя).

Параметры:
- `role=client|executor`;
- `status` (опционально);
- `page`, `limit`.

### `POST /orders/{orderId}/cancel`

Отмена заказа.

## 6) Отклик и назначение исполнителя

### `GET /executor/orders/incoming`

Входящие заказы исполнителя.

### `POST /orders/{orderId}/candidates/{candidateId}/accept`

Принятие заказа исполнителем.

Требования:
- обязателен `Idempotency-Key`;
- сервер выполняет атомарную попытку назначения;
- при конкуренции назначается только первый успешный исполнитель.

Ответ `200`:
```json
{
  "result": "accepted",
  "order_id": "uuid",
  "status": "assigned"
}
```

Ответ `409`:
```json
{
  "error": {
    "code": "ORDER_ALREADY_ASSIGNED",
    "message": "Заказ уже назначен другому исполнителю"
  }
}
```

### `POST /orders/{orderId}/candidates/{candidateId}/decline`

Отказ исполнителя от заказа.

## 7) Контакты и коммуникация

### `POST /orders/{orderId}/contact-exchange`

Фиксация факта открытия контактов после назначения.

Ответ `200`:
```json
{
  "status": "contact_shared"
}
```

## 8) Безопасная сделка (опциональный контур)

Этот раздел может быть отключен feature-флагом до этапа 2.

### `POST /orders/{orderId}/secure-deal/create-payment`

Создание платежа у провайдера.

Запрос:
```json
{
  "amount": 25000,
  "currency": "RUB",
  "return_url": "spectaxi://payment-return"
}
```

Ответ `200`:
```json
{
  "payment_id": "uuid",
  "provider": "yookassa",
  "provider_payment_id": "2f8f...",
  "status": "pending",
  "payment_url": "https://..."
}
```

### `GET /orders/{orderId}/payment-status`

Получение текущего платежного статуса.

### `POST /payments/webhooks/{providerCode}`

Webhook от платежного провайдера.

Требования:
- проверка подписи;
- идемпотентность по `provider_event_id`;
- асинхронная обработка;
- фиксация результата в `payment_webhook_events`.

## 9) Справочник статусов

### Заказ (`orders.status`)
- `draft`
- `published`
- `in_negotiation`
- `assigned`
- `in_progress`
- `completed`
- `cancelled`

### Платеж (`payment_records.payment_status`)
- `not_required`
- `pending`
- `authorized`
- `captured`
- `failed`
- `cancelled`
- `refunded`

## 10) Минимальные SLA для API MVP

- `POST /orders/{id}/.../accept`: p95 < 400 мс (критично для гонки назначений).
- `GET /search/executors`: p95 < 600 мс при базовой геовыборке.
- При недоступности платежного провайдера основной сценарий `direct_payment` продолжает работать.
