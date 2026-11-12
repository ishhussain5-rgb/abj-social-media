/* Image optimiser for the live pages (12 Nov 2026, Ish: health score back to the high 90s + Screaming Frog clean-up).
   Runs on the Tilda projects page (tilda.cc/projects/?projectid=6121364). Each page opens in a hidden editor iframe; for every
   switched-on block that contains <img> tags it:
   1. swaps static.tildacdn.one for static.tildacdn.net (same files; .one is blocked on some networks, which made photos fail),
   2. replaces any photo over 100 kB, or JPG/PNG over 50 kB, with a WebP copy under 100 kB made in the browser and uploaded with
      Tilda's own uploader (copies are reused across pages; map in IndexedDB abj_ti 'map2'),
   3. adds a 480px copy to srcset for photos that phones show as small cards (list from the 12 Nov health scan),
   4. adds the real width/height (+ data-wh and the :where() height:auto rule) to <img> tags that have none.
   Old block code: IndexedDB abj_svc_bak '<pageid>-before-imgfix-20261112'. Each page is saved and published on its own.
   Insert/replace only: no blocks removed, no text changed. */
(function () {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const MAX = 100 * 1024 - 2048;
  const OVER = {
    '/': { '74e75bd-abj-kitchens-t-handleless.webp': 163, 'abj-wardrobes-t-fitted.webp': 163, '23ce85c-abj-home-bedroom-panel.webp': 163, '74e75bd-abj-mediawalls-t-minimal.webp': 163, 'abj-handleless-islan.webp': 161 },
    '/bespoke-decors-peterborough': { '74e75bd-abj-decors-t-mediadetail.webp': 161, 'Decor_Style_3.webp': 161 },
    '/media-walls': { '74e75bd-abj-decors-t-mediadetail.webp': 161, '74e75bd-abj-decors-t-slatted.webp': 161 },
    '/bespoke-office-renovations': { 'abj-of-3d-glass.webp': 161, '74e75bd-abj-office-t-home.webp': 161 },
    '/bespoke-wardrobes': { '1230508-abj-w-walkin-drawers.webp': 161, 'abj-w-sliding-study.webp': 161 },
    '/bespoke-kitchens': { 'kc-kr-detail-s.webp': 161 },
    '/about-abj': { 'kc-kr-detail-s.webp': 161 },
    '/bespoke-bedrooms-abj': { '1230508-abj-b-fluted-niche.webp': 161, '1230508-abj-b-slatted-shelves.webp': 161 },
    '/bespoke-hallways': { 'abj-hl-slat-detail.webp': 161, 'abj-hl-us-pullout.webp': 161 },
    '/bespoke-storage-solutions': { 'abj-st-us-dark.webp': 161, '74e75bd-abj-storage-t-pantry.webp': 161 },
    '/luxury-worktops-abj': { 'ABJ_Worktop_4.webp': 161 },
    '/upholstery': { 'bed6.jpeg': 161 },
    '/bathroom-cabinetry': { 'abj-ba-stone-basin.webp': 161, 'abj-ba-3d-shower.webp': 161 },
    '/case-study-kings-road-kitchen-peterborough': { 'abj-open-plan-kitche.webp': 234 },
    '/fitted-wardrobes-sloping-ceilings': { '7de4888-ai-slope-oak-lit.webp': 161 },
    '/under-stairs-storage': { 'abj-hl-us-gloss.webp': 161 },
    '/sliding-wardrobes': { 'abj-wardrobes-t-doors.webp': 161, 'BespokeFittedWardrob.webp': 161 },
    '/walk-in-wardrobes': { '74e75bd-abj-wardrobes-t-interiors.webp': 161 },
    '/alcove-units': { 'c9b6a43-abj-dc-slat-shelves.webp': 161, 'abj-st-colour-cupboards.webp': 161 },
    '/kitchen-cabinets-peterborough': { 'abj-kitchen-grey-glo.jpg': 161, 'abj-worktops-t-laminate.webp': 161 },
    '/utility-boot-rooms-peterborough': { 'abj-st-us-shoes.webp': 161 },
    '/kitchen-showroom-peterborough': { 'ABJ_Worktop_3.webp': 305 },
    '/bespoke-vs-off-the-shelf-kitchens': { 'Homepage_Main_Landin.webp': 305, 'abj-kitchen-white-sh.jpg': 161 },
    '/shaker-kitchens-peterborough': { 'BespokeMediaWalls15.jpg': 161 },
    '/handleless-kitchens-peterborough': { 'abj-kitchen-marble-i.jpg': 161 }
  };
  const idb = (mode, fn) => new Promise((res, rej) => { const o = indexedDB.open('abj_ti', 1); o.onupgradeneeded = () => o.result.createObjectStore('kv'); o.onerror = () => rej(o.error);
    o.onsuccess = () => { const t = o.result.transaction('kv', mode); const q = fn(t.objectStore('kv')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }; });
  const bak = (key, val) => new Promise((res, rej) => { const o = indexedDB.open('abj_svc_bak'); o.onupgradeneeded = () => { if (!o.result.objectStoreNames.contains('b')) o.result.createObjectStore('b'); };
    o.onsuccess = () => { const t = o.result.transaction('b', 'readwrite'); t.objectStore('b').put(val, key); t.oncomplete = res; t.onerror = rej; }; o.onerror = rej; });
  let MAP = null;
  const loadMap = async () => { if (MAP) return MAP; const v = await idb('readonly', s => s.get('map2')); MAP = v ? JSON.parse(v) : {}; return MAP; };
  const saveMap = () => idb('readwrite', s => s.put(JSON.stringify(MAP), 'map2'));
  const INFO = {};
  async function info(url) {
    if (INFO[url]) return INFO[url];
    const r = await fetch(url, { mode: 'cors', cache: 'no-store' }); if (!r.ok) throw new Error(r.status + ' ' + url);
    const blob = await r.blob(); const bm = await createImageBitmap(blob); const o = { size: blob.size, type: blob.type, w: bm.width, h: bm.height }; bm.close();
    return (INFO[url] = o);
  }
  const bitmap = async url => createImageBitmap(await (await fetch(url, { mode: 'cors', cache: 'no-store' })).blob());
  async function upload(win, blob, name) {
    const id = 'abjtu' + Math.floor(Math.random() * 1e9); const doc = win.document; const inp = doc.createElement('input'); inp.type = 'hidden'; inp.id = id; doc.body.appendChild(inp);
    let url = null, err = null; win.TUWidget.init(inp).done(o => { url = o && o.tuInfo && o.tuInfo.cdnUrl; }).fail(e => { err = String(e); });
    win['tu_' + id].addFile(new win.File([blob], name, { type: 'image/webp' }));
    for (let i = 0; i < 120 && !url && !err; i++) await W(500);
    inp.remove(); if (!url) throw new Error('upload failed ' + name + ' ' + err);
    return url.replace('static.tildacdn.one', 'static.tildacdn.net').replace('static.tildacdn.com', 'static.tildacdn.net');
  }
  async function encode(bm, w, q) { const h = Math.round(bm.height * w / bm.width); const c = new OffscreenCanvas(w, h); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(bm, 0, 0, w, h); return { blob: await c.convertToBlob({ type: 'image/webp', quality: q }), w, h }; }
  // a WebP copy no wider than maxW and under 100 kB: lower the quality first (down to 0.6), then the width
  async function copy(win, url, maxW, tag) {
    await loadMap(); const key = url + '|' + maxW; if (MAP[key]) return MAP[key];
    const bm = await bitmap(url); let w = Math.min(bm.width, maxW), q = 0.86, k;
    for (let t = 0; t < 14; t++) { k = await encode(bm, w, q); if (k.blob.size <= MAX) break; if (q > 0.62) q -= 0.08; else w = Math.round(w * 0.88); }
    bm.close();
    const base = url.split('/').pop().replace(/[?#].*$/, '').replace(/\.(webp|jpe?g|png)$/i, '');
    const up = await upload(win, k.blob, base + '-' + tag + k.w + '.webp');
    const chk = await fetch(up, { mode: 'cors', cache: 'no-store' }); const sz = (await chk.blob()).size;
    if (!chk.ok || sz > 102400) throw new Error('copy check failed ' + up + ' ' + sz);
    MAP[key] = { url: up, w: k.w, h: k.h, kb: Math.round(sz / 1024), q: +q.toFixed(2) }; await saveMap(); return MAP[key];
  }
  const attr = (tag, a) => { const m = tag.match(new RegExp('\\s' + a + '="([^"]*)"')); return m ? m[1] : null; };
  const setAttr = (tag, a, v) => new RegExp('\\s' + a + '="[^"]*"').test(tag) ? tag.replace(new RegExp('(\\s' + a + '=")[^"]*(")'), '$1' + v + '$2') : tag.replace(/^<img\b/, '<img ' + a + '="' + v + '"');
  const skip = u => !u || /^data:/.test(u) || /logo|roundel|favicon/i.test(u);

  async function fixBlock(win, code, path, log) {
    let c = code.split('static.tildacdn.one').join('static.tildacdn.net');
    const one = code !== c ? 1 : 0;
    const tags = [...new Set(c.match(/<img\b[^>]*>/g) || [])];
    const over = OVER[path] || {};
    const out = { one, heavy: 0, small: 0, dims: 0, err: [] };
    // 1. heavy originals (whole block, so <picture><source srcset> and repeats are covered too)
    const urls = new Set(); tags.forEach(t => { const s = attr(t, 'src'); if (!skip(s)) urls.add(s); (attr(t, 'srcset') || '').split(',').forEach(p => { const u = p.trim().split(/\s+/)[0]; if (!skip(u) && /^https?:/.test(u)) urls.add(u); }); });
    for (const m of c.matchAll(/<source\b[^>]*srcset="([^"]+)"/g)) m[1].split(',').forEach(p => { const u = p.trim().split(/\s+/)[0]; if (!skip(u) && /^https?:/.test(u)) urls.add(u); });
    for (const u of urls) {
      try {
        const I = await info(u);
        const heavy = I.size > 102400 || (/jpe?g|png/i.test(I.type) && I.size > 51200);
        if (!heavy) continue;
        const k = await copy(win, u, 1600, 'w');
        c = c.split(u).join(k.url).replace(new RegExp(k.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\d+w', 'g'), k.url + ' ' + k.w + 'w');
        INFO[k.url] = { size: k.kb * 1024, type: 'image/webp', w: k.w, h: k.h };
        out.heavy++; if (log) log(path + ' heavy ' + u.split('/').pop() + ' ' + Math.round(I.size / 1024) + 'k -> ' + k.kb + 'k ' + k.w + 'w q' + k.q);
      } catch (e) { out.err.push(String(e).slice(0, 120)); }
    }
    // 2 + 3. per tag: small card copy, then width/height
    const tags2 = [...new Set(c.match(/<img\b[^>]*>/g) || [])];
    for (const t of tags2) {
      let n = t; const src = attr(t, 'src'); if (skip(src)) continue;
      try {
        const name = Object.keys(over).find(f => src.split('/').pop().split('?')[0] === f || src.includes('/' + f.replace(/\.(webp|jpe?g|png)$/i, '')));
        if (name) {
          const ss = attr(n, 'srcset') || '';
          if (!/ (4\d\d|5\d\d)w/.test(ss)) {
            const orig = Object.keys(MAP || {}).find(k => MAP[k].url === src); const from = orig ? orig.split('|')[0] : src;
            const s = await copy(win, from, 480, 's');
            const I = await info(src);
            const vw = Math.min(100, Math.ceil(over[name] / 390 * 100) + 4);
            n = setAttr(n, 'srcset', s.url + ' ' + s.w + 'w, ' + (ss ? ss : src + ' ' + I.w + 'w'));
            if (!attr(n, 'sizes')) n = setAttr(n, 'sizes', '(max-width:760px) ' + vw + 'vw, 600px');
            out.small++;
          }
        }
        if (!/\swidth="/.test(n)) {
          const I = await info(src);
          n = n.replace(/^<img\b/, '<img width="' + I.w + '" height="' + I.h + '" data-wh'); out.dims++;
        }
      } catch (e) { out.err.push(String(e).slice(0, 120)); }
      if (n !== t) c = c.split(t).join(n);
    }
    if (c.includes(' data-wh') && !c.includes(':where(#kc img[data-wh])') && c.includes('#kc') && c.includes('</style>'))
      c = c.replace('</style>', ':where(#kc img[data-wh]){height:auto}</style>');
    return { code: c, out };
  }

  async function openPage(pageid) {
    const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1400px;height:900px';
    f.src = '/page/?pageid=' + pageid + '&projectid=6121364'; document.body.appendChild(f);
    for (let i = 0; i < 80; i++) { await W(500); try { const d = f.contentDocument; if (d && d.querySelector('.record pre code') && f.contentWindow.tp__fetch && f.contentWindow.TUWidget) break; } catch (e) {} }
    await W(1500); return f;
  }

  window.abjImgFix = async function (pages, opts) {
    opts = opts || {}; window.__if = window.__if || []; const L = s => { window.__if.push(s); };
    for (const [pageid, path] of pages) {
      let f;
      try {
        f = await openPage(pageid); const win = f.contentWindow, d = f.contentDocument;
        let saved = 0; const res = [];
        for (const rec of d.querySelectorAll('.record')) {
          if (rec.getAttribute('off') === 'y') continue;
          const el = rec.querySelector('pre code'); const code = el ? el.textContent : '';
          if (!/<img\b/.test(code) && !code.includes('static.tildacdn.one')) continue;
          const { code: n, out } = await fixBlock(win, code, path, L);
          res.push(JSON.stringify(out));
          if (n === code || opts.dry) continue;
          await bak(pageid + '-' + rec.getAttribute('recordid') + '-before-imgfix-20261112', code);
          const s = await win.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid, recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: n, csrf: win.getCSRF() }, explanation: 'save', silent: true });
          if (String(s).trim() !== 'OK') throw new Error('save failed ' + rec.getAttribute('recordid'));
          saved++;
        }
        let pub = '';
        if (saved && !opts.dry) { const p = JSON.parse(await win.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid, csrf: win.getCSRF(), returnjson: 'yes' }, explanation: 'page publishing', silent: true })); pub = p.pageid == pageid ? 'published' : 'PUBLISH?'; }
        L(pageid + ' ' + path + ' blocks:' + saved + ' ' + pub + ' ' + res.join(' '));
      } catch (e) { L(pageid + ' ' + path + ' ERROR ' + String(e).slice(0, 160)); }
      if (f) f.remove();
    }
    window.__ifDone = true; return window.__if.length;
  };
})();
