# PR Tracker — Design Spec

**Date:** 2026-04-19
**Status:** Approved

## Overview

Add a Personal Records (PR) gallery to the History view in IronLog. Shows each user's best weight per exercise, grouped by muscle group, alongside an estimated 1RM. Calculated on-the-fly from localStorage history — no separate storage.

---

## Requirements

- **What counts as a PR:** Highest weight ever logged for a given exercise (any rep count)
- **Estimated 1RM:** Displayed alongside, calculated with Epley formula: `weight × (1 + reps / 30)`, rounded to nearest integer
- **Filtering:** Only exercises done in **2 or more sessions** (removes one-off attempts)
- **Grouping:** By muscle group using existing `MUSCLE_ORDER` constant
- **Location:** History view — between weekly volume section and progress chart
- **Storage:** None — computed fresh on every `viewHistory()` render

---

## Data Layer

### `getPRs()` — new function

Added to the Progress Calculations block (~line 1537 in `index.html`), alongside `getWeeklySetsByMuscle()` and `getProgressData()`.

```javascript
function getPRs() {
  const counts = {};
  const bests  = {};
  A.history.forEach(session => {
    (session.exercises || []).forEach(ex => {
      if (!ex.libId) return;
      counts[ex.libId] = (counts[ex.libId] || 0) + 1;
      (ex.sets || []).forEach(st => {
        const w = parseFloat(st.weight) || 0;
        const r = parseInt(st.reps) || 0;
        if (w > 0 && r > 0) {
          if (!bests[ex.libId] || w > bests[ex.libId].weight) {
            bests[ex.libId] = { weight: w, reps: r, muscle: ex.muscle, date: session.date };
          }
        }
      });
    });
  });
  return Object.entries(bests)
    .filter(([libId]) => (counts[libId] || 0) >= 2)
    .map(([libId, b]) => ({
      libId,
      weight: b.weight,
      reps: b.reps,
      est1rm: Math.round(b.weight * (1 + b.reps / 30)),
      muscle: b.muscle,
      date: b.date
    }));
}
```

**Returns:** Array of PR objects. Empty array if no qualifying exercises.

---

## UI

### PR card in `viewHistory()`

Rendered after `weeklySection` and before `chartSection`. Only rendered when `getPRs()` returns at least one result.

**Structure:**
- Card header: `🏆 ENNÄTYKSET` / `🏆 PERSONAL RECORDS`
- Muscle group label (gold, uppercase, same style as elsewhere in app)
- Per exercise row: name left, `[weight]kg × [reps]` + `est. 1RM [X]kg` right
- Muscle groups follow existing `MUSCLE_ORDER`: Quads, Hamstrings, Glutes, Calves, Chest, Back, Shoulders, Biceps, Triceps
- Exercises without a known muscle group shown last under "Other"

**Visual style:**
- Exercise name: `color:#9090b0`, `font-size:13px`
- Weight + reps: `color:#f2f0ea`, `font-weight:700`, `font-size:14px`
- Estimated 1RM: `color:#d4a846`, `font-weight:700`, `font-size:10px`
- Muscle group label: `color:#d4a846`, `font-size:10px`, uppercase, `letter-spacing:.12em`
- Row separator: `border-top:1px solid #1c1c2e`

---

## i18n

New keys added to `T.en` and `T.fi`:

| Key | EN | FI |
|---|---|---|
| `pr_title` | `"Personal Records"` | `"Ennätykset"` |
| `pr_est_1rm` | `"est. 1RM"` | `"est. 1RM"` |

---

## Files Modified

- `/Users/jussinippala/Claude/projects/IronLog/index.html`
  - `T.en` — add `pr_title`, `pr_est_1rm`
  - `T.fi` — add `pr_title`, `pr_est_1rm`
  - Progress Calculations block (~line 1537) — add `getPRs()`
  - `viewHistory()` — add PR card between `weeklySection` and `chartSection`

---

## Estimated Scope

~70 new lines. No schema changes, no new localStorage keys.

---

## Verification

1. Log 1 session with Bench Press → PR gallery should NOT show Bench (only 1 session)
2. Log 2 sessions with Bench Press at different weights → PR gallery shows the higher weight
3. Verify est. 1RM: 100kg × 5 reps → Epley = `100 × (1 + 5/30)` = 117kg
4. Change language EN↔FI → section title and labels update correctly
5. Clear all data → PR gallery disappears (no qualifying exercises)
6. Import CSV with 2+ sessions per exercise → PR gallery populates correctly
