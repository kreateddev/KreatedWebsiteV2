# OMC → KREATED TRANSLATION

**Source:** [`research/OMC_TEARDOWN.md`](../research/OMC_TEARDOWN.md)
**Date:** 2026-08-21
**Status:** proposal for the first shell. Nothing here is approved. Skyler rules.

The question this answers is not "how do we look like Omnicom." It is:
**what would OMC.com be if it had been designed for Kreated and for a contractor with
thirty seconds?**

Rule used throughout: **OMC's structural logic wins.** Where Kreated diverges, the
divergence is listed explicitly with a reason, and there are only three.

---

## 0. The three deliberate divergences

| # | OMC | Kreated | Why |
|---|---|---|---|
| 1 | Hero has **no CTA** | Hero carries **all three routes at 0.00s** | Omnicom's buyer is an institution on a considered journey. Kreated's is an owner-operator who may click once. `docs/CONVERSION.md` makes this non-negotiable. |
| 2 | Nav **scrolls away and never returns** | Nav returns on scroll-up, carrying `Start a Project` | Same reason. The route back to conversion cannot be a scroll-to-top exercise. |
| 3 | **Light**-dominant with black punctuation | **Navy**-dominant with light punctuation | Dark navy is a locked Kreated anchor (DECISION 012). The *rhythm* is borrowed; the *values* are inverted. |

Everything else follows OMC.

---

## 1. Page architecture

**OMC DOES** — six sections, 5.53 viewports, value-contrast pacing.

**→ KREATED VERSION** — six sections, target ≤6 viewports, inverted value rhythm.

| # | OMC section | → Kreated section | Surface | Homepage job served |
|---|---|---|---|---|
| 1 | Hero | **Hero** | deep navy | establish Kreated · state what it does · next step |
| 2 | Connected Capabilities (orbit) | **The five services** (orbit) | deep navy | explain services simply |
| 3 | Omni AI platform (+ card row) | **One connected presence** | **light** | demonstrate thinking · create desire |
| 4 | A record of sustained growth (photo) | **Work** | full-bleed photograph | show real work · create trust |
| 5 | What's new (news cards) | **Start a project** | deep navy | low-friction next step · immediate project path |
| 6 | Stay connected (footer) | **Footer** | navy-black | contact |

Sections 5 and 6 are where Kreated departs from OMC's *content* while keeping its
*shape*: OMC's news row and Kreated's conversion band are the same structural slot.

---

## 2. Hero

**OMC DOES**
Wordmark as line 1 of the `<h1>`; headline at 72/79.2 filling 75% of viewport width and
leaving 12.4% open on the right; two accent words in Cormorant Garamond italic at
1.27×; below it a 184px bold label, a hairline rule, and a 380px body column; no CTA;
one large flat graphic bleeding off two edges. Band is exactly 1.0vh.

**→ KREATED VERSION**
Identical anatomy. `KREATED` in Cormorant Garamond becomes line 1 of the `<h1>` —
which is *more* correct here than at OMC, because the wordmark genuinely is the brand
face rather than a logo image. Headline in the bold sans with one or two words in
Cormorant italic at 1.27×. Same label / rule / body row beneath.

Then the divergence: **the three routes sit directly under the body column, present and
clickable at 0.00s** — `Start a Project` (solid), `Free Website Audit` (outline),
`View Work` (underlined text).

Hero graphic: **no invented material, no metaphor, no fluid.** The Aperture / Pour /
Every Surface hero experiments are superseded. The hero's visual interest comes from
type scale, the serif accent, and negative space — exactly as OMC's does. If a graphic
is wanted later it is a separate decision.

Copy candidate, unapproved:
> KREATED
> **Make your business the obvious *choice*.**
> label: Built for owner-operated companies.
> body: Web design, branding, and local SEO — built so the right customers find you,
> compare you, and call you.

---

## 3. Services

**OMC DOES**
A global capability list rendered as an orbit of 302×302 hairline circles, each a real
link, labels in Cormorant italic, scroll-driven rotation, motion blur on the fast
items, one item sharp at focus. Text block on the opposite side with pill label → h2 →
serif lead → pill CTA + circular arrow.

**→ KREATED VERSION**
The same orbit, with **Kreated's five service families** as the five circles:

- Web Design & Development
- Website Redesign
- Local SEO
- Google Business Profile
- Brand Strategy & Identity

Five reads better than OMC's dozen — the ring is legible in one glance rather than
needing to be scrolled through. Each circle is a real link to its service route
(`docs/SEO.md` owns those paths). Labels in Cormorant italic, matching OMC's treatment
and Kreated's own wordmark face.

**Drop the motion blur.** OMC uses it to manage a crowded ring; Kreated's five items
never move fast enough to need it, and it costs legibility.

Text block: pill label `• Services` → h2 → Cormorant lead → `See all services` pill +
arrow.

---

## 4. One connected presence — the "platform" slot

**OMC DOES**
Its most technical section: an AI platform, explained by a heading pair plus a
horizontally scrolling row of six black cards, each with a title, a monoline circular
icon and a one-line serif caption.

**→ KREATED VERSION**
Kreated has no platform and **must not imply one** — an AI-company read is explicitly
banned. But it has something true that occupies the same argumentative slot: the
website, the phone-sized version of it, the Google Business Profile and the brand are
**one connected presence**, and most local businesses run them as four disconnected
things.

So the slot becomes the argument, not a product. Four cards instead of six:

| Card | Says |
|---|---|
| The website | Where the decision actually gets made |
| On a phone | Where most of them will see it first |
| Google Business Profile | Where they find you before they ever reach the site |
| The brand | What makes all three look like the same company |

This is **where the retired Every Surface concept comes back** — as a below-fold
demonstration, at OMC's card scale, never as the hero. The existing prototype in
`prototype/every-surface/` remains the working reference for how the demonstration
behaves if this section is later built out.

Surface: **light (#F4F5F7)** — this is the inverted punctuation band, standing where
OMC's black band stands.

---

## 5. Work

**OMC DOES**
One full-bleed photograph occupying an entire 900px section, white type overlaid
top-left, serif paragraph top-right, an accent pill CTA. No inset images anywhere on
the page.

**→ KREATED VERSION**
Same treatment, real client photography.

- **Leak Locators East Coast** — homepage Work candidate (DECISION 007). Real
  photography exists in the LLEC asset pack.
- **Rare Raleigh Restoration** — homepage Work candidate (DECISION 008), **status
  language locked to `Strategy delivered · implementation in progress`**. Nothing may
  imply launched, live, complete or measured.
- LearnSmart is real work but **not** a homepage default (DECISION 007).

**No invented results.** No metrics, no percentages, no rankings, no review counts.
Where an asset does not exist it ships as labelled placeholder geometry, never as a
stand-in image. Client photography carries **RIGHTS TO CONFIRM BEFORE PUBLIC USE**
(DECISION 014) and that constraint travels with this section.

---

## 6. Start a project — the conversion band

**OMC DOES**
A news card row: section headline top-left, `View All` pill top-right, three cards.

**→ KREATED VERSION**
Kreated has no news, and inventing a "latest thinking" row to fill the shape would be
furniture. The slot keeps its geometry and changes its job: **the closing conversion
band**, the second and last place the three routes appear.

Same anatomy — headline top-left, supporting pill top-right, a row beneath. The row
holds the two conversions at card scale rather than three articles.

---

## 7. Footer

**OMC DOES**
385px, black, `Stay connected` at 48px with the second word in Cormorant italic,
two link columns, nothing else.

**→ KREATED VERSION**
The same, at Kreated's scale — the italic-accent move closing the loop with the hero,
Kreated's real contact details from `docs/BUSINESS.md`, service links, and nothing
that is not true. No sitemap wall, no legal apparatus in the shell.

---

## 8. Typography

**OMC DOES**
Instrument Sans for structure, Cormorant Garamond italic as an accent voice; display
set solid at 1.0–1.1 with negative tracking; the serif at 1.27× the sans; body and
labels identical across breakpoints.

**→ KREATED VERSION**

| Role | Face | Status |
|---|---|---|
| Wordmark | **Cormorant Garamond** | ✅ settled (DECISION 011) |
| Structural / display / UI | **Archivo** — bold modern sans | 🔴 **TEMPORARY.** Chosen for the shell only. Not Instrument Sans, deliberately, so this does not become a reskin. Syne has no incumbency (DECISION 011). |
| Accent words + lead paragraphs | **Cormorant Garamond italic**, 1.27× | 🟡 **TYPE CANDIDATE — NOT APPROVED.** See below. |

**The Cormorant question, flagged for a ruling.** OMC's single most distinctive
typographic move is a serif italic accent inside a sans headline — and the face it uses
happens to be the one Kreated already owns. Adopting it costs nothing and buys real
brand equity.

But `docs/BRAND.md` records Cormorant's role beyond the wordmark as **undecided**, and
the brief for this reset says not to assume Cormorant becomes the display font. So the
shell uses it for **accent words and lead paragraphs only — never a whole heading,
never body, never UI** — and it is built behind a single switch so it can be removed in
one line. **This needs an explicit yes or no from Skyler.**

Scale, mirroring OMC's two-number responsive system:

| | Desktop | Mobile | Change |
|---|---|---|---|
| Hero h1 | 72 / 1.06, ls −0.02em | 50 / 1.06 | −30% |
| Section h2 | 38 / 1.02 | 32 / 1.02 | −16% |
| Serif accent | 1.27 × the sans | 1.27 × | — |
| Serif lead | 23 / 1.2 | 23 / 1.2 | none |
| Body | 16 / 1.55 | 16 / 1.55 | none |
| Pill label | 14 / 1.4, w600 | 14 / 1.4 | none |

---

## 9. Colour

**OMC DOES**
White-dominant. Black for cards, pills and footer. #F8F8F8 for one band. **One accent
per section** — orange in the hero, black through the middle, blue at the proof
section — rather than one global accent.

**→ KREATED VERSION**
Inverted, and inside the locked family (DECISION 012, `docs/BRAND.md` §A):

| Token | Value | Role |
|---|---|---|
| `--navy` | `#0B1220` | the anchor. Hero, services, conversion band. |
| `--navy-2` | `#101A2C` | second navy, for band separation |
| `--ink` | `#070C14` | navy-black. Footer. |
| `--paper` | `#F4F5F7` | the light punctuation band (§4) |
| `--white` | `#FFFFFF` | primary type on navy, and the primary pill |
| `--silver` | `#A6B0BF` | cool grey, secondary type |
| `--line` | `rgba(255,255,255,.16)` | the one hairline |

**No accent colour is invented.** Kreated's palette is explicitly unassigned beyond the
family, so the shell does not assign one: primary pills are white-on-navy (the inverse
of OMC's black-on-white), secondary pills are hairline outlines. The only chromatic
warmth on the page comes from **real client photography**, which is honest and is where
OMC's colour comes from too.

Whether Kreated adopts OMC's one-accent-per-section device is a live question, and a
good one — but it needs a palette decision first.

Constraints held: not all-blue · no light/ice blue language · no green, tan, olive or
earth tones · never dead grey.

---

## 10. Motion

**OMC DOES**
Native scroll. GSAP for one scroll-driven signature. **No scroll-reveal anywhere.**
0.2s ease-in-out hovers, 0.4s cubic-bezier(.4,0,.2,1) pill expansion, one 0.8s opacity
as the longest duration on the page. One `blur(8px)`.

**→ KREATED VERSION**
The same budget, and it is a hard ceiling.

- **No scroll-reveal.** Nothing on the page waits to be scrolled to. This retires the
  fade-up-on-enter pattern for V2.
- **Native scroll.** No smooth-scroll library, no scroll-jacking, no pinning.
- **One signature:** the services orbit, scroll-driven, no motion blur.
- Micro-interaction: 0.2s ease-in-out on colour/background/border, 0.4s
  cubic-bezier(.4,0,.2,1) on the pills. Nothing else.
- **No intro.** No load animation. The Aperture intro is superseded.
- `prefers-reduced-motion` freezes the orbit at its resting arrangement. Nothing else
  needs disabling, because nothing else moves.

**Set True survives as vocabulary, not as a concept.** UNCOVER / SEAT / ALIGN describe
how the few things that do move should behave — masked rather than faded, landing with
a decisive stop, resolving to precise edges. They are adjectives now, not a system.

---

## 11. Navigation

**OMC DOES**
91px, transparent, `position: relative`, scrolls away permanently. Six links
right-aligned. Mobile: hamburger only, no logo.

**→ KREATED VERSION**
91px, transparent, and it scrolls away — but **returns on scroll-up carrying
`Start a Project`** (divergence 2). Links: the five services under one `Services`
item, plus `Work` and `About`. Mobile: hamburger only, no logo in the bar, wordmark's
job done by the hero.

---

## 12. What is explicitly retired

Superseded by this direction. Preserved on disk as history, not deleted, and marked in
place:

| Retired | Was |
|---|---|
| **Aperture** | intro system |
| **The Pour** | hero material |
| **Every Surface as hero** | returns below the fold only (§4) |
| **Deciding Moment** | still reserved, still unspecified, still not in the hero |
| Same Standard · Wrong Lens · Open Reflection · Second Street | Step 3 concepts |
| The Install · Proof Bench · Cast Light | Step 4 photo frames |
| Process diagrams, rails, nodes, rings, signature metaphors | all of them |

The lesson written into this direction: **the last several rounds went looking for a
central visual metaphor. This one does not have one, on purpose.** The page is carried
by type scale, negative space, real client work, and a single restrained interaction.
