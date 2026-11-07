import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { themesToCssDocument } = require("@spectaxi/theme");

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "../src/styles.css");
const banner = `/* SpexTaxi design tokens (light + dark). Сгенерировано из @spectaxi/theme.
 * Не редактировать вручную — pnpm --filter @spectaxi/ui generate:css
 * UI-kit — Tamagui (@spectaxi/ui); эти CSS vars — для web globals рядом с Tamagui.
 */

`;

writeFileSync(outPath, banner + themesToCssDocument(), "utf8");
console.log(`Wrote ${outPath}`);
