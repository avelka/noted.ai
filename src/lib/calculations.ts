import type { GradeScale, Note } from "./types";

export function calculateWeightedAverage(notes: Note[]): number {
  if (notes.length === 0) return 0;

  const [total, totalRatio] = notes.reduce(
    ([sum, ratioSum], note) => [
      sum + note.value * note.ratio,
      ratioSum + note.ratio,
    ],
    [0, 0],
  );

  return Math.round(total / totalRatio);
}

export function percentageToGrade(
  percentage: number,
  scale: GradeScale,
): string {
  // Find the highest threshold that is <= percentage
  // Iterate backwards to find the last threshold that meets the condition
  for (let i = scale.thresholds.length - 1; i >= 0; i--) {
    if (scale.thresholds[i] <= percentage) {
      return scale.labels[i];
    }
  }
  // If percentage is less than all thresholds, return the first (lowest) grade
  return scale.labels[0];
}

export function percentageToPoints(
  percentage: number,
  maxPoints: number,
): string {
  const points = Math.round((percentage / 100) * maxPoints * 2) / 2;
  const formatted = points.toFixed(1);
  return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
}

export function pointsToPercentage(points: number, maxPoints: number): number {
  return Math.round((points / maxPoints) * 100);
}
