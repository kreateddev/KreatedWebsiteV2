/* ==========================================================================
   KREATED V2 — /services/ · LEDGER BEHAVIOUR
   Vanilla, no libraries, same discipline as the homepage prototype's
   sections.js.

   The contract, in one line: exactly one row is active at all times — never
   zero, never two — and the row itself is the link.

   Row 01 ships active in the MARKUP, so the default state is painted by CSS
   with no script involved and no layout shift. Everything below only handles
   CHANGES of state.

   Three input models, one state machine:
     pointer   hover/focus previews · click navigates
     keyboard  focus previews (same path as hover) · Enter navigates
     touch     first tap on an inactive row previews · second tap navigates

   The touch branch is the only place navigation is intercepted, and it is
   gated on a real coarse-pointer check rather than on width, so a small
   window on a laptop keeps the pointer model.
   ========================================================================== */
(function () {
  'use strict';

  var ledger = document.querySelector('.ledger');
  if (!ledger) return;

  var rows = Array.prototype.slice.call(ledger.querySelectorAll('.row'));
  if (!rows.length) return;

  /* Coarse pointer with no hover = the touch model. Evaluated live rather than
     cached, so a hybrid device that gains a mouse behaves correctly. */
  var coarse = window.matchMedia
    ? window.matchMedia('(hover: none) and (pointer: coarse)')
    : { matches: false };

  function isTouch() { return !!coarse.matches; }

  function activate(row) {
    if (!row || row.classList.contains('is-on')) return;
    rows.forEach(function (r) {
      var on = r === row;
      r.classList.toggle('is-on', on);
      var a = r.querySelector('.row__a');
      /* aria-current marks the previewed row for assistive tech, so the active
         state is never communicated by colour and size alone */
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  rows.forEach(function (row) {
    var link = row.querySelector('.row__a');
    if (!link) return;

    /* ---- pointer: preview on hover ---------------------------------------
       Deliberately no mouseleave handler. Leaving the ledger keeps the last
       active row: collapsing back to nothing would leave the page with zero
       active rows, which the design forbids. */
    row.addEventListener('mouseenter', function () {
      if (!isTouch()) activate(row);
    });

    /* ---- keyboard: focus takes the same path as hover -------------------- */
    link.addEventListener('focus', function () { activate(row); });

    /* ---- touch: first tap previews, second tap navigates ----------------- */
    link.addEventListener('click', function (e) {
      if (!isTouch()) return;                       /* pointer: let it navigate */
      if (row.classList.contains('is-on')) return;  /* already open: navigate  */
      e.preventDefault();
      activate(row);
    });
  });

  /* ---- the instruction line has to tell the truth per input model -------- */
  var meta = document.getElementById('ledgerMeta');
  function syncMeta() {
    if (!meta) return;
    meta.textContent = isTouch()
      ? 'TAP TO PREVIEW · TAP AGAIN TO OPEN'
      : 'HOVER TO PREVIEW · EXPLORE TO OPEN';
  }
  syncMeta();
  if (coarse.addEventListener) coarse.addEventListener('change', syncMeta);
  else if (coarse.addListener) coarse.addListener(syncMeta);

  /* ======================================================================
     MOBILE DRAWER — same mechanism as the homepage prototype: the `hidden`
     property, so it works without any CSS of its own.
     ====================================================================== */
  (function drawer() {
    var btn = document.querySelector('.head__burger');
    var panel = document.getElementById('drawer');
    if (!btn || !panel) return;

    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') set(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') set(false);
    });
  })();
})();
