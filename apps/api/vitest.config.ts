import path from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "api",
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts", "src/test/**", "src/main.ts"],
    },
  },
  plugins: [
    swc.vite({
      jsc: {
        parser: { syntax: "typescript", decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      "@spectaxi/contracts": path.resolve(
        __dirname,
        "../../packages/contracts/src/index.ts",
      ),
    },
  },
});
