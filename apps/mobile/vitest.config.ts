import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    name: "mobile",
    environment: "node",
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.spec.{ts,tsx}", "src/app/**"],
    },
  },
});
