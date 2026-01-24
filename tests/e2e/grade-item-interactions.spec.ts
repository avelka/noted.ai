import { expect, test } from "@playwright/test";

test.describe("Grade Item Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Add a grade item for testing
    await page.getByLabel("Add a new grade item").click();
  });

  test("should update grade name when edited", async ({ page }) => {
    const nameInput = page.getByPlaceholder("Note name").first();
    await nameInput.fill("Math Test");
    await expect(nameInput).toHaveValue("Math Test");

    // Update the name
    await nameInput.fill("Math Final");
    await expect(nameInput).toHaveValue("Math Final");
  });

  test("should update grade dropdown when local scale changes", async ({
    page,
  }) => {
    // Initially should have Sek 1 scale (default)
    const gradeSelect = page.getByLabel("Grade").first();
    await gradeSelect.click();
    // Wait for dropdown to open by waiting for an expected option to appear
    // This is more reliable than waiting for the container
    const option6 = page.getByRole("option", { name: "6" });
    await expect(option6).toBeVisible({ timeout: 5000 });
    // Verify other Sek 1 options are visible
    await expect(page.getByRole("option", { name: "1+" })).toBeVisible();
    await page.keyboard.press("Escape");

    // Change to Sek 2 scale
    const scaleSelect = page.getByLabel("Scale").first();
    await scaleSelect.click();
    // Wait for scale dropdown to open
    await expect(page.getByRole("option", { name: "Sek 2" })).toBeVisible({
      timeout: 5000,
    });
    await page.getByRole("option", { name: "Sek 2" }).click();

    // Verify grade dropdown now shows Sek 2 grades
    await gradeSelect.click();
    // Wait for Sek 2 options to appear
    await expect(page.getByRole("option", { name: "0" })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByRole("option", { name: "15" })).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("should update percentage when grade is selected from dropdown", async ({
    page,
  }) => {
    // Set initial percentage
    const percentageInput = page.getByLabel("Percentage").first();
    await percentageInput.fill("50");

    // Select a grade from dropdown (e.g., "4" in Sek 1 should be 50%)
    const gradeSelect = page.getByLabel("Grade").first();
    await gradeSelect.click();
    await page.getByText("4").click();

    // Verify percentage is set to the threshold for grade "4" (50%)
    await expect(percentageInput).toHaveValue("50");

    // Select a different grade (e.g., "3" should be 60%)
    await gradeSelect.click();
    await page.getByText("3").click();

    // Verify percentage updated to 60%
    await expect(percentageInput).toHaveValue("60");
  });

  test("should update grade dropdown when percentage changes", async ({
    page,
  }) => {
    const percentageInput = page.getByLabel("Percentage").first();
    const gradeSelect = page.getByLabel("Grade").first();

    // Set percentage to 50
    await percentageInput.fill("50");
    await page.waitForTimeout(200);

    // Verify grade shows "4" (threshold for 50% in Sek 1)
    await expect(gradeSelect).toContainText("4");

    // Change percentage to 75
    await percentageInput.fill("75");
    await page.waitForTimeout(200);

    // Verify grade shows "2-" (threshold for 75% in Sek 1)
    await expect(gradeSelect).toContainText("2-");
  });

  test("should update weighted average when ratio changes", async ({
    page,
  }) => {
    // Set up first grade
    await page.getByPlaceholder("Note name").first().fill("Grade 1");
    await page.getByLabel("Percentage").first().fill("50");
    await page.getByLabel("Ratio").first().fill("1");

    // Add second grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByPlaceholder("Note name").nth(1).fill("Grade 2");
    await page.getByLabel("Percentage").nth(1).fill("70");
    await page.getByLabel("Ratio").nth(1).fill("1");

    // Initial weighted average: (50*1 + 70*1) / (1+1) = 60
    await expect(page.getByRole("status")).toContainText("| 60%");

    // Change ratio of first grade to 2
    await page.getByLabel("Ratio").first().fill("2");

    // New weighted average: (50*2 + 70*1) / (2+1) = 170/3 = 56.67 ≈ 57
    await expect(page.getByRole("status")).toContainText("| 57%");
  });

  test("should display correct points value", async ({ page }) => {
    const percentageInput = page.getByLabel("Percentage").first();
    const pointsInput = page.getByTestId("grade-points-input").first();

    // Set percentage to 50 (default max points is 100)
    await percentageInput.fill("50");
    await expect(pointsInput).toHaveValue("50");

    // Change max points to 200
    await page.getByTestId("max-points-input").fill("200");

    // Points should update: 50% of 200 = 100
    await expect(pointsInput).toHaveValue("100");
  });

  test("should handle all three local scale types", async ({ page }) => {
    const scaleSelect = page.getByLabel("Scale").first();
    const gradeSelect = page.getByLabel("Grade").first();

    // Test Sek 2 scale
    await scaleSelect.click();
    await page.getByText("Sek 2").click();
    await gradeSelect.click();
    await expect(page.getByText("0")).toBeVisible();
    await expect(page.getByText("15")).toBeVisible();
    await page.keyboard.press("Escape");

    // Test Sek 1 scale
    await scaleSelect.click();
    await page.getByText("Sek 1").click();
    await gradeSelect.click();
    await expect(page.getByText("6")).toBeVisible();
    await expect(page.getByText("1+")).toBeVisible();
    await page.keyboard.press("Escape");

    // Test Sprachen scale
    await scaleSelect.click();
    await page.getByText("Sprachen").click();
    await gradeSelect.click();
    await expect(page.getByText("6")).toBeVisible();
    await expect(page.getByText("1")).toBeVisible();
    await page.keyboard.press("Escape");
  });
});
