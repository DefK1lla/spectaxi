import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "contracts",
    environment: "node",
    include: ["src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts"],
    },
  },
});
