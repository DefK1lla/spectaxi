# Причины отмены

Утверждённый справочник. Код обязателен при отклонении партнёра, открытии спора, отмене клиентом после выхода из поиска и отмене планового заказа до даты начала. Свой вариант (`other`) уходит в очередь админки, баллы автоматически не ставятся. При `other` обязателен текст. Фото к причине не крепятся: фото — во вложении сообщения треда.

**На `published` клиент отменяет заказ без причины** (`cancel_reason_code` пустой). Отказ исполнителя на первом запросе по-прежнему с причиной.

Исполнитель **не отменяет** заказ на `in_negotiation` / `awaiting_payment` — только отклоняет партнёра (заказ обратно в поиск). Поэтому у исполнителя на этих стадиях код идёт в `order_candidates`, не в `orders`.

Набор кодов **режется по стадии**. Обозначения стадий:

- `in_negotiation`, `awaiting_payment` — отклонение партнёра (обе стороны) или отмена (только клиент);
- `planned_before_start` — плановый заказ в `in_progress` до `planned_start_at`, отмена любой стороной;
- `in_progress` (спор), `completed` (спор) — открытие спора.

## Клиент

| code | Текст | Где доступен |
| --- | --- | --- |
| `found_another` | Нашёл другого исполнителя | `in_negotiation`, `awaiting_payment`, `planned_before_start` |
| `price_disagreement` | Не договорились о цене | `in_negotiation`, `awaiting_payment`, `planned_before_start`, `in_progress` (спор) |
| `no_contact` | Исполнитель не выходит на связь | `in_negotiation`, `awaiting_payment`, `planned_before_start`, `in_progress` (спор), `completed` (спор) |
| `late_or_no_show` | Исполнитель не приехал / опоздал | `in_progress` (спор), `completed` (спор) |
| `wrong_equipment` | Приехала не та техника | `in_progress` (спор), `completed` (спор) |
| `quality` | Работа сделана плохо или не доделана | `in_progress` (спор), `completed` (спор) |
| `other` | Свой вариант (текст обязателен, разбор в админке) | все стадии, где причина нужна |

Таймаут неоплаты (`awaiting_payment`, 1 сутки) заказ не отменяет: возврат в поиск, `cancelled_by_role` не ставится. Штраф клиенту — `RATING_PLAN.md`.

## Исполнитель

| code | Текст | Где доступен |
| --- | --- | --- |
| `busy_or_broken` | Занят / техника неисправна | `published` (отказ на запросе), `in_negotiation`, `awaiting_payment`, `planned_before_start` |
| `no_contact_client` | Заказчик не выходит на связь | `in_negotiation`, `awaiting_payment`, `planned_before_start`, `in_progress` (спор), `completed` (спор) |
| `site_not_ready` | Объект не готов | `in_progress` (спор) |
| `price_disagreement` | Не согласен с условиями | `in_negotiation`, `in_progress` (спор) |
| `unsafe` | Небезопасные условия | `in_negotiation`, `in_progress` (спор) |
| `scope_changed` | Заказчик меняет объём работ | `in_negotiation`, `in_progress` (спор) |
| `not_paid` | Заказчик не оплатил работу | `in_progress` (спор), `completed` (спор) — только `direct_payment` |
| `other` | Свой вариант (текст обязателен, разбор в админке) | все стадии, где действие доступно |

Неверный код для стадии → `400 REASON_NOT_ALLOWED_FOR_STAGE`. `not_paid` при `secure_deal` → та же ошибка (деньги уже у провайдера).

Куда пишется: полная отмена клиентом и отмена планового до начала — в `orders`; отказ на запросе и отклонение партнёра — в `order_candidates`; спор — в `disputes` (`reason_code` / `reason_text`).

Системные отмены («исполнитель не найден», отмена админом) — без кода из справочника, `cancelled_by_role = system` / `admin`.

Баллы — `RATING_PLAN.md`.
