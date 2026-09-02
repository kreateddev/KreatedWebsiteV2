# SEO

**Preserved SEO knowledge from V1. Nothing here has been optimized, rewritten or re-planned.**

> ⚠ **STILL BINDING, AND NOW ACTED ON.** The site launched for search on 2026-09-01. The
> rulings in this file — the rejected keywords, the no-city-pages rule, the assigned keyword
> map — were treated as constraints rather than history by the post-launch research, and none
> were overturned. Forward-looking strategy lives in **`docs/SEO-ROADMAP.md`**; measurement
> lives in **`docs/GSC-BASELINE.md`**. 🚫 Keep those separate from this record: this file is
> what V1 decided, not what V2 plans.

🚫 This is a record, not a strategy. No keyword research has been redone. No routes have been
re-decided for V2. Imported from `KreatedWebsiteV1` (`docs/SEO_AND_CONTENT.md`,
`docs/ROUTE_INVENTORY.md`, `docs/SEO_BASELINE.md`), read-only inspection 2026-08-19.

---

## 1. Route structure — V1's 17 routes

15 indexable, 2 utility/noindex. All returned 200 locally with zero broken internal links.

| Route | Class | Structured data |
|---|---|---|
| `/` | Homepage | `ProfessionalService`, `WebSite` |
| `/services/` | Hub | — |
| `/services/web-design/` | Service leaf | `Service`, `BreadcrumbList`, `FAQPage` |
| `/services/website-redesign/` | Service leaf | `Service`, `BreadcrumbList`, `FAQPage` |
| `/services/local-seo/` | Service leaf | `Service`, `BreadcrumbList`, `FAQPage` |
| `/services/google-business-profile/` | Service leaf | `Service`, `BreadcrumbList`, `FAQPage` |
| `/services/brand-strategy/` | Service leaf | `Service`, `BreadcrumbList`, `FAQPage` |
| `/case-studies/` | Hub | — |
| `/case-studies/learnsmart/` | Case study (delivered) | `BreadcrumbList` |
| `/case-studies/rare-raleigh-restoration/` | Case study (**in progress**) | `BreadcrumbList` |
| `/method/` | Content | `FAQPage` |
| `/about/` | Trust | — |
| `/contact/` | Conversion | — |
| `/free-website-audit/` | Conversion | `FAQPage` |
| `/privacy/` | Utility | — |
| `/thanks/` | Utility · **noindex** | — |
| `/404.html` | Utility · **noindex**, no canonical | — |

⚠️ **Not automatically V2's route structure.** If V2 restructures case studies or changes the audit's
route, the route map changes and redirects become mandatory. (The audit itself is retained —
DECISION 010 — publicly named `Free Website Audit`, which the existing `/free-website-audit/` route
already matches.)

## 2. Keyword ownership — V1's approved map

| Route | Primary keyword | Alternate |
|---|---|---|
| `/` | `Raleigh web design and local SEO` | `Raleigh web design and SEO` |
| `/services/` | **None — branded/navigational** | `Kreated services` |
| `/services/web-design/` | `Raleigh web design` | `custom web design Raleigh NC` |
| `/services/website-redesign/` | `website redesign Raleigh` | `website redesign without losing SEO` |
| `/services/local-seo/` | `local SEO Raleigh NC` | `local SEO for contractors Raleigh` |
| `/services/google-business-profile/` | `Google Business Profile optimization Raleigh` | `Google Business Profile management` |
| `/services/brand-strategy/` | `brand strategy Raleigh` | `brand positioning for small business` |
| `/about/` | **None** | — |

🚫 **Never assign a competing commercial head term to `/services/` or `/about/`.**

Verified at V1 close: 17/17 unique titles, 17/17 unique descriptions, no unintended head-term
collision, Local SEO ≠ GBP, Web Design ≠ Website Redesign.

### 🚫 Permanently rejected keywords
`Raleigh SEO company` · `web design company Raleigh` · `branding agency Raleigh` — **all imply a
team, which is false.**
`Google Maps ranking Raleigh` — **invites placement promises Kreated cannot make.**

### 🚫 No city pages
No Cary / Durham / Apex / Chapel Hill pages **without a real delivery basis.** V1 verified zero
city-named routes and zero city names in any title.

## 3. Canonical and metadata requirements

- **Absolute self-referencing canonical on every page** except `404.html`.
- One `<h1>` per page. No skipped heading levels.
- Unique `<title>` ≤ ~60 chars, pattern `Primary Keyword + Location | Kreated`.
- Unique `<meta name="description">`, mirrored into `og:description` and `twitter:description`.
- Trailing-slash URLs, lowercase, hyphenated, no dates or IDs.
- V1 fixed the `<head>` element order and required copying it exactly.

⚠️ **Open V1 item, unresolved:** 9 of 17 descriptions fell outside the documented 140–160 range.
V1's analysis: Google truncates by pixel width, all flagged descriptions truncate on mobile at
~110–118 chars regardless, and none was genuinely weak. Recommendation on file was to exempt the two
`noindex` pages and defer the rest. **Never actioned.**

⚠️ **V1 lesson worth keeping:** a replacement count is not proof. A near-miss shipped a stale
OG/Twitter description because one source used a literal `—` rather than `&mdash;`. **Verify each
surface equals the approved string.**

## 4. Schema and evidence restrictions

**21 JSON-LD blocks in V1, all valid.** The governing rule:

> **Schema must match visible content.** Every `FAQPage` question must exist verbatim as visible
> text on the page.

V1 achieved 44 visible FAQs / 44 schema questions across 7 routes with zero verbatim mismatches
(questions *and* answers).

| Route | FAQ count |
|---|---|
| `/free-website-audit/` | 8 |
| `/method/` | 5 |
| `/services/web-design/` | **7** — approved route-specific exception |
| The other four service routes | **6 each** |

🚫 **Seven FAQs is NOT the default.**

### 🚫 Forbidden schema
Never add `aggregateRating`, `review`, `award`, `ratingValue`, `reviewCount` or testimonial schema
until they are real and approved. V1 verified **zero occurrences site-wide.** See
[`PROOF.md`](PROOF.md).

### ⚠️ Technical trap
**HTML entities do not decode inside JSON-LD.** Write the literal character — `don't` uses U+2019.
`&rsquo;` inside JSON-LD breaks the verbatim match silently.

## 5. Technical SEO requirements

- Every new page: added to `sitemap.xml`, added to the footer, **three contextual internal links in
  and out.**
- Every leaf under a hub carries a visible breadcrumb **and** a matching `BreadcrumbList`.
- 🚫 **No content may be JavaScript-dependent.**
- 🚫 **Never introduce a third-party origin.** V1 verified **zero third-party subresources** and
  treated that as a durable competitive advantage and part of the performance story.
- V1 sitemap carried **15 URLs**; `/404.html` and `/thanks/` deliberately excluded.
- `/thanks/` is `noindex` by page meta and correctly **not** `Disallow`-ed — a disallowed URL is
  never crawled, so its `noindex` could never be read.

⚠️ **Known V1 defect, unresolved:** `/thanks/` carried **both** `noindex` **and** a `robots.txt`
`Disallow`. V1's `SEO_BASELINE.md` flagged this combination as self-defeating. Do not reproduce it.

## 6. Redirects

V1 declared the same 8 non-slash → trailing-slash 301s in both `_redirects` and `netlify.toml`. They
agreed; no chains detected.

⚠️ `force = false` on every `netlify.toml` redirect, so a real file at a source path would win over
its redirect. Harmless in V1; worth knowing.

⚠️ A `www` → non-www 301 is committed in V1's `netlify.toml` with `force = true`, inert until both
hostnames attach to the same site.

## 7. 🔴 Indexing — the highest-risk carried-over item

V1's `netlify.toml` contains six `[[headers]]` blocks and **no `[context.*]` blocks at all**:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
```

It applies to **every path in every deploy context — production would inherit it.** There is no
environment condition and no `_headers` file that could override it.

**V1's documented safe removal sequence:** enable Netlify's site-level "Prevent search engine
indexing" toggle on the *preview* site first, verify the preview still returns `noindex` from the
toggle, then remove the `netlify.toml` block as a discrete revertible commit.

🚫 **V2 must not copy V1's `netlify.toml` blindly.** When V2 reaches Step 12 (Netlify preview), this
is the single item most likely to either leak an unfinished site into the index or silently
de-index the launched one.

## 8. Known V1 link-graph defects (unresolved)

- `/about/` had **one** contextual inbound link site-wide — thin.
- `/privacy/` emitted **zero** internal links from `<main>` — a dead end.
- `/case-studies/rare-raleigh-restoration/` had **no in-body inbound link from the homepage** —
  deliberate, and repeatedly reaffirmed by Skyler.

## 9. What Step 2+ must NOT assume

🚫 The keyword map above is **V1's**, approved in a different context. It is preserved, not ratified
for V2.
🚫 No fresh keyword research has been done. No search volume, difficulty or SERP analysis exists in
this workspace.
🚫 There is **zero analytics data** — V1 never installed a property. No behavioural evidence exists
for any of these routes.
