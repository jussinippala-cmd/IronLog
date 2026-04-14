# IronLog (Rautaloki)

> Your gym. Your rules.

**A minimalist Progressive Web App for tracking strength training — built entirely as a single HTML file with no frameworks, no backend, and no dependencies.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-gold?style=for-the-badge)](https://jussinippala-cmd.github.io/IronLog/)

---

## Live Demo

**[https://jussinippala-cmd.github.io/IronLog/](https://jussinippala-cmd.github.io/IronLog/)**

Open on mobile for the full experience — installable as a PWA directly from the browser.

---

## Features

- **Workout tracking** — Log sets, reps, and weights in real time during a session
- **Program management** — Create structured training blocks with multiple days and exercises
- **Free workout builder** — Build ad-hoc workouts outside of programs
- **Auto-progression** — Configurable weight/rep progression with fail streak tracking
- **Training history** — Review past sessions with progress charts, delete individual sessions
- **Rest timer** — Configurable rest timer between sets
- **Export / Import** — Download full workout history as CSV or import from file
- **Offline-first** — Fully functional without internet via Service Worker
- **Bilingual** — English and Finnish UI
- **PWA** — Installable on iOS/Android home screen, runs fullscreen

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| UI | Vanilla HTML/CSS/JS | Zero dependencies, maximum portability |
| Data | `localStorage` | No backend needed, offline-first by design |
| Offline | Service Worker | Full offline support and home screen install |
| i18n | Custom `t()` system | EN/FI without a library |
| Distribution | Single `index.html` | Deployable anywhere, sharable as a file |

No build step. No npm install. No framework lock-in.

---

## Screenshots

<!-- Add screenshots here -->
> Coming soon — or open the [live demo](https://jussinippala-cmd.github.io/IronLog/) to see it in action.

---

## Getting Started

Clone and open directly in a browser:

```bash
git clone https://github.com/jussinippala-cmd/IronLog.git
cd IronLog
open index.html
```

For the full PWA experience on iOS: Safari → **Share → Add to Home Screen**.

---

## Project Structure

```
index.html      # Entire app — HTML, CSS, and JS in one file (~2800 lines)
manifest.json   # PWA manifest
sw.js           # Service Worker (offline caching)
icons/          # App icons (192px, 512px, Apple touch)
```

---

## Data & Privacy

All data lives in the browser's `localStorage`. Nothing is sent to any server. Clearing browser data erases workout history — use **Settings → Export** to back up as CSV.

---

## License

Personal use.

Get that pump going.
