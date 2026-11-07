import { SpectaxiUiProvider } from "@spectaxi/ui";
import { useEffect, type ReactNode } from "react";
import { initNativeSentry } from "../../sentry/init-native-sentry";

/** Глобальные провайдеры приложения (query, Tamagui — через SpectaxiUiProvider). */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initNativeSentry();
  }, []);

  return <SpectaxiUiProvider colorMode="light">{children}</SpectaxiUiProvider>;
}
