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
  const index = scale.thresholds.findIndex(
    (threshold) => threshold >= percentage,
  );
  return scale.labels[index >= 0 ? index : scale.labels.length - 1];
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
