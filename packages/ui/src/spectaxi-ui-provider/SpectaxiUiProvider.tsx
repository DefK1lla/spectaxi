"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

export type SpectaxiColorMode = "light" | "dark";

export type SpectaxiUiProviderProps = {
  children: ReactNode;
  colorMode?: SpectaxiColorMode;
};

type SpectaxiUiContextValue = {
  colorMode: SpectaxiColorMode;
};

const SpectaxiUiContext = createContext<SpectaxiUiContextValue>({
  colorMode: "light",
});

/** Провайдер UI: Tamagui + контекст режима темы SpexTaxi. */
export function SpectaxiUiProvider({
  children,
  colorMode = "light",
}: SpectaxiUiProviderProps) {
  const value = useMemo(() => ({ colorMode }), [colorMode]);

  return (
    <SpectaxiUiContext.Provider value={value}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorMode}>
        {children}
      </TamaguiProvider>
    </SpectaxiUiContext.Provider>
  );
}

export function useSpectaxiUi(): SpectaxiUiContextValue {
  return useContext(SpectaxiUiContext);
}
