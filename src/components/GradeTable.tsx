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
            <TableHead
              scope="row"
              className="sticky left-0 z-10 bg-background border-r"
            >
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
            <TableHead
              scope="row"
              className="sticky left-0 z-10 bg-background font-medium border-r"
            >
              Percentage (≥)
            </TableHead>
            {scale.thresholds.map((threshold) => (
              <TableCell key={threshold} className="text-center">
                {threshold}%
              </TableCell>
            ))}
          </TableRow>
          {points !== 100 && (
            <TableRow>
              <TableHead
                scope="row"
                className="sticky left-0 z-10 bg-background font-medium border-r"
              >
                Points
              </TableHead>
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
