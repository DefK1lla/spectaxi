import { defaultConfig } from "@tamagui/config/v6";
import { createTamagui } from "tamagui";

/**
 * Базовый Tamagui config (v6 / latest).
 * Цвета SpexTaxi из `@spectaxi/theme` подмешиваем по мере экранов — task 13.
 */
export const tamaguiConfig = createTamagui(defaultConfig);

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Tamagui module augmentation
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
