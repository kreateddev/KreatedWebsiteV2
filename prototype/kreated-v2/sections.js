/* ==========================================================================
   KREATED V2 — BELOW-THE-HERO BEHAVIOUR
   Everything under the hero that needs state. The hero is FROZEN and owned
   entirely by hero.js — nothing in this file touches it.

   Four behaviours, all state — no scroll-linked motion anywhere:
     1. Services Index + Stage (hover/focus on desktop, accordion on mobile —
        the ONE stage element is re-seated beneath the active row on touch)
     2. How-It-Works stepper (click to jump; one gentle auto-advance pass
        that stops forever on first interaction; never runs under
        prefers-reduced-motion)
     3. FAQ accordion (one open at a time; native <details> still works
        without this file)
     4. Add-ons tray

   Everything degrades: with this file absent, every FAQ item and every
   engagement's inclusions remain reachable in their native no-JS states.
   ========================================================================== */
(function () {
  'use strict';

  var mq = window.matchMedia
         ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return mq ? mq.matches : false; }

  /* ======================================================================
     1 · SERVICES — INDEX + STAGE
     ====================================================================== */
  /* ======================================================================
     1 · SERVICES — no script. (2 · PROCESS is gone entirely; see below.)

     Both sections used to drive a large artwork stage: services swapped a
     five-scene stage on hover, process ran an autoplaying stepper against a
     five-artefact visualisation. Both stages were removed from the homepage on
     2026-08-30 (archived under _removed/2026-08-30-homepage-stages/), so the
     JavaScript that fed them had nothing left to feed.

     What replaced it is CSS. The service rows are real links and answer to
     :hover and :focus-visible; the process steps answer the same way. Nothing
     in either section depends on a pointer, on a script, or on a scroll
     position — which is the point: the reading order carries the meaning and
     hover only enhances it.

     ⚠ PROCESS WAS REMOVED FROM THE HOMEPAGE ENTIRELY on 2026-08-31 (owner
     decision). /method/ is the canonical place for process explanation. The
     markup is archived at _removed/2026-08-31-homepage-process.html.
     🚫 Do not reintroduce a script here to animate these sections, and do not
     build a substitute mini-method block on the homepage.
     ====================================================================== */



  /* ======================================================================
     3 · FAQ — one open at a time
     ====================================================================== */
  (function faq() {
    var all = Array.prototype.slice.call(document.querySelectorAll('.qa'));
    if (!all.length) return;
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        all.forEach(function (other) {
          if (other !== d) other.open = false;
        });
      });
    });
  })();

  /* ======================================================================
     4 · ENGAGEMENTS — pricing accordion (approved 2026-08-27).
     ⚠ MOVED ROUTE, 2026-08-31: these rows now live on /pricing/, not on the
     homepage. This file is loaded on both — the homepage still needs the FAQ
     block above, and the guard below means the pricing block simply does
     nothing there. 🚫 Do not split this file to "clean it up": one behaviour
     file that no-ops on the routes it does not apply to is cheaper and safer
     than two that can drift.
     One engagement open at a time; re-click collapses. Expansion is
     max-height animated in CSS (.offer__x); this only toggles state.
     ====================================================================== */
  (function offers() {
    var list = Array.prototype.slice.call(document.querySelectorAll('.offer'));
    if (!list.length) return;
    list.forEach(function (offer) {
      var btn = offer.querySelector('.offer__see');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = offer.classList.contains('is-open');
        list.forEach(function (o) {
          o.classList.remove('is-open');
          var b = o.querySelector('.offer__see');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          offer.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();
})();
