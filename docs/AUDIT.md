# THE FREE WEBSITE AUDIT
Built 2026-09-01, production-hardened and launched the same day.
**Rate limit 4/IP/hour. OpenAI prose enrichment DISABLED. Deterministic launch.**

> **2026-09-01, second revision — owner decision.** Production ships the
> deterministic audit and makes **zero** model calls. The OpenAI integration
> stays in the codebase, fully tested, behind an explicit opt-in flag
> (`KREATED_AUDIT_ENRICH`). Nothing about the product depends on it. The same
> revision replaced the hand-rolled Blobs client with the official package,
> because the hand-rolled one was falling through to per-instance memory in
> production.

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
| `KREATED_AUDIT_ENRICH` | no | **The enrichment switch. Off unless set to `1`/`true`/`on`/`yes`.** Currently unset in production, so no model call is ever made. 🚨 A configured key is **not** consent — the flag and a key are two separate decisions and both are required. |
| `KREATED_AUDIT_MODEL_KEY` | no | The OpenAI key. Read **only** when `KREATED_AUDIT_ENRICH` is on. Present in Netlify but inert. |
| `OPENAI_API_KEY` | no | Conventional fallback. ⚠ **Precedence: `KREATED_AUDIT_MODEL_KEY` wins.** The Kreated-specific name keeps the audit's key separable from any other OpenAI usage on the site. |
| `KREATED_AUDIT_MODEL_URL` | no | Defaults to `https://api.openai.com/v1/responses`. |
| `KREATED_AUDIT_MODEL_NAME` | no | Defaults to `gpt-5.6-luna`. The name lives in one place; override it here. |
| `KREATED_AUDIT_MAX_PER_HOUR` | no | Per-IP cap per hour. **Defaults to 4** — the locked public limit. Read by **both** limiters, so they agree. |
| `KREATED_AUDIT_STATE_DIR` | no | **Local development only.** Points the rate-limit store at a directory so the limiter can be tested across separate processes. 🚫 Never set this in production — Netlify Blobs is used there. |

No variable is needed for the shared limiter in production: `getStore()` picks
up its credentials automatically inside a Netlify Function, and the edge limiter
is configured in `netlify.toml`.

### Turning enrichment back on

Set `KREATED_AUDIT_ENRICH=1` in Netlify and redeploy. Nothing else changes: the
key, URL and model name are already configured, the strict schema and the
field-by-field merge are unchanged, and the failure-mode tests still cover every
way the call can go wrong. Watch `meta.modelUsed` on a live response to confirm.

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
| **Netlify Blobs**, via the official `@netlify/blobs` package | production | yes |
| **File**, under `KREATED_AUDIT_STATE_DIR` | local dev and tests | yes, across processes |
| **Memory** | last resort | no — reported as `degraded` |

⚠ **This was rebuilt on 2026-09-01 and the reason matters.** The first version
avoided a dependency by reading `NETLIFY_BLOBS_CONTEXT` and calling the API with
`fetch`. That variable is injected only for functions Netlify detects using the
package, so in production it was never there: the limiter fell through to
per-instance memory and reported `degraded: true` on every request. Reporting it
was right. Depending on an undocumented runtime contract was not.

It now uses `getStore('kreated-audit-rate')` from `@netlify/blobs`, which picks
up `siteID` and `token` automatically inside a Function. Two details are load-
bearing:

* the `require` is **static and top-level**, inside a `try`. The package is
  dual-published so CommonJS can require it directly — but the real reason is
  that Netlify decides whether to inject the Blobs credentials by looking at
  what the bundled function depends on. A dynamic `import()` is invisible to
  that analysis, the credentials never arrive, and `getStore()` throws. 🚫 Do
  not convert it to a lazy import. The `try` is what lets local runs with no
  `node_modules` fall through to the file backend;
* the backend **probes the store with a real read** before committing to it, so
  a store object that would throw on first use is rejected rather than adopted.

### 🚨 Reads must be strongly consistent

Netlify Blobs is **eventually consistent by default**: a write propagates to all
edge locations within 60 seconds, and until it does a read returns the previous
value. For a counter that is fatal and completely invisible — the store is
healthy, `degraded` is `false`, and every request inside the window reads the
same stale count, writes 1, and is allowed. Measured in production on
2026-09-01: six consecutive requests against a limit of four, all served.

The store is therefore opened with `consistency: 'strong'`, and each read names
it again. 🚫 Do not remove this for latency: one strong read is nothing next to
fetching three pages, and a limiter that cannot see its own last write is not a
limiter. It cannot be caught by a local test — the file backend is immediately
consistent — so a test pins it in the source instead.

### 🚨 The audit must be a v2 function, or Blobs does not work at all

`netlify/functions/audit.js` is a **v2 function** (`export default`), and that
is not a style choice. **Netlify injects `NETLIFY_BLOBS_CONTEXT` into the v2
runtime only.** Measured in production on 2026-09-01, on the same deploy:

| Function shape | Env the runtime provided | `getStore()` | Result |
|---|---|---|---|
| v1 `exports.handler` | `SITE_ID`, `AWS_LAMBDA_FUNCTION_NAME` | throws *"the environment has not been configured"* | limiter falls back to memory |
| v2 `export default` | **`NETLIFY_BLOBS_CONTEXT`**, `SITE_ID`, `AWS_LAMBDA_FUNCTION_NAME` | ok — read and write both succeed | limiter shared, `degraded: false` |

While the function was v1, **eight consecutive production requests were all
served** with no refusal. The endpoint was effectively unlimited, and the only
reason that was visible at all is that the limiter reports `degraded`.

The audit logic stays CommonJS in `lib/audit-core.js` so the tests and the local
shim can require it directly; `audit.js` is a thin adapter that maps the v2
`Request` onto the `event` shape the core speaks. 🚫 Do not move the logic into
the entry, and 🚫 do not convert the entry back to a handler — a test pins both.

If Blobs is unavailable for any reason the limiter still falls through to
memory, still limits, and still says `degraded: true` — proven by a test.

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
| DNS, connect and read, per page | 4s (`safe-fetch`) |
| Pages | **3 maximum** |
| Signals and classification | <50ms, synchronous, no network |
| Model prose | 6s, and skipped unless 7s remain |
| **Enforced ceiling** | **8.5s**, against Netlify's **default 10s** function timeout |

⚠ **The platform ceiling is 60 seconds, and there is nothing to configure.**
Netlify's synchronous function limit is 60s and is documented as **not
configurable** — no `netlify.toml` key (`timeout` is not a valid property
there), no UI setting, nothing to request. Earlier revisions of this document
and of `netlify.toml` asserted a **10s default that could be raised in the
Netlify UI**. Both halves were wrong: 10s was the real limit in 2022-23 and has
since been raised, and it was never a UI control. The budget was sized to that
wrong number for two phases.

**The internal budget is 22s**, set in `netlify/functions/lib/audit-core.js`:

| Stage | Worst case |
|---|---|
| shared rate limiter (2 strong Blobs round trips) | ~2.0s **allowance** |
| DNS validation | <0.05s per hop, inside each fetch |
| 3 page fetches @ `safe-fetch` 6s | 18.0s |
| signals + classification | <0.05s |
| recommendation | <0.01s |
| model prose | 0 — disabled |
| **total** | **~20.1s against a 22s budget and a 60s ceiling** |

🚫 **The budget is not the ceiling.** The forty seconds between them is not
spare capacity: it absorbs a cold start, a slow Blobs region, a host that
connects fast then stalls, and response encoding. Do not size the budget to the
platform maximum.

⚠ **The 2s limiter figure is an allowance, not a measurement.** An earlier
revision recorded it as "measured 2.1s in production". That 2.1s was the wall
time of a `curl` from a laptop and was almost entirely TLS and edge routing.
The function's own clock reports **401ms for a complete three-page production
audit**, so a warm limiter costs a few hundred milliseconds. The 2s stays as
headroom for a cold start or a slow Blobs region.

🚨 **Gating is by time remaining, not time elapsed**, and that matters more than
any number above. A fixed "no new page after Ns" threshold is only correct if
everything before it is free, and the limiter is not free — how unfree varies
with cold starts, which is the point. A slow
site therefore returns a two-page or one-page audit, with the skipped pages
named, instead of being killed mid-flight.

`PAGE_DEADLINE_MS` (5.5s) stops a *new* page fetch from starting when the clock
says there is no room, and the model pass is skipped entirely below
`MODEL_MIN_REMAINING_MS` (3s). The real worst case is about 8s: two pages then
a stop. A slow site returns a two-page audit with plain copy — a real result —
rather than a 502.

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
