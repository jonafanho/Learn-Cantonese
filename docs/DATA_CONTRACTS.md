# Data Contracts

## 1. Pack manifest contract

**Path:** `assets/content/manifest.json`

A simple JSON array of pack directory IDs. The app reads this at bootstrap to discover all available packs.

```json
["hkia", "cha-chaan-teng", "wet-market"]
```

Each ID corresponds to a subdirectory under `assets/content/` containing a `pack.json`.

## 2. Content pack contract

**Path:** `assets/content/{packId}/pack.json`

**Purpose:**
- Defines a chapter with its sections, cards, and social feedback profiles
- Ships as bundled immutable content per pack directory
- Versioned for migration awareness
- Supports community content packs — drop a new directory with a `pack.json`, its own `i18n/`, `audio/`, and `images/` and the app picks it up

### Content-pack rules

- Every user-facing string inside content JSON must be a **translation key** (e.g. `titleKey`, `promptKey`)
- Literal display strings live in pack-level i18n files (`assets/content/{packId}/i18n/*.json`) or the app-level i18n file
- Audio/image resources are referenced via relative paths within the pack directory
- The `TranslocoHttpLoader` deep-merges each pack's `i18n/{lang}.json` with the base translation file
- All text fields end with `Key` suffix to indicate they are transloco translation keys
- Asset paths are relative to the pack root (e.g. `audio/clip.mp3` → `assets/content/{packId}/audio/clip.mp3`)

### Example shape

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"packVersion": "1.0.0",
	"id": "hkia",
	"titleKey": "chapter.hkia.title",
	"descriptionKey": "chapter.hkia.description",
	"feedbackProfiles": {
		"feedback_profile_taxi": {
			"id": "feedback_profile_taxi",
			"tiers": [
				{
					"minLevel": 0.8,
					"meterColor": "success",
					"headlineKey": "feedback.taxi.success.headline",
					"subtextKey": "feedback.taxi.success.subtext"
				},
				{
					"minLevel": 0.4,
					"meterColor": "warning",
					"headlineKey": "feedback.taxi.warning.headline",
					"subtextKey": "feedback.taxi.warning.subtext"
				},
				{
					"minLevel": 0,
					"meterColor": "danger",
					"headlineKey": "feedback.taxi.danger.headline",
					"subtextKey": "feedback.taxi.danger.subtext"
				}
			]
		}
	},
	"sections": [
		{
			"id": "section_01_taxi",
			"titleKey": "chapter.hkia.section_01_taxi.title",
			"descriptionKey": "chapter.hkia.section_01_taxi.description",
			"feedbackProfileId": "feedback_profile_taxi",
			"cards": [
				{
					"id": "card_taxi_001",
					"promptKey": "chapter.hkia.card_taxi_001.prompt",
					"translationKey": "chapter.hkia.card_taxi_001.translation",
					"contextualHintKey": "chapter.hkia.card_taxi_001.contextualHint",
					"romanizationVisualFonts": "m4_goi1_maai4_bin1_ting4",
					"audioAssetPath": "audio/m4goi_maaibin_ting4.mp3",
					"imageAssetPath": "images/pull-over.svg",
					"toneSequence": [4, 1, 4, 1, 4]
				}
			]
		}
	]
}
```

### Field notes

- `id` fields are stable keys used by progress mapping
- `romanizationVisualFonts` is the primary practice string for pronunciation drills (jyutping with tone numbers)
- `toneSequence` drives canvas validation targets and visual overlays
- `audioAssetPath` and `imageAssetPath` are relative to the pack root — resolved by `ContentService.resolveAssetPath()`
- `feedbackProfiles` is a flat map keyed by profile ID, referenced by sections via `feedbackProfileId`
- Each `tier` has a `minLevel` threshold (0.0–1.0); the highest-matching tier is shown
- `pack.json` lives alongside `i18n/`, `audio/`, and `images/` directories inside the pack folder

## 3. User progress contract

**Persistence:** `@capacitor/preferences` under the key `user_progress`

### Example shape

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"meta": {
		"version": "1.0.0",
		"lastUpdated": "2026-06-05T18:43:00Z",
		"deviceId": "pixel-8-pro-local-sync"
	},
	"storylineProgress": {
		"currentChapterId": "hkia",
		"unlockedChapterIds": ["hkia"],
		"completedSectionIds": []
	},
	"wordMastery": {
		"card_taxi_001": {
			"level": 0.75,
			"consecutiveCorrectAnswers": 3,
			"lastReviewedTimestamp": "2026-06-05T10:15:30Z"
		}
	}
}
```

### Validation and migration rules

- Reject import when JSON parse fails
- Reject import when required top-level keys are missing
- Reject or migrate when `meta.version` is incompatible
- Clamp mastery `level` to `[0, 1]` during import sanitation
- Ignore unknown fields for forward compatibility

## 4. TypeScript interfaces

All interfaces live in `src/app/model/`.

### content-pack.model.ts

```typescript
export interface PackManifest {
	packs: string[];
}

export interface Pack {
	packVersion: string;
	id: string;
	titleKey: string;
	descriptionKey: string;
	feedbackProfiles: Record<string, SocialFeedbackProfile>;
	sections: Section[];
}

export interface SocialFeedbackProfile {
	id: string;
	tiers: SocialFeedbackTier[];
}

export interface SocialFeedbackTier {
	minLevel: number;
	meterColor: "success" | "warning" | "danger";
	headlineKey: string;
	subtextKey: string;
}

export interface Section {
	id: string;
	titleKey: string;
	descriptionKey: string;
	feedbackProfileId: string;
	cards: Flashcard[];
}

export interface Flashcard {
	id: string;
	promptKey: string;
	translationKey: string;
	contextualHintKey: string;
	romanizationVisualFonts: string;
	audioAssetPath: string;
	imageAssetPath?: string;
	toneSequence: number[];
}
```

### progress.model.ts

```typescript
export interface UserProgress {
	meta: UserProgressMeta;
	storylineProgress: StorylineProgress;
	wordMastery: Record<string, MasteryEntry>;
}

export interface UserProgressMeta {
	version: string;
	lastUpdated: string;
	deviceId: string;
}

export interface StorylineProgress {
	currentChapterId: string;
	unlockedChapterIds: string[];
	completedSectionIds: string[];
}

export interface MasteryEntry {
	level: number;
	consecutiveCorrectAnswers: number;
	lastReviewedTimestamp: string;
}
```

## 5. Versioning policy

- Increment `packVersion` when pack content changes
- Increment progress `meta.version` for schema changes
- Maintain migration utilities for at least one previous progress version
- Document breaking changes in release notes

## 6. Custom resource packs

Because each chapter is a self-contained directory with its own JSON, translations, audio, and images, anyone can create a custom pack by:

1. Creating a new directory under `assets/content/` (e.g. `my-custom-pack/`)
2. Adding a `pack.json` with sections, cards, and feedback profiles
3. Adding `i18n/en.json` with the required translation keys
4. Adding audio/image files referenced by the pack
5. Adding the directory ID to `manifest.json`

The app will automatically discover and load the pack at next bootstrap. This follows the same pattern as Minecraft resource packs.
