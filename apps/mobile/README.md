# `@spectaxi/mobile`

Expo (React Native) приложение SpexTaxi: клиент и исполнитель в одном приложении (`current_mode`).

**Сейчас здесь пишется клиентский продукт** (MVP-заказы и сценарии). Шаринг с `apps/web` — открытый вопрос: [`docs/FRONTEND_SHARE_OPTIONS.md`](../../docs/FRONTEND_SHARE_OPTIONS.md) / task 14.

Скелет: Expo Router, один экран «SpexTaxi»; токены через `@spectaxi/theme` / `@spectaxi/ui`.

Структура UI — **FSD v2.1**: роутинг Expo в `src/app/`, слои в `src/_app`, `src/_pages` (см. [`docs/FRONTEND_FSD.md`](../../docs/FRONTEND_FSD.md)).

## Запуск

Из корня репозитория (предпочтительно):

```bash
pnpm install
pnpm dev:mobile
```

Или из этой папки:

```bash
pnpm start
```

Дополнительно:

```bash
pnpm android    # эмулятор / устройство Android
pnpm ios        # симулятор iOS (macOS)
pnpm web        # только локальное превью Expo Web (не прод-канал)
```

Публичный веб продукта — отдельный пакет [`apps/web`](../web) (`pnpm dev:web`), не Expo Web: карта, пуши и платежи рассчитаны на натив.

## Проверка на телефоне

Пока хватает **Expo Go** (App Store / Google Play). Development build понадобится, когда подключим MapLibre — Expo Go его не потянет (`eas.json`, профиль `development`).

1. Установи Expo Go на телефон.
2. На ПК запусти `pnpm dev:mobile` (или `pnpm start` из этой папки).
3. Телефон и ПК — в **одной Wi‑Fi**.
4. Открой проект:
   - **Android** — камерой отсканируй QR из терминала Metro;
   - **iOS** — камерой системы или в Expo Go → Scan QR.

Правки в коде подхватываются сами (Fast Refresh).

Если QR не открывается / таймаут:

- в терминале Expo нажми `s` и переключи **tunnel** / **LAN**;
- или из `apps/mobile`: `npx expo start --tunnel` (медленнее, но работает через разные сети);
- на Windows проверь, что Firewall не режет Node по локальной сети.

Когда приложение начнёт ходить в API: на телефоне `localhost` — это сам телефон, не ПК. В `.env` / `EXPO_PUBLIC_API_URL` укажи IP компьютера в LAN, например `http://192.168.x.x:3000` (API должен слушать на `0.0.0.0` / быть доступен из сети).

USB + `pnpm android` / симулятор iOS — по желанию; для текущего скелета достаточно Expo Go по QR.

## Сборка

Нативные и магазинные сборки — через [EAS](https://docs.expo.dev/build/introduction/):

```bash
# из apps/mobile, нужен аккаунт Expo и `eas-cli`
eas build --profile development
eas build --profile preview
eas build --profile production
```

Профили описаны в `eas.json`.

Отдельного `pnpm build` для JS-бандла в скелете нет.

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
```

Unit-тесты: Vitest (`*.spec.ts` рядом с кодом). Пока без рендера нативного дерева — проверка бренда и экспорта экрана; RTL для RN добавим по мере UI.

## Документы

- [USER_SCENARIOS.md](../../docs/USER_SCENARIOS.md)
- [TECH_STACK.md](../../docs/TECH_STACK.md)
- [API_CONTRACT_MVP.md](../../docs/API_CONTRACT_MVP.md)
