# Data Contracts

## 1. Content pack contract

Path: `src/assets/content/content-pack.json`

Purpose:

- Defines storyline acts, sections, and card payloads
- Ships as immutable bundled content
- Versioned for migration awareness
- Supports future community content packs by keeping gameplay content data-driven

### Content-pack rules

- Any user-facing text inside content JSON must be a translation key (for example `titleKey`, `promptKey`).
- Literal display strings must live in i18n files (`src/assets/i18n/*.json`).
- Audio/image resources must be referenced through asset paths in JSON.
- Social feedback tiers are data-driven in JSON and selected by section/profile mapping.

### Example shape

```json
{
  "contentVersion": "1.0.0",
  "feedbackProfiles": {
    "feedback_profile_taxi": {
      "id": "feedback_profile_taxi",
      "tiers": [
        {
          "minLevel": 0.8,
          "meterColor": "success",
          "headlineKey": "feedback.taxi.success.headline",
          "subtextKey": "feedback.taxi.success.subtext"
        }
      ]
    }
  },
  "acts": [
    {
      "id": "act_01_hkia",
      "titleKey": "content.act_01_hkia.title",
      "descriptionKey": "content.act_01_hkia.description",
      "sections": [
        {
          "id": "section_01_taxi",
          "titleKey": "content.section_01_taxi.title",
          "descriptionKey": "content.section_01_taxi.description",
          "feedbackProfileId": "feedback_profile_taxi",
          "cards": [
            {
              "id": "card_taxi_001",
              "promptKey": "content.card_taxi_001.prompt",
              "translationKey": "content.card_taxi_001.translation",
              "contextualHintKey": "content.card_taxi_001.contextualHint",
              "romanizationVisualFonts": "m4_goi1_maai4_bin1_ting4",
              "audioAssetPath": "assets/audio/act_01/m4goi_maaibin_ting4.mp3",
              "imageAssetPath": "assets/images/act_01/pull-over.svg",
              "toneSequence": [4, 1, 4, 1, 4]
            }
          ]
        }
      ]
    }
  ]
}
```

### Field notes

- `id` fields are stable keys used by progress mapping.
- `romanizationVisualFonts` is the primary practice string for pronunciation drills.
- `toneSequence` drives canvas validation targets and visual overlays.
- Asset paths should be relative to app root and resolvable offline.
- `feedbackProfiles` allows section-specific social-feedback behavior without TypeScript changes.

## 2. User progress contract

Persistence location:

- Backed by `@capacitor/preferences`
- Exported/imported as JSON text

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
    "currentActId": "act_01_hkia",
    "unlockedActIds": ["act_01_hkia"],
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

- Reject import when JSON parse fails.
- Reject import when required top-level keys are missing.
- Reject or migrate when `meta.version` is incompatible.
- Clamp mastery `level` to `[0, 1]` during import sanitation.
- Ignore unknown fields for forward compatibility.

## 3. Suggested TypeScript interfaces

```ts
export interface ContentPack {
  contentVersion: string;
  feedbackProfiles: Record<string, SocialFeedbackProfile>;
  acts: Act[];
}

export interface Act {
  id: string;
  titleKey: string;
  descriptionKey: string;
  sections: Section[];
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
  audioAssetPath?: string;
  imageAssetPath?: string;
  toneSequence: number[];
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

export interface UserProgress {
  meta: {
    version: string;
    lastUpdated: string;
    deviceId?: string;
  };
  storylineProgress: {
    currentActId: string;
    unlockedActIds: string[];
    completedSectionIds: string[];
  };
  wordMastery: Record<string, MasteryEntry>;
}

export interface MasteryEntry {
  level: number;
  consecutiveCorrectAnswers: number;
  lastReviewedTimestamp: string;
}
```

## 4. Versioning policy

- Increment `contentVersion` when bundled content changes.
- Increment progress `meta.version` for schema changes.
- Maintain migration utilities for at least one previous progress version.
- Document breaking changes in release notes.

