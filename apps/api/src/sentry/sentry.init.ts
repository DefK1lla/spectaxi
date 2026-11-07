import type { INestApplication } from "@nestjs/common";

/**
 * Опциональный bootstrap Sentry. Без SENTRY_DSN — no-op.
 */
export async function initSentry(): Promise<void> {
  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) {
    return;
  }

  try {
    const Sentry = await import("@sentry/nestjs");
    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    });
  } catch (error) {
    console.warn(
      "[sentry] SENTRY_DSN set but @sentry/nestjs failed to init:",
      error,
    );
  }
}

/** Глобальный Nest-фильтр Sentry — только если задан DSN и пакет загрузился. */
export async function setupSentryNestFilter(
  app: INestApplication,
): Promise<void> {
  if (!process.env.SENTRY_DSN?.trim()) {
    return;
  }

  try {
    const { SentryGlobalFilter } = await import("@sentry/nestjs/setup");
    const httpAdapter = app.getHttpAdapter().getInstance();
    app.useGlobalFilters(new SentryGlobalFilter(httpAdapter));
  } catch (error) {
    console.warn("[sentry] SentryGlobalFilter not applied:", error);
  }
}
