/**
 * Опциональный Sentry в браузере. Без NEXT_PUBLIC_SENTRY_DSN — no-op.
 */
export async function initBrowserSentry(): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn || typeof window === "undefined") {
    return;
  }

  try {
    const Sentry = await import("@sentry/react");
    Sentry.init({
      dsn,
      environment:
        process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
      tracesSampleRate: Number(
        process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
      ),
    });
  } catch (error) {
    console.warn("[sentry] browser init failed:", error);
  }
}
