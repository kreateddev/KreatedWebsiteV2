/* ==========================================================================
   KREATED — SIGNAL EXTRACTION
   Turns fetched HTML into facts. Every field here is something the page
   genuinely contains, because every finding the audit renders has to cite one.

   🚫 NOTHING IN THIS FILE INFERS. If a signal cannot be observed it is null,
   and a null signal produces "could not be confirmed" rather than a finding.
   The audit sees public HTML and nothing else: no analytics, no Search
   Console, no CRM, no rankings. 🚫 Never add a signal that implies otherwise.

   Regex rather than a DOM parser because the function has no dependencies and
   must not gain any. This is lossy on malformed markup, which is why every
   consumer treats a missing signal as unknown rather than as absent.
   ========================================================================== */
'use strict';

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}
function text(html) {
  return strip(html).replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, ' ').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function all(rx, s) { const out = []; let m; while ((m = rx.exec(s))) out.push(m); return out; }

const NAV_WORTH_FOLLOWING = /(service|solution|what-we|our-work|pricing|price|contact|about|location|areas?-we-serve|city|cities)/i;

function extract(html, baseUrl) {
  const clean = strip(html);
  const body  = text(html);
  const base  = new URL(baseUrl);

  const titleM = clean.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title  = titleM ? text(titleM[1]) : null;

  const descM = clean.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
             || clean.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const description = descM ? descM[1].trim() : null;

  const h1s = all(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, clean).map(m => text(m[1])).filter(Boolean);
  const h2s = all(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, clean).map(m => text(m[1])).filter(Boolean);
  const h3s = all(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, clean).map(m => text(m[1])).filter(Boolean);

  /* links, split into internal and external, deduped, with their labels */
  const links = [];
  for (const m of all(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, clean)) {
    const href = m[1].trim(); const label = text(m[2]);
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) {
      links.push({ href, label, kind: href.split(':')[0].toLowerCase() });
      continue;
    }
    let abs; try { abs = new URL(href, base); } catch (e) { continue; }
    if (abs.protocol !== 'http:' && abs.protocol !== 'https:') continue;
    links.push({ href: abs.href, label, kind: abs.hostname === base.hostname ? 'internal' : 'external' });
  }
  const internal = links.filter(l => l.kind === 'internal');
  const internalPaths = [...new Set(internal.map(l => new URL(l.href).pathname.replace(/\/$/, '') || '/'))];

  /* structured data actually present, and its @type values */
  const ld = all(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi, html)
    .map(m => { try { return JSON.parse(m[1].trim()); } catch (e) { return null; } })
    .filter(Boolean);
  const ldTypes = [];
  (function walk(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n['@type']) [].concat(n['@type']).forEach(t => ldTypes.push(String(t)));
    Object.values(n).forEach(walk);
  })(ld);

  /* contact affordances */
  const tel   = links.filter(l => l.kind === 'tel').map(l => l.href.replace(/^tel:/i, ''));
  const email = links.filter(l => l.kind === 'mailto').map(l => l.href.replace(/^mailto:/i, ''));
  const forms = all(/<form\b[^>]*>/gi, clean).length;

  /* call-to-action labels, from links and buttons that look like actions */
  const ACTION = /(contact|call|quote|estimate|book|schedule|get in touch|request|start|enquir|inquir|free)/i;
  /* ⚠ an icon's own label is not a call to action: a Font Awesome social icon
     reports as "Facebook-f", which was quoted back to a builder as one of the
     three CTAs found on their homepage. */
  const ICON_LABEL = /^(facebook|twitter|instagram|linkedin|youtube|tiktok|pinterest|yelp|google)[-\s]?[a-z]?$/i;
  const ctas = [...new Set(
    links.filter(l => l.label && ACTION.test(l.label) && !ICON_LABEL.test(l.label.trim()) && l.label.length < 40).map(l => l.label)
      .concat(all(/<button[^>]*>([\s\S]*?)<\/button>/gi, clean).map(m => text(m[1])).filter(t => t && ACTION.test(t) && t.length < 40))
  )];

  /* mobile: a real viewport meta is the one mobile signal HTML can prove */
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(clean);

  /* ⚠ analytics detection is PRESENCE ONLY. A tag in the source proves a tag
     is loaded. It proves nothing about whether conversion events are
     configured, which is invisible from outside. 🚫 Do not let a consumer of
     this field claim otherwise. */
  const rawTags = {
    /* ⚠ WIDENED 2026-09-20. The old pattern only matched the script-tag form,
       `gtag/js?id=G-`. A site that loads GA4 inline — `gtag('config','G-…')`,
       which is what Site Kit and most page builders emit — was reported as
       having NO analytics, and the audit then sold $400 of tracking work to a
       business that already had it. Measured on delaneyscoastalconstruction.com
       (G-2T1J8SDE0K, present and invisible to the old rule). */
    ga4: /gtag\/js\?id=G-|googletagmanager\.com\/gtag|gtag\s*\(\s*['"]config['"]\s*,\s*['"]G-|['"]G-[A-Z0-9]{8,12}['"]/i.test(html),
    ua: /google-analytics\.com\/(?:analytics|ga)\.js|['"]UA-\d{4,}-\d+['"]/i.test(html),
    gtm: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{6,}/i.test(html),
    meta: /connect\.facebook\.net\/[^"']*\/fbevents\.js/i.test(html),
    clarity: /clarity\.ms\/tag/i.test(html)
  };

  /* ⚠ THE PLATFORM, because on some of them absence proves nothing. Wix,
     Squarespace, GoDaddy, Weebly and Duda attach analytics through their own
     dashboard and inject it at runtime, so it is NOT in the HTML this audit
     reads. On those platforms the measurement finding must say "cannot be seen
     from outside" and must never be priced. 🚫 Do not report "nothing is
     counting" for a platform in HIDES_ANALYTICS. */
  const platform = (PLATFORMS.find(function (p) { return p[1].test(html); }) || [null])[0];

  /* how old the page says it is: the last year in its own copyright line */
  const years = all(/(?:©|&copy;|copyright)[^0-9]{0,12}((?:19|20)\d{2})(?:\s*[-–—]\s*((?:19|20)\d{2}))?/gi, clean)
    .map(function (m) { return Number(m[2] || m[1]); });
  const copyrightYear = years.length ? Math.max.apply(null, years) : null;

  /* the candidate pages worth following, capped hard */
  const followable = internal
    .filter(l => NAV_WORTH_FOLLOWING.test(new URL(l.href).pathname) || NAV_WORTH_FOLLOWING.test(l.label || ''))
    .map(l => l.href);

  return {
    url: baseUrl,
    host: base.hostname,
    title, titleLength: title ? title.length : 0,
    description, descriptionLength: description ? description.length : 0,
    h1s, h1Count: h1s.length,
    h2s: h2s.slice(0, 25), h3Count: h3s.length,
    cityMentions: cityMentions(title, body),
    wordCount: body.split(/\s+/).filter(Boolean).length,
    bodySample: body.slice(0, 4000),
    internalPaths: internalPaths.slice(0, 60),
    internalCount: internal.length,
    externalCount: links.filter(l => l.kind === 'external').length,
    ldTypes: [...new Set(ldTypes)],
    /* ⚠ SPLIT 2026-09-20. Organization used to count as LocalBusiness, so a
       site carrying nothing but Yoast's default Organization block was told
       "LocalBusiness structured data is present". It is the kind of evidence a
       buyer checks, and it was wrong. 🚫 Do not merge these two again. */
    hasLocalBusinessSchema: ldTypes.some(t => /LocalBusiness|ProfessionalService|HomeAndConstructionBusiness|(?:Roofing|General|HVAC|Plumb|Electric|Landscap|Moving|Painting)[A-Za-z]*(?:Contractor|Business)|Plumber|Electrician|Locksmith|Dentist|Attorney/i.test(t)),
    hasOrganizationSchema: ldTypes.some(t => /^Organization$|Corporation|LocalCorporation/i.test(t)),
    platform, copyrightYear,
    analyticsMayBeHidden: HIDES_ANALYTICS.indexOf(platform) !== -1,
    isBuilder: BUILDERS.indexOf(platform) !== -1,
    tel, email, forms,
    ctas: ctas.slice(0, 12),
    viewport, rawTags,
    followable: [...new Set(followable)].slice(0, 6)
  };
}

/* the builders whose own analytics never appears in the HTML */
const PLATFORMS = [
  ['Wix', /static\.wixstatic\.com|wixsite\.com|wix\.com\/website-builder|X-Wix-/i],
  ['Squarespace', /static1\.squarespace\.com|squarespace\.com\/(?:universal|static)/i],
  ['GoDaddy', /img1\.wsimg\.com|godaddy\.com\/websites|Go Daddy Website Builder/i],
  ['Weebly', /weebly\.com\/uploads|editmysite\.com/i],
  ['Duda', /dudamobile\.com|dudaone|irp-cdn\.multiscreensite\.com/i],
  ['Shopify', /cdn\.shopify\.com/i],
  ['WordPress', /\/wp-content\/|\/wp-includes\//i]
];
const HIDES_ANALYTICS = ['Wix', 'Squarespace', 'GoDaddy', 'Weebly', 'Duda'];
const BUILDERS = ['Wix', 'Squarespace', 'GoDaddy', 'Weebly', 'Duda'];

/* ⚠ WHAT A SERVICE PAGE LOOKS LIKE, REWRITTEN 2026-09-20. The old rule was
   /(service|repair|install|cleaning|detection|restoration|design|consult)/ and
   it failed in both directions on real contractor sites:
     · it MISSED /kitchen-remodeling, /bathroom-remodeling, /residential-roofing,
       /siding, /gutters, /porches-and-decks — so a remodeler with four service
       pages was told it had none, and got a false "critical".
     · it COUNTED /service-area/wilmington-nc (a location page) and
       /patriot-roofing-…-habitat-for-humanity (a blog post) as service pages.
   The vocabulary is the work itself; the exclusions are the page types that
   are never a service; and a long slug is prose, not a service name.
   🚫 Do not add the bare word "service" back to the vocabulary. */
const SERVICE_WORD = new RegExp('(' + [
  'service','repair','install','replacement','cleaning','detection','restoration',
  'remodel','renovat','addition','new-construction','custom-home','build',
  'kitchen','bath','roof','siding','gutter','window','door','deck','patio','porch',
  'fence','concrete','paving','driveway','masonry','drywall','flooring','insulation',
  'hvac','heating','cooling','air-condition','furnace','heat-pump','duct',
  'plumb','drain','water-heater','sewer','septic','electric','generator','lighting',
  'painting','landscap','hardscap','lawn','tree','pest','excavat','chimney','garage',
  'pool','spa','solar','waterproof','crawlspace','pressure-wash','power-wash',
  'residential','commercial'
].join('|') + ')', 'i');
const NOT_A_SERVICE_PAGE = new RegExp([
  '\\/blog','\\/news','\\/article','\\/post','\\/category','\\/tag\\/','\\/author',
  'service-area','areas?-we-serve','\\/locations?(?:\\/|$)','near-me',
  '\\/about','\\/contact','\\/gallery','\\/portfolio','\\/project','\\/career','\\/job',
  '\\/team','\\/review','\\/testimonial','\\/faq','\\/privacy','\\/terms','\\/financing',
  '\\/coupon','\\/special','\\/cart','\\/account','\\/search','\\/sitemap','\\/quote','\\/estimate'
].join('|'), 'i');
/* a service page is named, not narrated: "kitchen-remodeling" not a sentence */
function slugWords(path) {
  const last = String(path).replace(/\/+$/, '').split('/').pop() || '';
  return last ? last.split('-').filter(Boolean).length : 0;
}
function isServicePath(p) {
  return SERVICE_WORD.test(p) && !NOT_A_SERVICE_PAGE.test(p) && slugWords(p) <= 5;
}

/* the services a site SAYS it does, so the plan can size "pages you are missing"
   instead of always recommending exactly one. Read from the title, headings and
   nav labels only — body prose names other people's work. */
const SERVICE_NAMES = [
  ['kitchen', /\bkitchens?\b|kitchen remodel/i], ['bathroom', /\bbath(?:room)?s?\b/i],
  ['whole-home remodeling', /whole[- ]home|home remodel|renovations?\b/i],
  ['additions', /\badditions?\b/i], ['new construction', /new construction|custom homes?|new builds?/i],
  ['roof replacement', /roof replacement|re-?roof|new roofs?/i], ['roof repair', /roof repairs?|leak repair/i],
  ['siding', /\bsiding\b/i], ['gutters', /\bgutters?\b/i], ['windows', /\bwindows?\b/i],
  ['doors', /\bdoors?\b/i], ['decks', /\bdecks?\b|\bporch(?:es)?\b/i], ['concrete', /\bconcrete\b|\bdriveways?\b/i],
  ['fencing', /\bfenc(?:e|es|ing)\b/i], ['flooring', /\bfloor(?:s|ing)?\b/i],
  ['heating', /\bheating\b|\bfurnaces?\b|heat pumps?/i], ['cooling', /air conditioning|\bac\b|\bcooling\b/i],
  ['plumbing', /\bplumbing\b|water heaters?|drain/i], ['electrical', /\belectrical\b|generators?/i],
  ['commercial work', /\bcommercial\b/i]
];

/* ⚠ EVERY city named, with a count — not just the first match. The local check
   used to take a single `place` match as proof the market was stated and stop
   there, which is how a site can name one city, build pages for a DIFFERENT
   one, and still be told its local signals are clear. Counting mentions is what
   lets the check compare markets CLAIMED against markets COVERED.
   🚫 Do not reduce this back to a boolean. */
const CITY_RX = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),?\s*(?:NC|SC|VA|GA|NY|CA|TX|FL|North Carolina|South Carolina)\b/g;
const NOT_A_CITY = /^(the|this|our|your|all|new|best|top|free|home|service|services|and|for|in|of|we|us)$/i;
/* a word that can sit in front of the real town name */
const CITY_PREFIX_JUNK = /^(area|areas|region|regions|county|counties|surrounding|throughout|across|downtown|serves|serve|roofers?|roofing|plumbers?|plumbing|hvac|electricians?|electrical|contractors?|contracting|remodeling|renovations?|construction|builders?|services?|serving|trusted|best|top|premier|local|greater|near|about|call|welcome|new|custom|coastal|southeastern|northeastern|southwestern|northwestern|eastern|western|northern|southern|central)$/i;
/* a region or a direction is not a market */
const NOT_A_CITY_AT_ALL = /^(southeastern|northeastern|southwestern|northwestern|eastern|western|northern|southern|central|coastal|greater|triangle|piedmont|midlands|upstate|lowcountry|america|carolina|carolinas)$/i;

function cityMentions(title, body) {
  const hay = (title || '') + ' ' + (body || '');
  const seen = {};
  let m;
  CITY_RX.lastIndex = 0;
  while ((m = CITY_RX.exec(hay))) {
    /* ⚠ "Roofers Wilmington NC" and "Southeastern NC" are not towns. The
       capture allows two words so that Wake Forest survives, which also lets a
       trade word or a direction ride in front of the real name. Strip a junk
       first word, then reject anything that is only a region or an adjective.
       Measured on floresandfoley.com, which was credited with 5 markets when it
       names one: Wilmington. 🚫 Do not widen the capture again without this. */
    let city = m[1].trim();
    const parts = city.split(/\s+/);
    if (parts.length === 2 && CITY_PREFIX_JUNK.test(parts[0])) city = parts[1];
    /* ⚠ the junk list applies to a ONE-WORD capture too: "Serving NC" yielded
       the town "Serving", which was printed back to a business as the place
       its own site names. */
    if (NOT_A_CITY.test(city) || NOT_A_CITY_AT_ALL.test(city) || CITY_PREFIX_JUNK.test(city)) continue;
    seen[city] = true;
  }
  /* count every bare mention too — "Raleigh" on its own is how a business
     actually writes about the market it serves */
  const out = {};
  Object.keys(seen).forEach(function (c) {
    const esc = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out[c] = (hay.match(new RegExp('\\b' + esc + '\\b', 'gi')) || []).length;
  });
  return out;
}

/* ⚠ Test each MENTIONED city against the paths, rather than trying to parse a
   city out of a slug. `/kitchen-remodeling-cary-nc` cannot be split reliably —
   a naive parse yields "remodeling cary" — but asking "does any location path
   contain `cary`?" is unambiguous and handles two-word cities like Wake Forest.
   🚫 Do not go back to extracting the city from the path. */
function citiesCovered(cities, locationPages) {
  const cov = {};
  Object.keys(cities).forEach(function (c) {
    const slug = c.toLowerCase().replace(/\s+/g, '-');
    cov[c] = locationPages.some(function (p) {
      return p.toLowerCase().indexOf(slug) !== -1;
    });
  });
  return cov;
}

/* ⚠ Distinct markets, not distinct pages. Counts the unique "-<city>-<state>"
   tails across the location paths. `/kitchen-remodeling-cary-nc` and
   `/deck-builder-cary-nc` are ONE market. 🚫 Do not count locationPages.length
   as market coverage — that is the bug this exists to prevent. */
function marketCount(locationPages) {
  const seen = {};
  locationPages.forEach(function (p) {
    const path = p.replace(/\/+$/, '');
    /* ⚠ ANCHORED to the end of the path and ONE token wide. Unanchored it
       matches greedily and "/kitchen-remodeling-cary-nc" groups as
       "remodeling-cary" — every service becomes its own market and the count
       is meaningless. A two-word city like Wake Forest groups as "forest-nc",
       which is imperfect as a NAME but correct as a GROUPING key, and grouping
       is all this is for. */
    const m = path.match(/-([a-z]+)-(nc|sc|ny|ca|tx|fl|va|ga)$/i);
    if (m) seen[(m[1] + '-' + m[2]).toLowerCase()] = true;
    else if (/(location|areas?-we-serve|service-area)/i.test(path)) seen[path.toLowerCase()] = true;
  });
  return Object.keys(seen);
}

/* what a page looks like once we know the whole set */
function summarise(pages) {
  const home = pages[0];
  const paths = [...new Set(pages.flatMap(p => p.internalPaths))];
  const locationPages = paths.filter(p => /(location|areas?-we-serve|service-area|near-me|\/[a-z-]+-(nc|sc|ny|ca|tx|fl)\b)/i.test(p));
  const servicePages  = paths.filter(p => isServicePath(p) && locationPages.indexOf(p) === -1);
  /* what the site says it does, from its own title, headings and nav labels */
  const said = pages.map(function (p) {
    return [p.title || ''].concat(p.h1s || [], p.h2s || [], p.ctas || []).join(' · ');
  }).join(' · ');
  const servicesNamed = SERVICE_NAMES.filter(function (sv) { return sv[1].test(said); }).map(function (sv) { return sv[0]; });
  const cityMentionsAll = {};
  pages.forEach(function (pg) {
    const cm = pg.cityMentions || {};
    Object.keys(cm).forEach(function (c) {
      cityMentionsAll[c] = Math.max(cityMentionsAll[c] || 0, cm[c]);
    });
  });

  return {
    home,
    pagesFetched: pages.length,
    pathsSeen: paths.length,
    servicePages, locationPages,
    cityMentions: cityMentionsAll,
    cityCoverage: citiesCovered(cityMentionsAll, locationPages),
    /* ⚠ How many DISTINCT markets the location pages actually target. Six pages
       that all end -cary-nc are one market, not six. This is the number that
       tells you whether local coverage is broad or concentrated, and it is
       derived from the paths rather than from any city list, so it works
       anywhere. */
    marketsCovered: marketCount(locationPages),
    anyTel: pages.some(p => p.tel.length),
    anyForm: pages.some(p => p.forms > 0),
    anySchema: pages.some(p => p.ldTypes.length),
    anyLocalSchema: pages.some(p => p.hasLocalBusinessSchema),
    anyOrgSchema: pages.some(p => p.hasOrganizationSchema),
    platform: home.platform || null,
    isBuilder: !!home.isBuilder,
    analyticsMayBeHidden: !!home.analyticsMayBeHidden,
    copyrightYear: home.copyrightYear || null,
    servicesNamed,
    /* services the site names that have no page of their own — the number the
       plan sizes "service pages" from, instead of always recommending one */
    servicePagesMissing: Math.max(0, Math.min(6, servicesNamed.length - servicePages.length)),
    /* ⚠ the title is the evidence for "generic", so the two things that stop a
       title being generic are measured here rather than guessed in classify */
    titleNamesTrade: isTrade(home).trade,
    titleNamesPlace: /\b(?:NC|SC|VA|GA|FL|North Carolina|South Carolina)\b/i.test(home.title || '') ||
                     Object.keys(home.cityMentions || {}).some(function (c) {
                       return new RegExp('\\b' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(home.title || '');
                     })
  };
}

/* ---- is this a trades business? ------------------------------------------
   Used for ONE thing: whether the audit mentions Contractor Growth beside the
   plan (recommend.js `program`). It never changes a finding or a price.

   ⚠ TITLE AND H1 ONLY, never the body. A business names its own trade where it
   introduces itself ("Residential Contractor in Cary", "Pool Leak Detection
   Wilmington NC"). Body text is full of other people's trades: kreated.dev's
   own homepage lists a remodeling client and a pool leak detection client, and
   a body rule flagged the agency as a contractor.
   ⚠ "for <trade>" does not count. "Websites & Local SEO for Contractors" is an
   agency describing its customers, not a contractor describing itself.
   A false negative costs one optional sentence; a false positive pitches a
   trades programme to a dentist. Err toward negative.
   🚫 Do not add generic words (repair, window, painting on its own, service). */
const TRADE = /\b(contractors?|roofing|roofers?|plumbing|plumbers?|hvac|heating|air conditioning|electricians?|electrical|remodel(?:ing|ers?)?|renovations?|landscap(?:ing|ers?)|lawn care|hardscap(?:ing|es?)|pressure washing|power washing|house painting|painting contractors?|pool (?:service|repair|leak)|leak detection|concrete|paving|fenc(?:e|ing)|gutters?|siding|handyman|pest control|water damage|restoration|garage doors?|flooring|decks?|septic|excavation|masonry|drywall|insulation|tree service|junk removal|chimney|construction|home improvement|builders?)\b/gi;

function isTrade(home) {
  if (!home) return { trade: false, term: null };
  const places = [home.title || ''].concat(home.h1s || []);
  for (const t of places) {
    TRADE.lastIndex = 0;
    let m;
    while ((m = TRADE.exec(t))) {
      const before = t.slice(Math.max(0, m.index - 8), m.index).toLowerCase();
      if (/\bfor\s+(?:the\s+)?$/.test(before)) continue;   /* "for contractors" */
      return { trade: true, term: m[1].toLowerCase() };
    }
  }
  return { trade: false, term: null };
}

module.exports = { extract, summarise, text, isTrade };
