/**
 * Платформо-независимые примитивы. Семантические темы ссылаются на них;
 * UI-библиотеки в apps не должны хардкодить hex мимо семантических ролей.
 */

/**
 * Brand-шкала зелёного (50 — самый светлый … 900 — самый тёмный).
 * Primary CTA ≈ `500` (`#22C76E`).
 */
export const brandColor = {
  50: "#E6FBEF",
  100: "#C9F5DC",
  200: "#94EFC0",
  300: "#5FE8A3",
  400: "#34E089",
  500: "#22C76E",
  600: "#1DAA5E",
  700: "#178D4D",
  800: "#11703C",
  900: "#0B522B",
} as const;

/** Тёплые stone-нейтрали — «рабочий кабинет», не холодный slate. */
export const primitiveColor = {
  white: "#FFFFFF",
  black: "#120F0C",
  stone50: "#F7F5F2",
  stone100: "#EFEBE6",
  stone200: "#DDD6CE",
  stone300: "#C4BAB0",
  stone400: "#A89F94",
  stone500: "#8A7F74",
  stone600: "#6B625A",
  stone700: "#4A433C",
  stone800: "#2F2924",
  stone900: "#1F1B17",
  stone950: "#161310",
  red400: "#F97066",
  red500: "#D92D20",
  red600: "#B42318",
  amber400: "#FDB022",
  amber500: "#F79009",
  amber600: "#DC6803",
  blue400: "#53B1FD",
  blue500: "#2E90FA",
  blue600: "#1570EF",
} as const;

/** Сетка 4px. Значения — density-independent (web px / RN dp). */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Мягкие радиусы (8–20), consumer-friendly. */
export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

/** Воздушная типографика — product / mobile feel. */
export const fontSize = {
  xs: 13,
  sm: 15,
  md: 16,
  lg: 20,
  xl: 26,
  "2xl": 34,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  tight: 1.3,
  normal: 1.55,
  relaxed: 1.75,
} as const;

/** Миллисекунды — в CSS как `ms`, в Reanimated как duration. */
export const duration = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 40,
  toast: 50,
} as const;

/**
 * Стек шрифтов зависит от платформы; адаптеры берут `web` или `native`.
 * Смена brand-шрифтов позже — без правок семантических цветов/отступов.
 */
export const fontFamily = {
  sans: {
    web: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    native: "System",
  },
  mono: {
    web: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    native: "Courier",
  },
} as const;

export type BrandColor = typeof brandColor;
export type PrimitiveColor = typeof primitiveColor;
export type SpaceScale = typeof space;
export type RadiusScale = typeof radius;
export type FontSizeScale = typeof fontSize;
export type FontWeightScale = typeof fontWeight;
export type LineHeightScale = typeof lineHeight;
export type DurationScale = typeof duration;
export type ZIndexScale = typeof zIndex;
export type FontFamilyScale = typeof fontFamily;
