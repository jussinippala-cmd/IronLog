# Rautaloki

> Your gym. Your rules.

A minimalist Progressive Web App (PWA) for tracking strength training workouts. Built as a single HTML file — no backend, no build tools, no dependencies to install.

## Features

- **Workout tracking** — Log sets, reps, and weights in real time
- **Program management** — Create and follow training blocks with multiple days
- **Training history** — Review past sessions with progress charts, delete individual sessions
- **Rest timer** — Configurable rest timer between sets
- **Export / Import** — Download workout history as CSV or import from file
- **Offline-first** — Works without internet via Service Worker
- **Bilingual** — English and Finnish UI
- **PWA** — Installable on iOS/Android home screen, runs fullscreen

## Stack

- Vanilla HTML/CSS/JavaScript — zero frameworks
- `localStorage` for all data persistence
- Service Worker for offline support

## Usage

Open `index.html` in a browser. On iOS Safari, tap **Share → Add to Home Screen** for the full app experience.

Or host it on GitHub Pages / Netlify and visit the URL on your phone.

## Project structure

```
index.html      # Entire app (HTML + CSS + JS)
manifest.json   # PWA manifest
sw.js           # Service Worker
icons/          # App icons (192px, 512px, Apple touch)
```

## Data

All data is stored in the browser's `localStorage`. Nothing is sent anywhere. Clearing browser data will erase your workout history. Use **Settings → Export** to back up your data as CSV.

## License

Personal use.

Get that pump going!
