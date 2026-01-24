import { expect, test } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should toggle between light and dark mode", async ({ page }) => {
    const themeToggle = page.getByLabel("Toggle theme");
    await expect(themeToggle).toBeVisible();

    // Get initial theme (check if dark class exists on html)
    const html = page.locator("html");
    const initialTheme = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Toggle theme
    await themeToggle.click();

    // Wait for theme to change
    await page.waitForTimeout(500);

    // Verify theme changed
    const newTheme = await html.evaluate((el) => el.classList.contains("dark"));
    expect(newTheme).toBe(!initialTheme);
  });

  test("should persist theme across page reloads", async ({ page }) => {
    const themeToggle = page.getByLabel("Toggle theme");
    const html = page.locator("html");

    // Get initial theme
    const initialTheme = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Verify theme changed
    const toggledTheme = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(toggledTheme).toBe(!initialTheme);

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify theme persisted
    const persistedTheme = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(persistedTheme).toBe(toggledTheme);
  });

  test("should apply theme to all UI elements", async ({ page }) => {
    const themeToggle = page.getByLabel("Toggle theme");
    const html = page.locator("html");

    // Toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Verify dark class is applied
    await expect(html).toHaveClass(/dark/);

    // Verify UI elements are visible (they should be styled differently but still visible)
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByLabel("Add a new grade item")).toBeVisible();

    // Toggle back to light mode
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Verify dark class is removed
    const hasDarkClass = await html.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(hasDarkClass).toBe(false);
  });
});
