# CONVERSION

Conversion requirements and CTA architecture carried over from V1.

🚫 **No copy is finalised here.** Any wording that was not explicitly approved by Skyler is labelled
`COPY CANDIDATE — NOT APPROVED`.

Imported from `KreatedWebsiteV1` (`docs/SEO_AND_CONTENT.md` §6, `docs/TRACKING_INVENTORY.md`,
`docs/PROJECT_OVERVIEW.md` §2), read-only inspection 2026-08-19.

---

## 1. The two conversions

V1 had exactly two, site-wide:

| # | Conversion | Destination | Priority |
|---|---|---|---|
| 1 | **Start Your Project** | `/contact/` | Primary — the business goal |
| 2 | **The audit form** | `/free-website-audit/` | Secondary |

Everything else on the site existed to make conversion #1 an informed, confident click.

### ✅ RULED — the audit is retained (DECISION 010)

**Both conversions carry into V2.** The audit remains a **core Kreated conversion offer.**

- **Public-facing working name: `Free Website Audit`.**
- 🚫 **"AI Audit" is not the customer-facing positioning.** AI may support the audit internally
  later; that does not make it the product name. Do not reintroduce "Kreated AI Audit" publicly.
- 🚫 **Do not design or implement the audit yet.** This ruling settles that the offer exists — not
  what it looks like, how it is delivered, or what the page says.
- ⚠️ The CTA phrase `Get a Free Website Audit` (§2) already matches this name and needs no change.
- ⚠️ `Request Early Access` (§2) was written for the unbuilt AI engine. Whether it still applies
  depends on whether the audit is deliverable today — see open items §9.

## 2. The five sanctioned CTA phrases — APPROVED, LOCKED

These five are the complete set. 🚫 **Never invent a sixth.**

> ✅ **V2 wording settled — DECISION 021 (2026-08-28).** The approved V2 homepage uses
> **`Start a Project`** and **`Free Website Audit`**. Those are now the authoritative V2 forms;
> the V1 spellings below are kept as history. Do not re-flag this as a discrepancy.

1. `Start Your Project` — V1 form · **V2 uses `Start a Project`**
2. `Get a Free Website Audit` — V1 form · **V2 uses `Free Website Audit`**
3. `View Case Study`
4. `Explore the Kreated Method`
5. `Request Early Access`

🚫 **Never use:** "Learn More" · "Click Here" · "Submit" · "Get Started" · "Book a Call".

### Capitalisation rule — verified perfect split in V1, zero exceptions
- `Get a Free Website Audit` on `.cta-secondary` **buttons**
- `Get a free website audit` on `.link-cta` **inline links**

🚫 **Do not normalise these to match each other.**

### The inline-link exception
`.link-cta` is a **contextual inline-link style**. Destination-specific wording is allowed where it
describes the destination accurately and invents no promise. ⚠️ V1 records that the sanctioned
five-phrase list was **not** expanded by this exception — it is a style, not a licence for new CTAs.

## 3. Forms

| Form | Where | Provider | Honeypot | Success path |
|---|---|---|---|---|
| `project-enquiry` | `/contact/` **and** the homepage start section | Netlify Forms | `company-website` | AJAX inline, `/thanks/` fallback |
| `website-audit` | `/free-website-audit/` | Netlify Forms | ⚠️ **none** | `/thanks/` |

- The homepage start form deliberately **reused** the `/contact/` form name and pipeline rather than
  creating a second form. Keep that pattern unless there is a reason not to.
- ✅ **`website-audit` honeypot — FIXED in V2 (2026-08-28).** Both V2 forms declare
  `netlify-honeypot="company-website"` with a matching off-canvas, `aria-hidden`, non-tabbable
  field. The V1 gap is closed.
- ⚠️ **Form delivery is unproven.** A form that submits successfully to Netlify but whose
  notification never arrives is a silently broken conversion. **This is a launch blocker, not a
  nicety.** See [`BUSINESS.md`](BUSINESS.md) §8.
  🔍 **Verify live DNS before changing anything.** This document recorded SPF and DMARC as absent on
  `kreated.dev` as of 2026-08-19; external DNS may have changed since, and nothing in this repo can
  observe it. Check the live records first — do not apply records prescribed from this note.
  Delivery stays unproven until V2 is connected to Netlify, both forms are detected, and a live test
  submission arrives in the intended inbox.

## 4. Contact routes

| Channel | Value |
|---|---|
| Form | `project-enquiry` → Netlify Forms |
| Email | `contact@kreated.dev` |
| Phone | `(919) 805-8217` — `tel:+19198058217` |

V1 exposed the phone on `/contact/`, `/privacy/` and `404.html`. ❓ Whether V2 surfaces a phone
number prominently is undecided.

## 5. Event tracking — pre-wired, never activated

V1 shipped a complete, **unused** event emitter: `window.kreatedTrack(name, detail)`. It pushes to
`window.dataLayer` if one exists, calls `window.plausible()` if defined, and always dispatches a
`kreated:event` CustomEvent. Attached via **delegated `click` and `submit` listeners** on any element
carrying `data-evt` — so GA4 via GTM works the moment a container is installed, with no markup
changes.

### V2 event names — CURRENT (2026-08-28)

The two `audit_earlyaccess_*` names were retired: they described the abandoned AI early-access
framing, not what the events measure. Renamed, not duplicated.

| Event | Fires when | Was |
|---|---|---|
| `contact_form_submit` | `project-enquiry` POST resolves OK | unchanged |
| `website_audit_submit` | `website-audit` POST resolves OK | `audit_earlyaccess_submit` |
| `website_audit_url_interaction` | audit URL field interaction | `audit_earlyaccess_url` |
| `cta_start_project` | any Start a Project CTA click | new |
| `cta_website_audit` | any Free Website Audit CTA click | new |

**Success events fire on resolution, not on the `submit` event.** V1 fired on submit, which counts
attempts: a rejected POST would have registered as a lead. Invalid submit = 0 events; failed POST =
0 events; successful POST = exactly 1; interacting again after success = no duplicate.

**No PII.** The payload is `{form_name, has_website: bool, has_phone: bool}` — never a name, email,
phone number, URL or message body.

`data-evt` values used in V1, for history:

| Event | Location |
|---|---|
| `hero_start_project` | homepage hero primary CTA |
| `hero_view_cases` | homepage hero secondary CTA |
| `nav_contact_click` | masthead + mobile nav contact CTA |
| `contact_form_submit` | `/contact/` project enquiry form |
| `audit_earlyaccess_url` | audit URL field — **retired, see above** |
| `audit_earlyaccess_submit` | audit submit — **retired, see above** |

⚠️ V1 notes these six are a **starting point, not a spec.** They predate the last homepage rebuild
and do not cover the homepage start form, click-to-call, click-to-email, service CTAs, featured-work
interaction, validation errors, or form failure.

### Analytics decisions still open (from V1, unresolved)
1. Does Skyler own `GTM-TH3JQWL8` and `G-ENJ4QV1FQX`? Reuse or start clean?
2. If reusing GA4 — fresh property, or continue with an annotation? (The existing property has been
   collecting from a *different* website.)
3. Fix the duplicate-GA4 firing on the current live site, or retire it with the domain cutover?
4. Consent / CMP choice, and which market's rules apply.
5. Microsoft Clarity, Meta Pixel, Google Ads at launch, or deferred?
6. Is there call tracking? Which provider?

⚠️ V1 shipped **zero third-party origins** as a deliberate performance advantage. Installing any tag
breaks that. It should be broken **once, deliberately**, not incrementally.

## 6. Consent

V1 had no CMP, no cookie banner and no Consent Mode signals — correct while there was nothing to
consent to. **Becomes a requirement the moment a tag is installed.**

## 7. Conversion-relevant content requirements carried over

- Every service page ended with six FAQs (web-design excepted at seven). FAQs did conversion work by
  pre-answering objections.
- Every case study stated its evidence level. ⚠️ V1 treated this as a **conversion asset**, not a
  disclaimer — the honesty is the differentiator.
- Honest unfinished states: a missing screenshot was a marked, designed media slot, never a mockup.

## 8. `COPY CANDIDATE — NOT APPROVED`

Nothing in this section is approved. It exists so V2 does not re-derive it from scratch.

- `COPY CANDIDATE — NOT APPROVED` — homepage primary CTA wording beyond the five locked phrases
- `COPY CANDIDATE — NOT APPROVED` — form field labels, placeholders, helper text, error messages
- `COPY CANDIDATE — NOT APPROVED` — the `/thanks/` confirmation wording
- `COPY CANDIDATE — NOT APPROVED` — every heading, subheading and paragraph written for V2
- `COPY CANDIDATE — NOT APPROVED` — any replacement for the dropped "Brands We've Scaled" kicker
  (DECISION 009). 🚫 A reworded version carrying the same growth implication is the same claim
- `COPY CANDIDATE — NOT APPROVED` — `We close the gap between how good your business is and how good
  it looks online.` — **HISTORICAL / COPY CANDIDATE only** (DECISION 013)

**Approved V1 strings that may be reused verbatim** are listed in [`PROOF.md`](PROOF.md) and
[`SERVICES.md`](SERVICES.md). Anything not on those lists is a candidate, not approved copy.

## 9. Open conversion questions for Skyler

**Resolved 2026-08-19** — the audit is retained as a core conversion offer, publicly named
`Free Website Audit` (DECISION 010). Two conversions, not one.

Still open:

- ❓ Is `Free Website Audit` deliverable **today** (manually, by Skyler), or still gated? This
  decides whether `Request Early Access` survives as a CTA phrase or is retired from the locked five.
- ❓ Is a phone number a primary conversion surface, or contact-page only?
- ❓ Is a calendar booking link ever wanted? (V1 banned "Book a Call" as a CTA phrase, but never
  ruled on booking itself.)
- ❓ Analytics: fresh property or reuse — this gates Step 12.
