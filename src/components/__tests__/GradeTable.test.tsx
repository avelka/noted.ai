import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GradeTable } from "../GradeTable";

describe("GradeTable", () => {
  it("should render table with correct scale labels", () => {
    render(<GradeTable globalScale="Sek 1" points={100} />);

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("1+")).toBeInTheDocument();
  });

  it("should render percentage thresholds", () => {
    render(<GradeTable globalScale="Sek 1" points={100} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("should not render points row when points is 100", () => {
    render(<GradeTable globalScale="Sek 1" points={100} />);

    expect(screen.queryByText("Points")).not.toBeInTheDocument();
  });

  it("should render points row when points is not 100", () => {
    render(<GradeTable globalScale="Sek 1" points={200} />);

    expect(screen.getByText("Points")).toBeInTheDocument();
  });

  it("should render correct scale for Sek 2", () => {
    render(<GradeTable globalScale="Sek 2" points={100} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should render correct scale for Sprachen", () => {
    render(<GradeTable globalScale="Sprachen" points={100} />);

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should have correct aria-label", () => {
    render(<GradeTable globalScale="Sek 1" points={100} />);

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute(
      "aria-label",
      "Grade conversion table for Sek 1 scale",
    );
  });
});
