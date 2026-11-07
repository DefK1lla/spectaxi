export {
  brandColor,
  duration,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  primitiveColor,
  radius,
  space,
  zIndex,
  type BrandColor,
  type DurationScale,
  type FontFamilyScale,
  type FontSizeScale,
  type FontWeightScale,
  type LineHeightScale,
  type PrimitiveColor,
  type RadiusScale,
  type SpaceScale,
  type ZIndexScale,
} from "./primitive-tokens";

export {
  createTheme,
  type Theme,
  type ThemeColor,
  type ThemeName,
} from "./theme";

export { darkTheme, getTheme, lightTheme, themes } from "./themes";

export {
  themesToCssDocument,
  themeToCssRoot,
  themeToCssVariables,
  themeToTailwindColors,
} from "./css-variables";

export {
  getNativeTheme,
  nativeDarkTheme,
  nativeLightTheme,
  nativeThemes,
  themeToNative,
  type NativeTheme,
} from "./native-theme";

/** Тема по умолчанию, пока пользователь не выберет dark. */
export { lightTheme as defaultTheme } from "./themes/light";
