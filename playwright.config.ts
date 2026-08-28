import { defineConfig, devices } from "@playwright/test";

const testPort = process.env.BG_COUNTER_TEST_PORT ?? "3000";
const testBaseUrl = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: testBaseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `rm -rf .next && pnpm build && cp -R public .next/standalone/public && cp -R .next/static .next/standalone/.next/static && env PORT=${testPort} HOSTNAME=127.0.0.1 node .next/standalone/server.js`,
    url: testBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
