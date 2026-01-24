import { expect, test } from "@playwright/test";

test.describe("Grade Conversion Accuracy", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Add a new grade item").click();
  });

  test.describe("Sek 2 Scale", () => {
    test("should convert percentages to correct grades", async ({ page }) => {
      // Set scale to Sek 2
      const scaleSelect = page.getByLabel("Scale").first();
      await scaleSelect.click();
      await page.getByText("Sek 2").click();

      const percentageInput = page.getByLabel("Percentage").first();
      const gradeSelect = page.getByLabel("Grade").first();

      // Test threshold values
      const testCases = [
        { percentage: 0, expectedGrade: "0" },
        { percentage: 20, expectedGrade: "1" },
        { percentage: 27, expectedGrade: "2" },
        { percentage: 50, expectedGrade: "6" },
        { percentage: 75, expectedGrade: "11" },
        { percentage: 95, expectedGrade: "15" },
        { percentage: 100, expectedGrade: "15" },
      ];

      for (const testCase of testCases) {
        await percentageInput.fill(testCase.percentage.toString());
        await page.waitForTimeout(200);
        await expect(gradeSelect).toContainText(testCase.expectedGrade);
      }
    });

    test("should handle boundary values correctly", async ({ page }) => {
      const scaleSelect = page.getByLabel("Scale").first();
      await scaleSelect.click();
      await page.getByText("Sek 2").click();

      const percentageInput = page.getByLabel("Percentage").first();
      const gradeSelect = page.getByLabel("Grade").first();

      // Test values just below and above thresholds
      await percentageInput.fill("19"); // Just below 20
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("0");

      await percentageInput.fill("20"); // Exactly at threshold
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("1");

      await percentageInput.fill("26"); // Just below 27
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("1");

      await percentageInput.fill("27"); // Exactly at threshold
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("2");
    });
  });

  test.describe("Sek 1 Scale", () => {
    test("should convert percentages to correct grades", async ({ page }) => {
      // Default scale is Sek 1, so no need to change
      const percentageInput = page.getByLabel("Percentage").first();
      const gradeSelect = page.getByLabel("Grade").first();

      const testCases = [
        { percentage: 0, expectedGrade: "6" },
        { percentage: 20, expectedGrade: "5-" },
        { percentage: 50, expectedGrade: "4" },
        { percentage: 75, expectedGrade: "2-" },
        { percentage: 98, expectedGrade: "1+" },
        { percentage: 100, expectedGrade: "1+" },
      ];

      for (const testCase of testCases) {
        await percentageInput.fill(testCase.percentage.toString());
        await page.waitForTimeout(200);
        await expect(gradeSelect).toContainText(testCase.expectedGrade);
      }
    });

    test("should handle boundary values correctly", async ({ page }) => {
      const percentageInput = page.getByLabel("Percentage").first();
      const gradeSelect = page.getByLabel("Grade").first();

      // Test values around key thresholds
      await percentageInput.fill("44"); // Just below 45
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("5+");

      await percentageInput.fill("45"); // Exactly at threshold
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("4-");

      await percentageInput.fill("93"); // Just below 94
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("1-");

      await percentageInput.fill("94"); // Exactly at threshold
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("1");
    });
  });

  test.describe("Sprachen Scale", () => {
    test("should convert percentages to correct grades", async ({ page }) => {
      const scaleSelect = page.getByLabel("Scale").first();
      await scaleSelect.click();
      await page.getByText("Sprachen").click();

      const percentageInput = page.getByLabel("Percentage").first();
      const gradeSelect = page.getByLabel("Grade").first();

      const testCases = [
        { percentage: 0, expectedGrade: "6" },
        { percentage: 23, expectedGrade: "6+" },
        { percentage: 50, expectedGrade: "4" },
        { percentage: 80, expectedGrade: "2" }, // 80% threshold gives grade "2"
        { percentage: 94, expectedGrade: "1" },
        { percentage: 100, expectedGrade: "1" },
      ];

      for (const testCase of testCases) {
        await percentageInput.fill(testCase.percentage.toString());
        await page.waitForTimeout(200);
        await expect(gradeSelect).toContainText(testCase.expectedGrade);
      }
    });

    test("should handle boundary values correctly", async ({ page }) => {
      const scaleSelect = page.getByLabel("Scale").first();
      await scaleSelect.click();
      await page.getByText("Sprachen").click();

      const percentageInput = page.getByLabel("Percentage").first();
      const gradeSelect = page.getByLabel("Grade").first();

      // Test values around key thresholds
      await percentageInput.fill("22"); // Just below 23
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("6");

      await percentageInput.fill("23"); // Exactly at threshold
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("6+");

      await percentageInput.fill("91"); // Just below 92
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("1-");

      await percentageInput.fill("94"); // Exactly at threshold
      await page.waitForTimeout(200);
      await expect(gradeSelect).toContainText("1");
    });
  });

  test("should convert 0% correctly for all scales", async ({ page }) => {
    const percentageInput = page.getByLabel("Percentage").first();
    const gradeSelect = page.getByLabel("Grade").first();
    const scaleSelect = page.getByLabel("Scale").first();

    await percentageInput.fill("0");

    // Test Sek 1 (default)
    await expect(gradeSelect).toContainText("6");

    // Test Sek 2
    await scaleSelect.click();
    await page.getByText("Sek 2").click();
    await expect(gradeSelect).toContainText("0");

    // Test Sprachen
    await scaleSelect.click();
    await page.getByText("Sprachen").click();
    await expect(gradeSelect).toContainText("6");
  });

  test("should convert 100% correctly for all scales", async ({ page }) => {
    const percentageInput = page.getByLabel("Percentage").first();
    const gradeSelect = page.getByLabel("Grade").first();
    const scaleSelect = page.getByLabel("Scale").first();

    await percentageInput.fill("100");

    // Test Sek 1 (default)
    await expect(gradeSelect).toContainText("1+");

    // Test Sek 2
    await scaleSelect.click();
    await page.getByText("Sek 2").click();
    await expect(gradeSelect).toContainText("15");

    // Test Sprachen
    await scaleSelect.click();
    await page.getByText("Sprachen").click();
    await expect(gradeSelect).toContainText("1");
  });
});
