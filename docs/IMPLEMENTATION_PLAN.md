# Implementation Plan

This checklist is ordered to match the intended build sequence. Items marked with [x] are complete.

## Phase 1: Environment provisioning

- [x] Scaffold Angular workspace and Ionic integration
- [x] Install Capacitor core and CLI
- [x] Add `@capacitor/preferences` plugin
- [x] Configure linting with `angular-eslint`
- [x] Add `@jsverse/transloco` package and base locale assets
- [x] Register global styles (minimal — Ionic handles layout)
- [x] Set up Ionic dark mode via `ion-palette-dark` class

## Phase 2: Data and asset integration

- [x] Create `assets/content/manifest.json` — pack discovery
- [x] Create pack directories for all 3 chapters
- [x] Create per-pack `pack.json` with sections, cards, feedback profiles
- [x] Create per-pack `i18n/en.json` with chapter-specific translations
- [x] Create app-level `assets/i18n/en.json` with UI strings
- [x] Implement custom Transloco loader that deep-merges pack translations

## Phase 3: Core service fabrication

- [x] Implement `ContentService` — loads manifest + individual packs, caches results
- [x] Implement `ProgressService` — preferences persistence with export/import
- [x] Implement `AudioService` — playback lifecycle management
- [x] Implement `FeedbackService` — data-driven social feedback lookup
- [x] Create `tone-validation.utility.ts` — pure validation functions and tone thresholds
- [x] Create `deep-merge.utility.ts` — deep merge for i18n merging

## Phase 4: Component engineering

- [x] Build settings page with dark mode toggle, export, import

## Phase 4.5: Navigation, reusable components, and new screens

- [ ] Add shared hamburger menu (`ion-menu`) to root `app.component` — visible on every screen
- [ ] Build reusable `AudioPlaybackComponent` — play button + jyutping display, inputs: `jyutping`, `audioSrc`
- [ ] Build reusable `ToneTracingComponent` — HTML5 Canvas with normalised coordinate math, inputs: `toneSequence`, outputs: `toneComplete`
- [ ] Build `SectionsComponent` — list of sections within a chapter (route: `/chapters/:packId/sections`)
- [ ] Build `SessionComponent` — full card review loop: prompt reveal → audio playback → tone tracing → feedback → next card
- [ ] Build `ReviewComponent` — learned words/phrases screen with mastery stats (route: `/review`)

## Phase 5: Gameplay compilation

- [ ] Wire section navigation: chapters → sections → session → back to sections on complete
- [ ] Update mastery state based on answer and trace outcomes
- [ ] Unlock chapters/sections from mastery thresholds
- [ ] Populate review screen from mastered `wordMastery` entries in progress

## Phase 6: Hardening and release prep

- [ ] Add unit tests for tone validation, feedback mapping, progress import
- [ ] Add integration tests for progress persistence and session flow
- [ ] Run mobile QA on at least one iOS and one Android device
- [ ] Verify app behaviour in aeroplane mode
- [ ] Validate import/export across devices
- [ ] Prepare pilot content for all three chapters

## Acceptance criteria for MVP

- [ ] User can complete at least one section in each chapter fully offline
- [ ] Audio playback and tone tracing are responsive on target devices
- [ ] Progress survives app restarts and can be exported/imported
- [ ] Social feedback updates correctly with mastery changes
- [ ] No blocking errors from lint or TypeScript checks
- [ ] Dark mode respects system preference with manual override
- [ ] All user-facing text is driven by transloco keys from merged i18n files
