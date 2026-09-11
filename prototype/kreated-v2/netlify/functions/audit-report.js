/* ==========================================================================
   KREATED — SAVED REPORT ENDPOINT (Netlify Functions v2 entry)

   The thin v2 adapter in front of lib/report-core.js, shaped exactly like
   audit.js and for the same reason: NETLIFY_BLOBS_CONTEXT is injected into
   the v2 runtime only, and without it the report store cannot be read.
   🚫 Do not convert this to `exports.handler`.
   ========================================================================== */
import core from './lib/report-core.js';

export default async (request) => {
  const headers = {};
  request.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
  const queryStringParameters = {};
  new URL(request.url).searchParams.forEach((value, key) => { queryStringParameters[key] = value; });

  const res = await core.handler({ httpMethod: request.method, headers, queryStringParameters, body: '' });
  return new Response(res.body, { status: res.statusCode, headers: res.headers || {} });
};
