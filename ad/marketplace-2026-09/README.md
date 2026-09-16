# Facebook Marketplace creative — September 2026

An ad, not a design direction. **Nothing in this folder is site work and nothing
outside this folder was touched to make it.** The prototype's fonts and its
shipped proof captures were *copied in*; `prototype/` and `docs/` are unmodified.

---

## 1. Output

| File | Size | Use |
|---|---|---|
| `out/kreated-marketplace-1x1.jpg` | 1080 × 1080 | **Primary.** First image on the listing — this is the thumbnail. |
| `out/kreated-marketplace-4x5.jpg` | 1080 × 1350 | Alternate crop for feed placements. |
| `out/*.png` | same | Lossless masters, for re-crops or print. |

Post the 1:1 **first**. Marketplace builds the tile from the first image, and the
whole composition is tuned against that tile, not against the full-size render.

Editable source is `src/`. See §5.

---

## 2. Where the three websites came from

The creative shows real current work. It does not recreate, restyle or
re-typeset any of it.

| Project | Source of the hero capture |
|---|---|
| **Morrow** | Captured fresh from the current build in this repo, `prototype/kreated-v2/morrow/`, served locally and shot in Chromium at 1600 × 1000 CSS px / 2× DPR, then resampled to 1600 × 1000. |
| **Leak Locators East Coast** | `prototype/kreated-v2/assets/img/proof/llec-desktop-v2.jpg` |
| **Rare Raleigh Restoration** | `prototype/kreated-v2/assets/img/proof/rr-desktop-v2.jpg` |

⚠ **The two live sites could not be re-shot in this session.** The container's
egress policy refused `CONNECT` to `leaklocatorseastcoast.com:443` and
`rareraleighrestoration.com:443` with a 403, so neither could be loaded at all.
The captures used instead are the ones the Kreated site itself ships on the
homepage, `/work/` and four service routes — they are the current post-overhaul
designs, committed in `f669c8b` (Rare Raleigh) and `2685256` (Leak Locators),
which are the two most recent commits that touched either capture.

🚫 If either site is redesigned, **re-shoot rather than edit these files**, and
re-shoot the site's own proof captures in the same pass so the ad and the site do
not disagree. `capture` mechanics: `--force-color-profile=srgb`, reduced motion,
`networkidle`, a scroll nudge and back to 0 to settle reveal animations.

---

## 3. The three concepts

All three were built and rendered in full, then judged at tile size.
Contact sheet: `out/concepts--thumbnail-check.png`.

**Concept 1 — editorial / quiet luxury** (`src/concept-1.html`)
Paper ground, navy ink, enormous negative space, the portfolio as a shelf
bleeding off the bottom edge. The argument was that in a feed of loud ads the
quiet one looks expensive.

**Concept 2 — the screens dominate** (`src/concept-2.html`)
Navy, a compressed slab of uppercase display type, and the three sites as one
3D scene — a shared perspective origin with each window on its own Z plane, so
the vanishing lines actually agree. The proof gets two thirds of the canvas.

**Concept 3 — the campaign poster** (`src/concept-3.html`) — **SELECTED**
Centred masthead, centred statement, three windows fanned from the middle, one
control bar at the foot.

### Why concept 3

Judged by resampling each to 172px — the size a Marketplace tile actually
occupies — and checking the brief's five priorities in order: headline, the
websites, the Kreated name, the price, the CTA.

- **Concept 1 failed on 2, 3 and 4.** The serif price and the wordmark both
  dissolved into the paper ground, and the three sites read as a single grey
  band along the bottom rather than as three businesses. It is the most
  beautiful of the three at full size and the weakest at the size that matters.
- **Concept 2 held 1, 4 and 5** — the uppercase headline is the loudest of the
  three — **but failed on 2.** The perspective stack collapsed into one pile;
  the third site stopped reading as a separate project. It also spends its
  loudest gesture on the copy rather than on the work.
- **Concept 3 held all five.** The composition is symmetrical, so at tile size
  the eye only has to find the middle, and the three sites stay legibly
  separate because they are three different colours before they are three
  different layouts — a cool grey pool, a warm timber house, a deep olive
  interior.

---

## 4. The decisions inside the selected creative

- **Which site sits in which slot is load-bearing.** The centre window is shown
  whole; the outer two are covered on their inner edge. So the left slot keeps
  its *left* half and the right slot keeps its *right* half. Rare Raleigh is on
  the left because its logo, headline and both CTAs live in the left half. Leak
  Locators is in the centre because "Find the leak before it costs you more" is
  the most legible hero of the three at 30% scale, and it is the one a local
  business owner reads as a business like theirs. Morrow is on the right because
  its right half — the cup, the serif — is recognisable with the headline
  covered, which is not true of the other two. Reordering `projects` in
  `ad.config.js` without re-checking a thumbnail costs the ad its proof.
- **The wordmark is Cormorant 400 / .18em, not the site's 300 / .22em.** At 300
  it vanished at tile size; .18em is the tracking the site itself already drops
  to at ≤560px. Both deviations are commented at the rule.
- **The serif accent is `--cobalt-lift`, not `--cobalt`.** The identity blue is
  2.83:1 on the navy ground and an italic serif is the thinnest shape in the ad.
  The lift measures 5.62:1.
- **The browser chrome is three dots and a domain, nothing else.** The URL is the
  only place a client is named, which is why it must be the real domain — it is
  what turns a screenshot into a checkable claim.
- **No fake analytics, no stock photography, no invented metric.** The only
  chroma in the ad is real client photography, which is the rule the site runs
  on too.

### Copy on the graphic

> KREATED · Your website should bring you *customers.* · Web design and local
> SEO, built for growth. · Website design · Local SEO · Google growth ·
> Starting at $700 · Message us about your business →

That is the whole of it. Everything else — locality, scope, what $700 buys —
belongs in the listing text, where it costs nothing and is read by people who
have already stopped scrolling.

---

## 5. Changing the ad

Edit **`src/ad.config.js`** and nothing else:

```js
headline: 'Your website should\nbring you {customers.}',   // \n breaks, {…} = serif accent
sub:      'Web design and local SEO, built for growth.',
services: 'Website design · Local SEO · Google growth',     // '' removes the row
price:    { label: 'Starting at', value: '$700' },
cta:      'Message us about your business',
projects: [ { slot: 'left'|'centre'|'right', url, shot } ],
```

Then:

```bash
pip install playwright pillow          # once
python3 render.py                      # all five creatives
python3 render.py kreated-marketplace-1x1   # or just one
python3 thumbnail-check.py             # the acceptance test — look at the output
```

Both crops read that one config, so they cannot drift apart. To swap a
screenshot, drop a **1600 × 1000** desktop hero into `src/shots/` and point
`shot` at it; any other aspect ratio will change the window heights and the fan
geometry is tuned for 16:10.

`render.py` renders at 2× and resamples with Lanczos — Chromium's 1× rasteriser
leaves the hairline window strokes visibly soft at this size. 🚫 If an edge looks
soft, check `SCALE` before adding a CSS shadow.

### What lives where

```
src/ad.config.js        copy, price, CTA, which site in which slot   ← edit this
src/ad.js               template renderer; reads the config
src/kit.css             the brand layer — palette, fonts, wordmark, browser window
src/layout-campaign.css the selected composition, shared by both crops
src/final-1x1.html      vertical positions for 1:1 only
src/final-4x5.html      vertical positions for 4:5 only
src/concept-{1,2,3}.html the concept round, kept as the record of what was tried
src/fonts/              General Sans + Cormorant Garamond, copied from the site
src/shots/              the three hero captures
render.py               HTML → PNG + JPG
thumbnail-check.py      the acceptance test
```

Palette and typefaces in `kit.css` are lifted verbatim from
`prototype/kreated-v2/styles.css` and `theme.css` so the ad and the site are
provably the same brand. 🚫 Do not invent a colour here. If the site's palette
moves, move this with it.

---

## 6. Open item for Skyler

**"Starting at $700" is not in the current offer map.** `docs/OFFER-MAP.md` lists
`700–1200` as the *old full-site range*, marked **Deprecated — 🚫 never quote**.
The cheapest published website package is `pkg.web.onepage` at **750**, and the
cheapest published page of any kind is `svc.page.standard` at **250**. So $700
sits below every sanctioned website entry point and above the individual-page
one. The figure was specified for this ad, so it is what the creative says — but
it disagrees with the pricing source of truth, and a Marketplace enquiry that
arrives quoting $700 lands against a scope that no longer exists at that
number. Either the offer map gets a sanctioned Marketplace entry point, or the ad reads
**Starting at $750** and matches One Page Website. One line in `ad.config.js`
either way.
