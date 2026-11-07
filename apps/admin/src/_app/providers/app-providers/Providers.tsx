"use client";

import { MantineProvider } from "@mantine/core";
import { useEffect, type ReactNode } from "react";
import { mantineTheme } from "@/shared/theme/mantine-theme";
import { initBrowserSentry } from "../../sentry/init-browser-sentry";

/** Глобальные провайдеры админки (Mantine, query client — позже). */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initBrowserSentry();
  }, []);

  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
