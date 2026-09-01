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
  const ctas = [...new Set(
    links.filter(l => l.label && ACTION.test(l.label) && l.label.length < 40).map(l => l.label)
      .concat(all(/<button[^>]*>([\s\S]*?)<\/button>/gi, clean).map(m => text(m[1])).filter(t => t && ACTION.test(t) && t.length < 40))
  )];

  /* mobile: a real viewport meta is the one mobile signal HTML can prove */
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(clean);

  /* ⚠ analytics detection is PRESENCE ONLY. A tag in the source proves a tag
     is loaded. It proves nothing about whether conversion events are
     configured, which is invisible from outside. 🚫 Do not let a consumer of
     this field claim otherwise. */
  const rawTags = {
    ga4: /gtag\/js\?id=G-|googletagmanager\.com\/gtag/i.test(html),
    gtm: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{6,}/i.test(html),
    meta: /connect\.facebook\.net\/[^"']*\/fbevents\.js/i.test(html),
    clarity: /clarity\.ms\/tag/i.test(html)
  };

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
    wordCount: body.split(/\s+/).filter(Boolean).length,
    bodySample: body.slice(0, 4000),
    internalPaths: internalPaths.slice(0, 60),
    internalCount: internal.length,
    externalCount: links.filter(l => l.kind === 'external').length,
    ldTypes: [...new Set(ldTypes)],
    hasLocalBusinessSchema: ldTypes.some(t => /LocalBusiness|Organization|ProfessionalService|HomeAndConstructionBusiness/i.test(t)),
    tel, email, forms,
    ctas: ctas.slice(0, 12),
    viewport, rawTags,
    followable: [...new Set(followable)].slice(0, 6)
  };
}

/* what a page looks like once we know the whole set */
function summarise(pages) {
  const home = pages[0];
  const paths = [...new Set(pages.flatMap(p => p.internalPaths))];
  const servicePages  = paths.filter(p => /(service|repair|install|cleaning|detection|restoration|design|consult)/i.test(p));
  const locationPages = paths.filter(p => /(location|areas?-we-serve|service-area|near-me|\/[a-z-]+-(nc|sc|ny|ca|tx|fl)\b)/i.test(p));
  return {
    home,
    pagesFetched: pages.length,
    pathsSeen: paths.length,
    servicePages, locationPages,
    anyTel: pages.some(p => p.tel.length),
    anyForm: pages.some(p => p.forms > 0),
    anySchema: pages.some(p => p.ldTypes.length),
    anyLocalSchema: pages.some(p => p.hasLocalBusinessSchema)
  };
}

module.exports = { extract, summarise, text };
