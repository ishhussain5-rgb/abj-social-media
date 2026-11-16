/* abjFoot3(pids, live, opts): one pass per page, add-only footer links + swap the clickable info@ links for the booking form.
   opts.links (default true): add "Media wall project" after Case study, "Budget planner" after Finance / Finance options,
   "Kitchen fitters" after Kitchen design, in the footer, skipping any already present.
   opts.mail (default true): <a href="mailto:info@...">Email us</a> -> "Send an enquiry" and menu "Email" -> "Enquire", both to the booking form.
   Nothing else changes; JSON-LD and body text mentions of the address are left alone. Backup of each record before saving in IndexedDB abj_svc_bak.
   Run from a Tilda editor tab; poll window.__f3 for progress. */
window.__f3 = [];
window.abjFoot3 = async function (pids, live, opts) {
  opts = Object.assign({ links: true, mail: true }, opts || {});
  const S = live ? '' : 'dev';
  const H = live
    ? { mw: '/project-media-walls-park-road-peterborough', bp: '/budget-planner', kf: '/kitchen-fitters-peterborough', bk: '/bookingform' }
    : { mw: '/project-media-walls-park-road-peterborough-dev-p4r7', bp: '/budget-planner-dev-p6k3', kf: '/kitchen-fitters-peterborough-dev-f5t8', bk: '/bookingform-dev-k9b4' };
  const LINKS = [
    [/(<li><a href="[^"]*">(?:Case study|Projects)<\/a><\/li>)/g, '<li><a href="' + H.mw + '">Media wall project</a></li>', '>Media wall project<'],
    [/(<li><a href="[^"]*">Finance(?: options)?<\/a><\/li>)/g, '<li><a href="' + H.bp + '">Budget planner</a></li>', '>Budget planner<'],
    [/(<li><a href="[^"]*">Kitchen design<\/a><\/li>)/g, '<li><a href="' + H.kf + '">Kitchen fitters</a></li>', '>Kitchen fitters<']];
  const MAIL = [
    [/<a href="mailto:info@abjkitchensandbedrooms\.co\.uk"([^>]*)>Email us<\/a>/g, '<a href="' + H.bk + '"$1>Send an enquiry</a>'],
    [/<a href="mailto:info@abjkitchensandbedrooms\.co\.uk"([^>]*)>Email<\/a>/g, '<a href="' + H.bk + '"$1>Enquire</a>']];
  const W = ms => new Promise(r => setTimeout(r, ms));
  const bak = (key, val) => new Promise((res, rej) => { const q = indexedDB.open('abj_svc_bak'); q.onupgradeneeded = () => { q.result.createObjectStore('b'); };
    q.onsuccess = () => { try { const db = q.result, st = db.transaction(db.objectStoreNames[0], 'readwrite').objectStore(db.objectStoreNames[0]);
      const p = st.put(val, key); p.onsuccess = () => res(); p.onerror = () => rej(p.error); } catch (e) { rej(e); } }; q.onerror = () => rej(q.error); });
  for (const pid of pids) {
    let f; const out = [];
    try {
      f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:800px';
      f.src = '/page/?pageid=' + pid + '&projectid=6121364'; document.body.appendChild(f);
      let ok = false;
      for (let i = 0; i < 80 && !ok; i++) { await W(500); try { ok = !!f.contentDocument.querySelector('.record pre code'); } catch (e) {} }
      if (!ok) throw 'no records';
      await W(1500);
      const w = f.contentWindow, d = f.contentDocument, title = d.title.replace('Tilda: ', '').slice(0, 30);
      if (live && /DEV|private test/.test(d.title)) throw 'DEV page in live list';
      if (!live && !/DEV|private test/.test(d.title)) throw 'live page in DEV list';
      let saved = 0;
      for (const rec of d.querySelectorAll('.record')) {
        if (rec.getAttribute('off') === 'y') continue;
        const el = rec.querySelector('pre code'); if (!el) continue;
        const old = el.textContent; let c = old;
        if (opts.links && c.includes('class="ft"')) {
          const fi = c.indexOf('class="ft"');
          let head = c.slice(0, fi), ft = c.slice(fi);
          for (const [re, li, lab] of LINKS) {
            if (ft.includes(lab)) { out.push('has'); continue; }
            const n = (ft.match(re) || []).length;
            if (n !== 1) { out.push('anchor x' + n + ' ' + lab.slice(1, 8)); continue; }
            ft = ft.replace(re, '$1' + li); out.push('+' + lab.slice(1, 7));
          }
          c = head + ft;
        }
        if (opts.mail) for (const [re, rep] of MAIL) { const n = (c.match(re) || []).length; if (n) { c = c.replace(re, rep); out.push('mail' + n); } }
        if (c === old) continue;
        // integrity: removing the new parts must give back the old code, apart from the mailto swaps
        // integrity: strip the new links and undo the mailto swap on both sides; they must then match exactly
        const norm = x => { for (const [, li] of LINKS) x = x.split(li).join('');
          return x.split('href="' + H.bk + '"').join('href="mailto:info@abjkitchensandbedrooms.co.uk"').split('>Send an enquiry</a>').join('>Email us</a>').split('>Enquire</a>').join('>Email</a>'); };
        if (norm(c) !== norm(old)) throw 'integrity';
        if (window.__f3dry) { out.push('DRY'); continue; }
        await bak((live ? 'live-' : 'dev-') + pid + '-' + rec.getAttribute('recordid') + '-before-foot3-20261116', old);
        const r = await w.tp__fetch({ url: '/page/submit/', body: { comm: 'saverecord', pageid: String(pid), recordid: rec.getAttribute('recordid'), onlythisfield: 'code', code: c } });
        if (JSON.stringify(r) !== '"OK"') throw 'save ' + JSON.stringify(r).slice(0, 60);
        saved++;
      }
      if (saved) { const p = await w.tp__fetch({ url: '/page/publish/', body: { comm: 'pagepublish', pageid: String(pid), csrf: w.getCSRF(), returnjson: 'yes' } });
        if (!JSON.stringify(p).includes('publishonepage')) throw 'publish ' + JSON.stringify(p).slice(0, 80); out.push('pub'); }
      window.__f3.push(pid + ' ' + title + ': ' + (out.join(',') || 'nothing to change'));
    } catch (e) { window.__f3.push(pid + ': ERR ' + e + ' ' + out.join(',')); } finally { if (f) f.remove(); }
  }
  window.__f3.push('DONE');
};
