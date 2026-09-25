import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`steam moves above the bowl at ${width}px and can be paused`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await expect(page.locator("#site-loader")).toBeHidden({ timeout: 4500 });
    const steam = page.locator(".hero-steam");
    await expect(steam).toBeVisible();
    await expect(steam).toHaveAttribute("aria-hidden", "true");
    expect(
      await steam.evaluate((el) => getComputedStyle(el).pointerEvents),
    ).toBe("none");
    const wisp = page.locator(".wisp-2");
    const before = await wisp.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(450);
    expect(
      await wisp.evaluate((el) => getComputedStyle(el).transform),
    ).not.toBe(before);
    await page.screenshot({ path: info.outputPath(`steam-${width}.png`) });
    const toggle = page.getByRole("button", { name: "湯気の動きを止める" });
    await toggle.click();
    await expect(steam).toBeHidden();
    await expect(page.locator(".steam-toggle")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await page.getByRole("button", { name: "湯気の動きを再生する" }).click();
    await expect(steam).toBeVisible();
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect
      .poll(() =>
        wisp.evaluate((el) => getComputedStyle(el).animationPlayState),
      )
      .toBe("paused");
  });
}
test("reduced motion disables steam and its control", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".hero-steam")).toBeHidden();
  await expect(page.locator(".steam-toggle")).toBeHidden();
  expect(
    await page
      .locator(".wisp-1")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
