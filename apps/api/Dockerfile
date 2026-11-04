# SpexTaxi API — multi-stage image for DADA Cloud / docker compose.
# Build from monorepo root:
#   docker build -f apps/api/Dockerfile -t spectaxi-api .

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# OpenSSL нужен Prisma engines (иначе warn/fallback на openssl-1.1.x).
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@12.11.2 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/api/package.json apps/api/
# Только зависимости: lifecycle scripts ждут исходники (prisma-generate, contracts tsc).
RUN pnpm install --frozen-lockfile --filter @spectaxi/api... --ignore-scripts
COPY packages/contracts packages/contracts
COPY apps/api apps/api
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?sslmode=disable"
RUN pnpm --filter @spectaxi/contracts build \
  && pnpm --filter @spectaxi/api prisma:generate \
  && pnpm --filter @spectaxi/api build \
  # --ignore-scripts: postinstall снова зовёт prisma CLI, а в --prod его нет;
  # client уже сгенерирован шагом выше и попадёт в deploy из store.
  && pnpm --filter @spectaxi/api deploy --prod --ignore-scripts /out

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --create-home --uid 1001 nestjs
COPY --from=build --chown=nestjs:nestjs /out ./
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
