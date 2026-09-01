# OMC.COM — MOTION TEARDOWN

**Measured 2026-08-24 against the live https://www.omc.com/ homepage.**
Supersedes the motion conclusions in [`OMC_TEARDOWN.md`](OMC_TEARDOWN.md) §"No scroll-reveal".
Structural measurements in that document still stand — only the motion reading changes.

Research artifact. No production implication. Nothing here was deployed.

---

## 0. Why the first teardown got motion wrong

The original teardown concluded *"almost nothing moves."* That conclusion came from two
broken measurements, and both are worth recording so the mistake is not repeated.

**Failure 1 — the consent banner was locking the page.** OneTrust sets
`body { position: fixed; overflow: hidden }` and leaves it set after the banner is
visually hidden. `document.documentElement.scrollHeight` read **900** instead of 4977,
and `window.scrollY` stayed **0 across all 12 sample positions**. Every "below the fold"
element I sampled was therefore still in its initial state, sitting at scroll 0. Twelve
identical samples were recorded as twelve different scroll positions.

**Failure 2 — the browser pane was throttling `requestAnimationFrame`.** In the connected
pane, the hero Lottie reported `playing: true` while `currentFrame` stayed pinned at **1**
across 1500 ms. Nothing time-based advanced, so nothing time-based could be observed. This
is also why earlier headless captures of animated regions came back blank.

Both were instrumentation faults, not OMC behaviours. Everything below was re-measured in
unthrottled headless Chrome with consent genuinely dismissed (`#onetrust-reject-all-handler`
clicked, `body` back to `position: relative`, `scrollHeight` 4978).

---

## 1. The headline correction — and it cuts both ways

> **OMC has no scroll-linked motion at all. Its aliveness is entirely continuous,
> time-based motion inside three decorative devices, running whether you scroll or not.**

Skyler's note — *"OMC is not mostly static"* — is **correct**. My "almost nothing moves"
was wrong. But the mechanism is not the one the brief assumes, and this matters for
implementation:

| | Measured on OMC |
|---|---|
| `ScrollTrigger.getAll()` | **0** — GSAP's ScrollTrigger is loaded but registers zero instances |
| Scroll-linked transforms | **none** — every element's viewport position tracks scroll exactly 1:1 |
| Parallax on full-bleed images | **none** — `.omni-card` transform is `matrix(…,0,0)` at every scroll position |
| Scroll-reveal / fade-up on entry | **none** — confirmed again with scrolling actually working |
| Pinning, scroll-jacking, smooth-scroll lib | **none** |
| Continuously running animation | **yes — four separate always-on animations** |

The proof that the motion is time-based and not scroll-based is a single accident in the
data: two consecutive samples both recorded `scrollY: 0` (a `scrollTo` that did not take),
and the orbit transform still changed between them, `(-344,-440) → (-402,-391)`. **The
orbit advanced with zero scrolling.** A separate 12.5 s run with the page held completely
still confirmed it.

So the correct instruction for Kreated is not "map motion to scroll progress." It is:

> **The decorative artwork must never be inert. The layout must never move.**

---

## 2. Measured motion inventory — the complete list

Everything on the OMC homepage that moves. There is nothing else.

| # | Element | Motion | Driver | Period | Runs at 390px? |
|---|---|---|---|---|---|
| 1 | `.circle-orbit-item` × 9 | elliptical orbit, radius sweeping **327 → 560 px** | GSAP infinite tween | **12.2 s / revolution** | **yes** |
| 2 | capability ring Lottie (120 f) | continuous seamless loop | GSAP infinite tween | **1.33 s** | yes (223 px wide) |
| 3 | hero Lottie `02-Home-top-section` (347 f) | plays through once @ 30 fps | `autoplay` | **≈11.6 s** | yes (585 px wide) |
| 4 | investors Lottie `04-Investors-Graphic` (348 f) | plays through once @ 30 fps | `autoplay` | **≈11.6 s** | yes (390 px wide) |
| 5 | links, cards, buttons | colour / border / opacity on hover | CSS | 0.2 s and 0.4 s | n/a |

GSAP's own declared durations corroborate the sampling: `gsap.globalTimeline` carries a
tween of **12 s with `repeat: -1`** and one of **1.33 s with `repeat: -1`** — exactly the
orbit period and the capability-ring period measured independently from the DOM.

### The orbit, measured precisely

Held at a fixed scroll position, sampling every 500 ms for 12.53 s:

```
elapsed        12.53 s
travelled      -369.9°
rate           -29.51 °/s
period         12.2 s        ← matches GSAP's declared 12 s repeat:-1
```

Radius is **not constant** — it sweeps `560 → 550 → 532 → 506 → 471 → 430 → 380 → 327`
and back. The items are on a **shared ellipse, not a circle**, so they appear to advance
toward the viewer and recede. Item 3 is phase-offset against item 0: while item 0's radius
shrinks `560 → 327`, item 3's grows `277 → 473`. Nine items, evenly phase-offset, one
shared 12.2 s ellipse.

`.circle-wrapper` itself never moves (`transform` constant at `0,0`). **Only the items
inside orbit.** The container is a static frame.

### What is anchored

Everything else. All type, all layout, all full-bleed imagery, every card, every heading.
`.investors-circle` holds a constant `translate(-85px, 453px)` at every scroll position —
a static placement, with a playing Lottie inside it. The distinction OMC draws is absolute:

> **Artwork animates. Layout never does.**

---

## 3. Per-section documentation

Twelve points per section, on a fixed schema so sections are comparable.

### 3.1 Hero

| # | Point | Finding |
|---|---|---|
| 1 | What moves | The hero Lottie's vector content only — 900 × 900, inside `.hero-text-container` |
| 2 | What stays anchored | h1, sub-line, every CTA, the header, the gutter |
| 3 | Travel distance | 0 px — the *container* never translates; motion is internal to the vector artwork |
| 4 | Trigger | Page load, `autoplay` attribute |
| 5 | Duration | 347 frames @ 30 fps ≈ **11.6 s**, one pass |
| 6 | Loop | Internal `loop` reads `false`; the element carries a `loop` attribute. Plays once in measurement; treat as **one long pass, not a fast cycle** |
| 7 | Easing | Baked into the Lottie; not a CSS curve |
| 8 | Scroll-linked | **No.** Advances identically whether scrolling or held still |
| 9 | Scroll-out behaviour | None. Scrolls away in normal document flow, keeps playing |
| 10 | Entry state | Fully painted at 0.00 s. No fade-in, no reveal, no "from" state |
| 11 | Mobile | Present and playing, scaled 900 → **585 px**. Not disabled |
| 12 | Reduced motion | Not honoured — no `prefers-reduced-motion` handling observed. **Kreated must do better here** |

### 3.2 Capabilities / circle orbit

| # | Point | Finding |
|---|---|---|
| 1 | What moves | 9 × `.circle-orbit-item`, plus a 120-frame Lottie in the centre |
| 2 | What stays anchored | `.circle-wrapper` (the frame), the section heading, all labels' type |
| 3 | Travel distance | Each item sweeps a full ellipse — radius **327 → 560 px**, a 233 px radial excursion |
| 4 | Trigger | Load. Already mid-rotation before the section is scrolled to |
| 5 | Duration | **12.2 s** per revolution, continuous |
| 6 | Loop | Infinite (`repeat: -1`) |
| 7 | Easing | Linear — angular rate is a flat 29.51 °/s across the whole sample |
| 8 | Scroll-linked | **No.** Proven by rotation continuing with `scrollY` pinned at 0 |
| 9 | Phase | 9 items evenly offset on one shared ellipse |
| 10 | Perceived depth | The radius sweep is what sells it — items advance and recede rather than spinning flat |
| 11 | Mobile | **Still running**, all 9 items, ring scaled to 223 px |
| 12 | Reduced motion | Not honoured. **Kreated must gate this** |

### 3.3 Full-bleed image band (`.omni-card`)

| # | Point | Finding |
|---|---|---|
| 1 | What moves | **Nothing** |
| 2 | Transform at every scroll position | `matrix(1, 0, 0, 1, 0, 0)` — sampled at y = 0, 1400, 1800, 2400, 3000, 3600, 4078 |
| 3 | Viewport tracking | `vpTop` 2423 → 1023 → 623 → 23 → −577 → −1177 → −1655, i.e. **exactly 1:1 with scroll** |
| 4 | Parallax | **None.** This is the single most important negative finding |
| 5 | Crop shift | None |
| 6 | Scale on entry | None |
| 7 | Mask reveal | None |
| 8 | Trigger | n/a |
| 9 | Entry state | Fully visible at scroll 0 |
| 10 | Hover | None |
| 11 | Mobile | Same — static |
| 12 | Reduced motion | n/a — nothing to reduce |

**The brief proposed "slow image translation / crop shift / counter-movement" for
Kreated's Work section. OMC does none of that.** Adding it would move Kreated away from
OMC, not toward it. Flagged in §5.

### 3.4 Investors band

| # | Point | Finding |
|---|---|---|
| 1 | What moves | The 348-frame Lottie's internal vector content |
| 2 | What stays anchored | `.investors-circle`, at a constant `translate(-85px, 453px)` |
| 3 | Travel distance | 0 px of container travel |
| 4 | Trigger | Load, `autoplay` — **not** entry into viewport |
| 5 | Duration | ≈**11.6 s**, one pass |
| 6 | Consequence of load-trigger | On a slow scroll the animation has largely finished before it is reached. OMC accepts this |
| 7 | Easing | Baked into the Lottie |
| 8 | Scroll-linked | No |
| 9 | Entry state | Fully painted from scroll 0 |
| 10 | Hover | None |
| 11 | Mobile | Present, scaled to 390 px |
| 12 | Reduced motion | Not honoured |

### 3.5 Header

Measured with an unreliable selector this pass — it resolved to a 4978 px page wrapper,
not the bar. **The original teardown's finding stands and is not re-confirmed here:**
91 px, `position: relative`, **not sticky**, does not return on scroll-up. Treat as
carried forward, not freshly measured.

Kreated's deliberate divergence (header returns on scroll-up carrying the primary CTA) was
already recorded in [`OMC_KREATED_TRANSLATION.md`](../concepts/OMC_KREATED_TRANSLATION.md)
as one of three accepted divergences. It stays.

### 3.6 Section transitions

| # | Point | Finding |
|---|---|---|
| 1 | Reveal on entry | **None anywhere on the page** |
| 2 | Staggered children | None |
| 3 | Opacity ramp | None |
| 4 | Transform ramp | None |
| 5 | IntersectionObserver-driven classes | None observed |
| 6 | Divider animation | None |
| 7 | Background colour transition on scroll | None |
| 8 | Pinning | None |
| 9 | Scroll-jacking | None |
| 10 | Smooth-scroll library | None — native scroll |
| 11 | Mobile | Same |
| 12 | Net effect | The page feels **fast**, because nothing is ever withheld from the reader |

### 3.7 Hover / CTA

| # | Point | Finding |
|---|---|---|
| 1 | Properties animated | colour, border-colour, background, opacity |
| 2 | Transform on hover | Minimal to none |
| 3 | Duration | **0.2 s** standard, **0.4 s** on pill controls |
| 4 | Easing | `ease-in-out` and `cubic-bezier(.4, 0, .2, 1)` |
| 5 | Delay | None |
| 6 | Scale | None |
| 7 | Shadow | None |
| 8 | Underline behaviour | Colour/border only |
| 9 | Focus state | Present, matches hover |
| 10 | Touch | No hover equivalent added |
| 11 | Mobile | n/a |
| 12 | Consistency | Two durations across the whole site, no exceptions |

---

## 4. Mobile differences

Re-measured independently at **390 × 844** with `mobile: true`:

- The orbit **still runs** — 9 items, still advancing over time.
- All **three Lotties are present and displayed**: 585 px, 223 px, 390 px.
- Document height grows 4978 → **5679 px** (stacking, not motion change).
- **No motion is removed on mobile.** OMC scales its artwork down and keeps every
  animation running.

This contradicts the brief's expectation that mobile should "reduce travel, overlap and
masking." OMC reduces *size*, not *motion*. Kreated can still choose to reduce on mobile
for battery reasons — but it should be an explicit Kreated decision, not attributed to OMC.

---

## 5. What this means for Kreated — and one thing I need to flag

### Confirmed for implementation

1. **The hero artwork must be continuously alive.** This is the single biggest gap. The
   current prototype's art placeholder is completely inert; OMC's equivalent region has an
   11.6 s animation playing from load.
2. **The capability contours should orbit** — one shared ellipse, ~12 s, linear, phase-offset
   across the 5 contours, with a radius sweep so they advance and recede. The existing
   `caps` SVG is the right substrate for this.
3. **A slow ambient loop somewhere in the conversion/footer region**, matching the
   investors band's role.
4. **Keep every hover at 0.2 s / 0.4 s.** Already correct.
5. **Add nothing scroll-linked.** Already correct — and now for a documented reason.

### The divergence I need to flag before building

The brief instructs: *"Favor actual scroll-progress mapping where OMC does it"* and asks
for scroll-linked hero artwork, a scroll-driven capability orbit, a mask reveal in One
Connected Presence, and image translation in Work.

**OMC does none of these.** Zero ScrollTriggers, zero scroll-linked transforms, zero
reveals, zero parallax. Implementing them would make Kreated *less* faithful to OMC while
appearing to be a fidelity correction.

Under the stated rule — *"OMC controls the motion grammar. Kreated controls the art
direction"* — the grammar is **continuous ambient motion in the artwork, total stillness in
the layout.** That is what I intend to build, and it does deliver what the note actually
asked for: the prototype will stop feeling static.

I am flagging this rather than silently substituting, because it is a real departure from
the written instruction. If Skyler wants scroll-linked motion regardless, that is a
legitimate Kreated divergence — but it should be recorded as a divergence from OMC, not as
OMC fidelity.

### Reduced motion

OMC does **not** honour `prefers-reduced-motion`. Kreated will, regardless: reduced motion
stops the orbit and the ambient loops at a composed resting frame, with no hidden content
and no layout difference. Because none of the motion gates content, this is clean.

---

## 6. Measurement provenance

- Unthrottled headless Chrome, `--headless=new`, `Page.setWebLifecycleState('active')`,
  `Emulation.setFocusEmulationEnabled`, `--autoplay-policy=no-user-gesture-required`.
- Consent dismissed by clicking `#onetrust-reject-all-handler`, then `body` verified back
  at `position: relative` and `scrollHeight` 4978 before any sampling.
- Orbit period from 26 samples at 500 ms over 12.53 s at a fixed scroll position.
- Scroll independence from 8 positions, y = 0 → 4078, transforms compared per position.
- Mobile from an independent run at 390 × 844.
- Probe harness: `scratchpad/probe.py` (session scratch, not committed).

No figure in this document is estimated. Where a measurement was unreliable (§3.5) it is
labelled as carried forward rather than re-measured.

---

## 7. What was built, and what it measured

Implemented in `prototype/omc-kreated-home/styles.css` (`AMBIENT MOTION` block).
All CSS keyframes — no JavaScript, no rAF, no library, no WebGL, nothing scroll-linked.

| Device | Motion | Period |
|---|---|---|
| 5 capability contours | one shared ellipse, linear, evenly phase-offset by 2.44s, ±52 / ±34px, ±4% scale sweep | **12.2s** |
| Hero art slot edge | drift, −26 / +40px | 23.2s |
| Hero art slot edge stroke | dash creep | 11.6s |
| Hero art slot field | opacity breath, .86 → 1 | 23.2s |

Kreated runs **three** ambient devices to OMC's four, because OMC has four decorative
devices and Kreated has two. No new decorative device was invented to close the gap —
`OMC_FIDELITY_CORRECTION.md` records that inventing devices is how the previous pass went
wrong. The conversion section stays hover-only, matching OMC's chrome-free conversion.

### Amplitude was calibrated, not guessed

The first implementation used ±18 / ±12px, reasoning that Kreated's contours are far
larger than OMC's 302px devices so the excursion had to shrink. Captured two frames half
a period apart, that changed **0.10%** of the section's pixels — perceptually invisible,
which is precisely the failure this pass exists to correct. Raised to ±52 / ±34px:
**0.29%** changed, and the travel is legible when the frames are blended.

104px of horizontal travel is ~45% of OMC's 233px radial excursion, on contours roughly
1.6× the size of OMC's devices. Spread over 12.2s that is ~8.5px/s — drift, not slide.

Note that "% pixels changed" badly understates perceived motion for sparse line art: a
1px stroke moving 100px only changes about twice its own path length in pixels, while
continuous movement is highly salient to the eye. The metric was used to catch the
invisible case, not to set the final value.

### Verified

| Check | Result |
|---|---|
| All 5 contours carry distinct phases | ✅ 5 distinct offsets at a single instant |
| Every contour travels | ✅ measured x −50.6 → +49.2, y −32.5 → +33.6 |
| Nothing scroll-linked | ✅ by construction — CSS keyframes, no scroll input, no scroll-timeline |
| Horizontal overflow, full cycle | ✅ 0px at 1440 **and** 390 |
| Console errors | ✅ none at either width |
| Motion present on mobile | ✅ running at 390px, matching OMC |
| `prefers-reduced-motion` | ✅ all transforms `none`, `will-change` released, all labels visible, nothing hidden |

### Instrumentation note

Both original measurement failures were avoidable and are worth guarding against in
future passes: **dismiss consent by clicking its real reject control** rather than hiding
the banner (hiding leaves `body { position: fixed }` behind), and **never measure
time-based motion in a throttled or backgrounded browser** — verify a frame counter is
actually advancing before trusting any "nothing moves" conclusion.

One further trap hit during verification: the prototype sets `scroll-behavior: smooth`,
so a screenshot taken shortly after `scrollIntoView` lands mid-scroll and any frame
comparison is contaminated by scroll offset rather than showing motion. Capture with
page-absolute clip coordinates at scroll 0 instead.
