import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(__dirname, "..");
const require = createRequire(path.join(apiRoot, "package.json"));

// prisma.config.ts вызывает env("DATABASE_URL"); generate к БД не подключается.
process.env.DATABASE_URL ??=
  "postgresql://user:pass@127.0.0.1:5432/spectaxi?schema=public";

const prismaCli = require.resolve("prisma/build/index.js");

const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  stdio: "inherit",
  cwd: apiRoot,
  env: process.env,
});

process.exit(result.status ?? 1);
