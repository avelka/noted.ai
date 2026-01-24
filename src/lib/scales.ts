import type { GradeScale, ScaleConfig } from "./types";

export const scales: ScaleConfig = {
  sek2: {
    labels: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
    ],
    thresholds: [0, 20, 27, 33, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
  },
  sek1: {
    labels: [
      "6",
      "5-",
      "5",
      "5+",
      "4-",
      "4",
      "4+",
      "3-",
      "3",
      "3+",
      "2-",
      "2",
      "2+",
      "1-",
      "1",
      "1+",
    ],
    thresholds: [0, 20, 29, 37, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 94, 98],
  },
  lang: {
    labels: [
      "6",
      "6+",
      "5-",
      "5",
      "5+",
      "4-",
      "4",
      "4+",
      "3-",
      "3",
      "3+",
      "2-",
      "2",
      "2+",
      "1-",
      "1",
    ],
    thresholds: [0, 23, 25, 27, 47, 49, 51, 62, 64, 66, 76, 78, 80, 90, 92, 94],
  },
};

export function getScale(
  scaleName: "Sek 2" | "Sek 1" | "Sprachen",
): GradeScale {
  switch (scaleName) {
    case "Sek 2":
      return scales.sek2;
    case "Sek 1":
      return scales.sek1;
    case "Sprachen":
      return scales.lang;
    default:
      return scales.sek1;
  }
}
