/* ==========================================================================
   KREATED — WHAT HAPPENS THE MOMENT A FORM IS SENT
   handle(payload, deps) -> { form, autoReply, crm }

   Runs from netlify/functions/submission-created.js on every VERIFIED Netlify
   form submission (spam-filtered by Netlify before this is ever called). Two
   jobs, independent of each other, and neither may break the other:

     1. AN AUTOMATIC REPLY to the person, so nobody who writes in is left
        wondering whether it arrived. Sent through Resend's HTTP API with
        fetch — no SDK, no new dependency.
     2. A LEAD IN KREATEDOS, Kreated's own CRM, so no enquiry lives only in an
        inbox. Written through Supabase's REST API with fetch: a crm_leads row
        (source 'website'), a 'created' activity, and a follow-up due NOW so it
        tops the Today queue.

   ⚠ BOTH ARE OFF UNTIL THEIR KEYS EXIST. Nothing here throws for a missing
   key; the step reports 'skipped' and the form behaves exactly as before.
     RESEND_API_KEY                        enables 1
     KREATED_MAIL_FROM   (optional)        default "Kreated <contact@kreated.dev>"
     KREATED_MAIL_REPLY_TO (optional)      default contact@kreated.dev
     KREATEDOS_SUPABASE_URL                enables 2, with the key below
     KREATEDOS_SUPABASE_SERVICE_ROLE_KEY   🚫 server-only; never in client code

   ⚠ NO RESPONSE-TIME PROMISE. None is documented anywhere (see /thanks/), so
   the reply says who reads it and how to reach them, never "within 24 hours".
   ⚠ THE AUDIT REPLY NEVER SAYS A PERSON REVIEWED THE AUDIT. The generation
   model decision (free-website-audit/index.html) forbids it.
   ⚠ AN AUTO-REPLY IS AN OPEN RELAY UNLESS IT IS CAPPED. Anyone can type
   someone else's address into a public form. So: one reply per address per
   form per REPLY_WINDOW_MS, and at most DAILY_CAP replies a day in total, both
   held in Netlify Blobs. With no store available the reply is NOT sent —
   an uncapped sender is worse than a missing confirmation.
   ========================================================================== */
'use strict';

const crypto = require('crypto');

let blobsLib = null;
try { blobsLib = require('@netlify/blobs'); } catch (e) { blobsLib = null; }

const REPLY_WINDOW_MS = 12 * 60 * 60 * 1000;
const DAILY_CAP = 150;
const TIMEOUT_MS = 8000;
const PHONE = '(919) 805-8217';

/* ---- small helpers ----------------------------------------------------- */
const clean = (v, max) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max || 500);
const multiline = (v, max) => String(v == null ? '' : v).replace(/\r\n?/g, '\n').trim().slice(0, max || 4000);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const EMAIL_RE = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]{2,}$/;
const validEmail = e => EMAIL_RE.test(e) && e.length <= 254;
const firstName = n => (clean(n, 80).split(' ')[0] || '').replace(/[^\p{L}\p{M}'’-]/gu, '');
const hostOf = u => { try { return new URL(/^https?:\/\//i.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };

/* Which form. Netlify's payload names it; the field shape is the fallback so
   a renamed form still routes somewhere sensible rather than nowhere. */
function formOf(payload) {
  const name = clean(payload && (payload.form_name || (payload.data || {})['form-name']), 60);
  if (name === 'project-enquiry' || name === 'website-audit') return name;
  const d = (payload && payload.data) || {};
  if ('audit-site' in d || 'issue' in d) return 'website-audit';
  if ('need' in d || 'range' in d || 'context' in d) return 'project-enquiry';
  return name || 'unknown';
}

/* "Around $1,750, Launch" -> 1750, "$4,500+, Market Leader" -> 4500.
   The visitor's own indication, not a quote; 0 when they did not give one. */
function dealValue(range) {
  const m = String(range || '').replace(/,/g, '').match(/\$(\d{2,7})/);
  return m ? Number(m[1]) : 0;
}

/* ---- the reply ---------------------------------------------------------- */
function replyFor(form, d) {
  const hi = firstName(d.name) ? 'Hi ' + firstName(d.name) + ',' : 'Hi,';
  if (form === 'project-enquiry') {
    const lines = [
      ['What you need', clean(d.need, 120)],
      ['Budget', clean(d.range, 120)],
      ['Website', clean(d.website, 200)]
    ].filter(l => l[1]);
    const text = [
      hi, '',
      'Thanks for getting in touch. Your enquiry came through, and this is the automatic',
      'confirmation so you are not left wondering whether it did.', '',
      ...(lines.length ? ['What you sent:', ...lines.map(l => '  ' + l[0] + ': ' + l[1]), ''] : []),
      'Skyler reads every enquiry and replies personally from contact@kreated.dev.',
      'If it is urgent, call ' + PHONE + '.', '',
      'Kreated', 'https://kreated.dev'
    ].join('\n');
    const html =
      '<p>' + esc(hi) + '</p>' +
      '<p>Thanks for getting in touch. Your enquiry came through, and this is the automatic confirmation so you are not left wondering whether it did.</p>' +
      (lines.length ? '<p><b>What you sent</b><br>' + lines.map(l => esc(l[0]) + ': ' + esc(l[1])).join('<br>') + '</p>' : '') +
      '<p>Skyler reads every enquiry and replies personally from contact@kreated.dev. If it is urgent, call ' + PHONE + '.</p>' +
      '<p>Kreated<br><a href="https://kreated.dev">kreated.dev</a></p>';
    return { subject: 'Your enquiry came through — Kreated', text, html };
  }
  if (form === 'website-audit') {
    const host = hostOf(d['audit-site'] || d.website) || 'your site';
    const link = /^https:\/\/kreated\.dev\/free-website-audit\/\?r=[A-Za-z0-9_-]{16}$/.test(d['audit-report'] || '')
      ? d['audit-report'] : '';
    const text = [
      hi, '',
      'Here is your website audit for ' + host + '.', '',
      ...(link ? ['Your report: ' + link, 'The link works for 180 days and shows the site as it was on the day it was checked.', '']
               : ['The report is on the page where you ran it.', '']),
      'If you want to talk through what it found, reply to this email or call ' + PHONE + '.', '',
      'Kreated', 'https://kreated.dev'
    ].join('\n');
    const html =
      '<p>' + esc(hi) + '</p>' +
      '<p>Here is your website audit for ' + esc(host) + '.</p>' +
      (link ? '<p><a href="' + esc(link) + '">Open your report</a><br>The link works for 180 days and shows the site as it was on the day it was checked.</p>'
            : '<p>The report is on the page where you ran it.</p>') +
      '<p>If you want to talk through what it found, reply to this email or call ' + PHONE + '.</p>' +
      '<p>Kreated<br><a href="https://kreated.dev">kreated.dev</a></p>';
    return { subject: 'Your website audit for ' + host, text, html };
  }
  return null;
}

/* ---- the cap ------------------------------------------------------------ */
function defaultStore() {
  if (!blobsLib || typeof blobsLib.getStore !== 'function') return null;
  try {
    const s = blobsLib.getStore({ name: 'kreated-auto-reply', consistency: 'strong' });
    return {
      get: k => s.get(k, { type: 'json', consistency: 'strong' }),
      set: (k, v) => s.setJSON(k, v)
    };
  } catch (e) { return null; }
}

/* ⚠ The key is a hash, never the address: the store is a rate limiter, not a
   mailing list, and should not become a second copy of anyone's email. */
async function mayReply(store, email, form, now) {
  if (!store) return { ok: false, why: 'no store to cap replies' };
  const key = 'r:' + crypto.createHash('sha256').update(email.toLowerCase() + '|' + form).digest('hex');
  const day = 'd:' + new Date(now).toISOString().slice(0, 10);
  try {
    const last = await store.get(key);
    if (last && typeof last.at === 'number' && now - last.at < REPLY_WINDOW_MS) return { ok: false, why: 'already replied to this address recently' };
    const count = (await store.get(day)) || { n: 0 };
    if (count.n >= DAILY_CAP) return { ok: false, why: 'daily cap reached' };
    await store.set(key, { at: now });
    await store.set(day, { n: count.n + 1 });
    return { ok: true };
  } catch (e) {
    return { ok: false, why: 'the cap could not be checked' };
  }
}

async function sendReply(form, d, deps) {
  const env = deps.env;
  if (!env.RESEND_API_KEY) return 'skipped: RESEND_API_KEY not set';
  const email = clean(d.email, 254);
  if (!email) return 'skipped: no email given';
  if (!validEmail(email)) return 'skipped: email not valid';
  const msg = replyFor(form, d);
  if (!msg) return 'skipped: no reply for this form';
  const gate = await mayReply(deps.store, email, form, deps.now);
  if (!gate.ok) return 'skipped: ' + gate.why;
  try {
    const r = await deps.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.KREATED_MAIL_FROM || 'Kreated <contact@kreated.dev>',
        to: [email],
        reply_to: env.KREATED_MAIL_REPLY_TO || 'contact@kreated.dev',
        subject: clean(msg.subject, 140),
        text: msg.text,
        html: msg.html
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    return r.ok ? 'sent' : 'failed: resend ' + r.status;
  } catch (e) {
    return 'failed: ' + (e && e.name === 'TimeoutError' ? 'timeout' : 'network');
  }
}

/* ---- the lead ----------------------------------------------------------- */
function leadFor(form, d, payload) {
  const site = clean(d['audit-site'] || d.website, 300);
  const business = clean(d.business, 160) || hostOf(site) || clean(d.name, 160) || 'Website enquiry';
  const notes = form === 'website-audit'
    ? [
        'Ran the free website audit on kreated.dev.',
        site && 'Site checked: ' + site,
        d['audit-critical'] && d['audit-critical'] !== 'none' && 'Critical: ' + clean(d['audit-critical'], 300),
        d['audit-findings'] && 'Findings: ' + clean(d['audit-findings'], 600),
        d['audit-report'] && 'Report: ' + clean(d['audit-report'], 120),
        d.issue && 'What they said is wrong: ' + multiline(d.issue, 1500)
      ]
    : [
        'Project enquiry from kreated.dev.',
        d.need && 'Need: ' + clean(d.need, 160),
        d.range && 'Budget: ' + clean(d.range, 160),
        d.context && 'Message: ' + multiline(d.context, 3000)
      ];
  return {
    business_name: business,
    contact_name: clean(d.name, 120),
    phone: clean(d.phone, 40),
    email: clean(d.email, 254),
    website: site,
    stage: 'new',
    /* inbound beats every prospect KreatedOS generates; the audit is warmer
       than a cold list but has not asked for anything yet */
    priority: form === 'project-enquiry' ? 'hot' : 'warm',
    source: 'website',
    niche: 'other',                     /* 🚫 never guessed from the text */
    deal_value: form === 'project-enquiry' ? dealValue(d.range) : 0,
    notes: notes.filter(Boolean).join('\n'),
    tags: [form === 'website-audit' ? 'audit' : 'project-enquiry']
  };
}

async function logLead(form, d, payload, deps) {
  const env = deps.env;
  const base = (env.KREATEDOS_SUPABASE_URL || '').replace(/\/+$/, '');
  const key = env.KREATEDOS_SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return 'skipped: KreatedOS keys not set';
  if (form !== 'project-enquiry' && form !== 'website-audit') return 'skipped: unknown form';

  const H = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };
  const call = (p, opts) => deps.fetch(base + '/rest/v1/' + p, Object.assign({ signal: AbortSignal.timeout(TIMEOUT_MS) }, opts));
  const lead = leadFor(form, d, payload);
  const label = form === 'website-audit' ? 'the free website audit' : 'the project form';

  try {
    let id = null, existing = false;
    const r = await call('crm_leads', { method: 'POST', headers: Object.assign({ 'Prefer': 'return=representation' }, H), body: JSON.stringify(lead) });
    if (r.status === 201) {
      id = ((await r.json())[0] || {}).id;
    } else if (r.status === 409) {
      /* ⚠ crm_leads is unique on (lower(business_name), lower(city)) among
         unarchived rows. A second enquiry from the same business is the SAME
         lead writing in again, not an error: note it and queue a follow-up. */
      const pat = lead.business_name.replace(/[\\%_]/g, m => '\\' + m);
      const q = 'crm_leads?select=id&archived=eq.false&city=eq.&business_name=ilike.' + encodeURIComponent(pat) + '&limit=1';
      const g = await call(q, { headers: H });
      id = g.ok ? ((await g.json())[0] || {}).id : null;
      existing = !!id;
    }
    if (!id) return 'failed: lead not written (' + r.status + ')';

    const body = existing
      ? 'Wrote in again through ' + label + '.\n' + lead.notes
      : 'Came in through ' + label + ' on kreated.dev.';
    await call('crm_lead_activities', { method: 'POST', headers: H,
      body: JSON.stringify({ lead_id: id, type: existing ? 'note' : 'created', body, meta: { source: 'kreated.dev', form, submission_id: clean(payload.id, 64) || null } }) });
    await call('crm_follow_ups', { method: 'POST', headers: H,
      body: JSON.stringify({ lead_id: id, due_at: new Date(deps.now).toISOString(),
        note: form === 'website-audit' ? 'Ran the website audit. Look at the report and decide whether to reach out.' : 'Reply to the website enquiry.' }) });
    return existing ? 'noted on existing lead' : 'created';
  } catch (e) {
    return 'failed: ' + (e && e.name === 'TimeoutError' ? 'timeout' : 'network');
  }
}

/* ---- entry -------------------------------------------------------------- */
async function handle(payload, deps) {
  deps = Object.assign({ env: process.env, fetch: globalThis.fetch, now: Date.now() }, deps || {});
  if (!('store' in deps)) deps.store = defaultStore();
  const d = (payload && payload.data) || {};
  const form = formOf(payload);
  /* Netlify already dropped anything it scored as spam; the honeypot check is
     belt and braces for a submission that somehow got through with it filled */
  if (clean(d['company-website'], 10)) return { form, autoReply: 'skipped: honeypot', crm: 'skipped: honeypot' };
  const [autoReply, crm] = await Promise.all([sendReply(form, d, deps), logLead(form, d, payload, deps)]);
  return { form, autoReply, crm };
}

module.exports = { handle, _replyFor: replyFor, _leadFor: leadFor, _dealValue: dealValue, _formOf: formOf,
                   REPLY_WINDOW_MS, DAILY_CAP };
