"use client";

import { useEffect, type ReactNode } from "react";
import { initBrowserSentry } from "../../sentry/init-browser-sentry";

/** Глобальные провайдеры публичного веба (тема, query client — позже). */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initBrowserSentry();
  }, []);

  return children;
}
