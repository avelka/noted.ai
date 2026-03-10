# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build (static export)
pnpm lint         # Biome check
pnpm format       # Biome format (auto-fix)
pnpm type-check   # TypeScript check
pnpm test         # Vitest unit tests (run once)
pnpm test:watch   # Vitest in watch mode
pnpm test:e2e     # Playwright E2E tests (requires dev server)
pnpm test:e2e:ui  # Playwright with UI
pnpm knip         # Dead code detection
```

Run a single unit test file:
```bash
pnpm vitest run src/lib/calculations.test.ts
```

## Architecture

This is a **German Hessen school grade calculator** — a single-page Next.js app exported as a static PWA.

**State management:** All app state lives in `src/app/page.tsx` (Home) as `useState` and is props-drilled down. No external state library.

**Data flow:**
1. `page.tsx` holds `notes[]`, `globalScale`, `points`, `nextId`
2. `NoteList` renders a list of `GradeItem` components + a `GradeTable`
3. `Footer` shows weighted average and global scale selector
4. Core math is in `src/lib/calculations.ts` (`calculateWeightedAverage`, `percentageToGrade`, `percentageToPoints`, etc.)
5. Grade scales (Sek 1, Sek 2, Sprachen) are defined in `src/lib/scales.ts`

**Key files:**
- `src/app/page.tsx` — root state + event handlers
- `src/lib/calculations.ts` — all grade calculation logic
- `src/lib/scales.ts` — grade scale definitions and thresholds
- `src/lib/types.ts` — shared TypeScript types (`Note`, `AppState`, `Scale`)
- `src/components/GradeItem.tsx` — individual grade row (name, %, weight, local scale override)
- `src/components/Footer.tsx` — global totals and scale picker

## Tech Stack

- **Next.js** (App Router, static export, React compiler enabled)
- **Tailwind CSS** + **Radix UI** primitives (via `src/components/ui/`)
- **Biome** for linting and formatting (not ESLint/Prettier)
- **Vitest** + **Testing Library** for unit tests; **Playwright** (Chromium only) for E2E
- **pnpm** as package manager

## Commit Convention

Follows Conventional Commits: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Pre-commit hook runs: `type-check` → `lint-staged` (biome) → `vitest` → `knip`.
