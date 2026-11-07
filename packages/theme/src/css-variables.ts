import type { Theme } from "./theme";
import { darkTheme, lightTheme, themes } from "./themes";

const CSS_PREFIX = "spectaxi";

function kebabCase(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Плоская карта CSS custom properties для веба (Tailwind / shadcn / CSS-in-JS).
 * Пример ключа: `--spectaxi-color-bg-canvas`.
 */
export function themeToCssVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme.color)) {
    vars[`--${CSS_PREFIX}-color-${kebabCase(key)}`] = value;
  }
  for (const [key, value] of Object.entries(theme.space)) {
    vars[`--${CSS_PREFIX}-space-${key}`] = `${value}px`;
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    vars[`--${CSS_PREFIX}-radius-${kebabCase(key)}`] = `${value}px`;
  }
  for (const [key, value] of Object.entries(theme.fontSize)) {
    vars[`--${CSS_PREFIX}-font-size-${key}`] = `${value}px`;
  }
  for (const [key, value] of Object.entries(theme.fontWeight)) {
    vars[`--${CSS_PREFIX}-font-weight-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.lineHeight)) {
    vars[`--${CSS_PREFIX}-line-height-${key}`] = String(value);
  }
  for (const [key, value] of Object.entries(theme.duration)) {
    vars[`--${CSS_PREFIX}-duration-${key}`] = `${value}ms`;
  }
  for (const [key, value] of Object.entries(theme.zIndex)) {
    vars[`--${CSS_PREFIX}-z-${key}`] = String(value);
  }

  vars[`--${CSS_PREFIX}-font-sans`] = theme.fontFamily.sans.web;
  vars[`--${CSS_PREFIX}-font-mono`] = theme.fontFamily.mono.web;

  return vars;
}

function themeToCssBlock(selector: string, theme: Theme): string {
  const lines = Object.entries(themeToCssVariables(theme)).map(
    ([name, value]) => `  ${name}: ${value};`,
  );
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}

/** Один блок темы (по умолчанию light на `:root`). */
export function themeToCssRoot(theme: Theme = lightTheme): string {
  return themeToCssBlock(":root", theme);
}

/**
 * Light + dark для веба: `:root` / `[data-theme="light"]` и `[data-theme="dark"]`.
 * Переключение: `document.documentElement.dataset.theme = "dark" | "light"`.
 */
export function themesToCssDocument(
  themeMap: { light: Theme; dark: Theme } = themes,
): string {
  return [
    themeToCssBlock(':root, [data-theme="light"]', themeMap.light),
    themeToCssBlock('[data-theme="dark"]', themeMap.dark),
  ].join("\n");
}

/**
 * Карта цветов под Tailwind v3/v4 (hex). В `theme.extend.colors` или `@theme` —
 * выбор UI-kit остаётся в приложении.
 */
export function themeToTailwindColors(
  theme: Theme = lightTheme,
): Record<string, string> {
  return {
    canvas: theme.color.bgCanvas,
    surface: theme.color.bgSurface,
    muted: theme.color.bgMuted,
    foreground: theme.color.fgDefault,
    "foreground-muted": theme.color.fgMuted,
    "foreground-inverse": theme.color.fgInverse,
    border: theme.color.borderDefault,
    "border-strong": theme.color.borderStrong,
    brand: theme.color.brand,
    "brand-hover": theme.color.brandHover,
    "brand-foreground": theme.color.brandFg,
    "brand-muted": theme.color.brandMuted,
    danger: theme.color.danger,
    "danger-foreground": theme.color.dangerFg,
    success: theme.color.success,
    "success-foreground": theme.color.successFg,
    warning: theme.color.warning,
    "warning-foreground": theme.color.warningFg,
    info: theme.color.info,
    "info-foreground": theme.color.infoFg,
    ring: theme.color.focusRing,
  };
}

export { darkTheme, lightTheme };
