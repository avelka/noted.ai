import { describe, expect, it } from "vitest";
import { getScale, scales } from "./scales";

describe("scales", () => {
  describe("SEK2 scale", () => {
    it("should have 16 labels", () => {
      expect(scales.sek2.labels).toHaveLength(16);
    });

    it("should have 16 thresholds", () => {
      expect(scales.sek2.thresholds).toHaveLength(16);
    });

    it("should have correct first and last labels", () => {
      expect(scales.sek2.labels[0]).toBe("0");
      expect(scales.sek2.labels[15]).toBe("15");
    });

    it("should have correct first and last thresholds", () => {
      expect(scales.sek2.thresholds[0]).toBe(0);
      expect(scales.sek2.thresholds[15]).toBe(95);
    });
  });

  describe("SEK1 scale", () => {
    it("should have 16 labels", () => {
      expect(scales.sek1.labels).toHaveLength(16);
    });

    it("should have 16 thresholds", () => {
      expect(scales.sek1.thresholds).toHaveLength(16);
    });

    it("should have correct first and last labels", () => {
      expect(scales.sek1.labels[0]).toBe("6");
      expect(scales.sek1.labels[15]).toBe("1+");
    });

    it("should have correct first and last thresholds", () => {
      expect(scales.sek1.thresholds[0]).toBe(0);
      expect(scales.sek1.thresholds[15]).toBe(98);
    });
  });

  describe("LANG scale", () => {
    it("should have 16 labels", () => {
      expect(scales.lang.labels).toHaveLength(16);
    });

    it("should have 16 thresholds", () => {
      expect(scales.lang.thresholds).toHaveLength(16);
    });

    it("should have correct first and last labels", () => {
      expect(scales.lang.labels[0]).toBe("6");
      expect(scales.lang.labels[15]).toBe("1");
    });

    it("should have correct first and last thresholds", () => {
      expect(scales.lang.thresholds[0]).toBe(0);
      expect(scales.lang.thresholds[15]).toBe(94);
    });
  });

  describe("getScale", () => {
    it("should return SEK2 scale for 'Sek 2'", () => {
      const scale = getScale("Sek 2");
      expect(scale).toEqual(scales.sek2);
    });

    it("should return SEK1 scale for 'Sek 1'", () => {
      const scale = getScale("Sek 1");
      expect(scale).toEqual(scales.sek1);
    });

    it("should return LANG scale for 'Sprachen'", () => {
      const scale = getScale("Sprachen");
      expect(scale).toEqual(scales.lang);
    });
  });
});
