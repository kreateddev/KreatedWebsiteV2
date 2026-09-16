/* ==========================================================================
   KREATED — MARKETPLACE AD · THE ONLY FILE YOU EDIT TO CHANGE THE AD

   Swap the copy, the price or the three websites here and re-run
   `python3 render.py`. Both crops (1080x1080 and 1080x1350) read this same
   object, so they can never drift apart.

   Nothing in this file controls layout. If a change needs the composition to
   move, that lives in layout-campaign.css and it is a design decision, not a
   content one.
   ========================================================================== */

window.AD = {

  /* The wordmark. 🚫 Uppercase in the graphic, always — "Kreated" is the
     prose form and belongs in the listing text, never on the creative. */
  wordmark: 'KREATED',

  /* The statement. \n is a hard line break. {braces} set that run in
     Cormorant Garamond italic — the Kreated serif accent.
     ⚠ ONE accent per headline. Two is a template.
     ⚠ This headline is set in CAPS in the source, not by a CSS transform, so
     what is typed here is what renders. .ad-headline's tracking is tuned for
     it; a sentence-case rewrite wants that value loosened a step. */
  headline: 'WE BUILD BUSINESSES\n{ONLINE.}',

  /* One supporting line, and it is doing real work now rather than
     elaborating the headline — it is the whole service list. Keep it to
     three items; a fourth pushes it past the headline's measure and it stops
     reading as a single beat. */
  sub: 'Websites • SEO • Social',

  /* A second quiet row beneath the fan. Empty because `sub` now names the
     services — running both would say the same thing twice in one frame,
     which is the one thing a Marketplace creative cannot afford. Set it to a
     string to bring the row back. */
  services: '',

  /* `label` is small tracked caps, `value` is the display figure. They share
     a baseline, so the whole phrase reads as one line. */
  price: { label: 'Projects starting at', value: '$750' },

  /* The sanctioned alternative is 'Build your online presence'. */
  cta: 'Message us about your business',

  /* ---- the portfolio ----------------------------------------------------
     THE ORDER OF THIS ARRAY IS THE FAN, LEFT TO RIGHT, AND IT IS NOT
     ARBITRARY. The centre window is shown whole; the outer two are covered
     on their inner edge, so the left slot keeps its LEFT half and the right
     slot keeps its RIGHT half.

       left slot   -> a site whose logo and headline sit in the left half
       centre slot -> the clearest, most legible hero; it carries the ad
       right slot  -> a site recognisable from its right half alone

     Rare Raleigh, Leak Locators and Morrow are placed against exactly those
     three tests. 🚫 Do not reorder without re-checking a render at thumbnail
     size — a swap that hides two headlines costs the ad its proof.

     `shot` is a 1600x1000 desktop hero capture in shots/. `url` is printed
     in the window chrome and is the only place the client is named, which is
     why it must be the real domain. */
  projects: [
    { slot: 'left',   url: 'rareraleighrestoration.com', shot: 'shots/rare-raleigh.jpg' },
    { slot: 'centre', url: 'leaklocatorseastcoast.com',  shot: 'shots/llec.jpg' },
    { slot: 'right',  url: 'morrow.coffee',              shot: 'shots/morrow.jpg' },
  ],
};
