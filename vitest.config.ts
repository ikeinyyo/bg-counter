import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        "public/**",
        "src/app/sw.ts",
      ],
    },
    restoreMocks: true,
    clearMocks: true,
  },
});
