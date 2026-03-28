# Rautaloki

## Architecture
- Single-file HTML app: `rautaloki.html` (~2000 lines) — no build tools, no dependencies
- Runs locally on phone via Safari "Add to Home Screen" — no server, no app store
- All state in localStorage (keys prefixed `il_`)
- Rendering: manual DOM via `render()` → `app.innerHTML` — no framework
- App state in mutable `A` object; call `render()` after changes
- Partial DOM updates during workout (renderSetRow, updateProgress) to avoid flicker

## i18n
- Translation system: `T` object with `en`/`fi` keys, `t(key)` function
- Exercise names keyed by library ID (e.g. `lib_squat`), cues by `cue_lib_squat`
- Muscle groups: `muscle_Quads`, block themes: `theme_Barbell Compounds`, day labels: `day_Full Body A`, focuses: `focus_Squat · Push · Pull`
- Language stored in settings as `lang` ('en'|'fi'), default 'en'
- Exercise objects carry `libId` for cross-block history lookup and translation

## Key patterns
- `Ex(blockNum, libId, overrides)` builds exercise objects from LIBRARY — always includes `libId`
- `saveWeight(id, w, libId)` stores by both session ID and libId for cross-block continuity
- `getExerciseHistory(id, libId)` and `shouldIncrease(id, topRep, libId)` match by either ID
- Block rotation based on session count (`sessionsPerBlock()` = freq × 2), not calendar days
- Rest timer value 0 = disabled (use `!==undefined` checks, not `||` fallback)

## Gotchas
- Don't name local variables `t` — shadows the translation function `t()`
- `getRestDuration()` and Settings must use `!==undefined` for restSeconds (0 is valid = off)
- Old history entries may lack `libId` — always fall back to `ex.name` for display
- Exercise session IDs change per block (b1_squat → b2_squat) — use libId for cross-block lookups
- User's Finnish exercise translations are custom — check the T object, don't guess

## Language
- User communicates in Finnish, code comments and variable names in English
