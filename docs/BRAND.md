# BRAND

**Known identity assets and stated preferences only.**

🚫 This is **not** a design system. No palette has been created. No tokens, no type scale, no
component rules, no surfaces, no materials. Those come after creative-concept approval (Step 3) and
signature-visual approval (Step 4).

Two sources are separated below, because they do not fully agree:
**(A) Skyler's stated V2 preferences** — current, and authoritative.
**(B) V1's implemented identity** — historical record, useful, **not authoritative for V2.**

---

## A. Skyler's stated V2 preferences

Recorded 2026-08-19 at Step 1 kickoff. These are **direction, not a finished system.**

### Wordmark
- The official **KREATED** wordmark is the identity.
- **Cormorant Garamond** is the wordmark typeface.
- Wordmark is uppercase. Never written "KREATED" inside a sentence; prose form is **Kreated**.

### Typography — 🔴 INTENTIONALLY UNDECIDED (DECISION 011)
- The official **KREATED wordmark remains Cormorant Garamond.** This is settled.
- **The primary site sans is intentionally UNDECIDED.** Direction only: a bold, modern sans.
- 🚫 **Do not select the primary sans during Step 1.**
- 🚫 **Syne is NOT carried forward automatically** merely because V1 used it. It may be considered
  alongside any other candidate, with no incumbency.
- Typography candidates are explored **only after the central creative concept exists** (Step 3+).
- Cormorant Garamond's role beyond the wordmark is undecided.

### Colour
- **Dark navy** — a core V2 brand requirement (DECISION 012). **Confirmed as a requirement; the
  exact hex is intentionally NOT assigned.**
- 🚫 **Do not assign a final navy hex during Step 1.** Exact navy selection belongs to creative
  development, after buyer research and concept work.
- **Black / charcoal / white** — in the palette.
- **Chrome / silver** — in the palette.
- 🚫 **No broad light-blue / ice-blue design language.**
- 🚫 **The site must not become all-blue.**

### Creative posture
- Preference for **bold, creative, expressive** work.

### What is explicitly not decided
- **The primary sans** — undecided by ruling, not by omission
- **The exact navy hex** — undecided by ruling, not by omission
- Exact hex values for any other colour
- Which colour dominates and in what ratio
- Light surfaces vs. dark surfaces
- Type scale, weights, measures
- Any material, texture, gradient or motion language

---

## B. V1's implemented identity — historical record only

Imported so nothing is lost. 🚫 **Not to be copied into V2.** V1's homepage visual direction was
rejected by Skyler; see [`CREATIVE_PROCESS.md`](CREATIVE_PROCESS.md) §4.

### Typefaces V1 shipped
- **Cormorant Garamond** (300–400, upright + italic) — all display, headings, project names,
  pull-quotes. Self-hosted variable WOFF2, SIL OFL.
- **Syne** (400–700) — all labels, nav, buttons, body copy, micro-captions. Self-hosted variable
  WOFF2, SIL OFL.

⚠️ **Conflict with §A, resolved.** V1 used Cormorant Garamond as the *display* face across the whole
site and Syne as the sans. §A wins: Cormorant is the **wordmark** face, and the primary sans is
**intentionally undecided** (DECISION 011).

🚫 **Syne has no incumbency.** It is not carried forward automatically because V1 used it. If it is
ever chosen for V2, that is a fresh decision made against the approved creative concept, competing
on equal footing with every other candidate.

### Wordmark mechanics V1 used
`KREATED` in Cormorant Garamond 300, `letter-spacing: 0.22em`, with `margin-right: -0.22em` to
cancel trailing tracking so the optical right edge is correct. At ≤560px both drop to `0.18em`.
Rendered as **live text**, not an image.

⚠️ Useful mechanical detail. Whether V2's wordmark is text or a produced asset is undecided.

### Colour V1 shipped
Near-black base `#05070A` with layered radial gradients in **cobalt** and **ice**, plus **silver**,
plus **amber reserved exclusively for honest status** ("in progress", form errors).

⚠️ **Conflict with §A, resolved.** V1's palette was near-black + cobalt + ice — close to the "broad
light-blue / ice-blue design language" and the "all-blue" outcome Skyler has ruled out. **§A wins.**
Dark navy is a confirmed V2 requirement (DECISION 012); V1 has no navy token, so nothing here is a
source for it. 🚫 Do not derive a V2 navy from V1's cobalt or `#05070A`.

### The "one light surface" law
V1's governing colour rule: one light surface per site (a single silver positioning panel on the
homepage); ice is an accent, never a fill; amber means "not finished" and nothing else.

⚠️ Recorded as an interesting constraint that worked. Not inherited.

### Materials V1 used
Near-black depth · smoked glass (`backdrop-filter: blur()`) · metallic seam / chrome hairlines ·
fluid metal (WebGL hero field, 2D canvas ribbon).

🚫 **Not inherited.** The ribbon, the WebGL hero field and the chrome hairline system are part of
the rejected visual implementation.

---

## C. Voice and naming — imported as still-useful

Naming rules are factual and carry forward:

| Context | Correct form |
|---|---|
| Prose, sentences, meta descriptions | **Kreated** |
| Visual wordmark | **KREATED** |
| The method (nav label) | **Kreated Method** (no article) |
| The method (page H1) | **The Kreated Method** (with article) |
| The audit offer (public-facing) | **Free Website Audit** — DECISION 010. 🚫 Not "Kreated AI Audit" |
| Founder | **Skyler Reyes** first mention, **Skyler** thereafter |

🚫 Never "KREATED" in a sentence. 🚫 Never lowercase "kreated". 🚫 Never abbreviate to "K."

### Voice characteristics V1 established
Short, declarative, one idea per sentence. Em dash as house punctuation for a turn in the argument.
Second person for the customer's problem, third person for the agency. US English. Headings state a
judgement, not a topic.

### Personality, priority-ordered (V1)
1. Precise · 2. Confident · 3. Honest · 4. Material · 5. Warm

**Anti-personality:** not playful, not disruptive, not scrappy, not a "startup", not enterprise
SaaS, not a logo portfolio, not a growth-hacker. No emoji, no exclamation marks in body copy.

⚠️ Note a tension worth resolving: V1's personality leads with **Precise**; Skyler's V2 preference
is **bold, creative, expressive**. These are compatible but not identical. ❓ Needs Skyler at Step 3.

### Banned words (V1)
`solutions` · `leverage` · `synergy` · `best-in-class` · `cutting-edge` · `passionate` ·
`we'd love to` · `reach out` · `game-changer` · `revolutionary` · `seamless` (unless a literal seam)
· `stunning` · `beautiful` (about our own work) · `award-winning` · `trusted by` · any superlative
that cannot be evidenced.

### Load-bearing words (V1)
`built` · `decided` · `connected` · `system` · `evidence` · `delivered` · `in progress` ·
`foundations` · `visibility` · `conversion` · `scoped` · `documented`.

---

## D. Open brand questions

**Resolved 2026-08-19 as deliberately deferred, not as unknowns:**
- The primary sans — **undecided by ruling** (DECISION 011), explored only after the concept exists
- The exact navy — **undecided by ruling** (DECISION 012), selected during creative development
- The "close the gap" positioning — **HISTORICAL / COPY CANDIDATE**, not approved (DECISION 013)

**Still genuinely open:**
- ❓ Is Cormorant Garamond wordmark-only, or does it keep an editorial display role?
- ❓ Does the KWLG monogram (see [`ASSETS.md`](ASSETS.md)) become part of the V2 identity, and does
  Cormorant + monogram lock together?
- ❓ Does "Precise" still lead the personality order, or does "Bold / Expressive"?
- ❓ Do V1's banned-words and load-bearing-words lists carry into V2, given that they were written
  for a "Precise"-led voice?
