/* Social share images (12 Nov 2026): Screaming Frog and the health check flag og:image / twitter:image files over 100 kB.
   Runs on the Tilda projects page. For each heavy share image it makes a 1200x630 JPG (centre crop, the size Facebook,
   WhatsApp and X ask for) under 97 kB in the browser, uploads it with Tilda's own uploader and returns the new address.
   abjOgSet(map) then puts the new address in Page settings > Facebook and social networks (fb_img) for each page.
   The page's own thumbnail image is not touched. Undo: clear fb_img in Page settings and republish. */
(function () {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const MAXB = 97 * 1024;
  async function makeJpg(src) {
    const bm = await createImageBitmap(await (await fetch(src, { mode: 'cors', cache: 'no-store' })).blob());
    const bw = bm.width, bh = bm.height, tw = 1200, th = 630, r = Math.max(tw / bm.width, th / bm.height);
    const sw = tw / r, sh = th / r, sx = (bm.width - sw) / 2, sy = Math.max(0, (bm.height - sh) * 0.45);
    const c = document.createElement('canvas'); c.width = tw; c.height = th;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.fillStyle = '#fff'; g.fillRect(0, 0, tw, th);
    g.drawImage(bm, sx, sy, sw, sh, 0, 0, tw, th); bm.close();
    let blob = null, q;
    for (q of [0.84, 0.8, 0.76, 0.72, 0.68, 0.64, 0.6, 0.56]) { blob = await new Promise(res => c.toBlob(res, 'image/jpeg', q)); if (blob.size <= MAXB) break; }
    return { blob, q, size: blob.size, from: [bw, bh] };
  }
  async function upload(blob, name) {
    const id = 'abjog' + Math.floor(Math.random() * 1e9); const inp = document.createElement('input'); inp.type = 'hidden'; inp.id = id; document.body.appendChild(inp);
    let url = null, err = null; window.TUWidget.init(inp).done(o => { url = o && o.tuInfo && o.tuInfo.cdnUrl; }).fail(e => { err = String(e); });
    window['tu_' + id].addFile(new File([blob], name, { type: 'image/jpeg' }));
    for (let i = 0; i < 120 && !url && !err; i++) await W(500);
    inp.remove(); if (!url) throw new Error('upload failed ' + (err || 'timeout'));
    return url.replace('static.tildacdn.one', 'static.tildacdn.net').replace('static.tildacdn.com', 'static.tildacdn.net');
  }
  window.abjOgMake = async function (srcs) {
    const out = window.__og2 = window.__og2 || {};
    for (const s of srcs) {
      if (out[s] && out[s].url) continue;
      try {
        const j = await makeJpg(s); const base = s.split('/').pop().replace(/\.[a-z]+$/i, '').slice(0, 12).replace(/[^a-z0-9_-]/gi, '');
        const url = await upload(j.blob, 'og-' + base + '.jpg');
        const chk = await (await fetch(url, { cache: 'no-store' })).blob();
        out[s] = { url, size: chk.size, q: j.q, from: j.from };
      } catch (e) { out[s] = { err: String(e) }; }
    }
    return out;
  };
  window.abjOgSet = async function (pairs) { /* pairs: [[pageid, url], ...] */
    const log = window.__ogset = window.__ogset || [];
    for (const [pid, url] of pairs) {
      try {
        td__showform__EditPageSettings(pid);
        let f = null; for (let i = 0; i < 40; i++) { await W(300); f = document.querySelector('[name="fb_img"]'); if (f && document.querySelector('.js-ps-popup-submit')) break; }
        await W(800); f = document.querySelector('[name="fb_img"]');
        const before = f.value; f.value = url;
        localStorage.setItem('abj_fbimg_before_' + pid, before || '(empty)');
        document.querySelector('.js-ps-popup-submit').click();
        for (let i = 0; i < 40 && document.querySelector('.js-ps-popup-submit'); i++) await W(300);
        log.push(pid + ' ok (was ' + (before || 'empty') + ')');
      } catch (e) { log.push(pid + ' ERR ' + e); }
      await W(1200);
    }
    return log;
  };
})();
