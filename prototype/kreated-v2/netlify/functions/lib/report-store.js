/* ==========================================================================
   KREATED — SAVED AUDIT REPORTS
   save(report) -> { id, created, expires } | null
   load(id)     -> { id, created, expires, report } | null

   Every completed audit is saved under an unguessable id so the result has a
   link: the visitor can send it to a business partner, and an outreach email
   can carry a report that was run before the email was written.

   ⚠ WHAT IS STORED IS THE REPORT, NEVER THE PERSON. The saved object is the
   same payload the page renders — the site, the pages read, the findings, the
   needs — and nothing from the form. No name, no email, no phone, no business
   name, no "what's the issue", no caller address. A link can be forwarded to
   anyone, so it may only hold what anyone could see by auditing the same
   public site themselves.
   🚫 Do not add form fields to the saved record "for context". The lead goes
   through the Netlify form exactly as before; this store is not a CRM.

   ⚠ NO LINK IS BETTER THAN A BROKEN ONE. There is deliberately no in-memory
   fallback here, unlike rate-limit.js. A limiter in memory is weaker but still
   limits; a report saved in one function instance's memory 404s the moment
   the link is opened anywhere else, which is every time. With no durable store
   save() returns null and the page simply does not offer a link.

   ⚠ THE require() IS STATIC AND TOP-LEVEL for the same reason it is in
   rate-limit.js: Netlify only injects the Blobs credentials into a function
   whose bundle visibly depends on @netlify/blobs. 🚫 Do not make it lazy.
   ========================================================================== */
'use strict';

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

let blobsLib = null;
try { blobsLib = require('@netlify/blobs'); } catch (e) { blobsLib = null; }

const STORE_NAME = 'kreated-audit-reports';
const TTL_DAYS   = 180;
const TTL_MS     = TTL_DAYS * 24 * 60 * 60 * 1000;

/* 12 random bytes -> 16 base64url characters, 96 bits. Guessing one is not a
   practical attack, which is what makes an unlisted link an acceptable way to
   share something that is already derived from a public website. */
const ID_RE = /^[A-Za-z0-9_-]{16}$/;
function newId() { return crypto.randomBytes(12).toString('base64url'); }
function validId(id) { return typeof id === 'string' && ID_RE.test(id); }

/* ---- backend 1: Netlify Blobs ------------------------------------------ */
function blobsBackend() {
  if (!blobsLib || typeof blobsLib.getStore !== 'function') return null;
  let store;
  /* ⚠ consistency:'strong' — the link is shown the instant the audit returns,
     and the most likely first open is someone tapping it straight away. An
     eventually consistent read can miss a write for up to 60 seconds, which
     would 404 exactly that first open. Report reads are rare; the cost is fine. */
  try { store = blobsLib.getStore({ name: STORE_NAME, consistency: 'strong' }); }
  catch (e) { return null; }                    /* no credentials: the local case */
  return {
    kind: 'blobs',
    async get(id) { return await store.get(id, { type: 'json', consistency: 'strong' }); },
    async set(id, value) { await store.setJSON(id, value); },
    async del(id) { try { await store.delete(id); } catch (e) {} }
  };
}

/* ---- backend 2: a directory, LOCAL ONLY -------------------------------- */
function fileBackend() {
  const base = process.env.KREATED_AUDIT_STATE_DIR;
  if (!base) return null;
  /* a subdirectory, so the rate limiter's sweep of its own directory never
     reads a report as a malformed counter and deletes it */
  const dir = path.join(base, 'reports');
  try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { return null; }
  const file = id => path.join(dir, id + '.json');       /* id is validated first */
  return {
    kind: 'file',
    async get(id) {
      try { return JSON.parse(fs.readFileSync(file(id), 'utf8')); } catch (e) { return null; }
    },
    async set(id, value) { fs.writeFileSync(file(id), JSON.stringify(value)); },
    async del(id) { try { fs.unlinkSync(file(id)); } catch (e) {} }
  };
}

function backend() { return blobsBackend() || fileBackend(); }

/* Only the fields the page renders. An allowlist, not a copy with deletions:
   anything added to the audit response later stays out of the store until
   someone decides it belongs in a shareable link. */
function pick(r) {
  return {
    site:           r.site ? { url: r.site.url, host: r.site.host } : null,
    pagesInspected: Array.isArray(r.pagesInspected) ? r.pagesInspected : [],
    pagesRead:      Array.isArray(r.pagesRead) ? r.pagesRead : [],
    pagesSkipped:   Array.isArray(r.pagesSkipped) ? r.pagesSkipped : [],
    findings:       Array.isArray(r.findings) ? r.findings : [],
    needs:          r.needs && typeof r.needs === 'object' ? r.needs : {},
    fit:            r.fit || null,
    meta: r.meta ? {
      modelUsed:    !!r.meta.modelUsed,
      inspected:    r.meta.inspected,
      notInspected: r.meta.notInspected
    } : null
  };
}

async function save(report, now) {
  const b = backend();
  if (!b || !report || !report.site) return null;
  const t = typeof now === 'number' ? now : Date.now();
  const id = newId();
  const rec = { v: 1, id, created: new Date(t).toISOString(),
                expires: new Date(t + TTL_MS).toISOString(), report: pick(report) };
  try { await b.set(id, rec); } catch (e) { return null; }
  return { id, created: rec.created, expires: rec.expires };
}

async function load(id, now) {
  if (!validId(id)) return null;
  const b = backend();
  if (!b) return null;
  let rec = null;
  try { rec = await b.get(id); } catch (e) { return null; }
  if (!rec || rec.v !== 1 || !rec.report) return null;
  const t = typeof now === 'number' ? now : Date.now();
  /* ⚠ Blobs has no TTL of its own. Expiry is enforced on read, and an expired
     record is deleted the first time anyone asks for it. */
  if (Date.parse(rec.expires) < t) { await b.del(id); return null; }
  return rec;
}

module.exports = { save, load, validId, TTL_DAYS, _pick: pick };
