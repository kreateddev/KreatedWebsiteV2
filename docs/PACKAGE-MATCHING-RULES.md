# PACKAGE MATCHING AND AUDIT RECOMMENDATION RULES
Designed 2026-09-01. **Part 1 implemented the same day** in
`assets/data/recommend.js`; Part 2 remains the design for the audit.
Both tools read `assets/data/offers.js`, which is this repo's `OFFER-MAP.md` as data.

This document exists because the rules are the hard part, not the interface.
Written down now, they can be argued with before anyone builds them.

---

## Part 1 — Build Your Package

### The core rule

> When a buyer's selected services are substantially covered by an existing
> package, and the package price is genuinely lower than the sum of those
> services, offer the package.

Three conditions, all required. Any one missing and the tool stays quiet.

### Coverage

Using the coverage table in `OFFER-MAP.md` §3:

```
coverage(selection, package) =
    value of selected services the package covers (full or within its partial allowance)
  ÷ value of the whole selection
```

- **coverage ≥ 0.80** → recommend the package outright.
- **0.55 ≤ coverage < 0.80** → mention the package as a comparison, do not
  recommend it. Say what it does not cover and price the remainder separately.
- **coverage < 0.55** → say nothing. The buyer is buying something else.

⚠ A `partial` service only counts as covered **up to its allowance**. Three
location pages against Growth's allowance of two counts as two covered and one
not, and the remainder is quoted on top. 🚫 Never round a partial up to full;
that is how a configurator promises scope the proposal will not contain.

### Savings

> The saving is the difference between two approved numbers, and nothing else.

```
saving = sum(individual prices of covered services) − package price
```

- If `saving > 0`, show it: *"Growth is $2,950. Bought individually, this comes
  to $3,150. Growth is $200 less and includes the research."*
- **If `saving ≤ 0`, still recommend the package when coverage is high, and say
  so plainly**: *"Growth costs more than these services bought separately. What
  it adds is the research that decides what to build."* The reason to choose a
  package is not always price and pretending otherwise is a lie the proposal
  will contradict.

🚫 Never invent a discount. 🚫 Never render a struck-through price. 🚫 Never
describe a package as "X% off" — there is no list price to be off.

### Ranges and from-prices

Of the 23 public figures, eleven are `from`, three are ranges, five are
recurring and one is per-unit. So:

- Any total containing a `from` price is labelled **"from"**, not "total".
- A range contributes its **low** end to a from-total, and its span is shown.
- The words **"estimate"** and **"quote"** are never used. It is a starting
  figure until it is a written scope.

### Recurring never mixes with one-time

Two separate lines, always: *"from $X to build"* and *"$Y/month ongoing"*.
🚫 Never add a monthly price into a project total, and never annualise one to
make a total look larger.

### The CTA

`Build This Project` or `Start With This Package`.
🚫 Never `Checkout`, `Buy Now`, `Add to Cart`. Nothing here is a transaction;
every path ends in a written scope.

### Carrying the selection into `/contact/`

The selection travels as a query string of offer ids, not labels or prices:

```
/contact/?intent=build&items=svc.page.location,svc.search.gbp,pkg.care.base
```

The contact page renders labels by looking the ids up in the same offer map.
🚫 Do not put prices in the URL. A stale link would arrive quoting a number
Kreated no longer charges, and the URL is the one thing a buyer can edit.

---

## Part 2 — The audit recommendation engine

**BUILT 2026-09-01.** See `docs/AUDIT.md`. The classification lives in
`netlify/functions/lib/classify.js` and is deterministic; the recommendation is
`recommendFromNeeds()` in the same engine the pricing builder uses. Everything
below is what was implemented.

### Four classifications

Every finding is exactly one of:

| Class | Meaning | Leads to |
|---|---|---|
| **Critical** | Actively costing the business enquiries now | The service that fixes it |
| **Recommended** | Real improvement, not urgent | The service, framed as next |
| **Optional** | Would help, easy to defer | Named, not pushed |
| **Already Strong** | Genuinely fine | **Nothing to buy** |

### Already Strong is load-bearing

> **Already Strong must be able to recommend buying nothing in that category,
> and the report must say so in those words.**

An audit that finds six problems and recommends six services is a sales
document, and every recipient can tell. The credibility of the whole tool rests
on it being willing to say *"your Google profile is in good shape, leave it
alone."* 🚫 Do not add a "but you could still…" upsell to an Already Strong
finding. That is the same document wearing a hat.

### Suppression rules

1. **Never recommend more than one package.** The best-fit combination is one
   package plus, at most, the individual services it does not cover.
2. **Never recommend a service that a recommended package already covers.**
   Same coverage table as Part 1.
3. **Cap the recommendation at three purchasable items**, ordered Critical
   first. Anything below the cut is listed as a finding without a price.
4. **If nothing is Critical, recommend nothing and say the site is in good
   shape.** This must be a reachable outcome, and it should be tested for.
5. **Never recommend Location Pages from an audit.** Whether an additional
   market is real is a business fact the audit cannot observe. It can note the
   opportunity; it cannot price it.

### Shared shape

Both tools produce the same object, which is why they can share a renderer:

```
{ findings: [ {id, class, evidence} ],
  services: [ offerId ],
  package:  offerId | null,
  covered:  [ offerId ],
  remainder:[ offerId ],
  oneTime:  {from, isFrom},
  monthly:  {from, isFrom} | null,
  saving:   number | null }
```

The builder fills `services` from what the buyer selected. The audit fills it
from `findings`. Everything downstream is identical.

---

## Part 3 — What the 2026-09-01 approvals change

### The recurring ladder is now three rungs, and they are mutually exclusive

🚫 **Never recommend two rungs of the same ladder.** Local Presence, Local
Growth and Market Expansion are one choice, not three products. The matcher
picks exactly one:

```
if selection needs new pages monthly or location expansion  -> expansion
elif selection needs researched growth work                 -> growth
elif selection needs only maintenance of an existing base   -> presence
```

⚠ **The default recommendation is the LOWEST rung that covers the need.** The
ladder makes it easy to reach for the middle by habit; Local Presence exists
precisely so a business that only needs its foundation tended is not sold a
growth programme. This is the recurring-services equivalent of the audit's
*Already Strong* rule.

⚠ **Commitment terms differ and must be surfaced per rung.** Only Local Growth
carries a three-month initial term. 🚫 Do not print a term for the other two;
none is documented. See `OFFER-MAP.md` §1.

### Brand + Website is two selections, not a service

`pkg.combined.brandweb` triggers when the selection contains **one brand tier
and one website tier**. It covers exactly those two and adds nothing.

🚫 **Never compute a saving for it.** Reference §56: bundling improves strategic
consistency, it is not a discount. This is the one package where the
`saving > 0` branch in Part 1 must be skipped entirely rather than evaluated —
the page already states that buying separately costs about the same, and a
matcher contradicting the page is worse than a matcher with no opinion.

Its published value is a **range**, so any total containing it is a range too,
and the low end is $3,950.

### Copy & Content is the only per-unit price

`svc.copy.full` is **from $275 per page**. Two consequences:

1. The total must multiply by a page count the buyer actually chose. 🚫 Never
   assume a page count to make a total renderable.
2. The **$1,200 project minimum is applied but never displayed.** If
   `pages × 275 < 1200`, the line reads $1,200 and the explanation is "project
   minimum", not "you need at least five pages".

⚠ **Copy assistance is not coverage.** Every website package includes editing
and structuring supplied material. That must never mark `svc.copy.full` as
covered — the coverage table has it as `—` for all four website tiers on
purpose. A matcher that treats included copy support as coverage will tell a
buyer their site content is paid for when it is not.

---

---

## Part 4 — Three rules, LOCKED by the owner 2026-09-01

All three were flagged as open on implementation and have since been ruled on.
They are live in `assets/data/recommend.js` and asserted by eleven tests in
`tools/test-engine.js`. 🚫 None of them may be changed without changing those
tests in the same commit.

### 1. Upsell ceiling — 1.6×, INTERNAL — LOCKED

Coverage alone recommends Growth to someone who asked for one $450 service
page, because Growth genuinely "covers" service pages and coverage computes as
1.0. That is precisely the outcome Scenario D forbids.

`recommend.js` therefore adds `MAX_UPSELL_MULTIPLE = 1.6`: a package is offered
only when it is **cheaper than the selection**, or **within 1.6× of it**.

**RULED 2026-09-01.** A package may be recommended when it is cheaper, **or**
when it costs no more than **1.6×** the identified scope *and* is materially
better matched.

🚫 **1.6 is internal and must never reach a customer.** It appears in no
rendered string, no data attribute and no handoff payload. A test asserts that
the string does not occur in `builder.js` or `build-handoff.js` at all.

### 2. Page allowances are REAL INCLUDED SCOPE — LOCKED

`OFFER-MAP` §3 says the page allowances are descriptive copy rather than
contractual, and warns that this is what stopped the configurator being built.
The engine takes the conservative reading:

- **`full` coverage** → the item is not charged again, and says *"Included in
  Growth"*. This is the hard no-double-charge rule and it is unambiguous.
- **`partial` coverage** → the item **is** charged, and the buyer is told
  *"Growth already covers up to two service or location pages. Add these only if
  you need them on top."*

**RULED 2026-09-01: the documented service and location page allowances are
contractual.** The engine charges only **beyond** the allowance.

| Package | Included service/location pages |
|---|---|
| Launch | — |
| Growth | **2**, pooled |
| Market Leader | **4**, pooled (the documented *floor* of "four to eight-plus") |

⚠ **Pooled, not per-type.** The published copy reads *"up to two service or
location pages"*, so both draw on one allowance. Two location pages exhaust
Growth's allowance and a third is charged at $550.

⚠ **The pool is spent dearest-first**, which puts the included units on the
most expensive pages. That is the reading favourable to the buyer.

🚫 **Additional Standard Pages get NO allowance.** "Six to ten pages" is the
size of the site being built, not a credit against buying more on top. The
ruling named service and location pages; standard pages were not in it.

### 3. AEO credit — a full $750 — LOCKED

`/pricing/` says the audit is *"credited against AEO Foundation if you go on to
implement within the same engagement"*. The **amount** is not documented
(`PRICING-SOURCE-OF-TRUTH-AUDIT` §D.3). The engine takes the plain reading —
selecting both charges the Foundation range only, and the audit line reads
*"credited against Foundation within the same engagement"*.

**RULED 2026-09-01: a full $750 credit, as real arithmetic.** Both lines are
charged and a visible credit line is subtracted:

```
AEO Audit            $750
AEO Foundation     $1,250–$1,750
Credit               −$750
                   ─────────────
                   $1,250–$1,750
```

🚫 Not a zeroed line. The buyer sees the money they already spent coming off.
The credit is capped at the one-time subtotal and can never produce a negative
total, and it does not apply to an audit bought on its own.

---

## Open questions before either is built

1. **Are the page allowances contractual?** "Up to two location pages" is
   currently descriptive copy. The matcher needs it to be a number.
2. **Does AEO Audit credit against AEO Foundation?** `/pricing/` now says it
   does within the same engagement. That is a real arithmetic rule and it needs
   confirming.
3. ~~Do the two unpublished recurring tiers exist?~~ **RESOLVED 2026-09-01.**
   All three rungs are approved and public. See Part 3.
4. ~~What is the Copy & Content model?~~ **RESOLVED 2026-09-01.** From $275 per
   page, $1,200 internal minimum. See Part 3.
5. **Do Local Presence and Market Expansion carry an initial term?** Only Local
   Growth's is documented. The matcher currently states a term for one rung and
   not the others, which is correct but reads as an omission.
