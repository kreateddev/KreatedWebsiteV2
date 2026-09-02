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

  /* ==========================================================================
     ONCE-PER-PAGE GUARD. Funnel milestones must not repeat when a view
     re-renders. The audit re-renders on every result and the package builder
     recalculates on every checkbox, so without this a single session could push
     dozens of "complete" events and GA4 would count each one.
     🚫 Do not use this for cta_click — a second deliberate click IS a second
     click and should be recorded.
     ========================================================================== */
  window.__kreatedOnce = window.__kreatedOnce || {};
  window.kreatedTrackOnce = function (name, detail) {
    if (window.__kreatedOnce[name]) return false;
    window.__kreatedOnce[name] = true;
    window.kreatedTrack(name, detail);
    return true;
  };

  /* ==========================================================================
     CTA CLICKS — ONE EVENT NAME, TWO PARAMETERS.
     ⚠ Before 2026-09-02 this pushed the [data-evt] value AS the event name with
     an EMPTY payload. Measured in production: 71 different elements all emitted
     `cta_start_project` with `{}`, so GA4 could not tell a header button from a
     footer link from a service page's closing CTA. Four event names, no
     dimensions, no answerable question.

     Now: one `cta_click` event carrying cta_name (the [data-evt] value, kept as
     the stable identity) and cta_location (derived from where the element sits).
     🚫 Do not go back to unique event names per button — GA4 gives 50 custom
     dimensions and unlimited event names, and the scarce resource is the
     analyst's attention, not the schema.
     ========================================================================== */
  function ctaLocation(el) {
    if (el.closest('.drawer')) return 'mobile_drawer';
    if (el.closest('header, .head')) return 'header';
    if (el.closest('footer, .foot')) return 'footer';
    if (el.closest('.close')) return 'page_close';
    if (el.closest('.shero, .hero')) return 'hero';
    if (el.closest('.price, .byp')) return 'pricing';
    if (el.closest('main')) return 'body';
    return 'other';
  }

  if (!window.__kreatedTrackBound) {
    window.__kreatedTrackBound = true;
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-evt]');
      if (!el || el.tagName === 'FORM') return;
      window.kreatedTrack('cta_click', {
        cta_name: el.getAttribute('data-evt'),
        cta_location: ctaLocation(el)
      });
    });
  }

  /* ==========================================================================
     #project DEEP LINK — LAND ON THE FIELD, NOT NEAR IT.
     ⚠ forms.js already does this for same-page `#project` clicks, but 17 of the
     21 links to the form are CROSS-PAGE `/#project` (every service page's
     closing CTA among them). A cross-page link navigates, so the click handler
     on the destination page never runs and focus stayed on <body> — the reader
     arrived looking at the form with their keyboard position still at the top of
     the document. This closes that gap on load.
     🚫 preventScroll matters: the browser has already scrolled to the anchor and
     re-scrolling would fight it.
     ========================================================================== */
  if (window.location.hash === '#project') {
    window.addEventListener('load', function () {
      setTimeout(function () {
        var first = document.querySelector('#project .field input');
        if (!first) return;
        try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); }
      }, 420);
    });
  }
}());
