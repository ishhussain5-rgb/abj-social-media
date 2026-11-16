/* abjHeroPic(jobs, dry): swap a plain hero <img class="hi"> that is smaller than the screen for a <picture> with a full-size
   desktop photo and a phone crop (16 Nov 2026). Same markup as the kitchen cost hero:
   <picture style="display:contents"><source media="(min-width:481px)" srcset="D"><img width W height H data-wh class="hi" src="M" ...rest></picture>
   The alt text and every other attribute of the old <img> are kept. Optional cap: new text for <span class="cap">.
   jobs = [{pid, match, d, m, w, h, cap}]. Backup in IndexedDB abj_svc_bak, key live-<pid>-<rec>-before-heropic-20261116.
   Run from a Tilda editor tab; poll window.__hp. */
window.__hp = [];
window.abjHeroPic = async function (jobs, dry) {
  const W = ms => new Promise(r => setTimeout(r, ms));
  const bak = (key, val) => new Promise((res, rej) => { const q = indexedDB.open('abj_svc_bak'); q.onupgradeneeded = () => { q.result.createObjectStore('b'); };
    q.onsuccess = () => { try { const db = q.result, st = db.transaction(db.objectStoreNames[0], 'readwrite').objectStore(db.objectStoreNames[0]);
      const p = st.put(val, key); p.onsuccess = () => res(); p.onerror = () => rej(p.error); } catch (e) { rej(e); } }; q.onerror = () => rej(q.error); });
  const clean = s => s.replace(/https?:\/\/[^"' ]+\//g, 'U/').replace(/[?&=]/g, '~');
  for (const j of jobs) {
    let f;
    try {
      f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:800px';
      f.src = '/page/?pageid=' + j.pid + '&projectid=6121364'; document.body.appendChild(f);
      let ok = false;
      for (let i = 0; i < 80 && !ok; i++) { await W(500); try { ok = !!f.contentDocument.querySelector('.record pre code'); } catch (e) {} }
      if (!ok) throw 'no records'; await W(1500);
      const w = f.contentWindow, d = f.contentDocument;
      if (/DEV|private test/.test(d.title)) throw 'DEV page';
      let done = false;
      for (const rec of d.querySelectorAll('.record')) {
        if (rec.getAttribute('off') === 'y') continue;
        const el = rec.querySelector('pre code'); if (!el) continue;
        const old = el.textContent;
        const tags = (old.match(/<img\b[^>]*class="hi"[^>]*>/g) || []).filter(t => t.includes(j.match));
        if (!tags.length) continue;
        if (tags.length !== 1) throw 'hero imgs x' + tags.length;
        const t = tags[0];
        if (old.split(t).length !== 2) throw 'tag not unique';
        if (/<picture/.test(old.slice(Math.max(0, old.indexOf(t) - 200), old.indexOf(t)))) throw 'already a picture';
        const rest = t.replace(/^<img\b/, '').replace(/\s(width|height)="\d+"/g, '').replace(/\sdata-wh(="")?/, '').replace(/\sclass="hi"/, '').replace(/\ssrc="[^"]*"/, '').replace(/\s*\/?>$/, '');
        const nt = '<picture style="display:contents"><source media="(min-width:481px)" srcset="' + j.d + '"><img width="' + j.w + '" height="' + j.h + '" data-wh class="hi" src="' + j.m + '"' + rest + (/fetchpriority/.test(rest) ? '' : ' fetchpriority="high"') + '></picture>';
        let c = old.replace(t, nt), capOld = '';
        const sec = c.slice(c.indexOf(nt));
        const cm = sec.match(/<span class="cap">([^<]*)<\/span>/);
        if (cm) capOld = cm[1];
        if (j.cap && cm && sec.indexOf(cm[0]) < 3000) c = c.replace(cm[0], '<span class="cap">' + j.cap + '</span>');
        if (dry) { window.__hp.push(j.pid + ' DRY old: ' + clean(t) + '\n  cap: ' + capOld + '\n  new: ' + clean(nt)); done = true; break; }
        await bak('live-' + j.pid + '-' + rec.getAttribute('recordid') + '-before-heropic-20261116', old);
        const r = await w.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(j.pid), recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: c } });
        if (JSON.stringify(r) !== '"OK"') throw 'save ' + JSON.stringify(r).slice(0, 60);
        const p = await w.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(j.pid), csrf: w.getCSRF(), returnjson: 'yes' } });
        window.__hp.push(j.pid + ': picture ' + (JSON.stringify(p).includes('publishonepage') ? 'pub' : 'PUBLISH?') + (j.cap ? ' cap "' + capOld + '" -> "' + j.cap + '"' : ''));
        done = true; break;
      }
      if (!done) window.__hp.push(j.pid + ': hero not found');
    } catch (e) { window.__hp.push(j.pid + ': ERR ' + e); } finally { if (f) f.remove(); }
  }
  window.__hp.push('DONE');
};
