/* Phone-sized copies of Tilda-hosted images flagged by the 11 Nov 2026 scan (the six town hero photos for Stamford, Bourne,
   Spalding, Grantham, Oakham and Oundle are left as they are, Ish's choice). Desktop keeps the originals (srcset / <picture>).
   abjTI.build() runs in the Tilda editor: makes each copy in the browser, uploads it with Tilda's own uploader,
   stores the map in localStorage 'abjTI'. abjTI.apply(code) rewrites a block's code from that map. */
(function () {
  const L = `T|tild6566-3663-4431-a234-373934646231~BespokeFittedWardrob.jpg T|tild3634-6132-4734-b062-663237613434~BespokeFittedWardrob.jpg T|tild3762-6563-4761-b035-386364616130~abj-med4.jpg T|tild6234-6438-4430-b736-623766633535~UnderStair13.jpg T|tild3666-6166-4661-b231-343937373935~BespokeMediaWalls15.jpg T|tild3735-6338-4530-b333-303330336334~UnderStair21.jpg T|tild6663-3266-4030-b035-396639363637~Cabinet52.jpg T|tild3238-6432-4232-a231-373666396661~abj-kitchen-navy-win.jpg T|tild3162-3466-4966-a464-393266623636~BespokeMediaWalls45.jpg T|tild6639-3330-4666-b839-323935633032~BespokeKitchens473.jpg S|tild6432-3835-4666-b064-656263366263/ABJ_Worktop_3.webp S|tild6535-6664-4661-b136-336563363364/worktop_og.jpg S|tila3464-6332-4961-a232-326331393437/abj-stamford-2.webp S|tila6139-6538-4266-b035-643637353031/abj-stamford-3.webp S|tila3866-6430-4363-b861-393733303839/abj-deeping-1.webp S|tila6631-3636-4863-b932-343739613232/abj-deeping-3.webp S|tila6437-6664-4430-b066-653132363565/abj-oundle-2.webp S|tila3062-3063-4631-a131-363932383265/abj-oundle-3.webp S|tila3932-6134-4739-b330-633630663935/abj-huntingdon-1.webp S|tila3434-3235-4163-b837-336564643632/abj-huntingdon-2.webp S|tila3130-3835-4938-a563-666137316662/abj-huntingdon-3.webp S|tila3361-6162-4533-b130-653831393266/abj-ely-1.webp S|tila6166-6230-4735-b362-336631396361/abj-ely-2.webp S|tila6432-3938-4062-a438-313334643030/abj-ely-3.webp S|tila6137-3439-4830-b232-623434393338/abj-bourne-2.webp S|tila3933-3937-4634-b034-376132333764/abj-bourne-3.webp S|tila3261-3337-4436-a265-663163643231/abj-spalding-2.webp S|tila3431-3335-4164-b063-333139646436/abj-spalding-3.webp S|tila3965-3435-4437-b166-643532343662/abj-stives-1.webp S|tila6661-3961-4731-b866-363731306433/abj-stives-2.webp S|tila3938-6162-4963-a637-656537326236/abj-stives-3.webp S|tila3932-6432-4162-b638-623135393239/abj-wisbech-1.webp S|tila6665-3336-4831-a266-313661623534/abj-wisbech-2.webp S|tila6437-6237-4365-b366-306661643663/abj-wisbech-3.webp S|tila3463-3865-4466-b061-623534666632/abj-cambridge-1.webp S|tila3666-6162-4064-b164-306364336363/abj-cambridge-2.webp S|tila3061-3137-4034-b361-636335383033/abj-cambridge-3.webp S|tila6464-3131-4164-a466-363561383935/abj-grantham-2.webp S|tila3566-3438-4063-b764-633937363465/abj-grantham-3.webp S|tila3761-3163-4631-b262-356335393163/abj-oakham-2.webp S|tila3630-3162-4338-b430-333439663634/abj-oakham-3.webp S|tild6664-3336-4531-b966-313535303131/BespokeFittedWardrob.jpg S|tild3132-3061-4665-b162-666361386636/UnderStair22.jpg S|tild6133-6233-4063-a639-663961623837/abj-bed27.jpg S|tild3666-3062-4630-b662-303130386639/abj-war37.jpg S|tild3431-3065-4631-b035-386230616331/BespokeFittedWardrob.jpg S|tild6566-3663-4431-a234-373934646231/BespokeFittedWardrob.jpg S|tild6234-6438-4430-b736-623766633535/UnderStair13.jpg S|tild3735-6338-4530-b333-303330336334/UnderStair21.jpg S|tild3431-3662-4062-b833-396339626633/abj-war92.jpg S|tild3634-6132-4734-b062-663237613434/BespokeFittedWardrob.jpg S|tild6365-3032-4562-a630-376262383035/BespokeFittedWardrob.jpg S|tild3239-3135-4239-a532-636633346339/abj-cab49.jpg`.split(' ');
  const items = L.map(s => {
    const [k, rest] = s.split('|');
    if (k === 'T') { const [id, nm] = rest.split('~'); return { kind: 'thb', key: 'https://thb.tildacdn.com/' + id + '/-/resize/720x/-/format/webp/' + nm, src: 'https://static.tildacdn.net/' + id + '/' + nm, nm }; }
    const nm = rest.split('/')[1]; const key = 'https://static.tildacdn.net/' + rest;
    const kind = /^abj-[a-z]+-1\.webp$/.test(nm) ? 'hero' : /^abj-[a-z]+-[23]\.webp$/.test(nm) ? 'lmg' : 'card';
    return { kind, key, src: key, nm };
  });
  const MAX = 100000;
  const W = ms => new Promise(r => setTimeout(r, ms));
  const load = () => { try { return JSON.parse(localStorage.getItem('abjTI') || '{}'); } catch (e) { return {}; } };
  const save = m => { try { localStorage.setItem('abjTI', JSON.stringify(m)); } catch (e) {} };
  async function upload(blob, name) {
    const id = 'abjtu' + Math.floor(Math.random() * 1e9); const inp = document.createElement('input'); inp.type = 'hidden'; inp.id = id; document.body.appendChild(inp);
    let url = null, err = null; TUWidget.init(inp).done(o => { url = o && o.tuInfo && o.tuInfo.cdnUrl; }).fail(e => { err = String(e); });
    window['tu_' + id].addFile(new File([blob], name, { type: 'image/webp' }));
    for (let i = 0; i < 80 && !url && !err; i++) await W(500);
    inp.remove(); if (!url) throw new Error('upload failed ' + name + ' ' + err); return url;
  }
  async function make(it, scale) {
    const bm = await createImageBitmap(await (await fetch(it.src, { mode: 'cors' })).blob());
    let sx = 0, sy = 0, sw = bm.width, sh = bm.height, w, h;
    if (it.kind === 'hero') { sh = Math.min(bm.height, 1260); sw = Math.min(bm.width, Math.round(sh * 480 / 847)); sx = Math.round((bm.width - sw) / 2); sy = Math.round((bm.height - sh) / 2); w = Math.round(sw * scale); h = Math.round(sh * scale); }
    else { const tw = it.kind === 'thb' ? 720 : it.kind === 'lmg' ? 860 : 1100; w = Math.round(Math.min(bm.width, tw) * scale); h = Math.round(bm.height * w / bm.width); }
    const c = new OffscreenCanvas(w, h); c.getContext('2d').drawImage(bm, sx, sy, sw, sh, 0, 0, w, h);
    return { blob: await c.convertToBlob({ type: 'image/webp', quality: 0.92 }), w, h, ow: bm.width, oh: bm.height };
  }
  window.abjTI = {
    items, load,
    async build(log) {
      const m = load();
      for (const it of items) {
        if (m[it.key]) continue;
        let scale = 1, r = null;
        for (let t = 0; t < 4; t++) {
          const k = await make(it, scale);
          const base = it.nm.replace(/\.(webp|jpe?g|png)$/i, '');
          const url = await upload(k.blob, base + (it.kind === 'hero' ? '-phone' : '-m') + k.w + '.webp');
          const sz = (await (await fetch(url, { mode: 'cors', cache: 'no-store' })).blob()).size;
          r = { url, w: k.w, h: k.h, ow: k.ow, oh: k.oh, kb: Math.round(sz / 1024), kind: it.kind };
          if (sz <= MAX) break; scale *= 0.85;
        }
        m[it.key] = r; save(m); if (log) log(it.nm + ' ' + r.w + 'w ' + r.kb + 'k');
      }
      return Object.keys(m).length;
    },
    apply(code) {
      const m = load(); let c = code, n = 0;
      for (const it of items) {
        const r = m[it.key]; if (!r || r.kb > 100 || c.indexOf(it.key) < 0) continue;
        if (it.kind === 'thb') { const k = c.split(it.key).length - 1; c = c.split(it.key).join(r.url); n += k; continue; }
        const esc = it.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp('<img\\b[^>]*\\bsrc="' + esc + '"[^>]*>', 'g');
        c = c.replace(rx, tag => {
          if (/\bsrcset=/.test(tag)) return tag;
          n++;
          if (it.kind === 'hero') return '<picture style="display:contents"><source media="(min-width:481px)" srcset="' + it.key + '">' + tag.replace('src="' + it.key + '"', 'src="' + r.url + '"') + '</picture>';
          const sizes = it.kind === 'lmg' ? '(max-width:760px) 88vw, 708px' : '(max-width:760px) 92vw, 560px';
          const set = r.w < r.ow ? ' srcset="' + r.url + ' ' + r.w + 'w, ' + it.key + ' ' + r.ow + 'w" sizes="' + sizes + '"' : '';
          return tag.replace('src="' + it.key + '"', 'src="' + r.url + '"' + set);
        });
      }
      abjTI.last = n; return c;
    }
  };
})();
