import { brandColor, primitiveColor } from "../primitive-tokens";
import { createTheme } from "../theme";

/**
 * Светлая тема: тёплый серый canvas + белые поверхности, soft radius, airy type.
 * Brand CTA = green 500.
 */
export const lightTheme = createTheme("light", {
  bgCanvas: primitiveColor.stone50,
  bgSurface: primitiveColor.white,
  bgMuted: primitiveColor.stone100,
  fgDefault: primitiveColor.stone900,
  fgMuted: primitiveColor.stone500,
  fgInverse: primitiveColor.white,
  borderDefault: primitiveColor.stone200,
  borderStrong: primitiveColor.stone300,
  brand: brandColor[500],
  brandHover: brandColor[600],
  brandFg: primitiveColor.white,
  brandMuted: brandColor[50],
  danger: primitiveColor.red500,
  dangerFg: primitiveColor.white,
  success: brandColor[500],
  successFg: primitiveColor.white,
  warning: primitiveColor.amber500,
  warningFg: primitiveColor.stone900,
  info: primitiveColor.blue500,
  infoFg: primitiveColor.white,
  focusRing: brandColor[400],
});
