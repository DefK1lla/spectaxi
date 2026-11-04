/**
 * FSD layer boundaries for admin / web / mobile (src/_app, _pages, …).
 * @param {import("eslint-plugin-boundaries").RuleElement[]} [extraElements]
 */
export function fsdBoundariesConfig(extraElements = []) {
  return {
    settings: {
      "boundaries/include": ["src/**/*.{ts,tsx}"],
      "boundaries/elements": [
        { type: "app", pattern: "src/_app/**" },
        {
          type: "page",
          pattern: "src/_pages/*",
          mode: "folder",
          capture: ["slice"],
        },
        {
          type: "feature",
          pattern: "src/features/*",
          mode: "folder",
          capture: ["slice"],
        },
        {
          type: "entity",
          pattern: "src/entities/*",
          mode: "folder",
          capture: ["slice"],
        },
        { type: "shared", pattern: "src/shared/**" },
        { type: "test", pattern: "src/test/**" },
        ...extraElements,
      ],
    },
    rules: {
      "boundaries/no-unknown": "off",
      "boundaries/no-unknown-files": "off",
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["app", "page", "feature", "entity", "shared"],
            },
            {
              from: "page",
              allow: [
                ["page", { slice: "${from.slice}" }],
                "feature",
                "entity",
                "shared",
              ],
            },
            {
              from: "feature",
              allow: [
                ["feature", { slice: "${from.slice}" }],
                "entity",
                "shared",
              ],
            },
            {
              from: "entity",
              allow: [["entity", { slice: "${from.slice}" }], "shared"],
            },
            { from: "shared", allow: ["shared"] },
            {
              from: "test",
              allow: ["app", "page", "feature", "entity", "shared", "test"],
            },
          ],
        },
      ],
    },
  };
}
