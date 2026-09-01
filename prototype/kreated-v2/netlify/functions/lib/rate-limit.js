/* ==========================================================================
   KREATED — SHARED RATE LIMITING
   Serverless has no shared process memory. A Map in module scope limits ONE
   warm container, and a client that reconnects gets a fresh container and a
   fresh quota. 🚫 Do not describe an in-process Map as abuse protection.

   THE STORE IS PLUGGABLE, and picks the best backend actually available:

     1. NETLIFY BLOBS, over its runtime HTTP API. Netlify injects
        NETLIFY_BLOBS_CONTEXT (base64 JSON: { edgeURL|apiURL, token, siteID }).
        Reading it directly means genuine shared state with NO npm dependency,
        which matters because this repo has none and netlify.toml sets
        node_bundler = "none" — a require() of an uninstalled package would
        throw at runtime, not at build.
        ⚠ That env var is a runtime contract rather than a documented API. If
        Netlify changes its shape the code falls through to (3) and SAYS SO in
        the response meta, rather than silently losing protection.

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

/* ---- backend 1: Netlify Blobs over its runtime HTTP API ---------------- */
function blobsBackend() {
  const raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) return null;
  let ctx;
  try { ctx = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')); }
  catch (e) { return null; }
  const base = ctx.edgeURL || ctx.apiURL;
  if (!base || !ctx.token || !ctx.siteID) return null;

  const store = 'kreated-audit-rate';
  const url = key => base.replace(/\/$/, '') + '/' + ctx.siteID + '/' + store + '/' + encodeURIComponent(key);
  const auth = { authorization: 'Bearer ' + ctx.token };

  return {
    kind: 'blobs',
    async get(key) {
      const r = await fetch(url(key), { headers: auth, signal: AbortSignal.timeout(1500) });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('blobs get ' + r.status);
      return JSON.parse(await r.text());
    },
    async set(key, value) {
      const r = await fetch(url(key), {
        method: 'PUT', headers: { ...auth, 'content-type': 'application/json' },
        body: JSON.stringify(value), signal: AbortSignal.timeout(1500)
      });
      if (!r.ok) throw new Error('blobs put ' + r.status);
    }
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
function backend() {
  if (cached) return cached;
  cached = blobsBackend() || fileBackend() || memoryBackend();
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
  const store = backend();
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
