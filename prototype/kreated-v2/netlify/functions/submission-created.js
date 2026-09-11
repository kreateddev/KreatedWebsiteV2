/* ==========================================================================
   KREATED — ON EVERY VERIFIED FORM SUBMISSION (Netlify event function)

   ⚠ THE FILE NAME IS THE SUBSCRIPTION. Netlify calls a function named
   `submission-created` for every form submission it has verified as not spam.
   Rename it and it silently stops running. Netlify documents this convention
   as "still fully supported" alongside the newer handler-object syntax; the
   file name is kept because its payload shape is the documented one
   ({ payload: { form_name, data, created_at, id } }).

   ⚠ v2 SHAPE (export default), like audit.js, because only the v2 runtime is
   given the Netlify Blobs credentials — and the auto-reply cap lives in Blobs.
   Without them lib/lead-intake.js refuses to send rather than send uncapped.

   All the logic is in lib/lead-intake.js (CommonJS, so the tests require it
   directly). This adapter only unwraps the request and logs the outcome.
   🚫 The outcome log carries statuses only — never a name, an address or
   anything the person typed.
   ========================================================================== */
import intake from './lib/lead-intake.js';

export default async (request) => {
  let payload = null;
  try { payload = (await request.json()).payload; } catch (e) { payload = null; }
  if (!payload) { console.log('[submission-created] no payload'); return new Response('ok'); }

  const out = await intake.handle(payload);
  console.log('[submission-created] form=' + out.form + ' autoReply=' + out.autoReply + ' crm=' + out.crm);
  /* the platform ignores the body; 200 either way so nothing retries into a
     second auto-reply */
  return new Response('ok');
};
