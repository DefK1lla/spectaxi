const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier");
const boundaries = require("eslint-plugin-boundaries");

/** @type {import("eslint").Linter.Config[]} */
module.exports = defineConfig([
  expoConfig,
  eslintConfigPrettier,
  {
    ignores: ["dist/**", "node_modules/**", ".expo/**", "coverage/**"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
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
        { type: "router", pattern: "src/app/**" },
        { type: "test", pattern: "src/test/**" },
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
              from: "router",
              allow: ["router", "app", "page", "feature", "entity", "shared"],
            },
            {
              from: "test",
              allow: [
                "app",
                "page",
                "feature",
                "entity",
                "shared",
                "router",
                "test",
              ],
            },
          ],
        },
      ],
    },
  },
]);
