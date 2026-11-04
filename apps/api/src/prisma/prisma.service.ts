import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 + PostgreSQL (Neon в local/dev) через driver adapter.
 *
 * Пока PrismaModule закомментирован в AppModule, соединение не открываем.
 * Когда будете включать:
 * 1. Пропишите DATABASE_URL в apps/api/.env (строка Neon).
 * 2. Раскомментируйте PrismaModule в app.module.ts.
 * 3. Раскомментируйте $connect / $disconnect ниже и проверку в /ready.
 * 4. Выполните: pnpm --filter @spectaxi/api prisma:migrate
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ??
      "postgresql://user:pass@127.0.0.1:5432/spectaxi?schema=public";

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    // await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    // await this.$disconnect();
  }
}
