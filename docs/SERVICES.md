# SERVICES

The five service families. **Names are canonical. Do not rename, merge, split or reorder.**

Imported from `KreatedWebsiteV1` (`docs/PROJECT_OVERVIEW.md` §4, `docs/SEO_AND_CONTENT.md` §1),
read-only inspection 2026-08-19.

---

## 1. The five (canonical order)

| # | Service | V1 route | Scope boundary |
|---|---|---|---|
| 01 | **Web Design & Development** | `/services/web-design/` | New site creation, **including businesses with no website at all** |
| 02 | **Website Redesign** | `/services/website-redesign/` | Improving or replacing an **existing** site |
| 03 | **Local SEO** | `/services/local-seo/` | The **broader local-search system** — website, local pages, keywords, business listings |
| 04 | **Google Business Profile Optimization** | `/services/google-business-profile/` | Profile creation, claiming, **verification guidance**, and optimization |
| 05 | **Brand Strategy & Identity** | `/services/brand-strategy/` | Brand strategy, positioning, identity |

**Order matters.** In V1 it was enforced in three places (homepage services composition numbered
01–05, desktop mega-menu, mobile nav). ⚠️ V2's navigation structure is not designed yet, but the
order is inherited as canonical.

## 2. Boundaries that must not blur

- **Local SEO ≠ Google Business Profile Optimization.** GBP is the profile. Local SEO is everything
  around it. V1 verified these do not collide on keywords.
- **Web Design ≠ Website Redesign.** No existing site vs. existing site. V1 verified no head-term
  collision.
- **Web design explicitly covers businesses with no website yet.** V1 shipped an approved 7th FAQ on
  that page for exactly this: `I don't have a website yet. Can you build one for my business?`

Two approved V1 strings encode the GBP/Local SEO split verbatim:

> `If you do not have a profile yet, we help you create, claim, and verify it first. Then we
> complete the profile using the steps below.`

> `This service focuses on your profile. Local SEO covers the wider work around it: your website,
> local pages, keywords, and business listings.`

These are **approved V1 copy**. Reusing them verbatim in V2 is safe; altering them is not.

## 3. The connection argument

V1's differentiating claim, and the reason the Kreated Method exists:

> The five services are explicitly **not** sold separately.

V1 services hub H2: *"Pick the symptom, not the service."* Sub: *"Built to connect, not to be bought
separately."*

The defensible position V1 states: anyone can sell a website; Kreated sells the argument that brand,
design, search and conversion are one decision, and that buying them from four vendors is why the
last attempt did not work.

⚠️ Imported as V1's approved positioning. Carrying it into V2 is Skyler's call.

## 4. The sixth offer — Free Website Audit

**RULED, Skyler 2026-08-19 (DECISION 010):** the audit is **retained as a core Kreated conversion
offer.** Public-facing working name: **`Free Website Audit`**.

- 🚫 **"AI Audit" is not the customer-facing positioning.** AI may eventually support the audit
  internally; that does not make it the product name. Do not reintroduce "Kreated AI Audit"
  publicly.
- 🚫 **Do not design or implement the audit yet.**
- V1 gave it a route (`/free-website-audit/`) and a homepage section, both required to retain
  **early-access framing** because the AI engine did not exist.
- V1's locked verbatim labels — `Early access is opening soon.` · `Nothing is scanned right now.` ·
  `Nothing has been scanned yet.` · `Demonstration only — sample wording, not results from any
  submitted website.` — were written for that unbuilt engine. ⚠️ They are **not** automatically
  correct for a `Free Website Audit` that Skyler can deliver manually.
- ❓ **Still open:** is the audit deliverable **today**? If yes, the early-access framing and the
  `Request Early Access` CTA may both be obsolete. See [`CONVERSION.md`](CONVERSION.md) §9.

## 5. Verbs that are honest, per service

From V1's evidence rules:

- 🚫 **Kreated cannot bypass, guarantee or control Google's verification decision.** Only *guidance*
  and *help with* are honest verbs for GBP verification.
- 🚫 No ranking, placement, traffic or revenue promise on any service.
- 🚫 Nothing may imply a team ("our team", "our designers", departments).

## 6. Per-service structure inherited from V1

⚠️ Structural inheritance only — **not a layout instruction for V2.**

- Every service page ended with **six FAQs**; `/services/web-design/` was an approved exception at
  **seven**. 🚫 Seven is not the default.
- Every service page opened with an H2 stating the buyer's situation (see
  [`AUDIENCE.md`](AUDIENCE.md)).
- Every leaf carried a visible breadcrumb and matching `BreadcrumbList` schema.
- Each service page carried `Service`, `BreadcrumbList` and `FAQPage` JSON-LD.

## 7. Adding or renaming a service

In V1 this touched four places (page folder, services hub, desktop dropdown, mobile nav accordion)
because there was no shared template. V2's build model is undecided, but the rule stands:

🚫 **A service is not added, renamed or removed without explicit Skyler approval logged in
[`DECISIONS.md`](DECISIONS.md).**
