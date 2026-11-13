/* Run in a Tilda page editor. await abjPatch({pid, sha, mobile:true, film?, filmAnchors?, guarantee?, publish?}) */
window.abjPatch = async function (o) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 40 && !document.querySelector('.record pre code'); i++) await W(500);
  if (String(window.pageid) !== String(o.pid)) throw new Error('wrong page ' + window.pageid);
  const recs = [...document.querySelectorAll('.record')].filter(r => r.getAttribute('off') !== 'y')
    .map(r => ({ id: r.getAttribute('recordid'), c: (r.querySelector('pre code') || {}).textContent || '' })).filter(x => x.c.includes('id="kc"'));
  if (!recs.length) throw new Error('no kc block');
  recs.sort((a, b) => b.c.length - a.c.length);
  const rec = recs[0]; let c = rec.c; const old = c.length;
  const base = 'https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@' + o.sha + '/web/concept/';
  const get = async (p, mk) => { const r = await fetch(base + p); if (!r.ok) throw new Error('fetch ' + p + ' ' + r.status); const t = await r.text();
    if (!t.startsWith('<!-- ' + mk) || !t.trim().endsWith('<!-- /' + mk + ' -->')) throw new Error('bad ' + p); return t; };
  const log = [];
  if (o.film) { const sec = await get('films/' + o.film + '.html', 'ABJ FILM');
    c = c.replace(/<!-- ABJ KITCHEN FILM[\s\S]*?<!-- \/ABJ KITCHEN FILM -->\n?/, '').replace(/<!-- ABJ FILM[\s\S]*?<!-- \/ABJ FILM -->\n?/, '');
    const a = o.filmAnchors.find(x => c.split(x).length === 2); if (!a) throw new Error('no film anchor'); c = c.replace(a, () => sec + a); log.push('film'); }
  if (o.mobile) { const sec = await get('mobile/mobile.html', 'ABJ MOBILE');
    c = c.replace(/\n?<!-- ABJ MOBILE \(phone layer[\s\S]*?<!-- \/ABJ MOBILE -->\n?/g, ''); c = c.replace(/\s*$/, '') + '\n' + sec; log.push('mobile'); }
  let g10 = 0;
  if (o.guarantee) { if (!window.abjG) { const t = await fetch(base + 'guarantee.js').then(r => r.text()); (0, eval)(t); }
    const n = abjG.fix(c); if (n !== c) { g10 = (c.match(/10-year|10 yrs/g) || []).length - (n.match(/10-year|10 yrs/g) || []).length; c = n; } }
  const left = (c.match(/10-year|10 yrs/gi) || []).length;
  if (c.length < old * 0.9) throw new Error('shrunk');
  if (c === rec.c) return o.pid + ' unchanged';
  const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(o.pid), recordid: rec.id, onlythisfield: 'code', code: c } });
  if (JSON.stringify(r).indexOf('OK') < 0) throw new Error('save ' + JSON.stringify(r).slice(0, 60));
  let p = '';
  if (o.publish !== false) { const q = await tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(o.pid), csrf: getCSRF(), returnjson: 'yes' } });
    p = JSON.stringify(q).includes('publishonepage') ? 'pub' : 'PUBFAIL'; }
  return [o.pid, rec.id, old, c.length, log.join('+'), 'g-' + g10, 'left' + left, p].join(' ');
};
