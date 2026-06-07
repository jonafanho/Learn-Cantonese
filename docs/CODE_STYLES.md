# Code Styles

> Conventions for the Canto Survival Angular + Ionic + Capacitor project.

These rules apply to TypeScript, Angular templates, SCSS, JSON assets, and Markdown docs.
Anything not listed here defers to ESLint and Angular defaults.

## 1. Naming

### 1.1 Folder and file naming

- Use feature-oriented folders under `src/app/` (`component/`, `service/`, `model/`, `utility/`)
- Keep folder names `kebab-case`
- Angular files follow standard suffixes:
	- `*.service.ts`
	- `*.component.ts|html|scss`
	- `*.guard.ts`
	- `*.utility.ts`

### 1.2 Identifier clarity

- Avoid abbreviations in identifiers unless they are common technical terms (`id`, `min`, `max`)
- Prefer descriptive variable names in loops and callbacks
- Keep method names action-oriented (`playTrack`, `updateMasteryScore`, `exportUserProfile`)

### 1.3 Casing rules

- Classes, interfaces, and types: `PascalCase`
- Variables, fields, methods, functions: `camelCase`
- Constants in utility files: `SCREAMING_SNAKE_CASE`
- CSS classes: Ionic utility classes (`ion-padding`, `ion-text-center`, etc.)
- Translation keys: `camelCase`, grouped by feature path (`session.feedback.successHeadline`)

## 2. Formatting

### 2.1 Indentation and whitespace

- Use tabs for indentation in TypeScript, HTML, SCSS, JSON, and Markdown
- Keep exactly one trailing newline at end of file

### 2.2 Strings and quotes

- TypeScript: use double quotes for strings
- Template literals are allowed only when interpolation is needed
- HTML attributes and JSON keys/values always use double quotes

### 2.3 Imports

Group imports with one blank line between groups, sorted alphabetically in each group:

1. Angular packages (`@angular/*`)
2. Ionic, Capacitor, Transloco, and other third-party packages
3. Internal application imports (relative paths)

Avoid barrel re-exports (`index.ts`) unless there is a clear maintenance benefit.

## 3. Angular and Ionic conventions

### 3.1 Component structure

- Use standalone components with `ChangeDetectionStrategy.OnPush`
- Keep component logic in `*.ts`, template in `*.html`, styles in `*.scss`
- Do not use inline templates or inline styles

### 3.2 Visibility and field modifiers

- Mark every member at the **lowest possible visibility**:
  - `protected` if accessed in a component's template or by a subclass
  - `private` if only used within the declaring class
  - Do **not** use the `public` keyword — unmarked members are public by default
- Mark every field `readonly` unless it is reassigned over its lifetime
- Prefer `inject()` over constructor injection in Angular classes
- Prefer signals for local UI state and RxJS for async streams and service boundaries
- Keep side effects in services; components orchestrate view logic

### 3.3 Ionic UI usage

- Use Ionic primitives (`ion-content`, `ion-card`, `ion-button`, etc.) for app UI
- Use Ionic utility classes for layout where possible (`ion-padding`, `ion-text-center`, `ion-justify-content-center`, etc.)
- Keep touch targets mobile-friendly and avoid desktop-only interactions

### 3.4 Accessibility and copy

- Every icon-only button must include an `aria-label` and translatable tooltip/assistive text
- All user-facing text must live in i18n files, not hardcoded in templates or components
- Use British English spelling in `en.json` (colour, centre, neighbourhood, etc.)

## 4. Pack content rules

### 4.1 Content and progress boundaries

- `ContentService` is read-only and never mutates bundled content
- `ProgressService` is the only service that writes progress state
- Persisted data contracts must be versioned (`meta.version`, `packVersion`)
- All user-facing text in content packs must be translation keys, never literal strings
- Asset paths in `pack.json` must be relative to the pack directory

### 4.2 Offline-first constraints

- No runtime dependency on cloud APIs for core learning flow
- Audio, image, and content assets must resolve locally from the pack directory
- Any optional online feature must fail safely without blocking sessions

### 4.3 Tone-tracing rules

- Keep tone validation thresholds centralised in `tone-validation.utility.ts`
- Canvas coordinates must normalise to a 100×100 virtual grid before evaluation
- Validation functions must be pure and unit-testable

## 5. Testing and quality

- Use Angular's default test stack for unit tests (`*.spec.ts`)
- Add tests for pure logic first:
	- Tone slope and threshold validation
	- Social feedback mapping by mastery level
	- Progress import/export validation and version checks
- Treat linter and TypeScript warnings as errors for merged changes

## 6. Documentation and maintenance

- Keep `README.md` user-facing (what the app is, how to run it)
- Keep implementation details in `docs/*.md`
- Update docs in the same pull request as behaviour changes
- When data contracts change, update examples and migration notes
