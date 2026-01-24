import { expect, test } from "@playwright/test";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have proper ARIA labels on interactive elements", async ({
    page,
  }) => {
    // Check theme toggle
    const themeToggle = page.getByLabel("Toggle theme");
    await expect(themeToggle).toBeVisible();

    // Check add button
    const addButton = page.getByLabel("Add a new grade item");
    await expect(addButton).toBeVisible();

    // Check max points input
    const maxPointsInput = page.getByTestId("max-points-input");
    await expect(maxPointsInput).toBeVisible();

    // Check global scale
    const globalScaleLabel = page.getByLabel("Global Scale:");
    await expect(globalScaleLabel).toBeVisible();
  });

  test("should support keyboard navigation", async ({ page }) => {
    // Start from the top
    await page.keyboard.press("Tab");

    // Should focus on theme toggle or first interactive element
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verify we can navigate through the page
    const currentFocus = page.locator(":focus");
    await expect(currentFocus).toBeVisible();
  });

  test("should have proper ARIA attributes on grade items", async ({
    page,
  }) => {
    await page.getByLabel("Add a new grade item").click();

    // Check delete button has aria-label
    const deleteButton = page.getByRole("button", { name: /Delete/ }).first();
    await expect(deleteButton).toHaveAttribute("aria-label", /Delete/);

    // Check inputs have proper labels (via sr-only labels)
    await expect(page.getByPlaceholder("Note name")).toBeVisible();
    await expect(page.getByLabel("Percentage").first()).toBeVisible();
    await expect(page.getByLabel("Ratio").first()).toBeVisible();
  });

  test("should have proper status region for total grade", async ({ page }) => {
    // Check footer has status role
    const status = page.getByRole("status");
    await expect(status).toBeVisible();

    // Check it has aria-live and aria-atomic
    await expect(status).toHaveAttribute("aria-live", "polite");
    await expect(status).toHaveAttribute("aria-atomic", "true");
  });

  test("should update status region when grade changes", async ({ page }) => {
    const status = page.getByRole("status");

    // Initial state
    await expect(status).toContainText("-");

    // Add grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("75");

    // Status should update
    await expect(status).toContainText("| 75%");
  });

  test("should have proper table accessibility", async ({ page }) => {
    const table = page.getByRole("table");

    // Check table has aria-label
    await expect(table).toHaveAttribute("aria-label", /Grade conversion table/);

    // Verify table structure
    await expect(table.getByRole("rowheader", { name: "Grade" })).toBeVisible();
    await expect(
      table.getByRole("rowheader", { name: "Percentage (≥)" }),
    ).toBeVisible();
  });

  test("should support keyboard interaction with selects", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();

    // Focus on scale select using keyboard navigation
    // Use a more specific locator to avoid matching other elements
    const scaleSelect = page.locator('[aria-label="Scale"]').first();
    await scaleSelect.focus();

    // Open dropdown using keyboard - Radix UI Select opens with Space, Enter, or ArrowDown
    await page.keyboard.press("Space");

    // Wait for dropdown to open - Radix UI Select renders content in a portal
    // Allow time for portal to render and dropdown to open
    await page.waitForTimeout(300);

    // Use keyboard to navigate to Sek 2
    // The options are ordered: Sek 2, Sek 1 (current), Sprachen
    // Since we're on Sek 1, ArrowUp goes to Sek 2, ArrowDown goes to Sprachen
    // For this test, we'll use ArrowUp to go to Sek 2
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");

    // Wait a bit for the selection to update
    await page.waitForTimeout(200);

    // Verify selection changed to Sek 2
    // Use a more specific assertion that checks the select value
    await expect(scaleSelect).toContainText("Sek 2");
  });

  test("should have visible focus indicators", async ({ page }) => {
    // Tab to an interactive element
    await page.keyboard.press("Tab");

    // Check if focused element has visible focus
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Get computed styles to verify focus is visible
    const outline = await focusedElement.evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });

    // Focus should be visible (outline should not be "none" or "0px")
    expect(outline).not.toBe("none");
  });

  test("should have proper heading structure", async ({ page }) => {
    // Check for screen reader heading
    const heading = page.getByRole("heading", { name: "Noted" });
    await expect(heading).toHaveClass(/sr-only/);
  });

  test("should support keyboard shortcuts for form submission", async ({
    page,
  }) => {
    await page.getByLabel("Add a new grade item").click();

    // Fill in a field
    const nameInput = page.getByPlaceholder("Note name").first();
    await nameInput.fill("Test Grade");

    // Press Enter (should not submit form, just blur or stay in field)
    await page.keyboard.press("Enter");

    // Verify value is still there
    await expect(nameInput).toHaveValue("Test Grade");
  });

  test("should have proper labels for all form inputs", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();

    // All inputs should be accessible via labels
    await expect(page.getByLabel("Percentage").first()).toBeVisible();
    await expect(page.getByLabel("Points").first()).toBeVisible();
    await expect(page.getByLabel("Ratio").first()).toBeVisible();
    await expect(page.getByLabel("Scale").first()).toBeVisible();
    await expect(page.getByLabel("Grade").first()).toBeVisible();
  });
});
