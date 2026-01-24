import { expect, test } from "@playwright/test";

test.describe("Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Mobile Viewport (375px)", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("should display correctly on mobile", async ({ page }) => {
      // Verify main elements are visible
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("table")).toBeVisible();
      await expect(page.getByLabel("Add a new grade item")).toBeVisible();

      // Verify footer is visible and positioned correctly
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // Verify table is scrollable horizontally
      const table = page.getByRole("table");
      const tableContainer = table.locator("..");
      const overflow = await tableContainer.evaluate(
        (el) => window.getComputedStyle(el).overflowX,
      );
      expect(overflow).toMatch(/auto|scroll/);
    });

    test("should allow adding grades on mobile", async ({ page }) => {
      await page.getByLabel("Add a new grade item").click();

      // Verify grade item form is visible and usable
      await expect(page.getByPlaceholder("Note name")).toBeVisible();
      await expect(page.getByLabel("Percentage").first()).toBeVisible();
    });

    test("should display footer correctly on mobile", async ({ page }) => {
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
      await expect(page.getByLabel("Global Scale:")).toBeVisible();
      await expect(page.getByRole("status")).toBeVisible();
    });
  });

  test.describe("Tablet Viewport (768px)", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("should display correctly on tablet", async ({ page }) => {
      // Verify main elements are visible
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("table")).toBeVisible();
      await expect(page.getByLabel("Add a new grade item")).toBeVisible();

      // Verify layout adapts
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });

    test("should handle grade items layout on tablet", async ({ page }) => {
      await page.getByLabel("Add a new grade item").click();

      // Verify all fields are accessible
      await expect(page.getByPlaceholder("Note name")).toBeVisible();
      await expect(page.getByLabel("Scale").first()).toBeVisible();
      await expect(page.getByLabel("Grade").first()).toBeVisible();
      await expect(page.getByLabel("Percentage").first()).toBeVisible();
      await expect(page.getByLabel("Points").first()).toBeVisible();
      await expect(page.getByLabel("Ratio").first()).toBeVisible();
    });
  });

  test.describe("Desktop Viewport (1280px)", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("should display correctly on desktop", async ({ page }) => {
      // Verify main elements are visible
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("table")).toBeVisible();
      await expect(page.getByLabel("Add a new grade item")).toBeVisible();

      // Verify footer layout
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });

    test("should display full table without horizontal scroll on desktop", async ({
      page,
    }) => {
      const table = page.getByRole("table");
      await expect(table).toBeVisible();

      // On desktop, table should be fully visible
      const tableContainer = table.locator("..");
      const isScrollable = await tableContainer.evaluate((el) => {
        return el.scrollWidth > el.clientWidth;
      });

      // Table might still be scrollable if content is wide, but should be usable
      expect(table).toBeVisible();
      // Verify table is not unnecessarily scrollable on desktop
      expect(isScrollable).toBe(false);
    });
  });

  test("should adapt footer layout for different viewports", async ({
    page,
  }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    const footerMobile = page.locator("footer");
    await expect(footerMobile).toBeVisible();
    await expect(page.getByLabel("Global Scale:")).toBeVisible();

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(footerMobile).toBeVisible();

    // Test desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(footerMobile).toBeVisible();
  });

  test("should handle table scrolling on small viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    // Verify table has scrollable container
    const tableContainer = table.locator("..");
    const overflowX = await tableContainer.evaluate(
      (el) => window.getComputedStyle(el).overflowX,
    );

    // Should be scrollable on mobile
    expect(overflowX).toMatch(/auto|scroll/);
  });

  test("should maintain functionality across viewport sizes", async ({
    page,
  }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("75");
    await expect(page.getByRole("status")).toContainText("| 75%");

    // Test on tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole("status")).toContainText("| 75%");

    // Test on desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByRole("status")).toContainText("| 75%");
  });
});
