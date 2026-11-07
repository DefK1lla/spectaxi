# API-контракт MVP (черновик)

## 1) Общие принципы API

- Базовый префикс: `/api/v1`.
- Формат: `application/json`.
- Аутентификация: `Bearer JWT`.
- Время в формате ISO-8601 UTC, в том числе `planned_start_at` (дата и время начала планового заказа).
- Операции с деньгами **всегда** требуют заголовок `Idempotency-Key` (каталог — §8.0). Остальные изменения заказа — идемпотентны там, где возможны повторы (`Idempotency-Key`).

Служебные эндпоинты под тем же префиксом `/api/v1` (не для мобильного приложения):

- `GET /api/v1/health` — liveness: процесс жив, без проверки зависимостей; всегда `200` `{ "status": "ok" }` пока процесс отвечает; без авторизации;
- `GET /api/v1/ready` — readiness: зависимости готовы. Пока БД нет — как `health`. После Prisma: `200` `{ "status": "ok" }`, если база доступна, иначе `503`; без авторизации; внешний пинг (UptimeRobot) бьёт сюда;
- `GET /api/v1/admin/health` — заглушка админ-модуля (тот же Nest-процесс); без авторизации на скелете, позже — admin JWT;
- `GET /api/v1/metrics` — метрики в формате Prometheus, только с заголовком `Authorization: Bearer <METRICS_TOKEN>`; без персональных данных (`TECH_STACK.md`, раздел «Мониторинг»).

Структура Nest-модулей: `BACKEND_STRUCTURE.md`.  
Загрузка файлов (`multipart`): клиент шлёт байты, не URL; API пишет через порт `ObjectStorage` (`TECH_STACK.md` § «Файлы»).

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

### `GET /auth/phone-support`

Проверка «есть ли у нас OTP-провайдер под этот номер», пока пользователь вводит телефон (клиент дергает с debounce). Без авторизации. Не отправляет код.

Параметры: `phone` (E.164 или незавершённый ввод в международном формате с `+`; при слишком коротком вводе — `supported: false` без ошибки).

Ответ `200`:

```json
{
  "supported": true
}
```

или

```json
{
  "supported": false,
  "message": "Пока не работаем с номерами этой страны"
}
```

`supported` = среди настроенных OTP-адаптеров (Telegram Gateway / SMS) есть тот, что принимает этот номер. Отдельного списка стран в клиенте нет. IP не используется.

### `POST /auth/request-code`

Запрос кода подтверждения по номеру телефона. Перед отправкой та же проверка, что у `phone-support`; при `supported: false` — ошибка ниже, код не шлётся.

Запрос:

```json
{
  "phone": "+79991234567"
}
```

Код уходит в Telegram, если номер там зарегистрирован, иначе по SMS (`TECH_STACK.md`).

Ответ `200`:

```json
{
  "status": "code_sent",
  "channel": "telegram",
  "retry_after_sec": 60
}
```

Ошибки:

- `400 PHONE_NOT_SUPPORTED` — нет OTP-провайдера под номер (тот же смысл, что `supported: false` у `phone-support`);
- `429 TOO_MANY_REQUESTS` — повторный запрос раньше `retry_after_sec` или превышен лимит на номер / IP; в `details.retry_after_sec` — через сколько можно снова.

### `POST /auth/verify-code`

Подтверждение кода и выдача токенов.

Запрос:

```json
{
  "phone": "+79991234567",
  "code": "1234"
}
```

Ответ `200`: `access_token` (короткий), `refresh_token`; `needs_registration: true`, если нет `full_name` / `current_mode`.

Ошибки:

- `400 INVALID_CODE` — неверный или истёкший код;
- `429 TOO_MANY_ATTEMPTS` — исчерпаны попытки ввода, нужен новый код.

### `POST /auth/refresh`

`{ "refresh_token": "..." }` → новая пара токенов, старый refresh отзывается. Отозванный / истёкший / пользователь заблокирован — `401 UNAUTHORIZED`.

### `POST /auth/logout`

`{ "refresh_token": "...", "expo_push_token": "..." }` — отзывает refresh-токен и отвязывает push-токен этого устройства.

### `PUT /users/me/push-devices`

`{ "expo_push_token": "ExponentPushToken[...]", "platform": "ios" | "android" }`. Привязать устройство к текущему пользователю (при входе и при обновлении токена). Если токен был у другого пользователя — перепривязывается.

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

Публичные отзывы о пользователе. Параметр `role=executor` (по умолчанию) — отзывы о нём как об исполнителе: звёзды, текст, дата, роль автора. `role=client` — только сводка (`avg`, `count`), без текста; используется в карточке входящего запроса у исполнителя. Без контактов авторов. Доступно всем авторизованным. Параметры: `page`, `limit`.

## 3) Категории, настройки, парк и тарифы исполнителя

Исполнитель сам добавляет транспорт. В поиске: лицензия категории `approved`, при включённом флаге — активная подписка, для срочных заказов — `accepts_urgent_orders`. Типы транспорта и типы лицензий создаёт админ.

### `GET /categories`

Каждый элемент — активная строка типа транспорта: системный `code`, текст для UI, тип лицензии, разрешённые тарифы. JSON-конфига лицензий нет.

```json
{
  "id": "uuid",
  "code": "tow_truck",
  "name_ru": "Эвакуатор",
  "license_type": { "id": "uuid", "code": "B", "name_ru": "Категория B" },
  "pricing_types": ["hour", "shift", "day", "month", "trip", "km"]
}
```

Тип лицензии у категории обязателен.

### `PATCH /executor/profile`

`multipart/form-data`: `about`, файл `avatar` (не URL с клиента; в ответе — `avatar_url`). Сам профиль создаётся автоматически при регистрации в режиме исполнителя или при первом переключении режима; отдельного метода создания нет.

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

### `GET /executor/payout-card`

`{ "card_mask": "•••• 1234", "added_at": "..." }` или `null`.

### `PUT /executor/payout-card`

Привязать или заменить карту для выплат по безопасной сделке. Карту исполнитель вводит в виджете ЮKassa, в API приходит только синоним.

Запрос:

```json
{
  "payout_token": "<синоним карты от ЮKassa>",
  "card_mask": "•••• 1234"
}
```

### `DELETE /executor/payout-card`

Удалить карту. `409 PAYOUT_PENDING`, если по заказу исполнителя со сделкой платёж `authorized` (ждёт выплаты).

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

Документы лицензии на **категорию** (`category_id` + файлы с `doc_kind`: `driver_license` | `equipment_usage_right`). Нужны оба вида. Статус `pending`, пока админ не верифицирует. Срока действия нет. Повторная подача по той же категории заменяет pending.

### `GET /executor/licenses`

Список лицензий текущего исполнителя.

### `GET /executor/machinery/{machineryId}`

Карточка своей единицы с фото и тарифами.

### `PATCH /executor/machinery/{machineryId}`

Обновление типа / локации / тарифов. Новые фото — тоже файлами (`multipart`). Смена ставок **не** трогает уже посчитанные заказы: `unit_rate` в заказе — снимок на отправку запроса (`PRODUCT_FOUNDATION.md` «Цена заказа»).

### `DELETE /executor/machinery/{machineryId}/photos/{photoId}`

Удаление фото. Последнее фото удалить нельзя — `409 LAST_PHOTO`.

### `DELETE /executor/machinery/{machineryId}`

Мягкое удаление: `deleted_at` заполняется, единица исчезает из поиска и из выдачи списка.

Если единица связана с заказом в `in_negotiation` / `awaiting_payment` / `scheduled` / `in_progress` / `disputed` — `409 MACHINERY_IN_ACTIVE_ORDER`.

## 4) Поиск

Элемент выдачи — **единица транспорта**, не карточка исполнителя как целого. Контакты в выдаче не отдаются. Занятость по времени не проверяется.

### `GET /search/machinery`

Параметры фильтра заказа — `SEARCH_ALGORITHM.md`:

- `category_id`, `pricing_type`, `quantity`, `search_mode` (обязательные);
- `planned_start_at` (обязателен при `search_mode=planned`, запрещён при `urgent`);
- `planned_end_at` (обязателен при `planned`, > `planned_start_at`; при `urgent` опционален — «нужно к»);
- `lat`, `lng` (обязательные);
- `max_amount`, `radius_km` (опциональные фильтры);
- `exclude_for_order_id` (опционально; при поиске внутри существующего заказа — обязательно передавать).

При `search_mode=urgent` — только `accepts_urgent_orders = true`. Исполнители, занятые по пересечению окон с этим фильтром, **не** отдаются (`SEARCH_ALGORITHM.md` §6). Сортировка: расстояние, при равенстве цена. Контактов нет. В карточке — ставка, `computed_amount`, сводка отзывов.

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

## 4.1) Адреса

Ключ DaData хранится только на сервере; приложение ходит сюда.

### `GET /geo/suggest`

Подсказки адреса при вводе. Параметры: `q` (обязательный, от 3 символов), `lat`, `lng` (опционально — приоритет подсказок рядом). Ответ — до 10 вариантов `{ "address_text", "location_lat", "location_lng" }`; вариант без координат (например, только город) в выдачу не попадает. Ответы кэшируются на сервере.

### `GET /geo/reverse`

Точка на карте → адрес. Параметры: `lat`, `lng`. Ответ `{ "address_text", "location_lat", "location_lng" }` или `404 ADDRESS_NOT_FOUND`.

## 5) Заказы клиента

### `POST /orders`

`save_as_draft: true` → статус `draft`, без кандидата. Иначе сразу `published` и запрос одному исполнителю.

В теле: `executor_user_id` и `machinery_unit_id` обязательны, если не черновик; `category_id`, `pricing_type`, `quantity`, `search_mode`, `planned_start_at` + `planned_end_at` (если planned; начало **в будущем**, конец **строго позже** начала), при urgent — опционально только `planned_end_at` («нужно к»), точка (`address_text`, `location_lat`, `location_lng`), `description` (необязательно), `settlement_mode` (`direct_payment` по умолчанию; `secure_deal` — переключатель на экране отправки). Сервер пишет `unit_rate` и `computed_amount` по текущим ставкам машины и `search_activity_at`. При `secure_deal` — ещё `deal_fee_amount` и `amount_to_pay`.

Ошибки:

- `400 VALIDATION_ERROR` — в т.ч. нет/невалидно окно при `planned`; `planned_start_at` при `urgent`; `planned_end_at` ≤ start;
- `409 PROFILE_INCOMPLETE` — нет имени или ни одного канала связи;
- `409 CANNOT_ORDER_OWN_MACHINERY`;
- `409 LICENSE_NOT_APPROVED` — машина не должна была попасть в поиск;
- `409 EXECUTOR_NOT_ACCEPTING_URGENT` — срочный запрос исполнителю с выключенным флагом;
- `409 EXECUTOR_BUSY_WINDOW` — окно заказа пересекается с занятостью исполнителя (он не должен был быть в выдаче; гонка/устаревший UI);
- `409 SUBSCRIPTION_REQUIRED` — при включённом флаге подписки исполнитель без активной подписки;
- `409 SECURE_DEAL_DISABLED` — `secure_deal` при выключенном `secure_deal_enabled`.

### `PATCH /orders/{orderId}`

Правка полей фильтра (тариф, количество, окно `planned_start_at` / `planned_end_at`, адрес, описание; на `draft` / `published` — ещё и `settlement_mode`). Если по заказу уже был снимок `unit_rate` (запрос отправлен): `quantity` → `computed_amount = unit_rate × quantity` без обновления ставки с машины; смена `pricing_type` → новый снимок ставки. Пока запроса машине не было (только черновик/поиск) — ориентир по текущим ставкам в выдаче. После `scheduled` / `in_progress` правки объёма/цены/окна нет (MVP).

- `draft` — любые поля.
- `published` — только если нет кандидата `notified` (иначе `409 PENDING_CANDIDATE`). Статус не меняется, `search_activity_at` обновляется.
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

Отправка запроса исполнителю внутри существующего заказа. Только `published`, нет кандидата в `notified`. Обновляет `search_activity_at`.

Запрещено, если по заказу у этого исполнителя уже есть `declined`, `auto_declined`, `expired`, `negotiation_rejected` или `terms_expired`. После `withdrawn` — разрешено: **UPDATE** той же строки кандидата снова в `notified` (в БД unique `(order_id, executor_user_id)` — `DOMAIN_MODEL_AND_ERD.md` §5).

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

Исполнитель фиксирует текущие условия. Только `in_negotiation`. Дедлайн: `terms_confirm_deadline_at` плюс **30 секунд форы** (`ORDER_STATE_MACHINE.md` §7). Тело: `{ "details_version": 2 }`. Несовпадение версии — `409 STALE_ORDER_DETAILS`. `secure_deal` без привязанной карты для выплат — `409 PAYOUT_CARD_REQUIRED`.

Если клиент в ту же гонку отменяет заказ или отклоняет партнёра — побеждает клиент, confirm-terms → `409 ORDER_NO_LONGER_RELEVANT`.

При пересечении окон с другими заказами исполнителя — в ответе тот же опциональный `availability_warning`, что у accept; подтверждение **не** блокируется.

`direct_payment`: **срочный** → `in_progress`; **плановый** → `scheduled`; плюс активное assignment. `secure_deal` → `awaiting_payment` + активное assignment + `payment_deadline_at`; после оплаты холдом — срочный `in_progress`, плановый `scheduled`. Назначение при возврате в поиск не удаляется — `released_at` (`ORDER_CONSISTENCY.md`).

### `GET /orders/{orderId}`

Карточка заказа со статусом, текущим кандидатом, дедлайнами, ценой и назначением. Открытие из уведомления статус не меняет. Исполнителю до принятия — без контактов заказчика, но со сводкой отзывов о нём как о клиенте (`client_reviews_avg`, `client_reviews_count`).

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

Клиент или исполнитель отклоняет партнёра. Доступно на `in_negotiation` **и** `awaiting_payment`. Нужна причина стадии. Кандидат → `negotiation_rejected`, активное назначение помечается снятым (`released_at`, строка не удаляется), заказ → `published`. Если на `awaiting_payment` была живая попытка оплаты — её отменяют / холд возвращают до смены статуса. Матрица согласованности — `ORDER_CONSISTENCY.md`.

На `awaiting_payment` обязателен `Idempotency-Key` (§8.0).

Для исполнителя на `in_negotiation` / `awaiting_payment` это единственный способ выйти (на `scheduled` доступна полная отмена с причиной).

Запрос:

```json
{
  "reason_code": "price_disagreement",
  "reason_text": null
}
```

### `POST /orders/{orderId}/cancel`

Полная отмена. Доступно:

- **клиенту** на `draft` | `published` | `in_negotiation` | `awaiting_payment` | `scheduled`;
- **обеим сторонам** на `scheduled` (плановый до `planned_start_at`).

Иначе `409 CANCEL_NOT_ALLOWED` (в том числе исполнителю на `in_negotiation` / `awaiting_payment` — ему `reject-negotiation`; на `in_progress` — только спор).

На `published` причина **не нужна**; ожидающий кандидат, если есть, закрывается как `withdrawn`, исполнителю уведомление. На остальных — код стадии (`CANCELLATION_REASONS.md`; для `scheduled` — стадия `planned_before_start`). Платёж/холд, если есть, отменяется или возвращается, затем `cancelled`.

На `awaiting_payment` и при живом холде `authorized` (в т.ч. на `scheduled`) обязателен `Idempotency-Key` (§8.0).

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

Новая претензия (новая строка `disputes`). Только из `in_progress` или `completed` (в том числе после подтверждения одной стороны). С `completed` — не позже **2 суток** после перехода в `completed` (`409 DISPUTE_WINDOW_EXPIRED`). С `scheduled` спор нельзя. Иначе `409 DISPUTE_NOT_ALLOWED`. Если уже есть спор `open` — `409 DISPUTE_ALREADY_OPEN`. Деньги после `captured` админ через API не двигает (`ORDER_STATE_MACHINE.md` §5.5).

`multipart/form-data`: `reason_code` обязателен (коды стадии; `not_paid` — только при `direct_payment`), при `other` — `reason_text`. Фото к причине нет.

Переводит заказ в `disputed`, создаёт тред, отменяет таймер автоприёмки (`execution_confirm_deadline_at`), если он шёл. Закрытые споры по заказу **сохраняются**. Апелляция закрытого спора — отдельный метод; новая претензия не требует апелляции.

Админ в эти методы приложения не ходит.

### `POST /orders/{orderId}/disputes/{disputeId}/appeal`

После того как админ закрыл **этот** спор. Та же запись снова `open`, `appeal_used = true`. Не больше одной апелляции на спор. Заказ снова `disputed`.

Иначе `409 APPEAL_NOT_ALLOWED` или `409 APPEAL_LIMIT_REACHED`.

Тело: текст, почему не согласны с решением (`reason_text`).

### `GET /orders/{orderId}/disputes`

Список споров заказа (новые сверху): id, status, reason, даты, `appeal_used`.

### `GET /orders/{orderId}/disputes/{disputeId}`

Один спор и его сообщения.

### `POST /orders/{orderId}/disputes/{disputeId}/messages`

Сообщение от клиента или исполнителя в тред этого спора. `multipart/form-data`: `body` + опционально `photos[]` (файлы). Только если спор `open` (иначе `409 DISPUTE_NOT_OPEN`).

Запрос (если без фото, можно JSON):

```json
{
  "body": "Текст"
}
```

### `POST /orders/{orderId}/confirm-execution`

Любая сторона на `in_progress`. Когда подтвердили оба — `completed` и выплата при сделке. Если подтвердил один — ставится `execution_confirm_deadline_at` = сейчас + 1 сутки; молчание второй стороны → автоподтверждение (`late_confirm` −3 молчавшему). Открытый спор до истечения таймера — таймер снимается.

Обязателен `Idempotency-Key` (§8.0): повтор не должен создать вторую выплату.

### `POST /orders/{orderId}/reviews`

`{ "stars": 5, "body": null }` после `completed`, по одному от каждой стороны. Иначе `409 REVIEW_NOT_ALLOWED`.

## 6) Отклик исполнителя

Отдельной выдачи «только из пуша» нет: у исполнителя список входящих через `GET /orders?role=executor` и экран уведомлений.

### `POST /orders/{orderId}/candidates/{candidateId}/accept`

Первое принятие. Только `published`, до дедлайна. После успеха — контакты, статус `in_negotiation`, `terms_confirm_deadline_at` = сейчас + 1 сутки. Условия здесь не фиксируются.

Если принятый заказ **срочный** — все остальные `notified` кандидаты **этого исполнителя** по другим **срочным** заказам (по любой его машине) → `auto_declined`; их заказы остаются `published`; клиентам уведомление «исполнитель отказался». Кандидаты по плановым заказам не трогаются. Если принятый заказ плановый — ничего не закрывается. Флаг `accepts_urgent_orders` не меняется.

Требования:

- обязателен `Idempotency-Key`;
- атомарно относительно истечения 5 минут; автоотказ остальных срочных — в той же транзакции;
- если клиент в ту же гонку снял запрос или отменил заказ — побеждает клиент, accept → `409 ORDER_NO_LONGER_RELEVANT` (`ORDER_STATE_MACHINE.md` §7).

Ответ `200`:

```json
{
  "result": "accepted",
  "order_id": "uuid",
  "status": "in_negotiation",
  "terms_confirm_deadline_at": "2026-09-08T11:20:00Z",
  "availability_warning": null
}
```

Если окно этого заказа пересекается с другими заказами исполнителя (`SEARCH_ALGORITHM.md` §6) — в `availability_warning` объект с кодом `AVAILABILITY_OVERLAP_WARNING` и списком пересечений (order id + окна). Это **не** ошибка: accept всё равно проходит. Клиент UI обязан показать текст до/после действия.

После успеха фиксируется обмен контактами. Цена заказа здесь не выставляется.

Ошибки:

- `409 ORDER_NO_LONGER_RELEVANT` — дедлайн прошёл, уже отказ/автоотказ/истечение, заказ не в `published`;
- `409 PROFILE_INCOMPLETE` — нет имени или ни одного канала;
- `409 SUBSCRIPTION_REQUIRED` — при включённом флаге подписки без активной подписки;
- `409 INVALID_STATE_TRANSITION`.

### `POST /orders/{orderId}/candidates/{candidateId}/decline`

Первый отказ исполнителя. Заказ остаётся `published`. Нужна причина (пишется в `order_candidates.reject_reason_*`, не в заказ).

Если в ту же секунду сработал таймер 5 минут — побеждает таймер: кандидат `expired`, decline → `409 ORDER_NO_LONGER_RELEVANT` (`ORDER_STATE_MACHINE.md` §7).

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

## 8) Безопасная сделка (опционально для клиента)

Работает с первого релиза через «Безопасную сделку». Провайдер выбирается по `order_pricing.currency` → `currencies.secure_deal_provider_code`. В MVP только `RUB` → ЮKassa. Флаг `secure_deal_enabled` — аварийный выключатель. Если у валюты заказа нет провайдера — `secure_deal` недоступен (`400 CURRENCY_SECURE_DEAL_UNAVAILABLE`).

Доменная семантика статусов, попыток, late webhook и reconcile — `ORDER_STATE_MACHINE.md` §5.

### 8.0) `Idempotency-Key` на операциях с деньгами

Заголовок **обязателен** (иначе `400 IDEMPOTENCY_KEY_REQUIRED`):

| Операция                                                  | Когда                                                                         |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `POST /orders/{orderId}/secure-deal/create-payment`       | всегда                                                                        |
| `POST /orders/{orderId}/cancel`                           | заказ в `awaiting_payment` / `scheduled` **или** есть живой холд `authorized` |
| `POST /orders/{orderId}/reject-negotiation`               | заказ в `awaiting_payment`                                                    |
| `POST /orders/{orderId}/confirm-execution`                | всегда (может запустить payout)                                               |
| `POST /admin/orders/{orderId}/disputes/{disputeId}/close` | если админ двигает деньги (выплата / возврат холда)                           |
| `POST /admin/orders/{orderId}/cancel`                     | если есть холд `authorized` на возврат                                        |

Повтор с тем же ключом и тем же телом — тот же результат, без второго списания / второй сделки / второй выплаты. Webhook идемпотентен по `provider_event_id` (отдельный механизм, не клиентский заголовок).

`POST .../candidates/.../accept` — `Idempotency-Key` уже обязателен (§6); к деньгам не относится, правило не меняется.

### `POST /orders/{orderId}/secure-deal/create-payment`

Создание сделки и платежа у провайдера. Только `awaiting_payment` + `secure_deal`. Сумма = `order_pricing.amount_to_pay` (клиент сумму не передаёт). Оплата зачисляется на баланс сделки → `authorized` → заказ **срочный** `in_progress` / **плановый** `scheduled`. При `completed` сервер создаёт выплату исполнителю на привязанную карту на `computed_amount` → `captured`. При отмене / возврате в поиск — возврат клиенту.

Обязателен заголовок `Idempotency-Key`.

Поведение попыток:

- на заказ — история `payment_records`; одновременно не больше одной записи в `pending` \| `authorized`;
- тот же ключ при живом `pending` → `200` с тем же `payment_id` / `payment_url`, без нового вызова создания сделки у провайдера (если ids ещё неизвестны — сначала reconcile);
- после `failed` — новая попытка = **новый** `payment_records`; статус заказа не меняется (`awaiting_payment` до дедлайна или иного перехода);
- порядок записи: сначала `pending` + ключ в БД, затем вызов провайдера; сбой между ними чинит reconcile job (`ORDER_STATE_MACHINE.md` §5.3).

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

Ошибки (дополнительно к общим):

- `409 PAYMENT_ALREADY_AUTHORIZED` — по заказу уже есть `authorized`;
- `409 ORDER_NOT_AWAITING_PAYMENT` — заказ не в `awaiting_payment`.

### `GET /orders/{orderId}/payment-status`

Актуальная попытка оплаты (живая `pending` \| `authorized`, иначе последняя по времени) и её `payment_status`. История попыток в MVP в ответе не обязательна.

### `POST /payments/webhooks/{providerCode}`

Webhook от платежного провайдера.

Требования:

- проверка подлинности: ЮKassa уведомления не подписывает, поэтому запрос принимается только с IP-адресов из списка ЮKassa, а статус объекта (платёж / выплата / сделка) сервер **перезапрашивает** через API провайдера и верит только ответу API, не телу уведомления;
- идемпотентность по `provider_event_id`;
- асинхронная обработка;
- фиксация результата в `payment_webhook_events`.

Нормальный `authorized` при заказе `awaiting_payment` → срочный `in_progress` / плановый `scheduled`.

Поздний `authorized`, если заказ уже ушёл из ожидания оплаты (`ORDER_STATE_MACHINE.md` §5.4):

- заказ `cancelled` или `published` → автовозврат клиенту, платёж `refunded`, заказ не поднимать;
- иначе → не двигать деньги автоматически; эскалация в `disputed` + алерт админу.

Если истёк срок сделки (180 дней), провайдер вернул деньги клиенту, а статус платежа был `authorized` — заказ → `disputed`. Неоплаченный заказ провайдер не трогает; наш таймаут возвращает заказ в `published`. `failed` у попытки оплату заказа в `published` / `cancelled` сам по себе не переводит.

Регулярный reconcile (не HTTP endpoint клиента): та же логика apply, что у webhook — `ORDER_STATE_MACHINE.md` §5.3. Клиентский API сверку не вызывает.

## 8.1) Уведомления

Перечень событий — `USER_SCENARIOS.md`, раздел 13.

### `GET /notifications`

Лента текущего пользователя, новые сверху.

Параметры: `page`, `limit`, `unread=true` (опционально).

### `POST /notifications/{notificationId}/read`

Пометить прочитанным. На статус кандидата не влияет.

## 9) Админка (не мобильное приложение)

Справочники типов лицензий и типов транспорта, закрытие спора, сообщения админа, блокировки, отмена заказов и разбор `other` — только здесь.

Все `/admin/*` требуют токен админа; токен пользователя приложения не принимается (`403`).

### `POST /admin/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "...",
  "totp_code": "123456"
}
```

Ответ `200`: `access_token` админа (короткий срок). Неверная любая часть — `401 INVALID_CREDENTIALS` (без уточнения, что именно). Учётные записи админов создаются вручную (команда на сервере), регистрации нет.

### `GET /admin/license-types` / `POST /admin/license-types` / `PATCH /admin/license-types/{id}`

Справочник типов лицензии. Создание: `{ "code": "CE", "name_ru": "Категория CE", "is_active": true }`. `code` unique. Правка названия и `is_active`. Удаления нет — только деактивация. Нельзя деактивировать тип, на который ссылаются активные категории (`409 LICENSE_TYPE_IN_USE`).

### `GET /admin/categories` / `POST /admin/categories` / `PATCH /admin/categories/{id}`

Типы транспорта. Создание и правка:

```json
{
  "code": "tow_truck",
  "name_ru": "Эвакуатор",
  "license_type_id": "uuid",
  "pricing_type_codes": ["hour", "shift", "day", "month", "trip", "km"],
  "is_active": true
}
```

`license_type_id` обязателен (`400 VALIDATION_ERROR`). `pricing_type_codes` — подмножество справочника `pricing_types`, минимум один. Сида категорий нет — админ создаёт сам.

Смена `license_type_id`: лицензии исполнителей по этой категории перестают считаться действительными (нужна новая подача), машины категории выпадают из поиска до нового `approved`. Исполнителям с машинами/лицензией этой категории — уведомление.

### `POST /admin/licenses/{licenseId}/review`

`{ "decision": "approved" | "rejected" | "revoke", "comment": null }`. `revoke` — снять ранее выданный `approved` (нужен `comment`). Исполнителю уведомление. При `rejected` / `revoke` машины категории выпадают из поиска; незавершённые заказы этого исполнителя по затронутой категории → `published` + возврат холда (`SERVICE_RULES.md`).

### `POST /admin/orders/{orderId}/disputes/{disputeId}/messages`

Сообщение от админа в указанный спор. Тоже можно прикрепить фото (`photos[]`). Спор должен быть `open`.

### `POST /admin/orders/{orderId}/disputes/{disputeId}/close`

Закрывает **этот** спор. Админ выбирает статус заказа: только `completed`, `cancelled`, `in_progress`, `scheduled`. Нельзя `published`. Если других `open` споров нет — заказ переходит в выбранный статус; иначе `409 OTHER_DISPUTE_OPEN` (в норме одновременно один open).

Запрос:

```json
{
  "status": "cancelled",
  "sanction_client_delta": null,
  "sanction_executor_delta": null
}
```

Деньги:

- платёж `authorized` (холд, ещё не выплата) — админ может **целиком** выплатить или **целиком** вернуть (частичных сумм в MVP нет);
- платёж уже `captured` — денег не трогать, только статус и опциональные санкции при доказанной вине; закрытие в `cancelled` возврата **не** делает;
- платежа не было — денег нет; санкции только по доказательствам.

Если закрытие двигает деньги (выплата / возврат холда) — обязателен `Idempotency-Key` (§8.0).

### `POST /admin/orders/{orderId}/cancel`

Отмена заказа админом из любого статуса, кроме `completed`. На `published` ожидающий кандидат закрывается как `withdrawn`. На `disputed` одновременно закрывает **открытый** спор с исходом `cancelled`. Холд `authorized` возвращается; `captured` не трогается. `cancelled_by_role = admin`, штрафа нет, обеим сторонам уведомление.

При возврате холда `authorized` обязателен `Idempotency-Key` (§8.0).

Запрос: `{ "comment": "Причина для аудита" }`.

Типовое применение — открытые заказы заблокированного пользователя.

### `POST /admin/users/{userId}/block` / `POST /admin/users/{userId}/unblock`

`{ "reason": "..." }`. Заполняет / очищает `blocked_at`, `blocked_reason`. Заблокированный: не в поиске, не создаёт и не принимает заказы. Все его незавершённые заказы → `published` (исключение из правила «после фиксации сделки нельзя в поиск»): назначения `released_at`, кандидаты закрываются, клиентам уведомление «искать снова в этом заказе». Живой холд `authorized` по `secure_deal` → возврат клиенту; `captured` — без автовозврата (§5.5). То же при отзыве `approved` у лицензии (`POST /admin/licenses/{id}/review` с отзывом / повторный reject после approve — если появится отдельный revoke, поведение то же).

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
- `scheduled`
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

У `direct_payment` строк оплаты нет. Статусы строки:

- `pending`
- `authorized`
- `captured`
- `failed`
- `cancelled`
- `refunded`

## 11) Фоновые задачи

- 5 минут: `notified` → `expired`, заказ `published`, исполнителю −3.
- `terms_confirm_deadline_at` **+ 30 секунд форы**: затем `terms_expired`, заказ `published`, −3 (`ORDER_STATE_MACHINE.md` §7).
- 1 сутки: `payment_deadline_at` → живую попытку оплаты отменить, заказ `published`, клиенту −3.
- 1 сутки: `execution_confirm_deadline_at` → автоподтверждение, `completed`, `late_confirm` −3.
- `planned_start_at`: заказ в `scheduled` → `in_progress` (без кнопки).
- «Исполнитель не найден»: `published` без `notified` — срочный через 24 ч после `search_activity_at` (последняя отправка запроса / правка / вход в поиск), плановый при `planned_start_at` → `cancelled` (system).

## 12) Минимальные SLA для API MVP

- Первое `accept` / истечение 5 минут / автоотказ остальных срочных: атомарность важнее гонки.
- `GET /search/machinery`: p95 < 600 мс при базовой геовыборке (на проде — PostGIS, см. `TECH_STACK.md`).
- При недоступности платежного провайдера основной сценарий `direct_payment` продолжает работать.
