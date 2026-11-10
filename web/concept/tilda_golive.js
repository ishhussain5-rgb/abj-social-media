/* Go-live helper. Runs inside the Tilda page editor (tilda.cc/page/?pageid=...). Nothing is ever deleted:
   the live page's old blocks are only switched off, so a page can be put back with abjRollback().

   1. On the DEV page editor:   await abjCapture('<DEV record id>')
        copies the finished new-design block (exactly what was checked on DEV) into this browser's storage.
   2. On the LIVE page editor:  await abjGoLive({base, slug})
        rewrites every DEV link to its live address (linkmap.json), refuses if any DEV link is left,
        saves a backup list of the live blocks and which were on, adds the new block at the top as a NEW record
        (a duplicate of the smallest old block whose code is then replaced; the old block itself is untouched),
        and switches the old blocks off. Publish the page afterwards with a real click on the Publish icon.
   3. To undo on the LIVE page: await abjRollback()  then publish. */
(function () {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const ids = () => [...document.querySelectorAll('.record')].map(r => r.getAttribute('recordid'));
  const rec = id => document.getElementById('record' + id);
  const code = id => ((document.querySelector('#record' + id + ' pre code') || {}).textContent || '');
  const isOn = id => rec(id).getAttribute('off') !== 'y';
  const NEW = '(DEV, new standard)';
  const idb = () => new Promise((res, rej) => { const q = indexedDB.open('abj_golive', 1); q.onupgradeneeded = () => q.result.createObjectStore('b'); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  const idbPut = async (k, v) => { const d = await idb(); await new Promise((res, rej) => { const t = d.transaction('b', 'readwrite'); t.objectStore('b').put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); };
  window.abjBackup = async k => { const d = await idb(); return new Promise(res => { const q = d.transaction('b').objectStore('b').get(k); q.onsuccess = () => res(q.result); }); };
  const loaded = async () => { for (let i = 0; i < 40 && !(ids().length && ids().every(id => rec(id).hasAttribute('off'))); i++) await W(500); await W(800); };
  const save = async (id, c) => {
    const r = await tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: window.pageid, recordid: id, onlythisfield: 'code', code: c }, explanation: 'save code' });
    if (JSON.stringify(r).indexOf('OK') < 0) throw 'save failed ' + JSON.stringify(r).slice(0, 80);
    await tp__updateRecord(id); await W(1500);
  };


  // same replacements as ft_upgrade() in build.py: folding footer on phones
  const FTJS = '<script>(function(){var r=document.getElementById("kc");if(!r)return;r.querySelectorAll(".ft .acc>h4").forEach(function(h){if(h.getAttribute("data-acc"))return;h.setAttribute("data-acc","1");h.setAttribute("role","button");h.setAttribute("tabindex","0");h.setAttribute("aria-expanded","false");var t=function(){var o=h.parentNode.classList.toggle("op");h.setAttribute("aria-expanded",o?"true":"false")};h.addEventListener("click",t);h.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();t()}})})})();</' + 'script>';
  window.abjFooterUpgrade = function (html) {
    if (html.includes('class="acc"')) return html;
    for (const [a, b] of [['<div><h4>Rooms</h4>', '<div class="acc"><h4>Rooms</h4>'], ['<div><h4>More</h4>', '<div class="acc"><h4>More</h4>'],
      ['<div><h4>ABJ</h4>', '<div class="acc"><h4>ABJ</h4>'], ['<div class="ft-v"><h4>Visit</h4>', '<div class="ft-v acc"><h4>Visit</h4>'],
      ['<div class="ft-ar" style="padding-bottom:36px">', '<div class="ft-ar acc">']]) {
      if (html.split(a).length !== 2) throw 'footer part not found once: ' + a;
      html = html.replace(a, b);
    }
    if (html.split('<div class="ft-l">').length !== 2) throw 'footer legal row not found';
    return html.replace('<div class="ft-l">', FTJS + '\n <div class="ft-l">');
  };
  // put the current theme (first <style> of out-live/home.html) in place of the block's own copy
  window.abjTheme = async function (html, base) {
    const home = await (await fetch(base + 'out-live/home.html', { cache: 'no-store' })).text();
    const st = home.match(/<style>[\s\S]*?<\/style>/)[0];
    if (!st.includes('folding footer')) throw 'theme source is old';
    const i = html.indexOf('<style>'), j = html.indexOf('</style>', i);
    if (i < 0 || j < 0) throw 'no theme style in block';
    return html.slice(0, i) + st + html.slice(j + 8);
  };

  // SEO fixes (10 Nov 2026), same as build.py: menu photo alt text, logo text not in <b>, menu button label
  const MENU_ALT = { 'kc-run-s.webp': 'Fitted kitchen run with tall larder units', 'abj-wardrobes-t-fitted.webp': 'Fitted wardrobes',
    'abj-bedrooms-t-slopes.webp': 'Fitted bedroom furniture under a sloping ceiling', 'abj-mediawalls-t-minimal.webp': 'Media wall with a floating TV unit',
    'kc-kr-island-s.webp': 'Kitchen island with a stone worktop', 'abj-decors-t-slatted.webp': 'Slatted timber wall panelling',
    'abj-storage-t-pantry.webp': 'Pantry cupboard with open shelving', 'abj-office-t-home.webp': 'Fitted home office',
    'kc-shaker-s.webp': 'Shaker-style cabinetry', 'kc-inframe-s.webp': 'In-frame cabinetry',
    'kc-kr-bar-s.webp': 'Bar wall from the Kings Road kitchen', 'kc-detail-s.webp': 'Cabinet detail from our Peterborough workshop' };
  window.abjSeoFix = function (html) {
    const i = html.indexOf('<div class="mm-r" aria-hidden="true">'), j = i < 0 ? -1 : html.indexOf('</div>', i);
    if (i >= 0 && j > i) {
      const part = html.slice(i, j).replace(/<img src="([^"]+)" alt=""/g, (m, src) => '<img src="' + src + '" alt="' + (MENU_ALT[src.split('/').pop()] || 'ABJ Kitchens & Bedrooms project') + '"');
      html = html.slice(0, i) + part + html.slice(j);
    }
    html = html.split('<b>ABJ Kitchens<span>&amp; Bedrooms</span></b>').join('<span class="lgt">ABJ Kitchens<span>&amp; Bedrooms</span></span>')
      .split('<span class="lgw">ABJ Kitchens<span>').join('<span class="lgt">ABJ Kitchens<span>');
    html = html.split('aria-controls="kc-mm">').join('aria-controls="kc-mm" aria-label="Open menu">').split('aria-label="Open menu" aria-label="Open menu"').join('aria-label="Open menu"');
    return html;
  };
  // the site footer page carries two scripts that new pages still need (lead hand-off to ABJ Factory, conversion de-duplication).
  // Run on the footer page editor (page 346585603): copies them into this browser's storage so they can be added to each page's block.
  window.abjCaptureFooterScripts = async function () {
    await loaded();
    const c = code('5302826903');
    const sc = [...c.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[0]).filter(t => /functions\/v1\/sales|generate_lead/.test(t));
    if (sc.length !== 2) throw new Error('expected 2 footer scripts, found ' + sc.length);
    localStorage.setItem('abj_ft_scripts', sc.join('\n'));
    return 'captured ' + sc.length + ' scripts, ' + sc.join('').length + ' chars';
  };
  const withFooterScripts = html => {
    if (html.includes('functions/v1/sales')) return html;
    const sc = localStorage.getItem('abj_ft_scripts') || '';
    if (!/functions\/v1\/sales/.test(sc) || !/generate_lead/.test(sc)) throw new Error('footer scripts not captured');
    return html + '\n<!-- copied from the site footer (abj-site-footer) so leads still reach ABJ Factory when this page hides the footer -->\n' + sc + '\n';
  };
  window.abjLive = function (html, map) {
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    const rx = new RegExp('(' + keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![A-Za-z0-9_-])', 'g');
    let n = 0;
    html = html.replace(rx, m => { n++; return map[m]; }).split('https://abjkitchensandbedrooms.co.uk//').join('https://abjkitchensandbedrooms.co.uk/');
    const left = [...new Set(html.match(/[\w/.:-]*-dev-[a-z0-9]{4,5}\b/g) || [])];
    return { html, n, left };
  };

  window.abjCapture = async function (devRec) {
    await loaded();
    const c = code(devRec);
    if (!c.includes(NEW)) throw 'record ' + devRec + ' is not a new-design block';
    if (/%%[A-Z0-9]+%%|\{W3F\}/.test(c)) throw 'record still has placeholders';
    localStorage.setItem('abj_golive_code', c);
    localStorage.setItem('abj_golive_from', JSON.stringify({ page: window.pageid, rec: devRec, title: document.title, len: c.length, at: Date.now() }));
    return document.title.replace('Tilda: ', '').slice(0, 45) + ' | captured ' + c.length;
  };

  window.abjGoLive = async function (o) {
    if (/\(private test|DEV/.test(document.title)) throw 'this is a DEV page, not a live page';
    await loaded();
    const map = await (await fetch(o.base + 'linkmap.json', { cache: 'no-store' })).json();
    const from = JSON.parse(localStorage.getItem('abj_golive_from') || 'null');
    let html = localStorage.getItem('abj_golive_code') || '';
    if (!from || !html || Date.now() - from.at > 30 * 60 * 1000) throw 'nothing captured in the last 30 minutes';
    if (o.expect && !from.title.includes(o.expect)) throw 'captured block is from "' + from.title + '", expected ' + o.expect;
    const x = window.abjLive(html, map);
    if (x.left.length) throw 'DEV links left: ' + x.left.join(', ');
    html = window.abjFooterUpgrade(await window.abjTheme(x.html, o.base));
    const before = ids(), live = before.filter(isOn);
    if (!before.length || !live.length) throw 'records not loaded';
    if (before.some(i => code(i).includes(NEW))) throw 'page already has a new-design block';
    // backup: which blocks exist and which were on (codes stay in Tilda untouched)
    const bak = { page: window.pageid, title: document.title, at: new Date().toISOString(), records: before.map(i => ({ id: i, on: isOn(i), type: rec(i).getAttribute('data-record-type') || '', len: code(i).length })) };
    localStorage.setItem('abj_golive_bak_' + window.pageid, JSON.stringify(bak));
    // extra private copy of every old block's code in this browser (IndexedDB on tilda.cc; never sent anywhere)
    await idbPut('p' + window.pageid, { bak, codes: Object.fromEntries(before.map(i => [i, code(i)])) });
    const keep = id => o.keep && o.keep.test(rec(id).getAttribute('data-record-type') || rec(id).getAttribute('recordtype') || rec(id).className);
    const small = live.filter(i => !keep(i) && code(i)).sort((a, b) => code(a).length - code(b).length)[0];
    if (!small) throw 'no HTML block to duplicate';
    await tp__dublicateRecord(small); await W(3000);
    const nid = ids().find(i => !before.includes(i)); if (!nid) throw 'no new record';
    if (code(nid) !== code(small)) throw 'duplicate mismatch';
    await save(nid, html);
    if (!code(nid).includes(NEW)) throw 'new block did not save';
    for (let i = 0; i < 14 && ids()[0] !== nid; i++) tp__upRecord(nid);
    await tp__saveRecordsSort(); await W(1500);
    // old blocks must still hold exactly the code they had (checked while they are still on: Tilda hides the code of switched-off blocks)
    const untouched = live.every(i => code(i).length === bak.records.find(r => r.id === i).len);
    if (!untouched) throw 'an old block changed - stopped before switching anything off';
    for (const id of live) { if (keep(id)) continue; await tp__offRecord(id); await W(700); }
    bak.newRec = nid; localStorage.setItem('abj_golive_bak_' + window.pageid, JSON.stringify(bak));
    localStorage.removeItem('abj_golive_code');
    return { page: document.title.replace('Tilda: ', '').slice(0, 45), newRec: nid, links: x.n, turnedOff: live.filter(i => !keep(i)).length, kept: live.filter(keep), oldCodesUntouched: untouched, first: ids()[0], bak: JSON.stringify(bak.records) };
  };

  window.abjRollback = async function () {
    await loaded();
    const bak = JSON.parse(localStorage.getItem('abj_golive_bak_' + window.pageid) || 'null');
    const nid = (bak && bak.newRec) || ids().find(i => code(i).includes(NEW));
    if (!nid) throw 'no new-design block on this page';
    if (isOn(nid)) { await tp__offRecord(nid); await W(700); }
    const wasOn = bak ? bak.records.filter(r => r.on).map(r => r.id) : ids().filter(i => i !== nid);
    for (const id of wasOn) if (rec(id) && !isOn(id)) { await tp__offRecord(id); await W(700); }
    return 'new block ' + nid + ' off; switched back on: ' + wasOn.join(',') + ' — now publish';
  };

  // a page that already went live: bring ONLY its new-design block up to the current theme and folding footer
  window.abjRefresh = async function (o) {
    if (/\(private test|DEV/.test(document.title)) throw 'this is a DEV page';
    await loaded();
    const nid = ids().find(i => code(i).includes(NEW) && isOn(i)); if (!nid) throw new Error('no live new-design block');
    const c0 = code(nid);
    let c = window.abjSeoFix(window.abjFooterUpgrade(await window.abjTheme(c0, o.base)));
    if (o.footerScripts) c = withFooterScripts(c);
    if (/-dev-[a-z0-9]{4,5}\b/.test(c)) throw 'DEV link found';
    if (c === c0) return 'already up to date';
    await save(nid, c);
    return 'refreshed block ' + nid + ' (' + c0.length + ' -> ' + code(nid).length + ')';
  };
})();
