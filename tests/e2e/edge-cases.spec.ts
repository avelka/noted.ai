import { expect, test } from "@playwright/test";

test.describe("Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display empty state correctly", async ({ page }) => {
    // Verify no grades are present
    await expect(page.getByPlaceholder("Note name")).not.toBeVisible();

    // Verify footer shows "-" for total grade
    const status = page.getByRole("status");
    await expect(status).toContainText("-");
    await expect(status).toContainText("0%");
  });

  test("should handle single grade correctly", async ({ page }) => {
    // Add a single grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("75");

    // Verify total shows the same percentage
    await expect(page.getByRole("status")).toContainText("| 75%");

    // Verify grade is displayed correctly
    const gradeSelect = page.getByLabel("Grade").first();
    await expect(gradeSelect).toContainText("2-"); // 75% in Sek 1 = "2-"
  });

  test("should handle 0% percentage", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();

    const percentageInput = page.getByLabel("Percentage").first();
    await percentageInput.fill("0");

    // Verify it accepts 0
    await expect(percentageInput).toHaveValue("0");

    // Verify grade is lowest (6 for Sek 1)
    const gradeSelect = page.getByLabel("Grade").first();
    await expect(gradeSelect).toContainText("6");

    // Verify total updates
    await expect(page.getByRole("status")).toContainText("| 0%");
  });

  test("should handle 100% percentage", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();

    const percentageInput = page.getByLabel("Percentage").first();
    await percentageInput.fill("100");

    // Verify it accepts 100
    await expect(percentageInput).toHaveValue("100");

    // Verify grade is highest (1+ for Sek 1)
    const gradeSelect = page.getByLabel("Grade").first();
    await expect(gradeSelect).toContainText("1+");

    // Verify total updates
    await expect(page.getByRole("status")).toContainText("| 100%");
  });

  test("should enforce minimum ratio of 1", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();

    const ratioInput = page.getByLabel("Ratio").first();

    // Try to set ratio to 0 (should not work or default to 1)
    await ratioInput.fill("0");
    // The input should either reject it or default to 1
    // Let's check if it's at least 1
    const value = await ratioInput.inputValue();
    const numValue = parseInt(value, 10);
    expect(numValue).toBeGreaterThanOrEqual(1);

    // Set to 1 (minimum valid)
    await ratioInput.fill("1");
    await expect(ratioInput).toHaveValue("1");
  });

  test("should handle maximum points boundary", async ({ page }) => {
    const maxPointsInput = page.getByTestId("max-points-input");

    // Set a high max points value
    await maxPointsInput.fill("1000");

    await page.getByLabel("Add a new grade item").click();

    // Set percentage to 100
    await page.getByLabel("Percentage").first().fill("100");

    // Points should be 1000
    const pointsInput = page.getByLabel("Points").first();
    await expect(pointsInput).toHaveValue("1000");
  });

  test("should handle invalid percentage input", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();

    const percentageInput = page.getByLabel("Percentage").first();

    // Try negative value (should be rejected or clamped)
    await percentageInput.fill("-10");
    // Input should either be empty or clamped to 0
    const value = await percentageInput.inputValue();
    if (value) {
      const numValue = parseInt(value, 10);
      expect(numValue).toBeGreaterThanOrEqual(0);
    }

    // Try value over 100 (should be rejected or clamped)
    await percentageInput.fill("150");
    const value2 = await percentageInput.inputValue();
    if (value2) {
      const numValue = parseInt(value2, 10);
      expect(numValue).toBeLessThanOrEqual(100);
    }
  });

  test("should handle multiple grades with extreme values", async ({
    page,
  }) => {
    // Add first grade with 0%
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("0");
    await page.getByLabel("Ratio").first().fill("1");

    // Add second grade with 100%
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").nth(1).fill("100");
    await page.getByLabel("Ratio").nth(1).fill("1");

    // Weighted average: (0*1 + 100*1) / (1+1) = 50
    await expect(page.getByRole("status")).toContainText("| 50%");
  });

  test("should handle very high ratio values", async ({ page }) => {
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("50");
    await page.getByLabel("Ratio").first().fill("100");

    // Add second grade with lower ratio
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").nth(1).fill("100");
    await page.getByLabel("Ratio").nth(1).fill("1");

    // Weighted average: (50*100 + 100*1) / (100+1) = 5100/101 ≈ 50
    await expect(page.getByRole("status")).toContainText("| 50%");
  });

  test("should handle deletion of all grades", async ({ page }) => {
    // Add a grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByPlaceholder("Note name").first().fill("Test Grade");

    // Verify it exists
    await expect(page.getByPlaceholder("Note name").first()).toBeVisible();

    // Delete it
    await page.getByLabel("Delete Test Grade").click();

    // Verify empty state is restored
    await expect(page.getByPlaceholder("Note name")).not.toBeVisible();
    await expect(page.getByRole("status")).toContainText("-");
  });

  test("should handle rapid add/delete operations", async ({ page }) => {
    // Add multiple grades quickly
    for (let i = 0; i < 3; i++) {
      await page.getByLabel("Add a new grade item").click();
    }

    // Verify all are present
    const nameInputs = page.getByPlaceholder("Note name");
    await expect(nameInputs).toHaveCount(3);

    // Delete all
    for (let i = 0; i < 3; i++) {
      const deleteButton = page.getByRole("button", { name: /Delete/ }).first();
      await deleteButton.click();
    }

    // Verify empty state
    await expect(page.getByPlaceholder("Note name")).not.toBeVisible();
  });
});
