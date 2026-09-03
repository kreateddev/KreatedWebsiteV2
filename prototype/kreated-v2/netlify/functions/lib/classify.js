/* ==========================================================================
   KREATED — FINDING CLASSIFICATION
   Signals in, findings out. Six categories, four statuses.

   ⚠ THE DIVISION OF LABOUR, AND IT IS NOT NEGOTIABLE:
     · THIS FILE decides the status. Deterministic, from measured signals.
     · THE MODEL (optional) rewrites the prose so it reads like a person.
     · THE RULES ENGINE turns needs into offers and prices.

   🚫 The model never sets a status, never sees a price, never names a package,
   and never invents evidence. If the model is unavailable the audit still
   works — the copy is simply plainer. That is why this file exists separately
   from the prompt.

   🚫 NO OVERALL SCORE. There is no defensible weighting for "72/100" and a
   vanity number would be the least honest thing on the page. Priorities are
   the output.
   ========================================================================== */
'use strict';

const CATEGORIES = [
  { id:'website',  need:'website',  label:'Website' },
  { id:'search',   need:'pages',    label:'Search foundations' },
  { id:'local',    need:'localSeo', label:'Local visibility' },
  { id:'brand',    need:'brand',    label:'Brand and trust' },
  { id:'aeo',      need:'aeo',      label:'Answer readiness' },
  { id:'tracking', need:'tracking', label:'Measurement' }
];

const GENERIC_TITLE = /^(home|welcome|untitled|index|home page|my site|website)\b/i;

/* every finding carries the evidence that produced it */
function F(cat, status, finding, why, evidence, next) {
  return { category: cat.id, label: cat.label, need: cat.need, status,
           finding, why, evidence: evidence.filter(Boolean), next };
}

/* ⚠ NAME THE MARKET ONLY WHEN IT RESOLVES RELIABLY. marketsCovered holds
   GROUPING keys, not city names: "/kitchen-remodeling-cary-nc" groups as
   "cary-nc", but a two-word city groups as "forest-nc" for Wake Forest, and
   printing "Forest, NC" at a business owner is worse than saying nothing. The
   key is only trusted when the same token also appears as a "City, ST" mention
   in the page text — that is what turns a grouping key into a real name.
   🚫 Never build a display name from the slug alone; fall back to generic. */
function marketName(key, cityMentions) {
  if (!key) return null;
  const m = String(key).match(/^([a-z-]+)-([a-z]{2})$/i);
  if (!m) return null;
  const token = m[1].replace(/-/g, ' ');
  const state = m[2].toUpperCase();
  const named = Object.keys(cityMentions || {}).find(function (c) {
    return c.toLowerCase() === token.toLowerCase();
  });
  return named ? named + ', ' + state : null;
}

const COUNT_WORD = ['', 'one', 'two', 'three', 'four', 'five', 'six',
                    'seven', 'eight', 'nine', 'ten'];
function countWord(n) { return COUNT_WORD[n] || String(n); }

function classify(s) {
  const home = s.home;
  const out = [];

  /* ---- WEBSITE ------------------------------------------------------- */
  (function () {
    const cat = CATEGORIES[0];
    const ev = [], bad = [];
    if (!home.viewport) { bad.push('no viewport'); ev.push('The page declares no mobile viewport, so it is unlikely to lay out correctly on a phone.'); }
    if (home.wordCount < 150) { bad.push('thin'); ev.push('The homepage carries about ' + home.wordCount + ' words of visible text.'); }
    if (s.pathsSeen <= 2) { bad.push('shallow'); ev.push('Only ' + s.pathsSeen + ' internal ' + (s.pathsSeen === 1 ? 'page was' : 'pages were') + ' linked from the homepage.'); }
    if (!home.ctas.length) { bad.push('no cta'); ev.push('No obvious call to action was found in the homepage links or buttons.'); }
    else ev.push('Calls to action found: ' + home.ctas.slice(0, 3).map(c => '“' + c + '”').join(', ') + '.');
    if (!s.anyForm && !s.anyTel) { bad.push('no contact'); ev.push('Neither an inquiry form nor a click-to-call number was found.'); }

    /* ⚠ CRITICAL MEANS "COSTING ENQUIRIES NOW", not "could be better". Thin
       copy was in this trigger and made a working site with a form, a phone
       number and a clear CTA come out critical purely for being concise. Only
       a broken conversion path is critical. 🚫 Do not add a quality signal to
       this condition; add it to the recommended branch below. */
    if (bad.includes('no contact') || bad.includes('no cta'))
      out.push(F(cat, 'critical', 'The site is not set up to turn a visitor into an inquiry.',
        'Someone who arrives ready to contact you has to work out how. Most will not.', ev,
        'A website engagement that puts the contact path where people look.'));
    else if (bad.length)
      out.push(F(cat, 'recommended', 'The site works, but it is thin in places.',
        'It does the job today and would do more with a clearer structure.', ev,
        'A redesign, or additional pages on the site you have.'));
    else
      out.push(F(cat, 'alreadyStrong', 'The site is structurally sound.',
        'It has depth, a mobile viewport and a findable way to get in touch.', ev, null));
  })();

  /* ---- SEARCH FOUNDATIONS -------------------------------------------- */
  (function () {
    const cat = CATEGORIES[1];
    const ev = [], bad = [];
    if (!home.title) { bad.push('no title'); ev.push('The homepage has no title tag.'); }
    else {
      ev.push('Homepage title: “' + home.title + '” (' + home.titleLength + ' characters).');
      if (GENERIC_TITLE.test(home.title)) { bad.push('generic'); ev.push('That title does not say what the business does or where it works.'); }
      if (home.titleLength < 20) bad.push('short title');
    }
    if (home.h1Count === 0) { bad.push('no h1'); ev.push('The homepage has no H1 heading.'); }
    else if (home.h1Count > 1) { bad.push('many h1'); ev.push('The homepage has ' + home.h1Count + ' H1 headings, so none of them is the page’s subject.'); }
    else ev.push('One H1: “' + home.h1s[0] + '”.');
    if (!home.description) { bad.push('no description'); ev.push('No meta description was found.'); }
    if (s.servicePages.length === 0) { bad.push('no service pages'); ev.push('No page dedicated to a single service was found in the internal links.'); }
    else ev.push(s.servicePages.length + ' service ' + (s.servicePages.length === 1 ? 'page' : 'pages') + ' found: ' + s.servicePages.slice(0, 4).join(', ') + '.');
    if (home.internalCount < 5) { bad.push('few links'); ev.push('The homepage links to ' + home.internalCount + ' internal destinations.'); }

    if (bad.includes('no title') || bad.includes('generic') || bad.includes('no h1') || bad.includes('no service pages'))
      out.push(F(cat, 'critical', 'Search engines cannot tell what you do from this page.',
        'The title and headings are the first thing read, and yours do not name the work or the market.', ev,
        'Search foundations and pages built around what people actually search for.'));
    else if (bad.length)
      out.push(F(cat, 'recommended', 'The basics are there but not doing much work.',
        'Small structural corrections tend to be the cheapest visibility available.', ev,
        'A tightening pass on titles, headings and internal links.'));
    else
      out.push(F(cat, 'alreadyStrong', 'The search foundations are in order.',
        'Title, headings, description and service pages all say the same thing.', ev, null));
  })();

  /* ---- LOCAL VISIBILITY ---------------------------------------------- */
  (function () {
    const cat = CATEGORIES[2];
    const ev = [], bad = [];
    const t = (home.title || '') + ' ' + home.bodySample;
    const place = t.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),?\s(?:NC|SC|VA|GA|NY|CA|TX|FL|North Carolina|South Carolina)\b/);
    if (place) ev.push('A location appears in the page text: “' + place[0] + '”.');
    else { bad.push('no place'); ev.push('No city or state was found in the homepage title or visible text.'); }
    if (!s.anyLocalSchema) { bad.push('no schema'); ev.push('No LocalBusiness structured data was found.'); }
    else ev.push('LocalBusiness structured data is present.');
    if (!s.anyTel) { bad.push('no tel'); ev.push('No click-to-call phone number was found.'); }
    if (s.locationPages.length) ev.push(s.locationPages.length + ' location-style ' + (s.locationPages.length === 1 ? 'page' : 'pages') + ' found.');

    /* ⚠ MARKETS COVERED, NOT PAGES COUNTED. This is the check that was missing.
       locationPages.length was only ever added as POSITIVE evidence and never
       tested, so six pages all ending -cary-nc read as broad local coverage and
       the category came out alreadyStrong — which pushed the overall verdict to
       "no piece of work here worth paying for" on a site with one market's worth
       of local SEO. Six pages for one city is ONE market, not six.
       🚫 Only fires at 3+ location pages, so a business that genuinely works a
       single town is never told to invent markets it does not serve. Inventing
       demand is the one thing this tool must not do. */
    const markets = (s.marketsCovered || []).length;
    if (s.locationPages.length >= 3 && markets === 1) {
      bad.push('one market');
      ev.push('All ' + s.locationPages.length + ' location pages target the same market, so the site has one area’s worth of local coverage however many pages carry a place name.');
    } else if (markets > 1) {
      ev.push(markets + ' distinct markets have a page of their own.');
    }

    /* a service business with a stated market and no location page at all */
    if (!s.locationPages.length && s.servicePages.length && place) {
      bad.push('no location pages');
      ev.push('No page on the site targets any of the areas you serve.');
    }


    /* 🚫 The Google Business Profile itself is NOT inspected. Saying anything
       about it from HTML alone would be fabricated evidence. */
    ev.push('The Google Business Profile itself was not inspected: this audit reads your public website only.');

    if (bad.includes('no place'))
      out.push(F(cat, 'critical', 'The site does not say where you work.',
        'Local search is the main way service businesses get found, and it starts with naming the market.', ev,
        'Local search foundations, and location pages only where the market is real.'));
    else if (bad.includes('one market')) {
      /* ⚠ CONDITIONAL, NOT PRESCRIPTIVE. This says "your coverage is
         concentrated", never "you need more city pages". Public HTML cannot
         tell us whether the business wants other markets, so the next step is
         framed as a question for the owner and explicitly allows the answer
         "no expansion needed".
         🚫 Do NOT claim the same-city pages compete with each other. That is a
         cannibalisation claim and nothing here is evidence for it — depth in
         one market is a legitimate strategy, and an earlier draft asserted it
         anyway. */
      const nm = marketName((s.marketsCovered || [])[0], s.cityMentions);
      const city = nm ? nm.split(',')[0] : null;
      const n = countWord(s.locationPages.length);
      out.push(F(cat, 'recommended',
        'Your local coverage is concentrated in one market.',
        nm
          ? ('The site has ' + n + ' service-location pages, but they all target ' + nm +
             '. That gives you useful depth in ' + city + ', but little dedicated search ' +
             'coverage for other markets you may serve.')
          : ('The site has ' + n + ' service-location pages, but they all target the same ' +
             'market. That gives you useful depth there, but little dedicated search ' +
             'coverage for other markets you may serve.'),
        ev,
        nm
          ? ('If expanding beyond ' + city + ' is part of the business strategy, additional ' +
             'location-specific pages could create clearer relevance for those markets. If ' +
             city + ' is the only market you want to target, no expansion is needed.')
          : ('If expanding beyond that market is part of the business strategy, additional ' +
             'location-specific pages could create clearer relevance for those areas. If that ' +
             'is the only market you want to target, no expansion is needed.')));
    }
    else if (bad.includes('uncovered markets') || bad.includes('no location pages'))
      out.push(F(cat, 'recommended', 'You name markets the site has no page for.',
        'Search engines rank pages, not intentions. A market you only mention in passing has nothing to rank, so the areas you most want work in can be the ones you are least visible for.', ev,
        'Local search work: a page for each market you genuinely serve, and none for markets you do not.'));
    else if (bad.length)
      out.push(F(cat, 'recommended', 'The location is stated but not reinforced.',
        'Structured data and a consistent profile are what make the location legible to search engines.', ev,
        'Local search work, including the profile.'));
    else
      out.push(F(cat, 'alreadyStrong', 'Local signals are clear.',
        'The market is named, marked up, and reachable by phone.', ev, null));
  })();

  /* ---- BRAND AND TRUST ----------------------------------------------- */
  (function () {
    const cat = CATEGORIES[3];
    const ev = [], bad = [];
    const trust = /(review|testimonial|licen[cs]ed|insured|warrant|guarantee|years|since \d{4}|award|certified|accredited)/i;
    const hasTrust = trust.test(home.bodySample);
    if (hasTrust) ev.push('Trust language appears on the homepage (reviews, credentials or history).');
    else { bad.push('no trust'); ev.push('No reviews, credentials, guarantees or history were found on the homepage.'); }
    if (!home.description) bad.push('no description');
    if (home.wordCount < 250) { bad.push('little copy'); ev.push('There is little copy for a visitor to judge the business by.'); }
    if (s.pagesFetched > 1) ev.push(s.pagesFetched + ' pages were read, and their headings were compared for consistency.');

    if (bad.includes('no trust') && bad.includes('little copy'))
      out.push(F(cat, 'recommended', 'There is not much here to believe.',
        'A visitor comparing three businesses picks the one that looks most established. Nothing on the page does that job.', ev,
        'Brand work, or simply putting the proof you already have on the page.'));
    else if (bad.length)
      out.push(F(cat, 'optional', 'The brand holds together, with gaps.',
        'Worth improving when something else is not more urgent.', ev, 'A brand refresh, when the time is right.'));
    else
      out.push(F(cat, 'alreadyStrong', 'The business reads as credible.',
        'There is enough here for a stranger to decide you are real.', ev, null));
  })();

  /* ---- ANSWER READINESS ----------------------------------------------- */
  (function () {
    const cat = CATEGORIES[4];
    const ev = [], bad = [];
    /* ⚠ HONEST FRAMING. AEO is not a separate algorithm and this audit cannot
       observe any AI system's output. What it can observe is whether the page
       states plain answers in extractable text. 🚫 Never claim otherwise. */
    const qa = /\?/.test(home.bodySample) && home.h2s.some(h => /\?/.test(h));
    if (qa) ev.push('The page asks and answers questions in its headings, which is extractable structure.');
    else { bad.push('no qa'); ev.push('No question-and-answer structure was found in the headings.'); }
    if (!s.anySchema) { bad.push('no schema'); ev.push('No structured data of any kind was found.'); }
    else ev.push('Structured data present: ' + home.ldTypes.slice(0, 4).join(', ') + '.');
    if (home.wordCount < 200) { bad.push('thin'); ev.push('There is little extractable text on the page.'); }
    if (!home.description) { bad.push('no description'); ev.push('No meta description, which is often the sentence a system quotes.'); }

    ev.push('This checks whether your pages state plain, extractable answers. It does not and cannot measure any AI system’s output.');

    if (bad.length >= 3)
      out.push(F(cat, 'recommended', 'Your pages do not state plain answers.',
        'Systems that answer questions quote the sites that answer them directly. Yours makes a reader infer.', ev,
        'An answer readiness pass on the pages that get asked about.'));
    else if (bad.length)
      out.push(F(cat, 'optional', 'Mostly readable, with room to be clearer.',
        'Worth doing once the more urgent things are done.', ev, 'A light answer-first pass.'));
    else
      out.push(F(cat, 'alreadyStrong', 'Your pages answer questions directly.',
        'Structure and structured data are both present.', ev, null));
  })();

  /* ---- MEASUREMENT ---------------------------------------------------- */
  (function () {
    const cat = CATEGORIES[5];
    const ev = [], bad = [];
    const tags = home.rawTags || {};
    if (tags.ga4 || tags.gtm) ev.push('An analytics tag was detected in the page source' + (tags.gtm ? ' (Tag Manager)' : ' (GA4)') + '.');
    else { bad.push('no tag'); ev.push('No analytics or tag manager script was detected in the homepage source.'); }
    if (!s.anyForm && !s.anyTel) { bad.push('nothing to measure'); ev.push('There is no form or click-to-call for a conversion to be recorded against.'); }
    else ev.push('There ' + (s.anyForm && s.anyTel ? 'are both a form and a phone number' : s.anyForm ? 'is a form' : 'is a phone number') + ' that a conversion could be measured against.');

    /* 🚫 whether events are CONFIGURED cannot be seen from HTML */
    ev.push('Whether conversions are actually configured cannot be seen from outside the site.');

    if (bad.includes('no tag'))
      out.push(F(cat, 'recommended', 'Nothing appears to be counting.',
        'Without measurement there is no way to tell which changes worked, so every later decision is a guess.', ev,
        'Analytics and conversion tracking configured on the site you have.'));
    else if (bad.length)
      out.push(F(cat, 'optional', 'Something is counting, but there is little to count.',
        'Measurement is only worth as much as the conversion paths it watches.', ev, null));
    else
      out.push(F(cat, 'alreadyStrong', 'Measurement is in place.',
        'A tag is present and there is a real conversion path for it to watch.', ev, null));
  })();

  return out;
}

/* the audit's own view of whether Kreated is the right partner.
   🚫 This must be able to say no. */
function fitVerdict(findings, s) {
  const critical = findings.filter(f => f.status === 'critical').length;
  const strong   = findings.filter(f => f.status === 'alreadyStrong').length;
  if (strong >= 5 && critical === 0)
    return { fit:'poor', reason:'Almost everything checked is already in good shape. There is no piece of work here worth paying for right now, and you should not be sold one.' };
  if (s.pagesFetched && s.home.wordCount > 3000 && s.pathsSeen > 40)
    return { fit:'uncertain', reason:'This is a larger site than Kreated is usually the right studio for. The findings still stand, but a bigger team may be the better implementation partner.' };
  return { fit:'good', reason:null };
}

module.exports = { classify, fitVerdict, CATEGORIES };
