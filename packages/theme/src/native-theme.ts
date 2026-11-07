import type { Theme } from "./theme";
import { darkTheme, lightTheme, themes } from "./themes";

/**
 * Форма темы для React Native / Expo (StyleSheet, Unistyles, NativeWind и т.п.).
 * Числа без единиц (dp); цвета — hex-строки.
 */
export type NativeTheme = {
  name: Theme["name"];
  color: Theme["color"];
  space: Theme["space"];
  radius: Theme["radius"];
  fontSize: Theme["fontSize"];
  fontWeight: Theme["fontWeight"];
  lineHeight: Theme["lineHeight"];
  duration: Theme["duration"];
  zIndex: Theme["zIndex"];
  fontFamily: {
    sans: string;
    mono: string;
  };
};

export function themeToNative(theme: Theme): NativeTheme {
  return {
    name: theme.name,
    color: theme.color,
    space: theme.space,
    radius: theme.radius,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    lineHeight: theme.lineHeight,
    duration: theme.duration,
    zIndex: theme.zIndex,
    fontFamily: {
      sans: theme.fontFamily.sans.native,
      mono: theme.fontFamily.mono.native,
    },
  };
}

export const nativeLightTheme = themeToNative(lightTheme);
export const nativeDarkTheme = themeToNative(darkTheme);

export const nativeThemes = {
  light: nativeLightTheme,
  dark: nativeDarkTheme,
} as const;

export function getNativeTheme(name: keyof typeof themes): NativeTheme {
  return themeToNative(themes[name]);
}
