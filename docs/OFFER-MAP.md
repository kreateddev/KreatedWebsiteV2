# THE OFFER MAP
One source of truth for every purchasable Kreated offer, what problem it
answers, and which package already covers it.

Written 2026-09-01 as the shared substrate for two tools that do not exist yet:
the **Build Your Package** configurator on `/pricing/`, and the recommendation
engine behind `/free-website-audit/`. Both need the same mapping. If they are
built with two separate copies of it, they will disagree within a month, and the
one that disagrees will be the one quoting a customer.

> 🚫 Do not encode prices in the configurator, in the audit tool, or in any
> template. When this is implemented it should be a single JSON file generated
> from this document, imported by both. Prices change; two places that both
> "know" a price is one place too many.

---

## 1. The catalog

Prices are the published `from` values. Anything not `PUBLIC` must never be
surfaced by either tool.

| id | Offer | Price | Kind | Classification |
|---|---|---|---|---|
| `pkg.web.onepage` | One Page Website | 750 | one-time | **Packages** |
| `pkg.web.launch` | Launch | 1750 | one-time | **Packages** |
| `pkg.web.growth` | Growth | 2950 | one-time | **Packages** |
| `pkg.web.leader` | Market Leader | 4500 | one-time, from | **Packages** |
| `pkg.combined.brandweb` | Brand + Website | 3950–5950+ | one-time, range | **Packages** |
| `pkg.brand.refresh` | Brand Refresh | 750 | one-time, from | **Packages** |
| `pkg.brand.identity` | Brand Identity | 1500 | one-time, from | **Packages** |
| `pkg.brand.full` | Full Identity System | 2500 | one-time, from | **Packages** |
| `pkg.aeo.audit` | AEO Audit | 750 | one-time | **Packages** |
| `pkg.aeo.foundation` | AEO Foundation | 1250–1750 | one-time, range | **Packages** |
| `pkg.local.presence` | Local Presence | 500 | **recurring**, no initial term | **Recurring** |
| `pkg.local.growth` | Local Growth | 900 | **recurring**, 3-month initial | **Recurring** |
| `pkg.local.expansion` | Market Expansion | 1500 | **recurring**, from, no initial term | **Recurring** |
| `pkg.care.base` | Site Care | 149 | **recurring**, no initial term | **Recurring** |
| `pkg.care.plus` | Site Care+ | 279 | **recurring**, no initial term | **Recurring** |
| `svc.page.standard` | Additional Standard Page | 250 | one-time, from | **Individual Services** |
| `svc.page.service` | Dedicated Service Page | 450 | one-time, from | **Individual Services** |
| `svc.page.location` | Location Page | 550 | one-time, from | **Individual Services** |
| `svc.page.landing` | Conversion Landing Page | 850 | one-time, from | **Individual Services** |
| `svc.search.gbp` | Google Business Profile Optimization | 450 | one-time, from | **Individual Services** |
| `svc.track.analytics` | Analytics & Conversion Tracking | 400 | one-time, from | **Individual Services** |
| `svc.prod.photo` | Photography Coordination | 350 + third-party | one-time, from | **Individual Services** |
| `svc.copy.full` | Full Copy & Content Writing | 275 per page | one-time, from, per unit | **Individual Services** |
| — | Copy & Content project minimum | 1200 | quoting floor | **Internal / not publicly sold** |
| `svc.ads.manage` | Google Ads Management | 750+/mo + spend | recurring | **Internal / not publicly sold** |
| `svc.ads.setup` | Google Ads Setup | 350–500 | one-time | **Internal / not publicly sold** |
| — | Hourly rate | 100–149/hr | benchmark | **Internal / not publicly sold** |
| — | Launch scoping range | 1500–2000 | internal range | **Internal / not publicly sold** |
| — | Growth scoping range | 2500–3500 | internal range | **Internal / not publicly sold** |
| — | Market Leader scoping range | 4500–6500+ | internal range | **Internal / not publicly sold** |
| — | Profile Recovery | 650 | one-time | **Internal / not publicly sold** (never approved) |
| — | Call Tracking Configuration | 350 + vendor | one-time | **Internal / not publicly sold** (never approved) |
| — | Landing page without copy | 550 | one-time | **Internal / not publicly sold** (never approved) |
| — | Old full-site range | 700–1200 | — | **Deprecated** 🚫 never quote |
| — | Landing Pages "typical $950–$1,500+" | — | — | **Deprecated**, superseded by `svc.page.landing` at 850 |
| — | "Full Brand System" | — | — | **Deprecated** name for `pkg.brand.full` |

⚠ **Per-unit pricing.** `svc.copy.full` is the only offer priced *per page*
rather than per engagement. Any total containing it must multiply by a page
count the buyer has actually chosen, and must apply the $1,200 internal minimum
**without displaying it** — the minimum is a floor on the engagement, not a
quantity the buyer is being told to reach.

⚠ **Commitment terms are not uniform and must not be normalised.** Only
`pkg.local.growth` has a documented initial term. The other four recurring
offers are "billed monthly in advance" with no documented term. 🚫 Do not let
either tool state a term that is not in this table.

---

## 2. Problem → service

The audit tool starts here. A finding names a problem id; the map turns it into
a service; §3 turns services into a recommended package.

| Problem id | What the buyer experiences | Primary service | Also covered by |
|---|---|---|---|
| `no-website` | Nothing to send people to | `pkg.web.onepage` | `pkg.web.launch` |
| `site-embarrassing` | Exists, out of date, avoided | `pkg.web.launch` | `pkg.web.growth` |
| `site-not-found` | Good site, no search visibility | `pkg.web.growth` | `pkg.local.growth` |
| `no-service-detail` | Services listed but not sold | `svc.page.service` | `pkg.web.growth` |
| `serving-more-areas` | Real second market, no page for it | `svc.page.location` | `pkg.web.leader` |
| `campaign-no-destination` | Paying for traffic, sending it to the homepage | `svc.page.landing` | `pkg.web.leader` |
| `profile-wrong` | Google profile incomplete or inaccurate | `svc.search.gbp` | `pkg.web.growth`, `pkg.local.growth` |
| `no-measurement` | No idea how many enquiries the site produces | `svc.track.analytics` | `pkg.web.launch` and above |
| `described-wrongly` | AI assistants and search describe the business incorrectly | `pkg.aeo.audit` | `pkg.aeo.foundation` |
| `brand-dated` | Mark works but looks old | `pkg.brand.refresh` | `pkg.brand.identity` |
| `brand-absent` | No real identity | `pkg.brand.identity` | `pkg.brand.full` |
| `brand-inconsistent` | Every surface looks like a different company | `pkg.brand.full` | |
| `images-poor` | Stock or phone photos of good work | `svc.prod.photo` | |
| `content-thin` | Pages exist with nothing on them | `svc.copy.full` | |
| `site-unmaintained` | Nobody owns updates | `pkg.care.base` | `pkg.care.plus` |
| `visibility-decaying` | Was visible, slipping | `pkg.local.growth` | `pkg.local.presence` |
| `profile-unmaintained` | Foundation accurate but nobody tends it | `pkg.local.presence` | `pkg.local.growth` |
| `expanding-markets` | Growing into more services or more cities | `pkg.local.expansion` | `pkg.web.leader` |
| `brand-and-site-both` | Both the identity and the site need rebuilding | `pkg.combined.brandweb` | |

---

## 3. What each package already covers

This is the table that stops both tools recommending something the buyer is
already paying for. `full` means the package includes it; `partial` means it
includes a bounded amount and more is a separate purchase.

| Service | onepage | launch | growth | leader |
|---|---|---|---|---|
| `svc.page.standard` | — | partial (3–5 pages) | partial (6–10) | partial (10–20+) |
| `svc.page.service` | — | — | **allowance 2, pooled** | **allowance 4, pooled** |
| `svc.page.location` | — | — | **allowance 2, pooled** | **allowance 4, pooled** |
| `svc.page.landing` | — | — | — | full |
| `svc.search.gbp` | — | — | full (one-time audit) | full |
| `svc.track.analytics` | — | full | full | full |
| `svc.copy.full` | — | — | — | — |

⚠ `svc.copy.full` is covered by **no** package. Every website engagement
includes *copy assistance* (editing and structuring supplied material), which
is a different thing and must never be treated as coverage for original
writing. 🚫 Do not mark this row `partial`.

### Brand + Website

`pkg.combined.brandweb` covers exactly one brand package plus one website
package, both at the tier scoped. It is **not** a superset of Market Leader and
it adds no service of its own. For matching purposes it is two selections, not
one: a buyer choosing a brand tier and a website tier is the case that triggers
it.

🚫 Its range is not a discount. Reference §56: *"Bundling is meant to improve
strategic consistency, not create excessive discounting."* The matcher must
never compute a saving for it.
| `svc.prod.photo` | — | — | — | — |

⚠ **RESOLVED 2026-09-01: the allowances are contractual.** Growth includes two
service or location pages and Market Leader four, pooled across both types, and
the engine charges only beyond that. `svc.page.standard` keeps no allowance —
its page range is the size of the site, not a credit. See
`PACKAGE-MATCHING-RULES.md` Part 4.2.

---

## 4. Implementation — BUILT 2026-09-01

```
prototype/kreated-v2/assets/data/offers.js      ← this document, as data. The only copy.
prototype/kreated-v2/assets/data/recommend.js   ← the deterministic engine
prototype/kreated-v2/pricing/builder.js         ← Build Your Package  (consumer 1)
prototype/kreated-v2/contact/build-handoff.js   ← carries the build into the form
prototype/kreated-v2/tools/test-engine.js       ← 32 tests, run with plain node
/free-website-audit/                            ← findings -> offers  (consumer 2, next)
```

`.js` rather than `.json`: the site has no build step and no module loader, so a
UMD wrapper lets Node `require()` it for the tests and the browser read it as
`window.KreatedOffers` from one file. No duplication, no fetch, no bundler.

⚠ **The tests assert this file against the locked catalogue.** `test-engine.js`
retypes all 23 public prices independently and fails if `offers.js` disagrees.
Run it after any pricing change:

```
node prototype/kreated-v2/tools/test-engine.js
```

🚫 Neither tool may hold its own price table, its own coverage table, or its own
copy of the problem map. If a number appears in two files, one of them is wrong
and nobody will find out until a customer does.
