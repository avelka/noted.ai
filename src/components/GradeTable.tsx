"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { percentageToPoints } from "@/lib/calculations";
import { getScale } from "@/lib/scales";
import type { AppState } from "@/lib/types";

interface GradeTableProps {
  globalScale: AppState["globalScale"];
  points: number;
}

export function GradeTable({ globalScale, points }: GradeTableProps) {
  const scale = getScale(globalScale);

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <Table aria-label={`Grade conversion table for ${globalScale} scale`}>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-background border-r">
              Grade
            </TableHead>
            {scale.labels.map((label) => (
              <TableHead key={label} className="text-center min-w-[60px]">
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="sticky left-0 z-10 bg-background font-medium border-r">
              Percentage (≥)
            </TableCell>
            {scale.thresholds.map((threshold) => (
              <TableCell key={threshold} className="text-center">
                {threshold}%
              </TableCell>
            ))}
          </TableRow>
          {points !== 100 && (
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium border-r">
                Points
              </TableCell>
              {scale.thresholds.map((threshold) => (
                <TableCell key={threshold} className="text-center">
                  {percentageToPoints(threshold, points)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
