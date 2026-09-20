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

/* ⚠ REWRITTEN 2026-09-20. This used to be the whole test, and `^home\b`
   matched "Home Renovations | Wilmington, NC" and "Home Construction &
   Renovation Company | Delaney's" — two titles that name the work AND the town.
   Both businesses were told "that title does not say what the business does or
   where it works", and both got a false critical off it.
   A title is only generic when it opens with a placeholder word AND names
   neither a trade nor a place. 🚫 Do not test the opening word on its own. */
const GENERIC_START = /^(home|welcome|untitled|index|home page|my site|website|page)\b/i;
function titleIsGeneric(title, s) {
  if (!title) return true;
  if (!GENERIC_START.test(title)) return false;
  return !(s.titleNamesTrade || s.titleNamesPlace);
}

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

    /* ⚠ SIZE AND AGE, added 2026-09-20. The audit had no way to notice that a
       site is four pages on a page builder, or that its copyright stopped three
       years ago. Ten Wilmington contractors were audited and four of them —
       a two-page Wix site among them — were told "the site is structurally
       sound" and offered a $450 page. Structure is not the same as substance.
       🚫 These are SMALL, factual signals. Do not turn this into a judgment of
       taste: the audit cannot see a design, and must not pretend to. */
    const small = s.pathsSeen > 2 && s.pathsSeen <= 4;
    if (small) { bad.push('small'); ev.push('The site has ' + s.pathsSeen + ' pages linked from its own navigation.'); }
    if (s.isBuilder) { bad.push('builder'); ev.push('It is built on ' + s.platform + ', a drag-and-drop page builder.'); }
    /* ⚠ ONLY ON A BUILDER. Concise copy on a hand-built site is a choice, and
       a 282-word fixture written to be strong tripped this at 350. It reads as
       a symptom only next to a drag-and-drop platform. */
    if (s.isBuilder && home.wordCount >= 150 && home.wordCount < 350) { bad.push('light copy'); ev.push('The homepage carries about ' + home.wordCount + ' words, which is little for a buyer comparing contractors.'); }
    const thisYear = new Date().getFullYear();
    if (s.copyrightYear && thisYear - s.copyrightYear >= 2) { bad.push('stale'); ev.push('The footer copyright reads ' + s.copyrightYear + '.'); }
    /* a repeated or borrowed H1 ("Subscribe Form") is a structural tell */
    if (home.h1Count > 1) ev.push('More than one H1 on the homepage: ' + home.h1s.slice(0, 2).map(function (h) { return '“' + h + '”'; }).join(' and ') + '.');

    /* the site is not broken, but it is too small to do the job */
    /* ⚠ A SMALL SITE IS FOUR PAGES OR FEWER. Six was the first threshold and it
       fired on a deliberately strong six-page fixture: services, locations,
       about, contact, pricing. Six pages is a site; four is a brochure.
       Light copy on a hand-built site is a copy note, not a rebuild — it only
       reads as "too little site" when it sits on a page builder. */
    const rebuild = (bad.includes('thin') || bad.includes('shallow') || small) ||
                    (bad.includes('light copy') && s.isBuilder);

    /* ⚠ CRITICAL MEANS "COSTING ENQUIRIES NOW", not "could be better". Thin
       copy was in this trigger and made a working site with a form, a phone
       number and a clear CTA come out critical purely for being concise. Only
       a broken conversion path is critical. 🚫 Do not add a quality signal to
       this condition; add it to the recommended branch below. */
    if (bad.includes('no contact') || bad.includes('no cta'))
      out.push(F(cat, 'critical', 'The site is not set up to turn a visitor into an inquiry.',
        'Someone who arrives ready to contact you has to work out how. Most will not.', ev,
        'A website engagement that puts the contact path where people look.'));
    else if (rebuild)
      out.push(F(cat, 'recommended', 'There is less site here than the business deserves.',
        'A few pages on a page builder can prove you exist. Winning a comparison against two other contractors takes more than that.', ev,
        'A new website, sized to the services you want to be found for.'));
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
      if (titleIsGeneric(home.title, s)) { bad.push('generic'); ev.push('That title does not say what the business does or where it works.'); }
      if (home.titleLength < 20) bad.push('short title');
    }
    if (home.h1Count === 0) { bad.push('no h1'); ev.push('The homepage has no H1 heading.'); }
    else if (home.h1Count > 1) { bad.push('many h1'); ev.push('The homepage has ' + home.h1Count + ' H1 headings, so none of them is the page’s subject.'); }
    else ev.push('One H1: “' + home.h1s[0] + '”.');
    if (!home.description) { bad.push('no description'); ev.push('No meta description was found.'); }
    if (s.servicePages.length === 0) { bad.push('no service pages'); ev.push('No page dedicated to a single service was found in the internal links.'); }
    else ev.push(s.servicePages.length + ' service ' + (s.servicePages.length === 1 ? 'page' : 'pages') + ' found: ' + s.servicePages.slice(0, 4).join(', ') + '.');
    if (home.internalCount < 5) { bad.push('few links'); ev.push('The homepage links to ' + home.internalCount + ' internal destinations.'); }

    /* ⚠ THE HEADLINE HAS TO MATCH THE REASON, and "no service pages" is not a
       critical on its own — a site can name its trade and its town perfectly
       and still keep its services on one page. Sending "search engines cannot
       tell what you do" to a business whose title reads "Kitchen, Bathroom &
       Home Remodeling in Wilmington, NC" is the fastest way to lose them.
       🚫 Do not put 'no service pages' back into the critical set. */
    const titleBad = bad.includes('no title') || bad.includes('generic');
    if (titleBad)
      out.push(F(cat, 'critical', 'Search engines cannot tell what you do from this page.',
        'The title is the first thing read, and yours does not name the work or the market.', ev,
        'The title, headings and description rewritten around what people search for.'));
    else if (bad.includes('no h1'))
      out.push(F(cat, 'critical', 'The homepage has no main heading.',
        'The H1 is how a page states its subject. Without one, the strongest signal on the page is missing.', ev,
        'A heading structure that states the work and the market.'));
    else if (bad.includes('short title'))
      /* ⚠ nchammerconstruction.com's homepage <title> is "Contact Us". That is
         what Google prints as the result title, and it was buried in the
         evidence under a headline about service pages. */
      out.push(F(cat, 'recommended', 'The homepage title says almost nothing.',
        'The title is the line Google prints as your search result, and yours is too short to say what the business does or where it works.', ev,
        'A title, heading and description that name the work and the market.'));
    else if (bad.includes('no service pages'))
      out.push(F(cat, 'recommended', 'Everything you do shares one page.',
        'A service with its own page can be found on its own terms, and can be sent to a customer asking about that one job.', ev,
        'A page for each service you want more of.'));
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
    /* ⚠ QUOTE THE CLEANED NAME, not a raw regex hit. This printed "A location
       appears in the page text: “Roofers Wilmington NC”" — the same bad capture
       that inflated the market count. cityMentions has already stripped the
       trade word and the direction; use it, and only fall back to the raw match
       when there is nothing cleaned to show. */
    const t = (home.title || '') + ' ' + home.bodySample;
    const named = Object.keys(s.cityMentions || {});
    const place = named.length ? [named[0]]
      : t.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),?\s(?:NC|SC|VA|GA|NY|CA|TX|FL|North Carolina|South Carolina)\b/);
    if (place) ev.push('A location appears in the page text: “' + place[0] + '”.');
    else { bad.push('no place'); ev.push('No city or state was found in the homepage title or visible text.'); }
    if (!s.anyLocalSchema && s.anyOrgSchema) {
      bad.push('no schema');
      ev.push('Only Organization structured data was found, which does not carry the address, hours or service area that LocalBusiness does.');
    } else if (!s.anyLocalSchema) { bad.push('no schema'); ev.push('No LocalBusiness structured data was found.'); }
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

    /* ⚠ ONLY WHEN THE SITE NAMES MORE THAN ONE MARKET. This branch used to fire
       on `!locationPages.length && servicePages.length && place`, which is true
       of every single-market business — including kreated.dev, which has no
       location pages ON PURPOSE. It produced "You name markets the site has no
       page for" from evidence that one place was named, and then a priced
       recommendation to build them.

       That is precisely what the guard four lines above forbids: "a business
       that genuinely works a single town is never told to invent markets it
       does not serve. Inventing demand is the one thing this tool must not do."
       The rule was applied to the 'one market' branch and missed here.

       It is also advice Kreated publicly argues against — /web-design-for-
       contractors/ says "not a page for every town within an hour", and
       /services/local-seo/ refuses to build a location page without genuine
       local relevance. The tool was contradicting the agency selling it.

       cityMentions holds every distinct "City, ST" found in the copy. Two or
       more named, none of them covered by a page, is a real gap. One named is a
       single-market business and is correct as it stands.
       🚫 Do not relax this back to `place`. `place` is the FIRST match in the
       text — it is true of every local site alive. */
    const namedCities = Object.keys(s.cityMentions || {}).length;
    if (!s.locationPages.length && s.servicePages.length && namedCities >= 2) {
      bad.push('no location pages');
      ev.push('The site names ' + namedCities + ' markets in its copy, and no page targets any of them.');
    } else if (!s.locationPages.length && namedCities <= 1) {
      ev.push('No location pages, and the copy names a single market — which is what a single-market business should look like.');
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
    const tagged = tags.ga4 || tags.gtm || tags.ua;
    if (tagged) ev.push('An analytics tag was detected in the page source' + (tags.gtm ? ' (Tag Manager)' : tags.ua ? ' (Universal Analytics)' : ' (GA4)') + '.');
    else if (s.analyticsMayBeHidden) {
      /* ⚠ NOT A FINDING. On Wix, Squarespace, GoDaddy, Weebly and Duda the
         platform's own analytics is attached in a dashboard and injected at
         runtime, so it is invisible to an HTML read. Absence is not evidence
         here, and 🚫 it must never be priced. */
      bad.push('cannot tell');
      ev.push('This site is built on ' + s.platform + ', which attaches analytics in its own dashboard rather than in the page source. Whether anything is counting cannot be seen from outside.');
    } else { bad.push('no tag'); ev.push('No analytics or tag manager script was detected in the homepage source.'); }
    if (!s.anyForm && !s.anyTel) { bad.push('nothing to measure'); ev.push('There is no form or click-to-call for a conversion to be recorded against.'); }
    else ev.push('There ' + (s.anyForm && s.anyTel ? 'are both a form and a phone number' : s.anyForm ? 'is a form' : 'is a phone number') + ' that a conversion could be measured against.');

    /* 🚫 whether events are CONFIGURED cannot be seen from HTML */
    ev.push('Whether conversions are actually configured cannot be seen from outside the site.');

    if (bad.includes('cannot tell'))
      out.push(F(cat, 'optional', 'Whether anything is counting cannot be seen from here.',
        'The platform hides it. It is worth confirming in your own dashboard, and worth fixing only if nothing is there.', ev,
        'Check the platform\u2019s own analytics settings before buying anything.'));
    else if (bad.includes('no tag'))
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
  /* ⚠ AND NOTHING RECOMMENDED, 2026-09-20. "There is no piece of work here
     worth paying for" used to fire on five strong categories alone, so a site
     with a real recommended finding was told to buy nothing while the plan
     underneath listed $1,650 of it. The verdict and the plan have to agree:
     if the audit recommends something, it does not also say buy nothing. */
  const recommended = findings.filter(f => f.status === 'recommended').length;
  if (strong >= 5 && critical === 0 && recommended === 0)
    return { fit:'poor', reason:'Almost everything checked is already in good shape. There is no piece of work here worth paying for right now, and you should not be sold one.' };
  if (s.pagesFetched && s.home.wordCount > 3000 && s.pathsSeen > 40)
    return { fit:'uncertain', reason:'This is a larger site than Kreated is usually the right studio for. The findings still stand, but a bigger team may be the better implementation partner.' };
  return { fit:'good', reason:null };
}

module.exports = { classify, fitVerdict, CATEGORIES };
