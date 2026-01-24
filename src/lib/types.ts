export interface GradeScale {
  labels: string[];
  thresholds: number[];
}

export interface ScaleConfig {
  sek2: GradeScale;
  sek1: GradeScale;
  lang: GradeScale; // "Sprachen"
}

export interface Note {
  id: string | number;
  name: string;
  value: number; // percentage (0-100)
  ratio: number; // weight (≥1)
  localScale: "Sek 2" | "Sek 1" | "Sprachen";
}

export interface AppState {
  notes: Note[];
  globalScale: "Sek 2" | "Sek 1" | "Sprachen";
  points: number; // max points (default: 100)
}
