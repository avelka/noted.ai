"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import {
  calculateWeightedAverage,
  percentageToGrade,
} from "@/lib/calculations";
import { getScale } from "@/lib/scales";
import type { AppState, Note } from "@/lib/types";

// Lazy load heavy components to improve initial load
const NoteList = dynamic(
  () =>
    import("@/components/NoteList").then((mod) => ({ default: mod.NoteList })),
  {
    loading: () => <div className="container mx-auto p-4">Loading...</div>,
  },
);

const Footer = dynamic(() =>
  import("@/components/Footer").then((mod) => ({ default: mod.Footer })),
);

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [globalScale, setGlobalScale] =
    useState<AppState["globalScale"]>("Sek 1");
  const [points, setPoints] = useState<number>(100);
  const [nextId, setNextId] = useState<number>(1);

  const weightedAverage = useMemo(() => {
    return calculateWeightedAverage(notes);
  }, [notes]);

  const totalGrade = useMemo(() => {
    if (notes.length === 0) return "-";
    const scale = getScale(globalScale);
    return percentageToGrade(weightedAverage, scale);
  }, [weightedAverage, globalScale, notes.length]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: nextId,
      name: "Note",
      value: 0,
      ratio: 1,
      localScale: "Sek 1",
    };
    setNotes([...notes, newNote]);
    setNextId(nextId + 1);
  };

  const handleUpdateNote = (id: Note["id"], updates: Partial<Note>) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates } : note)),
    );
  };

  const handleDeleteNote = (id: Note["id"]) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <NoteList
          notes={notes}
          globalScale={globalScale}
          points={points}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onPointsChange={setPoints}
        />
      </main>
      <Footer
        globalScale={globalScale}
        onGlobalScaleChange={setGlobalScale}
        totalGrade={totalGrade}
        totalPercentage={weightedAverage}
      />
    </div>
  );
}
