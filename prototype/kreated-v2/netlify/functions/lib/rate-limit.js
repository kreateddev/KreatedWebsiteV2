/* ==========================================================================
   KREATED — SHARED RATE LIMITING
   Serverless has no shared process memory. A Map in module scope limits ONE
   warm container, and a client that reconnects gets a fresh container and a
   fresh quota. 🚫 Do not describe an in-process Map as abuse protection.

   THE STORE IS PLUGGABLE, and picks the best backend actually available:

     1. NETLIFY BLOBS, via the official @netlify/blobs package. Credentials are
        automatic inside a Netlify Function. This is the ONLY backend that is
        genuinely shared in production.

     2. FILE, under the OS temp dir. Used locally so the limiter can be tested
        across separate processes, which is the property that actually matters.

     3. MEMORY, last resort, and reported as degraded.

   ⚠ There is a SECOND limiter in front of this one: netlify/edge-functions/
   audit-rate-limit.js uses Netlify's own edge rate limiting. That is the
   primary defence. This one exists because edge rate limiting is a platform
   feature that may not be enabled, and a public endpoint should not depend on
   a single control.

   FIXED WINDOW, not rolling: one counter and one expiry per IP per hour is a
   single read and a single write. A rolling window needs the whole timestamp
   list, which is more state and more writes for a limit whose exact edge
   behaviour nobody will notice.
   ========================================================================== */
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');

const WINDOW_MS = 60 * 60 * 1000;

/* ---- backend 1: Netlify Blobs, via the official package ------------------
   ⚠ REPLACED THE HAND-ROLLED CLIENT, 2026-09-01. The previous version read
   NETLIFY_BLOBS_CONTEXT and called the API with fetch, to avoid adding a
   dependency. In production that variable was never injected, so the limiter
   fell through to per-instance memory and reported degraded:true on every
   request. Reporting it was right; depending on an undocumented runtime
   contract was not.

   ⚠ THE require() IS DELIBERATELY STATIC AND TOP-LEVEL. Two reasons, and the
   second is the one that cost a deploy to learn:
     1. @netlify/blobs is dual-published — package.json exports a ./dist/
        main.cjs for require — so CommonJS needs no dynamic import.
     2. Netlify decides whether to inject the Blobs credentials by looking at
        what the bundled function actually depends on. A dynamic import() is
        not a dependency it can see, so the credentials never arrive and
        getStore() throws "the environment has not been configured".
   🚫 Do not "tidy" this into a lazy import.

   The try/catch is what keeps local development working: with no node_modules
   present the require throws and the file backend takes over. */
let blobsLib = null;
try { blobsLib = require('@netlify/blobs'); } catch (e) { blobsLib = null; }

async function blobsBackend() {
  if (!blobsLib || typeof blobsLib.getStore !== 'function') return null;

  let store;
  /* ⚠ getStore() THROWS, it does not return null, when the environment has no
     Blobs credentials — which is exactly the local case.

     🚨 consistency: 'strong' IS MANDATORY HERE, and its absence is invisible.
     Blobs reads are EVENTUALLY consistent by default: a write propagates to
     all edge locations within 60 seconds, and until it does a read returns the
     PREVIOUS value. For a counter that means every request inside that window
     reads the same stale count, writes 1, and is allowed. Measured in
     production 2026-09-01: with the store healthy and degraded:false, six
     consecutive requests against a limit of four were all served.

     Strong reads are slower. One extra read per audit is nothing next to
     fetching three pages, and a limiter that cannot see its own last write is
     not a limiter. 🚫 Do not remove this for latency. */
  try { store = blobsLib.getStore({ name: 'kreated-audit-rate', consistency: 'strong' }); }
  catch (e) { return null; }

  /* ⚠ THE LIVENESS PROBE IS GONE, deliberately. It was a third round trip on
     every cold start, and strong reads are not cheap: the limiter was costing
     about two seconds, which the audit's time budget then overspent. It was
     also redundant — check() already try/catches both the read and the write
     and reports degraded:true when either fails, which is the same protection
     for no latency. 🚫 Do not add it back. */

  return {
    kind: 'blobs',
    /* consistency is set store-wide above; named again here so a future
       reader cannot mistake this for a default read */
    async get(key) { return await store.get(key, { type: 'json', consistency: 'strong' }); },
    async set(key, value) { await store.setJSON(key, value); }
  };
}

/* ---- backend 2: a file, so local tests can prove cross-process sharing -- */
function fileBackend() {
  const dir = process.env.KREATED_AUDIT_STATE_DIR;
  if (!dir) return null;
  try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { return null; }
  const file = key => path.join(dir, encodeURIComponent(key).replace(/[^\w.%-]/g, '_') + '.json');
  return {
    kind: 'file',
    async get(key) {
      try { return JSON.parse(fs.readFileSync(file(key), 'utf8')); }
      catch (e) { return null; }
    },
    async set(key, value) { fs.writeFileSync(file(key), JSON.stringify(value)); },
    /* ⚠ expired entries must not accumulate forever. The file backend sweeps
       on write; Blobs entries carry an expiry and are overwritten in place, so
       one key per IP per window is the entire footprint either way. */
    sweep() {
      const now = Date.now();
      let files = [];
      try { files = fs.readdirSync(dir); } catch (e) { return; }
      files.forEach(f => {
        const p = path.join(dir, f);
        try {
          const v = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (!v || typeof v.expires !== 'number' || v.expires < now) fs.unlinkSync(p);
        } catch (e) { try { fs.unlinkSync(p); } catch (e2) {} }
      });
    }
  };
}

/* ---- backend 3: degraded ------------------------------------------------ */
function memoryBackend() {
  const m = new Map();
  return {
    kind: 'memory',
    degraded: true,
    async get(key) {
      const v = m.get(key);
      if (v && v.expires < Date.now()) { m.delete(key); return null; }
      return v || null;
    },
    async set(key, value) {
      m.set(key, value);
      if (m.size > 5000) {                       /* bound the footprint */
        const now = Date.now();
        for (const [k, v] of m) if (v.expires < now) m.delete(k);
      }
    }
  };
}

let cached = null;
async function backend() {
  if (cached) return cached;
  /* ⚠ order matters and is the whole policy: real shared state first, a
     shared file second so local tests can prove cross-process behaviour, and
     per-instance memory only as a last resort that announces itself. */
  cached = (await blobsBackend()) || fileBackend() || memoryBackend();
  return cached;
}
function resetBackendForTests() { cached = null; }

/* ---- the limiter -------------------------------------------------------- */
async function check(ip, opts) {
  opts = opts || {};
  /* ⚠ 4 is the LOCKED public default, owner decision 2026-09-01. The edge
     limiter in netlify/edge-functions/audit-rate-limit.js must carry the same
     number, and both read KREATED_AUDIT_MAX_PER_HOUR so an env override moves
     them together. 🚫 Never send this number to the browser. */
  const max = Number(opts.max || process.env.KREATED_AUDIT_MAX_PER_HOUR || 4);
  const windowMs = Number(opts.windowMs || WINDOW_MS);
  const now = Date.now();
  const store = await backend();
  const key = 'ip:' + String(ip || 'unknown');

  let entry = null;
  let storeOk = true;
  try { entry = await store.get(key); }
  catch (e) { storeOk = false; }

  /* an expired window is the same as no window */
  if (!entry || typeof entry.expires !== 'number' || entry.expires <= now) {
    entry = { count: 0, expires: now + windowMs };
  }

  entry.count += 1;
  try { await store.set(key, entry); if (store.sweep) store.sweep(); }
  catch (e) { storeOk = false; }

  const limited = entry.count > max;
  return {
    limited,
    /* 🚫 `max` and `remaining` are NOT sent to the browser. The response tells
       the visitor they have reached the limit and roughly when to come back,
       and nothing about the threshold or the store. */
    remaining: Math.max(0, max - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.expires - now) / 1000)),
    backend: store.kind,
    degraded: !!store.degraded || !storeOk
  };
}

module.exports = { check, backend, resetBackendForTests, WINDOW_MS };
