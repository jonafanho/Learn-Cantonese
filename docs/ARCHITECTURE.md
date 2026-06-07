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
│   ├── chapters/            # Chapter selection list
│   └── settings/            # Settings (theme, language, export, import)
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
├── app.routes.ts             # Route definitions (home, chapters, settings)
├── app.component.ts|html|scss # Root component with router-outlet
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

The app uses Angular's standalone router with three top-level routes:

| Path         | Component          | Description                    |
|--------------|--------------------|--------------------------------|
| `/`          | `HomeComponent`    | Welcome screen, nav buttons    |
| `/chapters`  | `ChaptersComponent`| Chapter selection list         |
| `/settings`  | `SettingsComponent`| Theme, language, export/import |

Routes are defined in `app.routes.ts` and registered via `provideRouter(routes)` in `app.config.ts`.

## 9. Dark mode

Dark mode uses **Ionic's built-in palette system**, not custom CSS variables:

- Toggling the `ion-palette-dark` class on `<html>` activates Ionic's native dark palette
- Respects `prefers-color-scheme: dark` media query by default
- Preference stored via `@capacitor/preferences`
- Managed by a signal in `SettingsService` and initialised before bootstrap — no flicker

No custom CSS variables or media query overrides are needed — Ionic handles it.

## 10. Testing strategy

- Unit test pure logic: tone validation, feedback mapping, import parsing
- Unit test services with plugin mocks
- Integration test session flow with a fake content pack
- Manual mobile QA for touch behaviour and audio playback lifecycle
