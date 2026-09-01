/* ==========================================================================
   KREATED — THE AUDIT ENDPOINT (Netlify Functions v2 entry)

   ⚠ WHY THIS FILE EXISTS. The audit logic lives in lib/audit-core.js and is
   CommonJS, because the test suite and the local dev shim both require it
   directly. This file is the thin v2 adapter in front of it, and the v2 shape
   is NOT cosmetic:

     Netlify injects NETLIFY_BLOBS_CONTEXT — the credentials @netlify/blobs
     needs — into the v2 function runtime ONLY. A v1 `exports.handler`
     function receives SITE_ID and nothing else, so getStore() throws
     "the environment has not been configured", the rate limiter falls through
     to per-instance memory, and the endpoint is effectively unlimited. That
     was measured in production on 2026-09-01: eight consecutive requests, no
     refusal. Converting to v2 is what makes the shared limiter real.

   🚫 Do not convert this back to `exports.handler`, and do not move the audit
   logic into this file — keeping the core in CommonJS is what keeps it
   testable without a bundler.
   ========================================================================== */
import core from './lib/audit-core.js';

export default async (request, context) => {
  /* v1-shaped event, because that is what the core and every test speak */
  const headers = {};
  request.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });

  /* ⚠ THE CALLER'S ADDRESS IS THE RATE-LIMIT KEY. v2 gives it on the context;
     the header is kept as the first source so behaviour matches the tests and
     the local shim. 🚫 Never put this value in a response. */
  if (context && context.ip && !headers['x-nf-client-connection-ip']) {
    headers['x-nf-client-connection-ip'] = context.ip;
  }

  const method = request.method;
  const body = (method === 'GET' || method === 'HEAD') ? '' : await request.text();

  const res = await core.handler({ httpMethod: method, headers, body });
  return new Response(res.body, { status: res.statusCode, headers: res.headers || {} });
};
