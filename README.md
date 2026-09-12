# SpexTaxi

Мобильный маркетплейс спецтехники. Один аккаунт — клиент и/или исполнитель. Вход по телефону, режим интерфейса (`current_mode`) выбирается при регистрации.

В репозитории продуктовые документы MVP, кода приложения нет.

Клиент задаёт фильтр (тип, тариф, количество, срочный без дат или плановый с датой начала, точка) — система считает цену. Ищет ближайшие свободные машины, шлёт запрос одному. После «принять» открываются контакты, исполнитель за сутки подтверждает условия. Пока работа не началась, срыв матча возвращает заказ к поиску. Спор — одна сущность на заказ. Тип транспорта и лицензия — строка таблицы категорий.

## Документы

- [USER_SCENARIOS.md](USER_SCENARIOS.md) — сценарии
- [PRODUCT_FOUNDATION.md](PRODUCT_FOUNDATION.md) — границы MVP, подписка, сделка
- [SEARCH_ALGORITHM.md](SEARCH_ALGORITHM.md) — фильтр и сортировка поиска
- [ORDER_STATE_MACHINE.md](ORDER_STATE_MACHINE.md) — статусы и платежи
- [DOMAIN_MODEL_AND_ERD.md](DOMAIN_MODEL_AND_ERD.md) — сущности и индексы
- [API_CONTRACT_MVP.md](API_CONTRACT_MVP.md) — черновик API
- [TARIFF_TYPES.md](TARIFF_TYPES.md) — тарифы по категориям
- [CANCELLATION_REASONS.md](CANCELLATION_REASONS.md) — причины по стадиям
- [RATING_PLAN.md](RATING_PLAN.md) — внутренний рейтинг
- [CANCELLED_ORDERS.md](CANCELLED_ORDERS.md) — отмена и «такой же заказ»
- [SERVICE_RULES.md](SERVICE_RULES.md) — правила сервиса и блокировка
