# BUSINESS

Verified business information for Kreated, imported from `KreatedWebsiteV1` (read-only inspection,
2026-08-19). V1 source commit `220cabc`, docs last updated there 2026-08-06.

**Confidence key:** ✅ verified in V1 as canonical · ⚠️ stated in V1 but time-sensitive or disputed ·
❓ needs Skyler confirmation

---

## 1. Identity

| Fact | Value | Confidence |
|---|---|---|
| Trading name (prose) | **Kreated** | ✅ |
| Visual wordmark | **KREATED** — uppercase, wordmark use only, never in a sentence | ✅ |
| Domain | `kreated.dev` | ✅ |
| Founder | **Skyler Reyes** | ✅ |
| Structure | **Founder-led, solo.** Nothing may imply staff, departments or a team | ✅ |
| Base | **Raleigh, North Carolina** | ✅ |
| Service area | Raleigh + North Carolina + Worldwide (all three in `areaServed` schema) | ✅ |
| Positioning line | "Based in Raleigh. Built for businesses anywhere." | ✅ |
| Phone | `+1-919-805-8217`, displayed as `(919) 805-8217` | ✅ |
| Email | `contact@kreated.dev` — confirmed canonical by Skyler | ✅ |
| Copyright line | `© 2026 Kreated` | ✅ |

## 2. What Kreated is

A **founder-led creative growth agency** in Raleigh, North Carolina, run solo by Skyler Reyes,
working with businesses locally and worldwide.

V1's one-paragraph brief, retained as accurate description of the business (not as approved V2 copy):

> Kreated is a founder-led creative growth agency in Raleigh. Its website is a hand-built,
> zero-dependency static site whose entire job is to make a business owner believe that the person
> behind it will make their business look as good as it actually is.

## 3. What it sells

Five service families. Names are canonical and must not be renamed — see
[`SERVICES.md`](SERVICES.md).

### The audit — RULED (DECISION 010)

The audit **is kept as a core Kreated conversion offer.**

- **Public-facing working name: `Free Website Audit`.**
- 🚫 **"AI Audit" is NOT the customer-facing positioning.** AI may eventually support the audit
  internally; that does not make it the product name. Do not reintroduce "Kreated AI Audit" as
  public-facing naming.
- 🚫 **Do not design or implement the audit yet.** It is an offer decision, not a build instruction.
- ⚠️ V1's early-access framing existed because the AI engine did not exist. Whether `Free Website
  Audit` is delivered manually by Skyler (in which case it is a real, deliverable offer today and
  needs no early-access framing) or still gated is **undecided**. See open items §9.

## 4. Business model

| Aspect | What V1 records | Confidence |
|---|---|---|
| Delivery | Project-based, scoped engagements | ✅ |
| Who does the work | Skyler personally — "the person who diagnoses stays on the work" | ✅ |
| Services sold together | The five services are explicitly **not** sold separately; the argument is that brand, design, search and conversion are one decision | ✅ |
| Pricing | **Not published anywhere in V1.** No price points, no ranges, no packages | ✅ (absence verified) |
| Retainers / ongoing | **Not documented.** V1 says nothing about ongoing SEO or maintenance retainers | ❓ |
| Typical project size | **Not documented** | ❓ |

## 5. Differentiation (as V1 states it)

| Competitor type | Their weakness | Kreated's counter |
|---|---|---|
| Template shops / DIY builders | Cheap, generic, invisible in search | Custom build with search and conversion designed together |
| SEO-only agencies | Rank a site that does not convert | Conversion and visibility as one decision |
| Design-only studios | Beautiful and unfindable | Technical SEO foundations from launch |
| Large agencies | Account managers, not makers | Founder-led — the diagnostician does the work |

The stated core insight: the target customer is **better at their job than their online presence
suggests.** The pain is not "I need a website"; it is *"I am being judged as smaller and less
competent than I am."*

V1's canonical positioning statement:

> **We close the gap between how good your business is and how good it looks online.**

### 🚫 NOT approved as V2 positioning (DECISION 013)

**Status: `HISTORICAL / COPY CANDIDATE`.**

- 🚫 Not approved as V2 positioning.
- **Buyer research (Step 2) must happen before V2 positioning is selected.**
- 🔴 **Step 2 must not be designed to prove the old positioning correct.** Research that sets out to
  validate a conclusion is not research. The "close the gap" insight may be re-derived from evidence
  — or contradicted by it — and both outcomes are acceptable findings.

The same status applies to the supporting line *"That gap is the whole job."* and to the five
service-page H2s in [`AUDIENCE.md`](AUDIENCE.md) that encode the same insight.

## 6. Primary business goal of the website

V1's priority order:

1. **Convert qualified enquiries into scoped projects.** Primary conversion: `Start Your Project` →
   `/contact/`.
2. **The audit.** Secondary conversion: the audit form. ✅ **Retained as a core conversion offer,
   publicly named `Free Website Audit`** (DECISION 010). ⚠️ V1 framed this goal as *"build an
   early-access list"*; that framing depended on the AI engine not existing and is **not** carried
   forward automatically.
3. **Rank for Raleigh-local commercial intent.**
4. **Establish credibility without inventing it.** Young agency, few documented engagements;
   competitive advantage is being conspicuously honest where competitors are vague.
5. **Look like it costs more than it does.** The site is the strongest proof of the service.

❓ Confirm this priority order still holds for V2. #2 is confirmed as an offer; its framing is not.

## 7. Operational facts (current at V1 close, 2026-08-06)

| Item | State | Confidence |
|---|---|---|
| Hosting | Netlify. Publish dir `.`, no build command | ✅ |
| V1 production status | ⚠️ **CONTESTED — see §7a** | ⚠️ |
| What `kreated.dev` served at V1 close | A **different** website — "Kreated — Digital Authority", ~2.26 MB | ⚠️ time-sensitive; re-check |
| V1 preview URL | `ubiquitous-trifle-10923f.netlify.app`, `noindex` | ⚠️ re-check |
| Forms | Netlify Forms — `project-enquiry`, `website-audit` | ✅ |
| Analytics in V1 repo | **None installed.** Event emitter pre-wired, no property | ✅ |
| Analytics on the live other site | GTM `GTM-TH3JQWL8` + GA4 `G-ENJ4QV1FQX`, **duplicate-firing**, ownership unresolved | ⚠️ |
| CMS | None | ✅ |
| Mail | MX ✅ · DKIM ✅ · **SPF absent** · **DMARC absent** · **delivery unproven** | ⚠️ blocker |

## 7a. V1 / V2 relationship — RULED (DECISION 016)

**Skyler's ruling, 2026-08-19:**

> **V1 remains the current production website.** V2 is intended to eventually replace V1 **only
> after**: creative approval → build completion → browser critique → revision → QA → preview
> approval → **explicit production approval from Skyler**.

🚫 **No V2 work may alter or deploy over V1 before that point.** V1 stays read-only. No push, no
deploy, no domain change, no Netlify change originating from V2 work.

### ⚠️ Factual discrepancy, flagged not resolved

Skyler's ruling states V1 is the current production website. **V1's own documentation states the
opposite**, in four places at commit `220cabc` (2026-08-06):

- `START_HERE.md` §3: *"Deployed to production — NO. `kreated.dev` serves a different website… This
  repo has **never** been deployed there."*
- `docs/DEPLOYMENT.md` §1: *"This repository has never been deployed to production."*
- `docs/DEPLOYMENT.md` §3: `kreated.dev` → a different site; `ubiquitous-trifle-10923f.netlify.app`
  → this repo, `noindex`.
- The repo was 67 commits ahead of origin and **deliberately not pushed**.

**Three readings, all plausible:**
1. V1 was deployed some time after 2026-08-06 and its docs were never updated.
2. "Current production website" means *the site currently at `kreated.dev`* — which is the older
   "Kreated — Digital Authority" site, not this repository.
3. "Production" here means *the current authoritative Kreated project*, regardless of hosting.

**The operational instruction is identical under all three: do not touch V1, do not deploy.** That
part is unambiguous and is being followed. But the factual answer changes what a V2 cutover
actually involves — swapping a Netlify site vs. replacing a legacy site vs. a first-ever deploy.

❓ **Needs Skyler:** which is it? This is not urgent for Step 2 and becomes a blocker at Step 12.

## 8. Open owner-controlled blockers carried over from V1

These are Skyler-only and are **not solved by V2**:

1. **Mail** — add SPF and DMARC, then prove delivery with a real sent message and form submission.
2. **Production indexing cutover** — V1's `netlify.toml` carries a global `X-Robots-Tag: noindex,
   nofollow` with no context conditions.
3. **Domain cutover** — `kreated.dev` currently serves a different site.
4. **Analytics ownership** — confirm ownership of `GTM-TH3JQWL8` / `G-ENJ4QV1FQX`, then decide
   fresh property vs. reuse.

## 9. Needs Skyler confirmation

**Resolved 2026-08-19** — V1/V2 relationship (DECISION 016) · the audit offer and its public name
(DECISION 010) · the "close the gap" positioning status (DECISION 013).

Still open:

- ❓ **Is V1 actually deployed?** See §7a — the ruling and V1's own docs disagree. Blocker at Step 12.
- ❓ Is `Free Website Audit` deliverable **today**, manually, or still gated behind something that
  does not exist? This decides whether it needs early-access framing at all.
- ❓ Are there retainers / ongoing services not documented in V1?
- ❓ Any new clients or engagements since 2026-08-06?
- ❓ Does the website goal priority order in §6 still hold?
