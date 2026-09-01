/* ==========================================================================
   KREATED — FREE WEBSITE AUDIT, SERVER SIDE
   POST { url, business, email, phone? } -> { findings, fit, needs, meta }

   THE PIPELINE
     1. validate the request           (shape, size, honeypot, rate limit)
     2. fetch the site                 (lib/safe-fetch.js — SSRF-hardened)
     3. extract signals                (lib/signals.js — facts only)
     4. classify deterministically     (lib/classify.js — statuses)
     5. optionally rewrite the prose   (OpenAI, if a key is configured)
     6. return needs                   (the client maps them to offers)

   ⚠ THE MODEL NEVER DECIDES ANYTHING PRICEABLE. It receives findings that are
   already classified and rewrites the sentences. It is never sent a price, a
   package name or the offer map, and its output is merged field-by-field so a
   malformed or hostile response can only produce plainer copy, never a
   different status, a different category, or invented evidence.
   🚫 Do not "simplify" this by asking the model for the whole result.

   ⚠ THE AUDIT WORKS WITH NO MODEL CONFIGURED. Step 5 is skipped and the
   deterministic copy ships as written. That is why the product can be tested
   end to end without a key, and why an API outage degrades rather than fails.

   ENV VARS — see docs/AUDIT.md. None are required for the audit to function.
     KREATED_AUDIT_MODEL_KEY   optional. Enables step 5. Falls back to
                               OPENAI_API_KEY if unset; the Kreated-specific
                               name takes precedence.
     KREATED_AUDIT_MODEL_URL   optional. Defaults to the OpenAI Responses API,
                               https://api.openai.com/v1/responses
     KREATED_AUDIT_MODEL_NAME  optional. Defaults to gpt-5.6-luna.
     KREATED_AUDIT_MAX_PER_HOUR optional. Defaults to 8 per IP. Read by both
                                the shared limiter here and the edge limiter.
     KREATED_AUDIT_STATE_DIR    optional, LOCAL ONLY. Points the rate-limit
                                store at a directory so the limiter can be
                                tested across separate processes. 🚫 Never set
                                this in production; Netlify Blobs is used there.
   🚫 No secret value is committed to this repository.
   ========================================================================== */
'use strict';

const { safeFetch, AuditError } = require('./lib/safe-fetch.js');
const { extract, summarise }    = require('./lib/signals.js');
const { classify, fitVerdict }  = require('./lib/classify.js');
const { pick, MAX_PAGES }       = require('./lib/pick-pages.js');
const rateLimit                 = require('./lib/rate-limit.js');

const MAX_BODY = 4000;

/* ==========================================================================
   THE TIME BUDGET
   Netlify's function timeout is the ceiling, not the plan. Every stage gets a
   deadline of its own so the audit returns something useful instead of being
   killed mid-flight.

     DNS + connect + read, per page   8s   (safe-fetch's own timeout)
     3 pages, worst case             24s
     signals + classify              <50ms, synchronous, no network
     model prose                      6s   and SKIPPED when time is short
     ------------------------------------
     unbounded worst case            ~30s against a 26s function timeout

   ⚠ Which is why the budget is ENFORCED rather than hoped for. No new page
   fetch starts after PAGE_DEADLINE_MS, and the model pass is skipped unless
   MODEL_MIN_REMAINING_MS is left. A slow site returns a two-page audit with
   plain copy — a real result — instead of a 502.
   🚫 Do not raise MAX_PAGES without redoing this arithmetic.
   ========================================================================== */
const BUDGET = {
  TOTAL_MS: 21000,             /* our ceiling, comfortably under the platform's */
  PAGE_DEADLINE_MS: 15000,     /* start no new page fetch after this */
  MODEL_MS: 6000,
  MODEL_MIN_REMAINING_MS: 7000
};

/* ⚠ The in-process Map that used to live here is gone. It limited one warm
   container and nothing else. The shared store is lib/rate-limit.js, and
   netlify/edge-functions/audit-rate-limit.js sits in front of this function.
   🚫 Do not reintroduce a module-scope counter and call it rate limiting. */

function reply(status, obj) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(obj)
  };
}

/* ==========================================================================
   STEP 5 — THE OPTIONAL PROSE PASS (OpenAI)
   Verified against the current OpenAI API docs on 2026-09-01.

     POST https://api.openai.com/v1/responses
     Authorization: Bearer <key>
     { model, instructions, input, text: { format: { type: "json_schema", … } } }
     -> { output: [ { type:"message", content: [ { type:"output_text", text } ] } ] }

   ⚠ THIS IS THE RESPONSES API, NOT CHAT COMPLETIONS. The previous version of
   this function spoke the Anthropic Messages shape (x-api-key,
   anthropic-version, system + messages[], content[].text). None of that
   carries over: the auth header, the body and the response path are all
   different. Chat Completions still exists, but Responses is what OpenAI
   recommends for new work and it is the one that gives us a schema-enforced
   reply. 🚫 Do not "adapt" the old shape — it will 401 and then fail to parse.

   ⚠ STRUCTURED OUTPUT IS PART OF THE SAFETY STORY. `text.format.json_schema`
   with `strict: true` means the model physically cannot return a status, a
   category, an evidence array or a price: the schema admits only an array of
   { i, finding, why }. The field-by-field merge below is the second line of
   defence, not the first.

   🚫 THE MODEL IS NEVER THE DECISION-MAKER. It is handed findings whose status
   is already fixed by lib/classify.js and it rewrites two sentences. It never
   sees a price, an offer id, a package name, the offer map, or the customer's
   email — and nothing it returns reaches recommend.js.
   ========================================================================== */

/* the only shape the model is allowed to speak */
const REWRITE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['rewrites'],
  properties: {
    rewrites: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['i', 'finding', 'why'],
        properties: {
          i:       { type: 'integer' },
          finding: { type: 'string' },
          why:     { type: 'string' }
        }
      }
    }
  }
};

const INSTRUCTIONS =
  'You rewrite website-audit findings so they read like a careful practitioner wrote them: ' +
  'plain, specific, no marketing tone, British-neutral English, second person. ' +
  'Rules you must not break: ' +
  '(1) Never change what a finding says is wrong — only how it is worded. ' +
  '(2) Never introduce a fact that is not in the evidence you were given. ' +
  '(3) Never mention prices, packages, services for sale, or any company name. ' +
  '(4) Never promise rankings, traffic, AI citations, or any search result. ' +
  '(5) If the evidence is thin, say what could not be confirmed rather than guessing. ' +
  'Return one entry per finding you were given, reusing its i value. ' +
  'Keep "finding" under 120 characters and "why" under 240.';

async function polish(findings, ctx) {
  /* ⚠ PRECEDENCE, documented in docs/AUDIT.md: the Kreated-specific variable
     wins, because that is what is configured in Netlify and it keeps the
     audit's key separable from any other OpenAI usage. OPENAI_API_KEY is
     accepted as the conventional fallback. */
  const key = process.env.KREATED_AUDIT_MODEL_KEY || process.env.OPENAI_API_KEY;
  if (!key) return { findings, modelUsed: false, modelError: 'no key configured' };

  const url   = process.env.KREATED_AUDIT_MODEL_URL  || 'https://api.openai.com/v1/responses';
  /* gpt-5.6-luna: the budget tier of the GPT-5.6 family, $0.20/$1.20 per 1M
     tokens. Rewriting six short paragraphs does not need a frontier model, and
     a free product cannot carry one. 🚫 The name lives here and nowhere else —
     override it with KREATED_AUDIT_MODEL_NAME. */
  const model = process.env.KREATED_AUDIT_MODEL_NAME || 'gpt-5.6-luna';

  const payload = findings.map((f, i) => ({
    i, category: f.label, status: f.status,
    finding: f.finding, why: f.why, evidence: f.evidence
  }));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model,
        instructions: INSTRUCTIONS,
        input: JSON.stringify({ site: ctx.host, findings: payload }),
        max_output_tokens: 1600,
        text: {
          format: {
            type: 'json_schema',
            name: 'audit_rewrites',
            strict: true,
            schema: REWRITE_SCHEMA
          }
        }
      }),
      signal: AbortSignal.timeout(BUDGET.MODEL_MS)
    });

    /* 429 and 5xx both land here and both simply mean "no enrichment" */
    if (!res.ok) return { findings, modelUsed: false, modelError: 'status ' + res.status };

    const data = await res.json();

    /* the documented path: output[] -> content[] -> output_text.text */
    let raw = '';
    (data.output || []).forEach(item => {
      (item.content || []).forEach(c => { if (c && typeof c.text === 'string') raw += c.text; });
    });
    if (!raw && typeof data.output_text === 'string') raw = data.output_text;  /* SDK-style convenience field */
    if (!raw) return { findings, modelUsed: false, modelError: 'empty response' };

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch (e) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) return { findings, modelUsed: false, modelError: 'unparseable' };
      try { parsed = JSON.parse(m[0]); }
      catch (e2) { return { findings, modelUsed: false, modelError: 'unparseable' }; }
    }
    const rewrites = Array.isArray(parsed) ? parsed : (parsed && parsed.rewrites);
    if (!Array.isArray(rewrites)) return { findings, modelUsed: false, modelError: 'unexpected shape' };

    /* ⚠ MERGE, NEVER REPLACE. Two prose fields, length-checked, matched by
       index. Status, category, need and evidence are untouchable, so a hostile
       or confused reply can only ever produce different wording. */
    const out = findings.map(f => ({ ...f }));
    rewrites.forEach(r => {
      if (!r || typeof r.i !== 'number') return;
      const t = out[r.i];
      if (!t) return;
      if (typeof r.finding === 'string' && r.finding.length > 8 && r.finding.length < 200) t.finding = r.finding;
      if (typeof r.why === 'string' && r.why.length > 8 && r.why.length < 400) t.why = r.why;
    });
    return { findings: out, modelUsed: true, modelName: model };
  } catch (e) {
    /* a timeout, a DNS failure, an abort — none of them may fail the audit */
    return { findings, modelUsed: false, modelError: 'unavailable' };
  }
}

/* ---- needs, for the deterministic engine ------------------------------ */
function toNeeds(findings) {
  const needs = {};
  findings.forEach(f => {
    /* highest severity wins if two findings share a need */
    const rank = { critical: 3, recommended: 2, optional: 1, alreadyStrong: 0 };
    if (!(f.need in needs) || rank[f.status] > rank[needs[f.need]]) needs[f.need] = f.status;
  });
  return needs;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Use POST.' });
  if ((event.body || '').length > MAX_BODY) return reply(413, { error: 'That request was too large.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return reply(400, { error: 'That request could not be read.' }); }

  /* the same honeypot name the static forms use */
  if (body['company-website']) return reply(200, { ok: true, ignored: true });

  const url = String(body.url || '').trim();
  if (!url) return reply(400, { error: 'Enter the website address you would like checked.', field: 'url' });
  if (!String(body.email || '').includes('@')) return reply(400, { error: 'Enter an email address so the result can reach you.', field: 'email' });

  const ip = (event.headers['x-nf-client-connection-ip'] ||
              (event.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown').trim();

  /* ⚠ shared across instances. The response says the limit was reached and
     roughly when to come back, and nothing about the threshold, the store, or
     the caller's address. */
  const limit = await rateLimit.check(ip);
  if (limit.limited) {
    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Retry-After': String(limit.retryAfterSeconds)
      },
      body: JSON.stringify({
        error: 'You have reached the audit limit for now. Please try again later.',
        code: 'rate-limited'
      })
    };
  }

  const startedAt = Date.now();
  try {
    /* 2. fetch — the homepage, then at most two SCORED pages of its own */
    const first = await safeFetch(/^https?:\/\//i.test(url) ? url : 'https://' + url);
    const pages = [extract(first.html, first.finalUrl)];
    const chosen = pick(first.finalUrl, pages[0].followable, MAX_PAGES);
    const readNotes = [{ url: first.finalUrl, why: 'the homepage' }];
    const skipped = [];

    for (const c of chosen) {
      if (Date.now() - startedAt > BUDGET.PAGE_DEADLINE_MS) {
        skipped.push({ url: c.url, why: 'the time budget was reached' });
        continue;
      }
      try {
        const p = await safeFetch(c.url);
        pages.push(extract(p.html, p.finalUrl));
        readNotes.push({ url: p.finalUrl, why: c.why });
      } catch (e) {
        /* ⚠ a failed page is NOT counted as analysed, and is never reported as
           though it had been read. One unreachable subpage must not fail the
           audit. */
        skipped.push({ url: c.url, why: 'it could not be read' });
      }
    }

    /* 3 + 4 */
    const summary  = summarise(pages);
    let findings   = classify(summary);
    const fit      = fitVerdict(findings, summary);

    /* 5 — enrichment only if there is genuinely time for it */
    const remaining = BUDGET.TOTAL_MS - (Date.now() - startedAt);
    const polished = remaining >= BUDGET.MODEL_MIN_REMAINING_MS
      ? await polish(findings, { host: summary.home.host })
      : { findings, modelUsed: false, modelError: 'skipped to stay inside the time budget' };

    return reply(200, {
      ok: true,
      site: { url: first.finalUrl, host: summary.home.host },
      pagesInspected: pages.map(p => p.url),
      pagesRead: readNotes,
      pagesSkipped: skipped,
      findings: polished.findings,
      needs: toNeeds(polished.findings),
      fit,
      meta: {
        modelUsed: polished.modelUsed,
        modelNote: polished.modelError || null,
        rateLimit: { backend: limit.backend, degraded: limit.degraded },
        elapsedMs: Date.now() - startedAt,
        inspected: 'public website HTML only',
        notInspected: ['analytics', 'Search Console', 'the Google Business Profile', 'any private business data']
      }
    });
  } catch (e) {
    if (e instanceof AuditError || e.expose)
      return reply(400, { error: e.message, code: e.code });
    /* 🚫 never leak an internal error to the client */
    return reply(500, { error: 'The audit could not be completed. Try again in a moment.' });
  }
};
