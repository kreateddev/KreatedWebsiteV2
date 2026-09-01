/* ==========================================================================
   ⚠ TEMPORARY DIAGNOSTIC — DELETE ONCE THE LIMITER REPORTS degraded: false.
   The rate limiter falls back silently by design, so from outside there is no
   way to tell "the package is not bundled" from "the credentials were not
   injected". This says which, and NOTHING else: no audit, no request data, no
   thresholds, no addresses. 🚫 Do not leave it deployed.
   ========================================================================== */
'use strict';

exports.handler = async function () {
  const out = { nodeVersion: process.version, steps: [] };

  let lib = null;
  try { lib = require('@netlify/blobs'); out.steps.push('require: ok'); }
  catch (e) { out.steps.push('require: FAILED — ' + e.code + ' ' + e.message.split('\n')[0]); }

  /* which of the context variables the runtime actually provided — names only,
     never values, and never the token */
  out.envPresent = ['NETLIFY_BLOBS_CONTEXT', 'SITE_ID', 'NETLIFY_API_TOKEN', 'NETLIFY', 'AWS_LAMBDA_FUNCTION_NAME', 'NETLIFY_DEV']
    .filter(k => typeof process.env[k] === 'string' && process.env[k].length > 0);

  if (lib && typeof lib.getStore === 'function') {
    let store = null;
    try { store = lib.getStore('kreated-audit-rate'); out.steps.push('getStore: ok'); }
    catch (e) { out.steps.push('getStore: FAILED — ' + e.message); }
    if (store) {
      try { const v = await store.get('__probe__', { type: 'json' }); out.steps.push('read: ok (' + JSON.stringify(v) + ')'); }
      catch (e) { out.steps.push('read: FAILED — ' + e.message); }
      try { await store.setJSON('__probe__', { at: Date.now() }); out.steps.push('write: ok'); }
      catch (e) { out.steps.push('write: FAILED — ' + e.message); }
    }
  }

  const RL = require('./lib/rate-limit.js');
  try { out.backendSelected = (await RL.backend()).kind; }
  catch (e) { out.backendSelected = 'threw: ' + e.message; }

  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'X-Robots-Tag': 'noindex' },
           body: JSON.stringify(out, null, 1) };
};
