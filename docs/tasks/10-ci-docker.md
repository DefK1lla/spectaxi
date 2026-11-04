# Задача: CI собирает Docker-образ API

**Зачем:** ловить поломку Dockerfile до деплоя на DADA.

## Что уже в репо

- Job `docker-api` в `.github/workflows/ci.yml`
- Собирает `apps/api/Dockerfile` (context = корень), **не пушит** в registry
- Зависит от успешного job `check`

## Что сделать

- [ ] Запушить в GitHub / открыть PR
- [ ] Убедиться, что workflow зелёный: `check` + `docker-api`
- [ ] При fail — смотреть лог build (часто lockfile / `pnpm deploy` / prisma generate / порядок COPY в Dockerfile)

Dockerfile ставит зависимости с `--ignore-scripts`, затем копирует исходники и гоняет `contracts build` + `prisma:generate` + `nest build` — иначе postinstall падает на пустом слое.

Локально то же: [08-local-docker.md](./08-local-docker.md).
