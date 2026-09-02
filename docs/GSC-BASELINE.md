# SEARCH CONSOLE BASELINE

**Opened 2026-09-01, the day the sitemap was submitted. This is a framework with the data
fields left empty on purpose.**

🚫 **Nothing in this document may be filled in from estimate, memory or expectation.** Every
number here is either read from Search Console and dated, or left blank. A fabricated baseline
is worse than none: it becomes the thing every later comparison is measured against.

---

## 0. What is actually known today

| Fact | Value | Verified |
|---|---|---|
| Canonical host | `https://kreated.dev/` | 2026-09-01, apex 200 in 0 hops |
| www behavior | 301 to apex, path-preserving | 2026-09-01 |
| Indexable routes | **34** | 18 at launch, +5 first batch, +4 full expansion, +7 final expansion 2026-09-02. |
| Noindex routes | 1 — `/thanks/` (`noindex, follow`) | 2026-09-01 |
| Sitemap | **34 URLs**. 18 submitted and discovered; 9 added 2026-09-01; 7 added 2026-09-02 | owner-confirmed for the first 18 |
| Analytics | GA4 `G-ENJ4QV1FQX` via GTM `GTM-TH3JQWL8` | one `page_view` per route, measured |
| Clarity | via the same GTM container | measured |

**Search performance data available today: none.** The site was noindex until 2026-09-01.
There is no history, and no ranking, impression or click figure exists yet for any query.

⚠ **Architecture frozen 2026-09-02.** The sitewide architecture + funnel audit changed
routing and metadata but no URL: still 34 indexable, still 1 noindex. Nothing merged,
removed or redirected. So the numbers read below measure the architecture described in
`SEO-ROADMAP.md` §16, and no URL-level discontinuity has to be reasoned around later.

⚠ **Metadata changed on 15 pages in that audit** — 13 resource descriptions were
rewritten to fit the SERP display window, and `/free-website-audit/` got a new title
and description. 🚫 Do not read a click-through-rate change in the first weeks as a
content signal; the snippets themselves changed on 2026-09-02.

---

## 1. Baseline table — fill on 2026-10-01, one month after launch

| Metric | Value | Date read |
|---|---|---|
| Total impressions, 28 days | | |
| Total clicks, 28 days | | |
| Non-branded clicks | | |
| Average position, all queries | | |
| Distinct queries with ≥1 impression | | |
| Pages with ≥1 impression | | |
| Pages with ≥1 click | | |
| Indexed pages (Pages report) | | |
| Discovered, not indexed | | |
| Crawled, not indexed | | |

**Branded vs non-branded:** treat any query containing `kreated` as branded. Branded clicks
measure whether the name is known; non-branded clicks measure whether the SEO is working. Keep
them apart from the first reading or the trend is meaningless.

### Per-page, same date

| Route | Impressions | Clicks | Avg position | Top query |
|---|---|---|---|---|
| `/` | | | | |
| `/services/web-design/` | | | | |
| `/services/website-redesign/` | | | | |
| `/services/local-seo/` | | | | |
| `/services/google-business-profile/` | | | | |
| `/services/brand-strategy/` | | | | |
| `/services/answer-engine-optimization/` | | | | |
| `/pricing/` | | | | |
| `/free-website-audit/` | | | | |
| `/work/` + 3 case studies | | | | |
| `/about/` · `/method/` · `/contact/` · `/services/` · `/privacy/` | | | | |
| `/web-design-for-contractors/` | | | | |
| `/resources/` (hub) | | | | |
| `/resources/why-your-website-isnt-getting-leads/` | | | | |
| `/resources/what-a-small-business-website-costs/` | | | | |
| `/resources/local-seo-vs-google-business-profile/` | | | | |
| `/resources/how-long-local-seo-takes/` | | | | |
| `/resources/why-your-business-isnt-on-google-maps/` | | | | |
| `/resources/how-many-service-pages/` | | | | |
| `/resources/what-answer-engine-optimization-is/` | | | | |
| `/resources/website-or-seo-first/` | | | | |
| `/resources/is-local-seo-worth-it/` | | | | |
| `/resources/custom-website-vs-website-builder/` | | | | |
| `/resources/contractor-website-checklist/` | | | | |
| `/resources/why-customers-dont-trust-your-website/` | | | | |
| `/resources/when-to-rebrand/` | | | | |
| `/resources/what-to-actually-track/` | | | | |

---

## 2. Four different events, routinely confused

These happen in order, days to months apart. Treating them as one is the most common way to
misread a launch.

| Event | Means | Where to see it | Typical timing |
|---|---|---|---|
| **Discovery** | Google knows the URL exists | Sitemaps report; "Discovered, not indexed" | Hours to days. Already done. |
| **Indexation** | The page is in the index and can appear | Pages report; URL Inspection | Days to weeks, uneven across a site |
| **Ranking** | The page appears for a query, at some position | Performance → impressions | Weeks. Position 40 is still ranking. |
| **Traffic** | Someone clicked | Performance → clicks | Last. Often weeks after first impressions. |

**Impressions before clicks is normal and healthy.** A page sitting at position 30 gets
impressions and no clicks. That is progress, not failure.

---

## 3. Monitoring plan

### First 7 days — discovery and correctness only

🚫 Do not look at rankings. There will not be any, and nothing meaningful can be concluded.

- [ ] Sitemap status "Success", **34** URLs discovered (18 at launch + 9 on 2026-09-01 + 7 on
      2026-09-02)
- [ ] Coverage: no "Excluded by 'noindex'" on any of the 34 — that would mean a page lost its
      indexable state
- [ ] `/thanks/` **does** appear as noindex-excluded. Its absence would mean the tag was lost.
- [ ] URL Inspection on 3 routes: `/`, `/services/web-design/`, `/free-website-audit/` —
      canonical reported by Google is the apex self-canonical, not a www or homepage variant
- [ ] No manual actions, no security issues
- [ ] GA4 receiving sessions; realtime shows traffic
- [ ] Clarity recording sessions
- [ ] **Expected indexed count: anywhere from 1 to 34.** A partial index at day 7 is normal and
      is not a defect to chase. ⚠ The 16 routes added after launch were submitted later than the
      first 18 and should be expected to lag them, the 7 newest most of all.

### First 30 days — indexation and first impressions

- [ ] Indexed count trending toward 34. Investigate only pages still unindexed at day 30.
- [ ] Fill the §1 baseline table on 2026-10-01
- [ ] First query list: are they relevant to the six services, or noise?
- [ ] Which pages get impressions first — expect the homepage and the strongest service pages
- [ ] Branded vs non-branded split recorded
- [ ] Any page ranking for a term assigned to a *different* page → cannibalization, log it
- [ ] `/free-website-audit/` impressions: does the tool page attract diagnostic queries?
- [ ] Audit submissions in Netlify Forms, cross-checked against GA4 `website_audit_submit`
- [ ] Contact submissions cross-checked against `contact_form_submit`

### First 60 days — direction, and the first content decision

- [ ] Compare against the 30-day baseline. Impressions rising, flat, or falling?
- [ ] Which service pages are earning non-branded impressions, and for what
- [ ] **`/services/answer-engine-optimization/`**: the resource was built on 2026-09-01 rather
      than deferred, so the open question is no longer whether to write it. It is whether the
      page plus its explainer plus 6 inbound links are earning impressions. If not by 60 days,
      the constraint is demand, not architecture, and no further AEO pages should be built.
- [ ] Queries Kreated ranks 11–30 for — the cheapest wins are here, not in new pages
- [ ] Any query where an existing page ranks but the *wrong* page does → internal-link fix
- [ ] First content batch went live 2026-09-01; the final expansion 2026-09-02. Are
      `/web-design-for-contractors/` and the fourteen resources earning impressions, and for
      what queries?
- [ ] 🚫 **The content library is closed.** No further resources are to be written on the basis
      of this reading. The next pass is the architecture audit. If a resource is earning nothing
      at 60 days the answer is to improve or retire it, not to add a neighbor to it.
- [ ] The seven newest resources were written against SERP evidence recorded in
      `SEO-ROADMAP.md` §10. Where a page is not ranking, check that reading first — the
      opportunity may simply have been misjudged, which is worth knowing before the audit.
- [ ] Re-run the SERP research in `SEO-ROADMAP.md` §3 and note what moved

---

## 4. What would actually be a problem

Distinguish these from normal slowness. Most launch anxiety is about the left column.

| Not a problem | A real problem |
|---|---|
| Only some pages indexed at day 7 | A page returning noindex that should be indexable |
| Impressions with no clicks in month 1 | Google reporting a canonical other than the page's own |
| Average position 30–60 early | `www.kreated.dev` appearing in the index alongside the apex |
| Branded queries dominating first | Sitemap status "Couldn't fetch" |
| A page still unindexed at day 20 | Manual action or security issue |
| Zero clicks in week 1 | GA4 showing zero sessions while GSC shows clicks |
| Ranking for unexpected long-tail terms | `/thanks/` indexed |

---

## 5. Measurement hygiene

- **Read 28-day windows**, not 7-day, once past the first month. Weekly windows on a new site
  are noise.
- **Record the date of every reading** in this file. An undated number is unusable later.
- **Never compare a partial period to a full one.**
- GA4 and GSC will not agree on session or click counts. They measure different things. 🚫 Do
  not reconcile them; track each against itself.
- The audit's own rate limit is 4 per IP per hour. A spike in audit attempts may show as fewer
  completions than submissions — that is the limiter working, not a fault.
