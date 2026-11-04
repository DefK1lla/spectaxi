/**
 * Nest domain boundaries: no deep imports into another domain module.
 * Cross-domain: only `*.module.ts` + common/prisma/infra (sentry, openapi).
 */
export function nestBoundariesConfig() {
  return {
    settings: {
      "boundaries/include": ["src/**/*.ts"],
      "boundaries/elements": [
        { type: "app-root", pattern: "src/*.{ts,tsx}" },
        { type: "prisma", pattern: "src/prisma/**" },
        { type: "common", pattern: "src/common/**" },
        { type: "infra", pattern: "src/{sentry,openapi}/**" },
        {
          type: "domain-public",
          pattern: "src/modules/*/*.module.ts",
          capture: ["domain"],
        },
        {
          type: "domain",
          pattern: "src/modules/*/**",
          capture: ["domain"],
        },
        { type: "test-setup", pattern: "src/test/**" },
      ],
    },
    rules: {
      // Relative/npm imports that are not "elements" (node_modules) are fine.
      "boundaries/no-unknown": "off",
      "boundaries/no-unknown-files": "off",
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app-root",
              allow: [
                "app-root",
                "domain-public",
                "domain",
                "prisma",
                "common",
                "infra",
              ],
            },
            {
              from: "domain",
              allow: [
                ["domain", { domain: "${from.domain}" }],
                ["domain-public", { domain: "${from.domain}" }],
                "prisma",
                "common",
              ],
            },
            {
              from: "domain-public",
              allow: [
                ["domain", { domain: "${from.domain}" }],
                ["domain-public", { domain: "${from.domain}" }],
                "domain-public",
                "prisma",
                "common",
              ],
            },
            { from: "prisma", allow: ["prisma"] },
            { from: "common", allow: ["common", "prisma"] },
            { from: "infra", allow: ["infra"] },
            {
              from: "test-setup",
              allow: [
                "app-root",
                "domain",
                "domain-public",
                "prisma",
                "common",
                "infra",
                "test-setup",
              ],
            },
          ],
        },
      ],
    },
  };
}
