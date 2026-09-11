"""Build /work/kreated/ — Kreated's own site, recorded the way a client case is.
Head, header, drawer, footer and scripts come byte for byte from the Rare Raleigh
case study; only meta, structured data and <main> are written here.
Every figure is from the Search Console export of 2026-09-10 (7 days,
2026-09-02 -> 2026-09-08), docs/GSC-BASELINE.md, or DECISION 024."""
import html, json, os, re

ROOT = '/Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2/prototype/kreated-v2'
tpl = open(os.path.join(ROOT, 'work/rare-raleigh-restoration/index.html'), encoding='utf-8').read()
HEAD, FOOT = tpl[:tpl.index('<main id="top" tabindex="-1">')], tpl[tpl.index('</main>'):]

URL = 'https://kreated.dev/work/kreated/'
TITLE = 'Kreated’s Own Search Baseline | Work | Kreated'
DESC = ('Kreated’s own website, recorded the way client work is: the first week of Search '
        'Console data after launch, dated, with each change added as it happens.')

h = HEAD
h = h.replace('https://kreated.dev/work/rare-raleigh-restoration/', URL)
old_t = re.search(r'<title>(.*?)</title>', h).group(1)
old_d = re.search(r'<meta name="description" content="([^"]*)"', h).group(1)
h = h.replace(old_t, html.escape(TITLE, quote=False)).replace(old_d, html.escape(DESC))
# og image: the client capture is wrong here; fall back to the brand card
h = re.sub(r'(<meta property="og:image" content=")[^"]*(")', r'\1https://kreated.dev/assets/img/og-card.jpg\2', h)
h = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', r'\1https://kreated.dev/assets/img/og-card.jpg\2', h)
h = re.sub(r'(<meta property="og:image:width" content=")[^"]*(")', r'\g<1>1200\2', h)
h = re.sub(r'(<meta property="og:image:height" content=")[^"]*(")', r'\g<1>630\2', h)
h = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")', r'\1Kreated\2', h)
graph = {"@context": "https://schema.org", "@graph": [
  {"@type": "BreadcrumbList", "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Kreated", "item": "https://kreated.dev/"},
    {"@type": "ListItem", "position": 2, "name": "Work", "item": "https://kreated.dev/work/"},
    {"@type": "ListItem", "position": 3, "name": "Kreated’s own site", "item": URL}]},
  {"@type": "WebPage", "@id": URL + "#webpage", "url": URL, "name": TITLE,
   "isPartOf": {"@id": "https://kreated.dev/#website"},
   "publisher": {"@id": "https://kreated.dev/#organization"},
   "about": {"@id": "https://kreated.dev/#organization"}}]}
h = re.sub(r'<script type="application/ld\+json">.*?</script>',
           '<script type="application/ld+json">\n' + json.dumps(graph, indent=2, ensure_ascii=False) + '\n  </script>',
           h, count=1, flags=re.S)

main = '''<main id="top" tabindex="-1">

<!-- ==========================================================================
     KREATED'S OWN SITE — growth plan step 7, 2026-09-11. The record every client
     case keeps, kept on Kreated's own site, starting from the first week.
     ⚠ EVERY FIGURE IS REAL AND DATED: the Search Console export downloaded
     2026-09-10 (Web, "Last 7 days" = 2026-09-02 -> 2026-09-08), docs/GSC-
     BASELINE.md, and DECISION 024 for the market move.
     🚫 A 7-day window in week one is a starting line, not a result, and the
     page says so. 🚫 Never round, restate or "improve" an entry; add a new
     dated one. 🚫 Not a client: this page stays out of the client lists.
     ========================================================================== -->
<section class="shero cs__hero">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="/work/">WORK</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">KREATED&rsquo;S OWN SITE</span>
    </nav>

    <h1 class="shero__h cs__h">Kreated<span>on its own site</span></h1>

    <div class="shero__foot">
      <p class="shero__fact">The same record every client case keeps, kept on
        Kreated&rsquo;s own website from the first week. Here every number can be
        shown, including the early ones that are not flattering, because there is no
        client whose data it would be.</p>
    </div>

    <dl class="cs__facts">
      <div><dt>What it covers</dt><dd>Website &middot; Google Business Profile &middot; Local search</dd></div>
      <div><dt>Market</dt><dd>Wilmington, NC first, Raleigh second</dd></div>
      <div><dt>Open to search since</dt><dd>1 September 2026</dd></div>
      <div><dt>Status</dt><dd>Baseline recorded</dd></div>
    </dl>
  </div>
</section>

<section class="cs__b">
  <div class="wrap cs__grid">
    <div class="cs__aside"><h2 class="sec__h">Why this page exists</h2></div>
    <div class="cs__col">
      <p>A case study asks you to trust the numbers someone chose to show you. Client
        data belongs to the client, so most of it never can be shown, and what is left
        tends to be the good parts.</p>
      <p>Kreated&rsquo;s own site has no such limit. Its record starts at the start,
        with a site nobody had found yet, and each change is added on the date it is
        checked. Read it as the same method the client work follows, applied where
        nothing has to be left out.</p>
    </div>
  </div>
</section>

<section class="cs__b">
  <div class="wrap cs__grid">
    <div class="cs__aside">
      <h2 class="sec__h">The record</h2>
      <p class="bound">Dated, and added to as things change.</p>
    </div>
    <div class="cs__col">
      <dl class="cs__counts">
        <div><dt>Impressions</dt><dd>220</dd></div>
        <div><dt>Clicks</dt><dd>8</dd></div>
        <div><dt>Queries</dt><dd>42</dd></div>
      </dl>
      <p class="cs__src">Google Search Console, web search, 2 to 8 September 2026: the
        first seven days of data. A starting line, not a result.</p>
      <ol class="cs__log">
        <li><time datetime="2026-09-01">1 September 2026</time>
          <p>The site opened to search engines, and the sitemap was submitted to Google
            Search Console.</p>
          <p class="cs__logsrc">Search Console and the launch record.</p></li>
        <li><time datetime="2026-09-06">6 September 2026</time>
          <p>The home market moved from Raleigh to Wilmington: the Google Business Profile
            first, then the site&rsquo;s titles, structured data and footer.</p>
          <p class="cs__logsrc">Kreated&rsquo;s decision record.</p></li>
        <li><time datetime="2026-09-08">2 to 8 September 2026</time>
          <p>220 impressions, 8 clicks and 42 distinct queries. Every click landed on the
            homepage. The only query with clicks Search Console shows was the business
            name, &ldquo;kreated&rdquo;, with 4; it withholds the queries behind the other 4.</p>
          <p class="cs__logsrc">Search Console performance export, downloaded 10 September 2026.</p></li>
        <li><time datetime="2026-09-08">2 to 8 September 2026</time>
          <p>No query that week mentioned Wilmington. The location searches that did
            appear were all for the Raleigh area or elsewhere in North Carolina.</p>
          <p class="cs__logsrc">The same export, query list.</p></li>
      </ol>
    </div>
  </div>
</section>

<section class="cs__b">
  <div class="wrap cs__grid">
    <div class="cs__aside"><h2 class="sec__h">What this does not show</h2></div>
    <div class="cs__col">
      <p>Seven days is too short to mean much on its own, and this particular week
        straddles the move from Raleigh to Wilmington. Nothing above is an outcome.
        It is the line the next entries will be measured from.</p>
      <p>The next entry will be a longer reading, long enough to show whether the
        Wilmington pages are being picked up. It will be added here with its dates and
        its source, whatever it shows. How the numbers are chosen is set out in
        <a class="ilink" href="/resources/what-to-actually-track/">what a small business
        should actually track</a>.</p>
    </div>
  </div>
</section>

<section class="cs__b cs__b--links">
  <div class="wrap">
    <p class="cs__rel">Related: <a class="ilink" href="/services/local-seo/">Local SEO</a>,
      <a class="ilink" href="/services/google-business-profile/">Google Business Profile</a>,
      and <a class="ilink" href="/resources/how-long-local-seo-takes/">how long local
      SEO takes</a>, which explains why the first months look like this.</p>
  </div>
</section>

<section class="close">
  <div class="wrap">
    <div class="close__row">
      <a class="close__go" data-evt="cta_start_project" href="/#project">Start a Project <i aria-hidden="true">&#8594;</i></a>
      <a class="close__alt" data-evt="cta_view_work" href="/work/">All work <i aria-hidden="true">&#8594;</i></a>
    </div>
  </div>
</section>

'''
out = os.path.join(ROOT, 'work/kreated')
os.makedirs(out, exist_ok=True)
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(h + main + FOOT)
print('title', len(TITLE), '| description', len(DESC))
