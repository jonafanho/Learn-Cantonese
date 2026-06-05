# Code Styles

> Conventions for the Angular + Ionic + Capacitor Cantonese Survival Quest project.

These rules apply to TypeScript, Angular templates, SCSS, JSON assets, and Markdown docs.
Anything not listed here defers to ESLint, Prettier (if configured), and Angular defaults.

## 1. Naming

### 1.1 Folder and file naming

- Use feature-oriented folders under `src/app/` (`core/`, `shared/`, `features/`).
- Keep folder names `kebab-case`.
- Angular files follow standard suffixes:
	- `*.service.ts`
	- `*.component.ts|html|scss`
	- `*.page.ts|html|scss`
	- `*.guard.ts`

### 1.2 Identifier clarity

- Avoid abbreviations in identifiers unless they are common technical terms (`id`, `min`, `max`).
- Prefer descriptive variable names in loops and callbacks.
- Keep method names action-oriented (`playTrack`, `updateMasteryScore`, `exportUserProfile`).

### 1.3 Casing rules

- Classes, interfaces, and types: `PascalCase`.
- Variables, fields, methods, functions: `camelCase`.
- Constants in `*.constants.ts`: `SCREAMING_SNAKE_CASE`.
- CSS classes and file names: `kebab-case`.
- Translation keys: `camelCase` and grouped by feature path (`session.feedback.successHeadline`).

## 2. Formatting

### 2.1 Indentation and whitespace

- Use tabs for indentation in TypeScript, HTML, SCSS, Markdown, and JSON in this repo.
- Keep exactly one trailing newline at end of file.

### 2.2 Strings and quotes

- TypeScript: use double quotes for strings.
- Template literals are allowed only when interpolation is needed.
- HTML attributes and JSON keys/values always use double quotes.

### 2.3 Imports

Group imports with one blank line between groups, sorted alphabetically in each group:

1. Angular packages (`@angular/*`)
2. Ionic/Capacitor/Transloco and other third-party packages
3. Internal application imports

Avoid barrel exports (`index.ts`) unless there is a clear maintenance benefit.

## 3. Angular and Ionic conventions

### 3.1 Component structure

- Use standalone components.
- Keep component logic in `*.ts`, template in `*.html`, styles in `*.scss`.
- Do not use inline templates or inline styles.
- Prefer `ChangeDetectionStrategy.OnPush` unless there is a measurable reason not to.

### 3.2 Dependency injection and reactivity

- Prefer `inject()` over constructor injection in Angular classes.
- Prefer signals for local UI state and RxJS for async streams and service boundaries.
- Keep side effects in services; components should orchestrate view logic.

### 3.3 Ionic UI usage

- Use Ionic primitives (`ion-content`, `ion-card`, `ion-button`, etc.) for app UI.
- Do not introduce PrimeNG or Angular Material components unless explicitly approved.
- Keep touch targets mobile-friendly and avoid desktop-only interactions.

### 3.4 Accessibility and copy

- Every icon-only button must include an `aria-label` and translatable tooltip/assistive text.
- All user-facing text must live in i18n files, not hardcoded in templates.
- Keep sentence casing and a calm, supportive tone for feedback messages.

## 4. Domain and data rules

### 4.1 Content and progress boundaries

- `ContentService` is read-only and never mutates bundled content.
- `ProgressService` is the only service that writes progress state.
- Persisted data contracts must be versioned (`meta.version`, `contentVersion`).

### 4.2 Offline-first constraints

- No runtime dependency on cloud APIs for core learning flow.
- Audio, image, and content assets must resolve locally from `src/assets/`.
- Any optional online feature must fail safely without blocking sessions.

### 4.3 Tone-tracing rules

- Keep tone validation thresholds centralized in constants, not spread across components.
- Canvas coordinates must normalize to a 100x100 virtual grid before evaluation.
- Validation functions should be pure and unit-testable.

## 5. Testing and quality

- Use Angular's default test stack for unit tests (`*.spec.ts`).
- Add tests for pure logic first:
	- Tone slope and threshold validation
	- Social feedback mapping by mastery level
	- Progress import/export validation and version checks
- Treat linter and TypeScript warnings as errors for merged changes.

## 6. Documentation and maintenance

- Keep `README.md` user-facing.
- Keep implementation details in `docs/*.md`.
- Update docs in the same pull request as behavior changes.
- When data contracts change, update examples and migration notes.
