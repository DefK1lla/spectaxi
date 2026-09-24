# API-контракт MVP (черновик)

## 1) Общие принципы API

- Базовый префикс: `/api/v1`.
- Формат: `application/json`.
- Аутентификация: `Bearer JWT`.
- Время в формате ISO-8601 UTC, в том числе `planned_start_at` (дата и время начала планового заказа).
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

Ответ `200` включает `needs_registration: true`, если нет `full_name` / `current_mode`.

### `POST /auth/complete-registration`

Имя и режим: `client` | `executor`. Пишется в `current_mode`. При `executor` создаётся `executor_profile`.

### `GET /users/me`

Профиль, режим, контакты. Для заказа нужны имя и хотя бы один канал: `contact_phone` | `telegram_url` | `whatsapp_url` | `max_url` | доп. мессенджер.

```json
{
  "full_name": "Иван Петров",
  "current_mode": "client",
  "contact_phone": "+79991234567",
  "telegram_url": "https://t.me/ivan",
  "whatsapp_url": null,
  "max_url": null,
  "messengers": []
}
```

Поля Telegram / WhatsApp / MAX на форме всегда. Доп. мессенджеры — кнопка «добавить».

### `PATCH /users/me`

Профиль, `current_mode`, контакты.

### `PATCH /users/me/mode`

Переключение `current_mode`. При первом переходе в `executor` создаётся `executor_profile`.

### `GET /users/{userId}/reviews`

Публичные отзывы о пользователе как об исполнителе (звёзды, текст, дата, роль автора). Без контактов авторов. Доступно всем авторизованным. Параметры: `page`, `limit`.

## 3) Категории, настройки, парк и тарифы исполнителя

Исполнитель сам добавляет транспорт. В поиске: лицензия категории `approved` (если у типа `license_category` не пустой), при включённом флаге — активная подписка, для срочных заказов — `accepts_urgent_orders`.

### `GET /categories`

Каждый элемент — строка типа транспорта: системный `code`, текст для UI, категория прав, разрешённые тарифы. JSON-конфига лицензий нет.

```json
{
  "id": "uuid",
  "code": "tow_truck",
  "name_ru": "Эвакуатор",
  "license_category": "B",
  "pricing_types": ["hour", "shift", "day", "month", "trip", "km"]
}
```

`license_category: null` — лицензия для типа не нужна.

### `PATCH /executor/profile`

Обновление профиля исполнителя (`avatar_url` файлом, `about`). Сам профиль создаётся автоматически при регистрации в режиме исполнителя или при первом переключении режима; отдельного метода создания нет.

### `GET /executor/settings`

Ответ `200`:
```json
{
  "accepts_urgent_orders": false
}
```

### `PATCH /executor/settings`

Чекбокс «принимаю срочные заказы» на экране профиля. Меняет только исполнитель; сервер сам его не переключает. Флаг на уровне исполнителя, не машины.

Запрос:
```json
{
  "accepts_urgent_orders": true
}
```

При `false` исполнитель не попадает в выдачу по **срочным** заказам; по плановым виден. Если `executor_subscription_enabled` и подписка не `active` — не в поиске вообще (`409 SUBSCRIPTION_REQUIRED` на попытку включить флаг без оплаты).

### `POST /executor/subscription/pay`

Только при включённом флаге. Создаёт платёж подписки; webhook активирует профиль.

### `GET /executor/machinery`

Список единиц транспорта текущего исполнителя (без удалённых), с фото и тарифами.

### `POST /executor/machinery`

`Content-Type: multipart/form-data`. Фото — файлы (`photos[]`), не URL с клиента, **минимум одно**.

Поля формы: `category_id`, `address_text`, `location_lat`, `location_lng`, `pricing_rules` (JSON-строка), файлы фото.

Ошибки:
- `400 VALIDATION_ERROR` — нет типа, нет тарифов, нет ни одного фото, `base_rate <= 0`, неизвестный `pricing_type`;
- `400 PRICING_TYPE_NOT_ALLOWED_FOR_CATEGORY` — тариф не разрешён типу транспорта;
- `403 EXECUTOR_PROFILE_REQUIRED` — нет профиля исполнителя.

Ответ `201` включает `visible_in_search: false`, если лицензия категории ещё не `approved`.

### `POST /executor/licenses`

Документы лицензии на **категорию** (`category_id` + файлы). Статус `pending`, пока админ не подтвердит. Повторная подача по той же категории заменяет pending.

### `GET /executor/licenses`

Список лицензий текущего исполнителя.

### `GET /executor/machinery/{machineryId}`

Карточка своей единицы с фото и тарифами.

### `PATCH /executor/machinery/{machineryId}`

Обновление типа / локации / тарифов. Новые фото — тоже файлами (`multipart`); удалить последнее фото нельзя. Смена ставок **не** трогает уже посчитанные цены в заказах: `order_pricing` фиксируется на момент отправки запроса или правки заказчиком.

### `DELETE /executor/machinery/{machineryId}`

Мягкое удаление: `deleted_at` заполняется, единица исчезает из поиска и из выдачи списка.

Если единица связана с заказом в `in_negotiation` / `awaiting_payment` / `in_progress` / `disputed` — `409 MACHINERY_IN_ACTIVE_ORDER`.

## 4) Поиск

Элемент выдачи — **единица транспорта**, не карточка исполнителя как целого. Контакты в выдаче не отдаются. Занятость по времени не проверяется.

### `GET /search/machinery`

Параметры фильтра заказа — `SEARCH_ALGORITHM.md`:
- `category_id`, `pricing_type`, `quantity`, `search_mode` (обязательные);
- `planned_start_at` (обязателен при `search_mode=planned`, запрещён при `urgent`; на выдачу не влияет, копируется в заказ);
- `lat`, `lng` (обязательные);
- `max_amount`, `radius_km` (опциональные фильтры);
- `exclude_for_order_id` (опционально; при поиске внутри существующего заказа — обязательно передавать).

При `search_mode=urgent` отдаются только исполнители с `accepts_urgent_orders = true`. Сортировка: расстояние, при равенстве цена. Контактов нет. В карточке — ставка выбранного тарифа, `computed_amount`, сводка отзывов исполнителя.

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
      "pricing_type": "hour",
      "unit_rate": 3500,
      "quantity": 8,
      "computed_amount": 28000,
      "currency": "RUB",
      "executor": {
        "user_id": "uuid",
        "full_name": "Иван Петров",
        "avatar_url": "https://...",
        "reviews_avg": 4.7,
        "reviews_count": 12
      }
    }
  ]
}
```

### `GET /search/machinery/{machineryId}`

Экран перед запросом: исполнитель + эта единица + последние отзывы. Контактов нет.

### `GET /categories/{categoryId}/pricing-types`

Тарифы, разрешённые категории (из `category_pricing_types`).

## 5) Заказы клиента

### `POST /orders`

`save_as_draft: true` → статус `draft`, без кандидата. Иначе сразу `published` и запрос одному исполнителю.

В теле: `executor_user_id` и `machinery_unit_id` обязательны, если не черновик; `category_id`, `pricing_type`, `quantity`, `search_mode`, `planned_start_at` (если planned), точка (`address_text`, `location_lat`, `location_lng`), `description` (необязательно), `settlement_mode` (`direct_payment` по умолчанию; `secure_deal` — переключатель на экране отправки, виден только при включённом флаге). Даты окончания нет. Сервер пишет `unit_rate` и `computed_amount` по текущим ставкам машины и `published_at`.

Ошибки:
- `409 PROFILE_INCOMPLETE` — нет имени или ни одного канала связи;
- `409 CANNOT_ORDER_OWN_MACHINERY`;
- `409 LICENSE_NOT_APPROVED` — машина не должна была попасть в поиск;
- `409 EXECUTOR_NOT_ACCEPTING_URGENT` — срочный запрос исполнителю с выключенным флагом;
- `409 SUBSCRIPTION_REQUIRED` — при включённом флаге подписки исполнитель без активной подписки;
- `409 SECURE_DEAL_DISABLED` — `secure_deal` при выключенном `secure_deal_enabled`.

### `PATCH /orders/{orderId}`

Правка полей фильтра (тариф, количество, дата начала, адрес, описание). Цена пересчитывается по **текущим** ставкам машины и фиксируется в `order_pricing`.

- `draft` — любые поля.
- `published` — только если нет кандидата `notified` (иначе `409 PENDING_CANDIDATE`). Статус не меняется.
- `in_negotiation` — `details_version++`, дедлайн подтверждения условий заново, уведомление исполнителю.
- `awaiting_payment` — отменить/вернуть платёж, статус `in_negotiation`, `details_version++`, уведомление исполнителю.

Иначе `409 INVALID_STATE_TRANSITION`.

### `POST /orders/{orderId}/publish`

Черновик → `published` **без кандидата**. Дальше клиент выбирает машину в выдаче (`GET /search/machinery?exclude_for_order_id=...`) и вызывает `request-executor`.

Ответ `201`:
```json
{
  "id": "uuid",
  "status": "published",
  "candidate": null
}
```

### `POST /orders/{orderId}/request-executor`

Отправка запроса исполнителю внутри существующего заказа. Только `published`, нет кандидата в `notified`.

Запрещено, если по заказу у этого исполнителя уже есть `declined`, `auto_declined`, `expired`, `negotiation_rejected` или `terms_expired`. После `withdrawn` — разрешено.

Ошибки: те же, что у `POST /orders` (`PROFILE_INCOMPLETE`, `CANNOT_ORDER_OWN_MACHINERY`, `LICENSE_NOT_APPROVED`, `EXECUTOR_NOT_ACCEPTING_URGENT`, `SUBSCRIPTION_REQUIRED`), плюс `409 PENDING_CANDIDATE`, `409 EXECUTOR_EXCLUDED`.

Запрос:
```json
{
  "executor_user_id": "uuid",
  "machinery_unit_id": "uuid"
}
```

Ответ `201`:
```json
{
  "candidate": {
    "id": "uuid",
    "executor_user_id": "uuid",
    "candidate_status": "notified",
    "response_deadline_at": "2026-09-07T11:25:00Z"
  }
}
```

### `POST /orders/{orderId}/confirm-terms`

Исполнитель фиксирует текущие условия. Только `in_negotiation`, до `terms_confirm_deadline_at`. Тело: `{ "details_version": 2 }`. Несовпадение версии — `409 STALE_ORDER_DETAILS`.

`direct_payment` → `in_progress` + assignment. `secure_deal` → `awaiting_payment` + `payment_deadline_at`.

### `GET /orders/{orderId}`

Карточка заказа со статусом, текущим кандидатом, дедлайнами, ценой и назначением. Открытие из уведомления статус не меняет.

Если исполнитель больше не актуальный кандидат, карточка всё равно отдаётся (можно прочитать, что отказал / не ответил / принял другой заказ). Действия `accept` / `decline` / `confirm-terms` на неактуальном кандидате — `409 ORDER_NO_LONGER_RELEVANT`.

### `GET /orders`

История заказов текущего пользователя. По умолчанию без `cancelled` и без `draft`. Архив отменённых: `status=cancelled`. Черновики: `status=draft`.

Для исполнителя этот же список — входящие и активные (не только из пуша).

Параметры:
- `role=client|executor`;
- `status` (в т.ч. `draft` — вкладка черновиков);
- `page`, `limit`.

### `POST /orders/{orderId}/repeat`

Только для `cancelled` или для `completed` **после принятия** (обе стороны или автоподтверждение). Иначе `409 REPEAT_NOT_ALLOWED`. Создаёт новый заказ с копией полей, `repeated_from_order_id` = исходный, статус `published` без кандидата. Клиент попадает в поиск. На исходном заказе поиск исполнителей не возобновляется.

Ответ `201`:
```json
{
  "id": "uuid",
  "status": "published",
  "repeated_from_order_id": "uuid"
}
```

После отмены клиентом UI сразу спрашивает «искать снова?». После отмены исполнителем (плановый до начала) или системой («исполнитель не найден») тот же вопрос открывается из уведомления клиенту.

### `POST /orders/{orderId}/candidates/{candidateId}/withdraw`

Клиент снимает запрос до принятия или отказа. Кандидат → `withdrawn`, заказ остаётся `published`.

### `POST /orders/{orderId}/reject-negotiation`

Клиент или исполнитель отклоняет партнёра. Доступно на `in_negotiation` **и** `awaiting_payment`. Нужна причина стадии. Кандидат → `negotiation_rejected`, назначение снимается, заказ → `published`. Если на `awaiting_payment` был создан платёж — он отменяется / холд возвращается до смены статуса.

Для исполнителя это единственный способ выйти из заказа до начала работы.

Запрос:
```json
{
  "reason_code": "price_disagreement",
  "reason_text": null
}
```

### `POST /orders/{orderId}/cancel`

Полная отмена. Доступно:

- **клиенту** на `draft` | `published` | `in_negotiation` | `awaiting_payment`;
- **обеим сторонам** на `in_progress`, если заказ плановый и `planned_start_at` ещё не наступил.

Иначе `409 CANCEL_NOT_ALLOWED` (в том числе исполнителю на `in_negotiation` / `awaiting_payment` — ему `reject-negotiation`; и любому на `in_progress` после начала — только спор).

На `published` причина **не нужна**. На остальных — код стадии (`CANCELLATION_REASONS.md`; для планового до начала — стадия `planned_before_start`). Платёж/холд, если есть, отменяется или возвращается, затем `cancelled`.

Запрос:
```json
{
  "reason_code": "found_another",
  "reason_text": null
}
```

Код должен быть разрешён стадии (`400 REASON_NOT_ALLOWED_FOR_STAGE`). При `other` обязателен `reason_text`; рейтинг не меняется, пока админ не разберёт.

Ответ `200` может включать флаг для клиента: показать диалог «искать снова» (`prompt_repeat: true`), если отменил он сам. Если отменил исполнитель — клиенту уходит уведомление с тем же вопросом.

### `POST /orders/{orderId}/disputes`

Только из `in_progress` или `completed` (в том числе после подтверждения одной стороны). Иначе `409 DISPUTE_NOT_ALLOWED`.

`multipart/form-data`: `reason_code` обязателен (коды стадии; `not_paid` — только при `direct_payment`), при `other` — `reason_text`. Фото к причине нет.

Переводит заказ в `disputed`, создаёт тред, отменяет таймер автоприёмки (`execution_confirm_deadline_at`), если он шёл. Из приложения пишут клиент и исполнитель.

Если по заказу уже есть закрытый спор — `409 USE_APPEAL` (нужен `POST .../dispute/appeal`).

Админ в эти методы приложения не ходит.

### `POST /orders/{orderId}/dispute/appeal`

После того как админ закрыл спор. Та же запись `disputes` снова `open`, `appeal_used = true`. Не больше одной апелляции.

Иначе `409 APPEAL_NOT_ALLOWED` или `409 APPEAL_LIMIT_REACHED`.

Тело: текст, почему не согласны с решением (`reason_text`).

### `GET /orders/{orderId}/dispute`

Одна запись спора и её сообщения.

### `POST /orders/{orderId}/dispute/messages`

Сообщение от клиента или исполнителя. `multipart/form-data`: `body` + опционально `photos[]` (файлы).

Запрос (если без фото, можно JSON):
```json
{
  "body": "Текст"
}
```

### `POST /orders/{orderId}/confirm-execution`

Любая сторона на `in_progress`. Когда подтвердили оба — `completed` и выплата при сделке. Если подтвердил один — ставится `execution_confirm_deadline_at` = сейчас + 1 сутки; молчание второй стороны → автоподтверждение (`late_confirm` −3 молчавшему). Открытый спор до истечения таймера — таймер снимается.

### `POST /orders/{orderId}/reviews`

`{ "stars": 5, "body": null }` после `completed`, по одному от каждой стороны. Иначе `409 REVIEW_NOT_ALLOWED`.

## 6) Отклик исполнителя

Отдельной выдачи «только из пуша» нет: у исполнителя список входящих через `GET /orders?role=executor` и экран уведомлений.

### `POST /orders/{orderId}/candidates/{candidateId}/accept`

Первое принятие. Только `published`, до дедлайна. После успеха — контакты, статус `in_negotiation`, `terms_confirm_deadline_at` = сейчас + 1 сутки. Условия здесь не фиксируются.

Если принятый заказ **срочный** — все остальные `notified` кандидаты **этого исполнителя** по другим **срочным** заказам (по любой его машине) → `auto_declined`; их заказы остаются `published`; клиентам уведомление «исполнитель отказался». Кандидаты по плановым заказам не трогаются. Если принятый заказ плановый — ничего не закрывается. Флаг `accepts_urgent_orders` не меняется.

Требования:
- обязателен `Idempotency-Key`;
- атомарно относительно истечения 5 минут; автоотказ остальных срочных — в той же транзакции.

Ответ `200`:
```json
{
  "result": "accepted",
  "order_id": "uuid",
  "status": "in_negotiation",
  "terms_confirm_deadline_at": "2026-09-08T11:20:00Z"
}
```

После успеха фиксируется обмен контактами. Цена заказа здесь не выставляется.

Ошибки:
- `409 ORDER_NO_LONGER_RELEVANT` — дедлайн прошёл, уже отказ/автоотказ/истечение, заказ не в `published`;
- `409 PROFILE_INCOMPLETE` — нет имени или ни одного канала;
- `409 SUBSCRIPTION_REQUIRED` — при включённом флаге подписки без активной подписки;
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

Фиксация условий — `POST /orders/{orderId}/confirm-terms`, не этот метод.

## 7) Контакты

Обмен фиксируется при первом `accept`. Показываются `contact_phone`, `telegram_url`, `whatsapp_url`, `max_url`, доп. `messengers`.

## 8) Безопасная сделка (опциональный контур)

Этот раздел может быть отключен feature-флагом до этапа 2.

### `POST /orders/{orderId}/secure-deal/create-payment`

Создание платежа у провайдера. Только `awaiting_payment` + `secure_deal`. Сумма = `order_pricing.computed_amount` (клиент сумму не передаёт). После холда `authorized` → `in_progress`.

Запрос:
```json
{
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

Если провайдер вернул холд по `expires_at` и статус платежа был `authorized` — заказ → `disputed`. Неоплаченный заказ провайдер не трогает; наш таймаут возвращает заказ в `published`. Срок жизни холда у провайдера — открытый вопрос (`PRODUCT_FOUNDATION.md`, раздел 12).

## 8.1) Уведомления

Перечень событий — `USER_SCENARIOS.md`, раздел 13.

### `GET /notifications`

Лента текущего пользователя, новые сверху.

Параметры: `page`, `limit`, `unread=true` (опционально).

### `POST /notifications/{notificationId}/read`

Пометить прочитанным. На статус кандидата не влияет.

## 9) Админка (не мобильное приложение)

Закрытие спора, сообщения админа, блокировки, отмена заказов и разбор `other` — только здесь.

### `POST /admin/licenses/{licenseId}/review`

`{ "decision": "approved" | "rejected", "comment": null }`. Исполнителю уведомление.

### `POST /admin/orders/{orderId}/dispute/messages`

Сообщение от админа. Тоже можно прикрепить фото (`photos[]`).

### `POST /admin/orders/{orderId}/dispute/close`

Админ выбирает статус, в который перевести заказ: только `completed`, `cancelled`, `in_progress`. Нельзя `published`.

Запрос:
```json
{
  "status": "cancelled",
  "sanction_client_delta": null,
  "sanction_executor_delta": null
}
```

Деньги:

- платёж `authorized` (холд, ещё не выплата) — админ может выплатить или вернуть;
- платёж уже `captured` — денег не трогать, только статус и опциональные санкции; закрытие в `cancelled` возврата **не** делает;
- платежа не было — денег нет.

### `POST /admin/orders/{orderId}/cancel`

Отмена заказа админом из любого статуса, кроме `completed`. На `disputed` одновременно закрывает спор с исходом `cancelled`. Холд `authorized` возвращается; `captured` не трогается. `cancelled_by_role = admin`, штрафа нет, обеим сторонам уведомление.

Запрос: `{ "comment": "Причина для аудита" }`.

Типовое применение — открытые заказы заблокированного пользователя.

### `POST /admin/users/{userId}/block` / `POST /admin/users/{userId}/unblock`

`{ "reason": "..." }`. Заполняет / очищает `blocked_at`, `blocked_reason`. Заблокированный: не в поиске, не создаёт и не принимает заказы; его ожидающие кандидаты закрываются как `declined` без штрафа; активные заказы админ отменяет отдельно `POST /admin/orders/{id}/cancel`.

### `GET /admin/rating-events?status=pending_admin`

Очередь событий с причиной `other`.

### `POST /admin/rating-events/{eventId}/resolve`

`{ "delta": -6, "comment": null }`. Проставляет дельту (в пределах шкалы) и закрывает событие. `delta: 0` — без штрафа.

## 10) Справочник статусов

### Заказ (`orders.status`)
- `draft`
- `published`
- `in_negotiation`
- `awaiting_payment`
- `in_progress`
- `completed`
- `disputed`
- `cancelled`

### Кандидат (`order_candidates.candidate_status`)
- `notified`
- `accepted`
- `declined`
- `auto_declined`
- `expired`
- `withdrawn`
- `negotiation_rejected`
- `terms_expired`

### Платеж (`payment_records.payment_status`)
- `not_required`
- `pending`
- `authorized`
- `captured`
- `failed`
- `cancelled`
- `refunded`

## 11) Фоновые задачи

- 5 минут: `notified` → `expired`, заказ `published`, исполнителю −3.
- 1 сутки: `terms_confirm_deadline_at` → `terms_expired`, заказ `published`, −3.
- 1 сутки: `payment_deadline_at` → платёж отменить, заказ `published`, клиенту −3.
- 1 сутки: `execution_confirm_deadline_at` → автоподтверждение, `completed`, `late_confirm` −3.
- «Исполнитель не найден»: `published` без `notified` — срочный через 24 ч после `published_at`, плановый при `planned_start_at` → `cancelled` (system).

## 12) Минимальные SLA для API MVP

- Первое `accept` / истечение 5 минут / автоотказ остальных срочных: атомарность важнее гонки.
- `GET /search/machinery`: p95 < 600 мс при базовой геовыборке.
- При недоступности платежного провайдера основной сценарий `direct_payment` продолжает работать.
