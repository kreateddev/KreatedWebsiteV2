> # ⛔ SUPERSEDED — 2026-08-21
>
> This prototype is **historical reference only.** It does not drive the current
> creative direction and must not be used as a source for new design work.
>
> Superseded by the OMC-inspired direction:
> [`research/OMC_TEARDOWN.md`](../../research/OMC_TEARDOWN.md) ·
> [`concepts/OMC_KREATED_TRANSLATION.md`](../../concepts/OMC_KREATED_TRANSLATION.md) ·
> [`prototype/omc-kreated-home/`](../omc-kreated-home/)
>
> **Kept, not deleted** — the build, the measurements and the findings are real project
> history and some of it is reusable. See the note at the end of this banner for what.
>
> _Reusable:_ the render pipeline in `tools/render-pour.py` and the honest-asset discipline are worth keeping as method. Nothing visual from it carries forward.
>
> _Retired:_ **Aperture** as an intro system and **The Pour** as a material. Both retired outright. V2 has no intro animation and no signature material.
>
> ---

# STEP 5B PROTOTYPE — NOT PRODUCTION

**Kreated V2 · APERTURE intro → hero. Material: THE POUR.**
Motion discipline: **SET TRUE** — uncover / seat / align.
Built 2026-08-21. **Review artifact only.** Not the homepage, not merged, not deployed.

Nothing outside `prototype/aperture-hero/` was touched. V1 is untouched. `site/` is
still empty. The Every Surface prototype in `prototype/every-surface/` is untouched.

---

## How to open it

```bash
python3 /Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2/prototype/aperture-hero/serve.py 5179
```

Then <http://localhost:5179>. Reload to replay, or press **R** — a review affordance
only; no replay control is rendered and nothing in the design depends on it.

`file://` will not work: the intro reads `assets/pour/manifest.json` over `fetch`.
The finished hero still renders from `file://`, because that is the CSS default.

---

## Timing

| Time | Beat |
|---|---|
| 0.00 | Complete first paint. Headline, support line and all three routes are on screen and clickable. The KREATED wordmark is large on the right with the Pour running inside its letterforms. No panel exists yet. |
| 0.00–0.35 | Hold. The material flows and begins to settle inside the letters. |
| 0.35–1.05 | **ESCAPE.** The pour breaches the letter edges and spreads outward as one sheet with a lit, undulating leading edge. The letterforms keep their own edges and are submerged, never inflated. |
| 0.56–0.98 | The wordmark **UNCOVERS** into its small identity position in the header — a hand-off, not a logo flight. |
| 1.05–1.45 | **LEVEL + SEAT + ALIGN.** The sheet self-levels, the highlight band narrows and steadies, the embossed hairline relief resolves in the surface, and the copy block's hairline draws taut onto one of those relief lines. |
| 1.45 | **HARD STOP.** No loop. Nothing on the page moves again. |

Measured in the browser: **24 frame swaps, last at 1467 ms**, then zero animations
remaining and the intro classes removed. Target was 1.2–1.5 s; hard max was 1.7 s.

Mobile: no intro. One 600 ms uncover of the panel, and not even that on
save-data or low-power.

---

## THE POUR — how it is actually made

**It is a pre-rendered asset, not a CSS effect.** `tools/render-pour.py` renders it;
the CSS only positions the result. There is no gradient, blur, glow, filter or
generated texture standing in for the material anywhere in this prototype.

What the renderer simulates:

- **Self-levelling.** A height field starts mid-pour — low-frequency waviness plus
  three pour bulges under the letterforms — and relaxes by progressive diffusion.
  That is what self-levelling physically is: the finest ripples go first, long
  waviness last, and the motion decays to zero on its own. A slow decaying advection
  gives the material somewhere to flow before it settles.
- **One raked light.** Low elevation, from upper-left, with a deliberately broad
  specular lobe — satin, never gloss. Plus one elongated highlight band that narrows
  as the surface levels and is still at rest.
- **A leading bead.** The slightly raised ridge a thick coating carries at its front.
  It catches the raked light, which is the thing that makes the advancing edge read
  as liquid rather than as a shape. It flattens as the surface levels.
- **Relief at rest.** Faint embossed hairlines on the layout grid, and a whisper of
  a KREATED deboss — the material remembers the letters.

Colour never leaves the locked family: deep navy body `rgb(40,66,108)`, navy-black in
thickness, graphite in shadow, one controlled off-white highlight. No accent invented.

### The aperture — why the letters are not dilated

The obvious way to get material "out of" letterforms is to grow the letterforms
outward. Don't: growing a letter by an even distance inflates it into rounded gel,
which is slime, and slime is on the banned list. It was tried and rejected here.

What a thick coating actually does when a cavity overflows is spread as a **sheet**.
So the escape is a sheet growing out of the wordmark's band with an undulating
viscous edge, unioned with the crisp letterforms. The letters keep their own edges
the whole way and are simply submerged as the sheet widens. First the material
bridges between the letters, then it floods past them.

To re-render after changing anything:

```bash
python3 tools/render-pour.py
```

Needs `numpy`, `scipy`, `Pillow` (`pip install --user numpy scipy Pillow`). ~40 s.

---

## Weight

| | |
|---|---|
| Pour sequence, 24 frames, RGBA WebP, 800×620 | 189 KB |
| Resting surface, 2× | 54 KB |
| Wordmark with material fill (mobile only) | 14 KB |
| Cormorant Garamond (SIL OFL, self-hosted) | 58 KB |
| HTML + CSS + JS | 21 KB |
| **Desktop first load** | **≈322 KB** |
| **Mobile first load** | **≈148 KB** — the sequence is never fetched |

No framework, no dependencies, no build step, no WebGL, no canvas, no video, no
external requests, no console errors.

The frames carry **alpha**. That matters: a baked-in background would put a faint
rectangle on the page at 0.00 s, before any panel is supposed to exist.

---

## Where this deviates from the written spec, and why

Three places. All are user-visible, so they are Skyler's to accept or reject.

1. **The wordmark does not travel.** §6.3 says it "reduces and travels to its final
   small identity position." Here the large wordmark stays where it is and *opens* —
   the material escapes through it — while a second, crisp Cormorant wordmark
   uncovers into the header. Reason: a logo that shrinks and flies across the screen
   is the exact trope §3.2 bans as "long logo animations," and moving the mark while
   the material is trying to settle fights the one idea the beat is carrying. The
   name is handed off rather than flown. If you want the travel, say so — it is a
   contained change.

2. **The large wordmark sits in the right field, not centre-left.** §6.2 says
   centre-left. But §6.2 also says the headline block is painted at 0.00 s in its
   final position and is never covered — and with the copy on the left, a large
   centre-left wordmark covers it. Putting the aperture in the right field keeps the
   copy clear at every frame and makes the escape geometrically clean: the material
   never has to cross the copy.

3. **Three routes, not two.** Your note asked for "primary CTA, secondary CTA" and
   suggested *Start Your Project* / *See Our Work*. This ships the plan-of-record's
   approved working labels — **Start a Project** (primary), **Free Website Audit**
   (secondary), **View Work** (quiet tertiary) — because DECISION 010 makes the audit
   a core conversion offer and §3.4 requires all three visible from first paint.
   Say the word and it drops to two.

Also note: your brief listed **Machined Light** as a secondary site-wide material
language. The plan of record says Machined Light is explicitly *not* in Phase 1, so
none of it was built here.

---

## Copy status

Every string is unapproved and labelled in-page as `COPY CANDIDATE — NOT APPROVED`.

- Headline: **"Make your business the obvious choice."** — your candidate, chosen
  because it never implies the business is bad, which is the binding persuasion
  stance.
- Support: **"Web design, branding, and local SEO for owner-operated companies."** —
  factual against `docs/SERVICES.md`; still a candidate.
- Buttons: the approved working labels. Destinations are dead `#` links.

No proof, no metrics, no client data, no reviews, no rankings appear anywhere.

---

## Reduced motion / no JS / save-data / narrow

All render **the finished hero and nothing else**, with no intermediate state ever
visible. The CSS default *is* the resolved design; the intro's "from" states only
exist under `html.js-intro`, which a head script sets before first paint and only
when the intro is actually going to play. Verified by loading with both scripts
stripped out.

A hidden tab holds the 0.00 s frame — itself a designed state — and runs the intro
when the visitor actually looks, rather than spending it on an empty tab.

---

## Known weak points

1. **The material is prototype-grade, not the final asset.** It is a real
   pre-rendered sequence, which is the right class of asset, but it is one I
   generated — not a commissioned render or licensed re-graded macro footage.
   §10.5 leaves that production route to you, and it is still open. What is here is
   good enough to judge the *idea*; it is not the thing you would ship.
2. **20 fps through the escape.** 24 frames, weighted toward the fastest beat. It
   reads fine because the material is viscous and slow, but it is not 60 fps smooth.
   The production fix is a short compressed clip or an animated WebP, at which point
   file size drops too — held back here only because your brief said no autoplay
   video.
3. **The escape spends about 0.2 s looking like a broad band before it reads as a
   panel.** That middle stretch is the weakest part of the sequence; the start and
   the finish are both stronger than the middle.
4. **The panel has three visible edges.** It bleeds right, but its top, bottom and
   left edges all sit inside the frame with page margin around them. It reads as a
   material field rather than a card — no radius, no shadow, no border — but a
   second bleed (bottom) would make it more architectural. Not done because cropping
   the render vertically moves the wordmark out of frame at 0.00 s.
5. **Judged at 1440×900 and 375×812 only**, plus a mobile-preset pass. No 4K review.
6. **The deboss is a judgement call.** It is currently a whisper. It can go to zero
   in one line if two KREATEDs on screen is one too many.

---

## What this prototype is NOT

No homepage. No sections below the fold. No Every Surface — that is Phase 2 and it
stays below the fold when it comes back. No Deciding Moment. No nav system beyond
the wordmark's header slot. No forms, no footer, no services, no Method, no Work. No
case study, no screenshots, no browser mockups, no proof mechanism. No final copy, no
typography decision beyond the wordmark, no palette tokens.

One interaction, isolated, for judgement.
