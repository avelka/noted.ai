# Product Requirements Document: Noted - Next.js Migration

## Executive Summary

**Project Name:** Noted - Grade Calculator Migration to Next.js  
**Version:** 1.0  
**Date:** January 24, 2026  
**Status:** Planning Phase

Noted is a Progressive Web Application (PWA) designed to help calculate weighted grade averages for the German Hessen school system. Currently built with Rust (Leptos framework) and compiled to WebAssembly, this document outlines the requirements for migrating the application to Next.js while maintaining all existing functionality and improving developer experience.

## Current State Analysis

### Technology Stack
- **Frontend Framework:** Leptos (Rust) with Client-Side Rendering (CSR)
- **Build Tool:** Trunk (Rust WASM builder)
- **PWA:** Workbox for service worker generation
- **Deployment:** GitHub Pages via GitHub Actions
- **Styling:** Vanilla CSS with CSS custom properties (dark/light mode support)

### Application Architecture
- Single-page application with reactive state management
- No backend/server-side logic required
- All calculations performed client-side
- Static assets (images, manifest, scales data)

### Core Functionality
1. **Grade Management**
   - Add/remove individual grades (notes)
   - Each grade has: name, scale type, percentage value, point value, and weight (ratio)
   - Support for multiple grading scales per grade item

2. **Grading Scales**
   - **SEK2:** Numeric scale (0-15) with 16 thresholds
   - **SEK1:** German grade scale (6 to 1+) with 16 thresholds
   - **LANG (Sprachen):** Language-specific scale (6 to 1) with 16 thresholds
   - Each scale has predefined percentage thresholds and grade labels

3. **Calculations**
   - Weighted average: `(Σ(value × ratio)) / Σ(ratio)`
   - Grade conversion based on percentage thresholds
   - Point system conversion (customizable max points, default 100)
   - Formula: `points = ((percentage / 100) × maxPoints × 2) / 2` (rounded to 0.5)

4. **User Interface**
   - Grade conversion table display
   - Form inputs for each grade item
   - Global scale selector for final grade display
   - Points system configuration
   - Fixed footer with total grade and percentage
   - Responsive design with dark/light mode support

5. **PWA Features**
   - Web App Manifest
   - Service Worker (Workbox)
   - Installable on mobile devices
   - Offline capability

## Objectives

### Primary Goals
1. Migrate from Rust/Leptos to Next.js/React/TypeScript
2. Maintain 100% feature parity with current implementation
3. Improve developer experience and maintainability
4. Preserve PWA functionality
5. Maintain existing UI/UX and styling

### Success Criteria
- All calculations produce identical results to current implementation
- UI/UX matches current design exactly
- PWA features work identically
- Application loads and performs at least as fast as current version
- Code is maintainable and follows Next.js best practices

## Technical Requirements

### Technology Stack (Target)

#### Core Framework
- **Next.js 14+** (App Router recommended)
- **React 18+**
- **TypeScript 5+**

#### State Management
- **React Hooks** (useState, useReducer) for local state
- Consider **Zustand** or **Jotai** for complex state if needed
- No external state management library required initially

#### Styling
- **shadcn/ui** design system
- **Tailwind CSS** (required for shadcn/ui)
- Built-in dark/light mode support via shadcn/ui theme system
- Modern, accessible component library
- **Benefits:** Faster development, consistent design, built-in accessibility, easy customization

#### PWA Support
- **next-pwa** or **@ducanh2912/next-pwa** for service worker
- Web App Manifest configuration
- Offline page support

#### Build & Deployment
- **Vercel** (recommended) or **GitHub Pages** with static export
- Static Site Generation (SSG) for optimal performance
- No server-side rendering required (fully static)

#### Quality Control & Development Tools
- **Biome** - Linting and formatting (replaces ESLint + Prettier)
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end (E2E) testing
- **Knip** - Dead code detection and monitoring

### Data Structures

#### Grade Scale Configuration
```typescript
interface GradeScale {
  labels: string[];
  thresholds: number[];
}

interface ScaleConfig {
  sek2: GradeScale;
  sek1: GradeScale;
  lang: GradeScale; // "Sprachen"
}
```

#### Note/Grade Item
```typescript
interface Note {
  id: string | number;
  name: string;
  value: number; // percentage (0-100)
  ratio: number; // weight (≥1)
  localScale: 'Sek 2' | 'Sek 1' | 'Sprachen';
}
```

#### Application State
```typescript
interface AppState {
  notes: Note[];
  globalScale: 'Sek 2' | 'Sek 1' | 'Sprachen';
  points: number; // max points (default: 100)
}
```

## Feature Specifications

### 1. Grade Scale System

#### 1.1 Scale Definitions
- **SEK2 Scale:**
  - Labels: `["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]`
  - Thresholds: `[0, 20, 27, 33, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]`

- **SEK1 Scale:**
  - Labels: `["6", "5-", "5", "5+", "4-", "4", "4+", "3-", "3", "3+", "2-", "2", "2+", "1-", "1", "1+"]`
  - Thresholds: `[0, 20, 29, 37, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 94, 98]`

- **LANG (Sprachen) Scale:**
  - Labels: `["6", "6+", "5-", "5", "5+", "4-", "4", "4+", "3-", "3", "3+", "2-", "2", "2+", "1-", "1"]`
  - Thresholds: `[0, 23, 25, 27, 47, 49, 51, 62, 64, 66, 76, 78, 80, 90, 92, 94]`

#### 1.2 Scale Conversion Logic
- Convert percentage to grade label using threshold lookup
- Find first threshold where `threshold >= percentage`
- Return corresponding label
- If no threshold matches, return highest grade (index 0)

### 2. Grade Item Management

#### 2.1 Add Grade
- Button to add new grade item
- Default values:
  - `name`: "Note"
  - `value`: 0
  - `ratio`: 1
  - `localScale`: "Sek 1"
- Generate unique ID for each note

#### 2.2 Remove Grade
- Delete button (X) on each grade item
- Remove from notes array

#### 2.3 Grade Item Fields

**Name Field:**
- Text input
- Editable
- No validation required

**Scale Field:**
- Dropdown select
- Options: "Sek 2", "Sek 1", "Sprachen"
- Per-item scale selection (independent of global scale)

**Note Field (Grade Label):**
- Dropdown select
- Options depend on selected scale
- Selecting a grade sets percentage to minimum threshold for that grade
- Displayed value updates based on current percentage

**Note Value Field (Percentage):**
- Number input
- Range: 0-100
- Integer values
- Updates grade label dropdown when changed
- Updates point value when changed

**Point Value Field:**
- Number input
- Range: 0 to max points
- Step: 0.5
- Read-only appearance (no spinner UI)
- Updates percentage when changed
- Formula: `points = ((percentage / 100) × maxPoints × 2) / 2` (rounded to 0.5)
- Display format: remove ".0" suffix if present

**Ratio Field (Weight):**
- Number input
- Minimum: 1
- Integer values
- Used in weighted average calculation

### 3. Calculation Engine

#### 3.1 Weighted Average
```typescript
function calculateWeightedAverage(notes: Note[]): number {
  if (notes.length === 0) return 0;
  
  const [total, totalRatio] = notes.reduce(
    ([sum, ratioSum], note) => [
      sum + (note.value * note.ratio),
      ratioSum + note.ratio
    ],
    [0, 0]
  );
  
  return Math.round(total / totalRatio);
}
```

#### 3.2 Grade Conversion
```typescript
function percentageToGrade(
  percentage: number,
  scale: GradeScale
): string {
  const index = scale.thresholds.findIndex(
    threshold => threshold >= percentage
  );
  return scale.labels[index >= 0 ? index : scale.labels.length - 1];
}
```

#### 3.3 Point Conversion
```typescript
function percentageToPoints(
  percentage: number,
  maxPoints: number
): string {
  const points = Math.round((percentage / 100) * maxPoints * 2) / 2;
  const formatted = points.toFixed(1);
  return formatted.endsWith('.0') 
    ? formatted.slice(0, -2) 
    : formatted;
}

function pointsToPercentage(
  points: number,
  maxPoints: number
): number {
  return Math.round((points / maxPoints) * 100);
}
```

### 4. User Interface Components

#### 4.1 Header
- Logo image (`/noted.svg`)
- Screen reader only heading: "Noted"

#### 4.2 Points Configuration
- Number input for max points
- Default: 100
- Updates point values for all grades

#### 4.3 Grade Conversion Table
- Displays current global scale
- Three rows:
  - Grade labels (header row)
  - Percentage thresholds (≥)
  - Point equivalents (only shown if points ≠ 100)
- Responsive horizontal scroll
- Sticky header column

#### 4.4 Grade List
- List of grade items
- Each item displays all fields in a form
- Delete button on each item
- Compact layout (labels hidden except first item)

#### 4.5 Footer
- Fixed position at bottom
- Three sections:
  - Global scale selector (left)
  - Total grade display: `{gradeLabel} | {percentage}%` (center)
  - Empty div (right, for spacing)
- Total updates reactively based on:
  - All note values and ratios
  - Selected global scale

### 5. Styling Requirements

#### 5.1 Design System
- **shadcn/ui** component library
- **Tailwind CSS** for utility-first styling
- Built-in dark/light mode via shadcn/ui theme provider
- Customize shadcn/ui theme to match brand colors (accent colors)
- **Required shadcn/ui components:**
  - `Button` - For Add and Delete actions
  - `Input` - For name, percentage, points, and ratio fields
  - `Select` - For scale and grade label dropdowns
  - `Table` - For grade conversion table display
  - `Card` (optional) - For grade item containers
  - `Label` - For form field labels
- Maintain gradient branding for headings (custom CSS if needed)

#### 5.2 Responsive Design
- Mobile-first approach with Tailwind responsive utilities
- Table horizontal scroll on small screens (shadcn/ui Table component)
- Fixed footer on all screen sizes
- Touch-friendly input sizes (shadcn/ui default sizing)

#### 5.3 Accessibility
- shadcn/ui components are accessible by default
- Screen reader support built-in
- Keyboard navigation included
- Focus indicators (shadcn/ui focus styles)
- Semantic HTML (shadcn/ui uses proper HTML elements)

### 6. PWA Features

#### 6.1 Web App Manifest
- Preserve existing manifest.json structure
- Update start_url for Next.js routing
- Maintain icons and theme colors

#### 6.2 Service Worker
- Cache static assets
- Cache API responses (if any)
- Offline fallback page
- Update strategy: NetworkFirst or StaleWhileRevalidate

#### 6.3 Installability
- Install prompt support
- Standalone display mode
- Theme color configuration

## Architecture & Design

### Project Structure
```
noted-nextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page component
│   ├── manifest.ts        # PWA manifest generation
│   └── globals.css        # Tailwind CSS imports
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...            # Other shadcn components
│   ├── GradeItem.tsx      # Individual grade item
│   ├── GradeTable.tsx     # Grade conversion table
│   ├── Header.tsx         # App header
│   └── Footer.tsx        # Fixed footer with totals
├── lib/
│   ├── scales.ts          # Scale definitions and utilities
│   ├── scales.test.ts      # Unit tests for scales
│   ├── calculations.ts    # Calculation functions
│   ├── calculations.test.ts # Unit tests for calculations
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # shadcn/ui utils (cn function)
├── tests/
│   └── e2e/               # Playwright E2E tests
│       ├── grade-calculator.spec.ts
│       └── pwa.spec.ts
├── public/
│   ├── noted.svg          # Logo
│   ├── noted_192.png      # PWA icon
│   ├── noted_512.png      # PWA icon
│   └── scales.json        # Scale data (optional, can be in code)
├── components.json        # shadcn/ui configuration
├── biome.json             # Biome linting/formatting config
├── vitest.config.ts       # Vitest configuration
├── playwright.config.ts   # Playwright configuration
├── knip.config.ts        # Knip dead code detection config
├── tailwind.config.ts     # Tailwind configuration
├── next.config.js         # Next.js configuration
├── package.json
└── tsconfig.json
```

### Component Hierarchy
```
App (layout.tsx)
└── Page (page.tsx)
    ├── Header
    └── NoteList
        ├── PointsInput
        ├── GradeTable
        ├── GradeItem[] (mapped)
        │   ├── NameInput
        │   ├── ScaleSelect
        │   ├── GradeSelect
        │   ├── PercentageInput
        │   ├── PointsInput
        │   ├── RatioInput
        │   └── DeleteButton
        ├── AddButton
        └── Footer
            ├── GlobalScaleSelect
            └── TotalDisplay
```

### State Management Strategy

#### Local Component State
- Use `useState` for:
  - Notes array
  - Global scale
  - Points configuration
  - Next note ID counter

#### Derived State
- Calculate totals and grade labels using `useMemo`
- Avoid storing redundant calculated values

#### State Updates
- Immutable updates for notes array
- Functional updates for array modifications

### Data Flow
1. User input → Update note state
2. Note state change → Recalculate totals (useMemo)
3. Totals change → Update footer display
4. Scale change → Update table and grade labels

## Migration Strategy

### Phase 1: Project Setup
1. Initialize Next.js project with TypeScript
2. Configure App Router
3. Install and configure Tailwind CSS
4. Set up shadcn/ui (init command, configure components.json)
5. Install required shadcn/ui components (button, input, select, table, card)
6. **Set up quality control tools:**
   - Configure Biome (linting + formatting)
   - Set up Vitest (unit testing)
   - Configure Playwright (E2E testing)
   - Set up Knip (dead code detection)
7. Set up PWA support
8. Migrate static assets
9. Set up build and deployment pipeline

### Phase 2: Core Logic Migration
1. Port scale definitions to TypeScript
2. Implement calculation functions
3. Write unit tests for calculations
4. Verify calculation accuracy against Rust implementation

### Phase 3: Component Migration
1. Create base components (Header, Footer)
2. Implement GradeTable component
3. Implement GradeItem component
4. Implement NoteList container
5. Wire up state management

### Phase 4: Styling & UI
1. Customize shadcn/ui theme (tailwind.config.ts) to match brand colors
2. Build components using shadcn/ui primitives
3. Add custom gradient styling for headings (if needed)
4. Configure dark/light mode theme provider
5. Test theme switching
6. Verify responsive design with Tailwind utilities
7. Test accessibility (shadcn/ui components are accessible by default)

### Phase 5: PWA Integration
1. Configure next-pwa
2. Set up service worker
3. Test offline functionality
4. Verify installability

### Phase 6: Testing & Quality Assurance
1. Run Vitest unit tests (ensure 80%+ coverage for calculations)
2. Run Playwright E2E tests (critical user flows)
3. Run Biome linting and formatting checks
4. Run Knip dead code detection
5. Cross-browser testing (Playwright)
6. Mobile device testing
7. Performance optimization
8. Final UI/UX review

### Phase 7: Deployment
1. Set up deployment pipeline
2. Deploy to staging
3. User acceptance testing
4. Production deployment
5. Archive old Rust codebase

## Testing Requirements

### Unit Tests (Vitest)
- Calculation functions (weighted average, grade conversion, point conversion)
- Scale lookup functions
- Edge cases (empty notes, zero ratios, boundary values)
- Test files: `*.test.ts` or `*.test.tsx` alongside source files
- Coverage target: 80%+ for calculation functions

### Integration Tests (Vitest)
- Component interactions
- State updates
- Form submissions
- React Testing Library for component testing

### E2E Tests (Playwright)
- User workflows (add grade, change values, calculate total)
- PWA installation flow
- Offline functionality
- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Test files: `tests/e2e/*.spec.ts`

### Code Quality (Biome)
- Linting rules configured
- Formatting rules enforced
- Pre-commit hooks recommended
- CI/CD integration for automated checks

### Dead Code Detection (Knip)
- Monitor unused exports, dependencies, files
- Regular checks in CI/CD pipeline
- Keep codebase lean and maintainable

### Manual Testing Checklist
- [ ] All three scales work correctly
- [ ] Grade conversion matches Rust implementation
- [ ] Weighted average calculation is accurate
- [ ] Point system conversion works
- [ ] Dark/light mode switching
- [ ] Responsive design on mobile
- [ ] PWA installation
- [ ] Offline functionality
- [ ] Form validation
- [ ] Keyboard navigation

## Deployment Strategy

### Build Configuration
- Static export for GitHub Pages compatibility
- Optimize images and assets
- Generate service worker during build

### CI/CD Pipeline
- **Pre-commit hooks** (optional): Run Biome formatting
- **CI checks:**
  - Biome linting and formatting
  - Vitest unit tests
  - Playwright E2E tests
  - Knip dead code detection
- Fail build if any quality checks fail

### Deployment Options

#### Option 1: Vercel (Recommended)
- Automatic deployments from Git
- Built-in PWA support
- Edge network for fast loading
- Zero configuration

#### Option 2: GitHub Pages
- Static export with `output: 'export'`
- GitHub Actions workflow
- Free hosting
- Custom domain support

### Environment Configuration
- No environment variables required (fully static)
- All configuration in code

## Timeline & Milestones

### Estimated Timeline: 1-2 weeks (reduced due to shadcn/ui)

**Week 1:**
- Day 1: Project setup (Next.js, Tailwind, shadcn/ui initialization)
- Day 2: Core logic migration and unit tests
- Day 3-4: Component development with shadcn/ui
- Day 5: Theme customization and UI polish

**Week 2:**
- Day 1: PWA integration and testing
- Day 2: Cross-browser and device testing
- Day 3: Performance optimization
- Day 4: Documentation and deployment setup
- Day 5: Final testing and production deployment

### Milestones
1. ✅ Project initialized and build working
2. ✅ Quality control tools configured (Biome, Vitest, Playwright, Knip)
3. ✅ shadcn/ui and Tailwind configured
4. ✅ All calculations verified correct with unit tests
5. ✅ UI components complete with shadcn/ui
6. ✅ Theme customized and dark/light mode working
7. ✅ E2E tests passing
8. ✅ PWA features working
9. ✅ Deployed to production

## Risk Assessment

### Technical Risks
- **Calculation accuracy:** Mitigate with comprehensive unit tests
- **PWA compatibility:** Test on multiple devices and browsers
- **Performance:** Optimize bundle size and lazy loading

### Migration Risks
- **Feature parity:** Maintain detailed checklist
- **User disruption:** Deploy gradually or with feature flag
- **Data loss:** No user data to migrate (stateless app)

## Success Metrics

### Functional Metrics
- 100% feature parity with current implementation
- All calculations produce identical results
- Zero regression bugs

### Performance Metrics
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse PWA score > 90
- Bundle size < 200KB (gzipped)

### Quality Metrics
- TypeScript strict mode enabled
- Zero Biome linting errors
- Code formatted with Biome
- 80%+ test coverage for calculation functions (Vitest)
- E2E test coverage for critical user flows (Playwright)
- Knip reports no dead code
- Accessibility score > 90

## Future Enhancements (Out of Scope)

- Data persistence (localStorage/IndexedDB)
- Export/import functionality
- Multiple grade sets/sessions
- History/undo functionality
- Additional grading scales
- Internationalization (i18n)

## Appendix

### Key Files Reference
- Current Rust implementation: `src/main.rs`
- Current styles: `public/style.css`
- Scale data: `public/scales.json`
- Manifest: `public/manifest.json`
- Build config: `workbox-config.js`

### Calculation Verification
All calculations must be verified against the Rust implementation:
- Weighted average formula
- Grade threshold lookups
- Point conversion formulas
- Rounding behavior

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Document Status:** Draft  
**Last Updated:** January 24, 2026  
**Next Review:** After plan approval
