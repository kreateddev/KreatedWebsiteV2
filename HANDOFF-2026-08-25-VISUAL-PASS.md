# KREATED V2 — SESSION HANDOFF · 2026-08-25 (post visual-direction pass)

**For:** Claude Code (Opus 5), continuing in `/Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2`
**Working prototype:** `prototype/omc-kreated-home/`
**Written by:** the Fable 5 session that ran the creative direction, hero lock, full-page build, and the visual-direction correction pass. Everything below describes the state as actually committed — nothing speculative.

---

## 1. Where the project stands right now

The homepage prototype is **architecturally complete and visually corrected**, in this order, all on one continuous navy canvas (`--navy #0B1220`, footer steps to `--ink`):

1. Navigation — transparent at top, fixed + returns on scroll-up with `Start a Project` (motion.js)
2. **Hero — FROZEN** (see §3)
3. Client Trust — quiet typographic strip, three real clients, all three linking to live sites
4. Services — Index + Stage, "one world, five crops" art direction
5. How It Works — five-step stepper + "five artifacts" visuals
6. Featured Work + Testimonial — the page's photographic peak, **currently running on labelled AWAITING-ASSET capture slots** (see §2, the top priority)
7. Investment — engagement title-page treatment (pricing still 🔴 CANDIDATE)
8. FAQ — tightened accordion (copy candidates)
9. Final CTA — large statement + ghosted mark + both CTAs
10. Footer — canonical contact data (`contact@kreated.dev`, `(919) 805-8217`, "Based in Raleigh. Built for businesses anywhere.", © 2026 Kreated)

Two build passes happened on 2026-08-25 and are recorded in the prototype `README.md`:
- **Build reset** — full homepage implemented below the frozen hero (new `sections.js`).
- **Visual-direction correction** — per the approved art-direction review: Proof rebuilt as two mirrored full-width case bands + upgraded testimonial; peak/valley rhythm (`--sec-lg / --sec / --sec-sm`, `.h2--peak` on Services and Work); Services stage container removed and five scenes rebuilt as large cropped Ashford & Sons surfaces (GBP star glyphs removed); Process chart replaced by five recognizable artifacts (audit sheet → scope doc → build-in-progress → launch presence → incoming call); Investment de-productized (Cormorant `No. 01–03` numerals, run-in middot scope lines, small-caps `ENGAGEMENTS FROM $X,XXX`, one cobalt button on Growth, text links elsewhere).

**Verified at commit time** (headless Chromium, 1440 / 768 / 390 / reduced-motion): zero horizontal overflow, zero console errors (favicon 404 aside), services hover + mobile accordion working, process stepper + one-pass auto-advance working, no stale Rare Raleigh status text anywhere in the rendered page, hero markup/CSS byte-identical to the pre-pass originals.

## 2. THE ONE BLOCKING TASK — real live-site captures

The Proof section is designed around five real screenshots that **do not exist yet**. The remote session that built this pass could not reach the public internet, so every image renders as a labelled dashed AWAITING-ASSET slot (project rule: missing media is a marked slot, never a fake).

Claude Code runs locally with network access — **capture these first**, with a headless browser (Playwright/Puppeteer) or any real-capture method:

| File (create `assets/img/proof/`) | Source | Spec |
|---|---|---|
| `llec-desktop.jpg` | https://leaklocatorseastcoast.com | ~1600×1000 desktop viewport |
| `llec-mobile.jpg` | same | ~390-wide mobile viewport, full height ok (slot crops to 9:19, top-anchored) |
| `rr-desktop.jpg` | https://rareraleighrestoration.com | ~1600×1000 |
| `rr-mobile.jpg` | same | ~390-wide mobile |
| `learnsmart-desktop.jpg` | https://learnsmart.dev | ~1600×1000 |

Rules: real captures of the real live pages only — never reconstructed, mocked, or AI-generated imagery in a proof position (`docs/PROOF.md` §6). Optimize to roughly ≤200 KB per desktop capture. No markup changes needed — the `<img>` tags already point at these paths and the slots disappear automatically (`onerror` adds `.is-missing`). After dropping them in, re-review the Work section at 1440 and 390 and adjust `object-position`/crop only if a capture composes badly.

## 3. FROZEN — do not touch

- **Hero**: markup (index.html lines up to the `</section>` of `.hero`), copy, typewriter, `hero.js`, `hero3d.js`, the hero CSS block (styles.css lines 1–423), materials, lighting, layout. Verified byte-identical through both passes; keep it that way.
- `motion.js` (header + drawer) and `sections.js` (services stage, process stepper, FAQ, add-ons) — behavior is approved; don't rewrite without cause.
- Section order and IDs (`services`, `process`, `work`, `investment`, `faq`, `start`, `about`).
- Continuous dark canvas — no alternating section backgrounds.
- Motion philosophy — no scroll-linked motion, no parallax, no global reveals. All ambient motion lives inside artwork and stops composed under `prefers-reduced-motion`.
- CTA labels: `Start a Project` / `Free Website Audit` / `View Work`. (Note: these diverge from `docs/CONVERSION.md`'s locked V1 phrases — Skyler's explicit instruction; flagged, not an error to "fix".)
- **V1**: read-only, never deployed over (DECISION 016). Nothing is pushed or deployed from this work.

## 4. Locked proof facts in the page (do not alter)

- LLEC scope string, exact: `Website · Google Business Profile`.
- LLEC bounded observation, exact wording pattern in the case band: `Dated observation, not a guarantee. Checked on August 2, 2026: #2 for "Pool leak detection" in Wilmington, NC.` Never name the result surface.
- Testimonial: Missy Boyd's Google review, shown as a verbatim **excerpt** with trims marked (`[…]`) — see §5, the excerpt itself is still pending approval. Attribution: `Missy Boyd — Founder, LearnSmart Educational Consulting and Academic Coaching`. No star glyphs, no review counts anywhere.
- **Rare Raleigh is PUBLISHED/LIVE** — `https://rareraleighrestoration.com` — per **DECISION 019** (appended to `docs/DECISIONS.md` 2026-08-25). The old label `Strategy delivered · implementation in progress` is retired from the rendered homepage. ⚠ `docs/PROOF.md` §4 and `docs/PROJECTS.md` §3 still carry the old status — that's a pending docs pass, NOT a reason to restore the label to the page.
- Ashford & Sons remains the only fictional visual world (Services scenes + Process artifacts), always accompanied by its locked label: `Demonstration only — sample wording, not results from any submitted website.` The Process panel carries `Illustrative — not live data.`
- Never invent: clients, metrics, rankings, reviews, testimonials, outcomes, logos, screenshots.

## 5. Awaiting Skyler's approval (do not silently resolve)

1. **Pricing** — 🔴 CANDIDATE. `$2,500 / $5,500 / $9,500 / $350/mo` come from Skyler's separate business planning, not `docs/` (BUSINESS.md §4 verifies pricing was never published). Marked in index.html comments. Do not change, do not treat as approved.
2. **Testimonial excerpt** — the trim needs explicit approval per PROOF.md §5 (alternative is the full verbatim review, which contains the reviewer's "Skylar" spelling — also Skyler's call).
3. **Rare Raleigh delivered-scope line** — currently `Audit · Strategy · Website`, a COPY CANDIDATE; docs only document audit+plan as delivered before go-live. Needs Skyler's confirmation of the completed engagement's actual scope.
4. **All section headings/leads, FAQ answers, add-on list, final CTA statement** — COPY CANDIDATE, flagged in section comments.
5. Care Plan / retainers — undocumented in V1 (❓ open item).

## 6. Known open items / honest weak points

- The Proof section is the page's designed peak and is running on placeholders until §2 is done — this is the single biggest gap between the current page and the approved direction.
- `docs/PROOF.md` and `docs/PROJECTS.md` need a docs pass to reflect DECISION 019 (append/update with history preserved — do not rewrite unrelated content).
- No trust-strip logos are staged (name lockups only); real logo assets are referenced in `docs/ASSETS.md` if that upgrade is ever wanted.
- FAQ "Read more questions" and both CTA destinations are `#` stubs — no target pages exist yet.
- Client photography rights (LLEC pool photos, Rare Raleigh job photos) remain RIGHTS TO CONFIRM; the old `llec-work.jpg` photo is no longer used on the page but stays in `assets/img/`.
- Fictional-brand caveat: "Ashford & Sons" is the established labelled specimen from V1; the name has not been cleared against real businesses beyond that history.

## 7. File map (prototype/omc-kreated-home/)

| File | State |
|---|---|
| `index.html` | Current page — hero (frozen) + all 8 rebuilt sections; heavy inline comments mark locked strings and candidates |
| `styles.css` | Lines 1–423 = frozen hero/system block; everything after = the below-hero system (tokens, trust, services scenes, process artifacts, proof cases, investment, faq, final, footer, mobile, reduced-motion) |
| `sections.js` | Services stage activation + mobile re-seat, process stepper + one-pass auto-advance, FAQ one-open, add-ons tray |
| `hero.js` / `hero3d.js` | Frozen hero typewriter + fluted-glass renderer |
| `motion.js` | Header return-on-scroll-up + mobile drawer |
| `README.md` | History incl. both 2026-08-25 pass notes |
| `assets/img/proof/` | **Does not exist yet** — created by the capture task (§2) |
| `serve.py` | `python3 serve.py 5180` → http://localhost:5180 |

Also touched outside the prototype: `docs/DECISIONS.md` (019 appended). Everything else in `docs/` untouched this session.

## 8. Suggested order of work for this session

1. Capture + optimize the five screenshots (§2); verify Proof at 1440/390.
2. Docs pass: update `PROOF.md` §4/§9 and `PROJECTS.md` §3 to reflect DECISION 019, preserving history.
3. Then stop and show Skyler the page with real imagery before any further design iteration — the standing rule of this phase is: **no new technology, no new sections, no hero work; make it more visual only when Skyler asks.**
