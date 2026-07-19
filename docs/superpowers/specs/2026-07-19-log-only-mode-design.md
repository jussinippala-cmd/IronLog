# Pelkkä loki -moodi (log-only mode) — design

Date: 2026-07-19
Status: approved (chat)

## Goal

A profile mode for users who want a pure workout logger: no suggested
programs or exercises. The user types the exercise name and logs
reps/weight with the existing set UI. Mode is chosen at onboarding or
switched later in settings.

## Decisions (made with user)

- Exercise entry: free-typed name with autocomplete from the user's *own*
  previously logged exercise names only. The built-in exercise library is
  not shown in log mode.
- Log mode hides program features: home shows "Start workout" + recent
  sessions, the Program tab is removed from the nav, no weight suggestions
  or progression logic. History tab and rest timer work as-is.
- Mode is switchable both ways in settings without data loss.
  Log → program runs the program onboarding questions; program → log keeps
  the program stored in the background. History is shared.

## Design

### Data

- `il_profile` gains `mode: 'program' | 'log'` (missing = `'program'`,
  so existing installs are unaffected).
- Sessions keep the current shape. Log-mode exercises have `name` and no
  `libId`; history rendering already supports this.
- Progress chart and PR grouping key becomes `libId || name` so typed
  exercises appear in Kehitys and Ennätykset too.

### Flow (log mode)

Home → "Aloita treeni" → existing workout view started empty
(free-workout machinery) with an "+ Lisää liike" input:
typing shows a native `<datalist>` of own past exercise names
(matching via pure `matchExerciseNames(names, query)` — case-insensitive
substring, current-session names excluded). Adding creates an ad-hoc
exercise; sets are logged with the existing UI (rest timer, session
resume, notes all work unchanged). If the same name was logged before,
the previous weight×reps prefill — own data, not a suggestion.

Finishing goes straight to the summary: the "save as template?" and
"count toward program?" questions are skipped (no program to advance;
templates are out of scope for log mode v1 — autocomplete covers
recurring exercises).

### Onboarding

New first step: "Valmis ohjelma" vs "Pelkkä loki". Log choice saves
`{mode:'log'}` and enters the app directly; program choice continues the
existing question flow (which saves `mode:'program'`).

### Settings

Mode switch control. Program → log: flips the flag. Log → program: if the
profile lacks program fields, navigate to onboarding (program questions);
otherwise just flip back.

### Out of scope

- Templates / custom workouts in log mode.
- Mid-workout exercise adding for program mode.

## Testing

- Unit tests: `matchExerciseNames` (substring match, case-insensitivity,
  exclusions, empty query), chart/PR grouping key fallback.
- Live browser check of both modes before deploying.
