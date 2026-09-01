/* ⚠ TEMPORARY DIAGNOSTIC — v2 function shape (export default), as opposed to
   the v1 exports.handler shape the audit uses. The v1 diagnostic showed the
   runtime provides SITE_ID and AWS_LAMBDA_FUNCTION_NAME but NO Blobs context.
   This tests whether the v2 runtime injects it. 🚫 Delete after use. */
import { getStore } from '@netlify/blobs';

export default async () => {
  const out = { shape: 'v2', nodeVersion: process.version, steps: [] };
  out.envPresent = ['NETLIFY_BLOBS_CONTEXT', 'SITE_ID', 'NETLIFY_API_TOKEN', 'NETLIFY', 'AWS_LAMBDA_FUNCTION_NAME']
    .filter(k => typeof process.env[k] === 'string' && process.env[k].length > 0);
  let store = null;
  try { store = getStore('kreated-audit-rate'); out.steps.push('getStore: ok'); }
  catch (e) { out.steps.push('getStore: FAILED — ' + e.message); }
  if (store) {
    try { const v = await store.get('__probe__', { type: 'json' }); out.steps.push('read: ok ' + JSON.stringify(v)); }
    catch (e) { out.steps.push('read: FAILED — ' + e.message); }
    try { await store.setJSON('__probe__', { at: Date.now() }); out.steps.push('write: ok'); }
    catch (e) { out.steps.push('write: FAILED — ' + e.message); }
  }
  return new Response(JSON.stringify(out, null, 1),
    { headers: { 'Content-Type': 'application/json', 'X-Robots-Tag': 'noindex' } });
};
