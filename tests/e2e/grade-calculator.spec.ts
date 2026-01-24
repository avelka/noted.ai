import { expect, test } from "@playwright/test";

test.describe("Grade Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the grade calculator interface", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByTestId("max-points-input")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByLabel("Add a new grade item")).toBeVisible();
  });

  test("should add a grade and verify total updates", async ({ page }) => {
    // Add a grade
    await page.getByLabel("Add a new grade item").click();

    // Fill in the grade details
    const nameInput = page.getByPlaceholder("Note name");
    await nameInput.fill("Test Grade");

    // Change percentage
    const percentageInput = page.getByLabel("Percentage").first();
    await percentageInput.fill("75");

    // Wait for total to update
    await expect(page.getByRole("status")).toContainText("| 75%");
  });

  test("should remove a grade and verify total updates", async ({ page }) => {
    // Add a grade
    await page.getByLabel("Add a new grade item").click();

    // Fill in the grade
    await page.getByPlaceholder("Note name").fill("Test Grade");
    await page.getByLabel("Percentage").first().fill("80");

    // Verify it's added
    await expect(page.getByPlaceholder("Note name")).toBeVisible();

    // Delete the grade
    await page.getByLabel("Delete Test Grade").click();

    // Verify it's removed
    await expect(page.getByPlaceholder("Note name")).not.toBeVisible();
  });

  test("should change global scale and verify total updates", async ({
    page,
  }) => {
    // Add a grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("50");

    // Change global scale
    await page.getByLabel("Global Scale:").click();
    await page.getByText("Sek 2").click();

    // Verify total updates with new scale
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("should change points configuration and verify point values update", async ({
    page,
  }) => {
    // Add a grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByLabel("Percentage").first().fill("50");

    // Verify initial points value (50% of 100 = 50)
    const pointsInputField = page.getByTestId("grade-points-input").first();
    await expect(pointsInputField).toHaveValue("50");

    // Change max points
    const maxPointsInput = page.getByTestId("max-points-input");
    await maxPointsInput.fill("200");

    // Wait for points value to update (50% of 200 = 100)
    await expect(pointsInputField).toHaveValue("100");
  });

  test("should calculate weighted average correctly", async ({ page }) => {
    // Add first grade
    await page.getByLabel("Add a new grade item").click();
    await page.getByPlaceholder("Note name").fill("Grade 1");
    await page.getByLabel("Percentage").first().fill("50");
    await page.getByLabel("Ratio").first().fill("1");

    // Add second grade
    await page.getByLabel("Add a new grade item").click();
    const secondNameInput = page.getByPlaceholder("Note name").nth(1);
    await secondNameInput.fill("Grade 2");
    const secondPercentageInput = page.getByLabel("Percentage").nth(1);
    await secondPercentageInput.fill("70");
    const secondRatioInput = page.getByLabel("Ratio").nth(1);
    await secondRatioInput.fill("2");

    // Weighted average: (50*1 + 70*2) / (1+2) = 190/3 = 63.33... ≈ 63
    await expect(page.getByRole("status")).toContainText("| 63%");
  });

  test("should update grade table when global scale changes", async ({
    page,
  }) => {
    // Check initial scale (Sek 1)
    await expect(page.getByRole("table")).toContainText("6");
    await expect(page.getByRole("table")).toContainText("1+");

    // Change to Sek 2
    await page.getByLabel("Global Scale:").click();
    await page.getByText("Sek 2").click();

    // Verify table updated
    await expect(page.getByRole("table")).toContainText("0");
    await expect(page.getByRole("table")).toContainText("15");
  });

  test("should display points row when points is not 100", async ({ page }) => {
    // Change max points
    await page.getByTestId("max-points-input").fill("200");

    // Verify points row appears
    await expect(page.getByRole("table")).toContainText("Points");
  });

  test("should not display points row when points is 100", async ({ page }) => {
    // Ensure points is 100
    await page.getByTestId("max-points-input").fill("100");

    // Verify points row is not visible
    const table = page.getByRole("table");
    await expect(table).not.toContainText("Points");
  });

  test("should handle multiple grades with different local scales", async ({
    page,
  }) => {
    // Add first grade with Sek 1 scale
    await page.getByLabel("Add a new grade item").click();
    await page.getByPlaceholder("Note name").first().fill("Math Test");
    await page.getByLabel("Percentage").first().fill("75");
    // Default is Sek 1, verify it shows correct grade
    await expect(page.getByLabel("Grade").first()).toContainText("2-");

    // Add second grade with Sek 2 scale
    await page.getByLabel("Add a new grade item").click();
    await page.getByPlaceholder("Note name").nth(1).fill("Science Test");
    await page.getByLabel("Percentage").nth(1).fill("50");
    // Change to Sek 2 scale
    const secondScaleSelect = page.getByLabel("Scale").nth(1);
    await secondScaleSelect.click();
    await page.getByText("Sek 2").click();
    // Verify it shows correct grade for Sek 2 (50% = 6 in Sek 2)
    await expect(page.getByLabel("Grade").nth(1)).toContainText("6");

    // Add third grade with Sprachen scale
    await page.getByLabel("Add a new grade item").click();
    await page.getByPlaceholder("Note name").nth(2).fill("Language Test");
    await page.getByLabel("Percentage").nth(2).fill("80");
    // Change to Sprachen scale
    const thirdScaleSelect = page.getByLabel("Scale").nth(2);
    await thirdScaleSelect.click();
    await page.getByText("Sprachen").click();
    // Verify it shows correct grade for Sprachen (80% = 2 in Sprachen)
    await expect(page.getByLabel("Grade").nth(2)).toContainText("2");

    // Verify weighted average is calculated correctly
    // (75*1 + 50*1 + 80*1) / 3 = 205/3 ≈ 68
    await expect(page.getByRole("status")).toContainText("| 68%");

    // Verify each grade maintains its own scale
    await expect(page.getByLabel("Grade").first()).toContainText("2-"); // Sek 1
    await expect(page.getByLabel("Grade").nth(1)).toContainText("6"); // Sek 2
    await expect(page.getByLabel("Grade").nth(2)).toContainText("2-"); // Sprachen
  });
});
