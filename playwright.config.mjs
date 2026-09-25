import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:4182/sample_food2/",
    reducedMotion: "reduce",
    launchOptions: process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : {},
  },
  webServer: {
    command: "node serve.mjs",
    url: "http://127.0.0.1:4182/",
    reuseExistingServer: !process.env.CI,
  },
});
