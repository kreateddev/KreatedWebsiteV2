# START HERE — Kreated Website V2

**Created:** 2026-08-19
**Owner:** Skyler Reyes
**Status:** STEP 1 — CLEAN PROJECT FOUNDATION
**Nothing here is designed. Nothing here is approved as visual direction.**

---

## 1. What Kreated V2 is

Kreated V2 is a **new website build for Kreated**, produced through an **asset-first creative
workflow**. The website is the *last* thing that gets built, not the first.

The order is deliberate: understand the buyer → decide the creative concept → make the signature
visual → approve it as a still frame → approve it in motion → produce supporting assets → *then*
build the page around assets that already exist and have already been approved.

## 2. Why this is a fresh project

The previous project (`KreatedWebsiteV1`) is a real, working, extensively documented static site.
Its **factual and business content is valuable and has been imported here.**

Its **visual implementation is not carried forward.** V1 went through many homepage design
iterations, all of which Skyler rejected. V1's own `START_HERE.md` §7 lists five rejected visual
concepts by name and records that the final visual redesign was never started, never approved and
never implemented.

Repeating that work by editing V1's accumulated CSS would reproduce the same failure. V2 therefore
starts from an empty `site/` directory and will be built from approved assets, not from inherited
stylesheets.

**V1 is READ-ONLY.** It has been inspected for facts only. Nothing in it was modified, deleted,
committed, pushed or deployed.

## 3. The current workflow

```
 1. Clean foundation          ← WE ARE HERE
 2. Buyer research
 3. Creative concept
 4. Signature visual
 5. Start-frame approval
 6. Motion approval
 7. Supporting visual assets
 8. Homepage build
 9. Browser critique
10. Consolidated revision
11. Responsive / technical QA
12. Netlify preview
13. Production launch
```

Full definition, including the absolute rule about missing art, is in
[`docs/CREATIVE_PROCESS.md`](docs/CREATIVE_PROCESS.md).

## 4. Current phase

**STEP 1 — CLEAN PROJECT FOUNDATION.**

Step 1 is complete when this workspace exists, the documentation packet is written, and Skyler has
confirmed the imported facts are correct. **Do not advance to Step 2 (buyer research) without
Skyler saying so.**

## 5. What is LOCKED

These are carried forward from V1 as verified business fact and may not be altered without Skyler:

- The five service families and their names — [`docs/SERVICES.md`](docs/SERVICES.md)
- Business facts: founder-led/solo, Raleigh NC base, domain, phone, email —
  [`docs/BUSINESS.md`](docs/BUSINESS.md)
- Evidence classes and the honesty policy — [`docs/PROOF.md`](docs/PROOF.md)
- The exact testimonial wording — [`docs/PROOF.md`](docs/PROOF.md)
- Route structure and keyword ownership — [`docs/SEO.md`](docs/SEO.md)
- The five sanctioned CTA phrases — [`docs/CONVERSION.md`](docs/CONVERSION.md)
- `KWLG.png` as the approved monogram source — [`docs/ASSETS.md`](docs/ASSETS.md)

### Ruled by Skyler on 2026-08-19 — DECISIONS 007–018

- **Homepage Work candidates: Leak Locators East Coast + Rare Raleigh Restoration.** LearnSmart is
  **not** a homepage default; it stays a real project, a valid case-study source, and the source of
  the only testimonial.
- Rare Raleigh's status language must always match reality — never launched / live / complete /
  measured.
- **"Brands We've Scaled" is DROPPED.**
- **The audit is retained as a core conversion offer, publicly named `Free Website Audit`.** Not
  "AI Audit". Not to be designed yet.
- **KREATED wordmark stays Cormorant Garamond. The primary sans is intentionally UNDECIDED** —
  Syne has no incumbency.
- **Dark navy is a core requirement; the exact hex is intentionally unassigned.**
- **"We close the gap…" is NOT approved positioning** — `HISTORICAL / COPY CANDIDATE`.
- Client photography is **RIGHTS TO CONFIRM BEFORE PUBLIC USE**.
- Founder photography is inventoried with **no commitment to use it**; no Founder homepage section
  is assumed.
- **V1 remains the current production website** and is not altered or deployed over until explicit
  production approval. ⚠️ See [`docs/BUSINESS.md`](docs/BUSINESS.md) §7a for a factual discrepancy
  flagged here.
- **Rating rule corrected:** review-**count** framing is forbidden; `Rated 5 Stars` and accurate
  star glyphs are available subject to evidence + design approval, never silently introduced.

## 6. What is NOT approved

Everything visual. Specifically, nothing below has been decided:

- creative concept
- signature visual
- art direction
- colour palette
- type scale / type system
- layout
- motion
- homepage structure — including **which** approved Work candidates actually appear, and how
- the primary sans, and the exact navy
- V2 positioning
- founder positioning, and whether a Founder section exists at all
- any wording written for V2 rather than imported from V1

Copy that has not been explicitly approved by Skyler is labelled
`COPY CANDIDATE — NOT APPROVED` wherever it appears.

## 7. The governing rule

> **Visual design cannot begin before creative-concept approval.**

No homepage. No hero. No Method section. No Services layout. No mockups. No CSS art. No animation.
No logo experiments. No "quick direction to react to."

A concept is approved only when **Skyler explicitly approves it** and it is written into
[`docs/DECISIONS.md`](docs/DECISIONS.md). A recommendation from Claude is not an approval.

## 8. Reading order

1. `START_HERE.md` — this file
2. `docs/CREATIVE_PROCESS.md` — the workflow and its hard rules
3. `docs/BUSINESS.md` — who Kreated is and what it sells
4. `docs/PROOF.md` — what may and may not be claimed. **Read before writing any copy.**
5. `docs/BRAND.md` — known identity assets and preferences
6. `docs/SERVICES.md` · `docs/SEO.md` · `docs/CONVERSION.md` — content structure
7. `docs/ASSETS.md` — what real material exists
8. `docs/AUDIENCE.md` — what is known vs. what Step 2 must research
9. `docs/DECISIONS.md` — the append-only approval log

## 9. Directory map

| Path | Purpose | State |
|---|---|---|
| `docs/` | Source-of-truth packet | Written in Step 1 |
| `research/` | Step 2 buyer research output | Empty |
| `concepts/` | Step 3 creative concepts | Empty |
| `assets/brand/` | Kreated's own marks, fonts | Empty — see `docs/ASSETS.md` |
| `assets/projects/` | Client project media | Empty |
| `assets/photography/` | Founder and project photography | Empty |
| `assets/generated/` | Produced signature/supporting visuals | Empty |
| `storyboards/` | Step 5–6 start frames and motion boards | Empty |
| `site/` | The V2 website | **Deliberately empty** |
| `qa/` | Step 11 verification output | Empty |

`assets/*` are empty by design. Nothing is copied out of V1 until an asset is needed by an approved
concept and its status in `docs/ASSETS.md` says it may be used.
