/* abjHeroSet(jobs): six town heroes (16 Nov 2026). The desktop <source> pointed at one lighter copy (e.g. 1239 px wide), so on
   1440-1920 px screens the photo was stretched. Give the browser the full-size original as well:
   srcset="<copy> <w>w, <original> 1680w" sizes="100vw". Nothing else in the block changes; one save + publish per page.
   jobs = [[pageid, originalUrl], ...]. Progress in window.__hs. Backup in IndexedDB abj_svc_bak, key live-<pid>-<rec>-before-herosrcset-20261116. */
window.__hs = [];
window.abjHeroSet = async function (jobs) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const bak = (key, val) => new Promise((res, rej) => { const q = indexedDB.open('abj_svc_bak');
    q.onsuccess = () => { const db = q.result, st = db.transaction(db.objectStoreNames[0], 'readwrite').objectStore(db.objectStoreNames[0]);
      const p = st.put(val, key); p.onsuccess = () => res(); p.onerror = () => rej(p.error); }; q.onerror = () => rej(q.error); });
  for (const [pid, orig] of jobs) {
    let f;
    try {
      f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:800px';
      f.src = '/page/?pageid=' + pid + '&projectid=6121364'; document.body.appendChild(f);
      let ok = false;
      for (let i = 0; i < 80 && !ok; i++) { await W(500); try { ok = !!f.contentDocument.querySelector('.record pre code'); } catch (e) {} }
      if (!ok) throw 'no records'; await W(1500);
      const w = f.contentWindow, d = f.contentDocument;
      if (/DEV|private test/.test(d.title)) throw 'DEV page';
      const re = /<source media="\(min-width:481px\)" srcset="([^" ]+-w(\d+)\.webp)">/g;
      let done = false;
      for (const rec of d.querySelectorAll('.record')) {
        if (rec.getAttribute('off') === 'y') continue;
        const el = rec.querySelector('pre code'); if (!el) continue;
        const old = el.textContent, m = old.match(re);
        if (!m) continue;
        if (m.length !== 1) throw 'sources x' + m.length;
        const [, src, wd] = re.exec(old); re.lastIndex = 0;
        if (+wd >= 1680) { window.__hs.push(pid + ': already ' + wd); done = true; break; }
        const c = old.replace(m[0], '<source media="(min-width:481px)" srcset="' + src + ' ' + wd + 'w, ' + orig + ' 1680w" sizes="100vw">');
        if (c.length !== old.length + (' ' + wd + 'w, ' + orig + ' 1680w" sizes="100vw').length) throw 'integrity';
        await bak('live-' + pid + '-' + rec.getAttribute('recordid') + '-before-herosrcset-20261116', old);
        const r = await w.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(pid), recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: c } });
        if (JSON.stringify(r) !== '"OK"') throw 'save ' + JSON.stringify(r).slice(0, 60);
        const p = await w.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(pid), csrf: w.getCSRF(), returnjson: 'yes' } });
        window.__hs.push(pid + ': ' + wd + 'w + 1680w ' + (JSON.stringify(p).includes('publishonepage') ? 'pub' : 'PUBLISH?'));
        done = true; break;
      }
      if (!done) window.__hs.push(pid + ': no desktop source found');
    } catch (e) { window.__hs.push(pid + ': ERR ' + e); } finally { if (f) f.remove(); }
  }
  window.__hs.push('DONE');
};
