import { describe, expect, it } from "vitest";
import {
  brandColor,
  darkTheme,
  lightTheme,
  nativeDarkTheme,
  nativeLightTheme,
  themes,
  themesToCssDocument,
  themeToCssRoot,
  themeToCssVariables,
  themeToNative,
  themeToTailwindColors,
} from "./index";

describe("@spectaxi/theme", () => {
  it("использует зелёную brand-шкалу SpexTaxi", () => {
    expect(brandColor[500]).toBe("#22C76E");
    expect(lightTheme.color.brand).toBe(brandColor[500]);
    expect(darkTheme.color.brand).toBe(brandColor[400]);
  });

  it("отдаёт light и dark с soft radius и airy type", () => {
    expect(themes.light.name).toBe("light");
    expect(themes.dark.name).toBe("dark");
    expect(lightTheme.radius.md).toBe(12);
    expect(lightTheme.radius.lg).toBe(16);
    expect(lightTheme.fontSize.xl).toBe(26);
    expect(lightTheme.lineHeight.relaxed).toBe(1.75);
    expect(lightTheme.color.bgCanvas).toBe("#F7F5F2");
    expect(lightTheme.color.bgSurface).toBe("#FFFFFF");
  });

  it("собирает CSS variables для одной темы", () => {
    const vars = themeToCssVariables(lightTheme);
    expect(vars["--spectaxi-color-brand"]).toBe(brandColor[500]);
    expect(vars["--spectaxi-color-brand-muted"]).toBe(brandColor[50]);
    expect(vars["--spectaxi-radius-md"]).toBe("12px");

    const root = themeToCssRoot(lightTheme);
    expect(root.startsWith(":root {")).toBe(true);
  });

  it("собирает CSS-документ light+dark для data-theme", () => {
    const css = themesToCssDocument();
    expect(css).toContain(':root, [data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain(brandColor[500]);
    expect(css).toContain(brandColor[400]);
  });

  it("собирает карту цветов под Tailwind", () => {
    const colors = themeToTailwindColors(lightTheme);
    expect(colors.brand).toBe(brandColor[500]);
    expect(colors["brand-muted"]).toBe(brandColor[50]);
  });

  it("собирает native light и dark темы", () => {
    expect(themeToNative(lightTheme).fontFamily.sans).toBe("System");
    expect(nativeLightTheme.color.brand).toBe(brandColor[500]);
    expect(nativeDarkTheme.color.brand).toBe(brandColor[400]);
    expect(nativeDarkTheme.color.bgCanvas).toBe(darkTheme.color.bgCanvas);
  });
});
