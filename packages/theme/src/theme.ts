import type {
  DurationScale,
  FontFamilyScale,
  FontSizeScale,
  FontWeightScale,
  LineHeightScale,
  RadiusScale,
  SpaceScale,
  ZIndexScale,
} from "./primitive-tokens";
import {
  duration,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  space,
  zIndex,
} from "./primitive-tokens";

/** Семантические роли цвета — UI-kit мапит кнопку/инпут сюда, не в сырой hex. */
export type ThemeColor = {
  bgCanvas: string;
  bgSurface: string;
  bgMuted: string;
  fgDefault: string;
  fgMuted: string;
  fgInverse: string;
  borderDefault: string;
  borderStrong: string;
  brand: string;
  brandHover: string;
  brandFg: string;
  brandMuted: string;
  danger: string;
  dangerFg: string;
  success: string;
  successFg: string;
  warning: string;
  warningFg: string;
  info: string;
  infoFg: string;
  focusRing: string;
};

export type ThemeName = "light" | "dark";

export type Theme = {
  name: ThemeName;
  color: ThemeColor;
  space: SpaceScale;
  radius: RadiusScale;
  fontSize: FontSizeScale;
  fontWeight: FontWeightScale;
  lineHeight: LineHeightScale;
  duration: DurationScale;
  zIndex: ZIndexScale;
  fontFamily: FontFamilyScale;
};

export function createTheme(
  name: ThemeName,
  color: ThemeColor,
  overrides?: Partial<
    Pick<
      Theme,
      | "space"
      | "radius"
      | "fontSize"
      | "fontWeight"
      | "lineHeight"
      | "duration"
      | "zIndex"
      | "fontFamily"
    >
  >,
): Theme {
  return {
    name,
    color,
    space: overrides?.space ?? space,
    radius: overrides?.radius ?? radius,
    fontSize: overrides?.fontSize ?? fontSize,
    fontWeight: overrides?.fontWeight ?? fontWeight,
    lineHeight: overrides?.lineHeight ?? lineHeight,
    duration: overrides?.duration ?? duration,
    zIndex: overrides?.zIndex ?? zIndex,
    fontFamily: overrides?.fontFamily ?? fontFamily,
  };
}
