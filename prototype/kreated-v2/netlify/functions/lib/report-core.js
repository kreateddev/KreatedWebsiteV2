/* ==========================================================================
   KREATED — READ A SAVED AUDIT REPORT
   GET ?id=<16 chars> -> { ok, report, created, expires } | 404

   The other half of lib/report-store.js. CommonJS for the same reason as
   audit-core.js: the tests and tools/run-function.js require it directly, and
   netlify/functions/audit-report.js is only the v2 adapter in front of it.

   ⚠ NOT RATE LIMITED BY THE AUDIT LIMITER, deliberately. Opening a link runs
   no crawl and costs one store read; counting it against the four audits an
   hour would lock out the person the report was sent to.
   ⚠ ONE ANSWER FOR EVERY FAILURE. A malformed id, an unknown id and an
   expired one all return the same 404, so the endpoint cannot be used to
   learn which ids exist.
   ========================================================================== */
'use strict';

const reports = require('./report-store.js');

function reply(status, obj, cache) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cache || 'no-store',
      'X-Robots-Tag': 'noindex'
    },
    body: JSON.stringify(obj)
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') return reply(405, { error: 'Use GET.' });
  const q = event.queryStringParameters || {};
  const id = String(q.id || '');
  const rec = await reports.load(id);
  if (!rec) {
    return reply(404, { error: 'This report link has expired or does not exist. Reports are kept for ' +
      reports.TTL_DAYS + ' days.', code: 'not-found' });
  }
  /* a saved report never changes, so a short private cache is safe */
  return reply(200, { ok: true, id: rec.id, created: rec.created, expires: rec.expires, report: rec.report },
    'private, max-age=300');
};
