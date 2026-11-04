import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";
import { nestBoundariesConfig } from "../../eslint/nest-boundaries.mjs";

const nestBoundaries = nestBoundariesConfig();

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["src/**/*.ts"],
    plugins: { boundaries },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: nestBoundaries.settings,
    rules: {
      ...nestBoundaries.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
);
