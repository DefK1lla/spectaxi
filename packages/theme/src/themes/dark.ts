import { brandColor, primitiveColor } from "../primitive-tokens";
import { createTheme } from "../theme";

/**
 * Тёмная тема: тёплый уголь, surfaces чуть выше canvas.
 * Brand чуть светлее (400), чтобы CTA читался на тёмном.
 */
export const darkTheme = createTheme("dark", {
  bgCanvas: primitiveColor.stone950,
  bgSurface: primitiveColor.stone900,
  bgMuted: primitiveColor.stone800,
  fgDefault: primitiveColor.stone50,
  fgMuted: primitiveColor.stone400,
  fgInverse: primitiveColor.stone950,
  borderDefault: primitiveColor.stone700,
  borderStrong: primitiveColor.stone600,
  brand: brandColor[400],
  brandHover: brandColor[300],
  brandFg: brandColor[900],
  brandMuted: brandColor[900],
  danger: primitiveColor.red400,
  dangerFg: primitiveColor.stone950,
  success: brandColor[400],
  successFg: brandColor[900],
  warning: primitiveColor.amber400,
  warningFg: primitiveColor.stone950,
  info: primitiveColor.blue400,
  infoFg: primitiveColor.stone950,
  focusRing: brandColor[300],
});
