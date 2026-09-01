# OMC.COM TEARDOWN

**Reference:** <https://www.omc.com/> — the current Omnicom homepage
**Inspected live:** 2026-08-21, connected Chrome, at **1440×900** and **375×812**
**Purpose:** structural / interaction reference for Kreated V2. Not a source of copy,
imagery, marks or palette.
**Status:** research. Nothing here is a Kreated decision. Decisions live in
[`concepts/OMC_KREATED_TRANSLATION.md`](../concepts/OMC_KREATED_TRANSLATION.md).

Everything below was measured in the live DOM, not recalled. Where a number is an
estimate it says so.

---

## 1. Page structure

Total document height at 1440×900: **4977px — 5.53 viewports.** That is short for a
holding-company homepage, and it is the first thing worth noticing.

| # | Section | Scroll top | Height | Surface |
|---|---|---|---|---|
| — | Header | 0 | 91 | transparent, scrolls away |
| 1 | Hero | 91 | **900 (exactly 1.0 vh)** | white |
| 2 | Connected Capabilities | 991 | 1015 | white |
| 3 | Omni platform | 2006 | 982 | white → **black** card band |
| 4 | A record of sustained growth | 2989 | 900 | full-bleed photograph |
| 5 | What's new | 3889 | 704 | #F8F8F8 |
| 6 | Footer — Stay connected | 4592 | 385 | #000 |

Six sections. Every one of them is between 0.4 and 1.15 viewports tall. Nothing is a
"scroll experience"; each section is a single readable screen.

**Value rhythm:** white → white → black → photograph → light grey → black.
Predominantly light, punctuated twice by full-black bands and once by a photograph.

---

## 2. Hero anatomy

```
1440 × 900 (the band below the 91px header)

x=177 ┌─────────────────────────────────────────────┐ 178px free
      │  [OMNICOM]  ← 288×44 <img>, line 1 of the h1│
      │  The world's leading marketing              │
      │  and sales company                          │
      │                                             │
      │  ┌────────┐   ┌──────────┐                  │
      │  │ label  │   │ body     │                  │
      │  │ 184px  │   │ 380px    │                  │
      │  ├────────┤   │          │                  │
      │  (hairline)   └──────────┘                  │
      └─────────────────────────────────────────────┘
         ↑ x=422 (245px from the gutter)
```

- **The wordmark is the first line of the `<h1>`.** Not a separate lockup above it —
  an `<img class="hero-logo">` 288×44 sitting inside the heading, followed by a `<br>`.
  The company name and the positioning statement are one typographic object.
- **Headline occupies 1085px of 1440 — 75.3% of viewport width** — and breaks across
  3 lines (wordmark + 2). It leaves **178px, 12.4%, open on the right.**
- Headline block sits at y 328–572 within the 900px band; the label/body row at
  632–754. Content is optically centred with more air below than above.
- **There is no CTA in the hero.** No button, no link. Omnicom does not need one.
- The only decoration is a large orange arc entering from the right, partly behind and
  partly in front of the type, bleeding off the top and right edges.

---

## 3. Typography hierarchy

Two families. **Instrument Sans** for everything structural, **Cormorant Garamond**
italic as an editorial accent voice.

| Role | Desktop | Mobile | Notes |
|---|---|---|---|
| Hero h1 | **72 / 79.2 (1.10), w400, ls −1.32px (−0.018em)** | 52 / 57.2 (1.10) | −28% on mobile |
| Hero accent words | **Cormorant Garamond italic 91.44 w600** | 66.04 w600 | **exactly 1.27× the sans**, same line-height |
| Section h2 | 37.44 / 37.44 (**1.00**), w600–700, ls −0.9px or normal | 32 / 32 | −15% on mobile |
| Section lead paragraph | **Cormorant Garamond 23.2 / 27.376 (1.18) w400–500** | unchanged | the editorial voice |
| Card title h3 | 23.44 / 31.18 (1.33) w600 ls −0.464 | — | |
| Pill label | 14.4 / 20.16 w600 | unchanged | over a `blur(8px)` frosted plate |
| Hero label | 16.46 / 16.46 (**1.00**) w700 | unchanged | |
| Body | 16 / 24.48 (1.53) w500 | **unchanged** | |
| Nav | 15 / 60 w500 | — | |
| Footer h2 | 48 / 57.6 w600 | **65 / 78** | the one thing that gets *bigger* on mobile |

Three things worth stealing outright:

1. **Display line-heights are 1.0–1.1.** Section headings are set solid (37.44/37.44).
   That single choice does most of the "editorial" work.
2. **The serif accent is sized 1.27× the sans** so the two optically match on a shared
   baseline. It is never used for a whole heading — only for one or two words inside a
   sans headline, and for lead paragraphs.
3. **Body, labels and lead paragraphs do not change size between desktop and mobile.**
   Only the two display sizes shrink. The whole responsive type system is two numbers.

---

## 4. Spacing and grid

| | Desktop 1440 | Mobile 375 |
|---|---|---|
| Main gutter | **177px (12.3vw)** | **32px (8.5vw)** |
| Secondary gutter (news, footer) | 120px (8.3vw) | 32px |
| Content measure | 1085px max (75vw) | 311px (83vw) |
| Section heights | 704–1015px | — |
| Body column | 380px | 311px |
| Label column | 184px | full width |
| Card | 312 wide, 408 pitch (96 gap) | stacked |
| Capability circle | 302 × 302, radius 50% | one focused |
| Card corner radius | **21px** | 21px |

There is no visible column grid. Blocks are placed at a small number of x positions
(177, 422, 857, 885) and left to breathe. Text columns never exceed ~410px even when
the page is 1440 wide — **roughly 60–70 characters, in a 1440px window.** The
restraint is in refusing to fill the width, not in a grid.

Mobile page height is 5675px against desktop's 4977 — **only 14% taller.** Sections
compress rather than unstacking into a long scroll.

---

## 5. Section architecture, in order

### 1 · Hero — 900px, white
Purpose: say who they are and what they claim, once, at scale. See §2.
Transition out: none. The orange arc simply continues into section 2.

### 2 · Connected Capabilities — 1015px, white
- **Left ~60%:** capability names on an **orbit** — 302×302 hairline-outlined circles
  arranged on a circular path, each one a real link (`.circle-orbit-item`), each label
  in Cormorant Garamond italic ~37px. Scroll drives rotation; items travelling fastest
  are motion-blurred, the item at focus is sharp.
- **Right ~40% (x857, 410px wide):** frosted pill label `• Connected Capabilities` →
  bold sans h2 (2 lines) → Cormorant italic lead paragraph → **black pill button plus a
  separate circular arrow button**.
- This is the site's signature interaction, and it is also its primary navigation into
  the capability pages. The decoration *is* the menu.

### 3 · Omni platform — 982px, white heading band over a black card band
- Same header pattern, mirrored: label and h2 on the **left** (x177), Cormorant lead
  paragraph on the **right** (x859, 403px), pill CTA below the heading.
- Below: a **horizontally scrolling row of 6 black cards** (radius 21px) over a soft
  blurred metallic backdrop. Each card: sans title, line-art circular icon, one
  Cormorant italic caption line. First card is a solid blue brand card.
- Controls: two circular ← → buttons bottom-left, a dash-and-dots progress indicator to
  their right. Cards are 274px wide on a 376px pitch.

### 4 · A record of sustained growth — 900px, full-bleed photograph
- Full-bleed warm dark photograph of a person working. Text overlaid in white:
  pill label top-left, h2 (2 lines), Cormorant italic paragraph top-right, and a
  **blue** pill CTA + circular arrow.
- Note the accent colour changed. OMC uses **one accent per section** — orange in the
  hero, black through capabilities and Omni, blue here — rather than one global accent.

### 5 · What's new — 704px, #F8F8F8
- h4 headline top-left (43.2px), "View All" black pill + arrow top-right, a blue arc
  bleeding in from the left edge.
- Three white cards, 312px wide, radius 21px: title, then date bottom-left and a
  circular black arrow button bottom-right.

### 6 · Footer — 385px, black
- `Stay connected` at 48px with **"connected" in Cormorant italic** — the same accent
  move as the hero, closing the loop.
- Two link columns: Contact, Follow Us. Nothing else. No sitemap, no legal wall.

---

## 6. Motion system

**Libraries in play:** GSAP + ScrollTrigger, and a Lottie player. **No Lenis, no
Locomotive, no smooth-scroll library — scrolling is native.**

### The finding that matters most
**There is no scroll-reveal choreography.** Every heading, card and paragraph below the
fold reads `opacity: 1; transform: none; visibility: visible` while the page is still
at scroll 0. Nothing fades up. Nothing waits its turn. Content is simply present.

That single decision is most of why the site feels fast and expensive rather than
"animated". It is the opposite of the house style on most agency sites.

> **✅ CONFIRMED 2026-08-24.** Re-measured with scrolling genuinely working (the first
> pass was measured under a OneTrust scroll-lock). There is still no scroll-reveal, no
> parallax and no ScrollTrigger anywhere. This finding stands.
> See [`OMC_MOTION_TEARDOWN.md`](OMC_MOTION_TEARDOWN.md).

### Signature behaviour — exactly one
The **capability orbit** in section 2. Scroll position drives rotation around a
circular path; items carry a motion blur proportional to speed and resolve sharp at
focus. It is scroll-*driven*, not scroll-*jacking* — the page scrolls at normal speed
throughout.

Secondary, much quieter: the hero's orange arc parallaxes across the section boundary,
and the Omni band has a blurred backdrop that drifts.

### Ordinary micro-interaction
Short and conventional. Measured across ~2500 elements:

| Count | Transition |
|---|---|
| 18 | `color, background-color, border-color` · **0.2s ease-in-out** |
| 9 | `color` · 0.3s ease |
| 7 | `width, background-color` · **0.4s cubic-bezier(.4,0,.2,1)** (the pills expanding) |
| 4 | `opacity` · 0.3s ease |
| 4 | `all` · 0.25s ease-out |
| 1 | `opacity` · 0.8s — the longest duration anywhere on the page |

One blur filter exists site-wide: `.label-blur-bg`, `blur(8px)`, behind the pill
labels. That is the entire effects budget.

---

## 7. Navigation

- **Height 91px. `position: relative`. Transparent. Not sticky — it scrolls away and
  never comes back.** No sticky clone, no shrink-on-scroll, no scroll-up reveal.
- Desktop: small logo at x63 (131×20). Six links right-aligned across x612–1397 at
  15px/60px w500: About · Omni · Capabilities · Culture · Investors · News.
- Mobile: **hamburger only**, 34×34, top-right at x320. No logo in the bar — the
  wordmark's job is done by the hero.
- Header height is **91px on both** desktop and mobile.

Letting the nav leave is a confidence move: it says the page itself will carry you.
It is also the one behaviour Kreated should think hardest about copying (§11).

---

## 8. Image treatment

- Photography is **full-bleed or nothing.** The one photograph on the page occupies an
  entire 900px section, edge to edge, with type laid over it. There are no inset
  photos, no image cards with captions, no rounded thumbnails of people.
- Graphics are flat vector arcs in a single accent colour, allowed to bleed off two
  edges, sitting both behind and in front of type.
- Icons are line-art, monoline, inside a dotted circle. Consistent and restrained.
- **No device mockups. No browser chrome. No screenshots of software.** For a company
  whose main product section is an AI platform, that is a deliberate omission.

---

## 9. Mobile behaviour

- Gutter drops 177 → 32px. Content 311px wide.
- **Only the two display sizes shrink:** h1 −28% (72→52), h2 −15% (37.44→32). Body,
  labels and Cormorant lead paragraphs are byte-identical to desktop.
- Hero headline still occupies 80% of viewport width and now runs to 5 lines. It is
  not made "safe" — it stays enormous.
- The hero's two-column label/body block stacks, with the hairline rule going full
  width between them.
- The capability orbit **survives, simplified**: one focused circle with an orange
  progress ring (dots resolving into a solid arc), the active name centred in Cormorant
  italic, neighbours peeking off both edges. The signature is not deleted on mobile — it
  is reduced to its single most legible frame.
- Side-by-side text/visual pairs become stacked: text block, then visual.

---

## 10. Why it feels premium

Six concrete reasons, none of which are "it has nice animation":

1. **It refuses to fill the width.** A 410px text column inside a 1440px window, with
   12.3% gutters and 12.4% deliberately left empty beside the headline.
2. **Display type is set solid** (line-height 1.00–1.10) at 72px, with negative
   tracking. Tight, large, confident.
3. **Two families, used for two jobs**, with the serif reserved for accent words and
   lead paragraphs only. Never decorative, never a whole heading.
4. **The layout never moves; the artwork never stops.** ⚠️ *Corrected 2026-08-24 —
   the original wording, "almost nothing moves", was wrong.* There is no scroll-linked
   motion at all, but four animations run continuously from load: a 12.2 s infinite
   orbit of 9 items, a 1.33 s infinite Lottie loop, and two ~11.6 s Lottie passes.
   All of it is inside decorative artwork; no type or layout ever moves.
   Full measurements: [`OMC_MOTION_TEARDOWN.md`](OMC_MOTION_TEARDOWN.md).
5. **Six sections, 5.5 viewports.** It ends before it outstays its welcome.
6. **Value contrast does the pacing** — white, black, photograph, grey — instead of
   decoration doing it.

---

## 11. What should translate to Kreated

| Borrow | Why it works for a local-service-business buyer |
|---|---|
| **Wordmark as line 1 of the h1** | Establishes the name and the claim in one object, instantly |
| **Display type set solid at 1.0–1.1 with negative tracking** | Reads as editorial confidence, costs nothing, scales down cleanly |
| **Serif accent at 1.27× inside a sans headline** | Kreated already owns Cormorant Garamond. Free brand equity. |
| **Serif for lead paragraphs only** | Gives a "voice" without a second display face |
| **No scroll-reveal** | A busy contractor never waits for text to arrive |
| **Six sections, ≤6 viewports** | Respects the audience's patience |
| **Section header pattern:** pill label → h2 → serif lead → pill CTA + arrow | One repeatable unit; makes the page scannable |
| **The capability orbit as navigation** | Kreated's five services become the page's one signature moment, and it is a menu, not decoration |
| **Full-bleed photography or none** | Kreated's real client photography gets to be big |
| **Two type sizes change on mobile; nothing else does** | Trivially maintainable |
| **Value contrast for pacing** | Kreated inverts it: navy-dominant with light punctuation |
| **0.2s hovers, 0.4s pill expansion** | The entire micro-interaction budget |

---

## 12. What should NOT translate

| Do not borrow | Why |
|---|---|
| **A hero with no CTA** | Omnicom's buyer is an institution; Kreated's is a contractor who needs `Start a Project` visible at 0.00s. **This is the one place Kreated must diverge.** |
| **A non-sticky nav that never returns** | Acceptable for a corporate site being read top-to-bottom. Kreated needs a persistent route back to conversion. |
| **The light-dominant palette** | Kreated's anchor is dark navy. Borrow the *rhythm*, invert the *values*. |
| **Orange and blue accents** | Omnicom's colours. Kreated's accent is an open decision. |
| **Instrument Sans specifically** | Using the reference's own face is how this becomes a reskin. |
| **The AI-platform section** | Kreated must not read as an AI company. Explicitly banned. |
| **Investor / financial content** | Kreated is not publicly traded. There is no equivalent and inventing one would be fabrication. |
| **A news / press card row** | Kreated has no news. The slot is better spent on conversion. |
| **Culture / inclusion navigation** | Holding-company furniture. |
| **Motion blur on the orbit** | Adds visual noise for no comprehension gain at Kreated's scale. |
| **Six top-level nav items** | Kreated's structure is five services plus two conversions. |
| **Cards for everything** | OMC earns its cards with volume Kreated does not have. |
