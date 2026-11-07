import type { Theme, ThemeName } from "../theme";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export { darkTheme } from "./dark";
export { lightTheme } from "./light";

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}
