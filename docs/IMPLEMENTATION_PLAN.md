# Implementation Plan

This checklist is ordered to match the intended build sequence.

## Phase 1: Environment provisioning

- [ ] Scaffold Angular workspace and Ionic integration.
- [ ] Install Capacitor core and CLI.
- [ ] Add Capacitor Android and iOS platforms.
- [ ] Add `@capacitor/preferences` plugin.
- [ ] Configure linting with `@angular-eslint/eslint-plugin`.
- [ ] Add transloco package and base locale assets.
- [ ] Register global styles, including visual tone font declarations.

## Phase 2: Data and asset integration

- [ ] Create `src/assets/content/content-pack.json`.
- [ ] Add starter assets under `src/assets/audio/` and `src/assets/images/`.
- [ ] Add schema validation utility for content load.
- [ ] Seed i18n files for interface copy.

## Phase 3: Core service fabrication

- [ ] Implement `ContentService` for immutable content access.
- [ ] Implement `ProgressService` with preferences persistence.
- [ ] Implement export/import handlers for user profile JSON.
- [ ] Implement `AudioService` playback lifecycle management.

## Phase 4: Component engineering

- [ ] Build session card reveal component.
- [ ] Build anxiety meter component.
- [ ] Build canvas trace component with normalized coordinate math.
- [ ] Add tone validation utility with unit tests.

## Phase 5: Gameplay compilation

- [ ] Wire session page flow across card reveal, audio, trace, and feedback.
- [ ] Update mastery state based on answer and trace outcomes.
- [ ] Unlock sections/acts from mastery thresholds.
- [ ] Add lightweight onboarding and chapter navigation.

## Phase 6: Hardening and release prep

- [ ] Add integration tests for progress persistence and session flow.
- [ ] Run mobile QA on at least one iOS and one Android device.
- [ ] Verify app behavior in airplane mode.
- [ ] Validate import/export across devices.
- [ ] Prepare pilot content for all three acts.

## Acceptance criteria for MVP

- User can complete at least one section in each act fully offline.
- Audio playback and tone tracing are responsive on target devices.
- Progress survives app restarts and can be exported/imported.
- Social feedback updates correctly with mastery changes.
- No blocking errors from lint or TypeScript checks.

