# Facebook Marketplace creative — September 2026

An ad, not a design direction. **Nothing in this folder is site work and nothing
outside this folder was touched to make it.** The prototype's fonts and its
shipped proof captures were *copied in*; `prototype/` and `docs/` are unmodified.

---

## 1. Output

A four-slide Marketplace carousel. The files are numbered, so a directory
listing is already the posting order.

| File | Size | Use |
|---|---|---|
| `out/kreated-marketplace-01-cover.jpg` | 1080 × 1080 | **Slide 1 — the cover.** First image on the listing, so it is the thumbnail. |
| `out/kreated-marketplace-02-web-design.jpg` | 1080 × 1080 | Slide 2 — website design & redesign. Rare Raleigh, before and after. |
| `out/kreated-marketplace-03-local-seo.jpg` | 1080 × 1080 | Slide 3 — local SEO. Leak Locators, desktop and phone. |
| `out/kreated-marketplace-04-social.jpg` | 1080 × 1080 | Slide 4 — social media. Morrow's site and its profile. |
| `out/kreated-marketplace-01-cover-4x5.jpg` | 1080 × 1350 | Alternate cover crop for feed placements. Not part of the carousel. |
| `out/*.png` | same | Lossless masters, for re-crops or print. |

Post the cover **first**. Marketplace builds the tile from the first image, and
the whole composition is tuned against that tile, not against the full-size
render.

**The carousel structure is deliberate: the cover opens with the offer, slides
2–4 prove it, and each interior slide states one checkable fact rather than a
promise.** The CTA and the price sit on the cover and in the listing text; the
interior slides do not repeat them, because a carousel that asks four times
reads as a pitch rather than as work.

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

⚠ **The three concept renders carry the earlier headline** ("Your website should
bring you customers"). The round was decided on *composition* — where the proof
sits, how the type stacks, what survives a 172px tile — and the copy changed
after the direction was chosen. They are left as the record of that comparison
rather than re-rendered, so what is in `out/concept-*.png` is exactly what the
decision below was made on. Only the two finals carry the shipping copy.

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

### What each interior slide does, and what it may not say

**Slide 2 — website design & redesign.** Rare Raleigh Restoration, before and
after. Both frames are real captures of the same business's site; the previous
site was approved for public display on 2026-08-30, which is the only reason it
can be shown at all. The `before` is cropped from the top to 16:10 so both
frames are the same shape — a comparison between two different crops is an
argument about framing. 🚫 The two windows are the **same width**. Making the
after bigger to flatter it is the first thing a sceptical buyer notices.

**Slide 3 — local SEO.** ⚠ **The service-area page is not shown, and it should
be.** The slide was specified as "LLEC hero and the locations page". No capture
of a location page exists anywhere in this repository, and the live site could
not be re-shot — the egress note in §2 applies to this too. The service-area
work is carried as the counted fact instead: *two sites, 28 service-area pages*,
from the dated record in `work/leak-locators-east-coast`. A ready slot,
`.sl-loc`, is written into `src/slide-3-local-seo.html`, commented out, with the
geometry change needed to fit three windows. 🚫 Do not fill the gap by mocking
up a location page — it would be a picture of a client's site that the client
does not have.

🚫 **Nothing on slide 3 may be a performance claim.** The case study explicitly
forbids crediting any change in the search figures to any piece of work, because
the measurement window spans the old site, the rebuild, and the two-state split.
A page count is a count of pages. The six months of Search Console data in the
case study stays in the case study.

**Slide 4 — social media.** The Morrow homepage as built, plus a social profile
designed in the same brand system. Morrow is Kreated's own self-initiated brand
concept — that is how `/work/` labels it, and the same words are on the foot of
the slide — so designing its profile is brand work on Kreated's own property,
not a picture of a client's account.

Two rules hold that slide honest, and both are commented at the markup:

- 🚫 **No follower or following counts.** A number beside "followers" on a mock
  is indistinguishable from a result, and a result is exactly what this cannot
  claim. "9 posts" is true of the grid underneath it and is the only figure on
  the slide. Do not add the other two back to make the header look finished.
- 🚫 **No Instagram wordmark or glyph.** The layout is the reference; the marks
  are somebody else's property and the slide does not need them.

The profile is built in **Morrow's** system, not Kreated's — Instrument Serif,
Inter Tight, JetBrains Mono, ivory/bone/espresso, and Clay used exactly once in
the frame, which is that brand's own stated rule. Six of the nine grid tiles are
real Morrow photography, centre-cropped to square; three are designed type tiles,
which is the part that reads as *planned content* rather than as the website's
photos posted again.

### Copy on the graphic

> KREATED
> **WE BUILD BUSINESSES *ONLINE.***
> Websites • SEO • Social
> PROJECTS STARTING AT **$750**  ·  Message us about your business →

Five elements, four rows, on the cover. That is the whole of it. Everything
else — locality, scope, what $750 buys, the fact that SEO and Social are ongoing
rather than one-time — belongs in the listing text, where it costs nothing and is read by
people who have already stopped scrolling.

Three notes on how the copy is set:

- **"ONLINE." takes the serif accent and its own line.** In caps, Cormorant
  italic is the most distinctive shape Kreated owns, and dropping it onto a
  second line turns the last word into the payoff rather than the tail of a
  sentence. It also solves a measure problem: "WE BUILD BUSINESSES" alone sets
  to 936px against a 968px measure, so the line was never going to take a
  fourth word at a readable size.
- **"Websites • SEO • Social" is the supporting line, not quiet footer
  furniture.** It sits directly under the statement at 28px/500, which is a
  weight and a shade brighter than a caption, because it is one of the three
  things the ad has to land rather than a gloss on the headline.
- **The services row under the fan was removed.** It used to read "Website
  design · Local SEO · Google growth", which now says the same thing as the
  supporting line. A Marketplace creative cannot afford to say anything twice
  in one frame. `services` in the config is `''`; set it to a string to bring
  the row back.

---

## 5. Changing the ad

Edit **`src/ad.config.js`** and nothing else:

```js
headline: 'WE BUILD BUSINESSES\n{ONLINE.}',        // \n breaks, {…} = serif accent
sub:      'Websites • SEO • Social',
services: '',                                      // a second row under the fan
price:    { label: 'Projects starting at', value: '$750' },
cta:      'Message us about your business',
projects: [ { slot: 'left'|'centre'|'right', url, shot } ],
```

⚠ **The headline is stored in caps, not uppercased by CSS** — what is typed is
what renders. `.ad-headline` in `layout-campaign.css` carries tracking and
leading tuned for caps; a sentence-case rewrite wants both loosened a step. And
the measure is 968px in *both* crops, because both are 1080 wide, so 86px is the
ceiling for a 19-character line either way. A longer first line needs a smaller
size, not a bigger canvas.

Then:

```bash
pip install playwright pillow          # once
python3 render.py                      # all five creatives
python3 render.py kreated-marketplace-1x1   # or just one
python3 thumbnail-check.py             # the acceptance test — look at the output
```

`thumbnail-check.py` writes one sheet per slide at 120/172/240px, plus
`carousel--thumbnail-check.png`: all four slides side by side at tile size. That
last one is the check the individual sheets cannot make — whether the set reads
as **one** campaign while each slide still says a different thing at a glance.

Both crops read that one config, so they cannot drift apart. To swap a
screenshot, drop a **1600 × 1000** desktop hero into `src/shots/` and point
`shot` at it; any other aspect ratio will change the window heights and the fan
geometry is tuned for 16:10.

⚠ **`ad.config.js` drives the cover only.** Slides 2–4 are hand-laid: each one
has a different kind of proof in it — two windows, a window and a phone, a phone
running live HTML — and a config abstraction over three layouts that share
nothing but a masthead would be more code guarding less. Their copy lives in
their own files, and the three anchors they hold in common (masthead y, proof
band top, foot rule) are stated at the top of `layout-slide.css`. 🚫 Do not move
an anchor in one slide only.

`render.py` renders at 2× and resamples with Lanczos — Chromium's 1× rasteriser
leaves the hairline window strokes visibly soft at this size. 🚫 If an edge looks
soft, check `SCALE` before adding a CSS shadow.

### What lives where

```
src/ad.config.js        copy, price, CTA, which site in which slot   ← edit this
src/ad.js               template renderer; reads the config
src/kit.css             the brand layer — palette, fonts, wordmark, browser window
src/layout-campaign.css the selected composition, shared by both crops
src/final-1x1.html      cover, vertical positions for 1:1 only
src/final-4x5.html      cover, vertical positions for 4:5 only
src/layout-slide.css    the interior-slide layout, shared by slides 02-04
src/slide-2-web-design.html   \
src/slide-3-local-seo.html     > one file per interior slide
src/slide-4-social.html       /
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

## 6. Pricing — previously flagged, now resolved

An earlier revision of this creative read "starting at $700", and that number
was **not** in the offer map: `docs/OFFER-MAP.md` carries `700–1200` only as the
*old full-site range*, marked **Deprecated — 🚫 never quote**.

**$750 resolves it.** `pkg.web.onepage` (One Page Website) is published at 750
one-time, and it is the cheapest website package Kreated sells. "Projects
starting at $750" is therefore a true statement about the cheapest project, and
it points at a package that actually exists to be sold.

Two things to keep an eye on, neither of them blocking:

- **"Projects" is doing load-bearing work in that sentence.** Two individual
  services sit below 750 — `svc.page.standard` at 250 and `svc.page.service` at
  450 — but those are pages added to an engagement, not projects anyone buys on
  their own. The word "projects" is what keeps the claim correct. 🚫 Do not
  shorten it to "from $750" on a future edit without re-checking that.
- **The carousel sells SEO and Social, and neither has a one-time price.**
  `pkg.local.presence` is 500/month and `pkg.social.manage` is 900/month with a
  three-month initial term. The cover's price line is about website projects and
  says so; the listing text should carry the recurring services' shape, because
  the graphic has no room to and a reader who assumes $750 covers all three will
  be disappointed on the first call.

---

## 7. Known gap

**Slide 3 is missing the service-area page it was specified to show**, and the
two live client sites could not be re-captured. Both are the same cause — the
egress policy documented in §2 — and both are one session with those hosts
allowed away from being fixed. The slot for the capture is already written into
`src/slide-3-local-seo.html`. See §4 for what the slide does instead.
