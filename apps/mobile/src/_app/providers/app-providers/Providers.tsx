import { useEffect, type ReactNode } from "react";
import { initNativeSentry } from "../../sentry/init-native-sentry";

/** Глобальные провайдеры приложения (query, theme — позже). */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initNativeSentry();
  }, []);

  return children;
}
