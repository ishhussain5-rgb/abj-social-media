/* Runs inside the Tilda page editor. Brings an existing new-standard block up to date and saves it.
   await abjUpdate({rec, slug, mode:'direct'|'patch', base})
   direct: replaces the block with out/<slug>.html from the given commit.
   patch:  keeps the block's own content (form key, legal text, area text) and swaps in the current shared theme
           styles (taken from out/home.html) and the DEV case-study links. Publish the page afterwards. */
window.abjUpdate = async function (o) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 30 && !document.querySelector('#record' + o.rec + ' pre code'); i++) await W(500);
  const el = document.querySelector('#record' + o.rec + ' pre code');
  if (!el) throw 'no record ' + o.rec;
  const cur = el.textContent;
  if (!cur.includes('(DEV, new standard)')) throw 'not a new-standard block';
  let c;
  if (o.mode === 'direct') {
    c = await (await fetch(o.base + 'out/' + o.slug + '.html', { cache: 'no-store' })).text();
    if (/\{W3F\}|<!--LEGAL-->|%%[A-Z0-9]+%%/.test(c)) throw 'source has placeholders, use patch';
  } else {
    const home = await (await fetch(o.base + 'out/home.html', { cache: 'no-store' })).text();
    const theme = home.match(/<style>[\s\S]*?<\/style>/)[0];
    if (!/#kc\{--ink/.test(theme)) throw 'theme not found in source';
    const old = cur.match(/<style>[\s\S]*?<\/style>/);
    if (!old || !/#kc\{--ink/.test(old[0])) throw 'theme not found in block';
    c = cur.replace(old[0], () => theme);
    for (const [a, b] of [['href="/case-study-kings-road-kitchen-peterborough"', 'href="/case-study-kings-road-kitchen-peterborough-dev-c3k8"'],
                          ['href="/case-study-handleless-island-kitchen"', 'href="/case-study-handleless-island-kitchen-dev-h6w2"']]) c = c.split(a).join(b);
  }
  if (!c.includes('(DEV, new standard)') || !c.includes('clamp(38px,4.3vw,80px)')) throw 'bad result';
  const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: o.rec, onlythisfield: 'code', code: c }, explanation: 'save code' });
  if (JSON.stringify(r).indexOf('OK') < 0) throw 'save failed ' + JSON.stringify(r).slice(0, 80);
  await tp__updateRecord(o.rec); await W(1500);
  return document.title.replace('Tilda: ', '').slice(0, 36) + ' | ' + o.mode + ' | ' + c.length;
};

/* Town pages: swap the dark text hero for a landmark photo hero and add an "Around <town>" landmarks section.
   await abjLandmarks({rec, town, imgs:[{url,cap,by,lic,licurl,page}, x3], base})
   Also swaps in the current theme (like abjUpdate patch). Idempotent: refuses if the page already has the section. */
window.abjLandmarks = async function (o) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 30 && !document.querySelector('#record' + o.rec + ' pre code'); i++) await W(500);
  const el = document.querySelector('#record' + o.rec + ' pre code');
  if (!el) throw 'no record ' + o.rec;
  let c = el.textContent;
  if (!c.includes('(DEV, new standard)')) throw 'not a new-standard block';
  if (c.includes('class="lmk2"')) throw 'already has landmarks';
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const plain = s => s.replace(/&rsquo;/g, '’').replace(/&amp;/g, '&');
  // hero
  const m = c.match(/<section class="ih"[\s\S]*?<\/section>/);
  if (!m) throw 'no ih hero';
  const d = new DOMParser().parseFromString(m[0], 'text/html');
  const kick = d.querySelector('.kick'), h1 = d.querySelector('h1'), p = d.querySelector('h1 ~ p'), acts = d.querySelector('.acts');
  if (!h1 || !p || !acts) throw 'hero parts missing';
  const [a, b, cc] = o.imgs;
  const hero = '<section class="hero hm sm" aria-label="' + esc(h1.textContent) + '">\n <img class="hi" src="' + a.url + '" alt="' + esc(plain(a.cap)) + ', ' + esc(o.town) + '" fetchpriority="high">\n <div class="w">\n  ' +
    (kick ? kick.outerHTML : '') + '\n  ' + h1.outerHTML + '\n  ' + p.outerHTML + '\n  ' + acts.outerHTML.replace(/class="bt o"/g, 'class="lnk"') + '\n </div>\n <span class="cap">' + a.cap + '</span>\n</section>';
  c = c.replace(m[0], () => hero);
  // remove the old low-res landmark figure (Oakham/Cambridge) and its two-column intro
  c = c.replace(/\s*<figure class="rv lmk"[\s\S]*?<\/figure>/, '').replace('<section class="intro lm">', '<section class="intro">');
  // credits
  const cr = o.imgs.map(x => '<a href="' + x.page + '" target="_blank" rel="noopener">' + x.cap + '</a>' + (x.by ? ' by ' + esc(x.by) : '') + ' (' + (x.licurl ? '<a href="' + x.licurl + '" target="_blank" rel="noopener">' + esc(x.lic) + '</a>' : esc(x.lic)) + ')').join('; ');
  const sec = '\n<section class="lmk2" aria-label="Around ' + esc(o.town) + '"><div class="w">\n <div class="sh rv"><div><span class="kick">Around ' + o.town + '</span><h2 style="margin-top:16px">A few of ' + o.town + '&rsquo;s landmarks</h2></div><p>Whatever the age or style of your ' + o.town + ' home, we design, make and fit furniture that suits it, from period cottages to new builds.</p></div>\n <div class="lmg">\n  <figure class="rv"><img loading="lazy" src="' + b.url + '" alt="' + esc(plain(b.cap)) + ', ' + esc(o.town) + '"><figcaption>' + b.cap + '</figcaption></figure>\n  <figure class="rv"><img loading="lazy" src="' + cc.url + '" alt="' + esc(plain(cc.cap)) + ', ' + esc(o.town) + '"><figcaption>' + cc.cap + '</figcaption></figure>\n </div>\n <p class="lmc">Photos from Wikimedia Commons: ' + cr + '.</p>\n</div></section>';
  const ii = c.indexOf('<section class="intro');
  if (ii < 0) throw 'no intro section';
  const jj = c.indexOf('</section>', ii) + '</section>'.length;
  c = c.slice(0, jj) + sec + c.slice(jj);
  // landmark styles go into the block's own theme style (the shared theme is refreshed separately)
  const LMK = "#kc .lmk2{padding:clamp(72px,7vw,120px) 0}#kc .lmg{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2vw,32px);margin-top:clamp(32px,3vw,52px)}#kc .lmg figure{position:relative;overflow:hidden;aspect-ratio:3/2;background:var(--lin2)}#kc .lmg img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}#kc .lmg figure:hover img{transform:scale(1.03)}#kc .lmg figure:after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:45%;background:linear-gradient(0deg,rgba(8,14,13,.6),rgba(8,14,13,0));pointer-events:none}#kc .lmg figcaption{position:absolute;left:18px;right:18px;bottom:16px;z-index:2;font:500 10.5px/1.4 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:#fff;text-shadow:0 1px 10px rgba(0,0,0,.6)}#kc .lmc{margin-top:18px;font-size:11.5px;line-height:1.7;color:var(--mut);max-width:70em}#kc .lmc a{border-bottom:1px solid var(--hair)}@media (max-width:760px){#kc .lmg{grid-template-columns:1fr;gap:14px}#kc .lmg figcaption{left:14px;bottom:12px}}";
  const st = c.match(/<style>[\s\S]*?<\/style>/);
  if (!st || !/#kc\{--ink/.test(st[0])) throw 'theme not found in block';
  if (!st[0].includes('.lmg{')) c = c.replace(st[0], () => st[0].replace('</style>', LMK + '</style>'));
  if (!c.includes('class="lmk2"') || !c.includes('hero hm sm') || c.includes('class="ih"')) throw 'bad result';
  const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: o.rec, onlythisfield: 'code', code: c }, explanation: 'save code' });
  if (JSON.stringify(r).indexOf('OK') < 0) throw 'save failed ' + JSON.stringify(r).slice(0, 80);
  await tp__updateRecord(o.rec); await W(1500);
  return document.title.replace('Tilda: ', '').slice(0, 40) + ' | landmarks | ' + c.length;
};
