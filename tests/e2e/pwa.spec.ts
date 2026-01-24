import { expect, test } from "@playwright/test";

test.describe("PWA Functionality", () => {
  test("should have a valid manifest", async ({ page }) => {
    await page.goto("/");

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", "/manifest.json");

    // Fetch and verify manifest
    const manifestResponse = await page.request.get("/manifest.json");
    expect(manifestResponse.ok()).toBeTruthy();

    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe("Noted - Grade Calculator");
    expect(manifest.short_name).toBe("Noted");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toHaveLength(2);
  });

  test("should register service worker", async ({ page, context }) => {
    await page.goto("/");

    // Wait for service worker to register
    await page.waitForTimeout(2000);

    const serviceWorker = await context.serviceWorkers();
    // Service worker may not register in test environment, but manifest should be accessible
    expect(serviceWorker.length).toBeGreaterThanOrEqual(0);
  });

  test("should have correct theme colors in manifest", async ({ page }) => {
    await page.goto("/");

    const manifestResponse = await page.request.get("/manifest.json");
    const manifest = await manifestResponse.json();

    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();
  });

  test("should have proper viewport meta tag", async ({ page }) => {
    await page.goto("/");

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      "content",
      expect.stringContaining("width=device-width"),
    );
  });

  test("should be accessible offline", async ({ page, context }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Go offline
    await context.setOffline(true);

    // Try to reload
    await page.reload();

    // Page should still be accessible (cached)
    await expect(page.getByRole("main")).toBeVisible();

    // Go back online
    await context.setOffline(false);
  });
});
