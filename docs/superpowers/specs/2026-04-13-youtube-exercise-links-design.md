# Design Spec: YouTube Exercise Tutorial Links

**Date:** 2026-04-13  
**Status:** Approved  

---

## Overview

Add a small YouTube icon button next to each exercise name in the active workout card. Tapping the icon opens a curated tutorial video in a new browser tab. Links are hardcoded — users cannot add or edit them. Exercises without a link show no icon.

---

## Data Structure

A new `YOUTUBE` lookup object is added immediately after the `LIBRARY` constant (~line 274 in `index.html`):

```js
const YOUTUBE = {
  // Quads
  lib_squat:        "https://youtu.be/VIDEO_ID",
  lib_hack_squat:   "https://youtu.be/VIDEO_ID",
  lib_leg_press:    "https://youtu.be/VIDEO_ID",
  lib_leg_ext:      "https://youtu.be/VIDEO_ID",
  lib_split_squat:  "https://youtu.be/VIDEO_ID",
  lib_lunge:        "https://youtu.be/VIDEO_ID",
  lib_goblet_squat: "https://youtu.be/VIDEO_ID",
  lib_step_up:      "https://youtu.be/VIDEO_ID",
  lib_leg_press_n:  "https://youtu.be/VIDEO_ID",

  // Hamstrings
  lib_deadlift:     "https://youtu.be/VIDEO_ID",
  lib_rdl:          "https://youtu.be/VIDEO_ID",
  lib_trap_dl:      "https://youtu.be/VIDEO_ID",
  lib_sumo_dl:      "https://youtu.be/VIDEO_ID",
  lib_leg_curl:     "https://youtu.be/VIDEO_ID",
  lib_seated_curl:  "https://youtu.be/VIDEO_ID",
  lib_nordic:       "https://youtu.be/VIDEO_ID",
  lib_good_morning: "https://youtu.be/VIDEO_ID",

  // Glutes
  lib_hip_thrust:     "https://youtu.be/VIDEO_ID",
  lib_glute_bridge:   "https://youtu.be/VIDEO_ID",
  lib_cable_kickback: "https://youtu.be/VIDEO_ID",
  lib_abduction:      "https://youtu.be/VIDEO_ID",

  // Calves
  lib_standing_calf:  "https://youtu.be/VIDEO_ID",
  lib_seated_calf:    "https://youtu.be/VIDEO_ID",
  lib_leg_press_calf: "https://youtu.be/VIDEO_ID",

  // Chest
  lib_bench:          "https://youtu.be/VIDEO_ID",
  lib_incline_db:     "https://youtu.be/VIDEO_ID",
  lib_db_bench:       "https://youtu.be/VIDEO_ID",
  lib_cable_fly:      "https://youtu.be/VIDEO_ID",
  lib_pec_deck:       "https://youtu.be/VIDEO_ID",
  lib_db_pullover:    "https://youtu.be/VIDEO_ID",
  lib_dips:           "https://youtu.be/VIDEO_ID",
  lib_pushup_weighted:"https://youtu.be/VIDEO_ID",
  lib_low_cable_fly:  "https://youtu.be/VIDEO_ID",

  // Back
  lib_cable_row:      "https://youtu.be/VIDEO_ID",
  lib_db_row:         "https://youtu.be/VIDEO_ID",
  lib_chest_row:      "https://youtu.be/VIDEO_ID",
  lib_lat_pull:       "https://youtu.be/VIDEO_ID",
  lib_pullup:         "https://youtu.be/VIDEO_ID",
  lib_sa_cable_row:   "https://youtu.be/VIDEO_ID",
  lib_pullover_cable: "https://youtu.be/VIDEO_ID",
  lib_bb_row:         "https://youtu.be/VIDEO_ID",
  lib_tbar_row:       "https://youtu.be/VIDEO_ID",

  // Shoulders
  lib_ohp:            "https://youtu.be/VIDEO_ID",
  lib_db_ohp:         "https://youtu.be/VIDEO_ID",
  lib_lat_raise:      "https://youtu.be/VIDEO_ID",
  lib_cable_raise:    "https://youtu.be/VIDEO_ID",
  lib_face_pull:      "https://youtu.be/VIDEO_ID",
  lib_rear_delt:      "https://youtu.be/VIDEO_ID",
  lib_upright_row:    "https://youtu.be/VIDEO_ID",
  lib_arnold_press:   "https://youtu.be/VIDEO_ID",

  // Biceps
  lib_bb_curl:        "https://youtu.be/VIDEO_ID",
  lib_hammer:         "https://youtu.be/VIDEO_ID",
  lib_incline_curl:   "https://youtu.be/VIDEO_ID",
  lib_spider_curl:    "https://youtu.be/VIDEO_ID",
  lib_cable_curl:     "https://youtu.be/VIDEO_ID",
  lib_conc_curl:      "https://youtu.be/VIDEO_ID",
  lib_reverse_curl:   "https://youtu.be/VIDEO_ID",

  // Triceps
  lib_skull:          "https://youtu.be/VIDEO_ID",
  lib_pushdown:       "https://youtu.be/VIDEO_ID",
  lib_overhead_tri:   "https://youtu.be/VIDEO_ID",
  lib_dips_tri:       "https://youtu.be/VIDEO_ID",
  lib_kickback:       "https://youtu.be/VIDEO_ID",
  lib_close_bench:    "https://youtu.be/VIDEO_ID",
};
```

**Preferred video sources (implementation):** Jeff Nippard, Alan Thrall, Athlean-X, Renaissance Periodization — well-produced, science-based, no ads as first impression. For each exercise, pick a short-form (under 5 min) dedicated tutorial where possible.

---

## UI Change

**File:** `index.html`, function `buildExerciseCard()` (~line 1867)

**Current (line ~1895):**
```js
<div class="ex-title">${doneIcon}${esc(t(ex.libId||ex.name))}<span class="mtag">...</span></div>
```

**New:**
```js
const ytUrl = ex.libId && YOUTUBE[ex.libId];
const ytBtn = ytUrl
  ? `<a class="yt-btn" href="${ytUrl}" target="_blank" rel="noopener noreferrer" aria-label="${t('yt_aria')}">▶</a>`
  : '';

<div class="ex-title">${doneIcon}${esc(t(ex.libId||ex.name))}${ytBtn}<span class="mtag">...</span></div>
```

The icon is placed between the exercise name and the muscle tag, so the layout reads: `✓ Squat ▶ [Quads]`.

---

## CSS

New `.yt-btn` style added with existing styles:

```css
.yt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 6px;
  background: #FF0000;
  color: #fff;
  border-radius: 4px;
  font-size: 9px;
  text-decoration: none;
  vertical-align: middle;
  opacity: 0.85;
  transition: opacity 0.15s;
}
.yt-btn:hover { opacity: 1; }
```

Small red play-button badge — recognizable as YouTube, consistent with the app's gold-on-dark branding without clashing.

---

## Scope

| Context | YouTube icon shown? |
|---|---|
| Active workout `ex-card` | Yes (if link exists) |
| Swap modal | No |
| History view | No |
| Workout summary | No |
| Free workout (active, same `buildExerciseCard`) | Yes (if link exists) |

---

## i18n

- `aria-label` for the button: add `t('yt_aria')` key  
  - `en`: `"Watch tutorial"`  
  - `fi`: `"Katso ohjevideo"`  
- No other new strings needed.

---

## Out of Scope

- User-editable links
- Custom exercise YouTube links
- In-app video playback (embedded player)
- Link validation or fallback handling

---

## Implementation Steps

1. Research and fill all `VIDEO_ID` values in `YOUTUBE` object (use YouTube directly, prefer Jeff Nippard / Alan Thrall)
2. Add `YOUTUBE` constant after `LIBRARY` in `index.html`
3. Add `yt_aria` i18n keys to `T.en` and `T.fi`
4. Update `buildExerciseHTML()` to render `ytBtn`
5. Add `.yt-btn` CSS rule
6. Smoke-test on mobile viewport (icon size, tap target)
