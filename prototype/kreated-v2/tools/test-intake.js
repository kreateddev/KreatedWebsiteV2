#!/usr/bin/env node
/* ==========================================================================
   KREATED — FORM INTAKE TESTS
   node prototype/kreated-v2/tools/test-intake.js

   netlify/functions/lib/lead-intake.js against a fake Resend and a fake
   Supabase. Nothing here sends an email or writes a row anywhere real.
   ========================================================================== */
'use strict';
const I = require('../netlify/functions/lib/lead-intake.js');

let pass = 0, fail = 0; const results = [];
async function t(name, fn) {
  try { await fn(); pass++; results.push(['ok', name]); }
  catch (e) { fail++; results.push(['FAIL', name + '\n        ' + e.message]); }
}
function ok(c, m) { if (!c) throw new Error(m || 'assertion failed'); }

const ENV = { RESEND_API_KEY: 're_test', KREATEDOS_SUPABASE_URL: 'https://x.supabase.co/',
              KREATEDOS_SUPABASE_SERVICE_ROLE_KEY: 'service' };
const NOW = Date.parse('2026-09-10T15:00:00Z');

function memStore() { const m = new Map(); return { m, get: async k => m.get(k) || null, set: async (k, v) => { m.set(k, v); } }; }

/* a fake network: records every call, answers by URL */
function fakeFetch(opts) {
  opts = opts || {};
  const calls = [];
  const fn = async (url, init) => {
    const body = init && init.body ? JSON.parse(init.body) : null;
    calls.push({ url, method: (init && init.method) || 'GET', body, headers: (init && init.headers) || {} });
    const res = (status, json) => ({ status, ok: status >= 200 && status < 300, json: async () => json });
    if (url.startsWith('https://api.resend.com')) return res(opts.resend || 200, { id: 'em_1' });
    if (/\/rest\/v1\/crm_leads$/.test(url)) return opts.dupe ? res(409, {}) : res(201, [{ id: 'lead-1' }]);
    if (/\/rest\/v1\/crm_leads\?/.test(url)) return res(200, [{ id: 'lead-existing' }]);
    return res(201, {});
  };
  fn.calls = calls;
  return fn;
}

const PROJECT = { form_name: 'project-enquiry', id: 'sub1', data: {
  name: 'Pat Example', business: 'Example Roofing', email: 'pat@example.com', phone: '910-555-0100',
  website: 'exampleroofing.com', need: 'Website Redesign', range: 'Around $2,950, Growth',
  context: 'Our site is old.\nPhones are quiet.', 'company-website': '', ip: '1.2.3.4' } };
const AUDIT = { form_name: 'website-audit', id: 'sub2', data: {
  name: 'Sam', website: 'https://samsplumbing.com', email: 'sam@example.com', issue: '',
  'audit-site': 'https://samsplumbing.com/', 'audit-critical': 'Website, Search foundations',
  'audit-findings': 'Website: critical | Search foundations: critical',
  'audit-report': 'https://kreated.dev/free-website-audit/?r=HDmkNGVoYGJKCT1u' } };

(async function () {
  await t('a project enquiry sends one reply and writes a lead, an activity and a follow-up', async () => {
    const f = fakeFetch(), store = memStore();
    const out = await I.handle(PROJECT, { env: ENV, fetch: f, store, now: NOW });
    ok(out.autoReply === 'sent', 'autoReply: ' + out.autoReply);
    ok(out.crm === 'created', 'crm: ' + out.crm);
    const mail = f.calls.find(c => c.url.includes('resend'));
    ok(mail.body.to[0] === 'pat@example.com', 'wrong recipient');
    ok(mail.body.reply_to === 'contact@kreated.dev', 'reply-to must be the monitored inbox');
    const lead = f.calls.find(c => /crm_leads$/.test(c.url)).body;
    ok(lead.source === 'website' && lead.stage === 'new' && lead.priority === 'hot', JSON.stringify(lead));
    ok(lead.deal_value === 2950, 'deal value from the range: ' + lead.deal_value);
    ok(lead.business_name === 'Example Roofing');
    ok(/Phones are quiet/.test(lead.notes), 'the message belongs in the notes');
    ok(f.calls.some(c => /crm_lead_activities$/.test(c.url) && c.body.type === 'created'), 'no created activity');
    const fu = f.calls.find(c => /crm_follow_ups$/.test(c.url));
    ok(fu && fu.body.due_at === new Date(NOW).toISOString(), 'follow-up must be due now');
  });

  await t('the reply makes no response-time promise and names nobody but Skyler', async () => {
    const m = I._replyFor('project-enquiry', PROJECT.data);
    ok(!/\b(24|48)\s*hours?|within|business day|today|tomorrow/i.test(m.text), 'a timing promise crept in: ' + m.text);
    ok(/Skyler reads every enquiry/.test(m.text));
    ok(!/\bwe\b/i.test(m.text + m.subject), 'the reply must not imply a team');
  });

  await t('the audit reply carries the report link and never claims a person reviewed it', async () => {
    const m = I._replyFor('website-audit', AUDIT.data);
    ok(m.text.includes(AUDIT.data['audit-report']), 'report link missing');
    ok(!/review(ed)? (your|the) (audit|report)|looked (at|over)|Skyler (read|review)/i.test(m.text), 'claims a human review: ' + m.text);
    ok(/samsplumbing\.com/.test(m.subject));
  });

  await t('a report link that is not a kreated.dev report is never put in an email', async () => {
    const m = I._replyFor('website-audit', Object.assign({}, AUDIT.data, { 'audit-report': 'https://evil.example/phish' }));
    ok(!/evil\.example/.test(m.text + m.html), 'a foreign link was emailed');
  });

  await t('one reply per address per form inside the window, however many submissions', async () => {
    const store = memStore();
    const a = await I.handle(PROJECT, { env: ENV, fetch: fakeFetch(), store, now: NOW });
    const b = await I.handle(PROJECT, { env: ENV, fetch: fakeFetch(), store, now: NOW + 60000 });
    const c = await I.handle(PROJECT, { env: ENV, fetch: fakeFetch(), store, now: NOW + I.REPLY_WINDOW_MS + 1 });
    ok(a.autoReply === 'sent' && /recently/.test(b.autoReply) && c.autoReply === 'sent', [a.autoReply, b.autoReply, c.autoReply].join(' / '));
    ok(b.crm === 'created', 'the cap limits EMAILS, never the lead: ' + b.crm);
  });

  await t('the store never holds an email address', async () => {
    const store = memStore();
    await I.handle(PROJECT, { env: ENV, fetch: fakeFetch(), store, now: NOW });
    ok(!JSON.stringify([...store.m.entries()]).includes('pat@example.com'), 'plain address in the store');
  });

  await t('the daily cap stops replies to new addresses', async () => {
    const store = memStore();
    store.m.set('d:2026-09-10', { n: I.DAILY_CAP });
    const out = await I.handle(PROJECT, { env: ENV, fetch: fakeFetch(), store, now: NOW });
    ok(/daily cap/.test(out.autoReply), out.autoReply);
  });

  await t('with no store there is no reply, rather than an uncapped one', async () => {
    const f = fakeFetch();
    const out = await I.handle(PROJECT, { env: ENV, fetch: f, store: null, now: NOW });
    ok(/no store/.test(out.autoReply), out.autoReply);
    ok(!f.calls.some(c => c.url.includes('resend')), 'Resend was called without a cap');
  });

  await t('missing keys switch each step off without touching the other', async () => {
    const f = fakeFetch();
    const noMail = await I.handle(PROJECT, { env: { KREATEDOS_SUPABASE_URL: ENV.KREATEDOS_SUPABASE_URL, KREATEDOS_SUPABASE_SERVICE_ROLE_KEY: 's' }, fetch: f, store: memStore(), now: NOW });
    ok(/RESEND_API_KEY/.test(noMail.autoReply) && noMail.crm === 'created', JSON.stringify(noMail));
    const noCrm = await I.handle(PROJECT, { env: { RESEND_API_KEY: 'k' }, fetch: fakeFetch(), store: memStore(), now: NOW });
    ok(noCrm.autoReply === 'sent' && /KreatedOS keys/.test(noCrm.crm), JSON.stringify(noCrm));
  });

  await t('a failing email provider never stops the lead being written', async () => {
    const out = await I.handle(PROJECT, { env: ENV, fetch: fakeFetch({ resend: 500 }), store: memStore(), now: NOW });
    ok(/failed: resend 500/.test(out.autoReply) && out.crm === 'created', JSON.stringify(out));
  });

  await t('the same business writing in again is noted on its lead, not duplicated', async () => {
    const f = fakeFetch({ dupe: true });
    const out = await I.handle(PROJECT, { env: ENV, fetch: f, store: memStore(), now: NOW });
    ok(out.crm === 'noted on existing lead', out.crm);
    const act = f.calls.find(c => /crm_lead_activities$/.test(c.url));
    ok(act.body.lead_id === 'lead-existing' && act.body.type === 'note', JSON.stringify(act.body));
    ok(f.calls.some(c => /crm_follow_ups$/.test(c.url) && c.body.lead_id === 'lead-existing'), 'no follow-up queued');
  });

  await t('an audit becomes a warm lead named after the site, with the report in the notes', async () => {
    const lead = I._leadFor('website-audit', AUDIT.data, AUDIT);
    ok(lead.business_name === 'samsplumbing.com' && lead.priority === 'warm' && lead.deal_value === 0, JSON.stringify(lead));
    ok(/\?r=HDmkNGVoYGJKCT1u/.test(lead.notes), 'report link missing from notes');
    ok(lead.tags[0] === 'audit');
  });

  await t('nothing the CRM row carries comes from the caller network data', async () => {
    const lead = I._leadFor('project-enquiry', PROJECT.data, PROJECT);
    ok(!JSON.stringify(lead).includes('1.2.3.4'), 'the submitter IP reached the CRM');
    ok(lead.niche === 'other', 'niche must never be guessed');
  });

  await t('bad or absent emails are skipped, and the honeypot stops everything', async () => {
    const f = fakeFetch();
    const bad = await I.handle({ form_name: 'project-enquiry', data: Object.assign({}, PROJECT.data, { email: 'not-an-email' }) }, { env: ENV, fetch: f, store: memStore(), now: NOW });
    ok(/not valid/.test(bad.autoReply), bad.autoReply);
    const none = await I.handle({ form_name: 'website-audit', data: Object.assign({}, AUDIT.data, { email: '' }) }, { env: ENV, fetch: fakeFetch(), store: memStore(), now: NOW });
    ok(/no email/.test(none.autoReply) && none.crm === 'created', JSON.stringify(none));
    const f2 = fakeFetch();
    const pot = await I.handle({ form_name: 'project-enquiry', data: Object.assign({}, PROJECT.data, { 'company-website': 'spam.biz' }) }, { env: ENV, fetch: f2, store: memStore(), now: NOW });
    ok(/honeypot/.test(pot.autoReply) && f2.calls.length === 0, 'honeypot submission did work');
  });

  await t('header-shaped input cannot reach the subject line', async () => {
    const m = I._replyFor('website-audit', Object.assign({}, AUDIT.data, { 'audit-site': 'https://a.com/\r\nBcc: x@y.z' }));
    ok(!/[\r\n]/.test(m.subject), 'newline in subject');
  });

  await t('the form is recognised by name, and by its fields when the name is missing', async () => {
    ok(I._formOf({ form_name: 'website-audit', data: {} }) === 'website-audit');
    ok(I._formOf({ data: { need: 'x' } }) === 'project-enquiry');
    ok(I._formOf({ data: { 'audit-site': 'x' } }) === 'website-audit');
  });

  await t('deal value reads the visitor range and nothing else', async () => {
    ok(I._dealValue('$4,500+, Market Leader') === 4500);
    ok(I._dealValue('Around $750, One Page Website') === 750);
    ok(I._dealValue('Prefer not to say yet') === 0 && I._dealValue('') === 0);
  });

  console.log('\nKREATED — form intake\n');
  results.forEach(([s, n]) => console.log('  ' + (s === 'ok' ? '✓' : '✗') + ' ' + n));
  console.log('\n  ' + pass + ' passed, ' + fail + ' failed\n');
  process.exit(fail ? 1 : 0);
}());
