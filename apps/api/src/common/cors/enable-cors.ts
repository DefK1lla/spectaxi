import type { INestApplication } from "@nestjs/common";

/**
 * CORS for browser clients (Vercel admin/web, local Next).
 * CORS_ORIGINS=comma-separated list, or `*` for reflect-any (dev only).
 * Empty → localhost:3001 and :3002 (admin/web defaults).
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
