/* ==========================================================================
   KREATED — PLATFORM RATE LIMIT IN FRONT OF THE AUDIT
   Netlify's own edge rate limiting. State is held by the platform and shared
   across every instance and region, which is the property a serverless
   limiter actually needs and the one process memory can never have.

   This is the FIRST of two controls. The second is lib/rate-limit.js inside
   the function, which uses Netlify Blobs. Two layers because edge rate
   limiting is a platform feature whose availability depends on the plan, and
   a public endpoint should not rest on a single control that might silently
   not be in force.

   ⚠ The window here is expressed in the same terms as
   KREATED_AUDIT_MAX_PER_HOUR so the two layers agree. If you change one,
   change the other. 🚫 Do not expose either number in a response body.
   ========================================================================== */
export default async (request, context) => {
  const res = await context.next();
  /* ⚠ TEMPORARY PROOF HEADER. There is no other way from outside to tell
     "the edge function ran and the limit is not reached" from "the edge
     function never ran". Remove once the layer is confirmed. */
  try { res.headers.set('x-kreated-edge', 'ran'); } catch (e) {}
  return res;
};

export const config = {
  /* ⚠ TEMPORARILY WIDENED to cover the diagnostic function too, so this can
     be probed without spending audit quota. */
  path: '/.netlify/functions/*',
  rateLimit: {
    windowSize: 3600,
    /* ⚠ must match the default in netlify/functions/lib/rate-limit.js */
    windowLimit: Number(Deno.env.get('KREATED_AUDIT_MAX_PER_HOUR') || 4),
    aggregateBy: ['ip'],
    action: 'rate_limit'
  }
};
