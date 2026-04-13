# Design: Below-Minimum Reps with Red Visual Indicator

## Context

Users sometimes complete fewer reps than the prescribed minimum (e.g., 8 reps in a 10–15 range). Currently the app cycles down only to the minimum and then wraps to the maximum, making it impossible to log below-minimum reps. This spec adds support for logging 2 steps below the minimum, with a red color indicator so the user immediately sees the shortfall.

## Behaviour

**Cycling:** The rep cycle extends 2 steps below the minimum before wrapping back to the maximum.

Example for repRange `[10, 15]`:
```
15 → 14 → 13 → 12 → 11 → 10 → 9 → 8 → (wrap to 15)
```

**Red indicator:** Any rep count strictly below the minimum (`reps < repRange[0]`) is shown in red (`#e05555`) in both:
- The active rep button (before the set is marked done)
- The rep-display div (after the set is marked done)

Rep counts at or above the minimum use existing colours unchanged.

## Changes

### 1. `cycleReps(exId, idx, repRange)` — rivi ~1643

Current wrap condition:
```js
const next = (!sets[idx].reps || isNaN(current) || current <= lo) ? hi : current - 1;
```

New wrap condition (extend lower bound to `lo - 2`):
```js
const next = (!sets[idx].reps || isNaN(current) || current <= lo - 2) ? hi : current - 1;
```

DOM update block must also toggle `below-min` class on the button:
```js
btn.classList.toggle('below-min', parseInt(next) < lo);
```

### 2. `buildSetRowHTML(ex, si, set)` — rivi ~1791

**Rep button (active set):** add `below-min` to class string when applicable:
```js
const isBelowMin = set.reps && parseInt(set.reps) < ex.repRange[0];
const cls = 'rep-btn'
  + (isPlaceholder ? '' : ' has-val')
  + (isEditing ? ' editing' : '')
  + (isBelowMin ? ' below-min' : '');
```

**Rep display (done set):** add `below-min` class when applicable:
```js
const isBelowMin = set.reps && parseInt(set.reps) < ex.repRange[0];
repsCell = `<div class="rep-display${isBelowMin ? ' below-min' : ''}">${esc(set.reps)}</div>`;
```

### 3. CSS — new rules

Add after existing `.rep-btn` / `.rep-display` rules:

```css
.rep-btn.below-min { color: #e05555; }
.rep-display.below-min { color: #e05555; background: #e0555518; }
```

The `rep-display.below-min` background overrides the default gold background (`#d4a84618`) to keep the red tint consistent.

## Files Modified

- `index.html` — all changes (single-file app)
  - CSS block (~line 106)
  - `cycleReps()` (~line 1643)
  - `buildSetRowHTML()` (~line 1791)

## Verification

1. Open `index.html` in browser, start any workout
2. Click a rep button repeatedly — verify it cycles down past the minimum by 2 steps then wraps to max
3. Verify rep button text turns red when below minimum, normal colour at minimum and above
4. Mark a below-minimum set as done — verify `rep-display` shows red text and red-tinted background
5. Edit a done set — verify colour updates correctly when cycling back above minimum
