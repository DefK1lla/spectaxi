# Причины отмены

Утверждённый справочник. Код обязателен при отклонении партнёра, открытии спора и при отмене **после** выхода из поиска. Свой вариант (`other`) уходит в очередь админки, баллы автоматически не ставятся. При `other` обязателен текст. Фото к причине не крепятся: фото — во вложении сообщения треда.

**На `published` клиент отменяет заказ без причины** (`cancel_reason_code` пустой). Отказ исполнителя на первом запросе по-прежнему с причиной.

Набор кодов **режется по стадии**.

## Клиент

| code | Текст | Где доступен |
| --- | --- | --- |
| `found_another` | Нашёл другого исполнителя | `in_negotiation`, `awaiting_payment` |
| `price_disagreement` | Не договорились о цене | `in_negotiation`, `awaiting_payment`, `in_progress` (спор) |
| `no_contact` | Исполнитель не выходит на связь | `in_negotiation`, `awaiting_payment`, `in_progress` (спор), `completed` (спор) |
| `late_or_no_show` | Исполнитель не приехал / опоздал | `in_progress` (спор), `completed` (спор) |
| `wrong_equipment` | Приехала не та техника | `in_progress` (спор), `completed` (спор) |
| `quality` | Работа сделана плохо или не доделана | `in_progress` (спор), `completed` (спор) |
| `other` | Свой вариант (текст обязателен, разбор в админке) | все стадии, где причина нужна |

Таймаут неоплаты (`awaiting_payment`, 1 сутки) заказ не отменяет: возврат в поиск, `cancelled_by_role` не ставится. Штраф клиенту — `RATING_PLAN.md`.

## Исполнитель

| code | Текст | Где доступен |
| --- | --- | --- |
| `busy_or_broken` | Занят / техника неисправна | `published` (отказ на запросе), `in_negotiation`, `awaiting_payment` |
| `no_contact_client` | Заказчик не выходит на связь | `in_negotiation`, `awaiting_payment`, `in_progress` (спор), `completed` (спор) |
| `site_not_ready` | Объект не готов | `in_progress` (спор) |
| `price_disagreement` | Не согласен с условиями | `in_negotiation`, `in_progress` (спор) |
| `unsafe` | Небезопасные условия | `in_negotiation`, `in_progress` (спор) |
| `scope_changed` | Заказчик меняет объём работ | `in_negotiation`, `in_progress` (спор) |
| `other` | Свой вариант (текст обязателен, разбор в админке) | все стадии, где действие доступно |

Неверный код для стадии → `400 REASON_NOT_ALLOWED_FOR_STAGE`.

При полной отмене с причиной — в `orders`. При отказе на запросе или отклонении партнёра — в `order_candidates`. При споре — в `disputes` (`reason_code` / `reason_text`).

Баллы — `RATING_PLAN.md`.
