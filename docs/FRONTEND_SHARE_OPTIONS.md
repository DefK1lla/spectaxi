# Шаринг web ↔ mobile — открытый вопрос

**Статус:** не решено. Пока пишем **только `apps/mobile`**. К шарингу вернёмся, когда станет ясно, как удобнее резать ядро.

**Задача:** [`tasks/14-frontend-share-strategy.md`](./tasks/14-frontend-share-strategy.md) — сделать выбор и зафиксировать его здесь.

**Пока действует:** клиентские фичи и экраны — в mobile (FSD). `web` — лендинг / тонкий клиент, без обязательного выноса продукта в `packages/`. Уже есть: `@spectaxi/contracts`, `@spectaxi/theme`, `@spectaxi/ui` (**Tamagui** kit).

Цель на потом: один продукт на телефоне (паритет layout), web — mobile first + адаптив; admin — desktop-first. Как именно класть общее в monorepo — выбрать из вариантов ниже (или смесь).

---

## Варианты структур (шпаргалка)

### A. Solito — один жирный `packages/app`

```text
apps/expo | apps/next
packages/app/features | provider | navigation
```

- Экраны и фичи общие; apps — оболочки + Solito navigation.
- Пример: https://github.com/nandorojo/solito/tree/master/example-monorepos/blank
- CLI: `npx create-solito-app@latest`

### B. Tamagui / Takeout — `app` + отдельный `ui` _(kit уже Tamagui)_

```text
apps/expo | apps/next
packages/app/   ← features
packages/ui/    ← kit
```

- Как A, но design system вынесен. **`@spectaxi/ui` уже на Tamagui**; вопрос — когда/как появится `packages/app`.
- Пример: https://github.com/tamagui/starter-free

### C. «screens + components» (как gluestack universal) — идея нарезки

```text
packages/components/  ← kit
packages/screens/     ← общие экраны
packages/shared/
```

- Исторический пример: gluestack starter-kits. **Kit у нас = Tamagui**, не gluestack (v5 без Next).

### D. Только shared UI (экраны в apps)

```text
apps/mobile | apps/web
packages/ui/
```

- Шарится kit; фичи пока в каждом app (или только в mobile).
- Близко к **текущему** этапу SpexTaxi.

### E. T3 Turbo-стиль — ролевые пакеты, экраны свои

```text
packages/api | auth | db | ui | validators
apps/expo | apps/nextjs
tooling/...
```

- Шарят контракт/бэкенд-слой/zod; UI/экраны не обязательно universal.
- Пример: https://github.com/t3-oss/create-t3-turbo
- У нас API уже в `apps/api` + `@spectaxi/contracts` — родственный дух.

### F. Logic-only

```text
packages/shared-logic | api-client | design-tokens
```

- Общие типы, правила, hooks без DOM/RN; UI намеренно раздельный.
- Обзоры: Mironsoft «Sharing Code…», DEV «How much to share in a monorepo…».

### G. Nx `libs/`

То же по смыслу, что packages, другая нарезка (`libs/feature-*`, `shared/ui`).

---

## Сравнение коротко

|                  | Общие экраны   | Отдельный UI kit  | Много мелких пакетов |
| ---------------- | -------------- | ----------------- | -------------------- |
| A Solito `app`   | да             | часто внутри app  | нет                  |
| B Tamagui        | да             | да (`ui`)         | нет                  |
| C gluestack-like | да (`screens`) | да (`components`) | мало                 |
| D только ui      | нет            | да                | нет                  |
| E T3-like        | обычно нет     | опционально       | по ролям             |
| F logic-only     | нет            | tokens            | мало                 |
| G Nx             | как решишь     | как решишь        | часто да             |

---

## Черновик гибрида SpexTaxi (не утверждён)

Имел смысл обсуждать, **не зафиксирован как догма**:

1. Сейчас — mobile only (этот файл + практика).
2. Потом — вынос по нужде: `contracts` / `theme` / `ui` уже есть; жирный `@spectaxi/client` или `packages/app` — если web догонит сценарии.
3. Admin и Nest не обязаны жить в Solito-`app`.

Когда решение принято — обновить [`FRONTEND_FSD.md`](./FRONTEND_FSD.md) § «Общий код» и этот файл пометить **решено: …** сверху.
