# Loki-välilehden luettavuus ja yhtenäisyys — design

Date: 2026-07-19
Status: approved (chat)

## Goal

Two readability fixes on the history (Loki) tab:

1. The activity heatmap shows 16 weeks × 7 days but gives no clue which
   days/weeks the cells are — add ISO week numbers above each column and
   weekday labels (Ma–Su) on the left.
2. The workout session list looks different from every other section
   (Ennätykset, Kehitys, Kehonpaino are single collapsible cards; sessions
   are a bare header + separate cards) — unify it into one collapsible card
   with one row per session.

## Design

### Heatmap labels

- `isoWeekNumber(date)` extracted as a pure function into `logic.js`
  (unit-tested, incl. year-boundary cases). `getISOWeekKey` in `app.js`
  delegates to it so there is a single source of truth for week numbers.
- `buildHeatmapHTML()` renders:
  - a week-number cell (~8px, muted) at the top of every week column,
  - a fixed-width left column with weekday abbreviations for all 7 days.
- Weekday abbreviations via new i18n keys `dow_0`…`dow_6`
  (EN Mon…Sun, FI Ma…Su) in both `T.en` and `T.fi`.
- Layout stays flex-based; the label column stretches to the grid height so
  label rows align with the square cells (shared fixed-height header row).

### Unified sessions card

- The whole session list becomes one `.card` with the same collapsible
  header pattern as the other sections (sec-title + rotating ▼,
  `A.sessionsOpen`).
- Each session is a divider-separated row inside the card: day label left,
  date + block right, chevron. Tapping a row expands the existing detail
  view (duration/exercise/volume tags, per-exercise max weights, notes,
  delete button) below the row via the existing `toggleSession`.
- No data or behavior changes — only the framing.

## Testing

- Unit tests for `isoWeekNumber` (mid-year date, ISO week 1 spanning
  New Year, week-53 year).
- Visual check in browser before deploying (heatmap labels + sessions card,
  narrow viewport).
