import { test, expect } from "@playwright/test";
const widths = [375, 390, 768, 1440, 1920];
const routes = ["", "menu/", "recruit/", "company/"];
for (const width of widths) {
  for (const route of routes) {
    test(`${width}px ${route || "home"}: layout, assets, metadata`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
      const errors = [];
      const failed = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(r.url());
      });
      await page.goto(route || "./");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex,nofollow",
      );
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = "eager";
          await image.decode().catch(() => {});
        }
        await document.fonts.ready;
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images.filter((i) => !i.naturalWidth).map((i) => i.src),
          ),
      ).toEqual([]);
      const overflows = await page
        .locator("h1,h2,h3,p,button,a,dt,dd")
        .evaluateAll((elements) =>
          elements
            .filter((e) => {
              const s = getComputedStyle(e),
                r = e.getBoundingClientRect();
              return (
                r.width > 0 &&
                r.height > 0 &&
                s.position !== "fixed" &&
                !e.closest("dialog") &&
                !e.classList.contains("skip") &&
                (r.right > innerWidth + 1 || r.left < -1)
              );
            })
            .map((e) => e.textContent),
        );
      expect(overflows).toEqual([]);
      expect(errors).toEqual([]);
      expect(failed).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(
          `${route.replace("/", "") || "home"}-${width}.png`,
        ),
        fullPage: true,
      });
      if (!route && width === 390)
        await page
          .locator(".hero")
          .screenshot({ path: testInfo.outputPath("sp-hero-390.png") });
    });
  }
}
test("mobile navigation traps focus, Escape restores focus, anchor and route work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", {
    name: "メニューを開く",
    exact: true,
  });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const dialog = page.getByRole("dialog", { name: "腕火屋 UDEBIYA" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => document.activeElement.closest("#mobile-nav") !== null,
      ),
    ).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "店舗情報" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#access$/);
  await page.evaluate(() => scrollTo(0, 0));
  await trigger.click();
  await dialog.getByRole("link", { name: "メニュー", exact: true }).click();
  await expect(page).toHaveURL(/\/menu\/$/);
  await expect(
    page.getByRole("heading", { name: "メニュー", exact: true }),
  ).toBeVisible();
});
test("sample dialogs, keyboard dismissal and focus restoration", async ({
  page,
}) => {
  await page.goto("./");
  for (const kind of ["contact", "access", "opening"]) {
    const trigger = page.locator(`[data-dialog="${kind}"]`).first();
    await trigger.click();
    const dialog = page.locator(".info-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/架空|仮設定/);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      expect(
        await page.evaluate(
          () => document.activeElement.closest(".info-dialog") !== null,
        ),
      ).toBeTruthy();
    }
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.goto("recruit/");
  await page.locator('[data-dialog="recruit"]').click();
  await expect(page.locator(".info-dialog")).toContainText(
    "実際の求人募集は行っておりません",
  );
  await page
    .locator(".info-dialog")
    .getByRole("button", { name: "閉じる", exact: true })
    .last()
    .click();
  await expect(page.locator(".info-dialog")).not.toBeVisible();
});
test("menu preferences update without submitting a request", async ({
  page,
}) => {
  await page.goto("menu/");
  const requests = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") requests.push(r.url());
  });
  await page.getByLabel("硬め", { exact: true }).check();
  await page.getByLabel("薄め", { exact: true }).check();
  await page.getByLabel("少なめ", { exact: true }).check();
  await expect(page.getByRole("status")).toHaveText(
    "麺：硬め ／ 味：薄め ／ 油：少なめ",
  );
  expect(requests).toEqual([]);
});
test("narrow layout, reduced motion, and root hosting", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto("./");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("http://127.0.0.1:4182/");
  await expect(page.locator("h1 img")).toHaveAttribute("alt", "腕火屋");
});
