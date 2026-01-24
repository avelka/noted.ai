import { describe, expect, it } from "vitest";
import {
  calculateWeightedAverage,
  percentageToGrade,
  percentageToPoints,
  pointsToPercentage,
} from "./calculations";
import { scales } from "./scales";
import type { Note } from "./types";

describe("calculateWeightedAverage", () => {
  it("should return 0 for empty notes array", () => {
    expect(calculateWeightedAverage([])).toBe(0);
  });

  it("should calculate simple average for equal weights", () => {
    const notes: Note[] = [
      { id: 1, name: "Test 1", value: 50, ratio: 1, localScale: "Sek 1" },
      { id: 2, name: "Test 2", value: 70, ratio: 1, localScale: "Sek 1" },
      { id: 3, name: "Test 3", value: 90, ratio: 1, localScale: "Sek 1" },
    ];
    expect(calculateWeightedAverage(notes)).toBe(70);
  });

  it("should calculate weighted average correctly", () => {
    const notes: Note[] = [
      { id: 1, name: "Test 1", value: 50, ratio: 1, localScale: "Sek 1" },
      { id: 2, name: "Test 2", value: 70, ratio: 2, localScale: "Sek 1" },
      { id: 3, name: "Test 3", value: 90, ratio: 1, localScale: "Sek 1" },
    ];
    // (50*1 + 70*2 + 90*1) / (1+2+1) = (50 + 140 + 90) / 4 = 280 / 4 = 70
    expect(calculateWeightedAverage(notes)).toBe(70);
  });

  it("should round the result", () => {
    const notes: Note[] = [
      { id: 1, name: "Test 1", value: 50, ratio: 1, localScale: "Sek 1" },
      { id: 2, name: "Test 2", value: 67, ratio: 1, localScale: "Sek 1" },
    ];
    // (50 + 67) / 2 = 58.5, should round to 59
    expect(calculateWeightedAverage(notes)).toBe(59);
  });
});

describe("percentageToGrade", () => {
  it("should return lowest grade for 0%", () => {
    expect(percentageToGrade(0, scales.sek2)).toBe("0");
    expect(percentageToGrade(0, scales.sek1)).toBe("6");
    expect(percentageToGrade(0, scales.lang)).toBe("6");
  });

  it("should return highest grade for 100%", () => {
    expect(percentageToGrade(100, scales.sek2)).toBe("15");
    expect(percentageToGrade(100, scales.sek1)).toBe("1+");
    expect(percentageToGrade(100, scales.lang)).toBe("1");
  });

  it("should return correct grade for threshold values", () => {
    expect(percentageToGrade(20, scales.sek2)).toBe("1");
    expect(percentageToGrade(95, scales.sek2)).toBe("15");
    expect(percentageToGrade(50, scales.sek1)).toBe("4");
    expect(percentageToGrade(98, scales.sek1)).toBe("1+");
  });

  it("should return correct grade for values between thresholds", () => {
    expect(percentageToGrade(25, scales.sek2)).toBe("2");
    expect(percentageToGrade(60, scales.sek1)).toBe("3-");
    expect(percentageToGrade(80, scales.lang)).toBe("2");
  });
});

describe("percentageToPoints", () => {
  it("should convert percentage to points correctly", () => {
    expect(percentageToPoints(50, 100)).toBe("50");
    expect(percentageToPoints(75, 100)).toBe("75");
    expect(percentageToPoints(100, 100)).toBe("100");
  });

  it("should round to 0.5 increments", () => {
    expect(percentageToPoints(25, 100)).toBe("25");
    expect(percentageToPoints(25.5, 100)).toBe("25.5");
    expect(percentageToPoints(33.33, 100)).toBe("33.5");
  });

  it("should remove .0 suffix", () => {
    expect(percentageToPoints(50, 100)).toBe("50");
    expect(percentageToPoints(50.5, 100)).toBe("50.5");
  });

  it("should work with different max points", () => {
    expect(percentageToPoints(50, 200)).toBe("100");
    expect(percentageToPoints(75, 200)).toBe("150");
  });
});

describe("pointsToPercentage", () => {
  it("should convert points to percentage correctly", () => {
    expect(pointsToPercentage(50, 100)).toBe(50);
    expect(pointsToPercentage(75, 100)).toBe(75);
    expect(pointsToPercentage(100, 100)).toBe(100);
  });

  it("should round the result", () => {
    expect(pointsToPercentage(33.33, 100)).toBe(33);
    expect(pointsToPercentage(66.66, 100)).toBe(67);
  });

  it("should work with different max points", () => {
    expect(pointsToPercentage(100, 200)).toBe(50);
    expect(pointsToPercentage(150, 200)).toBe(75);
  });
});
