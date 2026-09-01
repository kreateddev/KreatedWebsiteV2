# CREATIVE PROCESS

The workflow V2 is built under. This document governs sequence and approval. It outranks
convenience, momentum and any suggestion that a step can be skipped "just to see something."

---

## 1. The thirteen stages

| # | Stage | Output | Gate |
|---|---|---|---|
| 1 | **Clean foundation** | This workspace + the docs packet | Skyler confirms the imported facts |
| 2 | **Buyer research** | `research/` — real evidence about the buyer | Skyler approves the audience definition |
| 3 | **Creative concept** | `concepts/` — the idea the site is built on | **Skyler approves ONE concept** |
| 4 | **Signature visual** | `assets/generated/` — the one hero image/artwork | Skyler approves the visual |
| 5 | **Start-frame approval** | `storyboards/` — the exact first frame | Skyler approves the still |
| 6 | **Motion approval** | `storyboards/` — how the frame moves | Skyler approves the motion |
| 7 | **Supporting visual assets** | `assets/` — everything else the page needs | Skyler approves the set |
| 8 | **Homepage build** | `site/` — the page, built around approved assets | — |
| 9 | **Browser critique** | `qa/` — real browser observation, not opinion | — |
| 10 | **Consolidated revision** | One batch of fixes | Skyler approves the batch |
| 11 | **Responsive / technical QA** | `qa/` — measured at real breakpoints | — |
| 12 | **Netlify preview** | A private preview URL | Skyler reviews |
| 13 | **Production launch** | Live | **Skyler only** |

## 2. 🔴 THE ABSOLUTE RULE

> ## MISSING ART MUST NEVER BE REPLACED WITH GENERIC CSS ABSTRACTION.

If a section requires visual art that has not been created and approved, the build **stops at that
section** and marks it:

```
ASSET REQUIRED — DO NOT DESIGN AROUND THIS
```

The marker stays until a real, approved asset exists.

### 🚫 Never substitute
- circles
- rails
- nodes
- random gradients
- chrome polygons
- generic abstract shapes
- fake UI
- SVG "systems", orbits, rings, flowcharts, process diagrams
- placeholder blocks dressed up to look intentional
- AI-generated filler used as if it were the real asset

### Why this rule exists
Every one of those is faster to produce than real art, looks acceptable in isolation, and
accumulates into a site with no idea in it. V1's homepage failed exactly this way: the visual system
grew out of CSS invented to fill sections, not out of an approved concept. Five separate visual
directions were explored and all five were rejected.

**An empty marked slot is honest and fixable. A generic abstraction is a decision made by accident.**

## 3. Approval rules

- **Only Skyler approves.** A recommendation from Claude is not an approval. "This looks good" is not
  an approval. Silence is not an approval.
- **An approval is a written entry in [`DECISIONS.md`](DECISIONS.md).** If it is not logged, it did
  not happen.
- **Approval is per-artifact and per-stage.** Approving a concept does not approve its execution.
  Approving a still frame does not approve its motion.
- **A step does not begin before the previous step's gate closes.** No "starting early to save time."
- **Copy approval is per-string.** Not the idea — the exact string. This rule is inherited from V1
  and it prevented real errors there.

## 4. 🚫 Do not resurrect — rejected in V1

Skyler rejected **every** visual concept explored in V1. None is approved direction for V2:

- progressive spine / editorial ledger
- three-act sequence
- six-state cinematic sticky stage
- three-state Discover / Build / Deliver hybrid
- Direction B — fluid spatial progression, drifting masked planes
- Direction A — shipped in V1 **only** as a structural CSS grid bug fix, explicitly **not** a visual
  direction

Also do not inherit from V1:
- previous homepage layouts
- previous Method diagrams
- giant K-right hero compositions
- navy/chrome abstract process graphics
- rails, nodes, circles
- generic geometric artwork
- old service interactions
- old Founder layouts
- accumulated scratch CSS
- old prototype boards

**None of V1's CSS or JS has been copied into this workspace.** See
[`DECISIONS.md`](DECISIONS.md) entry 001.

## 5. What "asset-first" actually means

The homepage is built **last**, from art that already exists and has already been approved. The page
is a container for approved assets, not a place where assets get improvised.

Practical consequence: at Step 8 the answer to *"what goes here?"* is always either **an approved
asset** or **`ASSET REQUIRED — DO NOT DESIGN AROUND THIS`**. There is no third answer.

## 6. Working rules carried over from V1 that proved their worth

- **Measure before proposing.** Present measured candidates at real breakpoints, then stop.
- **One batch, one commit.** With a written explanation of what was rejected and why.
- **Audit-only outcomes are legitimate.** Six V1 batches closed with no code change because nothing
  was wrong. **Do not manufacture work.**
- **Never guess.** If evidence or documentation is missing, say so and stop.
- **Never claim something is verified that was only assumed.** Measure it.
- **Do not push or deploy.** Publishing is Skyler's decision, every time.
- **When two documents disagree,** inspect the code and live configuration, decide which is the
  source of truth, and fix the loser — do not average them.

## 7. Current position

**STEP 1 — CLEAN PROJECT FOUNDATION.**

Step 2 does not begin until Skyler confirms the Step 1 packet and says to proceed.
