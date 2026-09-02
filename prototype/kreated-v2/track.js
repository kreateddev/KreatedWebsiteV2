/* ==========================================================================
   KREATED — EVENT EMITTER
   Extracted from forms.js on 2026-09-01. It used to live inside that file,
   which meant the delegated [data-evt] listener only existed on the seven
   routes that load it — while [data-evt] attributes are on all nineteen. Every
   header and footer CTA on the other twelve routes was silently untracked, and
   the day a GA4 container was added those clicks would simply not have
   appeared. 🚫 Do not move this back into forms.js.

   THIS FILE CONTACTS NOTHING. It pushes to a container that is already on the
   page and does nothing at all if none is. That is what keeps the site's
   zero-third-party-request property true until analytics is deliberately
   installed, and it is why the file is safe to load on every route.

   🚫 NO PERSONAL DATA, EVER. The payload is a short event name plus, at most,
   a couple of booleans. Never a name, an email address, a phone number, a form
   message, a submitted URL, crawled page content, or audit evidence text. The
   audit deliberately does not call this at all: its context reaches Skyler
   through the Netlify form, as summaries, not through analytics.

   ⚠ BOTH GUARDS BELOW MATTER. forms.js also runs on seven routes; without the
   function guard it would redefine the emitter, and without the binding flag
   the delegated listener would attach twice on those routes and every CTA
   click would count double.
   ========================================================================== */
(function () {
  'use strict';

  if (typeof window.kreatedTrack !== 'function') {
    window.kreatedTrack = function (name, detail) {
      var payload = detail || {};
      try {
        if (window.dataLayer && typeof window.dataLayer.push === 'function') {
          window.dataLayer.push(Object.assign({ event: name }, payload));
        }
        if (typeof window.plausible === 'function') {
          window.plausible(name, { props: payload });
        }
        document.dispatchEvent(new CustomEvent('kreated:event', {
          detail: { name: name, detail: payload }
        }));
      } catch (e) { /* analytics must never break an interaction */ }
    };
  }

  /* delegated [data-evt] click tracking — V1's pattern, unchanged */
  if (!window.__kreatedTrackBound) {
    window.__kreatedTrackBound = true;
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-evt]');
      if (el && el.tagName !== 'FORM') window.kreatedTrack(el.getAttribute('data-evt'), {});
    });
  }
}());
