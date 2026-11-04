/**
 * Заготовка под Sentry native.
 * Пакет `@sentry/react-native` + Expo config plugin — см. docs/tasks/12-sentry-frontends.md.
 * Пока no-op, чтобы не тянуть native dep до EAS/dev client.
 */
export async function initNativeSentry(): Promise<void> {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) {
    return;
  }

  console.info(
    "[sentry] EXPO_PUBLIC_SENTRY_DSN set, but @sentry/react-native is not wired yet — see docs/tasks/12-sentry-frontends.md",
  );
}
