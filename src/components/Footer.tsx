"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppState } from "@/lib/types";

interface FooterProps {
  globalScale: AppState["globalScale"];
  onGlobalScaleChange: (scale: AppState["globalScale"]) => void;
  totalGrade: string;
  totalPercentage: number;
}

export function Footer({
  globalScale,
  onGlobalScaleChange,
  totalGrade,
  totalPercentage,
}: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sm:p-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 max-w-7xl">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <label
            htmlFor="global-scale"
            className="text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            Global Scale:
          </label>
          <Select
            value={globalScale}
            onValueChange={(value) =>
              onGlobalScaleChange(value as AppState["globalScale"])
            }
          >
            <SelectTrigger
              id="global-scale"
              className="w-28 sm:w-32 min-h-[36px] sm:min-h-0"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sek 2">Sek 2</SelectItem>
              <SelectItem value="Sek 1">Sek 1</SelectItem>
              <SelectItem value="Sprachen">Sprachen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-center w-full sm:w-auto">
          <output
            className="text-base sm:text-lg font-semibold block"
            aria-live="polite"
            aria-atomic="true"
          >
            {totalGrade} | {totalPercentage}%
          </output>
        </div>
        <div className="hidden sm:block w-32" />
      </div>
    </footer>
  );
}
