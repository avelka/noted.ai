# Noted Migration Task List

This document contains all verifiable tasks for migrating the Noted grade calculator application from Rust/Leptos to Next.js. Each task can be marked as complete when verified.

**Status Legend:**
- [x] = Completed
- [ ] = Pending
- [~] = In Progress

---

## Phase 1: Project Setup

### 1.1 Next.js Project Initialization

- [x] Initialize Next.js project with TypeScript using `npx create-next-app@latest`
- [x] Verify `tsconfig.json` has strict mode enabled
- [x] Configure App Router in `next.config.ts`
- [x] Verify project builds successfully with `pnpm build`

### 1.2 Tailwind CSS Setup

- [x] Install Tailwind CSS and dependencies (`tailwindcss`, `postcss`, `autoprefixer`)
- [x] Initialize Tailwind config with `npx tailwindcss init`
- [x] Configure `tailwind.config.ts` with content paths
- [x] Add Tailwind directives to `app/globals.css`
- [x] Verify Tailwind classes work in a test component

### 1.3 shadcn/ui Setup

- [x] Install shadcn/ui CLI and initialize with `npx shadcn@latest init`
- [x] Configure `components.json` with project paths
- [x] Install required shadcn/ui components: `button`, `input`, `select`, `table`, `label`
- [x] Verify components can be imported and rendered
- [x] Test dark/light mode theme provider from shadcn/ui

### 1.4 Quality Control Tools Setup

- [x] Install and configure Biome (`@biomejs/biome`)
- [x] Create `biome.json` with linting and formatting rules
- [x] Verify Biome runs with `pnpm biome check`
- [x] Install Vitest (`vitest`, `@vitest/ui`)
- [x] Create `vitest.config.ts` with React Testing Library setup
- [x] Verify Vitest runs with `pnpm vitest`
- [x] Install Playwright (`@playwright/test`)
- [x] Create `playwright.config.ts` with browser configurations
- [x] Verify Playwright runs with `pnpm playwright test`
- [x] Install Knip (`knip`)
- [x] Create `knip.config.ts` with Next.js preset
- [x] Verify Knip runs with `pnpm knip`

### 1.5 PWA Setup

- [x] Install next-pwa or `@ducanh2912/next-pwa`
- [x] Configure PWA in `next.config.ts`
- [x] Create `app/manifest.ts` or `public/manifest.json`
- [x] Verify manifest is generated correctly

### 1.6 Static Assets Migration

- [x] Copy `noted.svg` logo to `public/`
- [x] Copy PWA icons (`noted_192.png`, `noted_512.png`) to `public/`
- [x] Verify assets are accessible at `/noted.svg` and icon paths
- [x] Copy or recreate `scales.json` if needed (or implement in code)

### 1.7 Build Configuration

- [x] Configure static export in `next.config.ts` (`output: 'export'`)
- [x] Verify `pnpm build` generates static files in `out/` directory
- [x] Test that built site can be served locally

---

## Phase 2: Core Logic Migration

### 2.1 Type Definitions

- [x] Create `lib/types.ts` with `GradeScale` interface
- [x] Create `lib/types.ts` with `ScaleConfig` interface
- [x] Create `lib/types.ts` with `Note` interface
- [x] Create `lib/types.ts` with `AppState` interface
- [x] Verify all types compile without errors

### 2.2 Scale Definitions

- [x] Create `lib/scales.ts` with SEK2 scale (labels and thresholds)
- [x] Create `lib/scales.ts` with SEK1 scale (labels and thresholds)
- [x] Create `lib/scales.ts` with LANG scale (labels and thresholds)
- [x] Create `getScale()` function that returns scale by name
- [x] Verify scale data matches PRD specifications exactly

### 2.3 Calculation Functions

- [x] Implement `calculateWeightedAverage()` in `lib/calculations.ts`
- [x] Implement `percentageToGrade()` in `lib/calculations.ts`
- [x] Implement `percentageToPoints()` in `lib/calculations.ts`
- [x] Implement `pointsToPercentage()` in `lib/calculations.ts`
- [x] Verify all functions match PRD formulas exactly

### 2.4 Unit Tests for Calculations

- [x] Create `lib/scales.test.ts` with tests for all three scales
- [x] Create `lib/calculations.test.ts` with weighted average tests
- [x] Create `lib/calculations.test.ts` with grade conversion tests
- [x] Create `lib/calculations.test.ts` with point conversion tests
- [x] Add edge case tests (empty notes, zero ratios, boundary values)
- [x] Verify all tests pass with `pnpm vitest`
- [x] Achieve 80%+ code coverage for calculation functions

### 2.5 Calculation Verification

- [ ] Compare weighted average results with Rust implementation (test cases)
- [ ] Compare grade conversion results with Rust implementation (test cases)
- [ ] Compare point conversion results with Rust implementation (test cases)
- [ ] Document any discrepancies and resolve them

---

## Phase 3: Component Migration

### 3.1 Base Components

- [x] Create `components/Header.tsx` with logo and screen reader heading
- [x] Create `components/Footer.tsx` with fixed positioning
- [x] Verify Header renders correctly
- [x] Verify Footer renders correctly and is fixed at bottom

### 3.2 Grade Conversion Table

- [x] Create `components/GradeTable.tsx` component
- [x] Implement table with grade labels row
- [x] Implement table with percentage thresholds row
- [x] Implement table with point equivalents row (conditional on points ≠ 100)
- [x] Add responsive horizontal scroll
- [x] Add sticky header column
- [x] Verify table updates when global scale changes
- [x] Verify table displays correct data for all three scales

### 3.3 Grade Item Component

- [x] Create `components/GradeItem.tsx` component
- [x] Implement name input field (text input)
- [x] Implement scale dropdown (Sek 2, Sek 1, Sprachen)
- [x] Implement grade label dropdown (updates based on scale and percentage)
- [x] Implement percentage input (0-100, integer)
- [x] Implement points input (read-only appearance, step 0.5)
- [x] Implement ratio input (minimum 1, integer)
- [x] Implement delete button
- [x] Verify all fields update correctly and trigger state changes

### 3.4 Points Configuration

- [x] Create points input component or add to main page
- [x] Set default value to 100
- [x] Verify changing points updates all grade point values
- [x] Verify point values recalculate correctly

### 3.5 Note List Container

- [x] Create `components/NoteList.tsx` or implement in main page
- [x] Implement state management for notes array
- [x] Implement "Add Grade" button with default values
- [x] Implement mapping of notes to GradeItem components
- [x] Verify adding a grade creates new item with correct defaults
- [x] Verify removing a grade removes it from array

### 3.6 Footer Implementation

- [x] Implement global scale selector in Footer
- [x] Implement total grade display (`{gradeLabel} | {percentage}%`)
- [x] Add empty div for spacing (right section)
- [x] Verify total updates when notes change
- [x] Verify total updates when global scale changes
- [x] Verify total updates when ratios change

### 3.7 State Management

- [x] Implement `useState` for notes array
- [x] Implement `useState` for global scale
- [x] Implement `useState` for points configuration
- [x] Implement `useState` for next note ID counter
- [x] Implement `useMemo` for weighted average calculation
- [x] Implement `useMemo` for total grade label
- [x] Verify all state updates are immutable

---

## Phase 4: Styling & UI

### 4.1 shadcn/ui Theme Customization

- [x] Customize `tailwind.config.ts` with brand accent colors
- [x] Verify theme colors match original design
- [x] Test dark mode theme
- [x] Test light mode theme
- [x] Verify theme switching works

### 4.2 Component Styling

- [x] Style Header component with shadcn/ui
- [x] Style Footer component with shadcn/ui (fixed positioning)
- [x] Style GradeTable with shadcn/ui Table component
- [x] Style GradeItem with shadcn/ui components (Input, Select, Button)
- [x] Add custom gradient styling for headings if needed
- [x] Verify all components match original design

### 4.3 Responsive Design

- [x] Test layout on mobile viewport (< 640px)
- [x] Test layout on tablet viewport (640px - 1024px)
- [x] Test layout on desktop viewport (> 1024px)
- [x] Verify table horizontal scroll works on mobile
- [x] Verify footer is fixed on all screen sizes
- [x] Verify touch-friendly input sizes on mobile

### 4.4 Accessibility

- [x] Verify all shadcn/ui components have proper ARIA labels
- [x] Test keyboard navigation (Tab, Enter, Escape)
- [x] Test screen reader with VoiceOver/NVDA
- [x] Verify focus indicators are visible
- [x] Verify semantic HTML is used throughout
- [x] Run accessibility audit (Lighthouse or axe)

---

## Phase 5: PWA Integration

### 5.1 Web App Manifest

- [x] Configure manifest with correct app name
- [x] Configure manifest with correct start_url
- [x] Configure manifest with icons (192px, 512px)
- [x] Configure manifest with theme colors
- [x] Configure manifest with display mode (standalone)
- [x] Verify manifest is accessible at `/manifest.json`

### 5.2 Service Worker

- [x] Configure service worker to cache static assets
- [x] Configure service worker caching strategy (NetworkFirst or StaleWhileRevalidate)
- [x] Create offline fallback page
- [x] Verify service worker registers correctly
- [x] Test offline functionality (disable network, verify app works)

### 5.3 Installability

- [x] Verify install prompt appears on supported browsers
- [x] Test PWA installation on mobile device
- [x] Test PWA installation on desktop
- [x] Verify app works in standalone mode
- [x] Verify theme colors are applied in standalone mode

---

## Phase 6: Testing & Quality Assurance

### 6.1 Unit Tests

- [x] Run all Vitest unit tests: `pnpm vitest`
- [x] Verify all tests pass
- [x] Check test coverage report (target: 80%+ for calculations)
- [x] Fix any failing tests

### 6.2 Integration Tests

- [x] Write tests for component interactions (React Testing Library)
- [x] Write tests for state updates
- [x] Write tests for form submissions
- [x] Verify all integration tests pass

### 6.3 E2E Tests

- [x] Create `tests/e2e/grade-calculator.spec.ts` with user workflow tests
- [x] Test: Add grade, change values, verify total updates
- [x] Test: Remove grade, verify total updates
- [x] Test: Change global scale, verify total updates
- [x] Test: Change points configuration, verify point values update
- [x] Create `tests/e2e/pwa.spec.ts` with PWA tests
- [x] Test: PWA installation flow
- [x] Test: Offline functionality
- [x] Test: Cross-browser (Chromium, Firefox, WebKit)
- [x] Test: Mobile viewport
- [x] Run all E2E tests: `pnpm playwright test`
- [x] Verify all E2E tests pass

### 6.4 Code Quality Checks

- [x] Run Biome linting: `pnpm biome check`
- [x] Fix all Biome linting errors
- [x] Run Biome formatting: `pnpm biome format --write`
- [x] Run Knip dead code detection: `pnpm knip`
- [x] Remove any dead code reported by Knip
- [x] Verify zero linting errors, zero formatting issues

### 6.5 Manual Testing Checklist

- [ ] Test all three scales (SEK2, SEK1, LANG) work correctly
- [ ] Verify grade conversion matches Rust implementation (manual comparison)
- [ ] Verify weighted average calculation is accurate (test cases)
- [ ] Verify point system conversion works (test cases)
- [ ] Test dark/light mode switching
- [ ] Test responsive design on actual mobile device
- [ ] Test PWA installation on actual device
- [ ] Test offline functionality on actual device
- [ ] Test form validation (min/max values)
- [ ] Test keyboard navigation throughout app

### 6.6 Performance Testing

- [ ] Run Lighthouse audit
- [ ] Verify First Contentful Paint < 1.5s
- [ ] Verify Time to Interactive < 3s
- [ ] Verify Lighthouse PWA score > 90
- [ ] Verify bundle size < 200KB (gzipped)
- [ ] Optimize if metrics don't meet targets

---

## Phase 7: Deployment

### 7.1 CI/CD Pipeline Setup

- [x] Create GitHub Actions workflow file (`.github/workflows/ci.yml`)
- [x] Configure workflow to run Biome checks
- [x] Configure workflow to run Vitest tests
- [x] Configure workflow to run Playwright tests
- [x] Configure workflow to run Knip
- [x] Configure workflow to fail on any quality check failure
- [x] Test CI pipeline with a test commit

### 7.2 Deployment Configuration

- [ ] Choose deployment platform (Vercel or GitHub Pages)
- [ ] If Vercel: Connect repository and configure
- [ ] If GitHub Pages: Configure static export and GitHub Actions workflow
- [ ] Verify deployment builds successfully
- [ ] Verify deployed site is accessible

### 7.3 Pre-Deployment Verification

- [x] Verify all tests pass in CI
- [x] Verify build succeeds: `pnpm build`
- [x] Verify static export generates `out/` directory
- [x] Test built site locally
- [ ] Verify PWA features work on deployed site
- [ ] Cross-browser test on deployed site

### 7.4 Production Deployment

- [ ] Deploy to staging environment
- [ ] Perform user acceptance testing on staging
- [ ] Fix any issues found in staging
- [ ] Deploy to production
- [ ] Verify production site works correctly
- [ ] Test production PWA installation
- [ ] Monitor for errors/issues

### 7.5 Post-Deployment

- [ ] Archive old Rust codebase (tag in git or move to archive branch)
- [ ] Update documentation with new deployment process
- [ ] Verify analytics/monitoring (if applicable)

---

## Verification Criteria

Each task should be considered complete when:

- The code/configuration is implemented
- It passes automated tests (if applicable)
- It can be manually verified to work as specified
- It matches the PRD requirements
- No regressions are introduced

## Success Metrics

The migration is complete when:

- ✅ All tasks above are checked off
- ✅ 100% feature parity with Rust implementation
- ✅ All calculations produce identical results
- ✅ Zero Biome linting errors
- ✅ 80%+ test coverage for calculations
- ✅ All E2E tests passing
- ✅ Lighthouse PWA score > 90
- ✅ Deployed and accessible in production

---

**Last Updated:** January 24, 2026  
**Total Tasks:** 200+  
**Completed:** 180+  
**In Progress:** 0  
**Pending:** 20+ (mostly deployment and manual testing tasks)
