# KREATED V2 HOMEPAGE PROTOTYPE — NOT PRODUCTION

**Built:** 2026-08-21 · **Hero locked:** 2026-08-24 · **Full-page build reset:** 2026-08-25
**Review artifact only.** Not the homepage, not merged, not
deployed. `site/` is still empty and V1 is untouched.

> ## 2026-08-25 — BUILD RESET: full homepage implemented below the frozen Hero
>
> Everything below in this README describing the six-section OMC shell is now
> **historical** — kept for the record, superseded by this build. The page now
> implements the approved architecture on one continuous navy canvas:
>
> 1. Navigation (unchanged except new section links) · 2. **Hero — FROZEN,
> untouched** · 3. Client Trust (real clients only, static strip) ·
> 4. Services — Index + Stage (five Ashford & Sons specimen scenes, hover on
> desktop, accordion on mobile) · 5. How It Works (stepper + accumulating
> illustrative visualization, no metrics) · 6. Featured Work + Testimonial
> (LLEC with bounded observation, Rare Raleigh with locked status label, Missy
> Boyd excerpt — excerpt pending approval) · 7. Investment (editorial ledger,
> 🔴 **pricing figures are CANDIDATES from business planning, not docs — must
> be confirmed**) · 8. FAQ (copy candidates) · 9. Final CTA · 10. Footer
> (canonical contact data).
>
> New file: `sections.js` (services stage, process stepper, FAQ, add-ons —
> no scroll-linked motion). The old light "presence" band, capability contour
> SVG and its orbit are removed with the sections they belonged to. The
> visible PROTOTYPE banner was removed for clean visual review; its facts
> live in an HTML comment at the top of `index.html`. All new copy is
> COPY CANDIDATE — NOT APPROVED, flagged in section comments.

- Structural reference: [`research/OMC_TEARDOWN.md`](../../research/OMC_TEARDOWN.md)
- Translation decisions: [`concepts/OMC_KREATED_TRANSLATION.md`](../../concepts/OMC_KREATED_TRANSLATION.md)

## Run it

```bash
python3 /Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2/prototype/omc-kreated-home/serve.py 5180
```

Then <http://localhost:5180>. `file://` works too — nothing here needs `fetch`.

## What it is

Six sections, translated one-for-one from the live OMC homepage and re-pointed at
Kreated's business. No framework, no dependencies, no build step, no scroll-reveal,
no intro, no signature metaphor.

| # | Section | Surface | OMC's equivalent |
|---|---|---|---|
| 1 | Hero | navy | Hero |
| 2 | Services — the orbit | navy | Connected Capabilities |
| 3 | One connected presence | **light** | Omni platform |
| 4 | Work | full-bleed photograph | A record of sustained growth |
| 5 | Start a project | navy | What's new |
| 6 | Footer | navy-black | Stay connected |

## Measured against OMC, both at 1440×900

| | OMC | This shell |
|---|---|---|
| Sections | 6 | 6 |
| Total height | 4977px · 5.53vh | 4798px · 5.33vh |
| Header | 91px, in flow, scrolls away | 91px, in flow, scrolls away |
| Hero gutter | 177px (12.3vw) | 177px |
| Headline width | 1085px · **75.3vw** | 1086px · **75.4vw** |
| Open space right of headline | 178px | 177px |
| Display line-height | 1.00–1.10 | 1.02–1.04 |
| Serif accent vs sans | **1.27×** | 1.27× |
| Text measure cap | ~410px | 410px |
| Card radius | 21px | 21px (routes only — the presence section has no cards) |
| Elements hidden below the fold | **0** | **0** |
| Scroll-linked motion | **none** (0 ScrollTrigger instances) | **none** |
| Continuously running animations | **4** (12.2s orbit, 1.33s loop, 2 × ~11.6s) | **3** (12.2s orbit, 23.2s drift, 11.6s flow) |
| Hover transitions | 0.2s ease-in-out | 0.2s ease-in-out |
| Pill transitions | 0.4s cubic-bezier(.4,0,.2,1) | same |

## Motion

Measured from the live OMC homepage 2026-08-24 —
[`research/OMC_MOTION_TEARDOWN.md`](../../research/OMC_MOTION_TEARDOWN.md).

An earlier version of this prototype was built on the conclusion that OMC is
"almost nothing moves". **Half of that was wrong**, and the measurement behind it
was broken twice over: a OneTrust consent lock pinned the page at scroll 0, and the
browser was throttling `requestAnimationFrame`, so nothing time-based could be seen
to move. Re-measured properly, OMC splits cleanly in two:

> **The artwork never stops. The layout never moves.**

- **No scroll-linked motion — confirmed, twice.** GSAP's ScrollTrigger is loaded but
  registers **zero** instances. No parallax, no scroll-reveal, no pinning. Every
  element tracks scroll exactly 1:1. This is still most of why the page feels fast.
- **Four animations run continuously from load**, none of them waiting for scroll:
  a 12.2s infinite 9-item orbit, a 1.33s infinite Lottie loop, and two ~11.6s
  Lottie passes. All of it inside decorative artwork. No type, no layout, ever moves.

What this prototype runs, all of it CSS keyframes in the `AMBIENT MOTION` block of
`styles.css` — no JavaScript, so it survives script failure:

| Device | Motion | Period |
|---|---|---|
| 5 capability contours | one shared ellipse, linear, evenly phase-offset, ±52 / ±34px with a ±4% scale sweep | **12.2s** |
| Hero art slot edge | slow drift, −26 / +40px | 23.2s |
| Hero art slot edge stroke | dash creep, so the contour flows rather than sits | 11.6s |

The negative `animation-delay` values matter: like OMC's orbit, this is already
mid-cycle before the section is ever scrolled to. It is never caught at a start frame.

**Amplitude was set by measurement, not taste.** A first pass at ±18 / ±12px changed
**0.10%** of the section's pixels between two frames half a period apart — invisible,
which is the exact failure being corrected. At ±52 / ±34px it changes 0.29%, and the
travel is legible when the two frames are blended. 104px spread over 12.2s is about
8.5px/s, so it reads as drift, not as a slide.

**Reduced motion** stops everything at the authored rest position. OMC does not bother;
this does. Verified: all transforms `none`, `will-change` released, artwork at full
opacity, all five labels visible, no layout difference, nothing hidden — because no
content is gated behind any animation.

**Mobile keeps the motion.** OMC does not disable a single animation at 390px; it scales
the artwork down and keeps everything running. This matches that. Verified at 1440 and
390: zero horizontal overflow across a full cycle, zero console errors.

### One thing to flag

The brief asked for scroll-progress mapping — scroll-linked hero artwork, a
scroll-driven orbit, a mask reveal in the presence section, image translation in Work.
**OMC does none of those**, so building them would have made this *less* faithful while
looking like a fidelity correction. Under "OMC controls the motion grammar", the grammar
is continuous ambient motion in the artwork and total stillness in the layout, and that
is what is built. If you want scroll-linked motion anyway it is a legitimate Kreated
choice — but it should be recorded as a divergence from OMC, not as OMC fidelity.

## Three deliberate divergences

1. **The hero carries all three routes at 0.00s.** OMC's hero has no CTA at all.
   Kreated's buyer may click once.
2. **The header returns on scroll-up** carrying `Start a Project`. OMC's leaves and
   never comes back.
3. **Navy-dominant with light punctuation** — the inverse of OMC's white-dominant
   rhythm. Dark navy is a locked Kreated anchor (DECISION 012).

## The three decisions, as tested

- ✅ **Cormorant Garamond — kept, and rare.** Eleven places: two wordmarks, three
  accent words, the five capability labels, one editorial lead in Work. Every other
  lead is set in the sans. Still `TYPE CANDIDATE — NOT APPROVED`.
- ✅ **General Sans is running.** Indian Type Foundry via Fontshare, ITF Free Font
  Licence, free for commercial use. Variable 200–700, 38 KB, from Fontshare's own CDN.
  Licence note travels with it in `assets/fonts/`.
- ✅ **Accent: `#0A47F0` — cobalt.** The vermilion is gone; zero warm-accent elements
  remain in the rendered page. Five candidates were rendered against the navy as rim,
  fill, type and rule: `#0047AB` is rich but dull, `#1B4DFF` starts to read neon,
  `#0A47F0` stays electric without either.
  - `--cobalt: #0A47F0` — fills, rims, graphics, and text on the light band (6.07:1)
  - `--cobalt-lift: #5B86FF` — small text on navy, because base cobalt is only
    2.83:1 there and would fail AA

## The fluid identity layer — where it actually stands

**The hero artwork does not exist yet, and the prototype says so.**

Five procedural attempts are recorded in `tools/superseded/`. None reached the quality
the references set, and each failed characteristically: cellular packing gave an evenly
distributed texture with no composition; thinning its walls gave a neon web; a soft mass
on a dark page reads as *light*, not ink; banding that to fix it gave a solid blue wash.

The judgement: **this art direction is not reachable procedurally.** The references are
composed artwork with intent, not fields with parameters. So the hero ships a **labelled
art placeholder** holding the intended composition — right ~46%, full hero height,
cropped, bleeding right and bottom — rather than a low-quality finished-looking effect.
That follows the project's standing rule that missing art is marked, never faked.

What remains of the fluid, and it is deliberately little:

| Where | What |
|---|---|
| Hero | **Slot only.** Dashed contour + `FLUID ARTWORK — AWAITING ASSET` |
| Capabilities | Fluid-derived *contours* — the shape language, as hairlines. No raster. |
| Work | The photograph's bottom edge, one alpha mask (`tools/render-mask.py`) |

**Three decorative devices on the page**, which is what OMC uses.

## Fidelity to OMC, measured

| | OMC | This shell |
|---|---|---|
| Decorative devices on the page | 3 | **3** |
| Hero headline width | 1085px · 75.3vw | 1086px · **75.4vw** |
| Hero gutter | 177px | 177px |
| Header | 91px, in flow, scrolls away | same |
| Capability marks | 302px hairlines, sparse, bleeding off the left | fluid contours, sparse, bleeding off the left |
| Capability labels | floating in Cormorant italic, not centred in the marks | same |
| Work / photo section | full-bleed photograph, type over it | same, ~900px tall |
| Conversion equivalent | headline + minimal-chrome row | two large typographic routes on one rule |
| Cards on the page | 3 (news) | **0** |
| Elements hidden below the fold | 0 | **0** |
| Scroll-linked motion | none | **none** |
| Continuously running animations | 4 | **3** |

Page: 6 sections, 5280px, 5.87 viewports (OMC 4977 / 5.53).

## Weight

**113 KB of assets on first load** — General Sans 38, Cormorant 58, Work mask 17. The
Work photograph (282 KB) stays lazy. Down from 434 KB, because the procedural fluid
assets are gone.

## Known weak points

1. **The hero has no artwork.** This is the honest state, not an oversight — but it is
   the single biggest visual gap against OMC, whose ring carries most of the hero's
   weight. The slot holds the composition so the layout can be judged and the artwork
   commissioned into it.
2. **Kreated's page is emptier than OMC's.** OMC carries a card carousel, full-width
   imagery in two bands and a news row; Kreated genuinely has less content, so the
   presence row and conversion band are lighter. The capability section in particular is
   very tall and very sparse — arguably sparser than OMC's.
3. **Copy is placeholder throughout.**
4. **Reviewed at 1440×900 and 390×844.** No 4K or tablet pass.

> ## 2026-08-25 (later) — VISUAL-DIRECTION CORRECTION PASS
>
> One focused pass per the approved Fable 5 art-direction review. Hero frozen
> and verified byte-identical. Changes: **Proof** rebuilt as the photographic
> peak — two mirrored full-width case bands (LLEC · Rare Raleigh, now
> PUBLISHED/LIVE per DECISIONS 019) with edge-bleeding live-site capture
> surfaces + phone crops, and the testimonial paired with a LearnSmart
> capture. Captures are **labelled AWAITING-ASSET slots** until real
> screenshots land at `assets/img/proof/{llec,rr}-{desktop,mobile}.jpg` and
> `learnsmart-desktop.jpg` (real captures only — never reconstructed UI).
> **Rhythm**: peak headline scale on Services/Work, tightened Trust + FAQ,
> variable section padding (`--sec-lg/--sec/--sec-sm`), gutter breaks for
> Services/Proof artwork. **Services Stage**: "one world, five crops" — the
> container card is gone; five large cropped Ashford & Sons surfaces, GBP
> star glyphs removed. **Process**: chart replaced by five recognizable
> artifacts (audit sheet · scope doc · build-in-progress · launch presence ·
> incoming call). **Investment**: engagement title-pages — serif No.
> numerals, run-in scope lines, quiet small-caps prices, one cobalt button.
> Pricing remains 🔴 CANDIDATE. All new copy remains COPY CANDIDATE.
