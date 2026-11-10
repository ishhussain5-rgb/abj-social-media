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
