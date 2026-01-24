import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Note } from "@/lib/types";
import { NoteList } from "../NoteList";

describe("NoteList", () => {
  const mockNotes: Note[] = [
    {
      id: 1,
      name: "Test 1",
      value: 50,
      ratio: 1,
      localScale: "Sek 1",
    },
    {
      id: 2,
      name: "Test 2",
      value: 75,
      ratio: 2,
      localScale: "Sek 2",
    },
  ];

  const mockOnAddNote = vi.fn();
  const mockOnUpdateNote = vi.fn();
  const mockOnDeleteNote = vi.fn();
  const mockOnPointsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render points configuration", () => {
    render(
      <NoteList
        notes={[]}
        globalScale="Sek 1"
        points={100}
        onAddNote={mockOnAddNote}
        onUpdateNote={mockOnUpdateNote}
        onDeleteNote={mockOnDeleteNote}
        onPointsChange={mockOnPointsChange}
      />,
    );

    expect(screen.getByLabelText("Max Points:")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("should render all notes", () => {
    render(
      <NoteList
        notes={mockNotes}
        globalScale="Sek 1"
        points={100}
        onAddNote={mockOnAddNote}
        onUpdateNote={mockOnUpdateNote}
        onDeleteNote={mockOnDeleteNote}
        onPointsChange={mockOnPointsChange}
      />,
    );

    expect(screen.getByDisplayValue("Test 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test 2")).toBeInTheDocument();
  });

  it("should call onAddNote when Add Grade button is clicked", () => {
    render(
      <NoteList
        notes={[]}
        globalScale="Sek 1"
        points={100}
        onAddNote={mockOnAddNote}
        onUpdateNote={mockOnUpdateNote}
        onDeleteNote={mockOnDeleteNote}
        onPointsChange={mockOnPointsChange}
      />,
    );

    const addButton = screen.getByLabelText("Add a new grade item");
    fireEvent.click(addButton);

    expect(mockOnAddNote).toHaveBeenCalled();
  });

  it("should call onPointsChange when points input changes", () => {
    render(
      <NoteList
        notes={[]}
        globalScale="Sek 1"
        points={100}
        onAddNote={mockOnAddNote}
        onUpdateNote={mockOnUpdateNote}
        onDeleteNote={mockOnDeleteNote}
        onPointsChange={mockOnPointsChange}
      />,
    );

    const pointsInput = screen.getByDisplayValue("100");
    fireEvent.change(pointsInput, { target: { value: "200" } });

    expect(mockOnPointsChange).toHaveBeenCalledWith(200);
  });

  it("should render GradeTable with correct scale", () => {
    render(
      <NoteList
        notes={[]}
        globalScale="Sek 2"
        points={100}
        onAddNote={mockOnAddNote}
        onUpdateNote={mockOnUpdateNote}
        onDeleteNote={mockOnDeleteNote}
        onPointsChange={mockOnPointsChange}
      />,
    );

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute(
      "aria-label",
      "Grade conversion table for Sek 2 scale",
    );
  });
});
