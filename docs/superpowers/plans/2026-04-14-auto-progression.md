# Auto-Progression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automatic, percentage-based progressive overload to IronLog — pre-fill weight fields with last weight ± configurable %, track failure streaks, and deload -10% after 2 consecutive failures.

**Architecture:** All logic lives in `index.html` (single-file app). Fail streaks are persisted in a new localStorage key `"il_failstreaks"`. Progression % is stored inside the existing `"il_settings"` object. `buildInitialSets()` reads both to pre-fill weights. `finishWorkout()` and `confirmFreeWorkout()` update fail streaks at session end.

**Tech Stack:** Vanilla JS, localStorage, no frameworks or build tools.

---

## Critical context

- `index.html` is ~2931 lines, single file, no modules
- Existing `buildInitialSets()` at **line 1725** already applies a hardcoded 2.5% bump via `shouldIncrease()` and `Math.round(lw*1.025*2)/2`
- `finishWorkout()` at **line 1861**, `confirmFreeWorkout()` at **line 2864** — both save sessions
- `clearAllData()` at **line 2669** — must also clear fail streaks
- `SK` storage keys object at **line 360**
- `getSettings()` at **line 371**, `saveSetting()` at **line 372**
- i18n T.en settings strings at **line 566–582**, T.fi at **line 806–822**
- `viewSettings()` function starts at **line ~2505**

---

## Task 1: Add localStorage key and pure helper functions

**Files:**
- Modify: `index.html:360` (SK object)
- Modify: `index.html:371` (getSettings default)
- Modify: `index.html:373` (after saveSetting — insert new functions)

- [ ] **Step 1: Add `failStreaks` key to SK object (line 360)**

Find:
```js
const SK={weights:"il_weights",history:"il_history",nextDay:"il_nextDay",blockStart:"il_blockStart",blockIdx:"il_blockIdx",customWorkouts:"il_customworkouts",wupGoal:"il_wup_goal",wupWeek:"il_wup_week",wupAnchor:"il_wup_anchor"};
```
Replace with:
```js
const SK={weights:"il_weights",history:"il_history",nextDay:"il_nextDay",blockStart:"il_blockStart",blockIdx:"il_blockIdx",customWorkouts:"il_customworkouts",wupGoal:"il_wup_goal",wupWeek:"il_wup_week",wupAnchor:"il_wup_anchor",failStreaks:"il_failstreaks"};
```

- [ ] **Step 2: Add helper functions after `getRestDuration()` (after line ~374)**

Find:
```js
function getRestDuration(){const s=getSettings();return s.restSeconds!==undefined?s.restSeconds:90;}
```
Replace with:
```js
function getRestDuration(){const s=getSettings();return s.restSeconds!==undefined?s.restSeconds:90;}
function roundToHalf(w){return Math.round(w/0.5)*0.5;}
function getProgressionPct(){const s=getSettings();return s.progressionPct!==undefined?s.progressionPct:2.5;}
function getFailStreak(libId){const fs=ls.get(SK.failStreaks)||{};return fs[libId]||0;}
function updateFailStreak(libId,succeeded){
  if(!libId)return;
  const fs=ls.get(SK.failStreaks)||{};
  if(succeeded){fs[libId]=0;}else{fs[libId]=(fs[libId]||0)+1;}
  ls.set(SK.failStreaks,fs);
}
```

- [ ] **Step 3: Verify in browser console**

Open `index.html` in browser. Run in DevTools console:
```js
console.log(SK.failStreaks);         // "il_failstreaks"
console.log(roundToHalf(82.3));      // 82.5
console.log(roundToHalf(82.1));      // 82
console.log(getProgressionPct());    // 2.5
console.log(getFailStreak("squat")); // 0
updateFailStreak("squat", false);
console.log(getFailStreak("squat")); // 1
updateFailStreak("squat", false);
console.log(getFailStreak("squat")); // 2
updateFailStreak("squat", true);
console.log(getFailStreak("squat")); // 0
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add progression helpers (roundToHalf, getProgressionPct, fail streak)"
```

---

## Task 2: Update `buildInitialSets()` to use configurable % and fail streak deload

**Files:**
- Modify: `index.html:1731` (weight calculation line inside `buildInitialSets`)

- [ ] **Step 1: Find and update the weight calculation**

Find (line 1731):
```js
    const w=lw?String(deload?Math.round(lw*0.6*2)/2:(bump?Math.round(lw*1.025*2)/2:lw)):"";
```
Replace with:
```js
    const pct=getProgressionPct();
    const failDeload=!deload&&getFailStreak(ex.libId||ex.id)>=2;
    const w=lw?String(
      deload?roundToHalf(lw*0.6):
      failDeload?roundToHalf(lw*0.9):
      bump?roundToHalf(lw*(1+pct/100)):
      lw
    ):"";
```

- [ ] **Step 2: Verify in browser console**

Set up a scenario:
```js
// Simulate fail streak >= 2 for "squat" (use a real libId from your exercise library)
updateFailStreak("lib_squat", false);
updateFailStreak("lib_squat", false);
console.log(getFailStreak("lib_squat")); // 2
```
Then start a program workout that includes squat. Check that the weight field pre-fills with approximately `lastWeight × 0.9` (rounded to 0.5kg).

Also verify: when failStreak is 0 and `shouldIncrease` is true, weight shows `lastWeight × 1.025` (or current progressionPct).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: use configurable progression % and fail streak deload in buildInitialSets"
```

---

## Task 3: Update `finishWorkout()` to track fail streaks per exercise

**Files:**
- Modify: `index.html:1886–1888` (inside `finishWorkout`, after history is saved)
- Modify: `index.html:2874–2876` (inside `confirmFreeWorkout`, after history is saved)

- [ ] **Step 1: Add fail streak update in `finishWorkout()` (after line 1887)**

Find:
```js
  A.history=[...A.history,session];
  ls.set(SK.history,A.history);
  advanceDay(A.activeDayId);
```
Replace with:
```js
  A.history=[...A.history,session];
  ls.set(SK.history,A.history);
  A.sessionExercises.forEach(ex=>{
    const sets=A.sessionSets[ex.id]||[];
    const targetReps=ex.wupTargetReps||ex.repRange[1];
    const succeeded=sets.length>0&&sets.every(s=>parseInt(s.reps)>=targetReps);
    updateFailStreak(ex.libId||ex.id,succeeded);
  });
  advanceDay(A.activeDayId);
```

- [ ] **Step 2: Add fail streak update in `confirmFreeWorkout()` (after the history save)**

Find (around line 2874):
```js
    A.history=[...A.history,s];
    ls.set(SK.history,A.history);
```
Replace with:
```js
    A.history=[...A.history,s];
    ls.set(SK.history,A.history);
    A.sessionExercises.forEach(ex=>{
      const sets=A.sessionSets[ex.id]||[];
      const targetReps=ex.wupTargetReps||ex.repRange[1];
      const succeeded=sets.length>0&&sets.every(s=>parseInt(s.reps)>=targetReps);
      updateFailStreak(ex.libId||ex.id,succeeded);
    });
```

- [ ] **Step 3: Verify in browser console**

Complete a full workout with one exercise. After clicking Finish:
```js
const fs = ls.get("il_failstreaks");
console.log(fs); // Should show { [libId]: 0 } if all reps hit target, or { [libId]: 1 } if not
```

Do a second workout, fail the same exercise. Check failStreak becomes 2.
Start a third workout: the weight field should pre-fill with `lastWeight × 0.9`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: update fail streaks per exercise on session completion"
```

---

## Task 4: Add i18n strings for progression settings

**Files:**
- Modify: `index.html` — T.en block (around line 578), T.fi block (around line 818)

- [ ] **Step 1: Add EN strings to T.en (after line 578, inside the settings section)**

Find:
```js
settings_how_6:"↑ LOAD",settings_how_6b:"means you hit top reps last time — try adding 2.5% weight.",
```
Replace with:
```js
settings_how_6:"↑ LOAD",settings_how_6b:"means you hit top reps last time — try adding weight.",
settings_progression_title:"Auto-Progression",settings_progression_desc:"Weight increase after hitting all reps. Failure twice in a row triggers a 10% deload.",settings_progression_pct:"Increment (%)",
```

- [ ] **Step 2: Add FI strings to T.fi (after line 818, inside the settings section)**

Find:
```js
settings_how_6:"↑ NOSTA",settings_how_6b:"tarkoittaa, että teit maksimireppit viimeksi — kokeile 2.5% lisäpainoa.",
```
Replace with:
```js
settings_how_6:"↑ NOSTA",settings_how_6b:"tarkoittaa, että teit maksimireppit viimeksi — kokeile lisäpainoa.",
settings_progression_title:"Automaattinen progressio",settings_progression_desc:"Paino nousee kun teet kaikki toistot. Kaksi peräkkäistä epäonnistumista laukaisee 10% deloadin.",settings_progression_pct:"Nousu (%)",
```

- [ ] **Step 3: Verify**

In browser console:
```js
setLang('en'); t('settings_progression_title'); // "Auto-Progression"
setLang('fi'); t('settings_progression_title'); // "Automaattinen progressio"
setLang('fi'); t('settings_progression_pct');   // "Nousu (%)"
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "i18n: add progression settings strings to T.en and T.fi"
```

---

## Task 5: Add Progression % setting to settings view

**Files:**
- Modify: `index.html` — `viewSettings()` function body (around line 2566)
- Modify: `index.html` — add `setProgressionPct()` function (near `setRestTimer()` around line 2593)

- [ ] **Step 1: Add `setProgressionPct()` handler function**

Find:
```js
function setRestTimer(sec){
  saveSetting('restSeconds',sec);
  render();
}
```
Add BEFORE it:
```js
function setProgressionPct(pct){
  const v=parseFloat(pct);
  if(!isNaN(v)&&v>0&&v<=20)saveSetting('progressionPct',v);
}
```

- [ ] **Step 2: Add progression section to `viewSettings()` HTML**

Find (the WUP goal section, around line 2567):
```js
    <div class="sec-title" style="margin-top:20px">${t('wup_goal_title')}</div>
```
Add BEFORE it:
```js
    <div class="sec-title" style="margin-top:20px">${t('settings_progression_title')}</div>
    <div class="card">
      <div style="font-size:13px;color:#9090b0;margin-bottom:10px">${t('settings_progression_desc')}</div>
      <div style="display:flex;align-items:center;gap:12px">
        <label style="font-size:13px;color:#f2f0ea;flex:1">${t('settings_progression_pct')}</label>
        <input type="number" min="0.5" max="20" step="0.5"
          style="width:70px;background:#0a0a18;border:1px solid #333;border-radius:8px;color:#d4a846;padding:8px;font-size:15px;font-weight:700;text-align:center;font-family:inherit"
          value="${getProgressionPct()}"
          onchange="setProgressionPct(this.value)">
      </div>
    </div>

```

- [ ] **Step 3: Verify in browser**

Navigate to Settings. Confirm a "Auto-Progression" / "Automaattinen progressio" card appears with a number input showing 2.5.

Change the value to 5. Check:
```js
getProgressionPct(); // 5
ls.get("il_settings").progressionPct; // 5
```

Start a new workout where `shouldIncrease` would be true for an exercise. Confirm the pre-filled weight is now ~5% higher than last weight (rounded to 0.5kg).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add progression % setting to settings view"
```

---

## Task 6: Reset fail streaks in `clearAllData()`

**Files:**
- Modify: `index.html:2672–2682` (`clearAllData()` body)

- [ ] **Step 1: Add fail streak removal**

Find:
```js
  localStorage.removeItem(SK.wupGoal);
  localStorage.removeItem(SK.wupWeek);
  localStorage.removeItem(SK.wupAnchor);
  localStorage.removeItem("il_settings");
  localStorage.removeItem("il_profile");
```
Replace with:
```js
  localStorage.removeItem(SK.wupGoal);
  localStorage.removeItem(SK.wupWeek);
  localStorage.removeItem(SK.wupAnchor);
  localStorage.removeItem(SK.failStreaks);
  localStorage.removeItem("il_settings");
  localStorage.removeItem("il_profile");
```

- [ ] **Step 2: Verify**

```js
updateFailStreak("lib_squat", false);
updateFailStreak("lib_squat", false);
console.log(getFailStreak("lib_squat")); // 2
```
Then in Settings → Reset All Data → confirm. After re-onboarding:
```js
ls.get("il_failstreaks"); // null
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: clear fail streaks when resetting all data"
```

---

## End-to-end Verification

After all tasks complete, run this full flow:

1. **Success path:** Complete a workout with squat, hit all reps. Start next session → squat weight = `lastWeight × (1 + progressionPct/100)`, rounded to 0.5kg.

2. **Single failure:** Fail squat reps once. Start next session → squat weight = same as last session.

3. **Double failure deload:** Fail squat reps in two consecutive sessions. Start next session → squat weight = `lastWeight × 0.9`, rounded to 0.5kg.

4. **Configurable %:** Set progression to 5% in settings. Complete a successful workout → next session shows ~5% increase.

5. **i18n:** Switch to Finnish. Settings shows "Automaattinen progressio" and "Nousu (%)". Switch to English → "Auto-Progression" and "Increment (%)".

6. **WUP deload week takes priority:** When it's WUP deload week (week 4), weight shows 60% regardless of fail streak or progression.

7. **Reset clears fail streaks:** Reset all data → `localStorage.getItem("il_failstreaks")` is `null`.
