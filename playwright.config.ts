import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export const STORAGE_STATE = path.join(__dirname, "auth/user.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 120000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "https://app.pics.io",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // 1. Проєкт сетапу — запускає ТІЛЬКИ auth.setup.ts
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    // 2. Основні тести — запускають усі .spec.ts файли КРІМ setup
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE,
      },
      dependencies: ["setup"],
      testMatch: /.*\.spec\.ts/, // Явно вказуємо шукати всі spec-файли
    },
  ],
});
