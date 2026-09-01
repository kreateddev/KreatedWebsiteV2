# SIGNAL HERO LAYOUTS — ten live page designs · NOT PRODUCTION

**Built 2026-08-26.** Ten hero-page designs composed around the approved
**Signal** artwork direction (outer Kreated mark only — rotating cobalt beam
inside the letterform + silhouette echoes; no inner logo detail). Every layout
keeps the locked hero copy and the production typewriter mechanism verbatim
(static phrase + rotating `website. / Google results. / first impression.`),
and stays inside the site system: navy canvas, cobalt `#0A47F0` / lift
`#5B86FF`, General Sans, Cormorant Garamond as the selective serif accent
(styling only — the word "better" set italic serif in most layouts), chrome
hairlines. What varies — intentionally — is composition, type scale, CTA
treatment, and where the signal broadcasts from.

## Run

```bash
python3 /Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2/prototype/serve.py 5181
# → http://localhost:5181/hero-signal-layouts/L1-meridian.html
```

Top-right switcher jumps between all five. `file://` works too.

| # | File | Composition | CTA language |
|---|---|---|---|
| L1 | `L1-meridian.html` | Refined split — serif-accented headline left, mark cropped off the right edge | Cobalt pill with arrow-chip + underline secondary + ruled View Work row |
| L2 | `L2-halo.html` | Centered poster — the mark lives BEHIND the type, dimmed, beam turning, echoes expanding past the headline | Centered pill pair |
| L3 | `L3-ledger.html` | Editorial — vertical rail kicker, 116px headline, mark cropped into the bottom-right corner | Typographic route list on rules (no pills), cobalt edge on the primary |
| L4 | `L4-beacon.html` | Mirrored — the mark broadcasts from the LEFT edge, echoes travel toward the copy; vertical Raleigh tag on the right edge | Stacked column buttons |
| L5 | `L5-broadcast.html` | Full-width 122px headline over faint oversized echoes, mark mid-right; hero closes on a full-width conversion bar | The bar: label left, View Work + ghost + cobalt arrow-chip right |

## Round two — L6–L10 (built 2026-08-26)

| # | File | Composition | The idea |
|---|---|---|---|
| L6 | `L6-inset.html` | The mark sits INSIDE the type block — line 1 held short, the mark in the notch beside it, the rotator line indented beneath it | Sentence and brand interlock. Art-directed per breakpoint (no `shape-outside` — unreliable on an irregular mark) |
| L7 | `L7-horizon.html` | A full-width hairline horizon; the mark is half-risen and cut exactly at the line, echoes radiating upward; CTAs sit centred ON the wire | The signal rising. The sky's `overflow:hidden` IS the horizon |
| L8 | `L8-plate.html` | Hairline-framed plate with registration ticks, kicker interrupting the top rule, CTA row astride the bottom rule; the mark breaks the frame at the right | The hero as an engagement title page — promotes the Investment section's language to the front door |
| L9 | `L9-footnote.html` | A small LIVE mark rides the end of the rotating line as the sentence's asterisk; the kicker becomes a real footnote at the base, referenced by a tiny mark; a large ghosted mark right restores presence | The brand annotates its own promise |
| L10 | `L10-response.html` | Minimal layout; the ANIMATION is the concept — the ambient echo loop is off, and the mark fires exactly one echo pulse each time the typewriter lands a phrase | Call and response: typewriter and mark share one clock. Layered onto any other layout if wanted |

All ten: pure SVG/CSS/JS, no libraries, reduced-motion renders a composed
static state, verified zero horizontal overflow and zero JS errors at 1440
and 390.
Copy is the locked production copy; the serif italic on "better" is a display
treatment, not a copy change. Concept exploration only — nothing approved;
production hero untouched.
