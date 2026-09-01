# DECISIONS

**Append-only decision log.** Never edit or delete an entry. If a decision is reversed, add a new
entry that supersedes it and mark the old one `SUPERSEDED BY #nnn`.

**Nothing is "approved" because Claude recommends it. Only explicit Skyler approval counts.**

### Entry template

```
## nnn — <short title>
DATE
PHASE
DECISION
APPROVED BY SKYLER      yes / no / pending
WHAT IT REPLACES
IMPLEMENTATION STATUS
```

---

## 001 — V2 begins as a clean project; V1 is factual source only

**DATE** 2026-08-19
**PHASE** Step 1 — Clean project foundation
**DECISION** `KreatedWebsiteV2` is a new project. `KreatedWebsiteV1` is treated as READ-ONLY and is
inspected for factual and business content only. No V1 CSS, JS, HTML, layout, visual system or
design language is inherited. The V2 site will be built from an approved creative concept and
approved visual assets.
**APPROVED BY SKYLER** yes — instructed at Step 1 kickoff
**WHAT IT REPLACES** The assumption that V2 would be a redesign pass over V1's homepage
**IMPLEMENTATION STATUS** Implemented. `site/` is empty. No V1 CSS or JS exists in this workspace.

---

## 002 — The thirteen-stage asset-first workflow is adopted

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** V2 is produced through the workflow recorded in
[`CREATIVE_PROCESS.md`](CREATIVE_PROCESS.md): clean foundation → buyer research → creative concept →
signature visual → start-frame approval → motion approval → supporting assets → homepage build →
browser critique → consolidated revision → responsive/technical QA → Netlify preview → production
launch. Visual design cannot begin before creative-concept approval.
**APPROVED BY SKYLER** yes — instructed at Step 1 kickoff
**WHAT IT REPLACES** V1's phase-based build sequence, in which visual direction was explored inside
the codebase and rejected five times
**IMPLEMENTATION STATUS** Implemented as documentation. Currently at Step 1.

---

## 003 — Missing art must never be replaced with generic CSS abstraction

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Where a section requires visual art that has not been created and approved, the build
marks it `ASSET REQUIRED — DO NOT DESIGN AROUND THIS` and stops. No circles, rails, nodes, random
gradients, chrome polygons, generic abstract shapes or fake UI as substitutes.
**APPROVED BY SKYLER** yes — instructed at Step 1 kickoff
**WHAT IT REPLACES** V1's practice of filling sections with invented CSS artwork
**IMPLEMENTATION STATUS** Implemented as documentation. Enforced from Step 8.

---

## 004 — Review-count and rating language is not carried into V2 · **PARTLY SUPERSEDED BY 017**

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** V2 does not introduce review-count language. V1's homepage `1 review on Google` string
and its five-star glyph rows are not inherited. The Missy Boyd testimonial itself remains available,
quoted verbatim.
**APPROVED BY SKYLER** yes — instructed at Step 1 kickoff ("Do not introduce review-count language")
**WHAT IT REPLACES** V1's homepage review block, which displayed a star row and a review count
**IMPLEMENTATION STATUS** Recorded in [`PROOF.md`](PROOF.md) §5. Nothing built yet.
⚠️ **PARTLY SUPERSEDED BY 017 (2026-08-19).** The blanket prohibition on **star glyphs** was an
overstatement and is withdrawn — glyphs and `Rated 5 Stars` are available subject to evidence and
design approval. The prohibition on **review-count** language stands unchanged.

---

## 005 — Brand direction for V2: stated preferences recorded, no palette created

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Recorded preferences: official KREATED wordmark; Cormorant Garamond for the wordmark; a
bold modern sans as primary site typography; dark navy as a core brand colour; black / charcoal /
white; chrome / silver; **no** broad light-blue / ice-blue design language; the site must not become
all-blue; preference for bold, creative, expressive work. **No palette, type scale or design system
has been created.**
**APPROVED BY SKYLER** yes — stated at Step 1 kickoff, as direction
**WHAT IT REPLACES** V1's implemented identity (near-black `#05070A` + cobalt + ice + silver +
amber; Cormorant Garamond as the site-wide display face; Syne as the sans)
**IMPLEMENTATION STATUS** Recorded in [`BRAND.md`](BRAND.md) §A. Specific values, the sans itself,
and every visual rule remain **undecided** and gate on Step 3/4.

---

## 006 — Step 1 packet delivered, awaiting confirmation

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** The V2 workspace and source-of-truth documentation packet have been created. Facts were
imported from V1 by read-only inspection. Uncertainties, contradictions and open questions are
flagged throughout with ⚠️ and ❓.
**APPROVED BY SKYLER** **pending** — Skyler must confirm the imported facts before Step 2 begins
**WHAT IT REPLACES** Nothing — this is the first V2 deliverable
**IMPLEMENTATION STATUS** Delivered. **Step 2 (buyer research) has NOT started and must not start
until this entry is marked approved.**

---

## 007 — Homepage Work candidates: LLEC + Rare Raleigh. LearnSmart is not a homepage default

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** The V2 homepage Work candidates are **Leak Locators East Coast** and **Rare Raleigh
Restoration**. **LearnSmart is NOT a default V2 homepage Work project** and must not be assumed onto
the homepage. LearnSmart remains a real Kreated project, a valid case-study/project source, and the
source of Missy Boyd's exact testimonial; it is held for the Projects / Case Studies architecture,
to be decided later.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** V1's homepage "Selected work" section, which featured LearnSmart + LLEC; and
the Step 1 open question asking whether LearnSmart's omission was intentional
**IMPLEMENTATION STATUS** Recorded in `PROJECTS.md` §0/§1/§2, `PROOF.md` §3. "Candidate" is not
"placed" — final homepage composition is decided after creative-concept approval.

---

## 008 — Rare Raleigh approved as a homepage Work candidate, with a status-language condition

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Rare Raleigh Restoration **is approved** as a V2 homepage Work candidate. Condition:
status language must always match reality. Nothing may imply **launched**, **live in production**,
**complete implementation**, or **measured results**, unless subsequently verified.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** V1's policy of excluding Rare Raleigh from the homepage entirely because it is
implementation-in-progress
**IMPLEMENTATION STATUS** Recorded in `PROJECTS.md` §0/§3, `PROOF.md` §4, `ASSETS.md` §4. The locked
label `Strategy delivered · implementation in progress` remains accurate and sufficient.

---

## 009 — "Brands We've Scaled" is dropped

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** The phrase **"Brands We've Scaled" is dropped from V2** and is not carried forward as
approved copy. Reason: "scaled" creates a growth/results implication stronger than the documented
evidence. Client/project presentation may be reconsidered after creative-concept approval.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** V1's homepage marquee kicker, logged in V1 as open honesty exception defect #22
**IMPLEMENTATION STATUS** Recorded in `PROOF.md` §7, `CONVERSION.md` §8. Resolves V1 defect #22 for
V2 purposes. Any replacement kicker is `COPY CANDIDATE — NOT APPROVED`, and must not restate the
same growth implication in different words.

---

## 010 — The audit is retained; public-facing name is "Free Website Audit" · **PARTLY SUPERSEDED BY 020**

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** The audit is **kept as a core Kreated conversion offer**. Its public-facing working
name is **`Free Website Audit`**. "AI Audit" is **not** the customer-facing product positioning — AI
may eventually support the audit internally, which does not make it the customer-facing name. **Do
not design or implement the audit yet.** ⚠️ **This last sentence is superseded by
DECISION 020 (2026-08-28).** Everything else in this entry still stands: the audit is retained,
`Free Website Audit` is the public name, and "AI Audit" is still not the customer-facing positioning.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** V1's "Kreated AI Audit" product naming; and the Step 1 open question asking
whether the audit survives into V2
**IMPLEMENTATION STATUS** Recorded in `BUSINESS.md` §3/§6, `CONVERSION.md` §1, `SERVICES.md` §4,
`BRAND.md` §C. V2 retains **two** conversions. Whether the audit is deliverable today — and
therefore whether early-access framing and the `Request Early Access` CTA still apply — remains
open.

---

## 011 — Typography: wordmark settled, primary sans intentionally undecided

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** The official **KREATED wordmark remains Cormorant Garamond**. The **primary site sans
is intentionally UNDECIDED** and must **not** be selected during Step 1. Typography candidates are
explored only after the central creative concept exists. **Syne is not carried forward automatically
merely because V1 used it.**
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** The Step 1 open question "which bold modern sans?", and any implicit
inheritance of Syne from V1
**IMPLEMENTATION STATUS** Recorded in `BRAND.md` §A/§B/§D, `ASSETS.md` §2. Undecided **by ruling**,
not by omission.

---

## 012 — Dark navy is a core requirement; exact hex deliberately unassigned

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** **Dark navy remains a core V2 brand requirement.** No final hex is assigned. Exact navy
selection belongs to creative development, after buyer research and concept work.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** The Step 1 open question asking for a specific navy value
**IMPLEMENTATION STATUS** Recorded in `BRAND.md` §A/§B. V1 has no navy token, so V1 is not a source
for it — the V2 navy must not be derived from V1's cobalt or `#05070A`.

---

## 013 — "We close the gap…" is not approved V2 positioning

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** `We close the gap between how good your business is and how good it looks online.` is
**NOT approved as V2 positioning.** It is preserved as **`HISTORICAL / COPY CANDIDATE`**. Buyer
research must happen before V2 positioning is selected, and **research must not be built around
proving the old positioning correct.**
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** V1's canonical positioning statement, as V2's default
**IMPLEMENTATION STATUS** Recorded in `BUSINESS.md` §5, `CONVERSION.md` §8, and as a Step 2 guard in
`AUDIENCE.md`. The supporting line "That gap is the whole job." and the five service-page H2s that
encode the same insight carry the same status.

---

## 014 — Client photography: rights to confirm before public use

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Rights are **not assumed**. Relevant client photography is marked **RIGHTS TO CONFIRM
BEFORE PUBLIC USE**. This is **not** a blocker for Step 2 research; it **becomes a blocker before
public asset use and before production launch**.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** The unqualified "rights unconfirmed" note in the Step 1 packet
**IMPLEMENTATION STATUS** Recorded in `ASSETS.md` §6 and `PROJECTS.md` §2/§3. Applies to the Rare
Raleigh job photography, the LLEC pool photography, and the unidentified `More Photos` set. Rare
Raleigh's set is the highest-exposure item, being the main media source for a homepage Work
candidate.

---

## 015 — Founder photography inventoried, with no commitment to use

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Existing founder photography **remains inventoried** with **no commitment to use it**.
**Do not assume a Founder homepage section.** Founder positioning is decided later, based on the
approved creative/content strategy.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** V1's homepage founder closing section, as an inherited default; and the Step 1
open question asking whether a reshoot is wanted
**IMPLEMENTATION STATUS** Recorded in `ASSETS.md` §5, `START_HERE.md` §6. "Reshoot or not" is not a
Step 1 question and becomes answerable once founder positioning is decided.

---

## 016 — V1 / V2 relationship and the replacement sequence

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** **V1 remains the current production website.** V2 is intended to eventually replace V1
**only after**: creative approval → build completion → browser critique → revision → QA → preview
approval → **explicit production approval from Skyler**. **No V2 work may alter or deploy over V1
before that point.**
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** The Step 1 open question asking whether V2 replaces V1 entirely or V1 ships
first
**IMPLEMENTATION STATUS** Recorded in `BUSINESS.md` §7a, `START_HERE.md` §5. ⚠️ **Flagged
discrepancy:** V1's own documentation at commit `220cabc` states in four places that V1 has **never**
been deployed and that `kreated.dev` serves a different website. The operational instruction is
identical under every reading — do not touch V1, do not deploy — and is being followed. The factual
question is unresolved and becomes a blocker at Step 12.

---

## 017 — Rating / review rule: corrects a previous overstatement

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Corrects Step 1 documentation that claimed all star-rating presentation is forbidden.
The actual rule is:
**FORBIDDEN** — review-count framing such as "1 review" · invented ratings · unsupported rating
claims · misleading proof.
**AVAILABLE SUBJECT TO EVIDENCE + DESIGN APPROVAL** — `Rated 5 Stars` · star glyphs when accurately
supported.
**Neither may be silently introduced during design.**
**APPROVED BY SKYLER** yes — explicit ruling and correction
**WHAT IT REPLACES** **DECISION 004**, which overstated the rule as a blanket prohibition on star
glyphs. 004 is **SUPERSEDED BY 017** as to star glyphs; its prohibition on review-**count** language
stands
**IMPLEMENTATION STATUS** Recorded in `PROOF.md` §5/§6/§9, `ASSETS.md` §8. Note this does **not**
unlock rating structured data — `aggregateRating` / `ratingValue` / `reviewCount` schema remains
forbidden.

---

## 018 — Screenshot and project-media priority

**DATE** 2026-08-19
**PHASE** Step 1
**DECISION** Media priority is set by homepage Work status:
**LLEC** — current capture/media refreshed **before homepage asset production** if the existing
capture is outdated.
**Rare Raleigh** — current appropriate project media is a **priority**, because it is now a homepage
Work candidate.
**LearnSmart** — a new capture may still be useful for its case study, but it is **NOT a blocker for
the V2 homepage**.
**APPROVED BY SKYLER** yes — explicit ruling
**WHAT IT REPLACES** The Step 1 packet's undifferentiated "recapture before use" note across all
three projects
**IMPLEMENTATION STATUS** Recorded in `ASSETS.md` §4/§11, `PROJECTS.md` §1/§2/§3/§6. 🚫 No media is
produced before creative-concept approval, because the concept determines what the media must be.

---

## 019 — Rare Raleigh Restoration is published/live

**DATE** 2026-08-25
**PHASE** Homepage build (visual-direction pass)
**DECISION** The Rare Raleigh Restoration website is **published and live** at
`https://rareraleighrestoration.com`. On the V2 homepage it is now presented as a **completed live
Kreated website project**, including real screenshots of the live site. The locked status label
`Strategy delivered · implementation in progress` is **retired from the rendered homepage**.
**UNCHANGED** — no performance metrics, rankings, traffic or revenue claims exist for this project
and none may be implied unless subsequently documented. DECISION 008's no-invented-results
constraint stands; only its status-language requirement is superseded by reality.
**APPROVED BY SKYLER** yes — explicit instruction, 2026-08-25
**WHAT IT REPLACES** DECISION 008's in-progress status-language constraint (its honesty constraints
otherwise stand)
**IMPLEMENTATION STATUS** Homepage prototype updated (client-trust lockup now links to the live
site; Work case band presents it as live). ⚠ `PROOF.md` §4 and `PROJECTS.md` §3 still carry the
old status and should be updated in a docs pass — do not "correct" the homepage back to the
obsolete label. ❓ The exact delivered-scope string for the completed engagement is not yet
documented; the homepage scope line is `COPY CANDIDATE` until Skyler confirms it.

---

## 020 — The Free Website Audit is commissioned and built; the implementation freeze in 010 is lifted

**DATE** 2026-08-28
**PHASE** Conversion Infrastructure
**DECISION** The clause in DECISION 010 reading *"Do not design or implement the audit yet"* is
**lifted**. Skyler explicitly commissioned the audit route in the Conversion Infrastructure pass.
The `/free-website-audit/` route now exists in V2 with the documented `website-audit` form, built in
V2's visual system rather than copied from V1.
**APPROVED BY SKYLER** yes — explicit instruction to build the route
**WHAT IT REPLACES** Only the implementation-freeze sentence of DECISION 010. The offer's retention,
its public name, and the "AI Audit is not the positioning" ruling are unchanged and still binding.
**IMPLEMENTATION STATUS** Route and form built and validated. ⚠️ **What the audit actually contains
is still unruled and still needs Skyler's words.** The page deliberately states only verifiable
facts — who it reaches and where the reply comes from. A drafted "What you get back" list was
removed rather than shipped because every line of it was invented. Turnaround time, report format,
audit-point count and any strategy call remain undefined and must not be written by Claude.

---

## 021 — Homepage CTA wording: "Start a Project" and "Free Website Audit" are the V2 forms

**DATE** 2026-08-28
**PHASE** Conversion Infrastructure
**DECISION** The wording visible in the approved V2 homepage is authoritative:
**`Start a Project`** and **`Free Website Audit`**. V1's locked list in `CONVERSION.md` §2 carried
`Start Your Project` and `Get a Free Website Audit`; those are recorded as the V1 forms and are no
longer flagged as a discrepancy against the V2 build. The ban on `Learn More`, `Click Here`,
`Submit`, `Get Started` and `Book a Call` is unaffected and still binding.
**APPROVED BY SKYLER** yes — "Treat the current visible UI wording as the preferred version"
**WHAT IT REPLACES** The V1 capitalisation/wording split for these two phrases only. `View Case
Study`, `Explore the Kreated Method` and `Request Early Access` are untouched by this entry.
**IMPLEMENTATION STATUS** Live button labels unchanged. `CONVERSION.md` §2 annotated to point here.
⚠️ `Request Early Access` still depends on the open question of whether the audit is deliverable
today, which DECISION 020 does not settle.
