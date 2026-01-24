import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "../Footer";

describe("Footer", () => {
  const mockOnGlobalScaleChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render global scale selector", () => {
    render(
      <Footer
        globalScale="Sek 1"
        onGlobalScaleChange={mockOnGlobalScaleChange}
        totalGrade="4"
        totalPercentage={50}
      />,
    );

    expect(screen.getByLabelText("Global Scale:")).toBeInTheDocument();
  });

  it("should display total grade and percentage", () => {
    render(
      <Footer
        globalScale="Sek 1"
        onGlobalScaleChange={mockOnGlobalScaleChange}
        totalGrade="4"
        totalPercentage={50}
      />,
    );

    expect(screen.getByText("4 | 50%")).toBeInTheDocument();
  });

  it("should call onGlobalScaleChange when scale changes", () => {
    render(
      <Footer
        globalScale="Sek 1"
        onGlobalScaleChange={mockOnGlobalScaleChange}
        totalGrade="4"
        totalPercentage={50}
      />,
    );

    const selectTrigger = screen.getByLabelText("Global Scale:");
    fireEvent.click(selectTrigger);

    const sek2Option = screen.getByText("Sek 2");
    fireEvent.click(sek2Option);

    expect(mockOnGlobalScaleChange).toHaveBeenCalledWith("Sek 2");
  });

  it("should display dash when no grades", () => {
    render(
      <Footer
        globalScale="Sek 1"
        onGlobalScaleChange={mockOnGlobalScaleChange}
        totalGrade="-"
        totalPercentage={0}
      />,
    );

    expect(screen.getByText("- | 0%")).toBeInTheDocument();
  });
});
