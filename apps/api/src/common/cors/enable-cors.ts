import type { INestApplication } from "@nestjs/common";

/**
 * CORS для браузерных клиентов (Vercel admin/web, локальный Next).
 * CORS_ORIGINS — список через запятую, или `*` (reflect any, только dev).
 * Пусто → localhost:3001 и :3002 (дефолты admin/web).
 */
export function enableCors(app: INestApplication): void {
  const raw = process.env.CORS_ORIGINS?.trim();

  if (raw === "*") {
    app.enableCors({ origin: true, credentials: true });
    return;
  }

  const origins = (
    raw
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [
          "http://localhost:3001",
          "http://localhost:3002",
          "http://127.0.0.1:3001",
          "http://127.0.0.1:3002",
        ]
  ) as string[];

  app.enableCors({
    origin: origins,
    credentials: true,
  });
}
