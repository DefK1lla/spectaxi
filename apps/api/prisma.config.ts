import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma CLI (migrate / studio) читает DATABASE_URL отсюда.
// Nest в рантайме передаёт тот же URL в @prisma/adapter-pg.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
