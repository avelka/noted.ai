"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppState, Note } from "@/lib/types";
import { GradeItem } from "./GradeItem";
import { GradeTable } from "./GradeTable";

interface NoteListProps {
  notes: Note[];
  globalScale: AppState["globalScale"];
  points: number;
  onAddNote: () => void;
  onUpdateNote: (id: Note["id"], updates: Partial<Note>) => void;
  onDeleteNote: (id: Note["id"]) => void;
  onPointsChange: (points: number) => void;
}

export function NoteList({
  notes,
  globalScale,
  points,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onPointsChange,
}: NoteListProps) {
  return (
    <div className="container mx-auto space-y-6 p-4 pb-24 sm:pb-32 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="points-config" className="text-sm font-medium">
          Max Points:
        </Label>
        <Input
          id="points-config"
          type="number"
          min="1"
          value={points}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!Number.isNaN(value) && value >= 1) {
              onPointsChange(value);
            }
          }}
          aria-label="Max Points:"
          className="w-24"
        />
      </div>

      <GradeTable globalScale={globalScale} points={points} />

      <div className="space-y-4">
        {notes.map((note) => (
          <GradeItem
            key={note.id}
            note={note}
            points={points}
            onUpdate={onUpdateNote}
            onDelete={onDeleteNote}
          />
        ))}
      </div>

      <Button
        onClick={onAddNote}
        className="w-full md:w-auto"
        aria-label="Add a new grade item"
      >
        Add Grade
      </Button>
    </div>
  );
}
