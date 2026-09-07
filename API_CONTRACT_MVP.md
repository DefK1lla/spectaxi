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
    "code": "ORDER_NO_LONGER_RELEVANT",
    "message": "Заказ уже не актуален",
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

Текущий профиль, включая `full_name`, `contact_phone` и мессенджеры. Для создания и принятия заказа обязательны имя и телефон для связи.

```json
{
  "full_name": "Иван Петров",
  "contact_phone": "+79991234567",
  "messengers": [
    { "name": "Telegram", "url": "https://t.me/ivan" }
  ]
}
```

Кнопка «добавить мессенджер» на клиенте добавляет ещё один объект `{ name, url }`. Название и ссылка — свободные строки.

### `PATCH /users/me`

Обновление профиля, телефона для связи и массива `messengers`.

## 3) Категории, настройки, парк и тарифы исполнителя

Исполнитель сам добавляет транспорт и тарифы на каждую единицу. Лимита на число единиц нет. Видимость в поиске задаёт `accepts_orders`, не статус единицы техники.

### `GET /categories`

Список типов транспорта.

Ответ `200`:
```json
{
  "items": [
    { "id": "uuid", "code": "tow_truck", "name": "Эвакуатор", "pricing_types": ["hour", "shift", "day", "month", "trip", "km"] },
    { "id": "uuid", "code": "crane", "name": "Кран", "pricing_types": ["hour", "shift", "day", "month"] }
  ]
}
```

### `POST /executor/profile`

Создание/обновление профиля исполнителя, в том числе `avatar_url`.

### `GET /executor/settings`

Ответ `200`:
```json
{
  "accepts_orders": false
}
```

### `PATCH /executor/settings`

Запрос:
```json
{
  "accepts_orders": true
}
```

При `accepts_orders: false` исполнитель не показывается в поиске и не получает новые запросы.

### `GET /executor/machinery`

Список единиц транспорта текущего исполнителя (без удалённых), с фото и тарифами.

### `POST /executor/machinery`

`Content-Type: multipart/form-data`. Фото — файлы (`photos[]`), не URL с клиента.

Поля формы: `category_id`, `address_text`, `location_lat`, `location_lng`, `pricing_rules` (JSON-строка), файлы фото.

Ответ `201`:
```json
{
  "id": "uuid"
}
```

Ошибки:
- `400 VALIDATION_ERROR` — нет типа, нет тарифов, `base_rate <= 0`, неизвестный `pricing_type`;
- `400 PRICING_TYPE_NOT_ALLOWED_FOR_CATEGORY` — тариф не разрешён типу транспорта;
- `403 EXECUTOR_PROFILE_REQUIRED` — роль исполнителя не включена.

### `GET /executor/machinery/{machineryId}`

Карточка своей единицы с фото и тарифами.

### `PATCH /executor/machinery/{machineryId}`

Обновление типа / локации / тарифов. Новые фото — тоже файлами (`multipart`).

### `DELETE /executor/machinery/{machineryId}`

Мягкое удаление: `deleted_at` заполняется, единица исчезает из поиска и из выдачи списка.

Если единица связана с заказом в `in_negotiation` / `assigned` / `awaiting_payment` / `in_progress` / `disputed` — `409 MACHINERY_IN_ACTIVE_ORDER`.

## 4) Поиск

Элемент выдачи — **единица транспорта**, не карточка исполнителя как целого. Контакты в выдаче не отдаются.

### `GET /search/machinery`

Параметры:
- `category_id` (обязательный);
- `lat`, `lng` (обязательные);
- `search_mode` (`urgent` | `planned`);
- `planned_start_at` (для `planned`);
- `duration_minutes` (опционально);
- `radius_km` (опционально);
- `exclude_for_order_id` (опционально) — скрыть исполнителей с `declined` / `negotiation_rejected` по заказу.

Список: плоский массив карточек машин. Карта группирует элементы с одинаковыми координатами: на точке число `+N`, по клику — список машин этой точки (снизу).

Ответ `200`:
```json
{
  "items": [
    {
      "machinery_unit_id": "uuid",
      "category_id": "uuid",
      "cover_photo_url": "https://...",
      "address_text": "Москва, Каширское шоссе, 31",
      "location_lat": 55.618,
      "location_lng": 37.688,
      "distance_km": 3.2,
      "pricing_rules": [
        { "pricing_type": "hour", "from_amount": 3500, "currency": "RUB" },
        { "pricing_type": "shift", "from_amount": 25000, "currency": "RUB" }
      ],
      "executor": {
        "user_id": "uuid",
        "full_name": "Иван Петров",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

### `GET /search/machinery/{machineryId}`

Экран перед запросом: исполнитель + эта единица. Контактов нет.

### `GET /categories/{categoryId}/pricing-types`

Тарифы, разрешённые категории (из `category_pricing_types`).

## 5) Заказы клиента

### `POST /orders`

Создание заказа и отправка запроса **одному** исполнителю. Статус сразу `published`. Черновик в API не создаётся.

Запрос:
```json
{
  "executor_user_id": "uuid",
  "machinery_unit_id": "uuid",
  "category_id": "uuid",
  "search_mode": "urgent",
  "settlement_mode": "direct_payment",
  "address_text": "Москва, Ленинский проспект, 10",
  "location_lat": 55.6761,
  "location_lng": 37.5667,
  "planned_start_at": null,
  "planned_duration_minutes": null,
  "description": "Нужен эвакуатор для легкового авто"
}
```

`executor_user_id` и `machinery_unit_id` обязательны. Нельзя отправить запрос своей единице (`409 CANNOT_ORDER_OWN_MACHINERY`). Нельзя отправить запрос исполнителю с `declined` / `negotiation_rejected` по этому заказу. После `expired` и `withdrawn` — можно.

Если у клиента нет `full_name` или `contact_phone` — `409 PROFILE_INCOMPLETE` (предупреждение и ссылка в профиль).

Ответ `201`:
```json
{
  "id": "uuid",
  "status": "published",
  "candidate": {
    "id": "uuid",
    "executor_user_id": "uuid",
    "candidate_status": "notified",
    "response_deadline_at": "2026-09-07T11:25:00Z"
  }
}
```

### `POST /orders/{orderId}/request-executor`

Отправка запроса следующему исполнителю. Только `published`, нет кандидата в `notified` / `viewed`. Нельзя свою технику (`409 CANNOT_ORDER_OWN_MACHINERY`). Если нет `full_name` или `contact_phone` — `409 PROFILE_INCOMPLETE`.

Запрещено, если по заказу у этого исполнителя уже есть `declined` или `negotiation_rejected`. После `expired` и `withdrawn` — разрешено.

Запрос:
```json
{
  "executor_user_id": "uuid",
  "machinery_unit_id": "uuid"
}
```

### `POST /orders/{orderId}/submit-agreed-price`

Заказчик после переговоров указывает оговоренную цену и отправляет на подтверждение исполнителю.

Только при `status=in_negotiation`.

Запрос:
```json
{
  "agreed_amount": 12000,
  "currency": "RUB"
}
```

Ответ `200`:
```json
{
  "id": "uuid",
  "status": "assigned"
}
```

### `GET /orders/{orderId}`

Карточка заказа со статусом, текущим кандидатом, дедлайном, ценой и назначением.

Если текущий пользователь — исполнитель, и он больше не актуальный кандидат (истёк таймер, отказ, выбран другой), ответ `409`:
```json
{
  "error": {
    "code": "ORDER_NO_LONGER_RELEVANT",
    "message": "Заказ уже не актуален"
  }
}
```

### `GET /orders`

История заказов текущего пользователя. По умолчанию без `cancelled`. Архив отменённых: `status=cancelled`.

Для исполнителя этот же список — входящие и активные (не только из пуша).

Параметры:
- `role=client|executor`;
- `status` (опционально);
- `page`, `limit`.

### `POST /orders/{orderId}/repeat`

Только для `cancelled` или для `completed` **после принятия** (клиент подтвердил или автоприёмка). Иначе `409 REPEAT_NOT_ALLOWED`. Создаёт новый заказ с копией полей, `repeated_from_order_id` = исходный, статус `published` без кандидата. Клиент попадает в поиск. На исходном заказе поиск исполнителей не возобновляется.

Ответ `201`:
```json
{
  "id": "uuid",
  "status": "published",
  "repeated_from_order_id": "uuid"
}
```

После отмены клиентом UI сразу спрашивает «искать снова?». После отмены исполнителем тот же вопрос открывается из уведомления клиенту.

### `POST /orders/{orderId}/candidates/{candidateId}/withdraw`

Клиент снимает запрос до принятия или отказа. Кандидат → `withdrawn`, заказ остаётся `published`.

### `POST /orders/{orderId}/reject-negotiation`

Клиент или исполнитель отклоняет партнёра (`in_negotiation` или `assigned`). Нужна причина стадии. Кандидат → `negotiation_rejected`, заказ → `published`.

Запрос:
```json
{
  "reason_code": "price_disagreement",
  "reason_text": null
}
```

### `POST /orders/{orderId}/cancel`

Отмена кнопкой только на `published` | `in_negotiation` | `assigned` | `awaiting_payment`. Иначе `409 CANCEL_NOT_ALLOWED`.

На `published` причина **не нужна**. На остальных — код стадии (`CANCELLATION_REASONS.md`).

Запрос:
```json
{
  "reason_code": "found_another",
  "reason_text": null
}
```

Справочник — `CANCELLATION_REASONS.md`. Код должен быть разрешён стадии (`400 REASON_NOT_ALLOWED_FOR_STAGE`). При `other` обязателен `reason_text`; рейтинг не меняется, пока админ не разберёт.

Ответ `200` может включать флаг для клиента: показать диалог «искать снова» (`prompt_repeat: true`), если отменил он сам. Если отменил исполнитель — клиенту уходит уведомление с тем же вопросом.

### `POST /orders/{orderId}/disputes`

Только из `in_progress` или `completed` (в том числе после подтверждения клиента). Иначе `409 DISPUTE_NOT_ALLOWED`.

`multipart/form-data`: `reason_code` обязателен (коды стадии), при `other` — `reason_text`. Фото к причине нет.

Переводит заказ в `disputed`, создаёт тред. Из приложения пишут клиент и исполнитель.

Если по заказу уже есть закрытый спор — `409 USE_APPEAL` (нужен `POST .../dispute/appeal`).

Админ в эти методы приложения не ходит.

### `POST /orders/{orderId}/dispute/appeal`

После того как админ закрыл спор. Новый тред, `is_appeal = true`, заказ снова `disputed`. Не больше одной апелляции на заказ.

Иначе `409 APPEAL_NOT_ALLOWED` или `409 APPEAL_LIMIT_REACHED`.

Тело: текст, почему не согласны с решением (`reason_text`).

### `GET /orders/{orderId}/dispute`

Треды заказа (первый спор и апелляция, если есть) и сообщения текущего открытого.

### `POST /orders/{orderId}/dispute/messages`

Сообщение от клиента или исполнителя. `multipart/form-data`: `body` + опционально `photos[]` (файлы).

Запрос (если без фото, можно JSON):
```json
{
  "body": "Текст"
}
```

## Админка (не мобильное приложение)

Закрытие спора и сообщения админа — только здесь.

### `POST /admin/orders/{orderId}/dispute/messages`

Сообщение от админа. Тоже можно прикрепить фото (`photos[]`).

### `POST /admin/orders/{orderId}/dispute/close`

Админ выбирает статус, в который перевести заказ: только `completed`, `cancelled`, `in_progress`. Нельзя `published`.

Запрос:
```json
{
  "status": "cancelled"
}
```

`status`: только `completed` | `cancelled` | `in_progress`. Нельзя `published`. Деньги следуют решению: `completed` — выплата или оставить выплаченное; `cancelled` — возврат (в том числе уже выплаченного).

### `POST /orders/{orderId}/complete`

Исполнитель переводит заказ `in_progress` → `completed`. Клиенту уведомление. Ставится `completion_review_deadline_at` = сейчас + 1 сутки. После этого отмена заказа недоступна. Если клиент не ответил до дедлайна — автоприёмка (`decision=confirmed`, `source=auto_timeout`), выплата, минус рейтингу клиента.

### `POST /orders/{orderId}/complete-review`

Клиент после `completed`: подтвердить или отклонить. Затем уведомление исполнителю.

При `confirmed` и `secure_deal` — выплата исполнителю.

При `declined`: обязательны `reason_code` и при `other` — `reason_text`. Статус заказа → `disputed`, создаётся тред. Фото — в сообщениях треда.

Запрос:
```json
{
  "decision": "confirmed"
}
```

`decision`: `confirmed` | `declined`. При `declined` поля причины как у `POST /orders/{orderId}/disputes`.

## 6) Отклик исполнителя

Отдельной выдачи «только из пуша» нет: у исполнителя список входящих через `GET /orders?role=executor` и экран уведомлений.

### `POST /orders/{orderId}/candidates/{candidateId}/accept`

Первое принятие. Только `published`, только до `response_deadline_at`. Если нет `full_name` или `contact_phone` — `409 PROFILE_INCOMPLETE`.

Требования:
- обязателен `Idempotency-Key`;
- атомарно относительно истечения 5 минут.

Ответ `200`:
```json
{
  "result": "accepted",
  "order_id": "uuid",
  "status": "in_negotiation"
}
```

После успеха фиксируется обмен контактами. Цена заказа здесь не выставляется.

Ошибки:
- `409 ORDER_NO_LONGER_RELEVANT` — дедлайн прошёл, уже отказ/истечение, заказ не в `published`;
- `409 INVALID_STATE_TRANSITION`.

### `POST /orders/{orderId}/candidates/{candidateId}/decline`

Первый отказ исполнителя. Заказ остаётся `published`. Нужна причина (пишется в `order_candidates.reject_reason_*`, не в заказ).

Запрос:
```json
{
  "reason_code": "busy_or_broken",
  "reason_text": null
}
```

### `POST /orders/{orderId}/confirm`

Второе принятие или отказ после `assigned` (заказчик уже отправил оговоренную цену).

Запрос:
```json
{
  "action": "decline",
  "reason_code": "price_disagreement",
  "reason_text": null
}
```

`action`: `accept` | `decline`. При `decline` причина обязательна.

При `accept` — создаётся `order_assignment`. Дальше: `direct_payment` → `in_progress`; `secure_deal` → `awaiting_payment` (ставится `payment_deadline_at` = сейчас + 1 сутки). Если за сутки холд не успешен — автоотмена, минус клиенту.  
При `decline` (несогласие с ценой) — `in_negotiation`, клиенту уведомление, нужна причина, событие рейтинга. Таймера нет.

## 7) Контакты

Обмен фиксируется при первом `accept`. Показываются контакты **обеих** сторон из профиля пользователя (`contact_phone`, `messengers`).

## 8) Безопасная сделка (опциональный контур)

Этот раздел может быть отключен feature-флагом до этапа 2.

### `POST /orders/{orderId}/secure-deal/create-payment`

Создание платежа у провайдера. Только при `status=awaiting_payment` и `settlement_mode=secure_deal`. После успешного холда заказ → `in_progress`.

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
- если провайдер вернул холд по `expires_at` — заказ → `disputed`.

## 8.1) Уведомления

### `GET /notifications`

Лента текущего пользователя, новые сверху.

Параметры: `page`, `limit`, `unread=true` (опционально).

### `POST /notifications/{notificationId}/read`

Пометить прочитанным.

## 9) Справочник статусов

### Заказ (`orders.status`)
- `published`
- `in_negotiation`
- `assigned`
- `awaiting_payment`
- `in_progress`
- `completed`
- `disputed`
- `cancelled`

### Кандидат (`order_candidates.candidate_status`)
- `notified`
- `viewed`
- `accepted`
- `declined`
- `expired`
- `withdrawn`
- `negotiation_rejected`

### Платеж (`payment_records.payment_status`)
- `not_required`
- `pending`
- `authorized`
- `captured`
- `failed`
- `cancelled`
- `refunded`

## 10) Минимальные SLA для API MVP

- Первое `accept` / истечение 5 минут: атомарность важнее гонки нескольких исполнителей (одновременно ждёт один).
- `GET /search/machinery`: p95 < 600 мс при базовой геовыборке.
- При недоступности платежного провайдера основной сценарий `direct_payment` продолжает работать.
