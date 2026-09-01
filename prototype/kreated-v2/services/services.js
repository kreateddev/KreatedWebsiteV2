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
     pointer   hover previews (dwell-committed) · click navigates
     keyboard  focus previews immediately · Enter navigates
     touch     first tap on an inactive row previews · second tap navigates

   ⚠ The pointer path is deliberately NOT `mouseenter`. See the long note above
   the resolver below: an open row is ~300px taller than a closed one, so
   activating one slides the others under a stationary cursor, and the
   synthetic mouseenter that follows used to make the ledger flicker.

   The touch branch is the only place navigation is intercepted, and it is
   gated on a real coarse-pointer check rather than on width, so a small
   window on a laptop keeps the pointer model.
   ========================================================================== */
(function () {
  'use strict';

  /* ⚠ THE LEDGER GUARD USED TO BE THE WHOLE FILE'S GUARD, AND IT SILENTLY KILLED
     THE MOBILE DRAWER ON EVERY ROUTE EXCEPT /services/.
     `if (!ledger) return;` sat at the top of this outer IIFE, so on any page
     without a ledger — which is 18 of the 19 routes — execution stopped here and
     never reached the drawer block at the bottom of the file. The burger button
     rendered, was hit-testable, and did nothing. Verified against the archived
     build, so this predates the navigation change that surfaced it.
     The ledger now owns a scope of its own, and its early return only ends the
     ledger. 🚫 Never put a component's guard at this level again. */
  (function ledgerModule() {

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

  /* ======================================================================
     POINTER PREVIEW — rewritten 2026-08-30 to fix a reported hover glitch.

     THE BUG, measured: gliding the cursor down the ledger produced 22 state
     changes with 9 of them BACKWARDS — the ledger flickered 2-1-2-1-2-1 before
     settling. Reproducible with a single smooth downward move.

     THE CAUSE: an open row is 382px tall and a closed one is 81px. Activating
     a row therefore moves every row below it by ~300px, under a cursor that
     has not moved. The browser answers that layout shift with a synthetic
     `mouseenter` on whatever row slid under the pointer — which activated THAT
     row, which shifted the layout back, which fired another `mouseenter`. A
     bistable flip-flop, 450ms deep, driven entirely by events the user never
     generated.

     THE FIX, in three parts:

       1. Do not listen to `mouseenter` at all. A layout shift under a still
          cursor fires mouseenter/mouseover, but it never fires `pointermove`.
          Driving the preview from real pointer movement severs the feedback
          loop at its source.

       2. Resolve the row from the cursor's ACTUAL coordinates, and only count
          a hit inside `.row__head` — the always-visible line, which is the
          thing a reader aims at. Hovering an open row's panel resolves
          nothing, which is correct: you are already on that row.

       3. Commit on dwell, then hold. A target must hold the cursor for
          DWELL ms before it activates, and any move that resolves a different
          row restarts that clock — so an ambiguous boundary can never commit.
          After a commit the resolver sleeps for the length of the row
          transition, so the reflow it causes is fully ignored rather than
          chased.

     Net effect: one activation per deliberate gesture, none backwards.
     ====================================================================== */
  var DWELL = 90;
  var SETTLE = 450;   /* keep in step with --t-row in services.css */

  var pending = null;      /* the row waiting out its dwell */
  var dwellTimer = null;
  var settleTimer = null;
  var settling = false;

  function clearDwell() {
    if (dwellTimer) { clearTimeout(dwellTimer); dwellTimer = null; }
    pending = null;
  }

  /* every path into activate() — pointer, keyboard, touch — goes through here,
     so the settle window applies no matter what caused the change */
  function commit(row) {
    clearDwell();
    if (!row || row.classList.contains('is-on')) return;
    activate(row);
    settling = true;
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(function () { settling = false; }, SETTLE);
  }

  function rowUnder(x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    var head = el.closest('.row__head');
    return head ? head.closest('.row') : null;
  }

  ledger.addEventListener('pointermove', function (e) {
    if (isTouch() || settling) return;
    if (e.pointerType === 'touch') return;

    var row = rowUnder(e.clientX, e.clientY);
    if (!row || row.classList.contains('is-on')) { clearDwell(); return; }
    if (row === pending) return;              /* clock already running for it */

    clearDwell();
    pending = row;
    dwellTimer = setTimeout(function () { commit(row); }, DWELL);
  }, { passive: true });

  /* leaving the ledger abandons any pending preview. It does NOT deactivate:
     collapsing back to nothing would leave the page with zero active rows,
     which the design forbids. */
  ledger.addEventListener('pointerleave', clearDwell);
  window.addEventListener('scroll', clearDwell, { passive: true });

  rows.forEach(function (row) {
    var link = row.querySelector('.row__a');
    if (!link) return;

    /* ---- keyboard: focus commits immediately, no dwell --------------------
       A Tab press is already an unambiguous choice; making it wait would only
       add latency for the input model that needs it least. */
    link.addEventListener('focus', function () { commit(row); });

    /* ---- touch: first tap previews, second tap navigates -----------------

       ⚠ The state has to be sampled at POINTERDOWN, not read at click time.
       Tapping a link focuses it, and the focus handler above opens the row —
       so by the time `click` runs, the row it is being asked about is always
       already open. Reading the class there made every FIRST tap navigate,
       and the preview step never existed on a phone. Sampling on pointerdown
       captures the truth from before the tap changed anything.

       This is also why focus is not simply disabled under the touch model: a
       tablet with a keyboard matches `(hover:none) and (pointer:coarse)`, and
       that reader still needs focus to preview. */
    var wasOpenAtTouch = false;
    link.addEventListener('pointerdown', function () {
      wasOpenAtTouch = row.classList.contains('is-on');
    });

    link.addEventListener('click', function (e) {
      if (!isTouch()) return;         /* pointer: let it navigate            */
      if (wasOpenAtTouch) return;     /* it was already open: navigate       */
      e.preventDefault();
      commit(row);
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

  })();   /* end ledgerModule */

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
