"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  percentageToGrade,
  percentageToPoints,
  pointsToPercentage,
} from "@/lib/calculations";
import { getScale } from "@/lib/scales";
import type { Note } from "@/lib/types";

interface GradeItemProps {
  note: Note;
  points: number;
  onUpdate: (id: Note["id"], updates: Partial<Note>) => void;
  onDelete: (id: Note["id"]) => void;
}

export function GradeItem({
  note,
  points,
  onUpdate,
  onDelete,
}: GradeItemProps) {
  const scale = getScale(note.localScale);
  const currentGrade = percentageToGrade(note.value, scale);
  const pointValue = percentageToPoints(note.value, points);

  const handleNameChange = (name: string) => {
    onUpdate(note.id, { name });
  };

  const handleScaleChange = (localScale: Note["localScale"]) => {
    onUpdate(note.id, { localScale });
  };

  const handleGradeChange = (gradeLabel: string) => {
    const gradeIndex = scale.labels.indexOf(gradeLabel);
    if (gradeIndex >= 0) {
      const newPercentage = scale.thresholds[gradeIndex];
      onUpdate(note.id, { value: newPercentage });
    }
  };

  const handlePercentageChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onUpdate(note.id, { value: numValue });
    }
  };

  const handlePointsChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= points) {
      const newPercentage = pointsToPercentage(numValue, points);
      onUpdate(note.id, { value: newPercentage });
    }
  };

  const handleRatioChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!Number.isNaN(numValue) && numValue >= 1) {
      onUpdate(note.id, { ratio: numValue });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 rounded-lg border bg-card p-3 sm:p-4 md:grid-cols-6">
      <div className="md:col-span-1">
        <Label htmlFor={`name-${note.id}`} className="sr-only">
          Name
        </Label>
        <Input
          id={`name-${note.id}`}
          type="text"
          value={note.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Note name"
          className="min-h-[44px] sm:min-h-0"
        />
      </div>
      <div className="md:col-span-1">
        <Label htmlFor={`scale-${note.id}`} className="sr-only">
          Scale
        </Label>
        <Select
          value={note.localScale}
          onValueChange={(value) =>
            handleScaleChange(value as Note["localScale"])
          }
        >
          <SelectTrigger
            id={`scale-${note.id}`}
            className="min-h-[44px] sm:min-h-0"
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
      <div className="md:col-span-1">
        <Label htmlFor={`grade-${note.id}`} className="sr-only">
          Grade
        </Label>
        <Select value={currentGrade} onValueChange={handleGradeChange}>
          <SelectTrigger
            id={`grade-${note.id}`}
            className="min-h-[44px] sm:min-h-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {scale.labels.map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-1">
        <Label htmlFor={`percentage-${note.id}`} className="sr-only">
          Percentage
        </Label>
        <Input
          id={`percentage-${note.id}`}
          type="number"
          min="0"
          max="100"
          step="1"
          value={note.value}
          onChange={(e) => handlePercentageChange(e.target.value)}
          className="min-h-[44px] sm:min-h-0"
        />
      </div>
      <div className="md:col-span-1">
        <Label htmlFor={`points-${note.id}`} className="sr-only">
          Points
        </Label>
        <Input
          id={`points-${note.id}`}
          type="number"
          min="0"
          max={points}
          step="0.5"
          value={pointValue}
          onChange={(e) => handlePointsChange(e.target.value)}
          readOnly
          className="appearance-none min-h-[44px] sm:min-h-0"
        />
      </div>
      <div className="flex gap-2 md:col-span-1">
        <div className="flex-1">
          <Label htmlFor={`ratio-${note.id}`} className="sr-only">
            Ratio
          </Label>
          <Input
            id={`ratio-${note.id}`}
            type="number"
            min="1"
            step="1"
            value={note.ratio}
            onChange={(e) => handleRatioChange(e.target.value)}
            className="min-h-[44px] sm:min-h-0"
          />
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(note.id)}
          aria-label={`Delete ${note.name}`}
          className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
