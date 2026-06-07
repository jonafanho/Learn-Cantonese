# Canto Survival

Speak Cantonese. Survive Hong Kong.

A narrative-driven, offline-first mobile app that teaches spoken Cantonese through immersive real-world scenarios. No Chinese characters, no streaks, no pressure — just practical oral survival skills for your 60-day Hong Kong relocation.

## Features

- **Zero-Literacy Scope** — Learn purely through phonetics and tones. No reading or writing required.
- **Visual Tone Tracing** — Interactive HTML5 Canvas tool that trains your ear and muscle memory for Cantonese's six tones.
- **Narrative Quest Design** — Progress through three immersive chapters: landing at HKIA, battling the cha chaan teng, and haggling at the wet market.
- **Social Anxiety Meter** — Contextual feedback that simulates real social outcomes, not artificial scores.
- **100% Offline** — All content, audio, and images ship with the app bundle. No internet required for the learning loop.
- **Privacy First** — All progress stored locally on device. Export and import your profile as a JSON file.
- **Custom Resource Packs** — All content is driven by JSON data organised into self-contained packs. Drop in a new folder with a `pack.json`, its own translations, audio, and images — just like Minecraft resource packs.

## Tech Stack

- **Angular 22** — Frontend framework
- **Ionic 8** — Mobile-adaptive UI framework (iOS + Android styled components)
- **Capacitor 8** — Native shell compiler (Angular → APK / iOS `.app`)
- **@jsverse/transloco** — Internationalisation with deep-merge pack translations
- **@capacitor/preferences** — Native key-value persistence

## Getting Started

```bash
cd frontend
npm install
npm start
```

The dev server runs on `http://localhost:4200`.

### Build for production

```bash
npm run build
```

Output goes to `frontend/dist/website/`.

### Sync with Capacitor (iOS/Android)

```bash
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
npx cap open android
```

## Project Structure

```
frontend/src/
├── app/
│   ├── component/       # UI components (Ionic-based)
│   ├── model/           # TypeScript interfaces for data contracts
│   ├── service/         # Core services (content, progress, audio, feedback)
│   └── utility/         # Pure utility functions (tone validation, deep merge)
├── assets/
│   ├── content/         # Pack directories, each a self-contained chapter
│   │   ├── manifest.json
│   │   ├── hkia/
│   │   │   ├── pack.json
│   │   │   ├── i18n/en.json
│   │   │   ├── audio/
│   │   │   └── images/
│   │   ├── cha-chaan-teng/
│   │   └── wet-market/
│   ├── i18n/            # App-level translation files
│   ├── audio/           # (Legacy — new audio goes in packs)
│   └── images/          # (Legacy — new images go in packs)
└── styles.scss          # Global styles (minimal — Ionic handles layout)
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — System design and data flow
- [Data Contracts](docs/DATA_CONTRACTS.md) — Content pack and progress schemas
- [Gameplay Mechanics](docs/MECHANICS.md) — Tone tracing and social anxiety system
- [Code Styles](docs/CODE_STYLES.md) — Conventions for contributors
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) — Build checklist

## License

Private project.
