/* ==========================================================================
   KREATED — WHICH PAGES THE AUDIT READS
   Hard maximum THREE HTML pages. The homepage is always first; the other two
   are chosen by score, never by document order.

   🚫 Do not "just take the first two links". A site's first two links are
   usually a logo and a privacy notice, and an audit that read those would
   describe a business it had not looked at.

   ⚠ DETERMINISTIC AND EXPLAINABLE. Same links in, same pages out, and every
   choice carries the reason it was made so the result can say why it read
   what it read. Ties break on path depth then alphabetically, so two equally
   scored candidates never depend on link order.
   ========================================================================== */
'use strict';

const MAX_PAGES = 3;

/* what a page is worth to an audit of a service business, highest first */
const VALUE = [
  { rx: /\/(services?|what-we-do|solutions?)\/[^/]+/i, score: 100, why: 'a specific service page' },
  { rx: /\/(services?|what-we-do|solutions?)\/?$/i,    score:  90, why: 'the services hub' },
  { rx: /\/(pricing|prices|rates|cost)\/?$/i,          score:  80, why: 'the pricing page' },
  { rx: /\/(locations?|areas?-we-serve|service-areas?)\//i, score: 75, why: 'a location page' },
  { rx: /\/(locations?|areas?-we-serve|service-areas?)\/?$/i, score: 70, why: 'the service-area page' },
  { rx: /\/(about|our-story|who-we-are|team)\/?$/i,    score:  60, why: 'the about page' },
  { rx: /\/(contact|get-in-touch|quote|estimate)\/?$/i, score: 50, why: 'the contact page' },
  { rx: /\/(work|portfolio|projects|case-stud)/i,      score:  40, why: 'work or case studies' }
];

/* 🚫 never worth an audit slot unless nothing else exists at all */
const LOW_VALUE = /\/(privacy|terms|legal|cookie|disclaimer|accessibility|sitemap|login|log-in|signin|sign-in|account|cart|basket|checkout|thank|thanks|search|feed|rss|tag|tags|category|categories|author|archives?|page\/\d+|\d{4}\/\d{2})/i;

/* a blog POST is low value; a blog INDEX is merely uninteresting */
const BLOG_POST = /\/(blog|news|articles?|posts?)\/[^/]+/i;

function scoreOf(u) {
  let pathname;
  try { pathname = new URL(u).pathname.replace(/\/+$/, '') || '/'; }
  catch (e) { return null; }
  if (pathname === '/') return null;                       /* homepage is separate */

  if (LOW_VALUE.test(pathname)) return { score: -100, why: 'a utility page', pathname };
  if (BLOG_POST.test(pathname)) return { score: -50,  why: 'a blog post', pathname };

  for (const v of VALUE) {
    if (v.rx.test(pathname)) return { score: v.score, why: v.why, pathname };
  }
  /* an ordinary interior page: better than a utility page, worse than a
     service page, and preferred shallow */
  const depth = pathname.split('/').filter(Boolean).length;
  return { score: Math.max(5, 30 - depth * 8), why: 'an interior page', pathname };
}

/* ⚠ the second and third picks should not be the same KIND of page twice
   where a different kind is available: one service page plus an About tells
   the audit more than two service pages. Applied as a soft penalty so a site
   whose only real content is service pages still gets two of them. */
function kindOf(why) {
  if (/service/.test(why)) return 'service';
  if (/location|service-area/.test(why)) return 'location';
  if (/about|work|case/.test(why)) return 'story';
  if (/contact|pricing/.test(why)) return 'commercial';
  return 'other';
}

function pick(homeUrl, candidates, max) {
  const limit = (max || MAX_PAGES) - 1;                    /* homepage takes one */
  const seen = new Set([String(homeUrl).replace(/\/+$/, '')]);
  const scored = [];

  (candidates || []).forEach(u => {
    const key = String(u).replace(/\/+$/, '');
    if (seen.has(key)) return;
    seen.add(key);
    const s = scoreOf(u);
    if (!s) return;
    scored.push({ url: u, ...s });
  });

  scored.sort((a, b) =>
    b.score - a.score ||
    a.pathname.split('/').length - b.pathname.split('/').length ||
    a.pathname.localeCompare(b.pathname));

  const chosen = [];
  const kinds = new Set();
  for (const c of scored) {
    if (chosen.length >= limit) break;
    if (c.score < 0) continue;                             /* utility/blog: skip */
    const k = kindOf(c.why);
    if (kinds.has(k)) {
      /* only take a second of the same kind once every other kind is exhausted */
      const otherKindAvailable = scored.some(o =>
        !chosen.includes(o) && o !== c && o.score >= 0 && !kinds.has(kindOf(o.why)));
      if (otherKindAvailable) continue;
    }
    chosen.push(c); kinds.add(k);
  }

  /* nothing scored above zero: fall back to the least-bad candidate rather
     than reading only the homepage */
  if (!chosen.length && scored.length) {
    chosen.push(scored.sort((a, b) => b.score - a.score)[0]);
  }
  return chosen.slice(0, limit);
}

module.exports = { pick, scoreOf, MAX_PAGES, LOW_VALUE };
