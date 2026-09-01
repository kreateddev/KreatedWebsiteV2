# THE FREE WEBSITE AUDIT
Built 2026-09-01, production-hardened and launched the same day.
**Rate limit 4/IP/hour. OpenAI prose enrichment enabled. Gate lifted.**

---

## 1. What it is

A visitor submits their website address. The server fetches the public site,
extracts facts, classifies six categories into four statuses, and returns
`needs`. The **existing** recommendation engine turns those needs into offers
and prices. The result renders on the page in the same session.

🚫 It is not a score generator, not a generic SEO checker, and not a form that
emails a PDF later.

## 2. The division of labour, which is the whole design

| Stage | Who | May it decide a price? |
|---|---|---|
| Fetch | `netlify/functions/lib/safe-fetch.js` | no |
| Extract signals | `lib/signals.js` | no |
| **Classify** | `lib/classify.js` — deterministic | no |
| Rewrite prose | **OpenAI `gpt-5.6-luna`**, optional | **no** |
| **Recommend** | `assets/data/recommend.js` — the same engine the pricing builder uses | yes, from `offers.js` |

⚠ **The model never decides anything priceable.** It receives findings whose
status is already fixed and rewrites two prose fields. It is never sent a
price, an offer id, a package name, the offer map, or the customer's email.

Two independent defences, not one:

1. **A strict JSON schema.** The request uses the Responses API's
   `text.format.json_schema` with `strict: true`, and the schema admits only
   `{ i, finding, why }`. The model physically cannot return a status, a
   category, an evidence array or a price.
2. **A field-by-field merge.** Only `finding` and `why` are read, only when
   they are strings of a sane length, matched by index. Everything else on a
   finding is untouchable.

A test sends a deliberately hostile reply that tries to set
`status: alreadyStrong`, change the category, inject fake evidence and a
`$9,999` price. The findings, statuses, needs and evidence come back unchanged.

⚠ **The audit works with no model configured.** That path is skipped and the
deterministic copy ships as written. An API outage degrades the writing, not
the product.

🚫 **No overall score.** There is no defensible weighting for "72/100", and a
vanity number would be the least honest thing on the page. Priorities are the
output. If a score is ever wanted, document the model first.

## 3. The model

**`gpt-5.6-luna`**, via the **OpenAI Responses API** (`POST
https://api.openai.com/v1/responses`, `Authorization: Bearer …`), verified
against the current OpenAI documentation on 2026-09-01.

⚠ **This is the Responses API, not Chat Completions**, and not the Anthropic
Messages shape this function previously spoke. The auth header, the request
body (`instructions` + `input` rather than `system` + `messages[]`) and the
response path (`output[].content[].text`) are all different. Chat Completions
still exists; Responses is what OpenAI recommends for new work and it is the
one that gives us schema-enforced replies.

**Why Luna:** the budget tier of the GPT-5.6 family at $0.20 / $1.20 per 1M
tokens. The job is rewriting six short paragraphs against fixed evidence — it
does not need a frontier model, and a free product cannot carry one. Roughly
2k tokens in and 600 out per audit puts a run near a twentieth of a cent.

## 4. Environment variables

**None are required.** The audit runs fully without any of these.

| Variable | Required | Purpose |
|---|---|---|
| `KREATED_AUDIT_MODEL_KEY` | no | The OpenAI key. Enables the prose pass; without it the deterministic copy ships. **Set in Netlify.** |
| `OPENAI_API_KEY` | no | Conventional fallback. ⚠ **Precedence: `KREATED_AUDIT_MODEL_KEY` wins.** The Kreated-specific name keeps the audit's key separable from any other OpenAI usage on the site. |
| `KREATED_AUDIT_MODEL_URL` | no | Defaults to `https://api.openai.com/v1/responses`. |
| `KREATED_AUDIT_MODEL_NAME` | no | Defaults to `gpt-5.6-luna`. The name lives in one place; override it here. |
| `KREATED_AUDIT_MAX_PER_HOUR` | no | Per-IP cap per hour. **Defaults to 4** — the locked public limit. Read by **both** limiters, so they agree. |
| `KREATED_AUDIT_STATE_DIR` | no | **Local development only.** Points the rate-limit store at a directory so the limiter can be tested across separate processes. 🚫 Never set this in production — Netlify Blobs is used there. |

No variable is needed for the shared limiter in production: Netlify injects
`NETLIFY_BLOBS_CONTEXT` into the function runtime, and the edge limiter is
configured in `netlify.toml`.

🚫 No secret value is committed to this repository. Set them in the Netlify UI
under Site configuration → Environment variables. 🚫 Never expose the key to the
client: it is read only inside the function.

## 5. Security

The endpoint takes a URL from an anonymous form and fetches it server-side,
which is an SSRF primitive unless every one of these holds. All are in
`lib/safe-fetch.js` and all are tested in `tools/test-audit.js`.

- **Scheme** — http/https only. `file:`, `ftp:`, `gopher:`, `data:`, `javascript:` refused.
- **Credentials** — `user:pass@host` refused.
- **Ports** — 80 and 443 only.
- **Hostnames** — `localhost`, `*.local`, `*.internal`, `*.home.arpa`,
  `metadata.google.internal` and any single-label host refused.
- **DNS** — every resolved address is checked. Loopback, private, link-local,
  CGNAT, multicast and reserved IPv4; loopback, ULA, link-local, multicast and
  **IPv4-mapped** IPv6. ⚠ A name resolving to *any* blocked address is refused
  outright, which is what stops DNS rebinding.
- **Connection** — the request connects to the **validated address**, not to
  the hostname again. Resolving twice is a TOCTOU window.
- **Redirects** — max 3, and every hop is re-parsed, re-resolved and re-checked.
- **Response** — `text/html` only, 1.2 MB cap, 8 s timeout.
- **Crawl budget** — homepage plus at most **two** scored pages of its own. See §8b.
- **Errors** — every message shown to a user is written by hand. 🚫 No stack
  trace, no `ECONN*`, no key, ever reaches the client.

### Rate limiting — two layers, both shared

🚫 **Process memory is not abuse protection.** A `Map` in module scope limits
one warm container; a client that reconnects gets a fresh container and a fresh
quota. The old in-process limiter has been removed.

**Public limit: 4 audits per IP per hour** (owner decision 2026-09-01), the
default in both layers.

**Layer 1 — Netlify edge rate limiting.** `netlify/edge-functions/audit-rate-limit.js`
declares `rateLimit: { windowSize: 3600, windowLimit: KREATED_AUDIT_MAX_PER_HOUR,
aggregateBy: ['ip'] }` on the function path. State is held by the platform and
shared across every instance and region.

**Layer 2 — a shared store inside the function.** `lib/rate-limit.js` picks the
best backend actually available:

| Backend | When | Shared? |
|---|---|---|
| **Netlify Blobs**, over its runtime HTTP API | production | yes |
| **File**, under `KREATED_AUDIT_STATE_DIR` | local dev and tests | yes, across processes |
| **Memory** | last resort | no — reported as `degraded` |

⚠ Blobs is reached by reading the `NETLIFY_BLOBS_CONTEXT` the runtime injects
and calling the API with `fetch`, **not** by importing `@netlify/blobs`. The
repo has zero dependencies and `node_bundler = "none"`, so a `require()` of an
uninstalled package would throw at runtime rather than fail the build. If that
runtime contract ever changes, the limiter falls through to memory **and says
so** in `meta.rateLimit.degraded` rather than silently losing protection.

Two layers because edge rate limiting is a platform feature whose availability
depends on the plan, and a public endpoint should not rest on a single control
that might quietly not be in force.

**Window:** fixed, one hour, one counter and one expiry per IP. Expired entries
are treated as absent on read and swept on write, so nothing accumulates.

**Response:** `429` with `Retry-After`, and the body reads *"You have reached
the audit limit for now. Please try again later."* 🚫 The threshold, the
backend, the remaining count and the caller's address are never sent to the
browser. The form keeps what the visitor typed.

## 6. Finding classes

| Class | Means | Leads to |
|---|---|---|
| **Critical** | Costing enquiries now | The service that fixes it |
| **Recommended** | Real improvement, not urgent | The service, framed as next |
| **Optional** | Would help, easy to defer | Named, not pushed |
| **Already Strong** | Genuinely fine | **Nothing** |

⚠ **Critical means "costing enquiries now", not "could be better".** Thin copy
was briefly in the critical trigger and made a working site with a form, a
phone number and a clear call to action come out critical purely for being
concise. Only a broken conversion path is critical.

⚠ **Already Strong must be able to recommend nothing**, and an all-strong audit
must recommend nothing at all. Both are tested. 🚫 Never add a "but you could
still…" fallback.

## 7. What it can and cannot see

Inspected: public HTML — title, meta description, headings, visible copy,
internal links, CTA labels, phone and email links, forms, structured data, the
viewport meta, and the presence of analytics tags.

🚫 **Not inspected, and the result says so on the page**: analytics, Search
Console, the Google Business Profile, any private business data, and any
ranking. Three findings carry explicit "could not be confirmed" evidence lines:
the profile was not inspected, whether conversion events are configured cannot
be seen from outside, and the answer-readiness check does not measure any AI
system's output.

🚫 **No promises.** No ranking, traffic, citation or AI-Overview claim appears
anywhere, in either the deterministic copy or the model's instructions. Tested.

## 7. Handoffs

Both write the **same sessionStorage payload the pricing builder writes**, so
there is one state format:

- **Customize This Plan** → `/pricing/#panelIndividual` with the recommendation
  preselected in the configurator, which then recalculates from there.
- **Start This Project** → `/contact/` with the selection rendered as a
  *Selected project* summary and written into hidden form fields.

Lead capture keeps the original Netlify form and adds: `audit-site`,
`audit-findings`, `audit-critical`, `audit-recommended-ids`, `audit-one-time`,
`audit-monthly`, `audit-fit`. 🚫 Never post the fetched page content — the lead
needs context, not a page dump.

## 8. Time budget

Enforced in the function, not left to the platform.

| Stage | Budget |
|---|---|
| DNS, connect and read, per page | 8s (`safe-fetch`) |
| Pages | **3 maximum** |
| Signals and classification | <50ms, synchronous, no network |
| Model prose | 6s, and skipped unless 7s remain |
| **Enforced ceiling** | **21s**, against a 26s function timeout |

`PAGE_DEADLINE_MS` (15s) stops a *new* page fetch from starting when the clock
says there is no room, and the model pass is skipped entirely below
`MODEL_MIN_REMAINING_MS`. A slow site therefore returns a two-page audit with
plain copy — a real result — rather than a 502.

🚫 Do not raise the page maximum without redoing this arithmetic.

## 8b. Crawl selection

Homepage always first. The other two are **scored, never taken in link order**
(`lib/pick-pages.js`):

| Preferred | Score |
|---|---|
| a specific service page | 100 |
| the services hub | 90 |
| pricing | 80 |
| a location page | 75 |
| service areas | 70 |
| about | 60 |
| contact | 50 |
| work or case studies | 40 |

🚫 Never chosen while anything else exists: privacy, terms, legal, cookies,
sitemap, login, account, cart, checkout, thank-you, search, feeds, tags,
categories, author and date archives, and individual blog posts.

Ties break on path depth then alphabetically, so the same links in any order
give the same pages. A soft penalty prefers two *different kinds* of page, so
one service page plus an About beats two service pages — unless service pages
are all the site has.

⚠ A page that fails to fetch is **not** counted as analysed and is reported in
`pagesSkipped`, never in `pagesRead`.

## 9. The `_redirects` gate

```
/free-website-audit/*   /contact/   302
```

**LIFTED 2026-09-01.** The line above was removed. `_redirects` now carries no
active rule, and `/free-website-audit/` becomes publicly reachable on the next
deploy. `noindex` still applies, as on all 19 routes.

Everything the gate was waiting for is done: shared rate limiting, a three-page
scored crawl, an enforced time budget, and every SSRF control re-tested after
those changes.

🚫 If the audit is ever broken again, put the line back rather than weakening
the page's copy to match a product that does not work.

## 10. Remaining before deployment

Nothing blocking. Two judgement calls:

1. **Decide whether to configure a model key.** The audit is complete and
   honest without one; the copy is simply plainer. Every failure mode is
   tested — no key, 500, timeout, malformed, and a hostile response that tries
   to change a status — and all of them return the same findings and needs.
2. **Confirm 8 audits per IP per hour** is the right public limit.
