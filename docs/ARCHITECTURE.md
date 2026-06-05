# Architecture

## 1. System overview

The app is a client-only mobile web application packaged as a native app shell via Capacitor.

- Runtime: Angular + Ionic in a WebView
- Native bridge: Capacitor plugins
- Persistence: `@capacitor/preferences`
- Content source: bundled JSON/audio/image assets under `frontend/src/assets/`
- Network dependency: none for MVP learning loop

## 2. Layered design

```text
+--------------------------------------------------------------+
|                         Angular Web                          |
|  (Standard Browser / Cordova / Capacitor App Layer Runtime) |
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

## 3. Angular module and feature structure

```text
frontend/src/app/
├── component/
│   └── session-preview/
├── model/
│   ├── content-pack.model.ts
│   └── progress.model.ts
├── service/
│   ├── audio.service.ts
│   ├── content.service.ts
│   └── progress.service.ts
├── utility/
│   ├── social-feedback.utility.ts
│   └── tone-validation.utility.ts
├── app.component.ts|html|scss
└── app.config.ts
```

## 4. Service responsibilities

### `ContentService`

- Read-only access to bundled content assets
- No HTTP calls for MVP
- Exposes typed observables for acts, sections, and card pools

Suggested API:

- `getActDetails(actId: string): Observable<Act>`
- `getFlashcardPool(sectionId: string): Observable<Flashcard[]>`

### `ProgressService`

- Owns all write operations for user progress
- Uses `@capacitor/preferences` for persistence
- Handles profile export/import with schema validation and version checks

Suggested API:

- `updateMasteryScore(cardId: string, isCorrect: boolean): Promise<void>`
- `exportUserProfile(): void`
- `importUserProfile(fileRawText: string): Promise<boolean>`

### `AudioService`

- Wraps HTML5 Audio playback
- Prevents overlapping leaks by tracking and stopping active instances
- Keeps transitions low-latency during rapid card drills

Suggested API:

- `playTrack(assetPath: string): void`
- `stopActiveTracks(): void`

## 5. Runtime data flow

1. Session page requests section data from `ContentService`.
2. Current card renders prompt, visual tone hint, and optional image.
3. `AudioService` plays local audio track on demand.
4. User answers via recall and optional tone tracing gesture.
5. Validation result updates mastery via `ProgressService`.
6. Social feedback message is generated from mastery level and rendered using JSON-defined feedback tiers.

All user-facing strings in content packs are translation keys, and all media is referenced via JSON paths to support custom resource-pack style extensions.

## 6. Offline-first constraints

- Core progression must work in airplane mode.
- Content pack, images, and audio files must be packaged in app bundle.
- Progress writes must not depend on cloud sync.
- Export/import is local file driven.

## 7. Non-functional requirements

- Fast tap-to-audio response for flashcard sessions
- Smooth 60 FPS target for canvas interaction on mid-range devices
- Predictable startup without network calls
- Safe recovery from malformed import files

## 8. Testing strategy (architecture-level)

- Unit test pure logic (tone validation, social feedback mapping, import parsing)
- Unit test services with plugin mocks
- Integration test session flow with fake content pack
- Manual mobile QA for touch behavior and audio playback lifecycle

