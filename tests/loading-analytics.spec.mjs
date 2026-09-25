import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

test.describe("brand loading", () => {
  test.use({ reducedMotion: "no-preference" });
  for (const width of [390, 1440]) {
    test(`first visit at ${width}px, then skip within the same tab`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("./", { waitUntil: "domcontentloaded" });
      await expect(page.locator("#site-loader")).toBeVisible();
      await expect(page.locator("#site-shell")).toHaveAttribute("inert", "");
      await page.waitForTimeout(650);
      await page.screenshot({ path: info.outputPath(`loading-${width}.png`) });
      await expect(page.locator("#site-loader")).toBeHidden({ timeout: 4000 });
      await expect(page.locator("#site-shell")).not.toHaveAttribute(
        "inert",
        "",
      );
      await page.reload();
      await expect(page.locator("#site-loader")).toBeHidden();
      await page.goto("menu/");
      await expect(page.locator("#site-loader")).toBeHidden();
    });
  }
  test("keyboard skip restores usable content", async ({ page }) => {
    await page.goto("./", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    await expect(page.locator(".loader-skip")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#site-loader")).toBeHidden();
    await expect(page.locator("#main")).toBeFocused();
    await page.locator('[data-dialog="contact"]').first().click();
    await expect(page.locator(".info-dialog")).toBeVisible();
  });
  test("stalled hero releases by deadline and Escape can skip", async ({
    page,
  }) => {
    await page.route("**/assets/hero*.webp", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await route.abort().catch(() => {});
    });
    await page.goto("./", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#site-loader")).toBeVisible();
    await expect(page.locator("#site-loader")).toBeHidden({ timeout: 3500 });
    await expect(page.locator("#site-shell")).not.toHaveAttribute("inert", "");
    await page.evaluate(() => sessionStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-loader")).toBeHidden();
  });
  test("anchor links bypass intro", async ({ page }) => {
    await page.goto("./#access");
    await expect(page.locator("#site-loader")).toBeHidden();
    await expect(page.locator("#site-shell")).not.toHaveAttribute("inert", "");
  });
});

test("reduced motion bypasses intro", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("#site-loader")).toBeHidden();
  await expect(page.locator("#site-shell")).not.toHaveAttribute("inert", "");
});
test("disabled JavaScript still shows the page", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator("#site-loader")).toBeHidden();
  await expect(page.locator("h1")).toBeVisible();
  await context.close();
});

// Serve local build at the production origin, intercepting every external request.
// This verifies integration without sending test traffic to Google Analytics.
const origin = "https://onebe-inc.github.io";
async function mockPublishedSite(page) {
  const tags = [];
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "www.googletagmanager.com") {
      tags.push(url.href);
      return route.fulfill({
        contentType: "text/javascript",
        body: "/* offline tag stub */",
      });
    }
    if (url.origin !== origin || !url.pathname.startsWith("/sample_food2/"))
      return route.abort();
    let file = url.pathname.slice("/sample_food2/".length);
    if (!file || file.endsWith("/")) file += "index.html";
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };
    await route.fulfill({
      body: await fs.readFile(path.resolve("public", file)),
      contentType: types[path.extname(file)],
    });
  });
  return tags;
}
const queue = (page) =>
  page.evaluate(() => (window.dataLayer || []).map((item) => Array.from(item)));

test("GA4 one config, sanitized URL, meaningful events and deduplicated scroll", async ({
  page,
}) => {
  const tags = await mockPublishedSite(page);
  await page.goto(`${origin}/sample_food2/?private_test=omit#top`);
  await expect.poll(() => tags.length).toBe(1);
  let calls = await queue(page);
  const configs = calls.filter((call) => call[0] === "config");
  expect(configs).toHaveLength(1);
  expect(configs[0][1]).toMatch(/^G-[A-Z0-9]+$/);
  expect(configs[0][2].page_location).toBe(`${origin}/sample_food2/`);
  expect(configs[0][2].allow_google_signals).toBe(false);
  expect(calls.filter((call) => call[1] === "page_view")).toHaveLength(0);
  // Use the canonical URL for same-document anchor checks below.
  await page.goto(`${origin}/sample_food2/`);
  await page.locator('[data-dialog="contact"]').first().click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect
    .poll(
      async () =>
        (await queue(page)).filter((call) => call[1] === "scroll_depth").length,
    )
    .toBe(4);
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  calls = await queue(page);
  expect(calls.filter((call) => call[1] === "scroll_depth")).toHaveLength(4);
  expect(calls.find((call) => call[1] === "contact_open")[2]).toMatchObject({
    placement: "header",
    is_demo: true,
  });
  await page.locator('footer a[href="./#access"]').click();
  expect(
    (await queue(page)).some(
      (call) =>
        call[1] === "navigation_click" &&
        call[2].destination === "/sample_food2/#access",
    ),
  ).toBe(true);
  expect(
    (await queue(page)).filter((call) => call[0] === "config"),
  ).toHaveLength(1);
  await page.goto(`${origin}/sample_food2/menu/`);
  expect(
    (await queue(page)).filter((call) => call[1] === "menu_view"),
  ).toHaveLength(1);
});
test("local preview does not collect analytics", async ({ page }) => {
  const external = [];
  page.on("request", (r) => {
    if (r.url().includes("google")) external.push(r.url());
  });
  await page.goto("./");
  expect(await queue(page)).toEqual([]);
  expect(external).toEqual([]);
});
test("analytics opt-out prevents loading Google tag", async ({ page }) => {
  const tags = await mockPublishedSite(page);
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const id = document.querySelector(
        'meta[name="ga4-measurement-id"]',
      )?.content;
      if (id) window[`ga-disable-${id}`] = true;
    });
    observer.observe(document, { subtree: true, childList: true });
  });
  await page.goto(`${origin}/sample_food2/`);
  expect(tags).toEqual([]);
  expect(await queue(page)).toEqual([]);
});
