import {
  createTheme,
  type MantineColorsTuple,
  type MantineThemeOverride,
} from "@mantine/core";
import { brandColor, fontFamily, lightTheme, radius } from "@spectaxi/theme";

/** Шкала brand → Mantine (ровно 10 оттенков 0…9). */
const brand: MantineColorsTuple = [
  brandColor[50],
  brandColor[100],
  brandColor[200],
  brandColor[300],
  brandColor[400],
  brandColor[500],
  brandColor[600],
  brandColor[700],
  brandColor[800],
  brandColor[900],
];

/**
 * Mantine-тема админки из `@spectaxi/theme`.
 * UI-kit админки — Mantine (не Tamagui / `@spectaxi/ui`).
 */
export const mantineTheme: MantineThemeOverride = createTheme({
  primaryColor: "brand",
  colors: {
    brand,
  },
  white: lightTheme.color.bgSurface,
  black: lightTheme.color.fgDefault,
  defaultRadius: "md",
  radius: {
    xs: `${radius.sm}px`,
    sm: `${radius.sm}px`,
    md: `${radius.md}px`,
    lg: `${radius.lg}px`,
    xl: `${radius.xl}px`,
  },
  fontFamily: fontFamily.sans.web,
  fontFamilyMonospace: fontFamily.mono.web,
  headings: {
    fontFamily: fontFamily.sans.web,
  },
  other: {
    bgCanvas: lightTheme.color.bgCanvas,
    brandHover: lightTheme.color.brandHover,
  },
});
