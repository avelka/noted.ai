import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Note } from "@/lib/types";
import { GradeItem } from "../GradeItem";

describe("GradeItem", () => {
  const mockNote: Note = {
    id: 1,
    name: "Test Note",
    value: 50,
    ratio: 1,
    localScale: "Sek 1",
  };

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all fields", () => {
    render(
      <GradeItem
        note={mockNote}
        points={100}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    expect(screen.getByLabelText("Percentage")).toBeInTheDocument();
    expect(screen.getByLabelText("Points")).toBeInTheDocument();
    expect(screen.getByLabelText("Ratio")).toBeInTheDocument();
  });

  it("should call onUpdate when name changes", () => {
    render(
      <GradeItem
        note={mockNote}
        points={100}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const nameInput = screen.getByDisplayValue("Test Note");
    fireEvent.change(nameInput, { target: { value: "Updated Name" } });

    expect(mockOnUpdate).toHaveBeenCalledWith(1, { name: "Updated Name" });
  });

  it("should call onUpdate when percentage changes", () => {
    render(
      <GradeItem
        note={mockNote}
        points={100}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const percentageInput = screen.getByLabelText("Percentage");
    fireEvent.change(percentageInput, { target: { value: "75" } });

    expect(mockOnUpdate).toHaveBeenCalledWith(1, { value: 75 });
  });

  it("should not update percentage if value is invalid", () => {
    render(
      <GradeItem
        note={mockNote}
        points={100}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const percentageInput = screen.getByLabelText("Percentage");
    fireEvent.change(percentageInput, { target: { value: "150" } });

    // The handler should not be called with invalid values
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it("should call onDelete when delete button is clicked", () => {
    render(
      <GradeItem
        note={mockNote}
        points={100}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const deleteButton = screen.getByLabelText("Delete Test Note");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("should update ratio when ratio input changes", () => {
    render(
      <GradeItem
        note={mockNote}
        points={100}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const ratioInput = screen.getByDisplayValue("1");
    fireEvent.change(ratioInput, { target: { value: "2" } });

    expect(mockOnUpdate).toHaveBeenCalledWith(1, { ratio: 2 });
  });
});
