# Architecture

## 1. System overview

The app is a client-only mobile web application packaged as a native app shell via Capacitor.

- **Runtime:** Angular 22 + Ionic 8 in a WebView
- **Native bridge:** Capacitor 8 plugins (`@capacitor/preferences`)
- **Persistence:** `@capacitor/preferences` (bridges to `UserDefaults` on iOS, `SharedPreferences` on Android)
- **Content source:** Self-contained "packs" under `assets/content/`, each with its own JSON data, translations, audio, and images
- **i18n:** `@jsverse/transloco` with a custom loader that deep-merges app-level and per-pack translation files
- **Network dependency:** None for the core learning loop

## 2. Layered design

```text
+--------------------------------------------------------------+
|                         Angular Web                          |
|  (Standard Browser / Capacitor App Layer Runtime)            |
+--------------------------------------------------------------+
|      Ionic Framework UI       |    HTML5 Canvas Engine       |
|  (Adapts to iOS/Android UX)   | (Kinesthetic Tone Tracing)   |
+--------------------------------------------------------------+
|                      Capacitor Core Bridge                   |
|          (Compiles JS/TS codebase into Native WebViews)      |
+--------------------------------------------------------------+
|          iOS Deployment       |       Android Deployment     |
|      (WKWebView Container)    |      (Android WebView Core)  |
+--------------------------------------------------------------+
```

## 3. Application structure

```
frontend/src/app/
├── component/               # UI components (Ionic-based)
│   ├── home/                # Home screen with navigation to chapters and settings
│   ├── chapters/            # Chapter selection list (shows available packs)
│   ├── sections/            # Section list for a selected chapter
│   ├── session/             # Card review session (card reveal, audio, trace, feedback)
│   ├── review/              # Learned words review — all mastered cards across chapters
│   ├── settings/            # Settings (theme, language, export, import)
│   ├── audio-playback/      # Reusable: plays audio + displays jyutping for a card
│   ├── tone-tracing/        # Reusable: HTML5 Canvas for tone contour tracing
│   └── page-layout/         # Reusable: toolbar+menu shell, projects content via ng-content
├── model/
│   ├── content-pack.model.ts # PackManifest, Pack, Section, Flashcard, SocialFeedbackProfile, SocialFeedbackTier
│   └── progress.model.ts     # UserProgress, MasteryEntry, StorylineProgress
├── service/
│   ├── settings.service.ts   # Theme + language persistence via @capacitor/preferences
│   ├── content.service.ts    # Loads pack manifest, resolves individual packs from assets
│   ├── progress.service.ts   # State persistence via @capacitor/preferences
│   ├── audio.service.ts      # HTML5 Audio wrapper with lifecycle management
│   └── feedback.service.ts   # Social feedback tier lookup from pack data
├── utility/
│   ├── tone-validation.utility.ts  # Pure functions for canvas tone evaluation
│   └── deep-merge.utility.ts       # Deep object merge for i18n translation merging
├── app.routes.ts             # Route definitions (home, chapters, sections, session, review, settings)
├── app.component.ts|html|scss # Root component — IonMenu wrapper + router-outlet
└── app.config.ts             # Application-wide providers (Ionic, Transloco, HttpClient, Router, SettingsService initializer)
```

## 4. Content pack system

Each chapter is a self-contained "pack" — a directory under `assets/content/`:

```
assets/content/
  manifest.json          # Array of pack directory IDs — ["hkia", "cha-chaan-teng", ...]
  hkia/
    pack.json            # Chapter data: sections, cards, feedback profiles
    i18n/en.json         # Chapter-specific translation keys (merged into Transloco)
    audio/               # Pronunciation clips
    images/              # Illustrations and icons
```

- The `manifest.json` is a simple JSON array of pack IDs.
- The `TranslocoHttpLoader` reads the manifest at app bootstrap, and for each pack loads its `i18n/{lang}.json`, deep-merging it with the base translation file.
- Asset paths in `pack.json` are relative to the pack root. The `ContentService.resolveAssetPath(packId, relativePath)` method resolves them to `assets/content/{packId}/{relativePath}`.

## 5. Service responsibilities

### ContentService

- Loads `manifest.json` to discover available packs
- Loads individual pack data from `assets/content/{packId}/pack.json`
- Caches loaded packs via `shareReplay(1)` and a `Map<string, Observable<Pack>>`
- Resolves asset paths relative to each pack directory

**Methods:**
- `getAvailablePackIds(): Observable<string[]>`
- `getPack(packId: string): Observable<Pack>`
- `getSection(packId: string, sectionId: string): Observable<Section | undefined>`
- `getFeedbackProfile(packId: string, profileId: string): Observable<SocialFeedbackProfile | null>`
- `resolveAssetPath(packId: string, relativePath: string): string`

### ProgressService

- Owns all write operations for user progress
- Uses `@capacitor/preferences` for persistence (works in browser via localStorage fallback)
- Handles profile export/import with schema validation

**Methods:**
- `getStorylineProgress(): Promise<StorylineProgress>`
- `getMastery(cardId: string): Promise<MasteryEntry | null>`
- `updateMasteryScore(cardId: string, isCorrect: boolean): Promise<void>`
- `completeSection(sectionId: string): Promise<void>`
- `unlockChapter(chapterId: string): Promise<void>`
- `exportUserProfile(): Promise<string>`
- `importUserProfile(fileRawText: string): Promise<boolean>`

### SettingsService

- Manages global app settings: dark mode toggle and language selection
- Persists settings via `@capacitor/preferences` (no cookies)
- Syncs language changes to Transloco at runtime via `setActiveLang`
- Initialised before app bootstrap via `provideAppInitializer` so theme and language are applied before the first render — no flicker

**Fields:**
- `darkMode: WritableSignal<boolean>`
- `language: WritableSignal<string>`

**Methods:**
- `init(): Promise<void>`

### AudioService

- Wraps HTML5 Audio for reliable playback
- Prevents overlapping audio by tracking and stopping active instances
- Cleans up finished tracks automatically

**Methods:**
- `playTrack(assetPath: string): void`
- `stopActiveTracks(): void`

### FeedbackService

- Decouples feedback logic from components
- Looks up feedback profiles from the active pack
- Finds matching tier by level (highest threshold met)

**Methods:**
- `getFeedbackProfile(packId: string, profileId: string): Observable<SocialFeedbackProfile | null>`
- `getMatchingTier(tiers: SocialFeedbackTier[], level: number): SocialFeedbackTier | null`

## 6. Runtime data flow

```
Session page
  → requests section data from ContentService (by packId + sectionId)
  → current card renders prompt (via transloco key) + visual tone hint + optional image
  → AudioService plays local audio track (path resolved via resolveAssetPath)
  → user answers via recall + optional tone tracing gesture
  → validation result updates mastery via ProgressService
  → FeedbackService evaluates mastery level against section's feedback profile
  → social feedback tier (with transloco keys) displayed to user
```

## 7. Offline-first constraints

- Core progression must work in aeroplane mode
- Content packs, images, and audio files must be packaged in the app bundle
- Progress writes must not depend on cloud sync
- Export/import is local file driven (JSON download/upload)

## 8. Routing

The app uses Angular's standalone router with six top-level routes:

| Path                                   | Component            | Description                          |
|----------------------------------------|----------------------|--------------------------------------|
| `/`                                    | `HomeComponent`      | Welcome screen, nav buttons          |
| `/chapters`                            | `ChaptersComponent`  | Chapter/pack selection list          |
| `/chapters/:packId/sections`           | `SectionsComponent`  | Section list for the selected pack   |
| `/chapters/:packId/sections/:sectionId`| `SessionComponent`   | Card review session                  |
| `/review`                              | `ReviewComponent`    | All learned words with mastery stats |
| `/settings`                            | `SettingsComponent`  | Theme, language, export/import       |

Routes are defined in `app.routes.ts` and registered via `provideRouter(routes)` in `app.config.ts`.

## 9. Shared navigation (hamburger menu)

Every screen includes an Ionic `ion-menu` slide-out drawer accessible via a hamburger icon in the toolbar. The menu provides fast navigation to:

- **Home** (`/`)
- **Chapters** (`/chapters`)
- **Review** (`/review`) — learned words and mastery
- **Settings** (`/settings`)

The menu is implemented once in `app.component.html` and wraps the `router-outlet` inside an `ion-router-outlet` with matching `contentId`. Each page component adds an `ion-menu-toggle` button in its toolbar to open the menu.

This avoids duplicating navigation controls across every page and keeps the app feeling native on mobile.

## 10. Reusable components

### AudioPlaybackComponent

- **Selector:** `app-audio-playback`
- **Inputs:**
  - `jyutping: string` — the jyutping romanization to display
  - `audioSrc: string` — resolved asset path to the audio file
  - `labelKey: string` — optional transloco key for assistive text (e.g. "tap to play")
- **Outputs:** none (side-effect only — plays audio via `AudioService`)
- **Purpose:** Standardises the audio playback UI across session and review screens. Shows a play button alongside the jyutping; tapping it stops any active track and plays the new one.

### ToneTracingComponent

- **Selector:** `app-tone-tracing`
- **Inputs:**
  - `toneSequence: number[]` — the target tone sequence (e.g. `[4, 1, 4, 1, 4]`)
  - `disabled: boolean` — lock the canvas while feedback is shown
- **Outputs:**
  - `toneComplete: EventEmitter<boolean>` — emits `true` if all tones in the sequence were traced correctly, `false` otherwise
- **Purpose:** Provides the HTML5 Canvas drawing surface for tone contour tracing. Uses `normalizeCoordinate`, `validateTone`, and `isStrokeLongEnough` from `tone-validation.utility.ts`. Renders visual tone-zone guides on the canvas and evaluates each stroke against the target tone thresholds.

### PageLayoutComponent

- **Selector:** `app-page-layout`
- **Inputs:**
  - `titleKey: string` (required) — transloco key for the toolbar title
- **Purpose:** Eliminates the repetitive `ion-app` + `ion-header` + menu button boilerplate that every page was duplicating. Wraps a page's content area with `<ion-app><ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button/>` and the title. Page-specific content is projected via `<ng-content>` into `ion-content`. All six page components use this wrapper, removing ~6 lines of template and 6+ imports per page.

## 11. Screen flow

```
Home
 ├── Chapters
 │    └── Sections (per chapter)
 │         └── Session (card review)
 ├── Review
 └── Settings
```

Navigation is routed through Angular Router. The hamburger menu provides backstop access to the four main screens from anywhere in the app.

## 12. Dark mode

Dark mode uses **Ionic's built-in palette system**, not custom CSS variables:

- Toggling the `ion-palette-dark` class on `<html>` activates Ionic's native dark palette
- Respects `prefers-color-scheme: dark` media query by default
- Preference stored via `@capacitor/preferences`
- Managed by a signal in `SettingsService` and initialised before bootstrap — no flicker

No custom CSS variables or media query overrides are needed — Ionic handles it.

## 13. Testing strategy

- Unit test pure logic: tone validation, feedback mapping, import parsing
- Unit test services with plugin mocks
- Integration test session flow with a fake content pack
- Manual mobile QA for touch behaviour and audio playback lifecycle
