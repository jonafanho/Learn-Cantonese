# Gameplay Mechanics

## 1. Narrative quest model

The MVP learning path is scenario-driven rather than vocabulary-list-driven.

- Act 1: HKIA arrival and taxi survival
- Act 2: Cha chaan teng ordering pressure
- Act 3: Wet market quantity and price handling

Each act is split into sections with card pools tied to practical speaking outcomes.

## 2. Tone-tracing canvas

The tone trainer uses a normalized 100x100 coordinate grid to stay device-independent.

```text
(0,0)  ----------------------- (100,0)
       | Top Zone (Tones 1,2) |
       -----------------------
       | Mid Zone (Tone 5)    |
       -----------------------
       | Low Zone (Tones 4,6) |
(0,100)----------------------- (100,100)
```

### Input capture lifecycle

1. Pointer down: capture `(xStart, yStart)` and start sampling.
2. Pointer move: append sampled points.
3. Pointer up: capture `(xEnd, yEnd)`, compute deltas and slope, evaluate.

Math:

- `deltaX = xEnd - xStart`
- `deltaY = yEnd - yStart`
- `slope = deltaY / deltaX`

Note: Screen coordinates increase downward, so upward movement has negative `deltaY`.

### Validation matrix

| Tone | Label | Pass conditions |
| --- | --- | --- |
| 1 | High Flat | `yStart < 30 && yEnd < 30 && abs(slope) <= 0.2` |
| 2 | High Rising | `yStart > 40 && yEnd < 25 && slope <= -0.5` |
| 3 | Mid Flat | `35 < yStart < 65 && 35 < yEnd < 65 && abs(slope) <= 0.2` |
| 4 | Low Falling | `yStart < 60 && yEnd > 75 && slope >= 0.5` |
| 5 | Low Rising | `yStart > 75 && 45 < yEnd < 65 && slope <= -0.4` |
| 6 | Low Flat | `yStart > 70 && yEnd > 70 && abs(slope) <= 0.2` |

### Robustness recommendations

- Guard divide-by-zero when `deltaX === 0`.
- Apply minimum stroke length threshold to avoid accidental taps.
- Consider tolerance windows per device DPI and finger jitter.
- Keep evaluator pure and deterministic for unit testing.

## 3. Social Anxiety Meter

The feedback layer maps mastery level to social-context outcomes.

```ts
export interface SocialFeedback {
  meterColor: "success" | "warning" | "danger";
  headline: string;
  subtext: string;
}

export function generateSocialFeedback(cardId: string, level: number): SocialFeedback {
  if (level >= 0.8) {
    return {
      meterColor: "success",
      headline: "True Hongkonger Speed!",
      subtext: "The local waiter processed your order instantly and moved to the next customer without breaking eye contact. Perfect tones."
    };
  } else if (level >= 0.4) {
    return {
      meterColor: "warning",
      headline: "The English Pivot",
      subtext: "The taxi driver understood your directions after a brief pause, but cleanly replied in fluent English to confirm. You survived, but your accent gave you away."
    };
  } else {
    return {
      meterColor: "danger",
      headline: "Complete Blank Stare",
      subtext: "The shopkeeper smiled politely, stepped backward, and pointed desperately toward the English-translated laminated menu board. Tones missed completely."
    };
  }
}
```

Design intent:

- Reinforce realism and emotional relevance
- Avoid punitive game loops
- Make progress legible without streak pressure

