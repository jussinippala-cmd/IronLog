# YouTube Exercise Tutorial Links — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small red ▶ YouTube icon next to each exercise name in the active workout card that opens a curated tutorial video in a new tab.

**Architecture:** A new `YOUTUBE` lookup object (keyed by `libId`) lives after `LIBRARY` in `index.html`. `buildExerciseCard()` checks `YOUTUBE[ex.libId]` and renders an `<a class="yt-btn">` element if a URL exists. No changes to LIBRARY, storage, or any view other than the active workout card.

**Tech Stack:** Vanilla JS, single `index.html` PWA, no build step, no test framework — verification is manual in-browser.

---

### Task 1: Research YouTube video URLs for all exercises

**Files:**
- Produce: a list of 60+ `libId → YouTube URL` pairs (used verbatim in Task 2)

This task requires manual YouTube searches. Open YouTube and search for each exercise below. Prefer **Jeff Nippard**, **Alan Thrall**, **Athlean-X**, or **Renaissance Periodization** (RP Strength) — pick the shortest, most focused tutorial (under 5 min if possible, must show full technique). Copy the full `https://youtu.be/VIDEOID` short URL.

**Search queries by group:**

**Quads**
- `lib_squat` → search: `"Jeff Nippard squat tutorial"` or `"Alan Thrall how to squat"`
- `lib_hack_squat` → search: `"hack squat form tutorial Jeff Nippard"`
- `lib_leg_press` → search: `"leg press form tutorial"`
- `lib_leg_press_n` → same as `lib_leg_press` (narrow stance variation — same video acceptable)
- `lib_leg_ext` → search: `"leg extension form tutorial Jeff Nippard"`
- `lib_split_squat` → search: `"Bulgarian split squat tutorial Jeff Nippard"`
- `lib_lunge` → search: `"walking lunge form tutorial"`
- `lib_goblet_squat` → search: `"goblet squat tutorial"`
- `lib_step_up` → search: `"step up exercise tutorial"`

**Hamstrings**
- `lib_deadlift` → search: `"Jeff Nippard deadlift tutorial"` or `"Alan Thrall how to deadlift"`
- `lib_rdl` → search: `"Romanian deadlift tutorial Jeff Nippard"`
- `lib_trap_dl` → search: `"trap bar deadlift tutorial"`
- `lib_sumo_dl` → search: `"sumo deadlift tutorial Jeff Nippard"`
- `lib_leg_curl` → search: `"lying leg curl form tutorial"`
- `lib_seated_curl` → search: `"seated leg curl form tutorial"`
- `lib_nordic` → search: `"Nordic curl tutorial"`
- `lib_good_morning` → search: `"good morning exercise tutorial"`

**Glutes**
- `lib_hip_thrust` → search: `"Jeff Nippard hip thrust tutorial"`
- `lib_glute_bridge` → search: `"barbell glute bridge form tutorial"`
- `lib_cable_kickback` → search: `"cable kickback tutorial glutes"`
- `lib_abduction` → search: `"hip abduction machine tutorial"`

**Calves**
- `lib_standing_calf` → search: `"standing calf raise form tutorial"`
- `lib_seated_calf` → search: `"seated calf raise form tutorial"`
- `lib_leg_press_calf` → search: `"leg press calf raise tutorial"`

**Chest**
- `lib_bench` → search: `"Jeff Nippard bench press tutorial"`
- `lib_incline_db` → search: `"incline dumbbell press tutorial Jeff Nippard"`
- `lib_db_bench` → search: `"dumbbell bench press tutorial"`
- `lib_cable_fly` → search: `"cable fly tutorial chest"`
- `lib_pec_deck` → search: `"pec deck machine form tutorial"`
- `lib_db_pullover` → search: `"dumbbell pullover tutorial"`
- `lib_dips` → search: `"dips chest focus form tutorial"`
- `lib_pushup_weighted` → search: `"weighted push-up tutorial"`
- `lib_low_cable_fly` → search: `"low to high cable fly tutorial chest"`

**Back**
- `lib_cable_row` → search: `"cable row form tutorial Jeff Nippard"`
- `lib_db_row` → search: `"dumbbell row tutorial Jeff Nippard"`
- `lib_chest_row` → search: `"chest supported row tutorial"`
- `lib_lat_pull` → search: `"lat pulldown form tutorial Jeff Nippard"`
- `lib_pullup` → search: `"pull-up chin-up tutorial Jeff Nippard"`
- `lib_sa_cable_row` → search: `"single arm cable row tutorial"`
- `lib_pullover_cable` → search: `"cable straight arm pullover tutorial"`
- `lib_bb_row` → search: `"barbell row tutorial Jeff Nippard"`
- `lib_tbar_row` → search: `"T-bar row tutorial"`

**Shoulders**
- `lib_ohp` → search: `"overhead press tutorial Jeff Nippard"`
- `lib_db_ohp` → search: `"dumbbell shoulder press tutorial"`
- `lib_lat_raise` → search: `"lateral raise tutorial Jeff Nippard"`
- `lib_cable_raise` → search: `"cable lateral raise tutorial"`
- `lib_face_pull` → search: `"face pull tutorial Athlean-X"`
- `lib_rear_delt` → search: `"rear delt fly tutorial"`
- `lib_upright_row` → search: `"upright row tutorial"`
- `lib_arnold_press` → search: `"Arnold press tutorial"`

**Biceps**
- `lib_bb_curl` → search: `"barbell curl form tutorial"`
- `lib_hammer` → search: `"hammer curl tutorial"`
- `lib_incline_curl` → search: `"incline dumbbell curl tutorial"`
- `lib_spider_curl` → search: `"spider curl tutorial"`
- `lib_cable_curl` → search: `"cable curl tutorial"`
- `lib_conc_curl` → search: `"concentration curl tutorial"`
- `lib_reverse_curl` → search: `"reverse curl tutorial brachialis"`

**Triceps**
- `lib_skull` → search: `"skullcrusher tutorial Jeff Nippard"`
- `lib_pushdown` → search: `"cable pushdown tricep tutorial"`
- `lib_overhead_tri` → search: `"overhead tricep extension tutorial"`
- `lib_dips_tri` → search: `"tricep dips form tutorial"`
- `lib_kickback` → search: `"dumbbell kickback tricep tutorial"`
- `lib_close_bench` → search: `"close grip bench press tutorial"`

- [ ] **Step 1:** For each exercise above, open YouTube and find the best matching tutorial. Copy the short URL (`https://youtu.be/XXXXXXXXX`).

- [ ] **Step 2:** Paste all URLs into a scratch list — you'll use them verbatim in Task 2.

---

### Task 2: Add the YOUTUBE constant to index.html

**Files:**
- Modify: `index.html` (after line 273, i.e. after the closing `};` of `LIBRARY`)

- [ ] **Step 1:** Open `index.html`. Find line 273 (`};` closing `LIBRARY`). Insert the following block immediately after it (line 274), using the URLs gathered in Task 1:

```js
// ═══════════════════════════════════════════════════════════════════
// YOUTUBE — tutorial video links keyed by libId
// ═══════════════════════════════════════════════════════════════════
const YOUTUBE={
  // Quads
  lib_squat:        "https://youtu.be/TASK1_URL",
  lib_hack_squat:   "https://youtu.be/TASK1_URL",
  lib_leg_press:    "https://youtu.be/TASK1_URL",
  lib_leg_press_n:  "https://youtu.be/TASK1_URL",
  lib_leg_ext:      "https://youtu.be/TASK1_URL",
  lib_split_squat:  "https://youtu.be/TASK1_URL",
  lib_lunge:        "https://youtu.be/TASK1_URL",
  lib_goblet_squat: "https://youtu.be/TASK1_URL",
  lib_step_up:      "https://youtu.be/TASK1_URL",
  // Hamstrings
  lib_deadlift:     "https://youtu.be/TASK1_URL",
  lib_rdl:          "https://youtu.be/TASK1_URL",
  lib_trap_dl:      "https://youtu.be/TASK1_URL",
  lib_sumo_dl:      "https://youtu.be/TASK1_URL",
  lib_leg_curl:     "https://youtu.be/TASK1_URL",
  lib_seated_curl:  "https://youtu.be/TASK1_URL",
  lib_nordic:       "https://youtu.be/TASK1_URL",
  lib_good_morning: "https://youtu.be/TASK1_URL",
  // Glutes
  lib_hip_thrust:     "https://youtu.be/TASK1_URL",
  lib_glute_bridge:   "https://youtu.be/TASK1_URL",
  lib_cable_kickback: "https://youtu.be/TASK1_URL",
  lib_abduction:      "https://youtu.be/TASK1_URL",
  // Calves
  lib_standing_calf:  "https://youtu.be/TASK1_URL",
  lib_seated_calf:    "https://youtu.be/TASK1_URL",
  lib_leg_press_calf: "https://youtu.be/TASK1_URL",
  // Chest
  lib_bench:           "https://youtu.be/TASK1_URL",
  lib_incline_db:      "https://youtu.be/TASK1_URL",
  lib_db_bench:        "https://youtu.be/TASK1_URL",
  lib_cable_fly:       "https://youtu.be/TASK1_URL",
  lib_pec_deck:        "https://youtu.be/TASK1_URL",
  lib_db_pullover:     "https://youtu.be/TASK1_URL",
  lib_dips:            "https://youtu.be/TASK1_URL",
  lib_pushup_weighted: "https://youtu.be/TASK1_URL",
  lib_low_cable_fly:   "https://youtu.be/TASK1_URL",
  // Back
  lib_cable_row:      "https://youtu.be/TASK1_URL",
  lib_db_row:         "https://youtu.be/TASK1_URL",
  lib_chest_row:      "https://youtu.be/TASK1_URL",
  lib_lat_pull:       "https://youtu.be/TASK1_URL",
  lib_pullup:         "https://youtu.be/TASK1_URL",
  lib_sa_cable_row:   "https://youtu.be/TASK1_URL",
  lib_pullover_cable: "https://youtu.be/TASK1_URL",
  lib_bb_row:         "https://youtu.be/TASK1_URL",
  lib_tbar_row:       "https://youtu.be/TASK1_URL",
  // Shoulders
  lib_ohp:         "https://youtu.be/TASK1_URL",
  lib_db_ohp:      "https://youtu.be/TASK1_URL",
  lib_lat_raise:   "https://youtu.be/TASK1_URL",
  lib_cable_raise: "https://youtu.be/TASK1_URL",
  lib_face_pull:   "https://youtu.be/TASK1_URL",
  lib_rear_delt:   "https://youtu.be/TASK1_URL",
  lib_upright_row: "https://youtu.be/TASK1_URL",
  lib_arnold_press:"https://youtu.be/TASK1_URL",
  // Biceps
  lib_bb_curl:     "https://youtu.be/TASK1_URL",
  lib_hammer:      "https://youtu.be/TASK1_URL",
  lib_incline_curl:"https://youtu.be/TASK1_URL",
  lib_spider_curl: "https://youtu.be/TASK1_URL",
  lib_cable_curl:  "https://youtu.be/TASK1_URL",
  lib_conc_curl:   "https://youtu.be/TASK1_URL",
  lib_reverse_curl:"https://youtu.be/TASK1_URL",
  // Triceps
  lib_skull:        "https://youtu.be/TASK1_URL",
  lib_pushdown:     "https://youtu.be/TASK1_URL",
  lib_overhead_tri: "https://youtu.be/TASK1_URL",
  lib_dips_tri:     "https://youtu.be/TASK1_URL",
  lib_kickback:     "https://youtu.be/TASK1_URL",
  lib_close_bench:  "https://youtu.be/TASK1_URL",
};
```

- [ ] **Step 2:** Verify in browser console that `YOUTUBE['lib_squat']` returns a URL (open DevTools → Console → type `YOUTUBE['lib_squat']`).

- [ ] **Step 3:** Commit:
```bash
git add index.html
git commit -m "feat: add YOUTUBE lookup table with exercise tutorial links"
```

---

### Task 3: Add i18n keys for the button's aria-label

**Files:**
- Modify: `index.html` lines 524 and 755 (end of `T.en` and `T.fi` blocks)

The `T.en` block ends at line 524 (`reps_prev_low:"↓ prev.",`).  
The `T.fi` block ends at line 755 (`reps_prev_low:"↓ ed.",`).

- [ ] **Step 1:** In `T.en`, add `yt_aria` after `reps_prev_low` (line 524). Change:
```js
reps_prev_low:"↓ prev.",
},
fi:{
```
to:
```js
reps_prev_low:"↓ prev.",
yt_aria:"Watch tutorial",
},
fi:{
```

- [ ] **Step 2:** In `T.fi`, add `yt_aria` after `reps_prev_low` (line 755). Change:
```js
reps_prev_low:"↓ ed.",
}
};
```
to:
```js
reps_prev_low:"↓ ed.",
yt_aria:"Katso ohjevideo",
}
};
```

- [ ] **Step 3:** Verify in console: `t('yt_aria')` returns `"Watch tutorial"` (EN) or switch language and check it returns `"Katso ohjevideo"` (FI).

- [ ] **Step 4:** Commit:
```bash
git add index.html
git commit -m "feat: add yt_aria i18n key for YouTube button aria-label"
```

---

### Task 4: Add .yt-btn CSS

**Files:**
- Modify: `index.html` (CSS section, near line 27 where `.ex-card` is defined)

- [ ] **Step 1:** Find `.ex-card{animation:slideUp .25s ease both}` (~line 27). Add the new rule immediately after it:

Change:
```css
.ex-card{animation:slideUp .25s ease both}
.pop-in{animation:pop .35s ease}
```
to:
```css
.ex-card{animation:slideUp .25s ease both}
.yt-btn{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;margin-left:6px;background:#FF0000;color:#fff;border-radius:4px;font-size:9px;text-decoration:none;vertical-align:middle;opacity:0.85;transition:opacity .15s}
.yt-btn:hover{opacity:1}
.pop-in{animation:pop .35s ease}
```

- [ ] **Step 2:** Open the app in browser. Start a workout, confirm no visual change yet (YOUTUBE icon won't appear until Task 5).

- [ ] **Step 3:** Commit:
```bash
git add index.html
git commit -m "feat: add .yt-btn CSS for YouTube tutorial icon"
```

---

### Task 5: Render the YouTube icon in buildExerciseCard()

**Files:**
- Modify: `index.html`, function `buildExerciseCard()` (~line 1867)

- [ ] **Step 1:** Find line 1880 inside `buildExerciseCard()`:
```js
  const cueText=t('cue_'+(ex.libId||''))||esc(ex.cues);
```
Add two new lines directly after it:
```js
  const ytUrl=ex.libId&&YOUTUBE[ex.libId];
  const ytBtn=ytUrl?`<a class="yt-btn" href="${ytUrl}" target="_blank" rel="noopener noreferrer" aria-label="${t('yt_aria')}">▶</a>`:'';
```

- [ ] **Step 2:** Find line 1895:
```js
        <div class="ex-title">${doneIcon}${esc(t(ex.libId||ex.name))}<span class="mtag">${esc(t('muscle_'+ex.muscle))}</span></div>
```
Change it to:
```js
        <div class="ex-title">${doneIcon}${esc(t(ex.libId||ex.name))}${ytBtn}<span class="mtag">${esc(t('muscle_'+ex.muscle))}</span></div>
```

- [ ] **Step 3:** Open the app in browser. Start a workout (or free workout with a library exercise). Verify:
  - Red ▶ badge appears to the right of the exercise name
  - Badge is NOT shown for custom exercises (non-library, no `libId` in YOUTUBE)
  - Tapping the icon opens the correct YouTube video in a new tab
  - Badge does NOT appear in swap modal, history view, or workout summary

- [ ] **Step 4:** Check on mobile viewport (DevTools → Toggle device toolbar, 390px width). Confirm:
  - Icon doesn't overflow the row
  - Tap target is large enough (badge is 22×22px, acceptable for mobile)

- [ ] **Step 5:** Commit:
```bash
git add index.html
git commit -m "feat: show YouTube tutorial icon on exercise cards"
```
