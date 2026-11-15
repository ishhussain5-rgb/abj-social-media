/* abjFootLinks(jobs, live): add "Media wall project" and "Budget planner" to the footer ABJ column on each page (add-only).
   Run from any Tilda editor tab; each page's editor loads in a hidden iframe; every page is saved and published on its own. */
window.__fl = [];
window.abjFootLinks = async function (pids, live) {
  const A = live ? [['<li><a href="/case-study-kings-road-kitchen-peterborough">Case study</a></li>', '<li><a href="/project-media-walls-park-road-peterborough">Media wall project</a></li>'],
                    ['<li><a href="/flexible-finance">Finance</a></li>', '<li><a href="/budget-planner">Budget planner</a></li>']]
                 : [['<li><a href="/case-study-kings-road-kitchen-peterborough-dev-c3k8">Case study</a></li>', '<li><a href="/project-media-walls-park-road-peterborough-dev-p4r7">Media wall project</a></li>'],
                    ['<li><a href="/flexible-finance-dev-f3n7">Finance</a></li>', '<li><a href="/budget-planner-dev-p6k3">Budget planner</a></li>']];
  const W = ms => new Promise(r => setTimeout(r, ms));
  for (const pid of pids) {
    let f; const out = [];
    try {
      f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:800px';
      f.src = '/page/?pageid=' + pid + '&projectid=6121364'; document.body.appendChild(f);
      let ok = false;
      for (let i = 0; i < 80 && !ok; i++) { await W(500); try { ok = !!f.contentDocument.querySelector('.record pre code'); } catch (e) {} }
      if (!ok) throw 'no records';
      await W(1500);
      const w = f.contentWindow, d = f.contentDocument, title = d.title.replace('Tilda: ', '').slice(0, 34);
      if (live && /DEV|private test/.test(d.title)) throw 'DEV page in live list';
      if (!live && !/DEV|private test/.test(d.title)) throw 'live page in DEV list';
      let saved = 0;
      for (const rec of d.querySelectorAll('.record')) {
        if (rec.getAttribute('off') === 'y') continue;
        const el = rec.querySelector('pre code'); if (!el) continue;
        const old = el.textContent; if (!old.includes('class="ft"')) continue;
        let c = old, add = 0;
        for (const [anchor, li] of A) {
          if (c.includes(li)) { out.push('has'); continue; }
          const n = c.split(anchor).length - 1;
          if (n !== 1) { out.push('anchor x' + n); continue; }
          c = c.replace(anchor, anchor + li); add += li.length;
        }
        if (c === old) continue;
        if (c.length !== old.length + add) throw 'integrity';
        await new Promise((res, rej) => { const q = indexedDB.open('abj_svc_bak'); q.onupgradeneeded = () => { q.result.createObjectStore('b'); };
          q.onsuccess = () => { try { const db = q.result, st = db.transaction(db.objectStoreNames[0], 'readwrite').objectStore(db.objectStoreNames[0]);
            const p = st.put(old, (live ? 'live-' : 'dev-') + pid + '-' + rec.getAttribute('recordid') + '-before-footlinks-20261115'); p.onsuccess = () => res(); p.onerror = () => rej(p.error); } catch (e) { rej(e); } };
          q.onerror = () => rej(q.error); });
        const r = await w.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(pid), recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: c } });
        if (JSON.stringify(r) !== '"OK"') throw 'save ' + JSON.stringify(r).slice(0, 60);
        saved++; out.push('+' + add);
      }
      if (saved) { const p = await w.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(pid), csrf: w.getCSRF(), returnjson: 'yes' } });
        if (!JSON.stringify(p).includes('publishonepage')) throw 'publish ' + JSON.stringify(p).slice(0, 80); out.push('pub'); }
      window.__fl.push(pid + ' ' + title + ': ' + (out.join(',') || 'no footer block'));
    } catch (e) { window.__fl.push(pid + ': ERR ' + e + ' ' + out.join(',')); } finally { if (f) f.remove(); }
  }
  window.__fl.push('DONE');
};
