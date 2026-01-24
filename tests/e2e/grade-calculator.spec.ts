import { expect, test } from "@playwright/test";

test.describe("Grade Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the grade calculator interface", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByLabelText("Max Points:")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByLabelText("Add a new grade item")).toBeVisible();
  });

  test("should add a grade and verify total updates", async ({ page }) => {
    // Add a grade
    await page.getByLabelText("Add a new grade item").click();

    // Fill in the grade details
    const nameInput = page.getByPlaceholder("Note name");
    await nameInput.fill("Test Grade");

    // Change percentage
    const percentageInput = page.getByLabelText("Percentage").first();
    await percentageInput.fill("75");

    // Wait for total to update
    await expect(page.getByRole("status")).toContainText("| 75%");
  });

  test("should remove a grade and verify total updates", async ({ page }) => {
    // Add a grade
    await page.getByLabelText("Add a new grade item").click();

    // Fill in the grade
    await page.getByPlaceholder("Note name").fill("Test Grade");
    await page.getByLabelText("Percentage").first().fill("80");

    // Verify it's added
    await expect(page.getByPlaceholder("Note name")).toBeVisible();

    // Delete the grade
    await page.getByLabelText("Delete Test Grade").click();

    // Verify it's removed
    await expect(page.getByPlaceholder("Note name")).not.toBeVisible();
  });

  test("should change global scale and verify total updates", async ({
    page,
  }) => {
    // Add a grade
    await page.getByLabelText("Add a new grade item").click();
    await page.getByLabelText("Percentage").first().fill("50");

    // Change global scale
    await page.getByLabelText("Global Scale:").click();
    await page.getByText("Sek 2").click();

    // Verify total updates with new scale
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("should change points configuration and verify point values update", async ({
    page,
  }) => {
    // Add a grade
    await page.getByLabelText("Add a new grade item").click();
    await page.getByLabelText("Percentage").first().fill("50");

    // Change max points
    const pointsInput = page.getByLabelText("Max Points:");
    await pointsInput.fill("200");

    // Verify points value updates (50% of 200 = 100)
    const pointsInputField = page.getByLabelText("Points").first();
    await expect(pointsInputField).toHaveValue("100");
  });

  test("should calculate weighted average correctly", async ({ page }) => {
    // Add first grade
    await page.getByLabelText("Add a new grade item").click();
    await page.getByPlaceholder("Note name").fill("Grade 1");
    await page.getByLabelText("Percentage").first().fill("50");
    await page.getByLabelText("Ratio").first().fill("1");

    // Add second grade
    await page.getByLabelText("Add a new grade item").click();
    const secondNameInput = page.getByPlaceholder("Note name").nth(1);
    await secondNameInput.fill("Grade 2");
    const secondPercentageInput = page.getByLabelText("Percentage").nth(1);
    await secondPercentageInput.fill("70");
    const secondRatioInput = page.getByLabelText("Ratio").nth(1);
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
    await page.getByLabelText("Global Scale:").click();
    await page.getByText("Sek 2").click();

    // Verify table updated
    await expect(page.getByRole("table")).toContainText("0");
    await expect(page.getByRole("table")).toContainText("15");
  });

  test("should display points row when points is not 100", async ({ page }) => {
    // Change max points
    await page.getByLabelText("Max Points:").fill("200");

    // Verify points row appears
    await expect(page.getByRole("table")).toContainText("Points");
  });

  test("should not display points row when points is 100", async ({ page }) => {
    // Ensure points is 100
    await page.getByLabelText("Max Points:").fill("100");

    // Verify points row is not visible
    const table = page.getByRole("table");
    await expect(table).not.toContainText("Points");
  });
});
