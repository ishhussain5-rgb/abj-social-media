/* Runs inside the Tilda page editor. Patches the saved code of an existing new-standard block in place
   (keeps editor-filled content such as the form key, legal text and area text), then saves it.
   Usage: await abjPatch('<record id>')   -> returns a short report; publish the page afterwards. */
window.abjPatch = async function (rec) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 30 && !document.querySelector('#record' + rec + ' pre code'); i++) await W(500);
  const el = document.querySelector('#record' + rec + ' pre code');
  if (!el) throw 'no record ' + rec;
  let c = el.textContent;
  if (!c.includes('(DEV, new standard)')) throw 'not a new-standard block';
  const H = [
    ['#kc .hero h1{font-size:clamp(46px,6.4vw,112px);max-width:11.5em;', '#kc .hero h1{font-size:clamp(40px,5vw,88px);max-width:12.5em;'],
    ['#kc .hero.hm h1{font-size:clamp(44px,5.6vw,100px);max-width:12.5em}', '#kc .hero.hm h1{font-size:clamp(38px,4.3vw,80px);max-width:13.5em}'],
    ['#kc .hero.hm h1{font-size:38px}', '#kc .hero.hm h1{font-size:35px}'],
    ['#kc .hero.sm h1{font-size:clamp(40px,4.4vw,80px)}', '#kc .hero.sm h1{font-size:clamp(36px,3.7vw,66px)}'],
    ['#kc .ih h1{font-size:clamp(44px,5.2vw,92px);margin:22px 0 26px;max-width:12em}', '#kc .ih h1{font-size:clamp(38px,4.2vw,74px);margin:22px 0 26px;max-width:13em}'],
    ['#kc .bkp h1{font-size:clamp(42px,4.4vw,80px);margin:22px 0 24px;max-width:10em}', '#kc .bkp h1{font-size:clamp(36px,3.6vw,66px);margin:22px 0 24px;max-width:11em}']
  ];
  let n = 0;
  for (const [a, b] of H) if (c.includes(a)) { c = c.split(a).join(b); n++; }
  if (n < 5 && !c.includes('clamp(38px,4.3vw,80px)')) throw 'heading rules not found (' + n + ')';
  const L = [['href="/case-study-kings-road-kitchen-peterborough"', 'href="/case-study-kings-road-kitchen-peterborough-dev-c3k8"'],
             ['href="/case-study-handleless-island-kitchen"', 'href="/case-study-handleless-island-kitchen-dev-h6w2"']];
  let links = 0;
  for (const [a, b] of L) { links += c.split(a).length - 1; c = c.split(a).join(b); }
  const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: rec, onlythisfield: 'code', code: c }, explanation: 'save code' });
  if (JSON.stringify(r).indexOf('OK') < 0) throw 'save failed ' + JSON.stringify(r).slice(0, 80);
  await tp__updateRecord(rec); await W(1500);
  return document.title.replace('Tilda: ', '').slice(0, 40) + ' | rules ' + n + ' | links ' + links;
};
