# HERO CONCEPTS — three live demos · NOT PRODUCTION

**Built 2026-08-26.** Three animated concepts for the hero artwork, each using the
real Kreated monogram (`assets/img/kreated-mark.svg` paths, inlined) on top of the
**current production hero as the base** — same left column, copy, typewriter, CTA
treatment, and the same signage-scale art-region geometry (134% width, right-edge
bleed, −46px optical lift). Only the artwork inside `.hero__art` differs.

## Run

```bash
python3 /Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2/prototype/serve.py 5181
```

Then open http://localhost:5181/hero-concepts/concept-1-draft.html — the top-right
switcher jumps between all three. (`file://` also works; fonts load relatively
from `../omc-kreated-home/assets/fonts/`.)

## The concepts

| # | File | Idea | Motion |
|---|---|---|---|
| 1 | `concept-1-draft.html` | **The Draft** — the mark is perpetually being made: fabrication-drawing outlines draw themselves, the solid mark seats in | Draw-on intro (~2.3s) → built + breathing → every 20s one piece dissolves to its line drawing and rebuilds. Cursor proximity re-reveals the construction guides. |
| 2 | `concept-2-signal.html` | **Signal** — the mark as a beacon: being found, made visual | A cobalt lighthouse beam rotates inside the letterform (12s/rev); the mark's own silhouette expands outward as a fading echo (heartbeat pair every 16s). The beam leans a few degrees toward the cursor, damped. |
| 3 | `concept-3-registration.html` | **Registration** — an oversized two-color print run drifting out of register, periodically snapping into perfect registration with a chrome keyline flash | Poster scale, arms bleed top + right. Slow lissajous drift (≤8px) → every 18s: slide to register (0.6s), locked beat (0.9s, keyline flash, ghost dims), release (1.2s). Cursor steers the drift a few px. |

All three: pure SVG/CSS/JS, zero libraries, `prefers-reduced-motion` renders a
composed static state, no horizontal overflow at 1440/390, no console errors.

## Status

Concept exploration only. Nothing here is approved; the production hero
(`omc-kreated-home`, dimensional monogram renderer) is untouched. If one of these
wins, it replaces the artwork inside the production `.hero__art` — the left
column and geometry are already identical by construction.
