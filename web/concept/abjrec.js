/* abjRec(pid, tf, tag, dry): run tf(oldCode) on every record of a Tilda page; tf returns new code, null (skip) or throws.
   Backs up each changed record in IndexedDB abj_svc_bak (key <live|dev>-<pid>-<rec>-before-<tag>), saves, then publishes the page once.
   window.__devOnly = true: refuse live pages (and the other way round). Results in window.__r. Run from a Tilda editor tab. */
window.__r = [];
window.abjRec = async function (pid, tf, tag, dry) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const bak = (key, val) => new Promise((res, rej) => { const q = indexedDB.open('abj_svc_bak');
    q.onupgradeneeded = () => { q.result.createObjectStore('b'); };
    q.onsuccess = () => { const db = q.result, st = db.transaction(db.objectStoreNames[0], 'readwrite').objectStore(db.objectStoreNames[0]);
      const p = st.put(val, key); p.onsuccess = () => res(); p.onerror = () => rej(p.error); }; q.onerror = () => rej(q.error); });
  let f;
  try {
    f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:800px';
    f.src = '/page/?pageid=' + pid + '&projectid=6121364'; document.body.appendChild(f);
    let ok = false;
    for (let i = 0; i < 80 && !ok; i++) { await W(500); try { ok = !!f.contentDocument.querySelector('.record pre code'); } catch (e) {} }
    if (!ok) throw 'no records'; await W(1500);
    const w = f.contentWindow, d = f.contentDocument, isDev = /DEV|private test/.test(d.title);
    if (window.__devOnly && !isDev) throw 'not DEV';
    if (!window.__devOnly && isDev) throw 'DEV page';
    let n = 0;
    for (const rec of d.querySelectorAll('.record')) {
      if (rec.getAttribute('off') === 'y') continue;
      const el = rec.querySelector('pre code'); if (!el) continue;
      const old = el.textContent; let c;
      try { c = tf(old, rec.getAttribute('recordid')); } catch (e) { throw (e && e.message) || e; }
      if (c == null || c === old) continue;
      n++;
      if (dry) { window.__r.push(pid + ' rec ' + rec.getAttribute('recordid') + ' DRY ' + old.length + '->' + c.length); continue; }
      await bak((isDev ? 'dev-' : 'live-') + pid + '-' + rec.getAttribute('recordid') + '-before-' + tag, old);
      const r = await w.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(pid), recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: c } });
      if (JSON.stringify(r) !== '"OK"') throw 'save ' + JSON.stringify(r).slice(0, 60);
    }
    if (n && !dry) {
      const p = await w.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(pid), csrf: w.getCSRF(), returnjson: 'yes' } });
      window.__r.push(pid + ': ' + n + ' rec saved ' + (JSON.stringify(p).includes('publishonepage') ? 'pub' : 'PUBLISH?'));
    } else if (!n) window.__r.push(pid + ': nothing matched');
  } catch (e) { window.__r.push(pid + ': ERR ' + e); } finally { if (f) f.remove(); }
};
/* abjCode(pid): returns {recordid: code} for a page (read only). */
window.abjCode = async function (pid) {
  const W = ms => new Promise(r => setTimeout(r, ms)); const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:800px'; f.src = '/page/?pageid=' + pid + '&projectid=6121364'; document.body.appendChild(f);
  for (let i = 0; i < 80; i++) { await W(500); try { if (f.contentDocument.querySelector('.record pre code')) break; } catch (e) {} }
  await W(1500); const out = { _title: f.contentDocument.title };
  f.contentDocument.querySelectorAll('.record').forEach(r => { const c = r.querySelector('pre code'); if (c) out[r.getAttribute('recordid') + (r.getAttribute('off') === 'y' ? '_off' : '')] = c.textContent; });
  f.remove(); return out;
};
