# Design: Automaattinen lineaarinen progressio

**Päivämäärä:** 2026-04-14  
**Status:** Hyväksytty

## Konteksti

Käyttäjätutkimus osoittaa, että automaattinen progressioehdotus on ykköstoive voimaharjoittelusovelluksissa. IronLog on julkinen PWA, ja tämä ominaisuus tekee siitä selvästi kilpailukykyisemmän (Strong, Hevy jne. tarjoavat tämän).

Kiinteä kg-nousu ei skaalaudu eri liikkeille — 2.5kg on iso hyppy olkapäissä mutta pieni kyykyssä. Siksi nousu on **prosenttiperusteinen** ja pyöristetään 0.5kg:n tarkkuudella.

## Progressiologiikka

| Tulos | Seuraava sessio |
|-------|----------------|
| Kaikki toistot ✅ | paino × 1.025, pyöristetty lähimpään 0.5kg |
| Epäonnistui 1× | sama paino |
| Epäonnistui 2× peräkkäin | paino × 0.90, pyöristetty lähimpään 0.5kg |

**Pyöristyskaava:** `Math.round(weight / 0.5) * 0.5`

**Esimerkit:**
- 80kg kyykky onnistui → 80 × 1.025 = 82.0kg
- 20kg sivunosto onnistui → 20 × 1.025 = 20.5kg
- 20kg sivunosto epäonnistui 2× → 20 × 0.90 = 18.0kg

## UX-malli

**Inline auto-fill** — kun käyttäjä avaa session, paino-kenttä pre-täytetään `suggestedWeight`-arvolla placeholder-tyylillä. Käyttäjä voi ylikirjoittaa. Ei erillistä pre-session näkymää eikä post-session pop-upia.

## Asetukset

- Globaali **"Progressionousu %"** -kenttä asetukset-näkymässä
- Oletusarvo: **2.5%**
- Käyttäjä voi muuttaa vapaasti

## Data (localStorage)

```json
{
  "progressionSettings": {
    "incrementPct": 2.5
  },
  "progression": {
    "squat": { "suggestedWeight": 82.0, "failStreak": 0 },
    "lateralRaise": { "suggestedWeight": 20.5, "failStreak": 0 }
  }
}
```

| Kenttä | Kuvaus |
|--------|--------|
| `suggestedWeight` | Ehdotettu paino seuraavaan sessioon |
| `failStreak` | Peräkkäisten epäonnistumisten laskuri, nollaantuu onnistumisesta |

## Toteutus

### Tiedosto

Kaikki muutokset tehdään `index.html`-tiedostoon (yhtenäinen arkkitehtuuri).

### Uudet funktiot

**`roundToHalf(weight)`**
```js
function roundToHalf(w) {
  return Math.round(w / 0.5) * 0.5;
}
```

**`calculateProgression(exerciseName, sets)`**
- `sets`: array `{ completedReps, targetReps, weight }` -objekteja
- Jos kaikki sarjat: completedReps ≥ targetReps → suggestedWeight = roundToHalf(weight × (1 + pct/100)), failStreak = 0
- Jos ei → failStreak++, jos failStreak ≥ 2 → suggestedWeight = roundToHalf(weight × 0.9), failStreak = 0
- Tallentaa `progression`-objektin localStorageen

**`getProgressionSuggestion(exerciseName)`**
- Palauttaa `suggestedWeight` tai `null` jos ei dataa

### Muutokset olemassa oleviin funktioihin

| Funktio | Muutos |
|---------|--------|
| `renderSetRow()` / weight input | Pre-fill: `getProgressionSuggestion(ex)` → placeholder tai value |
| Sessio-tallennuslogiikka | Kutsu `calculateProgression()` jokaisen harjoituksen tallennuksen jälkeen |
| Asetukset-näkymä | Lisää "Progressionousu %" -kenttä, tallenna `progressionSettings.incrementPct` |

### i18n (T.en + T.fi)

| Avain | EN | FI |
|-------|----|----|
| `progressionIncrement` | "Progression increment (%)" | "Progressionousu (%)" |
| `progressionSuggested` | "Suggested" | "Ehdotettu" |
| `deloadApplied` | "Deload applied (2 failed sessions)" | "Deload tehty (2 epäonnistunutta sessiota)" |

## Verification

1. Kirjaa sessio kyykyllä, tee kaikki toistot → aloita uusi sessio → paino-kenttä näyttää +2.5%
2. Epäonnistu 1× → uusi sessio → sama paino
3. Epäonnistu 2× peräkkäin → uusi sessio → paino −10%
4. Muuta % asetuksissa → uusi sessio → laskelma käyttää uutta prosenttia
5. Tarkista localStorage: `progression`-objekti päivittyy oikein jokaisen session jälkeen
6. i18n: vaihda kieltä EN↔FI, tarkista uudet merkkijonot molemmilla kielillä
