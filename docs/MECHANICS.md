# Gameplay Mechanics

## 1. Narrative quest model

The MVP learning path is scenario-driven rather than vocabulary-list-driven. Each chapter places the learner in a real Hong Kong context with measurable communication outcomes.

| Chapter | Title | Real-world context | Core targets |
| --- | --- | --- | --- |
| 1 | Landing at HKIA | Airport arrival, Octopus card, hailing a taxi | Directions, imperative commands, basic numbers |
| 2 | The Cha Chaan Teng Battle | Ordering at a high-velocity local diner | Food groups, modifiers (cold/hot), sugar/ice config |
| 3 | The Neighbourhood Wet Market | Purchasing produce, negotiating prices | Large numbers, money units, weights (catty/斤) |

Progression is gated by section completion — complete all sections in a chapter to unlock the next chapter.

## 2. Tone-tracing canvas

The tone trainer uses a normalised 100×100 coordinate grid to stay device-independent. Raw touch coordinates are scaled to this grid before evaluation.

```text
(0,0)  ----------------------- (100,0)
       | Top Zone (Tones 1,2) |
       -----------------------
       | Mid Zone (Tone 3)    |
       -----------------------
       | Low Zone (Tones 4,6) |
(0,100)----------------------- (100,100)
```

### Input capture lifecycle

1. **Pointer down:** Capture `(xStart, yStart)`, begin sampling at ~60 fps
2. **Pointer move:** Append sampled points to tracking array
3. **Pointer up:** Capture `(xEnd, yEnd)`, compute deltas and slope, run evaluation

### Math

```
deltaX = xEnd - xStart
deltaY = yEnd - yStart
slope = deltaY / deltaX
```

**Note:** Screen coordinates increase downward, so upward movement produces a negative `deltaY`.

### Validation matrix

Thresholds are defined in `src/app/utility/tone-validation.utility.ts`.

| Tone | Label | Pass conditions |
| --- | --- | --- |
| 1 | High Flat | `yStart < 30 && yEnd < 30 && abs(slope) <= 0.2` |
| 2 | High Rising | `yStart > 40 && yEnd < 25 && slope <= -0.5` |
| 3 | Mid Flat | `35 < yStart < 65 && 35 < yEnd < 65 && abs(slope) <= 0.2` |
| 4 | Low Falling | `yStart < 60 && yEnd > 75 && slope >= 0.5` |
| 5 | Low Rising | `yStart > 75 && 45 < yEnd < 65 && slope <= -0.4` |
| 6 | Low Flat | `yStart > 70 && yEnd > 70 && abs(slope) <= 0.2` |

### Key functions

```typescript
// Scale raw device coordinates to the 100x100 virtual grid
normalizeCoordinate(raw: number, max: number): number

// Reject accidental taps shorter than minDistance (default 10 units)
isStrokeLongEnough(xStart, yStart, xEnd, yEnd, minDistance): boolean

// Evaluate a stroke against a target tone threshold
validateTone(xStart, yStart, xEnd, yEnd, targetTone, thresholds): boolean
```

## 3. Social Anxiety Meter

Instead of abstract score displays, mastery level drives contextual social-scenario feedback.

### Data-driven feedback tiers

Feedback profiles live inside each pack's `pack.json` under `feedbackProfiles`. Each profile contains tiers mapped to mastery thresholds.

```json
{
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
```

### Lookup algorithm (FeedbackService)

```typescript
getMatchingTier(tiers: SocialFeedbackTier[], level: number): SocialFeedbackTier | null {
	const sorted = [...tiers].sort((a, b) => b.minLevel - a.minLevel);
	for (const tier of sorted) {
		if (level >= tier.minLevel) return tier;
	}
	return sorted[sorted.length - 1] ?? null;
}
```

The returned tier contains transloco keys (`headlineKey`, `subtextKey`) that are resolved in templates from the merged i18n data.

### Example outcomes by mastery

| Level | Meter colour | Headline | Social scenario |
| --- | --- | --- | --- |
| >= 0.8 | `success` | True Hongkonger Speed! | Instant understanding, native-like fluency |
| 0.4–0.79 | `warning` | The English Pivot | Understood after a pause, reply in English |
| < 0.4 | `danger` | Complete Blank Stare | Misunderstood, English menu pointed at |

## 4. Mastery system

- **Correct answer:** Level increases by `0.1 * (1 + consecutiveCorrect * 0.05)` (capped at 1.0)
- **Incorrect answer:** Level decreases by 0.05 (floor at 0.0), consecutive counter resets
- Consecutive correct answers give a small bonus to reward streaks without punitive mechanics
- Mastery is persisted per card and never resets
