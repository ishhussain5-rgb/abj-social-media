/* Run in the Tilda editor tab (tilda.cc/page/?pageid=...). Needs replace_rules.js loaded (window.ABJ_RULES, abjApplyRules).
   await RUNX(ids, {sha, mobile:true, publish:true, dry:false})
   For each page: loads its editor in a hidden iframe, applies ABJ_RULES to every switched-on HTML block
   (the ABJ MOBILE layer is masked out of the rules), optionally swaps the layer for mobile.html@sha,
   saves only the blocks that changed and publishes that one page. Results in window.RESX. */
window.RESX = window.RESX || [];
window.RUNX = async function (ids, o) {
  o = o || {};
  let layer = null;
  if (o.mobile) {
    const t = await (await fetch('https://cdn.jsdelivr.net/gh/ishhussain5-rgb/abj-social-media@' + o.sha + '/web/concept/mobile/mobile.html')).text();
    if (!t.startsWith('<!-- ABJ MOBILE') || !t.trim().endsWith('<!-- /ABJ MOBILE -->')) throw new Error('bad layer');
    layer = t;
  }
  for (const id of ids) {
    let f;
    try {
      f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:0;top:0;width:1200px;height:800px;opacity:0;pointer-events:none;z-index:-1';
      f.src = '/page/?pageid=' + id + '&projectid=6121364'; document.body.appendChild(f);
      await new Promise((r, j) => { f.onload = r; setTimeout(() => j(new Error('load timeout')), 60000); });
      const w = f.contentWindow; let ok = false;
      for (let i = 0; i < 60; i++) { if (w.document.querySelector('.record pre code') && w.tp__fetch && String(w.pageid) === String(id)) { ok = true; break; } await new Promise(r => setTimeout(r, 500)); }
      if (!ok) throw new Error('editor not ready');
      await new Promise(r => setTimeout(r, 1200));
      const recs = [...w.document.querySelectorAll('.record')].filter(r => r.getAttribute('off') !== 'y')
        .map(r => ({ id: r.getAttribute('recordid'), c: (r.querySelector('pre code') || {}).textContent || '' })).filter(x => x.c);
      const kc = recs.filter(x => x.c.includes('id="kc"')).sort((a, b) => b.c.length - a.c.length)[0];
      const log = []; let saved = 0; const hitsAll = {};
      for (const rec of recs) {
        let { code, hits } = abjApplyRules(rec.c, ABJ_RULES);
        Object.entries(hits).forEach(([k, v]) => hitsAll[k] = (hitsAll[k] || 0) + v);
        if (layer && kc && rec.id === kc.id) {
          code = code.replace(/\n?<!-- ABJ MOBILE \(phone layer[\s\S]*?<!-- \/ABJ MOBILE -->\n?/g, '');
          code = code.replace(/\s*$/, '') + '\n' + layer; log.push('layer');
        }
        if (code === rec.c) continue;
        if (code.length < rec.c.length * 0.9) throw new Error('shrunk ' + rec.id);
        if (!o.dry) {
          const r = await w.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(id), recordid: rec.id, onlythisfield: 'code', code } });
          if (JSON.stringify(r).indexOf('OK') < 0) throw new Error('save ' + rec.id + ' ' + JSON.stringify(r).slice(0, 60));
        }
        saved++;
      }
      let p = '';
      if (saved && !o.dry && o.publish !== false) {
        const q = await w.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(id), csrf: w.getCSRF(), returnjson: 'yes' } });
        p = JSON.stringify(q).includes('publishonepage') ? 'pub' : 'PUBFAIL';
      }
      RESX.push({ id, saved, hits: hitsAll, log: log.join('+'), p });
    } catch (e) { RESX.push({ id, err: String(e.message || e).slice(0, 120) }); }
    finally { if (f) f.remove(); await new Promise(r => setTimeout(r, 1000)); }
  }
  RESX.push({ done: ids.length });
};
