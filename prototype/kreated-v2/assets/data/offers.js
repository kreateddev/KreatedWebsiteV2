/* ==========================================================================
   KREATED — THE OFFER MAP, AS DATA
   Generated from docs/OFFER-MAP.md. This file is the ONLY copy of Kreated's
   prices, coverage and exclusivity rules that runs in a browser.

   🚫 Do not add a price to a template, a page, or a second script. If a number
   appears in two files one of them is wrong and a customer finds out first.
   🚫 Do not edit a price here without editing docs/OFFER-MAP.md and
   docs/PRICING-SOURCE-OF-TRUTH-AUDIT.md in the same change. tools/test-engine.js
   asserts this file against the locked catalogue and will fail the build of
   anyone's confidence if it drifts.

   Loaded by:
     · /pricing/  the Build Your Package configurator      (today)
     · /free-website-audit/  findings -> recommendations   (next phase)

   No build step, no modules, no dependencies: the UMD wrapper lets Node
   require() it for the tests and the browser read it as window.KreatedOffers.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.KreatedOffers = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---- price kinds ------------------------------------------------------
     one-time : billed once for the engagement
     monthly  : recurring, billed monthly in advance
     ⚠ These two are NEVER summed together. See recommend.js.               */

  /* ---- `from` vs fixed --------------------------------------------------
     from:true  renders "from $X" and makes any total containing it a FROM
                total. Eleven of the public figures are from-prices.
     high:      set only for the two published ranges. The low end is what a
                total uses; the range is preserved for display.             */

  var OFFERS = [
    /* ================= WEBSITES — one base package at a time ============= */
    { id:'pkg.web.onepage', name:'One Page Website', group:'website', kind:'one-time',
      price:750, from:true, exclusive:'website-base',
      what:'One page, built properly: what you do, where you work, what it costs to start, and how to reach you.',
      does:'Stops you losing the people who look you up before they call. One credible address to send anyone to.',
      fit:'Your work comes from referral or from a profile on someone else’s platform, and you have nowhere of your own to send people.' },

    { id:'pkg.web.launch', name:'Launch', group:'website', kind:'one-time',
      price:1750, from:true, exclusive:'website-base',
      covers:{ 'svc.track.analytics':'full',
               'svc.page.standard':{ level:'sized', allowance:'three to five core pages' } },
      what:'A custom website of three to five core pages, with search foundations and lead tracking live from day one.',
      does:'Gets you online correctly and already counting leads, so you can see how many people got in touch and where they came from.',
      fit:'You have no site, or one that never really worked, and you need to look established before spending on search.' },

    { id:'pkg.web.growth', name:'Growth', group:'website', kind:'one-time',
      price:2950, from:true, exclusive:'website-base', common:true,
      /* ⚠ ALLOWANCES ARE CONTRACTUAL, owner decision 2026-09-01. `allow` is a
         real number of included pages and the engine charges only BEYOND it.
         `pool` means service and location pages draw on ONE shared allowance,
         which is how the published copy reads: "up to two service or location
         pages", not two of each.
         🚫 svc.page.standard keeps NO allowance. Its "six to ten pages" is the
         size of the site being built, not a credit against buying extra pages
         on top. The owner's ruling named service and location pages only. */
      covers:{ 'svc.track.analytics':'full',
               'svc.search.gbp':{ level:'full', note:'the one-time profile audit' },
               'svc.page.standard':{ level:'sized', allowance:'six to ten pages' },
               'svc.page.service' :{ level:'allowance', allow:2, pool:'pages', allowance:'two service or location pages' },
               'svc.page.location':{ level:'allowance', allow:2, pool:'pages', allowance:'two service or location pages' } },
      what:'Everything in Launch, plus keyword research and mapping, conversion copy, and a Google Business Profile audit.',
      does:'Builds the site from research rather than assumption, so the pages that exist are the ones people are actually searching for.',
      fit:'The work is already good and the website is the thing underselling it.' },

    { id:'pkg.web.leader', name:'Market Leader', group:'website', kind:'one-time',
      price:4500, from:true, exclusive:'website-base',
      /* four is the documented FLOOR of "four to eight-plus". 🚫 Do not encode
         eight: the engine must never include scope the proposal might not. */
      covers:{ 'svc.track.analytics':'full',
               'svc.search.gbp':'full',
               'svc.page.landing':'full',
               'svc.page.standard':{ level:'sized', allowance:'ten to twenty-plus pages' },
               'svc.page.service' :{ level:'allowance', allow:4, pool:'pages', allowance:'four service or location pages' },
               'svc.page.location':{ level:'allowance', allow:4, pool:'pages', allowance:'four service or location pages' } },
      what:'Everything in Growth, plus service by location architecture, funnels and landing pages, integrations and attribution.',
      does:'Makes the site route, qualify and measure work rather than only describing the company.',
      fit:'You serve several cities or many services and already spend money to win work.' },

    /* ================= INDIVIDUAL WEBSITE WORK ========================== */
    { id:'svc.page.standard', name:'Additional Standard Page', group:'pages', kind:'one-time',
      price:250, from:true, qty:true, unit:'page',
      what:'One more page built on the patterns your site already uses, with content you provide.',
      does:'Gives something that currently has nowhere to live a proper home: a policy, a second location’s hours, a team page, a piece of work worth showing.',
      fit:'You have somewhere obvious the information should go, and you already have the words.' },

    { id:'svc.page.service', name:'Dedicated Service Page', group:'pages', kind:'one-time',
      price:450, from:true, qty:true, unit:'page',
      what:'A page built around one service, researched, written and linked into the rest of the site.',
      does:'Lets one service be found and compared on its own terms instead of being a line on a list.',
      fit:'You sell something distinct enough that people search for it by name, and it is currently buried inside a general services page.' },

    { id:'svc.page.location', name:'Location Page', group:'pages', kind:'one-time',
      price:550, from:true, qty:true, unit:'page',
      what:'A dedicated page for a legitimate additional market you actually serve.',
      does:'Gives search engines and buyers one clear page about that area and the services you genuinely provide there.',
      fit:'You serve a real additional market and have enough that is specifically true about it to fill a page nobody would call thin.' },

    { id:'svc.page.landing', name:'Conversion Landing Page', group:'pages', kind:'one-time',
      price:850, from:true, qty:true, unit:'page',
      what:'A single page built around one campaign, offer, service or audience, with the structure and measurement that implies.',
      does:'Gives a campaign somewhere to land that is about the campaign, rather than sending paid traffic to a homepage that has to serve everyone.',
      fit:'You are running or about to run something specific: an ad campaign, a seasonal offer, one high-value service.' },

    /* ================= SEARCH / VISIBILITY ============================== */
    { id:'svc.search.gbp', name:'Google Business Profile Optimization', group:'search', kind:'one-time',
      price:450, from:true,
      what:'A one-time audit and correction of the profile: categories, services, description, service area, hours and the details that are quietly wrong.',
      does:'The profile is what most local buyers see before the website, and often instead of it. Getting it accurate is usually the highest-return hour anyone spends on local search.',
      fit:'Your profile was set up quickly, inherited, or never finished, and you want it correct without committing to a monthly programme.' },

    /* ⚠ CREDIT IS ARITHMETIC, owner decision 2026-09-01: a full $750 against
       AEO Foundation. The engine charges both lines and subtracts a real
       credit line, rather than quietly zeroing the audit — the buyer sees the
       $750 they paid being taken off. */
    { id:'pkg.aeo.audit', name:'AEO Audit', group:'search', kind:'one-time',
      price:750, creditsToward:{ id:'pkg.aeo.foundation', amount:750 },
      what:'What search engines and AI assistants currently say about the business, where that is inconsistent, and what to fix first.',
      does:'Answers whether this is a real problem for you before you spend anything fixing it.',
      fit:'You are unsure whether you are being described correctly and want to know before committing.' },

    { id:'pkg.aeo.foundation', name:'AEO Foundation', group:'search', kind:'one-time',
      price:1250, high:1750,
      what:'The audit implemented: answer-first structure on the pages that need it, consistency across the sources that describe you, and a re-check afterward.',
      does:'Makes a direct question about your business get a direct, correct answer.',
      fit:'Your audit found real inconsistency and the website itself is otherwise sound.' },

    /* ================= TRACKING / PRODUCTION ============================ */
    { id:'svc.track.analytics', name:'Analytics & Conversion Tracking', group:'production', kind:'one-time',
      price:400, from:true,
      what:'Analytics and meaningful conversion events configured on a site that already exists, so the things that count as a lead are recorded as one.',
      does:'Turns “we get some traffic” into a number you can act on: how many people got in touch, and which pages did the work.',
      fit:'You have a site and no reliable idea how many inquiries it produces.' },

    { id:'svc.prod.photo', name:'Photography Coordination', group:'production', kind:'one-time',
      price:350, from:true, plusThirdParty:true,
      what:'Planning and running the photography around a project: the brief, the shot list, finding and coordinating the photographer, scheduling, and organizing what comes back.',
      does:'Real pictures of your own work change a site more than any other single input, and coordination is what stops the site waiting six weeks for photos nobody organized.',
      fit:'Your current images are stock, out of date, or taken on a phone in bad light.' },

    /* ⚠ PER-UNIT. The only offer priced per page rather than per engagement.
       The $1,200 project minimum is INTERNAL (OFFER-MAP §1) and is applied by
       the engine without ever being displayed as a line item. 🚫 Do not surface
       it as "minimum 5 pages" — it is a floor on the engagement, not a
       quantity the buyer is being told to reach. */
    { id:'svc.copy.full', name:'Full Copy & Content Writing', group:'production', kind:'one-time',
      price:275, from:true, qty:true, unit:'page', minimum:1200,
      what:'Original page content researched and written from limited source material, rather than edited from something you already have.',
      does:'Gives pages that would otherwise stay empty, or stay wrong, something worth reading.',
      fit:'You know what the business does but have never written it down, and the pages cannot be assembled from documents you already own.',
      note:'Every website engagement already includes copy support at no extra cost: tightening your wording, restructuring a page, editing. This is only for original writing from scratch.' },

    /* ================= BRAND — one tier at a time ======================= */
    { id:'pkg.brand.refresh', name:'Brand Refresh', group:'brand', kind:'one-time',
      price:750, from:true, exclusive:'brand-tier',
      what:'The existing mark cleaned up or redrawn, type and color settled, and a short usage guide.',
      does:'Keeps the recognition you already have and stops the brand looking older than the work.',
      fit:'You are already known locally under your current mark and starting over would spend that rather than build on it.' },

    { id:'pkg.brand.identity', name:'Brand Identity', group:'brand', kind:'one-time',
      price:1500, from:true, exclusive:'brand-tier',
      what:'A logo system, a typography system, a color system, a messaging foundation and the essential assets.',
      does:'Gives every surface one set of decisions to be built from, so a sign, a truck, an invoice and a screen agree.',
      fit:'You have outgrown your mark, or never really had one.' },

    { id:'pkg.brand.full', name:'Full Identity System', group:'brand', kind:'one-time',
      price:2500, from:true, exclusive:'brand-tier',
      what:'Everything in Brand Identity, plus research and positioning, an extended system, and fuller guidance.',
      does:'Buys the research that stops the identity being a matter of taste.',
      fit:'You have several services or audiences, or you are hiring people who will need to represent the business.' },

    /* ⚠ NOT SELECTABLE. Brand + Website is a RECOMMENDATION ONLY — it is what
       the matcher offers when a brand tier and a website tier are both chosen.
       OFFER-MAP: "For matching purposes it is two selections, not one."
       🚫 The matcher must never compute a saving for it. Reference §56:
       bundling improves strategic consistency, it is not a discount. */
    { id:'pkg.combined.brandweb', name:'Brand + Website', group:'combined', kind:'one-time',
      price:3950, high:5950, plus:true, recommendOnly:true, noSaving:true,
      what:'A brand engagement and a website engagement, scoped and run as one project.',
      does:'Settles the identity before the pages are designed around it, which is the order that avoids building the site twice.',
      fit:'You are changing what the business looks like and what it says at the same time.' },

    /* ================= RECURRING — one rung at a time =================== */
    { id:'pkg.local.presence', name:'Local Presence', group:'local', kind:'monthly',
      price:500, exclusive:'local-tier', rung:1,
      what:'Profile management, reviews, citations, monitoring and monthly reporting.',
      does:'Keeps the local foundation accurate and healthy so nothing decays quietly.',
      fit:'You are already visible and want that maintained rather than pushed.' },

    { id:'pkg.local.growth', name:'Local Growth', group:'local', kind:'monthly',
      price:900, exclusive:'local-tier', rung:2, term:'Three-month initial commitment, month-to-month after.',
      covers:{ 'svc.search.gbp':{ level:'ongoing', note:'ongoing profile management' } },
      what:'Continuous local search work: profile management, content and citations, reporting tied to calls and forms.',
      does:'Defends and grows visibility in a market where competitors are working on the same thing.',
      fit:'Your foundations are built and the work now needs tending continuously.' },

    { id:'pkg.local.expansion', name:'Market Expansion', group:'local', kind:'monthly',
      price:1500, from:true, exclusive:'local-tier', rung:3,
      covers:{ 'svc.search.gbp':{ level:'ongoing', note:'ongoing profile management' } },
      what:'Everything in Local Growth, plus a broader content programme, multi-market strategy, authority work and deeper attribution.',
      does:'Pushes visibility across more services and more markets rather than holding one.',
      fit:'You compete across several services or cities and organic visibility is a growth channel, not hygiene.' },

    /* ================= SITE SUPPORT — one at a time ===================== */
    { id:'pkg.care.base', name:'Site Care', group:'care', kind:'monthly',
      price:149, exclusive:'care-tier', rung:1,
      what:'Hosting, SSL, uptime monitoring, backups and minor content edits.',
      does:'Means nobody has to own the maintenance, and a site that goes down is noticed before a customer notices.',
      fit:'You would rather not own the upkeep. Optional on every engagement; the site is yours either way.' },

    { id:'pkg.care.plus', name:'Site Care+', group:'care', kind:'monthly',
      price:279, exclusive:'care-tier', rung:2,
      what:'Everything in Site Care, plus a larger edit allowance, priority turnaround and ongoing improvements.',
      does:'Keeps up with a site whose content genuinely moves.',
      fit:'You run promotions, add services, or change pricing and availability regularly.' }
  ];

  /* ---- how the builder groups them ------------------------------------- */
  var GROUPS = [
    { id:'website',    label:'Start with a website',  hint:'Pick one. These are complete engagements, not add-ons.' },
    { id:'pages',      label:'Individual pages',      hint:'Buy these on their own, or on top of a website engagement.' },
    { id:'search',     label:'Search and visibility', hint:'One-time work on how you are found and described.' },
    { id:'production', label:'Content and tracking',  hint:'The inputs a site needs to be worth visiting and worth measuring.' },
    { id:'brand',      label:'Brand',                 hint:'Pick one tier. Priced separately from the website on purpose.' },
    { id:'local',      label:'Ongoing search',        hint:'Pick one rung. Monthly, not part of a project total.' },
    { id:'care',       label:'Ongoing support',       hint:'Pick one. Optional on every engagement.' }
  ];

  /* ---- exclusivity groups ----------------------------------------------
     Selecting one member deselects the others. Every one of these is
     documented: OFFER-MAP §1 lists the recurring ladder and the brand tiers,
     and /pricing/ presents the four website engagements as alternatives.
     🚫 Do not add an exclusivity rule that is not in the docs. */
  var EXCLUSIVE = {
    'website-base':'website engagement',
    'brand-tier'  :'brand tier',
    'local-tier'  :'ongoing search programme',
    'care-tier'   :'support plan'
  };

  /* ---- categories the future audit will speak in ------------------------
     recommend.js maps audit findings to offers through this. The audit
     produces { website:'critical', brand:'alreadyStrong', ... } and never
     needs to know a price or an offer id. */
  var NEED_CATEGORIES = {
    website:  ['pkg.web.onepage','pkg.web.launch','pkg.web.growth','pkg.web.leader'],
    pages:    ['svc.page.standard','svc.page.service','svc.page.location','svc.page.landing'],
    localSeo: ['svc.search.gbp','pkg.local.presence','pkg.local.growth','pkg.local.expansion'],
    aeo:      ['pkg.aeo.audit','pkg.aeo.foundation'],
    brand:    ['pkg.brand.refresh','pkg.brand.identity','pkg.brand.full'],
    content:  ['svc.copy.full','svc.prod.photo'],
    tracking: ['svc.track.analytics'],
    care:     ['pkg.care.base','pkg.care.plus']
  };

  var byId = {};
  OFFERS.forEach(function (o) { byId[o.id] = o; });

  return {
    offers: OFFERS,
    groups: GROUPS,
    exclusive: EXCLUSIVE,
    needCategories: NEED_CATEGORIES,
    get: function (id) { return byId[id] || null; },
    inGroup: function (g) { return OFFERS.filter(function (o) { return o.group === g && !o.recommendOnly; }); }
  };
}));
