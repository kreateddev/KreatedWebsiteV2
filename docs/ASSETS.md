# ASSETS

Inventory of real material available to V2.

**Status key**
- **AVAILABLE** — real, usable, provenance known
- **OUTDATED** — real but stale; must not be used silently
- **FORBIDDEN** — exists, must not be used
- **MISSING** — does not exist, must be created
- **NEEDS RECAPTURE** — a real asset exists but must be re-shot/re-captured before use

🚫 **Nothing has been copied into `KreatedWebsiteV2/assets/` yet.** The directories are empty by
design. An asset moves here only when an approved concept needs it. All paths below are **source
locations for reference**, not V2 asset paths.

---

## 1. Kreated brand marks

| Asset | Source | Status | Notes |
|---|---|---|---|
| **KWLG.png** — approved monogram source | `V1/assets/brand/KWLG.png` | **AVAILABLE** | 1250×1250 PNG, 25,762 bytes, sha1 `e768286fdafddf34abda1d4d721dacbaec1111bd`. **APPROVED SOURCE, preserved byte-for-byte.** 8-bit truecolour, **no alpha** — white background is opaque |
| Monogram transparent PNG | — | **MISSING** | Removing the white is a real processing step, not a re-save |
| Monogram SVG | — | **MISSING** | |
| Monogram WebP | — | **MISSING** | |
| Favicon set / app icons (Kreated mark) | — | **MISSING** | V1's favicons are generic, not the monogram |
| KWLG2–KWLG5 variants | Skyler's `~/Downloads` | **FORBIDDEN (unless chosen)** | Four other 1250×1250 variants exist. Only `KWLG.png` was named as approved. If a different variant is chosen, replace deliberately and update the checksum — do not import all five |
| **KREATED wordmark** | Live text in V1 | **AVAILABLE** | Not an image. Cormorant Garamond 300, `letter-spacing: 0.22em`, `margin-right: -0.22em`; `0.18em` at ≤560px |

### The monogram, described
An asterisk/K monogram — a chevron on the left, a K's arms on the right, and a vertical spine with a
subtle waisted curve where the halves meet. **The sharp corners and that curve are intentional.**

### ⚠️ Processing brief, carried over verbatim in intent
Remove **only** the white. Preserve exact geometry and proportions. Keep the sharp corners. Do not
over-smooth. Do not crop tightly. Retain transparent padding for animation and favicon use.

🚫 **Do not process it early "just to have it ready."** V1's own note: an unreviewed export sitting
in a repo is how the wrong geometry ends up shipping. Processing happens at Step 4/7, after the
concept is approved.

---

## 2. Fonts

| Asset | Source | Status | Notes |
|---|---|---|---|
| `cormorant-garamond-latin.woff2` | `V1/assets/fonts/` | **AVAILABLE** | Variable, wght 300–400, upright, Latin subset + arrows U+2190–2193 |
| `cormorant-garamond-italic-latin.woff2` | `V1/assets/fonts/` | **AVAILABLE** | Variable, wght 300–400, italic |
| `syne-latin.woff2` | `V1/assets/fonts/` | **AVAILABLE — no incumbency** | Variable, wght 400–700. 🚫 **Not carried forward automatically** because V1 used it (DECISION 011) |
| OFL licence texts (both families) | `V1/assets/fonts/` | **AVAILABLE** | Must ship alongside the fonts |
| **The V2 primary sans** | — | **MISSING — undecided by ruling** | 🚫 Not to be selected during Step 1. Explored only after the creative concept exists. See [`BRAND.md`](BRAND.md) §A |

All built from official Google Fonts variable releases, instanced to the used weight range and
subset. No outlines altered. Both SIL OFL 1.1.

⚠️ V1's subsets were instanced **to V1's weight ranges**. Any font carried into V2 at heavier weights
must be re-instanced. **If a font is recut, give the new file a new name** — cache headers serve that
directory as immutable for a year.

⚠️ Cormorant Garamond is settled for the **wordmark** (DECISION 011), so those two files are the one
genuinely durable font asset here. Everything else in this section is provisional.

---

## 3. Client logos

| Asset | Source | Status | Notes |
|---|---|---|---|
| `learnsmart.svg` | `V1/assets/img/brands/` | **AVAILABLE** | Vector. `learnsmart-full-viewbox.svg` also exists |
| `llec-rail.png` / `.webp` | `V1/assets/img/brands/` | **NEEDS RECAPTURE** | V1 noted the LLEC original "still awaits a flat replacement mark" — the rail version is a derived treatment, not a clean logo |
| `llec-source.png` | `V1/assets/img/brands/` | **AVAILABLE** | Preserved original |
| `rare-raleigh-rail.png` / `.webp` | `V1/assets/img/brands/` | **AVAILABLE** | |
| `rare-raleigh-source.png` | `V1/assets/img/brands/` | **AVAILABLE** | Preserved original |

⚠️ **Client logo usage is a permission question, not just an asset question.** ❓ Confirm each client
is comfortable appearing on the V2 site.

---

## 4. Project screenshots

| Asset | Source | Status | Notes |
|---|---|---|---|
| LLEC homepage capture | `V1/assets/img/work/llec-home.{jpg,webp}` | **NEEDS RECAPTURE — PRIORITY** | Real capture of `leaklocatorseastcoast.com`, 1600×1000, taken **2026-08-02**. **Homepage Work candidate — refresh before homepage asset production** (DECISION 018) |
| Rare Raleigh current project media | — | **MISSING — PRIORITY** | Now a homepage Work candidate. Needs current appropriate media (DECISION 018). ⚠️ Only compliant subjects exist: the delivered audit/plan, or a clearly-labelled current-state reference |
| LearnSmart homepage capture | `V1/assets/img/work/learnsmart-home-2026.{jpg,webp}` | **NEEDS RECAPTURE — not urgent** | Real capture of `learnsmart.dev`, 1600×1000, taken **2026-08-02**. Useful for its case study; 🚫 **not a blocker for the V2 homepage** (DECISION 018) |
| LearnSmart homepage (earlier) | `V1/assets/img/work/learnsmart-home.{jpg,webp}` | **OUTDATED** | 3200×2000 full-bleed capture, superseded by the 2026 version |
| LearnSmart mobile capture | — | **MISSING** | Never captured. Not a homepage blocker |
| LLEC mobile capture | — | **MISSING** | |
| Rare Raleigh "after" | — | **MISSING — and must stay missing** | No redesign exists. 🚫 Never fabricate one. 🚫 Never imply launched, live, complete or measured (DECISION 008) |
| Rare Raleigh "before" (current Wix site) | — | **MISSING** | If captured, usable **only** as a labelled "before / current state" reference |

🚫 **A recreation is fabrication.** V1 deleted hand-drawn SVG "screenshots" that had been displayed
as if real. Proof is a real screenshot of a real live site, or nothing.

---

## 5. Founder imagery

| Asset | Source | Status | Notes |
|---|---|---|---|
| `skyler-founder-source.jpg` | `V1/assets/img/` | **AVAILABLE** | Preserved original |
| `skyler-founder-480/720/960.{jpg,webp}` | `V1/assets/img/` | **AVAILABLE** | Responsive derivatives of the same photograph |

**RULED, Skyler 2026-08-19 (DECISION 015):** existing founder photography **remains inventoried.
No commitment to use it.**

- 🚫 **Do not assume a Founder homepage section exists.** V1 had one; V2 has decided nothing.
- Founder positioning is decided later, based on the approved creative/content strategy.
- ⚠️ These are derivatives sized for V1's layout. If founder imagery is ever used, re-derive from
  the source — do not reuse V1's crops.

Because there is no commitment to use it, "is a reshoot needed?" is **not** a Step 1 question. It
becomes answerable once founder positioning is decided.

---

## 6. Client photography

> ## 🔶 RIGHTS TO CONFIRM BEFORE PUBLIC USE
> Applies to every asset in this section (DECISION 014).
>
> - **Not a blocker for Step 2 research.** Research and concept work may proceed while rights are
>   unconfirmed.
> - **Becomes a hard blocker before public asset use and before production launch.**
> - 🚫 **Do not assume rights.** Client work photography usually belongs to the client.

| Asset | Source | Status | Notes |
|---|---|---|---|
| Rare Raleigh project photos | `GitHub/Rare Raleigh/RR Images` | **AVAILABLE — RIGHTS TO CONFIRM BEFORE PUBLIC USE** | 11 named job folders + matching `.zip`s: 3 Season Conversion, Cabbarrus Custom Flip, Commercial Concrete, Fence, Miroslav Sunroom, Olga Kitchen Addition, Park Sunroom, Retaining Wall/deck/driveway, Siding/front porch/driveway, TREX Deck. ⚠️ **Highest-exposure item** — Rare Raleigh is a homepage Work candidate and this is its main media source |
| LLEC pool photos | `GitHub/LLEC/LLEC Pool Photos` | **AVAILABLE — RIGHTS TO CONFIRM BEFORE PUBLIC USE** | 37 files, JPG + HEIC. ⚠️ HEIC needs conversion |
| Unsorted photography | `GitHub/More Photos` | **AVAILABLE — RIGHTS TO CONFIRM BEFORE PUBLIC USE** | ~30+ JPEGs with camera-roll filenames. Contents, subjects and origin unknown; not inspected |

Questions to answer before public use: who shot each set, who owns it, and is Kreated licensed to
publish it on its own marketing site? Identifiable people or private property raise a second
question beyond copyright.

---

## 7. Stock / demonstration imagery

| Asset | Source | Status |
|---|---|---|
| 5 Pexels photos for the Ashford & Sons demonstration | `V1/assets/img/exhibit/` | **FORBIDDEN for V2 proof use** |

`current-hero`, `kreated-hero`, `project-landscaping`, `project-roofing`, `project-outdoor` —
Pexels License, self-hosted, IDs recorded in V1's `LICENSE.txt`.

🚫 These are set dressing inside a labelled conceptual demonstration. They do **not** depict Kreated
projects, clients or delivered work. Never relabel them as recent projects, never move them into a
case study, never pair them with performance claims.

⚠️ V1's licence record has **blank photographer attribution fields** for all five. If any Pexels
image is ever reused, fill those in first.

---

## 8. Testimonial material

| Asset | Status | Notes |
|---|---|---|
| Missy Boyd Google review — full text | **AVAILABLE** | Verbatim in [`PROOF.md`](PROOF.md) §5 |
| Missy Boyd photograph / headshot | **MISSING** | V1 used a letter avatar ("M"), not a photo |
| Any second testimonial | **MISSING** | One review exists in total |
| Video testimonial | **MISSING** | |

### Rating presentation — corrected (DECISION 017)

⚠️ An earlier version of this document said star-glyph rows were forbidden outright. **That was an
overstatement.** The actual rule:

- 🚫 **FORBIDDEN:** review-**count** framing (`1 review`, `1 review on Google`), invented ratings,
  unsupported rating claims, misleading proof.
- ✅ **AVAILABLE subject to evidence + design approval:** `Rated 5 Stars`, and star glyphs where
  accurately supported.
- ⚠️ Neither may be **silently introduced** during design.

Full rule in [`PROOF.md`](PROOF.md) §5. Note it does **not** unlock rating structured data.

---

## 9. Site infrastructure assets

| Asset | Source | Status | Notes |
|---|---|---|---|
| `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | `V1/assets/img/` | **OUTDATED** | Generic; do not carry the approved monogram |
| `og-default.png` | `V1/assets/img/` | **OUTDATED** | Built for V1's visual language |
| `site.webmanifest` | `V1/` | **AVAILABLE as reference** | Structure reusable; content needs rewriting |

---

## 10. 🚫 FORBIDDEN — V1 visual implementation

Present in V1, explicitly **not** inherited:

| Item | Source |
|---|---|
| All 9 CSS files — `home.css`, `kreated.css`, `showcase.css`, `method.css`, `signature.css`, `exhibit.css`, `motion.css`, `pages.css`, `audit.css` | `V1/assets/css/` |
| All 10 JS files — `ribbon.js`, `gapfield.js`, `hero.js`, `motion.js`, `showcase.js`, `method.js`, `exhibit.js`, `kreated.js`, `forms.js`, `audit.js` | `V1/assets/js/` |
| The WebGL hero field | `V1/assets/js/hero.js` |
| The canvas ribbon | `V1/assets/js/ribbon.js` |
| All V1 page HTML | `V1/**/index.html` |

⚠️ **Two narrow exceptions worth knowing about, both non-visual and both requiring Skyler's
approval before reuse:**
1. `kreated.js`'s `kreatedTrack` event emitter — analytics plumbing, no visual output.
2. `forms.js`'s Netlify Forms submit handling — conversion plumbing.

**Neither has been copied.** They are noted so the work is not redone blindly at Step 8.

---

## 11. What V2 will need that does not exist yet

Confirmed **MISSING** and required before Step 8 can complete:

- The **signature visual** (Step 4) — the single most important asset in the project
- Supporting visual assets (Step 7) — count and nature unknown until the concept exists
- Processed monogram exports — transparent PNG, SVG, WebP, favicon set, app icons
- A chosen primary sans, correctly licensed, subset and self-hosted — **selection deferred by ruling**
- **Refreshed LLEC capture** — priority, homepage Work candidate
- **Current Rare Raleigh project media** — priority, homepage Work candidate
- Confirmed **rights** for any client photography used publicly
- An OG/social image in the V2 visual language

Explicitly **not** on the critical path for the homepage: a fresh LearnSmart capture (case study
only), and founder photography (no commitment to use it).

🚫 **None of these may be improvised with CSS.** See
[`CREATIVE_PROCESS.md`](CREATIVE_PROCESS.md) §2.
